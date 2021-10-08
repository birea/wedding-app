import React from "react";

import { auth } from "../../firebase";
import {translate} from "react-i18next";
class SignOut extends React.Component {

    render() {
        const {props: {t}} = this;
        return (
            <span onClick={auth.doSignOut}>{t("Sign Out")}</span>);
    }
}
export default translate("")(SignOut);
