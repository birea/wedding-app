import * as React from "react";
import PropTypes from "prop-types";
import { MAIL_CODES } from "../../constants/appConstant";
import { Col, Row, Panel, Form, Button, FormGroup, FormControl, OverlayTrigger,Popover } from "react-bootstrap";
import { translate } from "react-i18next";
import { getUid, createNotification } from "../common";

class SendMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newMessage: "",
            touched: false,
            panelOpen: true
        };
        this.handleFormChanges = this.handleFormChanges.bind(this);
        this.handlePanelClick = this.handlePanelClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePanelButtonClick = this.handlePanelButtonClick.bind(this);
    }


    handleFormChanges(event) {        
        const { target, type } = event;
        const { name } = target;
        const value = type === "checkbox" ? target.checked : target.value;
        const partialState = {};
        partialState[name] = value;
        this.setState(partialState);
        this.setState({touched: true});
    }

    handlePanelClick() { }

    handlePanelButtonClick() {
        this.setState({ panelOpen: !this.state.panelOpen });
    }

    handleSubmit(event) {
        const date = new Date();
        const { state: { newMessage }, props: { userLogged, userReviewed, isReviewer } } = this;
        const uid = getUid(userLogged, userReviewed);
        const message = {
            author: userLogged.username,
            uid: userLogged.uid,
            text: newMessage,
            creationDate: date.toJSON(),
            read: false,
            isReviewer: isReviewer
        };
        const notification = createNotification(userLogged, userReviewed, MAIL_CODES.NEW_MESSAGE, newMessage);
        this.props.sendMessage(message, uid, isReviewer, notification);
        this.setState({touched: false, newMessage: ""});
        event.preventDefault();
    }

    
      
    render() {
        const { props: { t }, state: { newMessage, panelOpen, touched } } = this;
        const newMessageValidationState = newMessage === ""? "error" : "success";
        const btnDisabled = newMessage === "";  
        const popoverRight = (
            <Popover id="popover-positioned-right">
                {t("popOverChat")}{" "}<i class="fa fa-smile-o"></i>
            </Popover>  );    
        return (
            <div><Row>
                <Col xs={12}>
                    <Button bsStyle="success" bsSize="medium" onClick={this.handlePanelButtonClick} ><i class="fa fa-pencil"></i> {" "} {t("New Message")}</Button> 
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popoverRight}>
                        <i className="fa fa-info-circle wall-intro"></i>    
                    </OverlayTrigger>
                    <Panel  id="collapsible-panel" expanded={panelOpen} onToggle={this.handlePanelClick}>
                        <Panel.Collapse>
                            <Panel.Body>
                                <Form onSubmit={this.handleSubmit} >
                                    <FormGroup controlId="form-group-new-message" validationState={touched?newMessageValidationState: null}>                
                                        <FormControl 
                                            name="newMessage" 
                                            type="text" 
                                            value = {newMessage}
                                            componentClass="textarea" 
                                            rows="4" 
                                            onChange={this.handleFormChanges} 
                                            placeholder={t("Enter a message")} />
                                        <FormControl.Feedback />    
                                    </FormGroup>
                                    <Button disabled={btnDisabled} className="btn  btn-success" type="submit"><i class="fa fa-send-o"></i> {" "} {t("Send Message")}</Button> 
                                    
                                </Form>
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>
                </Col></Row></div>
        );
    }
}
SendMessage.propTypes = {
    isReviewer: PropTypes.bool.isRequired,    
    sendMessage: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    userLogged: PropTypes.object.isRequired,
    userReviewed: PropTypes.object
};

SendMessage.defaultProps = {
    userReviewed: null
};

export default translate("wall")(SendMessage);
