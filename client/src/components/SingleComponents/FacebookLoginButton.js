import {Component} from "react";
import {Button} from "antd";
import { FacebookFilled } from '@ant-design/icons';


export default class FacebookLoginButton extends Component {

    facebookLogin = () => {
        if (!window.FB) return;

        window.FB.getLoginStatus(response => {
            if (response.status === 'connected') {
                this.facebookLoginHandler(response);
            } else {
                window.FB.login(this.facebookLoginHandler);
            }
        },);
    }

    facebookLoginHandler = response => {
        if (response.status === 'connected') {
            window.FB.api('/me', userData => {
                let result = {
                    ...response,
                    user: userData
                };
                this.props.onLogin(true, result.authResponse);
            });
        } else {
            this.props.onLogin(false);
        }
    }

    render() {
        return (
            <Button
                className={'facebook-login-button'}
                icon={<FacebookFilled style={{color: '#1890ff'}}/>}
                onClick={this.facebookLogin}>
                Access with Facebook
            </Button>
        );
    }
}