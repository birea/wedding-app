import * as React from "react";
import PropTypes from "prop-types";
import { Nav, Navbar, NavItem, NavDropdown, MenuItem, Badge } from "react-bootstrap";
import * as routes from "./../constants/routes";
import SignOut from "./auth/SignOut";
import { translate } from "react-i18next";
import { withRouter } from "react-router-dom";
import {db} from "../firebase";

class Navigation extends React.Component {

    componentDidMount() {
        this.props.i18n.changeLanguage(this.props.i18n.language);         
    }
    handleLink = route => () => {     
        this.props.setActiveNav(route);
        this.props.history.push({//eslint-disable-line fp/no-mutating-methods
            pathname: route,
            search: null,
            state: null
        });
    }

    changeLanguage = (language) => {
        this.props.i18n.changeLanguage(language);         
        if (this.props.authUser){
            db.updateUserLanguage(this.props.authUser.uid, language);
        }
    }
    
    render() {
        const { props: { t, i18n, authUser, activeNav, isReviewer, unreadMessages } } = this;       
        const language = i18n.language;        
        return (
            <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>                     
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav activeKey={activeNav} >
                        <NavItem eventKey={routes.HOME} onSelect={this.handleLink(routes.HOME)}>{t("Home")} </NavItem>
                      
                        <NavItem eventKey={routes.LOGISTICS} onSelect={this.handleLink(routes.LOGISTICS)}>{t("Logistics")}</NavItem>

                        <NavItem eventKey={routes.RSVP} onSelect={this.handleLink(routes.RSVP)}>{t("RSVP")}</NavItem>
                        
                        <NavItem eventKey={routes.WALL} onSelect={this.handleLink(routes.WALL)}>{t("Wall")}
                            {unreadMessages>0 && <Badge className="badge-nav">{unreadMessages}</Badge>}                      
                        </NavItem>                        
                        <NavItem eventKey={routes.ABOUT} onSelect={this.handleLink(routes.ABOUT)}>{t("About")}</NavItem>    
                        {isReviewer && <NavItem eventKey={routes.USER_LIST} onClick={this.handleLink(routes.USER_LIST)}>{t("User List")}</NavItem>}

                    </Nav>
                    <Nav pullRight>
                        <NavDropdown eventKey={5} title={language.toUpperCase()} id="basic-nav-dropdown">
                            <MenuItem eventKey={5.1} onClick={() => this.changeLanguage("it")}>IT</MenuItem>
                            <MenuItem eventKey={5.2} onClick={() => this.changeLanguage("es")}>ES</MenuItem>
                            <MenuItem eventKey={5.3} onClick={() => this.changeLanguage("en")}>EN</MenuItem>
                        </NavDropdown>
                        {!authUser && <NavItem eventKey={7} onSelect={this.handleLink(routes.SIGN_IN)}>{t("Log in")}</NavItem>}
                        {authUser && <NavItem eventKey={8} ><SignOut /> </NavItem>}

                    </Nav>
                </Navbar.Collapse>
            </Navbar >
        );
    }
}

Navigation.propTypes = {
    activeNav: PropTypes.string.isRequired,
    authUser: PropTypes.shape({
        userName: PropTypes.string,
        email: PropTypes.string
    }),    
    history: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    isReviewer: PropTypes.bool,
    setActiveNav: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    unreadMessages: PropTypes.number    
};

Navigation.defaultProps = {
    authUser: {
        userName: null,
        email: null
    },
    isReviewer: false,
    unreadMessages: null    
};

export default withRouter(translate("navigation")(Navigation));
