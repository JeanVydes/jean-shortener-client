import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signIn } from '../api/Requests';
import Contact from '../util/Contact';
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
        username_email: any
        password: any
    }
    error: {
        toSignIn: {
            _: boolean,
            message: any
        }
    }
}

export default class SignIn extends Component<Properties, State> {
    constructor(props: Properties) {
        super(props);

        this.state = {
            data: {
                username_email: null,
                password: null
            },
            error: {
                toSignIn: {
                    _: false,
                    message: null
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
        if((!event.target) || (event.target && !(event.target.name || event.target.value)) || (event.target.name || event.target.value) && !["username_email", "password"].includes(event.target.name)) return;

        this.setState((props) => ({
            ...props,
            data: {
                ...props.data,
                [event.target.name]: event.target.value
            }
        }));

        return;
    }

    public async signIn(data: {
        username_email: string
        password: string
    }): Promise<void> {
        if(!(this.state.data.username_email || this.state.data.password)) return this.setState({
            error: {
                toSignIn: {
                    _: true,
                    message: `You don't provided your email and password`
                }
            }
        });
        let _r = await signIn(data);

        // eslint-disable-next-line
        if(_r && (_r.exited_code == 0 && _r.data && _r.data["id"] && _r.data["token"])) {
            localStorage.setItem("cg-auth-id", _r.data["id"]);
            localStorage.setItem("cg-auth-token", _r.data["token"]);

            return window.location.assign(Routes._);
        } else {
            this.setState({
                error: {
                    toSignIn: {
                        _: true,
                        message: _r.message.slice(0, 1).toUpperCase() + _r.message.slice(1, _r.message.length)  || "Unknown error"
                    }
                }
            });
        }

        return;
    }

    public onKeyDown(event: any) {
        if(event.key === "Enter") this.signIn(this.state.data);
    }

    public render() {
        if(!this.props.loading) {
            return (
                <React.Fragment>
                    <div className="sign-container-yQn">
                        <div className="sign-content-rQn signin-content-rQn-margin-top">
                            <div className="signin-form-container-bHg sign-container-style-yQnXoP">
                                <div className="sign-form-header-yvK">
                                    <img id="sign-logo-header-vBl" src={Images.main.logo} alt="" />
                                </div>
                                <div className="sign-inputs-container-pQM">
                                    <input className="sign-input-style-lZh" name="username_email" placeholder="Username or Email" type="text" onChange={(props: any) => this.onChange(props)} autoCorrect="off" autoCapitalize="off" autoComplete="username" maxLength={25} onKeyDown={(event: any) => this.onKeyDown(event)}></input>
                                    <input className="sign-input-style-lZh sign-input-separator-wQM-1" name="password" placeholder="Password" type="password" onChange={(props: any) => this.onChange(props)} autoCorrect="off" autoCapitalize="off" autoComplete="current-password" maxLength={1500} onKeyDown={(event: any) => this.onKeyDown(event)}></input>
                                </div>
                                <div className="sign-form-footer-tQn">
                                    {this.state.error.toSignIn._ &&
                                        <div className="sign-form-error-vQ">
                                            <p id="sign-form-error-text-izL">{this.state.error.toSignIn.message}</p>
                                        </div>
                                    }
                                    <div className="sign-footer-buttons-qH">
                                        <button className="sign-option-button-gQ inline" onClick={() => window.location.assign(Routes.signUp)}>Create Account</button>
                                        <button className="sign-submit-form-button-gQ inline" onClick={() => this.signIn(this.state.data)}>Sign In</button>
                                    </div>
                                </div>
                            </div>

                            <div className="sign-forget-password-container-bHg sign-container-style-yQnXoP">
                                <div className="sign-forget-password-content-iWc">
                                    <p id="sign-forget-password-text-tQ">You forget your password? <a href={`mailto:${Contact.support}`} id="sign-forget-password-contact-yQT">Contact us via email</a></p>
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