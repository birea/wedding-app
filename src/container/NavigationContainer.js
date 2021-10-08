import { connect } from "react-redux";
import Navigation from "./../components/Navigation";
import { setActiveNav } from "./../store/AppActions";

const mapStateToProps = state => ({   
    activeNav: state.activeNav,
    isReviewer: state.isReviewer,
    unreadMessages: state.unreadMessages,
    authUser: state.authUser    
});

const mapDispatchToProps = dispatch => ({
    setActiveNav: (activeNav) => {
        dispatch(setActiveNav(activeNav));
    }
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(Navigation);

export default AppContainer;