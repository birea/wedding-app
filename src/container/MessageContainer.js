import { connect } from "react-redux";
import Message from "./../components/wall/Message";

const mapStateToProps = (state) => ({   
    userLogged: state.userLogged
});

const MessageContainer = connect(mapStateToProps)(Message);

export default MessageContainer;