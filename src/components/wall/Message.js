import React, { Component } from "react";
import PropTypes from "prop-types";
import { Panel ,Col, Label} from "react-bootstrap";
import * as routes from "./../../constants/routes";
import { withRouter } from "react-router-dom";
import { translate } from "react-i18next";
class Message extends Component {

    constructor(props) {
        super(props);
        this.handleDetailRequest = this.handleDetailRequest.bind(this);
    }

    handleDetailRequest = () => {
        const { props: { history} } = this;        
        history.push({//eslint-disable-line fp/no-mutating-methods
            pathname: routes.REQUEST_DETAIL,
            search: null,
            state: {}
        });
    }

    render() {
        
        const { props: { message, t, userLogged:{uid } }} = this;   
        const isMyMessage = uid === message.uid;
        const newMessage = !isMyMessage && !message.read;
        
        
        return (
            <div>
                <Col xs={11} xsOffset={!isMyMessage? 0:1}
                    sm={9} smOffset={!isMyMessage? 0:3}
                    md={8} mdOffset={!isMyMessage? 0:4}
                >
                    <Panel bsStyle={!isMyMessage? "info": "success"} className={isMyMessage? "right-message": "left-message"}>
                        <Panel.Heading className="message-header">                         
                            <h5 className={!isMyMessage? "": "text-right" }>
                                <strong>
                                {newMessage && <h4><Label bsStyle="primary" className="new-message">{t("NEW")}</Label></h4>}                    
                                {message.read && isMyMessage && <i class="material-icons" style={{"font-size":"28px","color":"red"}}>done_all</i>}
                                    {new Date(message.creationDate).toLocaleTimeString()} {new Date(message.creationDate).toLocaleDateString()} - {message.author} 
                                </strong> 
                            </h5>
                        </Panel.Heading>
                        <Panel.Body className="message-body">
                            <div className={!isMyMessage? "": "text-right" }> {message.text.split('\n').map( line => <div>{line}</div>)}</div>
                        </Panel.Body>
                    </Panel>
                </Col>
                
            </div>
        );
    }

}

Message.propTypes = {
    history: PropTypes.object,
    message: PropTypes.shape({
        creationDate: PropTypes.string,
        author: PropTypes.string,
        text: PropTypes.string,
        requestTitle: PropTypes.string,
        requestId: PropTypes.string,
        read: PropTypes.bool
    }),    
    t: PropTypes.func.isRequired,
    userLogged: PropTypes.object
};

Message.defaultProps = {
    message: {
        date: "",
        author: "",
        text: "",
        requestTitle: "",
        requestId: ""
    },
    history: null
};


export default withRouter(translate("wall")(Message));