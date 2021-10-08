import { connect } from "react-redux";
import RequestList from "./../components/translations/requests/RequestList";
import { loadRequestList } from "./../store/AppActions";
const mapStateToProps = state => ({    
    authUser: state.authUser,    
    isReviewer: state.isReviewer, 
    requestList: state.requestList,   
    userLogged: state.userLogged,
    userReviewed: state.userReviewed
});

const mapDispatchToProps = dispatch => ({
    loadRequestList: (uid, page, showCancelled) => {
        dispatch(loadRequestList(uid, page, showCancelled));
    }    
});

const RequestListContainer = connect(mapStateToProps,mapDispatchToProps)(RequestList);

export default RequestListContainer;