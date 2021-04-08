import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getShortenedURL } from '../api/Requests';
import Contact from '../util/Contact';
import Images from '../util/Images';
import Routes from '../util/Routes';
import Other from '../util/Other';
 
export interface Properties {
    match: any
}

export interface State {}

export default class SignIn extends Component<Properties, State> {
    public async componentDidMount() {
        document.title = ``;

        if(this.props.match && this.props.match.params && this.props.match.params.shortenerID) {
            let _r = await getShortenedURL({
                shortenerID: this.props.match.params.shortenerID
            });

            if(_r.exited_code !== 0) {
                return window.location.assign(Routes._);
            }

            if(_r && _r.data && _r.data.url) {
                return window.location.assign(_r.data.url);
            }
        }

        return window.location.assign(Routes._);
    }

    public render() {
        return (<></>);
    }
}