import { connect } from "react-redux";
import SendMessage from "./../components/wall/SendMessage";
import { sendMessage } from "./../store/AppActions";

const mapStateToProps = state => ({    
    isReviewer: state.isReviewer,
    userLogged: state.userLogged,
    userReviewed: state.userReviewed
});

const mapDispatchToProps = dispatch => ({
    sendMessage: (message, uid, isReviewer, notification) => {
        dispatch(sendMessage(message, uid, isReviewer, notification));
    }
});

const SendMessageContainer = connect(mapStateToProps, mapDispatchToProps)(SendMessage);

export default SendMessageContainer;