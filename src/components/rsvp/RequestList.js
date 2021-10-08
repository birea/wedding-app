import * as React from "react";
import PropTypes from "prop-types";
import { Table, Checkbox } from "react-bootstrap";
import { db } from "./../../../firebase";
import { translate } from "react-i18next";
import { STATUS, TRANSLATIONS, CORRECTIONS, TABS } from "./../../../constants/appConstant";
import * as routes from "./../../../constants/routes";
import { withRouter } from "react-router-dom";
import { getFileURL, getUid } from "./../../common";
class RequestList extends React.Component {

    constructor(props) {
        super(props);
        const { location } = props;
        let showCancelled;
        if (location && location.state)
            showCancelled = location.state.showCancelled;
        else
            showCancelled = false;
        this.state = { showCancelled: showCancelled };
        this.handleShowCancelled = this.handleShowCancelled.bind(this);
        this.loadRequests = this.loadRequests.bind(this);
        this.handlePencilClick = this.handlePencilClick.bind(this);
    }

    componentDidMount() {
        this.loadRequests(this.state.showCancelled);
    }

    loadRequests = (showCancelled) => {
        const { props: { page, userLogged, userReviewed, loadRequestList } } = this;
        const uid = getUid(userLogged, userReviewed);
        loadRequestList(uid, page, showCancelled);
    }

    handleCancelRequest = requestId => () => {
        const { props: { userLogged, userReviewed, isReviewer, page } } = this;
        const status = isReviewer ? STATUS.REJECTED : STATUS.CANCELLED;
        const isCancelled = status === STATUS.CANCELLED;
        const uid = getUid(userLogged, userReviewed);
        db.updateRequestStatus(page, requestId, uid, status, isCancelled);
        this.loadRequests();
    }

    handleAcceptClick = requestId => () => {
        const { props: { page, userReviewed: { uid } } } = this;
        db.updateRequestStatus(page, requestId, uid, STATUS.ACCEPTED, false);
        this.loadRequests();
    }

    handlePencilClick = requestId => () => {
        const { props: { history, page }, state: { showCancelled } } = this;
        history.push({//eslint-disable-line fp/no-mutating-methods
            pathname: routes.MODIFY_REQUEST,
            search: null,
            state: {
                requestId: requestId,
                page: page,
                originPage: `/${page}`,
                originTab: TABS.REQUESTS,
                showCancelled: showCancelled
            }
        });
    }

    handleEyeOpenClick = requestId => () => {
        const { props: { history, page }, state: {showCancelled} } = this;
        history.push({//eslint-disable-line fp/no-mutating-methods
            pathname: routes.REQUEST_DETAIL,
            search: null,
            state: {
                requestId: requestId,
                page: page,
                originPage: `/${page}`,
                originTab: TABS.REQUESTS,
                showCancelled: showCancelled
            }
        });
    }

    handleShowCancelled() {
        const value = !this.state.showCancelled;
        this.setState({ showCancelled: value });
        this.loadRequests(value);
    }

    render() {
        const { props: { t, isReviewer, page, requestList, userLogged, userReviewed } } = this;
        const isCorrection = page === CORRECTIONS;
        const isTranslation = page === TRANSLATIONS;
        const uid = getUid(userLogged, userReviewed);

        return (
            <div>
                <Checkbox className="btn" onChange={this.handleShowCancelled}> {t("Show Cancelled")}  </Checkbox>
                <Table className="App" responsive striped bordered hover>
                    <thead >
                        <tr >
                            <th>{t("Date")}</th>
                            <th>{t("Title")}</th>
                            {isTranslation && <th>{t("Language")}</th>}
                            <th>{t("File")}</th>
                            <th>{isTranslation && t("Translated File")}{isCorrection && t("Corrected File")} </th>
                            <th>{t("Status")}</th>
                            <th>{t("Actions")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!requestList && <tr><td colSpan="7">{t("No Data")}</td></tr>}
                        {requestList && Object.keys(requestList).map(key => (

                            <tr key={key} >
                                <td>{new Date(requestList[key].creationDate).toLocaleString()}</td>
                                <td>{requestList[key].title}</td>
                                {isTranslation && <td>{t(requestList[key].language)}</td>}
                                {getFileURL(`fileURL-${key}`, uid, key, requestList[key].fileName, false)}
                                <td> <a id={`fileURL-${key}`}> {requestList[key].fileName}</a></td>
                                {getFileURL(`translatedFileURL-${key}`, uid, key, requestList[key].translatedFileName, true)}
                                <td> <a id={`translatedFileURL-${key}`}> {requestList[key].translatedFileName}</a></td>
                                <td>{t(requestList[key].status)}</td>
                                <td>
                                    <button type="button" className="btn btn-default btn-xs" onClick={this.handleEyeOpenClick(key)}>
                                        <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                                    </button>

                                    {requestList[key].status !== STATUS.CANCELLED && requestList[key].status !== STATUS.REJECTED &&
                                        <button type="button" className="btn btn-default btn-xs" onClick={this.handlePencilClick(key)}>
                                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                        </button>}

                                    {isReviewer && requestList[key].status === STATUS.PENDING &&
                                        <button type="button" className="btn btn-default btn-xs" onClick={this.handleAcceptClick(key)}>
                                            <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                        </button>}


                                    {requestList[key].status !== STATUS.CANCELLED && requestList[key].status !== STATUS.REJECTED &&
                                        <button type="button" className="btn btn-default btn-xs" onClick={this.handleCancelRequest(key)} >
                                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                        </button>}
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </Table>
            </div>
        );
    }
}

RequestList.propTypes = {
    authUser: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isReviewer: PropTypes.bool.isRequired,
    loadRequestList: PropTypes.func.isRequired,
    location: PropTypes.object,
    page: PropTypes.string.isRequired,
    requestList: PropTypes.object,
    t: PropTypes.func.isRequired,
    userLogged: PropTypes.object.isRequired,
    userReviewed: PropTypes.object
};

RequestList.defaultProps = {
    location: null,
    requestList: null,
    userReviewed: null
};

export default translate("translations")(withRouter(RequestList));