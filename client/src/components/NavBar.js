import React, { Component } from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import { logout } from "../actions/auth";
import { Menu } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    logOut() {
        this.props.dispatch(logout());
    }

    render() {
        const currentUser = this.props.user ? this.props.user: undefined;
        const showAdminBoard = this.props.user ? this.props.user.user.is_superuser: false;

        return (
            <Menu theme="light" mode="horizontal">
                <Menu.Item key="1">
                    <Link to={"/"} className={'bold-blue'}>
                        <RocketOutlined style={{fontSize: '30px'}}/>
                        MashApp
                    </Link>
                </Menu.Item>
                {
                    currentUser ? (
                        <React.Fragment>
                            <Menu.Item key="2">
                                <Link to={"/launches"}>
                                    Launches
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to={"/starlink"}>
                                    Starlink
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to={"/resources"}>
                                    Resources
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <Link to={"/dashboard"}>
                                    Dashboard
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6" style={{float: 'right'}} >
                                <a href="/login" onClick={this.logOut}>
                                    Log Out
                                </a>
                            </Menu.Item>
                            <Menu.Item key="7" style={{float: 'right'}} >
                                <Link to={"/profile"}>
                                    {currentUser.user.username}
                                </Link>
                            </Menu.Item>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Menu.Item key="8" style={{float: 'right'}} >
                                <Link to={"/register"}>
                                    Sign Up
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="9" style={{float: 'right'}} >
                                <Link to={"/login"}>
                                    Login
                                </Link>
                            </Menu.Item>
                        </React.Fragment>
                    )
                }
                {
                    showAdminBoard && (
                        <Menu.Item key="9">
                            <Link to={"/admin"}>
                                Admin Board
                            </Link>
                        </Menu.Item>
                    )
                }
            </Menu>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user,
    };
}

export default connect(mapStateToProps)(NavBar);