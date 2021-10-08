import { connect } from "react-redux";
import Rsvp from "./../components/Rsvp";
import { setActiveNav } from "./../store/AppActions";

const mapStateToProps = state => ({
    authUser: state.authUser,    
    isReviewer: state.isReviewer,    
    userLogged: state.userLogged,
    userReviewed: state.userReviewed,
    requestList: state.requestList,
    unreadTranslationItems: state.unreadTranslationItems,
    unreadCorrectionItems: state.unreadCorrectionItems
});

const mapDispatchToProps = dispatch => ({
    setActiveNav: (activeNav) => {
        dispatch(setActiveNav(activeNav));
    }
});


const RsvpContainer = connect(mapStateToProps, mapDispatchToProps)(Rsvp);

export default RsvpContainer;