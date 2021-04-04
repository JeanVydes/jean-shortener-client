import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createUser } from '../api/Requests';
import Messages from '../util/Messages';
import Routes from '../util/Routes';
import Images from '../util/Images';
import Other from '../util/Other';
 
export interface Properties {
    loggedIn: boolean
    loading: boolean

    setLoading: Function
    setError: Function
}

export interface State {
    data: {
        name: string | null
        username: string | null
        email: string | null
        password: string | null
        confirm_password: string | null
    }
    error: {
        _: string | null
        inputs: {
            name: {
                _: boolean,
                message: string | null
            }
            username: {
                _: boolean
                message: string | null
            }
            email: {
                _: boolean
                message: string | null
            }
            password: {
                _: boolean
                message: string | null
            }
            confirm_password: {
                _: boolean
                message: string | null
            }
        }
    }
}

export default class SignIn extends Component<Properties, State> {
    constructor(props: Properties) {
        super(props);

        this.state = {
            data: {
                name: null,
                username: null,
                email: null,
                password: null,
                confirm_password: null
            },
            error: {
                _: null,
                inputs: {
                    name: {
                        _: false,
                        message: null
                    },
                    username: {
                        _: false,
                        message: null
                    },
                    email: {
                        _: false,
                        message: null
                    },
                    password: {
                        _: false,
                        message: null
                    },
                    confirm_password: {
                        _: false,
                        message: null
                    }
                }
            }
        }
    }

    public async componentDidMount() {
        if(this.props.loggedIn) return window.location.assign(Routes._);

        document.title = `Sign up - ${Other.pageName}`;

        this.props.setLoading(false);
    }

    public async onChange(event: {
        target: any
    }): Promise<void> {
        // eslint-disable-next-line
        if((!event.target) || (event.target && !(event.target.name || event.target.value)) || (event.target.name || event.target.value) && !["name", "username", "email", "password", "confirm_password"].includes(event.target.name)) return;

        this.setState((props) => ({
            ...props,
            data: {
                ...props.data,
                [event.target.name]: event.target.value
            }
        }));

        return;
    }

    public async signUp(data: {
        name: any
        username: any
        email: any
        password: any
        confirm_password: any
    }): Promise<void> {
        let errors: any = {
            name: null,
            username: null,
            email: null,
            password: null,
            confirm_password: null
        }

        if(!data.name) {
            errors.name = `you need to provide your name`;
        } else {
            if(data.name.length >= 100) {
                errors.name = `your name must contain less than 100 letters`;
            } else if(data.name.length <= 1) {
                errors.name = `your name must contain more than 1 letter`;
            }
        }

        if(!data.username) {
            errors.username = `you need to create a new username for you`;
        } else {
            const usernameRegexp = new RegExp("^[A-Za-z0-9_]+$");
            if(data.username.length >= 25) {
                errors.username = `your username must contain less than 25 letters`;
            } else if(data.username.length <= 3) {
                errors.username = `your username must contain more than 3 letter`;
            } else if(!usernameRegexp.test(data.username)) {
                errors.username = `your username only can contain letters, numbers and underscores`;
            }
        }

        if(!data.email) {
            errors.email = `you need provide your email address`;
        } else {
            // eslint-disable-next-line
            const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if(!emailRegexp.test(data.email)) {
                errors.email = `your email address is invalid`;
            }
        }

        if(!data.password) {
            errors.password = `you need provide a password`;
        } else {
            if(data.password.length >= 1500) {
                errors.password = `your password must contain less than 1500 letters`;
            } else if(data.password.length <= 8) {
                errors.password = `your password must contain more than 8 letter`;
            }
        }

        if(!data.confirm_password) {
            errors.confirm_password = `you need to confirm your password`;
        } else {
            if(data.confirm_password !== data.password) {
                errors.confirm_password = `the confirm password doesn't match with your password`;
            }
        }

        if(errors.name || errors.username || errors.email || errors.password || errors.confirm_password) {
            let inputErrors: any = {
                name: {
                    _: false,
                    message: null
                },
                username: {
                    _: false,
                    message: null
                },
                email: {
                    _: false,
                    message: null
                },
                password: {
                    _: false,
                    message: null
                },
                confirm_password: {
                    _: false,
                    message: null
                }
            }

            for(let key of Object.keys(errors)) {
                if(errors[key]) {
                    inputErrors[key] = {
                        _: true,
                        message: errors[key] || Messages.error.unknown
                    }
                }
            }

            this.setState({
                error: {
                    _: null,
                    inputs: inputErrors
                }
            });
        }

        let _r = await createUser(data);

        if(_r && (_r.exited_code === 0 && _r.data && _r.data["id"] && _r.data["token"])) {
            localStorage.setItem("cg-auth-id", _r.data["id"]);
            localStorage.setItem("cg-auth-token", _r.data["token"]);

            return window.location.assign(Routes._);
        } else if(_r.exited_code === 1) {
            this.setState((props: any) => ({
                ...props,
                error: {
                    _: _r.message || Messages.error.unknown,
                    ...props.error.inputs
                }
            }));
        }

        return;
    }

    public onKeyDown(event: any) {
        if(event.key === "Enter") this.signUp(this.state.data);
    }

