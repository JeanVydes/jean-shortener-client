import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Contact from '../util/Contact';
import Images from '../util/Images';
import Routes from '../util/Routes';

export interface Properties {
    loggedIn: boolean

    enableGlobalOverlay: Function

    to: Function
}

export interface State { }

export default class Loading extends Component<Properties, State> {
    public render() {
        return (
            <React.Fragment>
                <nav className="navbar" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <Link to={Routes._} className="navbar-item">
                            <img src={Images.main.logo} width="auto" alt="" />
                        </Link>

                        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-target-burger-syQ">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbar-target-burger-syQ" className="navbar-menu">
                        <div className="navbar-start">
                            <Link to={Routes._} onClick={() => this.props.to(Routes._)} className="navbar-item TnzvNalOP">Home</Link>
                            <Link to={Routes.help} onClick={() => this.props.to(Routes.help)} className="navbar-item TnzvNalOP">Support</Link>
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-item menu-more-options-aYQ TnzvNalOP">More <i className="fas fa-sort-down"></i></a>

                                <div className="navbar-dropdown">
                                    <Link to={""} className="navbar-item TnzvNalOP" onClick={() => this.props.enableGlobalOverlay("Now we don't search new members team, probably in a future we can need, stay up date")}>Jobs</Link>
                                    <a href={`mailto:${Contact.support}`} className="navbar-item TnzvNalOP">Contact</a>
                                    <hr className="navbar-divider" />
                                    <a href={`mailto:${Contact.support}`} className="navbar-item TnzvNalOP">Report an issue</a>
                                </div>
                            </div>
                            {this.props.loggedIn &&
                                <div className="navbar-end">
                                    <div className="navbar-item">
                                        <div className="buttons">
                                            <Link to={Routes.dashboard} onClick={() => this.props.to(Routes.dashboard)} className="button menu-button-filled-tQn">Dashboard</Link>
                                        </div>
                                    </div>
                                </div>
                            }

                            {!this.props.loggedIn &&
                                <div className="navbar-end">
                                    <div className="navbar-item">
                                        <div className="buttons">
                                            <Link to={Routes.signUp} onClick={() => this.props.to(Routes.signUp)} className="button menu-button-filled-tQn"><strong>Sign up</strong></Link>
                                            <Link to={Routes.signIn} onClick={() => this.props.to(Routes.signIn)} className="button is-light">Log in</Link>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}