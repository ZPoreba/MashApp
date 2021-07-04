import React, { Component } from "react";
import { connect } from "react-redux";
import {Switch, Route, Redirect} from "react-router-dom";
import Login from "./components/Views/Login";
import Register from "./components/Views/Register";
import Launches from "./components/Views/Launches";
import Profile from "./components/Views/Profile";
import Starlink from "./components/Views/Starlink";
import Resources from "./components/Views/Resources";
import Home from "./components/Views/Home";
import RocketPage from "./components/Views/Pages/RocketPage";
import CapsulePage from "./components/Views/Pages/CapsulePage";
import PadPage from "./components/Views/Pages/PadPage";
import Dashboard from "./components/Views/Dashboard/Dashboard";
import ResetPassword from "./components/Views/ResetPassword";
import ResetCode from "./components/Views/ResetCode";


class MainSwitch extends Component {

    render() {
        return (
            <Switch>
                <Route exact path={["/", "/home"]} component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/reset_password" component={ResetPassword} />
                <Route exact path="/reset_code" component={ResetCode} />
                {
                    !this.props.user && <Redirect to="/login" />
                }
                <Route exact path="/launches" component={Launches} />
                <Route exact path="/starlink" component={Starlink} />
                <Route exact path="/resources" component={Resources}/>
                <Route exact path="/profile" component={Profile} />
                <Route path="/rocket" component={RocketPage}/>
                <Route path="/capsule" component={CapsulePage}/>
                <Route path="/launchpad" component={PadPage}/>
                <Route path="/landpad" component={PadPage}/>
                <Route path="/dashboard" component={Dashboard}/>
            </Switch>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(MainSwitch);