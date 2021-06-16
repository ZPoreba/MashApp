import React, { Component } from "react";
import UserService from "../../services/UserService";
import {handleResponseError} from "../../actions/auth";

export default class BoardAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        UserService.getAdminBoard().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => handleResponseError(error)
        );
    }

    render() {
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>{this.state.content}</h3>
                </header>
            </div>
        );
    }
}
