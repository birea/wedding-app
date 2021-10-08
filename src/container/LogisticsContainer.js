import { connect } from "react-redux";
import Logistics from "./../components/Logistics";
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

const LogisticsContainer = connect(mapStateToProps, mapDispatchToProps)(Logistics);

export default LogisticsContainer;