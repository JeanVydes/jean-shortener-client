import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMe } from './api/Requests';
import Routes from './util/Routes';

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
    overlay: {
        message: string | null
    }
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
            overlay: {
                message: null
            },
            error: {
                _: false,
                message: null,
                code: null
            }
        }

        this.setLoading = this.setLoading.bind(this);
        this.setError = this.setError.bind(this);
        this.getAuthentication = this.getAuthentication.bind(this);
        this.enableGlobalOverlay = this.enableGlobalOverlay.bind(this);
        this.cancelGlobalOverlay = this.cancelGlobalOverlay.bind(this);
    }

    public async componentDidMount() {
        const { id, token } = this.getAuthentication();

        if (id && token) {
            const userData = await getMe({
                id,
                token
            });

            if(userData.exited_code === 0 && userData.data) {
                sessionStorage.setItem("session-user-data", JSON.stringify(userData.data));

                this.setState((props: any) => ({
                    ...props,
                    user: userData.data
                }));
            } else if(userData.exited_code !== 0) {
                if(userData.message && userData.message === "non-existent user") {
                    this.destroyAuthentication();

                    return window.location.reload();
                }

                this.setState((props: any) => ({
                    ...props,
                    error: {
                        _: true,
                        message: userData.message,
                        code: null
                    }
                }));
            }
        }

        this.setState((props: any) => ({
            ...props,
            fetchedUser: true
        }));
    }

    public setLoading(newState: boolean) {
        this.setState({
            loading: newState
        });
    }

    public setError(newState: boolean, message: string, errorCode: string) {
        this.setState((props: any) => ({
            ...props,
            error: {
                _: newState,
                message:  message,
                code: errorCode
            }
        }));
    }

    public to(route: string) {
        window.location.assign(route);
    }

    public enableGlobalOverlay(message: string) {
        if (!message) return;

        this.setState({
            overlay: {
                message
            }
        });

        let overlay = document.getElementById("overlay-ID-xmQfhxTQAn");
        if (!overlay) return;

        overlay.style.display = "block";
    }

    public cancelGlobalOverlay() {
        let overlay = document.getElementById("overlay-ID-xmQfhxTQAn");
        if (!overlay) return;

        overlay.style.display = "none";
    }

    public get getRouting() {
        return (
            <React.Fragment>
                <Router history={createBrowserHistory()}>

                    {this.state.loading || !this.state.fetchedUser && 
                        <Loading />
                    }

                    <div id="overlay-ID-xmQfhxTQAn" className="overlay-LUtxy">
                        <div className="overlay-content-LZa">
                            <div className="overlay-header-Xnq">
                                <div className="inline">
                                    <h1>Message</h1>
                                </div>
                                <div className="inline">
                                    <span className="overlay-close-YBvG" onClick={this.cancelGlobalOverlay}>X</span>
                                </div>
                            </div>
                            <div className="overlay-message-xmQN">
                                <p>{this.state.overlay.message}</p>
                            </div>
                        </div>
                    </div>

                    <Route exact path="/">
                        <Menu loggedIn={this.state.user.id || false} to={this.to} enableGlobalOverlay={this.enableGlobalOverlay} />
                        <Home user={this.state.user} loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} to={this.to} />
                    </Route>
                    <Route exact path="/accounts/signin">
                        <SignIn loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} setAuthentication={this.setAuthentication} to={this.to} />
                    </Route>
                    <Route exact path="/accounts/signup">
                        <SignUp loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} setAuthentication={this.setAuthentication} to={this.to} />
                    </Route>
                    <Route exact path="/dashboard">
                        <Menu loggedIn={this.state.user.id || false} to={this.to} enableGlobalOverlay={this.enableGlobalOverlay} />
                        <Dashboard id={this.state.user.id || null} token={this.state.user.token || null} loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} getAuthentication={this.getAuthentication} to={this.to} destroyAuthentication={this.destroyAuthentication} enableGlobalOverlay={this.enableGlobalOverlay} />
                    </Route>
                    <Route exact path="/c/:shortenerID" render={(props: any) => <Shortener {...props} to={this.to} />}></Route>
                </Router>
            </React.Fragment>
        );
    }

    public setAuthentication(userID: string, userToken: string) {
        localStorage.setItem("cg-auth-id", userID);
        localStorage.setItem("cg-auth-token", userToken);

        return true;
    }

    public getAuthentication() {
        localStorage.getItem("cg-auth-id");
        localStorage.getItem("cg-auth-token");

        return {
            id: localStorage.getItem("cg-auth-id") || null,
            token: localStorage.getItem("cg-auth-token") || null
        };
    }

    public destroyAuthentication() {
        localStorage.removeItem("cg-auth-id");
        localStorage.removeItem("cg-auth-token");

        return window.location.assign(Routes._);
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