import React, { Component } from "react";
import { translate } from "react-i18next";
import { withRouter } from "react-router-dom";
import { sendMessage } from "./../../store/AppActions";
import { connect } from "react-redux";
import {createNotification} from "../common";
import { MAIL_CODES } from "../../constants/appConstant";
import { auth, db, firebase } from "../../firebase";
import {Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl, Button, PageHeader } from "react-bootstrap";
import * as routes from "./../../constants/routes";
import "../../css/login.css";

const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",    
    error: null,
    loading:false
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value
}); 

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
    sendMessage: (message, uid, notification) => {
        dispatch(sendMessage(message, uid, true, notification));
    }
});


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    handleOnSubmit = (event) => {
        this.setState({loading:true});
        const { username, email, passwordOne, weddingCode } = this.state;
        const { history } = this.props;
        const date = new Date();        
        const weddingFunction = firebase.functions.httpsCallable("validateWeedingCode");
        weddingFunction({code:weddingCode})
            .then(result => {                
                if (result.data.isValid){        
                    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
                        .then(user => {                            
                            // Create a user in your own accessible Firebase Database too
                            db.doCreateUser(user.user.uid, username,username, email, this.props.i18n.language)
                                .then(() => {    
                                    const notification = createNotification(
                                        {email:"elia.silvia.08122018@gmail.com", username: "Elia & Silvia"}, 
                                        {email:email, language: this.props.i18n.language },
                                        MAIL_CODES.WELCOME_MESSAGE, this.props.t("emailNewAccount"));
                                    this.props.sendMessage(
                                        {text: this.props.t("emailNewAccount"),
                                        author:"Elia & Silvia",
                                        isReviewer:true,
                                        read:false,
                                        uid:"-",
                                        creationDate: date.toJSON()
                                    },user.user.uid,notification);                  
                                    return history.push(routes.HOME);
                                })
                                .catch(error => {
                                    this.setState({"error": error, loading:false});
                                });
                        })
                        .catch(error => this.setState({"error": error, loading:false}))
                }                
                else {                    
                    this.setState(byPropKey("error", {message: this.props.t("wrongCode")} ));
                    this.setState({loading:false});
                }
            }).catch(error => this.setState({"error": error, loading:false}));
        event.preventDefault();
    }

    render() {

        const { props:{t}, state:{username, email, passwordOne, passwordTwo, error,loading }} = this;        
        const isInvalid = 
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            passwordTwo === "" ||
            email === "" ||
            username === "";
        if (loading){
            return (<div className="loading-container"><div className="loading"></div></div>);
        }
        return (
            <div style={{height:"100%"}}>
                <Grid style={{"marginBottom":"40px"}}>
                    <Row><PageHeader className="App"></PageHeader> </Row>
                    <Row>
                        <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3} >
                            <Panel>
                                <Panel.Heading>
                                    <Panel.Title className="login-header" componentClass="h3">{t("signUp")}</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>
                                    <form onSubmit={this.handleOnSubmit}>
                                        <FormGroup>
                                            <ControlLabel>{t("fullName")}</ControlLabel>
                                            <FormControl id="fullName" name="fullName" type="text" onChange={event => this.setState(byPropKey("username", event.target.value))} placeholder={t("fullName")} />
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>{t("emailAddress")}</ControlLabel>
                                            <FormControl id="emailId" name="email" type="text" onChange={event => this.setState(byPropKey("email", event.target.value))} placeholder={t("enterMail")} />
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>{t("password")}</ControlLabel>
                                            <FormControl id="passwordOne" name="password" type="password" onChange={event => this.setState(byPropKey("passwordOne", event.target.value))} placeholder={t("password")} />
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>{t("confirmPassword")}</ControlLabel>
                                            <FormControl id="passwordTwo" name="password" type="password" onChange={event => this.setState(byPropKey("passwordTwo", event.target.value))} placeholder={t("confirmPassword")} />
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>{t("weddingCode")}</ControlLabel>
                                            <FormControl id="weddingCode" name="text" type="text" onChange={event => this.setState(byPropKey("weddingCode", event.target.value))} placeholder={t("weddingCode")} />
                                        </FormGroup>
                                        <FormGroup> 
                                            <Button className="btn-primary signUp-button" disabled={isInvalid} type="submit">{t("signUp")}</Button>                                                                           
                                            {error && <p>{error.message}</p>}
                                        </FormGroup>                          
                                    </form>
                                </Panel.Body>
                            </Panel>
                        </Col>
                    </Row>
                </Grid> 
                <div className="footer-login">
                Powered with <i class="fa fa-heart"></i> by Gioina Software House <i class="fa fa-creative-commons"></i> 2018 v1.0
                </div>                                
            </div>
            
        );
    }
}
const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));

export default translate("login")(withRouter(SignUpContainer));