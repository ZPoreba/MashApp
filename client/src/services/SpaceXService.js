import axios from "axios";
import authHeader from "./AuthHeader";
const API_URL = process.env.REACT_APP_API_URL;

class SpaceXService {

    launchSelectData = {
        "name": 1,
        "links": 1,
        "details": 1,
        "date_unix": 1,
        "launchpad": 1
    }

    getNextLaunch() {
        let data = JSON.stringify({
            "query": {"upcoming": true},
            "options": {
                "select": this.launchSelectData,
                "sort": {
                    "date_unix": "asc"
                },
                "limit": "1",
            }
        });

        return axios.post('https://api.spacexdata.com/v4/launches/query', data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getLatestLaunch() {
        let data = JSON.stringify({
            "query": {"upcoming": false},
            "options": {
                "select": this.launchSelectData,
                "sort": {
                    "date_unix": "desc"
                },
                "limit": "1"
            }
        });

        return axios.post('https://api.spacexdata.com/v4/launches/query', data, {
            headers: {'Content-Type': 'application/json'}
        });

    }

    getUpcomingLaunches() {
        let data = JSON.stringify({
            "query": {"upcoming": true},
            "options": {
                "select": this.launchSelectData,
                "sort": {
                    "date_unix": "asc"
                },
                "pagination": false
            }
        });

        return axios.post('https://api.spacexdata.com/v4/launches/query', data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getExecutedLaunches() {
        let data = JSON.stringify({
            "query": {"upcoming": false},
            "options": {
                "select": this.launchSelectData,
                "sort": {
                    "date_unix": "desc"
                },
                "pagination": false
            }
        });

        return axios.post('https://api.spacexdata.com/v4/launches/query', data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getLaunchpadLocationById(id) {
        let data = JSON.stringify({
            "query": {"_id": id},
            "options": {
                "select": {
                    "locality": 1,
                    "full_name": 1,
                    "region": 1
                },
                "pagination": false
            }
        });

        return axios.post('https://api.spacexdata.com/v4/launchpads/query', data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getActualStarlinkPositions() {
        return axios.get(`${API_URL}api/state/starlink/positions/`, { headers: authHeader() });
    }

    getResources() {
        return axios.get(`${API_URL}api/state/resources/`, { headers: authHeader() });
    }

    getRocketById(id) {
        let data = JSON.stringify({
            "query": {
                "_id": id
            },
            "options": {
                "pagination": false
            }
        });

        return axios.post('https://api.spacexdata.com/v4/rockets/query', data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getRocketLaunchesById(id) {
        let data = JSON.stringify({
            "query": {
                "rocket": id
            },
            "options": {
                "select": this.launchSelectData,
                "pagination": false
            }
        });

        return axios.post('https://api.spacexdata.com/v4/launches/query', data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getActualRocketLaunchById(id, type) {
        let upcoming = (type === 'next');
        let date_sort = upcoming ? 'asc': 'desc';
        let data = JSON.stringify({
            "query": {
                "rocket": id,
                "upcoming": upcoming
            },
            "options": {
                "select": this.launchSelectData,
                "sort": {
                    "date_unix": date_sort
                },
                "limit": "1"
            }
        });

        return axios.post('https://api.spacexdata.com/v4/launches/query', data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getCapsuleById(id) {
        let data = JSON.stringify({
            "query": {
                "_id": id
            },
            "options": {
                "pagination": false
            }
        });

        return axios.post('https://api.spacexdata.com/v4/dragons/query', data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getPadById(id, type) {
        let data = JSON.stringify({
            "query": {
                "_id": id
            },
            "options": {
                "pagination": false
            }
        });

        return axios.post(`https://api.spacexdata.com/v4/${type}/query`, data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getUpcomingLaunchesForRockets(rockets) {
        let data = JSON.stringify({
            "query": {
                "rocket": {
                    "$in": rockets
                },
                "upcoming": true
            },
            "options": {
                "pagination": false,
                "select": {rocket: 1, ...this.launchSelectData},
                "sort": {
                    "date_unix": "asc"
                }
            }
        });

        return axios.post("https://api.spacexdata.com/v4/launches/query", data, {
            headers: {'Content-Type': 'application/json'}
        });
    }

    getNamesForRockets(rockets) {
        let data = JSON.stringify({
            "query": {
                "_id": {
                    "$in": rockets
                }
            },
            "options": {
                "pagination": false,
                "select": {name: 1},
            }
        });

        return axios.post("https://api.spacexdata.com/v4/rockets/query", data, {
            headers: {'Content-Type': 'application/json'}
        });
    }
}

export default new SpaceXService();