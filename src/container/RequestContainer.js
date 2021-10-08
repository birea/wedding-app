import { connect } from "react-redux";
import Request from "./../components/translations/requests/Request";

const mapStateToProps = state => ({   
    authUser: state.authUser, 
    isReviewer: state.isReviewer,
    userLogged: state.userLogged,
    userReviewed: state.userReviewed
});

const RequestContainer = connect(mapStateToProps)(Request);

export default RequestContainer;