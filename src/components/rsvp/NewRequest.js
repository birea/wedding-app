import * as React from "react";
import { withRouter } from "react-router-dom";
import * as routes from "./../../constants/routes";
import PropTypes from "prop-types";
import {clone} from "lodash";
import { Col, Row, ControlLabel, FormGroup, FormControl, Button, ToggleButton, ToggleButtonGroup, HelpBlock, Alert, Image} from "react-bootstrap";
import { translate } from "react-i18next";

import { db } from "../../firebase";

class NewRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            shakeCookie: false,   
            formInvalid: false,       
            isConfirmed: "",            
            moreThenOne: "N",
            intollerance: "",
            stayNight: "",
            foreign: "",
            persons:[
                this.defaultPerson()
            ],
            lastUpdate: null,
            prevLastUpdate: null,
            arrival: "",
            departure: "",
            saved: false,
            ride: ""
        };       
    }
    componentDidMount() {
        this.getRsvp();
    }
    
    defaultPerson = () => ({name: "", age: null});

    handleFormChanges = (event) => {
        
        const { target } = event;
        const { name, value } = target;        
        if (!value && value !== "") return;        
        const partialState = {};
        partialState[name] = value;
        if (name === "isConfirmed" && value ==="Y")        
            setTimeout(() => {
                this.shakeCookie();    
            }, 400);            

        this.setState(partialState);
    }

    shakeCookie = () => {
        this.setState({shakeCookie: true});
        setTimeout(() => {
            this.setState({shakeCookie: false});
        }, 3000);        
    }

    handleSubmit = () => {    
        if (!this.isPersonsValid()){
            this.setState({formInvalid:true});
            return;
        }
        this.setState({prevLastUpdate: this.state.lastUpdate, formInvalid:false});
        const rsvp ={
            isConfirmed : this.state.isConfirmed,
            moreThenOne: this.state.moreThenOne,
            intollerance: this.state.intollerance,
            persons: this.state.moreThenOne === "Y"? this.state.persons: null,
            lastUpdate: new Date(),
            stayNight: this.state.stayNight,
            foreign: this.state.foreign,
            arrival: this.state.arrival,
            departure: this.state.departure,
            ride: this.state.ride
        };
        db.updateRsvp(this.props.authUser.uid, rsvp)
            .then(() =>{
                this.getRsvp(); 
                return this.setState({saved: true});
            }).catch(null);

    }

    getRsvp = () => {
        db.getRsvp(this.props.authUser.uid).then(
            snapshot => {
                const data = snapshot.toJSON();
                if (data == null)
                    return;                     
                let persons = [];
                if (data.persons){
                    const keys = Object.keys(data.persons);                    
                    keys.forEach((id) => persons[id] = data.persons[id]);
                } else
                    persons = [this.defaultPerson()];                
                return this.setState({
                    isConfirmed : data.isConfirmed,
                    moreThenOne: data.moreThenOne,
                    intollerance: data.intollerance,
                    persons: persons,
                    lastUpdate: new Date(data.lastUpdate).toLocaleString(),
                    stayNight: data.stayNight,
                    foreign: data.foreign,
                    arrival: data.arrival,
                    departure: data.departure,
                    ride: data.ride
                });
            }).catch(() => null);        
    }

    handleAddOnotherPerson = () =>{        
        const persons = clone(this.state.persons);
        persons[persons.length] = this.defaultPerson();
        this.setState({persons: persons});

    }

    handleRemovePerson = index => () => {
        const persons = this.state.persons.filter((person, i) => i !== index);
        this.setState({persons: persons});
    }

    handleChangePerson = index => event => {
        const persons = clone(this.state.persons);
        persons[index][event.target.name] = event.target.value;
        this.setState({persons: persons});
    }

    getPersonType = age =>{
        const {props:{t}} = this;
        if (age < 0)
            return t("alien");
        if (age >= 1 && age <= 3)
            return t("bebe");
        if (age > 3 && age <= 10)
            return t("child");
        if (age >10 && age < 70)
            return t("adult");
        if (age >=70 && age < 110)
            return t("grandma");
        if (age >=110 && age <=2000)
            return t("mummy");
        if (age >2000)
            return t("neanderthal");        
        return "";
    }

    renderAddPerson = (person, index) => {
        const {props:{t}, state:{persons} } = this;      
        const personType = this.getPersonType(person.age);
        return ( 
            <div key={index}>             
                <Row>            
                    <Col md={4} xs={11} mdOffset={2}>                                    
                        <FormControl className="form-inline-first" name="name" type="text" value={person.name? person.name : ""} placeholder={t("nameSurname")} onChange={this.handleChangePerson(index)}/>
                    </Col>
                    <Col md={2} xs ={4}>                                                    
                        <FormControl className="form-inline age" name="age" type="number" value={person.age? person.age: ""} placeholder={t("age")} onChange={this.handleChangePerson(index)}/>
                        {personType && <HelpBlock className="feedback-age">{personType}</HelpBlock>}
                    </Col>
                    <Col md={2} xs={4}>                                    
                        {persons.length > 1 && <Button className="form-inline-button" onClick={this.handleRemovePerson(index)}>X</Button>}                        
                    </Col>
                </Row>
                {index === persons.length-1 && 
                <Row>
                    <Col mdOffset={6}>                        
                        <Button className="form-inline-button-add" onClick={this.handleAddOnotherPerson}>{t("addMore")}</Button>                        
                    </Col>
                </Row>}
            </div>
        );
    }

    isPersonsValid = () => {
        const {state: {persons, moreThenOne}} = this;
        if (moreThenOne === "N")
            return true;
        let isInvalid = false;
        let hasAtLeastOnePerson = false;
        persons.forEach(p => {
            if (p.age >=0 && p.name !== "")
                hasAtLeastOnePerson = true;
            if ((p.age >= 0 && p.name === "") || (!p.age && p.name !== ""))    
                isInvalid = true;
        });  
        if (isInvalid || !hasAtLeastOnePerson)
            return false;        
        return true;
    }

    handleDateChange = () => (value, formattedValue) =>
        this.setState({
            //id: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
            id: formattedValue // Formatted String, ex: "11/19/2016"
        });
      
    handleGoToWall = () => this.props.history.push({//eslint-disable-line fp/no-mutating-methods
        pathname: routes.WALL     
    });

    render() {//eslint-disable-line complexity
        const { props: { t }, state: { intollerance, formInvalid, isConfirmed, moreThenOne, persons, lastUpdate, prevLastUpdate, stayNight, foreign, arrival, saved, ride} } = this;        
        const btnDisabled = isConfirmed === "" ||
        (isConfirmed === "Y" && !this.isPersonsValid());     
        let flash = false;
        if (lastUpdate !== prevLastUpdate && prevLastUpdate !== null){
            flash = true;
        }
        const lastUpdateClass = flash? "flashit text-with-margin-top form-inline": "text-with-margin-top form-inline";
        const cookieClassName = this.state.shakeCookie? "shake-cookie image-cookie": "image-cookie";
        return (
            <div>
                <Row>
                    <FormGroup >
                        <Col componentClass={ControlLabel} sm={12}><i class="fa fa-bell"></i> {" "} {t("areYouComing")}</Col>
                        <Col sm={12} >
                            <ToggleButtonGroup type="radio" id="is-confirmed" name="isConfirmed" onClick={this.handleFormChanges} >
                                <ToggleButton name="isConfirmed" value="Y" className={isConfirmed ==="Y"? "btn btn-primary": "" }>{t("yes")}</ToggleButton>
                                <ToggleButton name="isConfirmed" value="N" className={isConfirmed === "N"? "btn btn-primary": "" }>{t("no")}</ToggleButton>            
                            </ToggleButtonGroup> 
                        </Col>
                    </FormGroup>
                </Row>
                {isConfirmed === "N" &&
                <div className="text-with-margin-top">
                    {t("thanksNo")}
                </div>
                }
                {isConfirmed === "Y" && 
                <div>                
                    <Row><Col xs={12}> <div className="text-with-margin-top text-with-margin-bottom ">{t("thanks")}</div></Col></Row>
                    <Row> 
                        <Col>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={12}><i class="fa fa-male"></i><i class="fa fa-male"></i> {" "} {t("whoCome")}<span className="label-note"> {t("whoComeNote")}</span></Col>
                                <Col sm={12}>
                                    <ToggleButtonGroup type="radio" id="more-then-one" name="moreThenOne" onClick={this.handleFormChanges} >
                                        <ToggleButton id="moreThenOne" value="Y" className={moreThenOne ==="Y"? "btn btn-primary": "" }>{t("yes")}</ToggleButton>
                                        <ToggleButton id="moreThenOne" value="N" className={moreThenOne === "N"? "btn btn-primary": "" }>{t("no")}</ToggleButton>            
                                    </ToggleButtonGroup> 
                                </Col>                                  
                            </FormGroup>
                        </Col>                    
                    </Row>    
                    {moreThenOne === "Y" && 
                        <div>                                             
                            {persons.map(this.renderAddPerson)}                        
                        </div>
                    } 
                    <Col md={8}>
                        <Row>                         
                            <Col className="text-with-margin-top">                    
                                <FormGroup >
                                    <Col componentClass={ControlLabel} sm={12}><i class="fa fa-apple"></i> {" "} {t("intollerance")}</Col>
                                    <Col sm={11}>
                                        <FormControl id="formIntollerance" type="text" componentClass="textarea" rows="4" name="intollerance" value={intollerance} onChange={this.handleFormChanges} placeholder={t("intollerancePlaceholder")} />
                                    </Col>
                                </FormGroup>                            
                            </Col>
                        </Row>
                        <Row><Col xs={12} md={8}><div className="text-with-margin-bottom">
                            <strong>{t("note1")}</strong>{t("intolleranceNote1")}
                            <br/>
                            <strong >{t("note2")}</strong>{t("intolleranceNote2")} 
                        </div></Col>
                        </Row>   
                    </Col>
                    <Col md={4}>
                        <Image className={cookieClassName} src="/img/cookie.jpg" responsive />
                    </Col>                  

                    <Row>
                        <FormGroup >
                            <Col componentClass={ControlLabel} sm={12}><i class="fa fa-music"></i> {" "} {t("stayNight")}</Col>
                            <Col sm={12} >
                                <ToggleButtonGroup type="radio" id="stay-night" name="stayNight" onClick={this.handleFormChanges} >
                                    <ToggleButton name="stayNight" value="Y" className={stayNight ==="Y"? "btn btn-primary": "" }>{t("yes")}</ToggleButton>
                                    <ToggleButton name="stayNight" value="N" className={stayNight === "N"? "btn btn-primary": "" }>{t("no")}</ToggleButton>            
                                    <ToggleButton name="stayNight" value="B" className={stayNight === "B"? "btn btn-primary": "" }>{t("depends")}</ToggleButton>            
                                </ToggleButtonGroup> 
                            </Col>
                        </FormGroup>
                    </Row>
                    <Row><Col xs={12} md={10}><div className="text-with-margin-bottom">
                        <strong>{t("note")}</strong>{t("note3")}                        
                    </div></Col></Row>                       
                    <Row>
                        <FormGroup >
                            <Col componentClass={ControlLabel} sm={12}><i class="fa fa-suitcase"></i> {" "} {t("foreign")}</Col>
                            <Col sm={12} >
                                <ToggleButtonGroup type="radio" id="foreign" name="foreign" onClick={this.handleFormChanges} >
                                    <ToggleButton name="foreign" value="Y" className={foreign ==="Y"? "btn btn-primary": "" }>{t("yes")}</ToggleButton>
                                    <ToggleButton name="foreign" value="N" className={foreign === "N"? "btn btn-primary": "" }>{t("no")}</ToggleButton>                                                
                                </ToggleButtonGroup> 
                            </Col>
                        </FormGroup>
                    </Row>                    
                    {foreign === "Y" && <div><div className="text-with-margin-top text-with-margin-bottom"/> <Row>
                        <FormGroup >
                            <Col componentClass={ControlLabel} sm={12}><i class="fa fa-calendar"></i> {" "} {t("when")}</Col>
                            <Col sm={2}>
                                <FormControl id="formArrival" type="text" name="arrival" value={arrival} onChange={this.handleFormChanges} placeholder="__/__/__" />
                            </Col>
                            {//<Col sm={2}>                                <FormControl id="formDeparture" type="text" name="departure" value={departure} onChange={this.handleFormChanges} placeholder="__/__/__" />                            </Col>
                            }
                        </FormGroup>                            

                    </Row></div>}
                    {foreign === "Y" && <div><div className="text-with-margin-top text-with-margin-bottom"/> <Row>
                        <FormGroup >
                            <Col componentClass={ControlLabel} sm={12}><i class="fa fa-bicycle"></i> {" "} {t("ride")}</Col>
                            <Col sm={12} >
                                <ToggleButtonGroup type="radio" id="ride" name="ride" onClick={this.handleFormChanges} >
                                    <ToggleButton name="ride" value="Y" className={ride ==="Y"? "btn btn-primary": "" }>{t("yes")}</ToggleButton>
                                    <ToggleButton name="ride" value="N" className={ride === "N"? "btn btn-primary": "" }>{t("no")}</ToggleButton>                                                
                                </ToggleButtonGroup> 
                            </Col>
                        </FormGroup>                           

                    </Row></div>}
                </div>                               
          
                
                }
                <Row>                    
                    <Button className="text-with-margin-top btn  btn-primary form-inline" onClick={this.handleSubmit}>{t("save")}</Button>
                    {!formInvalid && <Button bsStyle="link" className={lastUpdateClass}>{lastUpdate && t("lastUpdate", {time: lastUpdate})}</Button>}
                    {formInvalid && <div className="rsvp-error"> {t("RSVPerror")} </div>}                            
                </Row>
                <Row><Col xs={12} md={8} mdOffset={2}><div className="text-with-margin-top">
                    {saved &&
                    <Alert className="hand-click" onClick={this.handleGoToWall}>
                        {t("rsvpSaved")}<br/>
                        <strong >{t("contactUs")}</strong>{t("contactUsText")}
                    </Alert>                                            
                    }   
                </div></Col></Row>   
            </div>           
        );
    }
}

NewRequest.propTypes = {    
    authUser: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired    
};

export default translate("quiz")(withRouter(NewRequest));