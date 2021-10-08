import * as React from "react";
import PropTypes from "prop-types";
import { Col, Row, PageHeader, ControlLabel, FormGroup, FormControl, Form, Button, ButtonToolbar } from "react-bootstrap";
import { translate } from "react-i18next";
import { withRouter } from "react-router-dom";
import { db } from "./../../../firebase";
import withAuthorization from "../../auth/withAutorization";
import { TRANSLATIONS, CORRECTIONS } from "./../../../constants/appConstant";

import { getFileURL, getUid, handleBackButton } from "./../../common";

class Request extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            comments: "",
            sample: "",
            language: ""
        };     
    }

    componentDidMount() {
        const { props: { userLogged, userReviewed, location: { state: { requestId, page } } } } = this;
        const uid = getUid(userLogged, userReviewed);
        db.onceGetRequest(page, requestId, uid)
            .then(snapshot => this.setState(({ ...snapshot.val() })))
            .catch(() => { });
    }

    render() {
        const { props: { t, userLogged, userReviewed, location: { state: { requestId, page } } } } = this;
        const { state: { language, title, comments, sample, translatedSample, fileName, translatedFileName } } = this;
        const uid = getUid(userLogged, userReviewed);
        const isCorrection = page === CORRECTIONS;
        const isTranslation = page === TRANSLATIONS;

        return (
            <div>
                <Row><PageHeader className="App">{t("Request Details")}</PageHeader> </Row>
                <Form horizontal>
                    <FormGroup>
                        {isTranslation && <Row><Col sm={2} componentClass={ControlLabel}>{t("Language")}</Col> <Col sm={6}><FormControl.Static>{t(language)}</FormControl.Static></Col></Row>}
                        <Row><Col sm={2} componentClass={ControlLabel}>{t("Title")}</Col> <Col sm={6}><FormControl.Static>{title}</FormControl.Static></Col></Row>
                        {isTranslation && <Row><Col sm={2} componentClass={ControlLabel}>{t("Sample Text")}</Col> <Col sm={6}><FormControl.Static>{sample}</FormControl.Static></Col></Row>}
                        {isTranslation && <Row><Col sm={2} componentClass={ControlLabel}>{t("Translated Sample Text")}</Col> <Col sm={6}><FormControl.Static>{translatedSample}</FormControl.Static></Col></Row>}
                        <Row><Col sm={2} componentClass={ControlLabel}>{t("Comments")}</Col> <Col sm={6}><FormControl.Static>{comments}</FormControl.Static></Col></Row>
                        <Row><Col sm={2} componentClass={ControlLabel}>{t("File")}</Col><Col sm={6}><FormControl.Static> <a id="originalFile">{fileName}</a></FormControl.Static></Col></Row>
                        <Row><Col sm={2} componentClass={ControlLabel}>{isCorrection && t("Corrected File")}{isTranslation && t("Translated File")}</Col><Col sm={6}><FormControl.Static> <a id="translatedFile">{translatedFileName}</a></FormControl.Static></Col></Row>
                        {getFileURL("originalFile", uid, requestId, fileName, false)}
                        {getFileURL("translatedFile", uid, requestId, translatedFileName, true)}
                    </FormGroup>
                    <Col xsOffset={6}>
                        <ButtonToolbar>
                            <Button className="btn  btn-primary" onClick={event => handleBackButton(event, this.props) } >{t("Back")}</Button>
                        </ButtonToolbar>
                    </Col>

                </Form>

            </div >
        );
    }
}

Request.propTypes = {
    history: PropTypes.object.isRequired,
    isReviewer: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    userLogged: PropTypes.object.isRequired,
    userReviewed: PropTypes.object
};

Request.defaultProps = {
    userReviewed: null
};

const authCondition = (authUser) => !!authUser;
export default translate("translations")(withAuthorization(authCondition)(withRouter(Request)));