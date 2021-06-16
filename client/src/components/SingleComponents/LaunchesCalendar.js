import React, {Component} from "react";
import SpaceXService from "../../services/SpaceXService";
import {handleResponseError} from "../../actions/auth";
import {Calendar, Divider, Spin, Tag} from "antd";
import moment from "moment";
import GoogleCalendarButton from "./GoogleCalendarButton";

export default class LaunchesCalendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            active: props.active,
            dataSource: [],
            loading: true,
            nextLaunch: undefined,
            latestLaunch: undefined
        }
    }

    setActualLaunches = () => {
        if (this.state.active) SpaceXService.getActualRocketLaunchById(this.state.id, 'next').then(
            response => {
                let data = response.data.docs[0];
                this.setState({nextLaunch: data, loading: false});
            },
            error => handleResponseError(error)
        );
        SpaceXService.getActualRocketLaunchById(this.state.id, 'latest').then(
            response => {
                let data = response.data.docs[0];
                this.setState({latestLaunch: data, loading: false});
            },
            error => handleResponseError(error)
        );
    }

    componentDidMount() {
        SpaceXService.getRocketLaunchesById(this.state.id).then(
            response => {
                let data = response.data.docs;
                this.setState({dataSource: data, loading: false});
            },
            error => handleResponseError(error)
        );
        this.setActualLaunches();
    }

    renderLaunchCell = (index, launchDate, date) => {
        return <div key={index} style={{display: 'flex', paddingBottom: 5}}>
            {
                launchDate > moment() &&
                <GoogleCalendarButton
                    title={`SpaceX Launch: ${date.name}`}
                    location={date.launchpad}
                    description={date.details}
                    start={launchDate}
                    smallIcon={true}
                />
            }
            <div style={{paddingLeft: 8}}>
                {date.name}
            </div>
        </div>
    }

    checkIfLaunchDate = (date) => {
        let launchesForDate = [];
        let currentDate = moment(date);
        this.state.dataSource.map((date, index) => {
            let launchDate = moment.unix(date.date_unix);
            if (currentDate.format("DD-MM-YYYY") === launchDate.format("DD-MM-YYYY"))
                launchesForDate.push(this.renderLaunchCell(index, launchDate, date));
        });
        return launchesForDate;
    }

    dateCellRender = (value) => {
        let data = this.checkIfLaunchDate(value._d);
        return data;
    }

    renderActualLaunches = (date, type) => {
        if (date) {
            let launchDate = moment.unix(date.date_unix).format("DD-MM-YYYY");
            return <div style={{paddingTop: 10}}>
                {type} launch: {date.name} <Tag color="#1890ff">{launchDate}</Tag>
            </div>
        }
    }

    render() {
        let defaultDate =  this.state.nextLaunch ? this.state.nextLaunch: this.state.latestLaunch;
        return (
            <div>
                <Spin className={'center-element'} size={"large"} spinning={this.state.loading}/>
                {defaultDate && <Divider orientation="left" style={{fontWeight: 'lighter'}}>Launches</Divider>}
                {this.renderActualLaunches(this.state.latestLaunch, 'Latest')}
                {this.renderActualLaunches(this.state.nextLaunch, 'Next')}
                {
                    defaultDate &&
                    <Calendar
                        dateCellRender={(value) => this.dateCellRender(value)}
                        defaultValue={moment.unix(defaultDate.date_unix)}
                    />
                }
            </div>
        )
    }
}
