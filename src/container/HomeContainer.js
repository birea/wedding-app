import { connect } from "react-redux";
import Home from "./../components/Home";
import { setActiveNav } from "./../store/AppActions";

const mapStateToProps = state => ({
    authUser: state.authUser,
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    setActiveNav: (activeNav) => {
        dispatch(setActiveNav(activeNav));
    }
});

const HomeContainer = connect(mapStateToProps, mapDispatchToProps)(Home);

export default HomeContainer;