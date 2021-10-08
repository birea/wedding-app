import * as React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { translate } from "react-i18next";
import {Table,Grid, Radio, FormGroup, ControlLabel, Button, Image, Row, Col, Alert, ProgressBar} from "react-bootstrap";
import {clone} from "lodash";
import { db } from "../../firebase";

const questionIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11 ,12 ,13 ,14];
const totalQuestions = 15;
class Quiz extends React.Component {

    constructor(props) {
        super(props);      
        this.state ={
            answered: 0,
            questions: questionIds.map(this.createQuestion),        
            nextQuestionEnabled: false,
            mark: null,
            correctAnswers:[
                "B","A", "C", "C","A", 
                "B", "A","C", "C", "A",
                "A", "B", "B","B", "A"],
            hasImage:[
                true, true, true, true, true, 
                true, true, true, true, true, 
                true, true, true, true, true],
            answers:[ ]            
        };
    }

    componentDidMount() {
        this.getQuizResult();
    }

    scrollToBottom = () => {        
        this.messagesEnd.scrollIntoView({behavior: "smooth"});        
    }

    scrollToTop = () => {
        this.quizTop.scrollIntoView({behavior: "smooth"});        
    }
  
    getQuizResult = () => {
        db.getQuizResult(this.props.authUser.uid).then(
            snapshot => {
                const data = snapshot.toJSON();
                if (data == null)
                    return;
                const answers = [];
                if (data.answers){
                    const keys = Object.keys(data.answers);                    
                    keys.forEach((id) => answers[id] = data.answers[id]);
                }                 
                const mark = data.mark? data.mark : null;                
                return this.setState({answers: answers, mark: mark, answered: answers.length});
            }).catch(() => null);        
    }


    calculateMark = () =>{
        let mark = 0;
        this.state.correctAnswers.forEach(
            (element, i) =>{  
                if (element === this.state.answers[i])
                    mark = mark + 1;
            });             
        return mark;
    }

    createQuestion = id => ({
        id: id,
        question: `q${id}_question`,
        answers: [
            id < 10 ? `q${id}_a` : "Elia",
            id < 10 ? `q${id}_b` : "Silvia",
            id < 10 ? `q${id}_c` : ""
        ],
        answerResults: [
            `q${id}_a_r`,
            `q${id}_b_r`,
            id < 10 ? `q${id}_c_r` : ""
        ]
    });

    handleRadio = id => event => {             
        if (this.state.answered > id) return;
        const answers = clone(this.state.answers);
        answers[id] = event.target.value;
        this.setState({answers: answers});
    }

    renderQuestion = (question, key) => {        
        const {state:{answers, correctAnswers, hasImage, answered, nextQuestionEnabled}, props:{t}} = this;
        const {id} = question;
        const btnDisable = answered === totalQuestions || nextQuestionEnabled;        
        const isQuestionAnswered = answers[answered] && answers[answered].length >0;        
      
        const options = id < 10 ? ["A", "B", "C"] : ["A", "B"];
        const correct = answers[id] === correctAnswers[id];
        const isReviewingAnswer = id === answered && this.state.nextQuestionEnabled;
        if (id > answered || isReviewingAnswer) return;
        const isAnswered = id < answered;      
        
        if (answered === totalQuestions && !this.state.nextQuestionEnabled){
            // this is when the quiz is already finished
        }
        else if (
            answered === totalQuestions && (id !== (totalQuestions-1) && this.state.nextQuestionEnabled) ||
            isAnswered && !(id === answered-1 && this.state.nextQuestionEnabled))
            return;

        return (
           
            <Row key={`question-${key}`} className="no-margin">                   
                <Col xs={12} smHidden mdHidden lgHidden>
                    <ControlLabel className="question-title">
                        {`${id+1}. ${t(question.question)}`}
                    </ControlLabel>
                    {isAnswered && hasImage[id] && 
                        <Image className="qustion-img-xs  w3-animate-opacity" src={`/img/q_${id}.jpg`} responsive />
                    }
                </Col>             
                    
                <Col xs={12} sm={6}>
                    <Col xsHidden sm={12} className="question-title-sm">
                        <ControlLabel xsHidden className="question-title">
                            {`${id+1}. ${t(question.question)}`}
                        </ControlLabel>
                    </Col>
                    <FormGroup id ={`${id}-form-group`} className="question">
                        {options.map((option, optionId) => 
                            <Radio disabled={isAnswered} name={`radioGroup${id}`} className="radio-quiz" 
                                checked={answers[id] === option} value={option} title = {option} onChange={this.handleRadio(id)}
                            >
                                <span className={
                                    (isAnswered && answers[id] === option && !correct && "answer-selected-ko") ||
                                    (isAnswered && correctAnswers[id] === option && "answer-selected-ok")}>
                                    {option}. {t(question.answers[optionId])}</span> 
                                {isAnswered && 
                                <div className={
                                    (correctAnswers[id] == option && "quiz-ok") ||
                                    (answers[id] === option && "quiz-ko") ||
                                    "quiz-ko-black"}>
                                    {answers[id] === option && isAnswered && correct && <span><i class="fa fa-thumbs-up"></i> <i class="fa fa-thumbs-up"></i> <i class="fa fa-thumbs-up"></i></span>}
                                    {answers[id] === option && isAnswered && !correct && <i class="fa fa-thumbs-down"></i>}
                                    {" "}{t(question.answerResults[optionId])}
                                </div>}                            
                            </Radio>
                        )}                                         
                    </FormGroup>

                    {!btnDisable && 
                        <Button disabled={!isQuestionAnswered} className="btn  btn-primary btn-quiz" onClick={this.handleSubmitAnswer}>
                            {t("submitQuestion")}
                        </Button>}
                    {nextQuestionEnabled && 
                        <Button className="btn  btn-primary btn-quiz" onClick={this.handleNextQuestion}>
                            {answered < totalQuestions? t("nextQuestion") : t("submitAndFinish")}
                        </Button>}
                </Col>
                <Col xsHidden sm={6}>
                    {isAnswered && hasImage[id] && <Image className="qustion-img-sm w3-animate-opacity" src={`/img/q_${id}.jpg`} responsive />}
                </Col>
                
                    
            </Row>);
    } 
    
