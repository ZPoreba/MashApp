from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from skyfield.api import wgs84, load
import math
import json
import time
from django.http import StreamingHttpResponse
from django.contrib.auth import get_user_model
import requests as django_requests
from server.StateHandler.threads import ResultThread

User = get_user_model()


def get_actual_starlink_data(satellites):
    ts = load.timescale()
    t = ts.now()
    results = []

    for satellite in satellites:
        geometry = satellite.at(t)
        subpoint = wgs84.subpoint(geometry)
        latitude = subpoint.latitude
        longitude = subpoint.longitude
        if not math.isnan(latitude.degrees) or not math.isnan(longitude.degrees):
            results.append([longitude.degrees, latitude.degrees, satellite.name])
    return results


def starlink_data_stream(request):
    satellites = load.tle_file('https://www.celestrak.com/NORAD/elements/starlink.txt')
    def event_stream():
        while True:
            results = get_actual_starlink_data(satellites)
            time.sleep(1)
            data = {"positions": results}
            yield 'data: %s\n\n' % str(json.dumps(data))
    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')


class MockView(APIView):

    def get(self, request):
        content = {'Mock data!'}
        return Response(content)


class PublicMockView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        return Response('Public mock data!')


class StarlinkView(APIView):

    def get(self, request):
        satellites = load.tle_file('https://www.celestrak.com/NORAD/elements/starlink.txt')
        results = get_actual_starlink_data(satellites)
        return Response({'positions': results}, status=200)


class SubscriptionView(APIView):

    def post(self, request):
        rocket_id = request.data.get('id', '')
        if rocket_id not in request.user.subscribed_rockets:
            request.user.subscribed_rockets.append(rocket_id)
            request.user.save()
            status = "Rocket launches subscribed successfully"
        else:
            status = "Rocket launches already subscribed"
        return Response({'status': status, 'subscribed_rockets': request.user.subscribed_rockets})

    def delete(self, request, rocket_id):
        if rocket_id in request.user.subscribed_rockets:
            request.user.subscribed_rockets.remove(rocket_id)
            request.user.save()
        status = "Rocket subscription has been deleted"
        return Response({'status': status, 'subscribed_rockets': request.user.subscribed_rockets})


class DashboardView(APIView):

    def get_rockets(self):
        rockets_body = {
            "options": {
                "select": {
                    "name": 1,
                    "active": 1,
                    "first_flight": 1,
                    "success_rate_pct": 1,
                    "cost_per_launch": 1,
                    "height": 1,
                    "mass": 1
                },
                "pagination": False
            }
        }
        rockets_thread = ResultThread(django_requests.post, ('https://api.spacexdata.com/v4/rockets/query', rockets_body))
        rockets_thread.start()
        return rockets_thread

    def get_crew(self):
        crew_body = {
            "options": {
                "select": {
                    "name": 1,
                    "image": 1,
                    "wikipedia": 1,
                    "launches": 1
                },
                "pagination": False
            }
        }
        crew_thread = ResultThread(django_requests.post, ('https://api.spacexdata.com/v4/crew/query', crew_body))
        crew_thread.start()
        return crew_thread

    def get_past_launches(self):
        past_launches_body = {
            "query": {"upcoming": False},
            "options": {
                "select": {
                    "name": 1,
                    "date_unix": 1,
                    "links": 1,
                    "details": 1,
                    "crew": 1,
                    "success": 1
                },
                "pagination": False
            }
        }
        past_launches_thread = ResultThread(django_requests.post, ('https://api.spacexdata.com/v4/launches/query', past_launches_body))
        past_launches_thread.start()
        return past_launches_thread

    def get_launchpads(self):
        launchpads_body = {
            "options": {
                "select": {
                    "name": 1,
                    "launch_attempts": 1,
                    "launch_successes": 1,
                    "status": 1
                },
                "pagination": False
            }
        }
        launchpads_thread = ResultThread(django_requests.post, ('https://api.spacexdata.com/v4/launchpads/query', launchpads_body))
        launchpads_thread.start()
        return launchpads_thread

    def get_landpads(self):
        landpads_body = {
            "options": {
                "select": {
                    "name": 1,
                    "landing_attempts": 1,
                    "landing_successes": 1,
                    "status": 1
                },
                "pagination": False
            }
        }
        landpads_thread = ResultThread(django_requests.post, ('https://api.spacexdata.com/v4/landpads/query', landpads_body))
        landpads_thread.start()
        return landpads_thread

    def get(self, request):
        data = {}

        rockets_thread = self.get_rockets()
        crew_thread = self.get_crew()
        past_launches_thread = self.get_past_launches()
        launchpads_thread = self.get_launchpads()
        landpads_thread = self.get_landpads()

        rockets = rockets_thread.get_result()
        crew = crew_thread.get_result()
        past_launches = past_launches_thread.get_result()
        launchpads = launchpads_thread.get_result()
        landpads = landpads_thread.get_result()

        if rockets.status_code == 200:
            data['rockets'] = rockets.json()['docs']
        if crew.status_code == 200:
            data['crew'] = crew.json()['docs']
        if past_launches.status_code == 200:
            data['past_launches'] = past_launches.json()['docs']
        if launchpads.status_code == 200:
            data['launchpads'] = launchpads.json()['docs']
        if landpads.status_code == 200:
            data['landpads'] = landpads.json()['docs']
        return Response(data)


