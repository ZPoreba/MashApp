import React, { Component } from "react";
import { Row, Col } from "antd";
import NextLaunch from "../Cards/NextLaunch";
import LatestLaunch from "../Cards/LatestLaunch";
import UpcomingLaunches from "../Cards/UpcomingLaunches";
import ExecutedLaunches from "../Cards/ExecutedLaunches";

export default class Launches extends Component {

    render() {
        return (
            <div className={'home-container'}>
                <Row gutter={[0, 16]}>
                    <Col span={11} offset={1}>
                        <LatestLaunch />
                    </Col>
                    <Col span={11} >
                        <NextLaunch />
                    </Col>
                </Row>
                <Row gutter={[0, 16]} style={{marginTop: 20}}>
                    <Col offset={1} span={11} >
                        <ExecutedLaunches />
                    </Col>
                    <Col span={11} >
                        <UpcomingLaunches />
                    </Col>
                </Row>
            </div>
        );
    }
}
