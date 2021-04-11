import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getDataForDashboard, createShortenedURL, deleteShortenedURL } from '../api/Requests';
import Routes from '../util/Routes';
import Other from '../util/Other';
import Messages from '../util/Messages';

export interface Properties {
    id: string
    token: string
    loggedIn: boolean
    loading: boolean

    setLoading: Function
    setError: Function

    getAuthentication: Function
    destroyAuthentication: Function

    enableGlobalOverlay: Function

    to: Function
}

export interface State {
    user: any
    data: any
    activeModule: number
    overlay: {
        code: string | null
    },
    shorten: any,
    error: {
        shorten: {
            _: boolean
            message: string | any
        }
        urls: {
            _: boolean
            message: string | any
        }
        myAccount: {
            inputs: {
                name: {
                    _: boolean
                    message: string | null
                }
                username: {
                    _: boolean
                    message: string | null
                }
                password: {
                    _: boolean
                    message: string | null
                }
            }
        }
    }
}

export default class Dashboard extends Component<Properties, State> {
    constructor(props: Properties) {
        super(props);

        this.state = {
            user: {},
            data: {},
            activeModule: 0,
            overlay: {
                code: null
            },
            shorten: {
                shortenedURL: null,
                button: () => { return (<React.Fragment>Get Link <i className="fas fa-link"></i></React.Fragment>) },
            },
            error: {
                shorten: {
                    _: false,
                    message: null
                },
                urls: {
                    _: false,
                    message: null,
                },
                myAccount: {
                    inputs: {
                        name: {
                            _: false,
                            message: null
                        },
                        username: {
                            _: false,
                            message: null
                        },
                        password: {
                            _: false,
                            message: null
                        }
                    }
                }
            }
        }
    }

    public async componentDidMount() {
        document.title = `Dashboard - ${Other.pageName}`;

        let { id, token } = this.props.getAuthentication();
        let _r = await getDataForDashboard({
            id,
            token
        });

        if (_r.exited_code !== 0 || !_r.data || (_r.data && !_r.data.id)) {
            return this.props.to(Routes._);
        }

        this.setState({
            user: _r.data
        });

        this.props.setLoading(false);

        return true;
    }

    public switchModule(id: number) {
        if(id === 2 && (this.state.user && !this.state.user.premium)) {
            return this.props.enableGlobalOverlay("You cannot create vanity URL, if you want to made it you need to buy premium suscription for $4.99");
        }

        this.setState((props) => ({
            ...props,
            activeModule: id
        }));
    }

