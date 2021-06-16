import React, { Component } from "react";
import QueueAnim from 'rc-queue-anim';
import {RocketOutlined} from "@ant-design/icons";


export default class Home extends Component {

    render() {
        return (
            <div>
                <QueueAnim delay={[0, 300]} duration={[1500, 0]} animConfig={{ opacity:[1, 0] }} >
                    <div key="1"
                         style={{height: 'calc(100vh - 64px)', width: '100%', backgroundImage: "url(/home-background.jpg)"}}>
                        <QueueAnim delay={[150, 500]} duration={[1000, 0]} type={'bottom'}>
                            <div key="2" style={{fontSize: '200px', color: 'white', position: 'absolute', left: '50%', bottom: '30%', transform: "translate(-50%, -50%)"}}>
                                <RocketOutlined />
                                <p className={'home-logo'} >MashApp</p>
                            </div>
                        </QueueAnim>
                    </div>
                </QueueAnim>
            </div>
        );
    }
}