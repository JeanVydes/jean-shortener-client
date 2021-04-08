import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMe } from './api/Requests';

import Loading from './components/Loading';
import Menu from './components/Menu';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Shortener from './pages/Shortener';
import Dashboard from './pages/Dashboard';

export interface Properties {}
export interface State {
    fetchedUser: boolean
    user: any
    loading: boolean
    error: {
        _: boolean,
        message: string | null
        code: string | null
    }
}

export default class App extends Component<Properties, State> {
    constructor(props: Properties) {
        super(props);

        this.state = {
            fetchedUser: false,
            user: {},
            loading: true,
            error: {
                _: false,
                message: null,
                code: null
            }
        }

        this.setLoading = this.setLoading.bind(this);
        this.setError = this.setError.bind(this);
    }

    public async componentDidMount() {
        const id = localStorage.getItem("cg-auth-id");
        const token = localStorage.getItem("cg-auth-token");

        if (id && token) {
            const userData = await getMe({
                id,
                token
            });

            if(userData.exited_code === 0 && userData.data) {
                sessionStorage.setItem("session-user-data", JSON.stringify(userData.data));

                this.setState((props: any) => ({
                    ...props,
                    fetchedUser: true,
                    user: userData.data
                }));
            } else if(userData.exited_code !== 0) {
                this.setState((props: any) => ({
                    ...props,
                    fetchedUser: true,
                    error: {
                        _: true,
                        message: userData.message,
                        code: null
                    }
                }));
            }
        }
    }

    public setLoading(newState: boolean) {
        this.setState({
            loading: newState
        });
    }

    public setError(newState: boolean) {
        this.setState((props: any) => ({
            ...props,
            error: newState
        }));
    }

    public get getRouting() {
        return (
            <React.Fragment>
                <Router history={createBrowserHistory()}>

                    {this.state.loading && !this.state.fetchedUser && 
                        <Loading />
                    }

                    <Route exact path="/">
                        <Menu loggedIn={this.state.user.id || false} />
                        <Home user={this.state.user} loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} />
                    </Route>
                    <Route exact path="/accounts/signin">
                        <SignIn loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} setAuthentication={this.setAuthentication} />
                    </Route>
                    <Route exact path="/accounts/signup">
                        <SignUp loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} setAuthentication={this.setAuthentication} />
                    </Route>
                    <Route exact path="/dashboard">
                        <Menu loggedIn={this.state.user.id || false} />
                        <Dashboard user={this.state.user} loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} />
                    </Route>
                    <Route exact path="/i/:shortenerID" render={(props: any) => <Shortener {...props} />}></Route>
                </Router>
            </React.Fragment>
        );
    }

    public setAuthentication(userID: string, userToken: string) {
        localStorage.setItem("cg-auth-id", userID);
        localStorage.setItem("cg-auth-token", userToken);

        return true;
    }

    public render() {
        if(this.state.error._) {
            return (
                <React.Fragment>
                    <div className="cg-main-content cg-error">
                        <h1>An error has been ocurred: {this.state.error.message || "Unknown error"} ({this.state.error.code || "Unavailable Reference Error Code"}).</h1>
                    </div>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <div className="cg-main-content">
                        {this.getRouting}
                    </div>
                </React.Fragment>
            );
        }
    }
}