import React, {Component} from "react";
import {Button, Card, Form, Input, message} from "antd";
import AuthService from "../../services/AuthService";
import {connect} from "react-redux";
import {clearMessage} from "../../actions/message";

class ResetCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.message,
            formType: 'resetCodeForm'
        }
        this.passwordRef = React.createRef();
        this.attempts_counter = 0;
    }

    componentDidMount() {
        this.resetInterrupted();
    }

    onFinishResetCodeForm = (values) => {
        values['username'] = this.state.username;
        AuthService.confirm_code(values).then(
            response => {this.setState({formType: 'passwordResetForm'})},
            error => {
                this.attempts_counter += 1;
                if (this.attempts_counter >= 5) {
                    message.error("Too many attempts! Code deactivated! Try again in 15 minutes", 5);
                    this.props.history.push('/login');
                }
                else {
                    message.error(error.response.data, 5);
                }
            }
        )
    }

    onFinishPasswordResetForm = (values) => {
        values['username'] = this.state.username;
        AuthService.reset_password(values).then(
            response => {
                const { history, dispatch } = this.props;
                dispatch(clearMessage());
                history.push('/login');
            },
            error => {message.error(error.response.data)}
        )
    }

    resetInterrupted = () => {
        if (!this.state.username) {
            message.error('Reset password procedure interrupted ! Try again in 15 minutes', 5)
                .then(() => {
                this.props.history.push('/login');
            });
        }
    }

    renderResetCodeForm = () => {
        return (
            <div className={'reset-code-container'}>
                <Card
                    title={<span className={'form-card-title'}>Provide reset code from email</span>}
                    className={'reset-code-card shadow'}>
                    <Form
                        labelCol={{span: 6}}
                        wrapperCol={{span: 16}}
                        name="basic"
                        onFinish={this.onFinishResetCodeForm}
                    >
                        <Form.Item
                            label="Code"
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your code!"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 0}}>
                            <Button type="primary" htmlType="submit" style={{float: 'right'}}>
                                Confirm
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }

    checkPasswordStrength = (rule, password) => {
        let re = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
        if (re.test(password)) return Promise.resolve();
        else return Promise.reject("Password has to be at least 8 characters long, contains " +
            "at least one uppercase character, one number and one special character");
    }

    validateRepeatPassword = (rule, value) => {
        if (this.passwordRef.current.props.value === value) return Promise.resolve();
        else return Promise.reject("Repeated password does not match!");
    }

    renderPasswordResetForm = () => {
        return (
            <div className={'password-reset-container'}>
                <Card
                    title={<span className={'form-card-title'}>Provide new password</span>}
                    className={'password-reset-card shadow'}>
                    <Form
                        labelCol={{span: 6}}
                        wrapperCol={{span: 16}}
                        name="basic"
                        onFinish={this.onFinishPasswordResetForm}
                    >
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!"
                                },
                                {
                                    validator: this.checkPasswordStrength
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
        )
    }

    renderForm = () => {
        if (this.state.formType === 'resetCodeForm') return this.renderResetCodeForm();
        if (this.state.formType === 'passwordResetForm') return this.renderPasswordResetForm();
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.renderForm()
                }
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    const { message } = state.message;
    return {
        message,
    };
}

export default connect(mapStateToProps)(ResetCode);
