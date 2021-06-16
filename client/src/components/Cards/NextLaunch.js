import React, {Component}  from "react";
import SpaceXService from "../../services/SpaceXService";
import {Card, Image, Tag} from "antd";
import moment from 'moment';
import { Statistic, Row, Col, message, Tooltip } from 'antd';
import LinksHandler from "./LinksHandler";
import {handleResponseError} from "../../actions/auth";
import GoogleCalendarButton from "../SingleComponents/GoogleCalendarButton";
const { Countdown } = Statistic;


export default class NextLaunch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: undefined,
            details: undefined,
            date: undefined,
            image: undefined,
            youtube: undefined,
            reddit: undefined,
            wikipedia: undefined,
            launchpad_id: undefined,
            loading: true
        };
        this.linksHandler = new LinksHandler();
    }

    componentDidMount() {
        SpaceXService.getNextLaunch().then(
            response => {
                let data = response.data.docs[0];
                this.setState({
                    name: data.name,
                    details: data.details,
                    date: moment.unix(data.date_unix),
                    image: data.links.patch.small,
                    youtube: data.links.webcast,
                    reddit: data.links.reddit.campaign,
                    wikipedia: data.links.wikipedia,
                    launchpad_id: data.launchpad,
                    loading: false
                });
            },
            error => handleResponseError(error)
        );
    }

    onFinish = () => {
        message.info('We have a lift off!');
    }

    render() {
        return (
                <Card
                    title={
                        <span className={'regular-card-title'}>
                            Next launch: {this.state.name}
                        </span>
                    }
                    cover={<Image src={this.state.image ? this.state.image: "/spacex_logo.jpg"} />}
                    loading={this.state.loading}>
                    <Row gutter={16}>
                        <Col span={24} style={{ marginBottom: 20 }}>
                            {this.linksHandler.renderLinks(this.state.youtube, this.state.reddit, this.state.wikipedia)}
                        </Col>
                        <Col span={14} style={{ marginBottom: 20 }}>
                            <div className={'ant-statistic-title'}>Next launch date: </div>
                            {this.state.date && this.state.date.format("DD-MM-YYYY HH:mm:ss")}
                        </Col>
                        <Col span={10}>
                            {this.state.details &&
                            <Tooltip placement="bottom" title={this.state.details}>
                                <Tag color="#1890ff" style={{float: 'right'}} >Details</Tag>
                            </Tooltip>}
                        </Col>
                        <Col span={12}>
                            <Countdown title="Countdown" value={this.state.date} onFinish={this.onFinish} />
                        </Col>
                        <Col span={12}>
                            <Countdown title="In Milliseconds" value={this.state.date} format="HH:mm:ss:SSS" />
                        </Col>
                        <Col span={24} style={{ marginTop: 20 }}>
                            <Countdown title="In Days" value={this.state.date} format="DD / HH / mm / ss " />
                            <div style={{fontSize: '10px', color: 'rgba(0, 0, 0, 0.45)'}}>
                                days / hours / minutes / seconds
                            </div>
                        </Col>

                        <Col span={24}>
                            <div className={'center-calender-button'}>
                                <GoogleCalendarButton
                                    title={`SpaceX Launch: ${this.state.name}`}
                                    location={this.state.launchpad_id}
                                    description={''}
                                    start={this.state.date}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card>
        );
    }
}
