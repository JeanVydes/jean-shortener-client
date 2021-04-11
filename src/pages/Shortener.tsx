import React, { Component } from 'react';
import { getShortenedURL } from '../api/Requests';
import Routes from '../util/Routes';
 
export interface Properties {
    match: any
    to: Function
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
                return this.props.to(Routes._);
            }

            if(_r && _r.data && _r.data.url) {
                return this.props.to(_r.data.url);
            }
        }

        return this.props.to(Routes._);
    }

    public render() {
        return (<></>);
    }
}