    public getAccountModule() {
        return (
            <React.Fragment>
                <div className="dashboard-myaccount-module-xT">
                    <div className="dashboard-myaccount-content-mB">
                        <div className="dashboard-myaccount-info-bQN">
                            <div className="dashboard-myaccount-info-header-bQN">
                                <h1 className="dashboard-myaccount-header-text-BcM">Profile</h1>
                            </div>
                            <div className="dashboard-myaccount-info-data-bQN">
                                <section className="dashboard-myaccount-type-container-xN">
                                    <div className="dashboard-myaccount-data-type-htq inline">
                                        <p>Name</p>
                                    </div>
                                    <div className="dashboard-myaccount-data-value-xM inline">
                                        <p>{this.state.user.name && this.state.user.name.slice(0, 50)}</p>
                                    </div>
                                </section>
                                <section className="dashboard-myaccount-type-container-xN">
                                    <div className="dashboard-myaccount-data-type-htq inline">
                                        <p>Username</p>
                                    </div>
                                    <div className="dashboard-myaccount-data-value-xM inline">
                                        <p>{this.state.user.username && `@${this.state.user.username.slice(0, 25)}`}</p>
                                    </div>
                                </section>
                                <section className="dashboard-myaccount-type-container-xN">
                                    <div className="dashboard-myaccount-data-type-htq inline">
                                        <p>Email</p>
                                    </div>
                                    <div className="dashboard-myaccount-data-value-xM inline">
                                        <p>{this.state.user.email && this.state.user.email.slice(0, 100)}</p>
                                    </div>
                                </section>
                                <section className="dashboard-myaccount-type-container-xN">
                                    <div className="dashboard-myaccount-data-type-htq inline">
                                        <p>Plan</p>
                                    </div>
                                    <div className="dashboard-myaccount-data-value-xM inline">
                                        <p>{this.state.user.premium ? "Premium" : "Free"}</p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-myaccount-content-mB dashboard-privacy-container-xQ">
                        <h1>You need help about your privacy? <Link to={Routes.privacy} className="dashboard-help-about-privacy-href-Mq" onClick={() => this.props.to(Routes.privacy)}>Check out our terms here</Link></h1>
                    </div>

                    <div className="dashboard-logout-container-cmY">
                        <button className="dashboard-logout-button-xQ" onClick={() => {
                            this.props.destroyAuthentication();
                            let button = document.getElementsByClassName("dashboard-logout-button-xQ")[0];
                            if(!button) return;
                            //@ts-ignore
                            button.classList.add("dashboard-logout-button-xmQ-pressed");
                        }}>Logout</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    public getURLSModule() {
        return (
            <React.Fragment>
                <div className="dashboard-urls-module-tBR">
                    <div className="dashboard-urls-module-content-nBqv">
                        <div className="dashboard-urls-module-header-QbJ">
                            <h1>Your URL's <button id="dashboard-urls-refresh-button-lOXuy" className="dashboard-urls-refresh-button-xNMq" onClick={() => this.refreshInterative()}><i className="fas fa-sync-alt"></i></button></h1>
                        </div>

                        {this.state.error.urls && this.state.error.urls._ &&
                            <div className="dashboard-urls-module-error-nxVQ">
                                {this.state.error.urls.message.slice(0, 1).toUpperCase() + this.state.error.urls.message.slice(1)}
                            </div>
                        }

                        <div className="dashboard-urls-module-urls-table-QbJ">
                            <table className="dashboard-urls-table-nXv">
                                <tr className="dashboard-urls-table-row-Bq dashboard-urls-table-header-NXy">
                                    <th className="dashboard-urls-table-headers-text-NzB">Link</th>
                                    <th className="dashboard-urls-table-headers-text-NzB">Code</th>
                                    <th className="dashboard-urls-table-headers-text-NzB">Vanity</th>
                                    <th className="dashboard-urls-table-headers-text-NzB">Options</th>
                                </tr>
                                {this.getURLsPerRow().map((element: any) => element)}
                            </table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    public getCreateVanityURLModule() {
        return (
            <React.Fragment>
                <div className="dashboard-shortener-xZn">
                    <div className="dashboard-shortener-header-zNq">
                        <h1>Vanity URL</h1>
                        <p>Watch all your URLS in My URL's</p>
                    </div>
                    <div className="dashboard-shorten-inputs-container-xMQ">
                        <input id="dashboard-shorten-input-url-yXnqM" className="dashboard-shorten-input-cnQ" name="url" placeholder="Your URL here" maxLength={5000} onChange={(props) => this.onChange(props)} required></input>
                        <input id="dashboard-shorten-input-vanity-url-mLjx" className="dashboard-shorten-input-cnQ" name="vanity_url" placeholder="Your Vanity Name" maxLength={100} onChange={(props) => this.onChange(props)} required></input>

                        <div className="dashboard-shorten-input-labels-xNQ">
                            {this.state.error.shorten._ &&
                                <label className="dashboard-shorten-label-error-url-QNxh" htmlFor="dashboard-shorten-input-vanity-url-mLjx">{this.state.error.shorten.message.slice(0, 1).toUpperCase() + this.state.error.shorten.message.slice(1) || Messages.error.unknown}</label>
                            }
                            {this.state.shorten.shortenedURL &&
                                <label className="dashboard-shorten-label-url-shortened-yQN" htmlFor="dashboard-shorten-input-vanity-url-mLjx">Your shortened URL is <span className="dashboard-shorten-url-xQB" onClick={() => this.props.to(this.state.shorten.shortenedURL || "")}>{this.state.shorten.shortenedURL}</span></label>
                            }
                        </div>
                    </div>
                    <div className="dashboard-shorten-button-container-bXw">
                        <button className="dashboard-shorten-url-button-tXRqn" onClick={() => this.shorten({
                            ...this.state.data.shorten,
                            user_id: (this.props.id) || null,
                            user_token: (this.props.token) || null,
                            //@ts-ignore
                            vanity_url: (document.getElementById("dashboard-shorten-input-vanity-url-mLjx") && document.getElementById("dashboard-shorten-input-vanity-url-mLjx").value) || null,
                            //@ts-ignore
                            url: (document.getElementById("dashboard-shorten-input-url-yXnqM") && document.getElementById("dashboard-shorten-input-url-yXnqM").value) || null
                        })}>{this.state.shorten.button()}</button>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    public getURLsPerRow(): any[] {
        if (!this.state.user || (this.state.user && !this.state.user.urls)) return [];

        let urlRows: any[] = [];


        for (let URL of this.state.user.urls) {
            if (URL.url.length > 25) URL.url = URL.url.slice(0, 25) + "..."
            urlRows.push(
                <React.Fragment>
                    <tr className="dashboard-urls-table-row-Bq">
                        <th className="dashboard-urls-table-element-znQB no-align-to-left">{URL.url}</th>
                        <th className="dashboard-urls-table-element-znQB no-align-to-left">{URL.code ? `${URL.code}`: "No"}</th>
                        <th className="dashboard-urls-table-element-znQB no-align-to-left">{URL.is_vanity ? `${URL.vanity_url}` : "No"}</th>
                        <th className="dashboard-urls-table-element-znQB no-align-to-left">
                            <button className="dashboard-urls-table-delete-button-XbQ" onClick={() => this.enableOverlayConfirmation(URL.code || (URL.is_vanity && URL.vanity_url))}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </th>
                    </tr>
                </React.Fragment>
            );
        }

        return urlRows;
    }

    public enableOverlayConfirmation(code: string) {
        if (!code) return;

        this.setState({
            overlay: {
                code
            }
        });

        let overlay = document.getElementById("dashboard-overlay-xmQYx");
        if (!overlay) return;

        overlay.style.display = "block";
    }

    public cancelOverlayConfirmation() {
        let overlay = document.getElementById("dashboard-overlay-xmQYx");
        if (!overlay) return;

        overlay.style.display = "none";
    }

    public async shorten(data: {
        user_id: any
        user_token: any
        url: string
        vanity_url: string
    }) {
        if(this.state.shorten.button() === (<React.Fragment><i className="fas fa-spinner home-shorten-button-loading-xmQy"></i></React.Fragment>)) return;

        this.setState((props: any) => ({
            ...props,
            shorten: {
                ...props.shorten,
                button: () => { return (<React.Fragment><i className="fas fa-spinner home-shorten-button-loading-xmQy"></i></React.Fragment>) }
            }
        }));

        if(!data.url) {
            return this.setState((props: any) => ({
                ...props,
                shorten: {
                    ...props.shorten,
                    shortenedURL: null,
                    button: () => { return (<React.Fragment>Get Link <i className="fas fa-link"></i></React.Fragment>) },
                    error: {
                        shorten: {
                            _: true,
                            message: "You missed your URL for shorten it"
                        }
                    }
                }
            }));
        } else if(!data.vanity_url) {
            return this.setState((props: any) => ({
                ...props,
                shorten: {
                    ...props.shorten,
                    shortenedURL: null,
                    button: () => { return (<React.Fragment>Get Link <i className="fas fa-link"></i></React.Fragment>) },
                    error: {
                        shorten: {
                            _: true,
                            message: "You need to provide an vanity name to assign to your URL"
                        }
                    }
                }
            }));
        }

        let _r = await createShortenedURL({
            user_id: data.user_id || null,
            user_token: data.user_token || null,
            url: data.url,
            is_vanity: true,
            vanity_url: data.vanity_url
        });


        let error: any = null;
        if (_r.data && _r.data.vanity_url) {
            console.log("yes")
            return this.setState((props: any) => ({
                ...props,
                shorten: {
                    ...props.shorten,
                    shortenedURL: `${Routes.shortenedURLDomain}/${_r.data.vanity_url}`,
                    button: () => { return (<React.Fragment>Get Link <i className="fas fa-link"></i></React.Fragment>) },
                },
                error: {
                    ...props.error,
                    shorten: {
                        _: false,
                        message: "You need to provide the url to shorten and the name of this vanity URL"
                    }
                }
            }));
        } else if (_r.exited_code !== 0 && _r.message && _r.message === "invalid url") {
            error = "This URL is invalid, example of good format: https://jeanvides.me"
        } else {
            error = _r.message || Messages.error.unknown;
        }

        return this.setState((props: any) => ({
            ...props,
            shorten: {
                shortenedURL: null,
                button: () => { return (<React.Fragment>Get Link <i className="fas fa-link"></i></React.Fragment>) },
            },
            error: {
                ...props.error,
                shorten: {
                    _: true,
                    message: error
                }
            }
        }));
    }

    public async deleteURL(code: string) {
        let _r = await deleteShortenedURL({
            user_id: this.state.user.id || null,
            token: this.state.user.token || null,
            code
        });
        console.log(_r)

        if (_r && _r.exited_code !== 0) {
            return this.setState((props: any) => ({
                ...props,
                error: {
                    urls: {
                        _: true,
                        message: _r.message || Messages.error.unknown
                    }
                }
            }));
        }

        let overlay = document.getElementById("dashboard-overlay-xmQYx");
        if (!overlay) return;

        overlay.style.display = "none";

        return this.setState((props: any) => ({
            ...props,
            user: {
                ...props.user,
                urls: this.state.user.urls.filter((url: any) => url.code !== code && url.vanity_url !== code)
            },
            error: {
                urls: {
                    _: false,
                    message: null
                }
            }
        }));
    }

    public async refreshInterative() {
        let button: any = document.getElementById("dashboard-urls-refresh-button-lOXuy");
        if(!button) return;

        //@ts-ignore
        document.body.style.cursor = "wait";
        button.onClick = () => {};
        button.classList.add("loading-animation-xmQ");

        let loaded = await this.componentDidMount();
        if(!loaded) return;

        //@ts-ignore
        document.body.style.cursor = "auto";
        button.onClick = () => { this.refreshInterative() };
        button.classList.remove("loading-animation-xmQ");
    }

    public async onChange(event: {
        target: any
    }): Promise<void> {
        // eslint-disable-next-line
        if ((!event.target) || (event.target && !(event.target.name || event.target.value)) || (event.target.name || event.target.value) && !["url", "vanity_url"].includes(event.target.name)) return;

        this.setState((props) => ({
            ...props,
            data: {
                ...props.data,
                shorten: {
                    ...props.data.shorten,
                    [event.target.name]: event.target.value
                }
            }
        }));

        return;
    }

    public render() {
        if (!this.props.loading) {
            return (
                <React.Fragment>
                    <div className="dashboard-container-Iq">
                        <div className="dashboard-content-lH">
                            <div className="dashboard-menu-yXn">
                                <div className="dashboard-menu-content-iQp">
                                    <div className="dashboard-menu-header-hXm">
                                        <h1 className="dashboard-menu-message-yX">Welcome <span className="dashboard-menu-user-name-yXnq">{this.state.user && this.state.user.name && this.state.user.name.trim().split(" ")[0] || "Unknown"}</span></h1>
                                    </div>
                                    <ul className="dashboard-menu-option-container-yGVt">
                                        <li className="dashboard-menu-option-tQN" onClick={() => this.switchModule(0)}>My Account <i className="fas fa-user"></i></li>
                                        <li className="dashboard-menu-option-tQN" onClick={() => this.switchModule(1)}>My URL's <i className="fas fa-chart-line"></i></li>
                                        <li className="dashboard-menu-option-tQN" onClick={() => this.switchModule(2)}>Vanity URL <i className="fas fa-fire"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="dashboard-modules-container-hXN">
                                <div className="dashboard-modules-content-ylG">
                                    {this.state.activeModule === 0 && this.getAccountModule()}
                                    {this.state.activeModule === 1 && this.getURLSModule()}
                                    {this.state.activeModule === 2 && this.getCreateVanityURLModule()}
                                </div>
                            </div>       
                            <div id="dashboard-overlay-xmQYx" className="dashboard-delete-url-overlay-xbQ">
                                <div className="dashboard-delete-url-overlay-content-bQN">
                                    <div className="dashboard-delete-url-overlay-header-xBK">
                                        <div className="inline">
                                            <h1>Confirmation</h1>
                                        </div>
                                        <div className="inline">
                                            <span className="dashboard-cancel-url-deletion-xmQ" onClick={this.cancelOverlayConfirmation}>X</span>
                                        </div>
                                    </div>
                                    <div className="dashboard-delete-url-overlay-message-xBK">
                                        <p>Are you sure to delete this URL shortened?</p>
                                    </div>
                                    <div className="dashboard-delete-url-overlay-buttons-xBK">
                                        <button onClick={() => this.deleteURL(`${this.state.overlay.code || null}`)}>Delete</button>
                                    </div>
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