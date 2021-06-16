import React, {Component} from "react";
import {Card, Col, List, Row, Tag} from "antd";
import {Chart} from "react-google-charts";
import moment from "moment";
import LinksHandler from "../../Cards/LinksHandler";

export default class DashboardLaunches extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crew: this.props.crew,
            upcoming_launches: this.props.upcoming_launches,
            past_launches: this.props.past_launches,
            crewed_launches: this.getCrewedLaunches(),
            number_of_succeeded_launches: this.getNumberOfSucceededLaunches()
        }
        this.linksHandler = new LinksHandler();
    }

    getCrewedLaunches = () => {
        let launches = [];
        this.props.past_launches.map(launch => {
            if (launch.crew.length > 0) launches.push(launch);
        })
        return launches;
    }

    getNumberOfSucceededLaunches = () => {
        let count = 0;
        this.props.past_launches.map(launch => {
            if (launch.success) count += 1;
        })
        return count;
    }

    renderItem = item => {
        return <List.Item
            key={item.title}
            extra={this.linksHandler.renderLinks(item.links.webcast, item.links.reddit.launch, item.links.wikipedia)}
        >
            <List.Item.Meta
                title={
                    <p>{item.name}
                        <Tag color={'#1890ff'}
                             style={{marginLeft: 20}}>
                            <strong>Launch date: </strong>
                            {moment.unix(item.date_unix).format("DD-MM-YYYY HH:mm:ss")}
                        </Tag>
                    </p>
                }
                description={item.details}
            />
            <Row gutter={[16, 16]}>
                <strong style={{marginBottom: 20}} >Crew members</strong>
            </Row>
            <Row gutter={[16, 16]}>
                {
                    this.state.crew.map((member, index) => {
                        if (member.launches.includes(item.id)) {
                            return <Col key={index}>
                                <Card
                                    onClick={() => {this.linksHandler.openWikipedia(member.wikipedia)}}
                                    hoverable
                                    style={{ width: 240 }}
                                    cover={<img alt="example" src={member.image} />}
                                >
                                    {member.name}
                                </Card>
                            </Col>
                        }
                    })
                }
            </Row>
        </List.Item>
    }

    render () {
        return <div>
            <Row gutter={[16, 16]} >
                <Col span={12}>
                    <Card
                        title={
                            <p className={'regular-card-title'}>
                                Types of executed launches
                            </p>
                        }
                        className={'dashboard-card'} >
                        <Chart
                            width={'100%'}
                            height={300}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Type of launch', 'Amount of launches'],
                                ['Crewed launches', this.state.crewed_launches.length],
                                ['Launches without crew', this.state.past_launches.length - this.state.crewed_launches.length]
                            ]}
                            options={{
                                chartArea: { width: '90%', height: '90%' },
                                is3D: true
                            }}
                            legendToggle
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title={
                            <p className={'regular-card-title'}>
                                Status of executed launches
                            </p>
                        }
                        className={'dashboard-card'} >
                        <Chart
                            width={'100%'}
                            height={300}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Status', 'Amount of launches'],
                                ['Succeeded launches', this.state.number_of_succeeded_launches],
                                ['Failed launches', this.state.past_launches.length - this.state.number_of_succeeded_launches]
                            ]}
                            options={{
                                chartArea: { width: '90%', height: '90%' },
                                pieHole: 0.5
                            }}
                            legendToggle
                        />
                    </Card>
                </Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <Col span={24}>
                    <Card
                        title={
                            <p className={'regular-card-title'}>
                                Crewed launches
                            </p>
                        }
                        className={'dashboard-card'} >
                        <List
                            itemLayout="vertical"
                            size="large"
                            style={{background: 'white'}}
                            pagination={{
                                pageSize: 5,
                                size: 'small',
                                showTotal: total => `Total ${total} items`
                            }}
                            dataSource={this.state.crewed_launches}
                            renderItem={item => this.renderItem(item)}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    }
}
