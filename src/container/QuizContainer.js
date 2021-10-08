import { connect } from "react-redux";
import Quiz from "./../components/rsvp/Quiz";

const mapStateToProps = state => ({
    authUser: state.authUser,
    user: state.user
});

const mapDispatchToProps = dispatch => ({

});

const QuizContainer = connect(mapStateToProps, mapDispatchToProps)(Quiz);

export default QuizContainer;