import React, {Component} from "react";
import {Card, Col, Row} from "antd";
import {Chart} from "react-google-charts";
import {RocketOutlined} from "@ant-design/icons";

export default class DashboardRockets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rockets: this.props.rockets
        }
    }

    render () {
        return <div>
            <Row gutter={[16, 16]} >
                <Col span={12}>
                    <Card
                        title={
                            <p className={'regular-card-title'}>
                                Cost for rocket per launch
                            </p>
                        }
                        className={'dashboard-card'} >
                        <div className={'center-content'}>
                            {
                                (this.state.rockets.length !== 0) &&
                                <Chart
                                    width={'100%'}
                                    height={300}
                                    chartType="ColumnChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Cost per launch', 'Amount in dollars'],
                                        ...this.state.rockets.map(rocket => [rocket.name, rocket.cost_per_launch])
                                    ]}
                                    options={{
                                        chartArea: { width: '50%', height: '50%' },
                                        hAxis: {
                                            title: 'Rockets',
                                            minValue: 0,
                                        },
                                        vAxis: {
                                            title: 'Cost per launch',
                                        },
                                    }}
                                    legendToggle
                                />
                            }
                        </div>
                    </Card>
                </Col>
                <Col span={12} style={{width: '100%'}}>
                    <Card
                        className={'dashboard-card'}
                        title={
                            <p className={'regular-card-title'}>
                                Rockets height
                            </p>
                        }>
                        <div className={'center-content'}>
                            {
                                this.state.rockets.map((rocket, index) =>
                                    <div
                                        key={index}
                                        style={{display: 'inline-block', margin: 20}}>
                                        <div className={'center-content'}>
                                            {rocket.height.meters} m
                                        </div>
                                        <RocketOutlined
                                            style={{fontSize: rocket.height.meters}}
                                            className={'center-content'}/>
                                        <strong className={'center-content'}>
                                            {rocket.name}
                                        </strong>
                                    </div>)
                            }
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{marginTop: 20}}>
                <Col span={12} style={{width: '100%'}}>
                    <Card
                        className={'dashboard-card'}
                        title={
                            <p className={'regular-card-title'}>
                                Success percentage rate
                            </p>
                        }>
                        <div className={'center-content'}>
                            {
                                (this.state.rockets.length !== 0) &&
                                <Chart
                                    width={'100%'}
                                    height={300}
                                    chartType="BarChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Cost per launch', 'Percentage of successful launches'],
                                        ...this.state.rockets.map(rocket => [rocket.name, rocket.success_rate_pct])
                                    ]}
                                    options={{
                                        chartArea: { width: '50%', height: '50%' },
                                        hAxis: {
                                            title: 'Percentage',
                                            minValue: 0,
                                        },
                                        vAxis: {
                                            title: 'Rockets',
                                        },
                                    }}
                                    legendToggle
                                />
                            }
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        className={'dashboard-card'}
                        title={
                            <p className={'regular-card-title'}>
                                Rockets weight
                            </p>
                        }>
                        <div className={'center-content'}>
                            {
                                (this.state.rockets.length !== 0) &&
                                <Chart
                                    width={'100%'}
                                    height={300}
                                    chartType="ScatterChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Rocket', 'Mass in kg', 'Mass in pounds'],
                                        ...this.state.rockets.map(rocket => [rocket.name, rocket.mass.kg, rocket.mass.lb])
                                    ]}
                                    options={{
                                        chartArea: { width: '60%', height: '50%' },
                                        hAxis: {
                                            title: 'Rockets',
                                            minValue: 0,
                                        },
                                        vAxis: {
                                            title: 'Mass [kg/lb]',
                                        },
                                    }}
                                    legendToggle
                                />
                            }
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{marginTop: 20}}>
                <Col span={24} style={{width: '100%'}}>
                    <Card
                        className={'dashboard-card'}
                        title={
                            <p className={'regular-card-title'}>
                                First launch timeline
                            </p>
                        }>
                        <div className={'center-content'}>
                            {
                                (this.state.rockets.length !== 0) &&
                                <Chart
                                    width={'100%'}
                                    height={250}
                                    chartType="Timeline"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        [
                                            { type: 'string', id: 'Rocket name' },
                                            { type: 'string', id: 'dummy bar label' },
                                            { type: "string", role: "tooltip" },
                                            { type: 'date', id: 'Start' },
                                            { type: 'date', id: 'End' }
                                        ],
                                        ...this.state.rockets.map(rocket => {
                                            let date_from = new Date(rocket.first_flight);
                                            let date_to = new Date(rocket.first_flight);
                                            date_to.setDate(date_to.getDate() + 60);
                                            return [
                                                `${rocket.name} first launch`,
                                                null,
                                                `First ${rocket.name} launch date: ${rocket.first_flight}`,
                                                date_from,
                                                date_to
                                            ]
                                        })
                                    ]}
                                    options={{
                                        hAxis: {
                                            minValue: new Date(2005, 0, 1),
                                            format: 'YYYY'
                                        },
                                        width: '100%'
                                    }}
                                />
                            }
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}