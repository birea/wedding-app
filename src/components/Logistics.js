import * as React from "react";
import PropTypes from "prop-types";
import "./../css/logistics.css";
import withAuthorization from "./auth/withAutorization";
import { withRouter } from "react-router-dom";
import { translate } from "react-i18next";
import {RSVP} from "../constants/routes";
import { Col, Grid, Row, PageHeader, Panel, PanelGroup, Image, Alert } from "react-bootstrap";
import {db} from "../firebase";

class Logistics extends React.Component {

    constructor(props) {
        super(props);    
        this.state = {activePanel: "1", account: ""};
    }

    componentDidMount() {
        this.props.setActiveNav("/logistics");
        db.getAccount()
            .then(snapshot => {
                const data = snapshot.toJSON(); 
                return this.setState({account: data});
            })
            .catch(() => this.setState({account: "XXXX-XXXX-XXXX-XXXX-XXXX"}));
    }
    handleChangePanel = panel => this.setState({ activePanel: panel });

    handleRSVPClick = () => 
        this.props.history.push({//eslint-disable-line fp/no-mutating-methods
            pathname: RSVP            
        });
    
    handleTRENITALIAClick = () => 
        window.open("http://www.trenitalia.com");           
    
    render() {
        const {props:{t}}=this;
        return (
            <Grid>
                <Row><PageHeader className="App">{this.props.t("Logistics")}</PageHeader> </Row>
                <PanelGroup accordion id="accordion-logistics" onSelect={this.handleChangePanel} activeKey={this.state.activePanel}>
                    <Panel eventKey="1">
                        <Panel.Heading>
                            <Panel.Title className="logisticsPanelHeader" toggle><i class="glyphicon glyphicon-star"></i> { } {t("celebration")}</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <Row>
                                <Col xs={12} sm={12} md={4}>
                                    {t("celebrationChurch")} 
                                </Col>
                                <Col xs={12} sm={6} md={4}>
                                    <Image className="image-church" src="/img/candeluChurch.jpg" width="100%" height="200px" thumbnail/>
                                </Col>
                                <Col xs={12} sm={6} md={4}>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d356444.6028469641!2d12.092271585699454!3d45.73664044251399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47794683017ad1d1%3A0x39fee0bc37ca634c!2sParrocchia+di+Candel%C3%B9!5e0!3m2!1sit!2ses!4v1533472271646" 
                                        width="100%" height="235px" frameborder="0" style={{border: 0}} allowfullscreen>
                                    </iframe>
                                    <div className="map-church"><small>{t("googleMapCaption")}</small> { } <i class="glyphicon glyphicon-road"></i></div>
                                </Col>  
                            </Row>
                            <Row>
                                <Col xs={12} sm={12} md={12}>
                                    {t("celebrationPartyIntro")} </Col></Row>
                            <Row>
                                <Col xs={12} md={8}>
                                    {t("celebrationParty")} 
                                </Col>
                                <Col xs={12} md={4}>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d356539.65006371075!2d11.891506071454634!3d45.721748323358646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477939f789b265d5%3A0xe086b0163e9529e7!2sRistorante+le+Querce+s.a.s.+di+Zago+Dario+e+Fratelli!5e0!3m2!1sit!2ses!4v1533479534365" 
                                        width="100%" height="300px" frameborder="0" style={{border:0}} allowfullscreen>
                                    </iframe>
                                    <div className="map-church"><small>{t("googleMapCaption")}</small> { } <i class="glyphicon glyphicon-road"></i></div>
                                </Col>  
                            </Row>
                            <Alert className="hand-click" bsStyle="warning" onClick={this.handleRSVPClick}>
                                <i class="glyphicon glyphicon-hand-right"></i> { }
                                <strong>{t("reminder")}</strong>{t("reminderRSVPtext")}
                                { } <i class="glyphicon glyphicon-hand-left"></i>
                            </Alert>
                        </Panel.Body>
                    </Panel>
                    <Panel eventKey="2">
                        <Panel.Heading>
                            <Panel.Title className="logisticsPanelHeader" toggle>
                                <i class="glyphicon glyphicon-plane"></i> { } {t("strangerInfo")}</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <i class="glyphicon glyphicon-home"></i> { }{t("addressEliaSilvia")}
                            <Row className="address-row">{t("addressElia")}
                                <br/> {t("addressSilvia")}
                            </Row>
                            {t("hotels")}
                            <br/> 
                            <br/> <i class="glyphicon glyphicon-plane"></i> { }{t("airports")}
                            <br/>
                            <br/> <i class="glyphicon glyphicon-alert"></i> { }{t("transport")}
                            <br/> {t("car")}
                        </Panel.Body>
                    </Panel>
                    <Panel eventKey="3">
                        <Panel.Heading>
                            <Panel.Title className="logisticsPanelHeader" toggle>
                                <i class="glyphicon glyphicon-sunglasses"></i> { } {t("touristInfo")}</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            <strong>CASTELFRANCO VENETO. </strong>{t("castelfrancoveneto")}
                            <br/>
                            <br/><strong>TREVISO. </strong>{t("treviso")}
                            <br/>
                            <br/><strong>PADOVA. </strong>{t("padova")}
                            <br/>
                            <br/><strong>BASSANO DEL GRAPPA. </strong>{t("bassano")}
                            <br/>
                            <br/><strong>VERONA. </strong>{t("verona")}
                            <br/>
                            <br/><strong>VENEZIA. </strong>{t("venezia")}
                            <Alert className="hand-click" bsStyle="warning" onClick={this.handleTRENITALIAClick}>
                                {t("trainInfo")} { } 
                                <i class="glyphicon glyphicon-thumbs-down"></i>
                                <i class="glyphicon glyphicon-wrench"></i>
                                <i class="glyphicon glyphicon-flash"></i>
                                <i class="glyphicon glyphicon-time"></i>
                                <br/><strong> {t("trainTime")}</strong>
                            </Alert>
                        </Panel.Body>
                    </Panel>
                    <Panel eventKey="4">
                        <Panel.Heading>
                            <Panel.Title className="logisticsPanelHeader" toggle>
                                <i class="fa fa-briefcase"></i> { } {t("whatToBring")}</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            {t("whatToBring1")}
                            <br/>
                            <br/>{t("whatToBring2")}
                            <br/>
                            <br/>{t("whatToBring3")} { } <i class="glyphicon glyphicon-heart"></i>
                        </Panel.Body>
                    </Panel>
                    <Panel eventKey="5">
                        <Panel.Heading>
                            <Panel.Title className="logisticsPanelHeader" toggle>
                                <i class="glyphicon glyphicon-gift"></i> { } {t("giftsHeader")}</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            {t("giftsIntro")} { } <i class="glyphicon glyphicon-heart"></i>
                            <br/>
                            <br/>{t("giftsExpl1")}
                            <br/>{t("accountHolder")} Elia Nicastro - Silvia Piovesan
                            <br/>{this.state.account} 
                            <br/>BIC/SWIFT: OPENESMM
                            <br/>
                            <br/>{t("giftsExpl2")}
                        </Panel.Body>
                    </Panel>
                </PanelGroup>                
            </Grid>
        );
    }
}

Logistics.propTypes = {    
    history: PropTypes.object.isRequired,
    setActiveNav: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
};

const authCondition = (authUser) => !!authUser;

export default translate("logistics")(withAuthorization(authCondition)(withRouter(Logistics)));