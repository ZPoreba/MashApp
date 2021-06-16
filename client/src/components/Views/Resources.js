import React, { Component } from "react";
import {Card, List, Input, Divider, Layout, Tag, Spin} from "antd";
import SpaceXService from "../../services/SpaceXService";
import {handleResponseError} from "../../actions/auth";
import LinksHandler from "../Cards/LinksHandler";
import {Link} from "react-router-dom";
import SubscribeButton from "../SingleComponents/SubscribeButton";
import {connect} from "react-redux";
const { Search } = Input;


class Resources extends Component {

    constructor(props) {
        super(props);
        this.urlParams = new URLSearchParams(window.location.search);
        const page = this.urlParams.get('page');
        const search = this.urlParams.get('search');
        this.state = {
            dataSource: [],
            loading: true,
            page: parseInt(page),
            search: search
        }
        this.initDataSource = [];
        this.linksHandler = new LinksHandler();
        this.stateColors = {
            'active': '#00b56a',
            'retired': '#ff4d4f',
            'under construction': '#7d7d7d'
        }
    }

    onSearch = (value) => {
        this.setURLParams('search', value);
        let newDataSource = this.initDataSource.filter(item => item.title.toUpperCase().includes(value.toUpperCase()));
        this.setState({dataSource: newDataSource});
    }

    componentDidMount() {
        SpaceXService.getResources().then(
            response => {
                this.setState({
                    dataSource: response.data,
                    loading: false
                }, () => {
                    this.initDataSource = this.state.dataSource;
                    if(this.state.search) this.onSearch(this.state.search);
                });
            },
            error => handleResponseError(error)
        )
    }

    renderRocketOrCapsuleItem = (item) => {
        return <List.Item
            key={item.title}
            actions={[
                this.linksHandler.renderWikipedia(item.wikipedia),
                (item.type === 'rocket' && item.active) && <SubscribeButton id={item.id}/>
            ]}
            extra={
                <Link to={`/${item.type}/${item.id}`}>
                    <img
                        width={272}
                        src={item.flickr_images && item.flickr_images[0]}
                    />
                </Link>
            }>
            <Link to={`/${item.type}/${item.id}`}>
                <List.Item.Meta
                    title={
                        <p>{item.title}
                            <Tag
                                color={item.active ? this.stateColors['active']: this.stateColors['retired']}
                                style={{marginLeft: 20}}>{item.active ? 'active': 'inactive'}
                            </Tag>
                        </p>
                    }
                    description={item.description}
                />
            </Link>
        </List.Item>
    }

    renderPadItem = (item, type) => {
        return <List.Item
            key={item.title}
            actions={[
                this.linksHandler.renderWikipedia(item.wikipedia)
            ]}
            extra={
                <Link to={`/${type}/${item.id}`}>
                    <div style={{width: 272}}>
                        <strong>Type:</strong> {type}
                        <br/>
                        <strong>Locality:</strong> {item.locality}
                        <br/>
                        <strong>Region:</strong> {item.region}
                    </div>
                </Link>
            }>
            <Link to={`/${type}/${item.id}`}>
                <List.Item.Meta
                    title={
                        <p>{item.title}
                        <Tag color={this.stateColors[item.status]} style={{marginLeft: 20}}>{item.status}</Tag>
                        </p>
                    }
                    description={item.details}
                />
            </Link>
        </List.Item>
    }

    renderItem = (item) => {
        if (['rocket', 'capsule'].includes(item.type))
            return this.renderRocketOrCapsuleItem(item);
        if (item.locality) {
            let type = (item.launch_successes !== undefined) ? 'launchpad': 'landpad';
            return this.renderPadItem(item, type);
        }
    }

    setURLParams = (name, value) => {
        this.urlParams = new URLSearchParams(window.location.search);
        let query = {};
        let queryURL = "";
        query['search'] = this.urlParams.get('search');
        query['page'] = this.urlParams.get('page');
        query[name] = value;

        Object.entries(query).map(([query_key, query_value]) => {
            if (query_value) queryURL += `&${query_key}=${query_value}`
        });
        queryURL = "?" + queryURL.slice(1);

        if (window.history.pushState) {
            let newURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}${queryURL}`;
            window.history.pushState({path:newURL},'',newURL);
        }
    }

    render() {
        return (
            <div className={"white-background resources-view"}>
                <Spin className={'center-element'} size={"large"} spinning={this.state.loading}/>
                <Card
                    title={<p className={'regular-card-title'}>SpaceX Resources</p>}
                    loading={this.state.loading}>
                    <Search placeholder="input search text" defaultValue={this.state.search} onSearch={this.onSearch} enterButton />
                    <Divider orientation="left" style={{fontWeight: 'lighter'}} >Results</Divider>

                    <Layout style={{height:"60vh", background: 'white'}}>
                        <List
                            itemLayout="vertical"
                            size="large"
                            style={{overflow: 'auto', background: 'white'}}
                            pagination={{
                                pageSize: 8,
                                defaultCurrent: this.state.page,
                                size: 'small',
                                showTotal: total => `Total ${total} items`,
                                onChange: (value) => {this.setURLParams('page', value)}
                            }}
                            dataSource={this.state.dataSource}
                            renderItem={item => this.renderItem(item)}
                        />
                    </Layout>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user,
    };
}

export default connect(mapStateToProps)(Resources);