    public render() {
        if(!this.props.loading) {
            return (
                <React.Fragment>
                    <div className="sign-container-yQn">
                        <div className="sign-content-rQn signup-content-rQn-margin-top">
                            <div className="signup-form-container-bHg sign-container-style-yQnXoP">
                                <div className="sign-form-header-yvK">
                                    <img id="sign-logo-header-vBl" src={Images.main.logo} alt="" />
                                </div>
                                <div className="sign-inputs-container-pQM">
                                    <input id="signup-input-name-Qu" className="sign-input-style-lZh" name="name" placeholder="Name" type="text" onChange={(props: any) => this.onChange(props)} autoCorrect="off" autoCapitalize="off" autoComplete="name" maxLength={100} onKeyDown={(event: any) => this.onKeyDown(event)}></input>
                                    <br />
                                    <div className="signup-label-error-qYx">
                                        <label className="signup-label-error-item-rMQ" htmlFor="signup-input-name-Qu">
                                            {this.state.error.inputs.name._ && `${(this.state.error.inputs.name.message && (this.state.error.inputs.name.message.slice(0, 1).toUpperCase() + this.state.error.inputs.name.message.slice(1))) || Messages.error.unknown}`}
                                        </label>
                                    </div>

                                    <input id="signup-input-username-bK" className="sign-input-style-lZh sign-input-separator-wQM-2" name="username" placeholder="Username" type="text" onChange={(props: any) => this.onChange(props)} autoCorrect="off" autoCapitalize="off" autoComplete="username" maxLength={25} onKeyDown={(event: any) => this.onKeyDown(event)}></input>
                                    <br />
                                    <div className="signup-label-error-qYx">
                                        <label className="signup-label-error-item-rMQ" htmlFor="signup-input-username-bK">
                                            {this.state.error.inputs.username._ && `${(this.state.error.inputs.username.message && (this.state.error.inputs.username.message.slice(0, 1).toUpperCase() + this.state.error.inputs.username.message.slice(1))) || Messages.error.unknown}`}
                                        </label>
                                    </div>

                                    <input id="signup-input-email-yi" className="sign-input-style-lZh sign-input-separator-wQM-2" name="email" placeholder="Email" type="text" onChange={(props: any) => this.onChange(props)} autoCorrect="off" autoCapitalize="off" autoComplete="email" maxLength={500} onKeyDown={(event: any) => this.onKeyDown(event)}></input>
                                    <br />
                                    <div className="signup-label-error-qYx">
                                        <label className="signup-label-error-item-rMQ" htmlFor="signup-input-email-yi">
                                            {this.state.error.inputs.email._ && `${(this.state.error.inputs.email.message && (this.state.error.inputs.email.message.slice(0, 1).toUpperCase() + this.state.error.inputs.email.message.slice(1))) || Messages.error.unknown}`}
                                        </label>
                                    </div>

                                    <input id="signup-input-password-jH" className="sign-input-style-lZh sign-input-separator-wQM-2" name="password" placeholder="Password" type="password" onChange={(props: any) => this.onChange(props)} autoCorrect="off" autoCapitalize="off" autoComplete="current-password" maxLength={1500} onKeyDown={(event: any) => this.onKeyDown(event)}></input>
                                    <br />
                                    <div className="signup-label-error-qYx">
                                        <label className="signup-label-error-item-rMQ" htmlFor="signup-input-password-jH">
                                            {this.state.error.inputs.password._ && `${(this.state.error.inputs.password.message && (this.state.error.inputs.password.message.slice(0, 1).toUpperCase() + this.state.error.inputs.password.message.slice(1))) || Messages.error.unknown}`}
                                        </label>
                                    </div>

                                    <input id="signup-input-confirm-password-yX" className="sign-input-style-lZh sign-input-separator-wQM-2" name="confirm_password" placeholder="Confirm Password" type="password" onChange={(props: any) => this.onChange(props)} autoCorrect="off" autoCapitalize="off" autoComplete="current-password" maxLength={1500} onKeyDown={(event: any) => this.onKeyDown(event)}></input>
                                    <br />
                                    <div className="signup-label-error-qYx">
                                        <label className="signup-label-error-item-rMQ" htmlFor="signup-input-confirm-password-yX">
                                            {this.state.error.inputs.confirm_password._ && `${(this.state.error.inputs.confirm_password.message && (this.state.error.inputs.confirm_password.message.slice(0, 1).toUpperCase() + this.state.error.inputs.confirm_password.message.slice(1))) || Messages.error.unknown}`}
                                        </label>
                                    </div>
                                </div>
                                <div className="sign-form-footer-tQn">
                                    <div className="sign-footer-buttons-qH">
                                        <button className="sign-option-button-gQ inline" onClick={() => window.location.assign(Routes.signIn)}>Sign In</button>
                                        <button className="sign-submit-form-button-gQ inline" onClick={() => this.signUp(this.state.data)}>Create Account</button>
                                    </div>
                                </div>
                            </div>

                            <div className="sign-help-container-qNA sign-container-style-yQnXoP">
                                <div className="sign-help-content-tMx">
                                    <p id="sign-help-text-xmQ">Need help? <Link to={Routes.help} id="sign-help-contact-vmQ">Visit our support center</Link></p>
                                </div>
                            </div>

                            <div className="sign-options-links-qH">
                                <div className="sign-regional-options-yQN sign-options-style-Yq inline">
                                    <div className="sign-language-option-container-qY">
                                        English (States United)
                                    </div>
                                </div>

                                <div className="sign-helpful-links-yQN sign-options-style-Yq inline">
                                    <Link to={Routes.help} className="sign-helpful-link-item-yRv inline">Help</Link>
                                    <Link to={Routes.privacy} className="sign-helpful-link-item-yRv inline sign-helpful-link-separator-yQ">Privacy</Link>
                                    <Link to={Routes.terms} className="sign-helpful-link-item-yRv inline">Terms</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        } else {
            return (<></>)
        }
    }
}