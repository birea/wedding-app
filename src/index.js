import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import i18n from "./i18n";
import AppContainer from "./container/AppContainer";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import store from "./store/store";
import { I18nextProvider } from "react-i18next";

import {Provider} from "react-redux";


ReactDOM.render(
    <I18nextProvider i18n={ i18n }>
        <Provider store={store}>
            <AppContainer />
        </Provider>
    </I18nextProvider>
    , document.getElementById("root"));
registerServiceWorker();