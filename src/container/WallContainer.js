import { connect } from "react-redux";
import Wall from "./../components/wall/Wall";
import { loadMessages, setActiveNav } from "./../store/AppActions";

const mapStateToProps = state => ({
    isReviewer: state.isReviewer,
    messages: state.messages,
    userLogged: state.userLogged,
    userReviewed: state.userReviewed,
    authUser: state.authUser
});

const mapDispatchToProps = dispatch => ({
    loadMessages: (uid, isReviewer) => {
        dispatch(loadMessages(uid, isReviewer));        
    },
    setActiveNav: (activeNav) => {
        dispatch(setActiveNav(activeNav));
    }
});

const WallContainer = connect(mapStateToProps, mapDispatchToProps)(Wall);

export default WallContainer;