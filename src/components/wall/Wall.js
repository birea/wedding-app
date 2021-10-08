import * as React from "react";
import { translate } from "react-i18next";
import PropTypes from "prop-types";
import "../../css/wall.css";
import { getUid } from "../common";
import SendMessageContainer from "./../../container/SendMessageContainer";
import MessageListContainer from "./../../container/MessageListContainer";
import withAuthorization from "../auth/withAutorization";
import { withRouter } from "react-router-dom";
import {Grid} from "react-bootstrap";
class Wall extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            uid: getUid(this.props.userLogged, this.props.userReviewed),
            isReviewer: this.props.isReviewer,
            refreshMessages: setInterval(() => this.props.loadMessages(this.state.uid, this.state.isReviewer), 10000)
        };        
    }

    componentDidMount() {        
        const {props: {userReviewed, userLogged, isReviewer}} = this;
        const uid = getUid(userLogged, userReviewed);
        this.props.loadMessages(uid, isReviewer);  
        this.setState({isReviewer: isReviewer, uid: uid});        
        this.props.setActiveNav("/wall");
    }

    componentWillUnmount(){
        clearInterval(this.state.refreshMessages);
    }

    render() {
        const { props: { messages } } = this;
        return (
            <Grid>
                <div className="wall-header">
                    <SendMessageContainer/>
                    {messages && <MessageListContainer messages={messages}/>}

                </div>
            </Grid>
        );
    }
}

Wall.propTypes = {    
    isReviewer: PropTypes.bool.isRequired,
    loadMessages: PropTypes.func.isRequired,
    messages: PropTypes.array,    
    setActiveNav: PropTypes.func.isRequired,
    userLogged: PropTypes.object.isRequired,
    userReviewed: PropTypes.object    
};

Wall.defaultProps = {
    messages: [],
    userReviewed: null
};

const authCondition = (authUser) => !!authUser;

export default translate("Wall")(withAuthorization(authCondition)(withRouter(Wall)));
