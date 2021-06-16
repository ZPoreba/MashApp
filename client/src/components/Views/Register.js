import React, { Component } from "react";
import { connect } from "react-redux";
import {register} from "../../actions/auth";
import {Button, Card, Input, Form, message} from "antd";


class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };
        this.passwordRef = React.createRef();
    }

    handleRegisterFailure = (error) => {
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
        dispatch(register(values.username, values.email, values.password))
            .then(() => {
                history.push("/login");
            })
            .catch(error => {
                this.handleRegisterFailure(error);
                this.setState({
                    loading: false
                });
            });
    }

    validateRepeatPassword = (rule, value) => {
        if (this.passwordRef.current.props.value === value) return Promise.resolve();
        else return Promise.reject("Repeated password does not match!");
    }

    render() {
        return (
            <div className={'register-container'}>
                <Card
                    title={<span className={'form-card-title'}>Sign Up</span>}
                    className={'register-card shadow'}>
                    <Form
                        labelCol={{span: 8}}
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
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!"
                                },
                                {
                                    required: true,
                                    type: "email",
                                    message: "The input is not valid E-mail!"
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
                            <Input.Password ref={this.passwordRef} />
                        </Form.Item>

                        <Form.Item
                            label="Repeat Password"
                            name="repeat_password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input repeated password!"
                                },
                                {
                                    validator: this.validateRepeatPassword
                                }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>


                        <Form.Item wrapperCol={{offset: 0}}>
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
    const { message } = state.message;
    return {
        message,
    };
}

export default connect(mapStateToProps)(Register);
