import React, { Component } from "react";
import SpaceXService from "../../../services/SpaceXService";
import {handleResponseError} from "../../../actions/auth";
import {Card, Col, Descriptions, Divider, Layout, Row, Spin, Statistic} from "antd";
import {Camera, Entity, Viewer} from "cesium-react";
import {Cartesian3, Color} from "cesium";
import {CheckOutlined, UndoOutlined, InfoCircleOutlined} from "@ant-design/icons";
import LinksHandler from "../../Cards/LinksHandler";


export default class PadPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: window.location.pathname.split('/')[2],
            dataSource: {},
            type: window.location.pathname.split('/')[1],
            loading: true
        }
        this.linksHandler = new LinksHandler();
        this.stateColors = {
            'active': '#00b56a',
            'retired': '#ff4d4f',
            'under construction': '#7d7d7d'
        }
    }

    componentDidMount() {
        SpaceXService.getPadById(this.state.id, `${this.state.type}s`).then(
            response => {
                let data = response.data.docs[0];
                this.setState({dataSource: data, loading: false});
            },
            error => handleResponseError(error)
        );
    }

    renderIndicatorCards = () => {
        let successes = (this.state.type === 'landpad') ?
            this.state.dataSource.landing_successes:
            this.state.dataSource.launch_successes;
        let attempts = (this.state.type === 'landpad') ?
            this.state.dataSource.landing_attempts:
            this.state.dataSource.launch_attempts;
        let status = this.state.dataSource.status;
        return <Row gutter={[16, 16]} style={{paddingBottom: 20, paddingTop: 15}}>
            <Col>
                <Card
                    style={{height: 'max-content', width: 'max-content', background: this.stateColors[status]}}>
                    <Statistic
                        title={<div style={{color: 'white'}}>Status</div>}
                        value={status}
                        valueStyle={{color: 'white'}}
                        prefix={<InfoCircleOutlined/>}
                    />
                </Card>
            </Col>
            <Col>
                <Card style={{height: 'max-content', width: 'max-content'}}>
                    <Statistic
                        title="Type"
                        value={this.state.type}
                        valueStyle={{color: '#1890ff'}}
                        prefix={<InfoCircleOutlined />}
                    />
                </Card>
            </Col>
            <Col>
                <Card style={{height: 'max-content', width: 'max-content'}}>
                    <Statistic
                        title="Landing successes"
                        value={successes}
                        valueStyle={{color: '#00b56a'}}
                        prefix={<CheckOutlined/>}
                    />
                </Card>
            </Col>
            <Col>
                <Card style={{height: 'max-content', width: 'max-content'}}>
                    <Statistic
                        title="Landing attempts"
                        value={attempts}
                        valueStyle={{color: '#1890ff'}}
                        prefix={<UndoOutlined/>}
                    />
                </Card>
            </Col>
        </Row>
    }

    renderLinks = () => {
        return <Row gutter={[16, 16]}>
            <Descriptions title="Links">
                <Descriptions.Item>
                    {this.linksHandler.renderWikipedia(this.state.dataSource.wikipedia)}
                </Descriptions.Item>
            </Descriptions>
        </Row>
    }

    renderDetails = () => {
        return <React.Fragment>
            <Descriptions title="Location">
                <Descriptions.Item label={"Region"}>
                    {this.state.dataSource.region}
                </Descriptions.Item>
                <Descriptions.Item label={"Locality"}>
                    {this.state.dataSource.locality}
                </Descriptions.Item>
                <Descriptions.Item label={"Longitude"}>
                    {this.state.dataSource.longitude}
                </Descriptions.Item>
                <Descriptions.Item label={"Latitude"}>
                    {this.state.dataSource.latitude}
                </Descriptions.Item>
            </Descriptions>
            {this.renderIndicatorCards()}
            {this.renderLinks()}
        </React.Fragment>
    }

    render() {
        let coordinatesReady = (this.state.dataSource.longitude && this.state.dataSource.latitude);
        return (
            <div className={"white-background "}>
                <Spin className={'center-element'} size={"large"} spinning={this.state.loading}/>
                <Card
                    className={'pad-card'}
                    title={<p className={'regular-card-title'}>{this.state.dataSource.full_name}</p>}
                    loading={this.state.loading}>
                    <Layout style={{background: 'white'}}>
                        <Row>
                            <Divider orientation="left" style={{fontWeight: 'lighter'}}>Details</Divider>
                            <Col span={14}>
                                {this.renderDetails()}
                            </Col>
                            <Col span={10} style={{padding: 10}}>
                                {
                                    coordinatesReady &&
                                    <Viewer animation={false} timeline={false}>
                                        <Camera
                                            view={{
                                                destination: Cartesian3.fromDegrees(
                                                    this.state.dataSource.longitude,
                                                    this.state.dataSource.latitude, 800
                                                ),
                                            }}
                                        />
                                        <Entity
                                            name={this.state.dataSource.full_name}
                                            position={Cartesian3.fromDegrees(this.state.dataSource.longitude, this.state.dataSource.latitude, 0)}
                                            point={{ pixelSize: 10, color: Color.fromCssColorString('#1890ff') }}>
                                            <div>
                                                longitude: {this.state.dataSource.longitude}
                                                <br/>
                                                latitude: {this.state.dataSource.latitude}
                                            </div>
                                        </Entity>
                                    </Viewer>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Descriptions title="Description">
                                <Descriptions.Item>
                                    {this.state.dataSource.details}
                                </Descriptions.Item>
                            </Descriptions>
                        </Row>
                    </Layout>
                </Card>
            </div>
        )
    }
}