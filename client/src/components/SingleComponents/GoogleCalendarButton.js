import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import {Button, message, Tooltip} from "antd";
import SpaceXService from "../../services/SpaceXService";
import {handleResponseError} from "../../actions/auth";
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;


class GoogleCalendarButton extends Component {
    DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    SCOPES = "https://www.googleapis.com/auth/calendar.events"
    TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

    constructor(props) {
        super(props);
        let [start, end] = this.setDate();

        this.state = {
            title: this.props.title ? this.props.title : '',
            location: this.props.location ? this.props.location : '',
            description: this.props.description ? this.props.description : '',
            start: start,
            end: end,
            float: this.props.float ? this.props.float : undefined,
            smallIcon: this.props.smallIcon ? this.props.smallIcon : false
        }
    }

    checkIfLaunchAdded = async () => {
        let added = false;
        await window.gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': this.state.start.utc().format(),
            'timeMax': this.state.end.utc().format(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(response => {
            const events = response.result.items;
            events.map(event => {
                if (event.summary === this.state.title) {
                    message.error('Launch already has been added to your calendar!');
                    added = true;
                }
            })
        })
        return added;
    }

    setLocation = async () => {
        let location = '';
        if (this.state.location) await SpaceXService.getLaunchpadLocationById(this.state.location).then(
            response => {
                let data = response.data.docs[0];
                location = `${data.full_name}, ${data.locality}, ${data.region}`
            },
            error => handleResponseError(error)
        )
        return location;
    }

    setDate = () => {
        let start = this.props.start ? new Date(this.props.start) : '';
        let end = this.props.start ? new Date(this.props.start) : '';
        if (end) end.setHours(end.getHours() + 2);
        return [moment(start), moment(end)];
    }

    initClient = () => {
        window.gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            clientId: GOOGLE_CLIENT_ID,
            discoveryDocs: this.DISCOVERY_DOCS,
            scope: this.SCOPES,
        })
    }

    setEvent = (location) => {
        let event = {
            'summary': this.state.title,
            'location': location,
            'description': this.state.description,
            'start': {
                'dateTime': this.state.start,
                'timeZone': this.TIME_ZONE
            },
            'end': {
                'dateTime': this.state.end,
                'timeZone': this.TIME_ZONE
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10}
                ]
            }
        }

        return window.gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event,
        })
    }

    handleClick = async () => {
        let location = await this.setLocation();
        window.gapi.load('client:auth2', () => {
            this.initClient();
            window.gapi.client.load('calendar', 'v3');
            window.gapi.auth2.getAuthInstance().signIn()
                .then(async () => {
                    let added = await this.checkIfLaunchAdded();
                    if (!added) {
                        let request = this.setEvent(location);
                        request.execute(event => {
                            window.open(event.htmlLink);
                        });
                    }
                })
        })
    }

    renderButton = () => {
        return <Button
            icon={<PlusOutlined/>}
            disabled={!this.props.start}
            onClick={this.handleClick}
            size={'small'}
            style={{float: this.state.float}}
            type={this.state.smallIcon && "primary"}
            shape={this.state.smallIcon && "circle"}
        >
            {!this.state.smallIcon && "Add to Google Calendar"}
        </Button>
    }

    render() {
        const {user: currentUser} = this.props;

        if (!currentUser) {
            return <Redirect to="/login"/>;
        }

        return (
            <div>
                {
                    this.state.smallIcon ?
                        <Tooltip title={'Add to Google Calendar'}>
                            {this.renderButton()}
                        </Tooltip>:
                        this.renderButton()
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user,
    };
}

export default connect(mapStateToProps)(GoogleCalendarButton);