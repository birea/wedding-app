import { connect } from "react-redux";
import NewRequest from "./../components/rsvp/NewRequest";


const mapStateToProps = state => ({
    authUser: state.authUser
});

const mapDispatchToProps = dispatch => ({   
});

const NewRequestContainer = connect(mapStateToProps, mapDispatchToProps)(NewRequest);

export default NewRequestContainer;