    handleNextQuestion = () => {        
        this.setState({nextQuestionEnabled: false});     
        if (this.state.answered === totalQuestions){
            this.props.activateRSVP();
            setTimeout(() => {
                this.scrollToBottom();    
            }, 1000);            
        }
    }

    handleSubmitAnswer = () => {        
        if (this.state.answered == (totalQuestions-1)){
            db.saveQuizResult(this.props.authUser.uid,this.calculateMark(), this.state.answers)
                .then(() => {
                    this.setState({answered: this.state.answered + 1, nextQuestionEnabled: true});
                    return this.getQuizResult();
                })
                .catch(null);
        }
        else {
            db.saveQuizResult(this.props.authUser.uid,null, this.state.answers)
                .then(() => this.setState({answered: this.state.answered + 1, nextQuestionEnabled: true}))
                .catch(false);            
        }
    }


    progressBar = () =>{
        let correctAnswers = 0;
        let wrongAnswers = 0;
        const {state: {answered, answers}} = this;
        answers.forEach(
            (element, i) =>{  
                if (i < answered){
                    
                    if (element === this.state.correctAnswers[i]){
                        correctAnswers ++;
                    } else {
                        wrongAnswers ++;
                    }                    
                }
            });             
        
        correctAnswers = correctAnswers / totalQuestions * 100;
        wrongAnswers = wrongAnswers / totalQuestions * 100;
        return (
            <div className="quiz-progress-bar">
                <ProgressBar >
                    <ProgressBar bsStyle="success" now={correctAnswers} key={1} />
                    <ProgressBar bsStyle="danger" now={wrongAnswers} key={2} />                
                </ProgressBar>
            </div>
        );
    }

    render() {
        const {props:{t}, state:{questions, answered, nextQuestionEnabled, mark} } = this;        
        return (
            <Grid> 
                <Row>
                    <Col xs={10} md={11}>
                        <div className="quiz-intro" ref={(el) => { this.quizTop = el; }}> {t("quizIntro")} </div>
                    </Col>
                    {mark && <Col xs={2} md={1}>                    
                        <a onClick={this.scrollToBottom} class="btn btn-info scroll-button">
                            <span class="glyphicon glyphicon-arrow-down"></span><br/></a>
                    </Col>}
                </Row>
                {this.progressBar()}
                {questions.map(this.renderQuestion)}
                  
                {answered < totalQuestions || answered===totalQuestions && nextQuestionEnabled? <div>                       
                </div>  
                    : 
                    <div>
                        <Row><Col xs={10} md={11}>
                            <Alert>
                                {t("yourResultIs")}<strong> {mark}/{totalQuestions}</strong>. {t("checkWhoYouAre")} 
                                { } <i class="fa fa-smile-o"></i><i class="fa fa-smile-o"></i><i class="fa fa-smile-o"></i>
                            </Alert>
                            <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                        </Col>
                        <Col xs={2} md={1}>                    
                            <a onClick={this.scrollToTop} class="btn btn-info scroll-button">
                                <span class="glyphicon glyphicon-arrow-up"></span><br/></a>
                        </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={11}>
                                <Table bordered condensed>
                                    <thead>
                                        <tr>
                                            <th>{t("result")}</th>
                                            <th>{t("whoYouAre")}</th>                                
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className={mark >= 12? "your-result": ""}>
                                            <td>12-15</td>
                                            <td>{t("result12")}</td>
                                        </tr>
                                        <tr className={mark < 12 && mark >=7? "your-result": ""}>
                                            <td>7-11</td>
                                            <td>{t("result7")}</td>
                                        </tr>
                                        <tr className={mark < 7 && mark >=2? "your-result": ""}>
                                            <td>2-6</td>
                                            <td>{t("result2")}</td>
                                        </tr>
                                        <tr className={mark <2? "your-result": ""}>
                                            <td>0-1</td>
                                            <td>{t("result0")}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>                   
                        </Row>
                    </div>
                }             
            </Grid>                                  
        );
    }
}

Quiz.propTypes = {     
    activateRSVP: PropTypes.func.isRequired,
    authUser: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired    
};

export default translate("quiz")(withRouter(Quiz));
