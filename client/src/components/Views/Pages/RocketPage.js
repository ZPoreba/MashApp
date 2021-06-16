import React, { Component } from "react";
import SpaceXService from "../../../services/SpaceXService";
import {handleResponseError} from "../../../actions/auth";
import {Card, Carousel, Divider, Layout, Row, Col, Descriptions, Statistic, Spin} from "antd";
import { LeftCircleOutlined, RightCircleOutlined, DollarCircleOutlined, CheckOutlined, InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import LaunchesCalendar from "../../SingleComponents/LaunchesCalendar";
import LinksHandler from "../../Cards/LinksHandler";
import SubscribeButton from "../../SingleComponents/SubscribeButton";


export default class RocketPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: window.location.pathname.split('/')[2],
            dataSource: {},
            loading: true
        }
        this.carousel = React.createRef();
        this.linksHandler = new LinksHandler();
    }

    componentDidMount() {
        SpaceXService.getRocketById(this.state.id).then(
            response => {
                let data = response.data.docs[0];
                this.setState({dataSource: data, loading: false});
            },
            error => handleResponseError(error)
        );
    }

    nextArrow = () => {
        return (
            <div
                style={{
                    color: '#1890ff',
                    fontSize: '25px',
                    lineHeight: '1.5715',
                    float: 'right',
                    marginRight: 50
                }}
                onClick={() => {
                    this.carousel.current.next()
                }}
            >
                <RightCircleOutlined/>
            </div>
        )
    }

    prevArrow = () => {
        return (
            <div
                style={{
                    color: '#1890ff',
                    fontSize: '25px',
                    lineHeight: '1.5715',
                    marginLeft: 50
                }}
                onClick={() => this.carousel.current.prev()}
            >
                <LeftCircleOutlined/>
            </div>
        )
    }

    renderIndicatorCards = () => {
        let statusColor = this.state.dataSource.active ? '#00b56a' : '#dc3545';
        return <Row gutter={[16, 16]} style={{paddingBottom: 20, paddingTop: 15}}>
            <Col>
                <Card
                    style={{height: 'max-content', width: 'max-content', background: statusColor}}>
                    <Statistic
                        title={<div style={{color: 'white'}}>Status</div>}
                        value={this.state.dataSource.active ? 'active' : 'inactive'}
                        valueStyle={{color: 'white'}}
                        prefix={<InfoCircleOutlined/>}
                    />
                </Card>
            </Col>
            <Col>
                <Card style={{height: 'max-content', width: 'max-content'}}>
                    <Statistic
                        title="First flight"
                        value={this.state.dataSource.first_flight}
                        valueStyle={{color: '#1890ff'}}
                        prefix={<CalendarOutlined/>}
                    />
                </Card>
            </Col>
            <Col>
                <Card style={{height: 'max-content', width: 'max-content'}}>
                    <Statistic
                        title="Success rate"
                        value={this.state.dataSource.success_rate_pct}
                        valueStyle={{color: '#1890ff'}}
                        prefix={<CheckOutlined/>}
                        suffix="%"
                    />
                </Card>
            </Col>
            <Col>
                <Card style={{height: 'max-content', width: 'max-content'}}>
                    <Statistic
                        title="Cost per launch"
                        value={this.state.dataSource.cost_per_launch}
                        valueStyle={{color: '#00b56a'}}
                        prefix={<DollarCircleOutlined/>}
                        suffix="$"
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
            <Descriptions title="Description">
                <Descriptions.Item>
                    {this.state.dataSource.description}
                </Descriptions.Item>
            </Descriptions>
            <Descriptions title="Measures">
                <Descriptions.Item label="Height">
                    {this.state.dataSource.height.meters} meters
                    / {this.state.dataSource.height.feet} feet
                </Descriptions.Item>
                <Descriptions.Item label="Diameter">
                    {this.state.dataSource.diameter.meters} meters
                    / {this.state.dataSource.diameter.feet} feet
                </Descriptions.Item>
                <Descriptions.Item label="Mass">
                    {this.state.dataSource.mass.kg} kg
                </Descriptions.Item>
                <Descriptions.Item label="Engine(s)">
                    {this.state.dataSource.engines.number} {this.state.dataSource.engines.layout} {this.state.dataSource.engines.type}(s) ({this.state.dataSource.engines.version ? this.state.dataSource.engines.version: "-"})
                </Descriptions.Item>
                <Descriptions.Item label="Landing legs">
                    {this.state.dataSource.landing_legs.number} {this.state.dataSource.landing_legs.material} legs
                </Descriptions.Item>
                <Descriptions.Item label="Stages">
                    {this.state.dataSource.stages} stage(s)
                </Descriptions.Item>
            </Descriptions>
            {this.renderIndicatorCards()}
            {this.renderLinks()}
        </React.Fragment>
    }

    render() {
        return (
            <div className={"white-background "}>
                <Spin className={'center-element'} size={"large"} spinning={this.state.loading}/>
                <Card
                    className={'rocket-card'}
                    title={
                        <p className={'regular-card-title'}>
                            {this.state.dataSource.name} Rocket
                        </p>
                    }
                    loading={this.state.loading}>
                    {this.state.dataSource.flickr_images &&
                    <Layout style={{background: 'white'}}>
                        <Divider orientation="left" style={{fontWeight: 'lighter'}}>Details</Divider>
                        <Row>
                            <Col span={14}>
                                {this.renderDetails()}
                            </Col>
                            <Col span={10}>
                                <Carousel ref={this.carousel}>
                                    {
                                        this.state.dataSource.flickr_images.map((image, index) => <div>
                                            <img
                                                style={{width: 'inherit'}}
                                                key={index}
                                                src={image}
                                            />
                                        </div>)
                                    }
                                </Carousel>
                                <div style={{display: ' block ruby'}}>
                                    {this.prevArrow()}
                                    {this.nextArrow()}
                                </div>
                                {
                                    this.state.dataSource.active &&
                                    <div className={'center-content'} style={{paddingTop: 20}}>
                                        <SubscribeButton id={this.state.dataSource.id}/>
                                    </div>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <LaunchesCalendar id={this.state.id} active={this.state.dataSource.active} />
                        </Row>
                    </Layout>}
                </Card>
            </div>
        )
    }
}
