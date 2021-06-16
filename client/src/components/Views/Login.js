import React, { Component } from "react";
import {Link, Redirect} from 'react-router-dom';
import { connect } from "react-redux";
import { login, oauth_login } from "../../actions/auth";
import { GoogleLogin } from 'react-google-login';
import { Card, Form, Input, Button, message } from 'antd';
import FacebookLoginButton from "../SingleComponents/FacebookLoginButton";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;


window.fbAsyncInit = function() {
    window.FB.init({
        appId      : FACEBOOK_APP_ID,
        cookie     : true,                     // Enable cookies to allow the server to access the session.
        xfbml      : true,                     // Parse social plugins on this webpage.
        version    : '{api-version}'           // Use this Graph API version for this call.
    });
};

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
    }

    handleGoogleLoginSuccess = (data) => {
        const { dispatch, history } = this.props;
        dispatch(oauth_login(data, 'google'))
            .then(() => {
                history.push("/profile");
            })
            .catch(error => {
                this.handleLoginFailure(error);
                this.setState({
                    loading: false
                });
            });
    }

    handleFacebookLoginSuccess = (status, data) => {
        if (status) {
        const { dispatch, history } = this.props;
        dispatch(oauth_login(data, 'facebook'))
            .then(() => {
                history.push("/profile");
            })
            .catch(error => {
                this.handleLoginFailure(error);
                this.setState({
                    loading: false
                });
            });
        }
    }

    handleLoginFailure = (error) => {
        let error_msg = error.response.data.error_description;
        message.error({
            content:error_msg,
            style: {marginTop: '45vh'}
        });
    }

    onFinish = (values) => {
        this.setState({
            loading: true,
        });

        const { dispatch, history } = this.props;
        dispatch(login(values.username, values.password))
            .then(() => {
                history.push("/profile");
            })
            .catch(error => {
                this.handleLoginFailure(error);
                this.setState({
                    loading: false
                });
            });
    };

    render() {
        const { isLoggedIn, message } = this.props;

        if (isLoggedIn) {
            return <Redirect to="/profile" />;
        }

        return (
            <div className={'login-container'}>
                <Card
                    title={<span className={'form-card-title'}>Log In</span>}
                    className={'login-card shadow'}>
                    <Form
                        labelCol={{span: 6}}
                        wrapperCol={{span: 16}}
                        name="basic"
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your username!"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!"
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{offset: 0}}>
                            <Link to={'/reset_password'}>Forgot password ?</Link>
                        </Form.Item>

                        <Form.Item wrapperCol={{offset: 0}}>
                            <GoogleLogin
                                clientId={GOOGLE_CLIENT_ID}
                                buttonText="Access with Google"
                                onSuccess={this.handleGoogleLoginSuccess}
                                cookiePolicy={'single_host_origin'}
                                implicitAuth={false}
                                responseType={'code'}
                                redirectUri={''}
                                className={'google-login-button'}
                            />
                            <FacebookLoginButton
                                onLogin={this.handleFacebookLoginSuccess} />

                            <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { isLoggedIn } = state.auth;
    const { message } = state.message;
    return {
        isLoggedIn,
        message
    };
}

export default connect(mapStateToProps)(Login);
