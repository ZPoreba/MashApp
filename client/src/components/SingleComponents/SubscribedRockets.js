import React, {Component} from "react";
import {Button, Collapse, Empty, Tag, Timeline, Tooltip} from "antd";
import SpaceXService from "../../services/SpaceXService";
import {handleResponseError} from "../../actions/auth";
import {ClockCircleOutlined} from "@ant-design/icons";
import moment from "moment";
import UserService from "../../services/UserService";
import GoogleCalendarButton from "./GoogleCalendarButton";
const { Panel } = Collapse;


export default class SubscribedRockets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            subscribedRockets: props.subscribedRockets,
            rocketMapping: []
        }
    }

    componentDidMount() {
        SpaceXService.getNamesForRockets(Object.keys(this.state.subscribedRockets)).then(
            response => this.setState({rocketMapping: response.data.docs}),
            error => handleResponseError(error)
        )
    }

    getRocketName = (rocket) => {
        let found = this.state.rocketMapping ? this.state.rocketMapping.find(element => element.id === rocket): undefined;
        if (found) return found.name;
    }

    unsubscribe = (id) => {
        UserService.deleteSubscribedRocket(id).then(
            response => {
                const user = JSON.parse(localStorage.getItem("user"));
                const subscribedRockets = this.state.subscribedRockets;
                user.user.subscribed_rockets = response.data.subscribed_rockets;
                localStorage.setItem("user", JSON.stringify(user));
                delete subscribedRockets[id];
                this.setState({subscribedRockets: subscribedRockets});
            },
            error => handleResponseError(error)
        )
    }

    render () {
        return <div>
            <p className={'regular-card-title'}>Upcoming launches for subscribed rockets</p>
            <Collapse ghost>
                {
                    Object.entries(this.state.subscribedRockets).length ?
                        Object.entries(this.state.subscribedRockets).map(
                            ([rocket, launches], index) =>
                                <Panel
                                    key={index}
                                    header={
                                        <div>
                                            <div style={{width: 'max-content', display: 'inline-block', marginRight: 20}}>
                                                {this.getRocketName(rocket)}
                                            </div>
                                            <Button
                                                type={'primary'}
                                                size={'small'}
                                                onClick={() => this.unsubscribe(rocket)} danger>
                                                Unsubscribe
                                            </Button>
                                        </div>
                                    }>
                                    <Timeline mode="alternate">
                                        {
                                            launches.map((launch, launch_index) =>
                                                <Timeline.Item
                                                    key={launch_index}
                                                    dot={launch_index === 0 &&
                                                    <ClockCircleOutlined style={{ fontSize: '16px' }}/>}
                                                >
                                                    <div style={{marginBottom: 10}}>
                                                        <GoogleCalendarButton
                                                            title={`SpaceX Launch: ${launch.name}`}
                                                            location={launch.launchpad}
                                                            description={launch.details}
                                                            start={moment.unix(launch.date_unix)}
                                                            smallIcon={true}
                                                        />
                                                    </div>
                                                    <Tooltip title={launch.details}>
                                                        <span style={{marginRight: 10}}>{launch.name}</span>
                                                    </Tooltip>
                                                    <Tag color="#1890ff">
                                                        {moment
                                                            .unix(launch.date_unix)
                                                            .format("DD-MM-YYYY HH:mm:ss")}
                                                    </Tag>
                                                </Timeline.Item>)
                                        }
                                    </Timeline>
                                </Panel>
                        ): <div className={'center-content'}>No available subscriptions</div>
                }
            </Collapse>
        </div>
    }
}
