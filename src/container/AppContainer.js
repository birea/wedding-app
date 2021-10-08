import { connect } from "react-redux";
import App from "./../components/App";
import { logout, login, getUnreadMessagesCount } from "./../store/AppActions";

const mapStateToProps = state => ({
    authUser: state.authUser,
    activeNav: state.activeNav    
});

const mapDispatchToProps = dispatch => ({
    logout: () => {
        dispatch(logout());
    },
    login: (authUser) => {
        dispatch(login(authUser));
    },
    getUnreadMessagesCount: (uid, isReviewer) => {
        dispatch(getUnreadMessagesCount(uid, isReviewer));
    }
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;