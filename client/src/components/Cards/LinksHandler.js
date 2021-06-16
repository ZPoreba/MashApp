import React, { Component } from "react";
import { message } from 'antd';
import { YoutubeOutlined, RedditOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons';

export default class LinksHandler {

    openYoutube = (youtube) => {
        if (youtube) window.open(youtube, '_blank').focus();
        else message.error('Webcast yet not available');
    }

    openReddit = (reddit) => {
        if (reddit) window.open(reddit, '_blank').focus();
        else message.error('Reddit discussion not available');
    }

    openWikipedia = (wikipedia) => {
        if (wikipedia) window.open(wikipedia, '_blank').focus();
        else message.error('Wikipedia is not available');
    }

    renderYoutube = (youtube) => {
        return <YoutubeOutlined className={'active-icon'}
                                onClick={() => this.openYoutube(youtube)}
                                alt={'youtube'}
                                style={{ color: 'red' }} />
    }

    renderReddit = (reddit) => {
        return <RedditOutlined className={'active-icon'}
                               onClick={() => this.openReddit(reddit)}
                               alt={'reddit'}
                               style={{ color: '#FF4500' }} />
    }

    renderWikipedia = (wikipedia) => {
        return <Icon component={() => (<img style={{width: '23px'}} src="/wikipedia.png" />)}
                     onClick={() => this.openWikipedia(wikipedia)}
                     className={'active-icon'}
                     alt={'wikipedia'} />
    }

    renderLinks = (youtube, reddit, wikipedia) => {
        return <div className={'center-content'}>
            {this.renderYoutube(youtube)}
            {this.renderReddit(reddit)}
            {this.renderWikipedia(wikipedia)}
        </div>
    }
}
