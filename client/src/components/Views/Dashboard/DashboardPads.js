import React, {Component} from "react";
import {Card, Col, Row} from "antd";
import {Chart} from "react-google-charts";

export default class DashboardPads extends Component {

    constructor(props) {
        super(props);

        this.state = {
            launchpads: this.props.launchpads,
            landpads: this.props.landpads,
            number_of_active_launchpads: this.getActiveLaunchpads(),
            number_of_active_landpads: this.getActiveLandpads()
        }
    }

    getActiveLaunchpads = () => {
        let count = 0;
        this.props.launchpads.map(launchpad => {
            if (launchpad.status === "active") count += 1;
        })
        return count;
    }

    getActiveLandpads = () => {
        let count = 0;
        this.props.landpads.map(landpad => {
            if (landpad.status === "active") count += 1;
        })
        return count;
    }

    render() {
        return <div>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card
                        title={
                            <p className={'regular-card-title'}>
                                Launching successes per launchpad
                            </p>
                        }
                        className={'dashboard-card'} >
                        <div className={'center-content'}>
                            {
                                (this.state.launchpads.length !== 0) &&
                                <Chart
                                    width={'100%'}
                                    height={300}
                                    chartType="ColumnChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Launchpad name', 'Launching successes in percentage'],
                                        ...this.state.launchpads.map(launchpad => {
                                            let percentage = launchpad.launch_attempts != 0 ?
                                                (launchpad.launch_successes*100)/launchpad.launch_attempts: 100;
                                            return [launchpad.name, percentage];
                                        })
                                    ]}
                                    options={{
                                        chartArea: { width: '60%', height: '60%' },
                                        hAxis: {
                                            title: 'Launchpad name',
                                            minValue: 0,
                                        },
                                        vAxis: {
                                            title: 'Percentage of successes',
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
                <Col span={24}>
                    <Card
                        title={
                            <p className={'regular-card-title'}>
                                Landing successes per landpad
                            </p>
                        }
                        className={'dashboard-card'} >
                        <div className={'center-content'}>
                            {
                                (this.state.landpads.length !== 0) &&
                                <Chart
                                    width={'100%'}
                                    height={300}
                                    chartType="ColumnChart"
                                    loader={<div>Loading Chart</div>}
                                    data={[
                                        ['Landpad name', 'Landing successes in percentage'],
                                        ...this.state.landpads.map(landpad => {
                                            let percentage = landpad.landing_attempts != 0 ?
                                                (landpad.landing_successes*100)/landpad.landing_attempts: 100;
                                            return [landpad.name, percentage];
                                        })
                                    ]}
                                    options={{
                                        chartArea: { width: '60%', height: '60%' },
                                        hAxis: {
                                            title: 'Landpad name',
                                            minValue: 0,
                                        },
                                        vAxis: {
                                            title: 'Percentage of successes',
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
                <Col span={12}>
                    <Card
                        title={
                            <p className={'regular-card-title'}>
                                Launchpads status
                            </p>
                        }
                        className={'dashboard-card'} >
                        <Chart
                            width={'100%'}
                            height={300}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Status od launchpad', 'Amount of launchpads with status'],
                                ['Active launchpads', this.state.number_of_active_launchpads],
                                ['Inactive launchpads', this.state.launchpads.length - this.state.number_of_active_launchpads]
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
                                Landpads status
                            </p>
                        }
                        className={'dashboard-card'} >
                        <Chart
                            width={'100%'}
                            height={300}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Status od landpad', 'Amount of landpads with status'],
                                ['Active landpads', this.state.number_of_active_landpads],
                                ['Inactive landpads', this.state.landpads.length - this.state.number_of_active_landpads]
                            ]}
                            options={{
                                chartArea: { width: '90%', height: '90%' },
                                is3D: true
                            }}
                            legendToggle
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    }
}
