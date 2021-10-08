import { connect } from "react-redux";
import UserList from "./../components/admin/UserList";
import { setUserReviewed, setUnreadMessagesCount, setActiveNav } from "./../store/AppActions";

const mapStateToProps = state => ({
    authUser: state.authUser,
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    setUserReviewed: (userReviewed, activeNav) => {
        dispatch(setUserReviewed(userReviewed, activeNav));
    },
    setUnreadMessagesCount: (translationUnreadMessages, correctionUnreadMessages) => {
        dispatch(setUnreadMessagesCount(translationUnreadMessages, correctionUnreadMessages));
    },
    setActiveNav: (activeNav) => {
        dispatch(setActiveNav(activeNav));
    }
});

const UserListContainer = connect(mapStateToProps, mapDispatchToProps)(UserList);

export default UserListContainer;