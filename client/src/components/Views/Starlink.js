import React, { Component } from "react";
import {handleResponseError} from "../../actions/auth";
import SpaceXService from "../../services/SpaceXService";
import { Cartesian3, Color } from "cesium";
import { Viewer, Entity } from "cesium-react";
const API_URL = process.env.REACT_APP_API_URL;

export default class Starlink extends Component {
    constructor(props) {
        super(props);
        this.updateEvent = undefined;

        this.state = {
            positions: [],
            satelliteHeight: 500000
        };
    }

    setSSE = () => {
        if(typeof(EventSource) !== "undefined") {
            this.updateEvent = new EventSource(`${API_URL}api/state/starlink_data_stream/`);
            this.updateEvent.onmessage = (event) => {
                let data = JSON.parse(event.data);
                this.setState({positions: data.positions});
            };
        } else {
            console.log("Sorry, your browser does not support server-sent events...");
        }
    }

    getStarlinkPositions = () => {
        SpaceXService.getActualStarlinkPositions().then(
            resp => {
                this.setState({positions: resp.data.positions});
            },
            error => handleResponseError(error)
        )
    }

    componentDidMount() {
        this.getStarlinkPositions();
        this.setSSE();
    }

    componentWillUnmount() {
        this.updateEvent.close();
    }

    render() {
        return (
            <div className={'starlink-container'}>
                <Viewer animation={false} timeline={false}>
                    {
                        this.state.positions.map((coordinates, index) => <Entity
                            key={`starlink-${index}`}
                            name={coordinates[2]}
                            position={Cartesian3.fromDegrees(coordinates[0], coordinates[1], this.state.satelliteHeight)}
                            point={{ pixelSize: 10, color: Color.fromCssColorString('#1890ff') }}>
                            <div>
                                longitude: {coordinates[0]}
                                <br/>
                                latitude: {coordinates[1]}
                            </div>
                        </Entity>)
                    }
                </Viewer>
            </div>
        );
    }
}