class ResourcesView(APIView):
    rocket_or_capsule_select_data = {
        "name": 1,
        "wikipedia": 1,
        "flickr_images": 1,
        "description": 1,
        "active": 1,
        "type": 1
    }

    pad_select_data = {
        "full_name": 1,
        "wikipedia": 1,
        "locality": 1,
        "region": 1,
        "details": 1,
        "status": 1
    }

    def get_rockets_or_capsules(self, url):
        request_body = {
            "options": {
                "select": self.rocket_or_capsule_select_data,
                "pagination": False
            }
        }
        request_thread = ResultThread(django_requests.post, (url, request_body))
        request_thread.start()
        return request_thread

    def get_pads(self, url, pad_type):
        additional_field_dict = {"launch_successes": 1} if pad_type == 'launchpads' else {"landing_successes": 1}
        request_body = {
            "options": {
                "select": {**self.pad_select_data, **additional_field_dict},
                "pagination": False
            }
        }
        request_thread = ResultThread(django_requests.post, (url, request_body))
        request_thread.start()
        return request_thread

    def set_title(self, item):
        item['title'] = item['full_name'] if 'full_name' in item.keys() else item['name'] + " " + item['type'].capitalize()
        return item

    def get(self, request):
        data = []
        rockets_thread = self.get_rockets_or_capsules('https://api.spacexdata.com/v4/rockets/query')
        capsules_thread = self.get_rockets_or_capsules('https://api.spacexdata.com/v4/dragons/query')
        launchpads_thread = self.get_pads('https://api.spacexdata.com/v4/landpads/query', 'launchpads')
        landpads_thread = self.get_pads('https://api.spacexdata.com/v4/launchpads/query', 'launchpads')

        rockets = rockets_thread.get_result()
        capsules = capsules_thread.get_result()
        launchpads = launchpads_thread.get_result()
        landpads = landpads_thread.get_result()

        if rockets.status_code == 200:
            data.extend([self.set_title(rocket) for rocket in rockets.json()['docs']])
        if capsules.status_code == 200:
            data.extend([self.set_title(capsule) for capsule in capsules.json()['docs']])
        if launchpads.status_code == 200:
            data.extend([self.set_title(launchpad) for launchpad in launchpads.json()['docs']])
        if landpads.status_code == 200:
            data.extend([self.set_title(landpad) for landpad in landpads.json()['docs']])
        return Response(data)
