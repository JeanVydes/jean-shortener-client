import React, { Component } from 'react';
import { createShortenedURL } from '../api/Requests';
import Messages from '../util/Messages';
//import Contact from '../util/Contact';
import Routes from '../util/Routes';
//import Images from '../util/Images';
import Other from '../util/Other';
 
export interface Properties {
    user: any
    loggedIn: boolean
    loading: boolean

    setLoading: Function
    setError: Function
}

export interface State {
    data: {
        shorten: {
            url: string | any
            is_vanity: boolean
            vanity_url: string | null
        }
    }
    error: {
        _: {
            _: boolean,
            message: any
        }
    }
    shortenedURL: string | null
}

export default class Home extends Component<Properties, State> {
    constructor(props: Properties) {
        super(props);

        this.state = {
            data: {
                shorten: {
                    url: null,
                    is_vanity: false,
                    vanity_url: null
                }
            },
            error: {
                _: {
                    _: false,
                    message: null
                }
            },
            shortenedURL: null
        }
    }

    public async componentDidMount() {
        if(this.props.loggedIn) return window.location.assign(Routes._);

        document.title = `${Other.pageName}`;

        this.props.setLoading(false);
    }

    public async onChange(event: {
        target: any
    }): Promise<void> {
        // eslint-disable-next-line
        if((!event.target) || (event.target && !(event.target.name || event.target.value)) || (event.target.name || event.target.value) && !["url"].includes(event.target.name)) return;

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

    public async shorten(data: {
        user_id: any
        user_token: any
        url: string
        is_vanity: boolean
        vanity_url: string | null
    }) {
        if(!data.url) {
            return this.setState({
                shortenedURL: null,
                error: {
                    _: {
                        _: true,
                        message: "You missed your URL for shorten it"
                    }
                }
            });
        }

        let _r = await createShortenedURL({
            user_id: data.user_id || null,
            user_token: data.user_token || null,
            url: data.url,
            is_vanity: data.is_vanity,
            vanity_url: data.vanity_url
        });

        let error = null;
        if(_r.data && (_r.data.code || _r.data.vanity_url)) {
            let urlWay = null;
            if(_r.data.vanity_url) {
                urlWay = _r.data.vanity_url;
            } else {
                urlWay = _r.data.code;
            }

            return this.setState({
                shortenedURL: `${Routes.shortenedURLDomain}/${urlWay}`,
                error: {
                    _: {
                        _: false,
                        message: null
                    }
                }
            });
        } else if(_r.exited_code !== 0 && _r.message && _r.message === "invalid url") {
            error = "This URL is invalid, example of good format: https://jeanvides.me"
        } else {
            error = _r.message || Messages.error.unknown;
        }

        return this.setState({
            shortenedURL: null,
            error: {
                _: {
                    _: true,
                    message: error
                }
            }
        });
    }

    public render() {
        if(!this.props.loading) {
            return (
                <React.Fragment>
                    <div className="home-container-tC">
                        <div className="home-content-yX">
                            <div className="home-shorten-container-Lb">
                                 <div className="home-shorten-content-gQ">
                                    <input id="home-shorten-input-url-yXnqM" className="home-shorten-input-hVV" name="url" placeholder="Your URL here" maxLength={5000} onChange={(props) => this.onChange(props)} required></input>
                                    <button className="home-shorten-url-button-tXnL" onClick={() => this.shorten({
                                        ...this.state.data.shorten,
                                        user_id: (this.props.user && this.props.user.id) || null,
                                        user_token: (this.props.user && this.props.user.token) || null,
                                        //@ts-ignore
                                        url: (document.getElementById("home-shorten-input-url-yXnqM") && document.getElementById("home-shorten-input-url-yXnqM").value) || null
                                    })}>Get Link</button>

                                    <br/>
                                    <div className="home-shorten-input-labels-jZn">
                                        {this.state.error._ && this.state.error._._ &&
                                            <label className="home-shorten-label-error-url-yXn" htmlFor="home-shorten-input-url-yXnqM">{this.state.error._.message || Messages.error.unknown}</label>
                                        }
                                        {this.state.shortenedURL &&
                                            <label className="home-shorten-label-url-shortened-kTb" 
                                            htmlFor="home-shorten-input-url-yXnqM">Your shortened URL is <span className="home-shorten-url-xQB" onClick={() => window.location.assign(this.state.shortenedURL || "") }>{this.state.shortenedURL}</span></label>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="home-wave-container-uRxH">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                                    <path fill="#a269db" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,224C384,224,480,256,576,266.7C672,277,768,267,864,272C960,277,1056,299,1152,293.3C1248,288,1344,256,1392,240L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                                </svg>
                            </div>

                            <div className="home-content-without-wave-yXv">
                                <div className="home-shorten-header-Mq">
                                    <h1>Jean Shortener</h1>
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