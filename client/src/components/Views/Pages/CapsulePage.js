import React, { Component } from "react";
import SpaceXService from "../../../services/SpaceXService";
import {handleResponseError} from "../../../actions/auth";
import {
    CalendarOutlined,
    InfoCircleOutlined,
    LeftCircleOutlined,
    RightCircleOutlined
} from "@ant-design/icons";
import {Card, Carousel, Col, Descriptions, Divider, Layout, Row, Spin, Statistic} from "antd";
import LinksHandler from "../../Cards/LinksHandler";


export default class CapsulePage extends Component {

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
        SpaceXService.getCapsuleById(this.state.id).then(
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
        let statusColor = this.state.dataSource.active ? '#00b56a' : '#ff4d4f';
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
                <Descriptions.Item label="Diameter">
                    {this.state.dataSource.diameter.meters} meters
                    / {this.state.dataSource.diameter.feet} feet
                </Descriptions.Item>
                <Descriptions.Item label="Heat shield">
                    {this.state.dataSource.heat_shield.material} shield
                    ({this.state.dataSource.heat_shield.size_meters} meters, {this.state.dataSource.heat_shield.temp_degrees} °C)
                </Descriptions.Item>
                <Descriptions.Item label="Dry mass">
                    {this.state.dataSource.dry_mass_kg} kg
                </Descriptions.Item>
                <Descriptions.Item label="Launch payload mass">
                    {this.state.dataSource.launch_payload_mass.kg} kg
                </Descriptions.Item>
                <Descriptions.Item label="Return payload mass">
                    {this.state.dataSource.return_payload_mass.kg} kg
                </Descriptions.Item>
                <Descriptions.Item label="Height">
                    {this.state.dataSource.height_w_trunk.meters} meters
                    / {this.state.dataSource.height_w_trunk.feet} feet
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
                    className={'capsule-card'}
                    title={<p className={'regular-card-title'}>{this.state.dataSource.name} Capsule</p>}
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
                            </Col>
                        </Row>
                    </Layout>}
                </Card>
            </div>
        )
    }
}