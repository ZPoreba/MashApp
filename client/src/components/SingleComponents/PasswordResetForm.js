import React, {Component} from "react";
import {Button, Card, Form, Input, message} from "antd";
import AuthService from "../../services/AuthService";

export default class PasswordResetForm extends Component {

    constructor(props) {
        super(props);
        this.passwordRef = React.createRef();
        this.form = React.createRef();
    }

    validateRepeatPassword = (rule, value) => {
        if (this.passwordRef.current.props.value === value) return Promise.resolve();
        else return Promise.reject("Repeated password does not match!");
    }

    onFinish = (values) => {
        AuthService.change_password(values).then(
            response => {
                this.form.current.resetFields();
                message.success('Password has been reset successfully', 5);
            },
            error => {
                message.error(error.response.data, 5);
            }
        )
    }

    render() {
        return (
            <div>
                <div className={'password-reset-container'} style={{marginTop: 20}}>
                    <Card
                        title={<span className={'form-card-title'}>Reset password</span>}
                        style={{width: '100%'}}
                        className={'password-reset-card shadow'}>
                        <Form
                            labelCol={{span: 6}}
                            wrapperCol={{span: 16}}
                            name="password-reset"
                            onFinish={this.onFinish}
                            ref={this.form}
                        >
                            <Form.Item
                                label="Old Password"
                                name="old_password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your old password!"
                                    }
                                ]}
                            >
                                <Input.Password />
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
                                    Reset
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}