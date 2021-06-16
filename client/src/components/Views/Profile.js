import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import {Card, Avatar, Layout, Row, Col, Spin, Button, Form, Input, message} from "antd";
import SpaceXService from "../../services/SpaceXService";
import {handleResponseError} from "../../actions/auth";
import SubscribedRockets from "../SingleComponents/SubscribedRockets";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import UserService from "../../services/UserService";
import PasswordResetForm from "../SingleComponents/PasswordResetForm";


class Profile extends Component {

    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user")).user;
        this.state = {
            subscribed_rockets: user.subscribed_rockets,
            subscribedRockets: {},
            loading: true,
            editing: false,
            user: user
        }
    }

    setSubscribedRockets = (data) => {
        let newSubscribedRockets = this.state.subscribedRockets;
        data.map(launch => {
            if (Object.keys(newSubscribedRockets).includes(launch.rocket)) {
                newSubscribedRockets[launch.rocket].push(launch)
            }
            else {
                newSubscribedRockets[launch.rocket] = [launch]
            }
        });
        this.setState({subscribedRockets: newSubscribedRockets, loading: false});
    }

    componentDidMount() {
        SpaceXService.getUpcomingLaunchesForRockets(this.state.subscribed_rockets).then(
            response => this.setSubscribedRockets(response.data.docs),
            error => handleResponseError(error)
        )
    }

    renderUserData = (currentUser) => {
        return(
            <Card className={'shadow profile-card center-element-vertically'}>
                <Row>
                    <Col span={12}>
                        <Avatar
                            className={'center-content shadow'}
                            size={100}
                            icon={!currentUser.picture && <UserOutlined />}
                            src={currentUser.picture}/>
                        <h4 className={'center-content'}>
                            <div style={{fontWeight: 'lighter', fontSize: 25}}>{currentUser.username}</div>
                        </h4>
                    </Col>
                    <Col span={11}>
                        <span>
                            <p className={'field-name'}>First name</p>
                            <p className={'field-value'}>
                                {currentUser.first_name ? currentUser.first_name: '-'}
                            </p>
                        </span>
                        <span>
                            <p className={'field-name'}>Last name</p>
                            <p className={'field-value'}>
                                {currentUser.last_name ? currentUser.last_name: '-'}
                            </p>
                        </span>
                        <span>
                            <p className={'field-name'}>Email</p>
                            <p className={'field-value'}>{currentUser.email}</p>
                        </span>
                    </Col>
                    {
                        !currentUser.is_oauth &&
                        <Col span={1}>
                            <Button shape="circle" onClick={() => this.setState({editing: true})}>
                                <EditOutlined/>
                            </Button>
                        </Col>
                    }
                </Row>
            </Card>
        )
    }

    submitUserDataEditingForm = (values) => {
        UserService.editUserData(values).then(
            response => {
                let user = JSON.parse(localStorage.getItem("user"));
                user.user = response.data;
                localStorage.setItem("user", JSON.stringify(user));
                message.success('User data edited successfully');
                this.setState({editing: false, user: response.data});
            },
            error => handleResponseError(error)
        );
    }

    renderUserDataEditingForm = (currentUser) => {
        return (
            <Card className={'shadow profile-card center-element-vertically'}>
                <Row>
                    <Col span={12}>
                        <Avatar
                            className={'center-content shadow'}
                            size={100}
                            icon={!currentUser.picture && <UserOutlined />}
                            src={currentUser.picture}/>
                        <h4 className={'center-content'}>
                            <div style={{fontWeight: 'lighter', fontSize: 25}}>{currentUser.username}</div>
                        </h4>
                    </Col>
                    <Col span={12}>
                        <Form
                            name="user-data-edit"
                            initialValues={{
                                first_name: currentUser.first_name,
                                last_name: currentUser.last_name
                            }}
                            onFinish={this.submitUserDataEditingForm}
                        >
                            <Form.Item
                                label="First name"
                                name="first_name"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Last name"
                                name="last_name"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item wrapperCol={{offset: 0}}>
                                <Button
                                    type="primary"
                                    onClick={() => this.setState({editing: false})}
                                    style={{float: 'right', marginLeft: 10}}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>
            </Card>
        )
    }

    render() {
        const {user: currentUser} = this.props;
        if (!currentUser) {
            return <Redirect to="/login"/>;
        }

        return (
            <div className={"white-background profile-card"}>
                <Spin className={'center-element'} size={"large"} spinning={this.state.loading}/>
                <Card
                    title={<p className={'regular-card-title'}>Profile</p>}
                    loading={this.state.loading}
                >
                    <Layout style={{background: 'white'}}>
                        <Row>
                        {
                            this.state.editing ?
                                this.renderUserDataEditingForm(this.state.user):
                                this.renderUserData(this.state.user)
                        }
                        </Row>
                        {
                            !this.state.user.is_oauth &&
                                <Row>
                                    <Col span={24}>
                                        <PasswordResetForm user={this.state.user}/>
                                    </Col>
                                </Row>
                        }
                        <Row style={{marginTop: 20}}>
                            <Col span={24}>
                                <SubscribedRockets subscribedRockets={this.state.subscribedRockets} />
                            </Col>
                        </Row>
                    </Layout>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user,
    };
}

export default connect(mapStateToProps)(Profile);
