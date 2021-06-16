import React, {Component}  from "react";
import SpaceXService from "../../services/SpaceXService";
import {Card, Image} from "antd";
import moment from 'moment';
import { Row, Col } from 'antd';
import YouTube from "react-youtube";
import LinksHandler from "./LinksHandler";
import {handleResponseError} from "../../actions/auth";


export default class LatestLaunch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: undefined,
            date: undefined,
            image: undefined,
            youtube: undefined,
            reddit: undefined,
            wikipedia: undefined,
            details: undefined,
            loading: true
        };
        this.linksHandler = new LinksHandler();
    }

    componentDidMount() {
        SpaceXService.getLatestLaunch().then(
            response => {
                let data = response.data.docs[0];
                this.setState({
                    name: data.name,
                    date: moment.unix(data.date_unix),
                    image: data.links.patch.small,
                    youtube: data.links.webcast,
                    youtube_id: data.links.youtube_id,
                    reddit: data.links.reddit.campaign,
                    wikipedia: data.links.wikipedia,
                    details: data.details,
                    loading: false
                });
            },
            error => handleResponseError(error)
        );
    }

    render() {
        return (
            <Card
                title={
                    <span className={'regular-card-title'}>
                            Latest launch: {this.state.name}
                        </span>
                }
                loading={this.state.loading}>
                <Row className={'video-iframe'} gutter={[16, 32]}>
                    <Col span={24} className={'video-div'}>
                        <YouTube videoId={this.state.youtube_id} />
                    </Col>
                    <Col span={12}>
                        {this.linksHandler.renderLinks(this.state.youtube, this.state.reddit, this.state.wikipedia)}
                    </Col>
                    <Col span={12}>
                        <span style={{float: 'right'}}>
                            <span className={'ant-statistic-title'}>Latest launch date: </span>
                            {this.state.date && this.state.date.format("DD-MM-YYYY HH:mm:ss")}
                        </span>
                    </Col>
                    <Col span={3}>
                        <Image src={this.state.image} />
                    </Col>
                    <Col span={21}>
                        {
                            this.state.details
                        }
                    </Col>
                </Row>
            </Card>
        );
    }
}
