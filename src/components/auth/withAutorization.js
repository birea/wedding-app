import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { auth } from "../../firebase/firebase";
import * as routes from "../../constants/routes";

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            auth.onAuthStateChanged(authUser => {
                if (!authCondition(authUser)) {
                    this.props.history.push(routes.SIGN_IN);
                }
            });
        }

        render() {
            const { props, props: { authUser } } = this;
            return authUser ? <Component {...props} /> : <p>  </p>;
        }
    }
    withAuthorization.propTypes = {
        authUser: PropTypes.object,
        history: PropTypes.object.isRequired
    };
    withAuthorization.defaultProps = {
        authUser: null
    };
    return withRouter(WithAuthorization);
};

export default withAuthorization;