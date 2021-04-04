import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { getMe } from './api/Requests';

import Loading from './components/Loading';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

export interface Properties { }
export interface State {
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
            user: {

            },
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
            console.log(userData)
            if(userData.exited_code === 0 && userData.data) {
                sessionStorage.setItem("session-user-data", JSON.stringify(userData.data));

                this.setState((props: any) => ({
                    ...props,
                    user: userData.data
                }));
            } else if(userData.exited_code !== 0) {
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

                    {this.state.loading === true &&
                        <Loading />
                    }

                    <Route exact path="/">
                        {this.state.user.id &&
                            `welcome ${this.state.user.username} you actually are logged in with your email (${this.state.user.email}) and you ID is ${this.state.user.id}, actually you ${this.state.user.premium ? "" : "not"} are premium. :`
                        }

                        {!this.state.user.id &&
                            `Please Sign In on http://127.0.0.1:3000/accounts/signin`
                        }
                        {setTimeout(() => {
                            if(this.state.loading === true) {
                                this.setLoading(false)
                            }
                        }, 2000)}
                    </Route>

                    
                    <Route exact path="/accounts/signin">
                        <SignIn loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} />
                    </Route>

                    <Route exact path="/accounts/signup">
                        <SignUp loggedIn={this.state.user.id || false} loading={this.state.loading} setLoading={this.setLoading} setError={this.setError} />
                    </Route>
                </Router>
            </React.Fragment>
        );
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