import React, { Component } from "react";
import PropTypes from "prop-types";
import HomeContainer from "./../container/HomeContainer";
import RSVPContainer from "./../container/RsvpContainer";
import NavigationContainer from "./../container/NavigationContainer";
import UserListContainer from "./../container/UserListContainer";
import WallContainer from "./../container/WallContainer";
import SignInContainer from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import About from "./About";
import PasswordReset from "./auth/PasswordReset";
import LogisticsContainer from "./../container/LogisticsContainer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as routes from "./../constants/routes";
import { auth } from "./../firebase/firebase";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {showApp: false};
    }

    componentDidMount() {
        auth.onAuthStateChanged(authUser => {            
            if (authUser !== this.props.authUser && authUser) {
                this.props.login(authUser);
                this.props.getUnreadMessagesCount(authUser.uid, false);
                setTimeout(() => {
                    this.props.getUnreadMessagesCount(authUser.uid, false);
                },60000);
                setTimeout(() => {
                    this.setState({showApp: true});    
                }, 5000);
            } else {
                this.props.logout();
                this.setState({showApp: true});
            }
        });
    }


    render() {
        const { props: { authUser, activeNav }, state:{showApp} } = this;
        if (!authUser && !showApp) return (<div className="loading-container"><div className="loading"></div></div>);
        return (
            <Router>
                <div style={{height: "100%"}} >
                    <NavigationContainer authUser={authUser} activeNav={activeNav} />                
                    <Route exact path={routes.HOME}
                        component={HomeContainer} />

                    <Route exact path={routes.LANDING}
                        component={HomeContainer} />

                    <Route exact path={routes.LOGISTICS}
                        component={LogisticsContainer} />

                    <Route exact path={routes.RSVP}
                        component={RSVPContainer} />

                    <Route exact path={routes.WALL}
                        component={WallContainer} />

                    <Route exact path={routes.USER_LIST}
                        component={UserListContainer} />

                    <Route exact path={routes.SIGN_UP}
                        component={SignUp} />

                    <Route exact path={routes.SIGN_IN}
                        component={SignInContainer} />

                    <Route exact path={routes.PASSWORD_FORGET}
                        component={PasswordReset} />
                        
                    <Route exact path={routes.ABOUT}
                        component={About} />
                </div>
            </Router>
        );
    }
}

App.propTypes = {
    activeNav: PropTypes.string.isRequired,
    authUser: PropTypes.object,
    getUnreadMessagesCount: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

App.defaultProps = {
    authUser: {}
};

export default App;
