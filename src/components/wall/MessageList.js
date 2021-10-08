import * as React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { getUid } from "../common";
import { Col } from "react-bootstrap";
import MessageContainer from "./../../container/MessageContainer";
import { CLEAN_PENDING_MESSAGES_TO_READ_TIMEOUT } from "../../constants/appConstant";

class MessageList extends React.Component {

    componentDidMount() {        
        const { props: { isReviewer, userLogged, userReviewed } } = this;
        const uid = getUid(userLogged, userReviewed);
        setTimeout(() => {
            this.props.getUnreadMessagesCount(uid, isReviewer);
        }, CLEAN_PENDING_MESSAGES_TO_READ_TIMEOUT);

    }

    render() {
        const { props: { t, messages } } = this;
        return (
            <div>
                {messages && Object.keys(messages).map(key => (
                    <Col key={messages[key].creationDate} >
                        <MessageContainer message={messages[key]} />
                    </Col>))}
            </div>
        );
    }
}

MessageList.propTypes = {
    getUnreadMessagesCount: PropTypes.func.isRequired,
    isReviewer: PropTypes.bool.isRequired,
    messages: PropTypes.any,    
    t: PropTypes.func,
    userLogged: PropTypes.object.isRequired,
    userReviewed: PropTypes.object
};

MessageList.defaultProps = {
    messages: {},
    t: null,
    userReviewed: null
};

export default translate("wall")(MessageList);
