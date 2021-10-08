import { connect } from "react-redux";
import MessageList from "./../components/wall/MessageList";
import { getUnreadMessagesCount } from "./../store/AppActions";

const mapStateToProps = state => ({
    isReviewer: state.isReviewer,
    userLogged: state.userLogged,
    userReviewed: state.userReviewed
});

const mapDispatchToProps = dispatch => ({
    getUnreadMessagesCount: (uid, isReviewer) => {
        dispatch(getUnreadMessagesCount(uid, isReviewer));
    }
});

const MessageListContainer = connect(mapStateToProps, mapDispatchToProps)(MessageList);

export default MessageListContainer;