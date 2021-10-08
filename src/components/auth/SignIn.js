import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import CookieBanner from "react-cookie-banner";
import { translate } from "react-i18next";
import PropTypes from "prop-types";
import { auth, db, firebase} from "../../firebase";
import * as routes from "../../constants/routes";
import { setActiveNav, login, sendMessage } from "./../../store/AppActions";
import { connect } from "react-redux";
import {createNotification} from "../common";
import { MAIL_CODES } from "../../constants/appConstant";
import {Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl, Button, PageHeader, Popover, OverlayTrigger} from "react-bootstrap";
import "../../css/login.css";

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
    setActiveNav: (activeNav) => {
        dispatch(setActiveNav(activeNav));
    },
    login: (authUser) => {
        dispatch(login(authUser));
    },
    sendMessage: (message, uid, notification) => {
        dispatch(sendMessage(message, uid, true, notification));
    }
});

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value
});

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null,
    googleError: null,
    weddingCode: "",
    showInputCode: false,
    username:"",
    showLoading: false
};

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

    }

    onSubmit = (event) => {
        this.setState({showLoading: true});
        const {
            email,
            password
        } = this.state;

        const {props:{history}} = this;
        auth.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState(() => ({ ...INITIAL_STATE }));
                history.push(routes.HOME);
                return this.props.setActiveNav("");
            })
            .catch(error => {
                return this.setState({"error": error, showLoading:false});
            });


        event.preventDefault();
    }

    handleGoogleSignIn = () => {
        this.setState({showLoading: true});
        auth.doSignInWithGoogleAccount()
            .then(result => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                //const token = result.credential.accessToken;
                // The signed-in user info.
                const user = result.user; 
                db.onceGetUser(user.uid)
                    .then(snapshot => {
                        const userDB = snapshot.toJSON();                    
                        if (userDB != null){
                            this.props.login(user);                
                            return this.props.history.push(routes.HOME);
                        }
                        else {
                            return this.setState({user:user, username:user.displayName, showInputCode: true, showLoading: false});
                        }
                    }).catch(() => this.setState({showLoading: false}));               
            })
            .catch(error => this.setState({googleError: error, showLoading: false}));
    };

    SignUpLink = () => <p>{this.props.t("noAccount")}{ } <Link to={routes.SIGN_UP}>{this.props.t("signUp")}</Link></p>;
    ResetPasswordLink = () =><p>{this.props.t("forgotPassword")}{ } <Link to={routes.PASSWORD_FORGET}> {this.props.t("resetPassword")}</Link></p>;    
    
    handleOnSubmitWeddingCode = (event) => {        
        const { state:{weddingCode, user, username}} = this;
        const date = new Date();
        const weddingFunction = firebase.functions.httpsCallable("validateWeedingCode");        
        weddingFunction({code: weddingCode})
            .then(result => {                
                if (result.data.isValid){                                          
                    db.doCreateUser(user.uid, 
                        username? username: user.displayName, 
                        user.displayName, 
                        user.email, 
                        this.props.i18n.language
                    ).then(() => {                      
                        this.props.login(user);
                        const notification = createNotification(
                            {email:"elia.silvia.08122018@gmail.com", username: "Elia & Silvia"}, 
                            {email:user.email, language: this.props.i18n.language },
                            MAIL_CODES.WELCOME_MESSAGE, this.props.t("emailNewAccount"));
                        this.props.sendMessage(
                            {text: this.props.t("emailNewAccount"),
                            author:"Elia & Silvia",
                            isReviewer:true,
                            read:false,
                            uid:"-",
                            creationDate: date.toJSON()
                        },user.uid,notification);
                        return this.props.history.push(routes.HOME);                        
                    })
                        .catch(error => {
                            this.setState(byPropKey("googleError", error));
                        });
                }                
                else {                    
                    this.setState(byPropKey("googleError", {message: this.props.t("wrongCode")}));
                }
            }).catch(error => this.setState(byPropKey("error", error)));
        event.preventDefault();
    }

    render() {
        const { state:{email, password, error, googleError, showInputCode, weddingCode, showLoading}, props:{t}} = this;

        const popoverRight = (
            <Popover id="popover-positioned-right">
                {t("popOverLogin")}{" "}<i class="fa fa-smile-o"></i>
            </Popover>);

        const isInvalid = (!showInputCode && (password === "" || email === "")) ||
                          (showInputCode && weddingCode === "") ;

        if (showLoading){

            return (
                <div className="loading-container"><div className="loading"></div></div>
            );
        }

        return (        
            <div>
                <CookieBanner
                    styles={{banner: { minHeight:"50px",height:"auto", backgroundColor: "rgba(60, 60, 60, 0.8)", "z-index": 0 },message: { fontWeight: 500 }}}
                    message={t("cookiesInfo")} onAccept={() => {}} cookie="user-has-accepted-cookies" />
                <Grid style={{"marginBottom":"40px"}}>
                    <Row><PageHeader className="App"></PageHeader> </Row>
                    <Row>
                        <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3} >
                            <Panel>
                                <Panel.Heading>
                                    <Panel.Title className="login-header" componentClass="h3">{t("signIn")}</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>
                                    <form onSubmit={!showInputCode? this.onSubmit: this.handleOnSubmitWeddingCode}>
                                        {!showInputCode && <div>
                                            <FormGroup>
                                                <ControlLabel>{t("emailAddress")}</ControlLabel>
                                                <FormControl id="emailId" name="email" type="text" onChange={event => this.setState(byPropKey("email", event.target.value))} placeholder={t("enterMail")} />
                                            </FormGroup>
                                            <FormGroup>
                                                <ControlLabel>{t("password")}</ControlLabel>
                                                <FormControl id="passwordId" name="password" type="password" onChange={event => this.setState(byPropKey("password", event.target.value))} placeholder={t("enterPassword")} />
                                            </FormGroup>                                   
                                            <div className="div-login-button">
                                                <Button className="btn-primary login-button" disabled={isInvalid} type="submit">{t("signIn")}</Button>                                             
                                            </div>
                                            <FormGroup>
                                                {this.SignUpLink()}
                                                {this.ResetPasswordLink()}
                                            </FormGroup>
                                            <div className="div-login-google">
                                                {t("loginGoogleIntro")}
                                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverRight}>
                                                    <i className="fa fa-info-circle wall-intro"></i>    
                                                </OverlayTrigger>
                                            </div>
                                            <div className="google-login div-login-button"><img src="btn_google_signin_dark_normal_web.png" onClick={this.handleGoogleSignIn} alt="Sign in with Google"/></div>                                                                                 
                                            {error && <p>{error.message}</p>}
                                            {googleError && <p>{googleError.message}</p>}
                                       
                                       
                                        </div>}
                                        {showInputCode && <div>
                                            <FormGroup>                                            
                                                <p>{t("hiNewUser", {username: this.state.user.displayName})}</p>                                            
                                            </FormGroup>
                                            <FormGroup>
                                                <ControlLabel>{t("weddingCode")}</ControlLabel>
                                                <FormControl id="weddingCode" name="text" type="text" onChange={event => this.setState(byPropKey("weddingCode", event.target.value))} placeholder={t("weddingCode")} />                                            
                                            </FormGroup>
                                            <FormGroup>
                                                <ControlLabel>{t("confirmYourName")}</ControlLabel>
                                                <FormControl id="username" name="text" type="text" value ={this.state.username} onChange={event => this.setState(byPropKey("username", event.target.value))} placeholder={this.state.username} />                                            
                                            </FormGroup>
                                            <FormGroup>                                             
                                                <Button className="btn-primary" disabled={isInvalid} type="submit">{t("validateCode")}</Button>
                                                {googleError && <p>{googleError.message}</p>}
                                            </FormGroup>
                                        </div>}
                                    </form>
                                </Panel.Body>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <div className="footer-login">
            Powered with <i class="fa fa-heart"></i> by Gioina Software House <i class="fa fa-creative-commons"></i> 2018 v1.0
                        </div>
                    </Row>
                </Grid> 
            </div>         
            
        );
    }
}
const SignInContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));

SignIn.propTypes = {
    history: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    setActiveNav: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

export default translate("login")(SignInContainer);