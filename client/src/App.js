import React, { Component } from "react";
import { connect } from "react-redux";
import { Router } from "react-router-dom";
import 'antd/dist/antd.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { history } from './helpers/history';
import NavBar from "./components/NavBar";
import MainSwitch from "./Switch";
import { Layout } from 'antd';
import axios from "axios";
import {logout} from "./actions/auth";
const { Header, Content } = Layout;


class App extends Component {
  constructor(props) {
    super(props);
    this.setAxios();
  }

  setAxios = () => {
    axios.interceptors.response.use(undefined, (error) => {
      if (error.response.status === 401) this.props.dispatch(logout());
      return Promise.reject(error);
    });
  }

  render() {
    return (
        <Router history={history}>
          <Layout className="ant-layout">
            <Header>
              <NavBar />
            </Header>
            <Content>
              <MainSwitch />
            </Content>
          </Layout>
        </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user
  };
}

export default connect(mapStateToProps)(App);
