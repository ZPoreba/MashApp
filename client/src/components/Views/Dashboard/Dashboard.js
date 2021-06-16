import React, {Component} from "react";
import DashboardService from "../../../services/DashboardService";
import {handleResponseError} from "../../../actions/auth";
import {Spin, Tabs} from "antd";
import DashboardRockets from "./DashboardRockets";
import DashboardLaunches from "./DashboardLaunches";
import DashboardPads from "./DashboardPads";
const { TabPane } = Tabs;


export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: {
                rockets: undefined,
                crew: undefined,
                upcoming_launches: undefined,
                past_launches: undefined,
                landpads: undefined,
                launchpads: undefined
            },
            loading: true
        }
        this.rocketsDashboardRef = React.createRef();
        this.launchesDashboardRef = React.createRef();
        this.padsDashboardRef = React.createRef();
    }

    componentDidMount() {
        DashboardService.getDashboardData().then(
            response => {
                this.setState({dataSource: {
                        rockets: response.data.rockets,
                        crew: response.data.crew,
                        upcoming_launches: response.data.upcoming_launches,
                        past_launches: response.data.past_launches,
                        landpads: response.data.landpads,
                        launchpads: response.data.launchpads
                    }, loading: false})
            },
            error => handleResponseError(error)
        )
    }

    refreshTab = key => {
        if (key === "rockets" && this.rocketsDashboardRef.current) this.rocketsDashboardRef.current.setState({});
        else if (key === "launches" && this.launchesDashboardRef.current) this.launchesDashboardRef.current.setState({});
        else if (key === "pads" && this.padsDashboardRef.current) this.padsDashboardRef.current.setState({});
    }

    render () {
        return <div>
            <Spin className={'center-element'} size={"large"} spinning={this.state.loading}/>
            <Tabs defaultActiveKey="1" onChange={(key) => {this.refreshTab(key)}} style={{margin: 20}}>
                <TabPane tab="Rockets" key="rockets">
                    {this.state.dataSource.rockets && <DashboardRockets
                        ref={this.rocketsDashboardRef}
                        rockets={this.state.dataSource.rockets}/>}
                </TabPane>
                <TabPane tab="Launches" key="launches">
                    {this.state.dataSource.crew && <DashboardLaunches
                        ref={this.launchesDashboardRef}
                        crew={this.state.dataSource.crew}
                        upcoming_launches={this.state.dataSource.upcoming_launches}
                        past_launches={this.state.dataSource.past_launches}
                    />}
                </TabPane>
                <TabPane tab="Launchpads & Landpads" key="pads">
                    {
                        (this.state.dataSource.launchpads && this.state.dataSource.landpads) &&
                        <DashboardPads
                            ref={this.padsDashboardRef}
                            launchpads={this.state.dataSource.launchpads}
                            landpads={this.state.dataSource.landpads} />
                    }
                </TabPane>
            </Tabs>
        </div>
    }
}
