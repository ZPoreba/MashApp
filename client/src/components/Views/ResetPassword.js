import React, {Component} from "react";
import {Button, Card, Form, Input, message} from "antd";
import AuthService from "../../services/AuthService";
import {connect} from "react-redux";
import {clearMessage, setMessage} from "../../actions/message";

class ResetPassword extends Component {

    onFinish = (values) => {
        this.props.dispatch(clearMessage());
        AuthService.generate_code(values).then(
            response => {
                const { history, dispatch } = this.props;
                dispatch(setMessage(response.data));
                history.push('/reset_code');
            },
            error => {message.error(error.response.data, 5)}
        )
    }

    render() {
        return (
            <div className={'reset-password-container'}>
                <Card
                    title={<span className={'form-card-title'}>Reset Password</span>}
                    className={'reset-password-card shadow'}>
                    <Form
                        labelCol={{span: 6}}
                        wrapperCol={{span: 16}}
                        name="basic"
                        onFinish={this.onFinish}
                    >
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
                        <Form.Item wrapperCol={{offset: 0}}>
                            <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                                Send
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>)
    }
}

function mapStateToProps(state) {
    const { message } = state.message;
    return {
        message,
    };
}

export default connect(mapStateToProps)(ResetPassword);
