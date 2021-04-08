import React, { Component } from 'react';
import Routes from '../util/Routes';
import Other from '../util/Other';
 
export interface Properties {
    user: any
    loggedIn: boolean
    loading: boolean

    setLoading: Function
    setError: Function
}

export interface State {
    activeModule: number
    user: any
    data: {}
    error: {
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
            activeModule: 0,
            user: {},
            data: {},
            error: {
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
        console.log(this.props)
        if(this.props.loggedIn) return window.location.assign(Routes._);

        document.title = `Dashboard -${Other.pageName}`;

        this.props.setLoading(false);
    }

    public getAccountModule() {
        return (
            <React.Fragment>
                <h1>My Account</h1>
            </React.Fragment>
        )
    }

    public getStatisticsModule() {
        return (
            <React.Fragment>
                <h1>Statistics</h1>
            </React.Fragment>
        )
    }

    public render() {
        if(!this.props.loading) {
            return (
                <React.Fragment>
                    <div className="dashboard-container-Iq">
                        <div className="dashboard-content-lH">
                            <div className="dashboard-menu-yXn">
                                <div className="dashboard-menu-content-iQp">
                                    <div className="dashboard-menu-header-hXm">
                                        <h1>{/*this.props.user.name.trim().split(" ")[0]*/}</h1> // Pending to pass user to component
                                    </div>
                                    <ul className="dashboard-menu-option-container-yGVt">
                                        <li className="dashboard-menu-option-tQN">My Account <i className="fas fa-user"></i></li>
                                        <li className="dashboard-menu-option-tQN">Statistics <i className="fas fa-chart-line"></i></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="dashboard-modules-container-hXN">
                                <div className="dashboard-modules-content-ylG">
                                    {this.state.activeModule === 0 && this.getAccountModule()}
                                    {this.state.activeModule === 1 && this.getStatisticsModule()}
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
