import { connect } from "react-redux";
import ModifyRequest from "./../components/translations/requests/ModifyRequest";
import { updateRequest } from "./../store/AppActions";

const mapStateToProps = state => ({    
    isReviewer: state.isReviewer,
    page: state.page,
    userLogged: state.userLogged,
    userReviewed: state.userReviewed
});

const mapDispatchToProps = dispatch => ({
    updateRequest: (page, requestId, uid, amendedRequest, isReviewer, notification) => {
        dispatch(updateRequest(page, requestId, uid, amendedRequest, isReviewer, notification));
    }
});

const ModifyRequestContainer = connect(mapStateToProps, mapDispatchToProps)(ModifyRequest);

export default ModifyRequestContainer;