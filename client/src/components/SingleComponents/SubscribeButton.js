import React, {Component} from "react";
import {Button, message, Tooltip} from "antd";
import UserService from "../../services/UserService";
import {handleResponseError} from "../../actions/auth";
import {connect} from "react-redux";


class SubscribeButton extends Component {

    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));
        this.state = {
            id: props.id,
            subscribed_rockets: user.user.subscribed_rockets
        }
    }

    setSubscribe = (e) => {
        const user = JSON.parse(localStorage.getItem("user"));
        UserService.setSubscribedRocket(this.state.id).then(
            response => {
                message.success({
                    content: response.data.status,
                    style: {marginTop: '45vh'}
                });
                user.user.subscribed_rockets = response.data.subscribed_rockets;
                localStorage.setItem("user", JSON.stringify(user));
                this.setState({subscribed_rockets: response.data.subscribed_rockets});
            },
            error => error => handleResponseError(error)
        )
    }

    render () {
        let subscribed = this.state.subscribed_rockets.includes(this.state.id);
        return <Tooltip title={'Subscribe to get information about launches in your profile'}>
            <Button
                disabled={subscribed}
                size={'small'}
                onClick={e => this.setSubscribe(e)}>
                { subscribed ? "Already subscribed": "Subscribe" }
            </Button>
        </Tooltip>
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user,
    };
}

export default connect(mapStateToProps)(SubscribeButton);