import React, {Component}  from "react";
import SpaceXService from "../../services/SpaceXService";
import {Card, Collapse, Image, Tag} from "antd";
import moment from 'moment';
import { Row, Col } from 'antd';
import LinksHandler from "./LinksHandler";
import {handleResponseError} from "../../actions/auth";
const { Panel } = Collapse;


export default class ExecutedLaunches extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            loading: true
        };
        this.linksHandler = new LinksHandler();
    }

    componentDidMount() {
        SpaceXService.getExecutedLaunches().then(
            response => {
                let data = response.data.docs;
                this.setState({
                    dataSource: data,
                    loading: false
                });
            },
            error => handleResponseError(error)
        );
    }

    parseData = (data) => {
        return {
            name: data.name,
            details: data.details,
            date: moment.unix(data.date_unix),
            image: data.links.patch.small,
            youtube: data.links.webcast,
            reddit: data.links.reddit.campaign,
            wikipedia: data.links.wikipedia,
            launchpad_id: data.launchpad
        }
    }

    render() {
        return (
            <Card
                title={<span className={'regular-card-title'}>
                    Executed launches
                </span>}
                loading={this.state.loading}>
                <Row>
                    <Col span={24}>
                        <Collapse
                            style={{height: 500, overflow: 'auto'}}
                            defaultActiveKey={['0']}
                            ghost>
                            {
                                this.state.dataSource.map((data, index) => {
                                    let parsedDate = this.parseData(data)
                                    return <Panel
                                        header={
                                            <span>
                                                <span>{parsedDate.name}</span>
                                                <Tag color="#1890ff" style={{float: 'right'}}>
                                                    <strong>Launch date: </strong>
                                                    {parsedDate.date.format("DD-MM-YYYY HH:mm:ss")}
                                                </Tag>
                                            </span>}
                                        key={index}>
                                        <Row gutter={[16, 16]}>
                                            {this.linksHandler.renderLinks(parsedDate.youtube, parsedDate.reddit, parsedDate.wikipedia)}
                                        </Row>
                                        <Row gutter={[16, 16]}>
                                            <Col span={4}>
                                                <Image src={parsedDate.image}/>
                                            </Col>
                                            <Col span={20} style={{overflow: 'auto'}} >
                                                {parsedDate.details}
                                            </Col>
                                        </Row>
                                    </Panel>
                                })
                            }
                        </Collapse>
                    </Col>
                </Row>
            </Card>
        );
    }
}
