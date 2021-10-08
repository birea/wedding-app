import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as routes from "./../../constants/routes";
import PropTypes from "prop-types";
import { Grid, Row, Table, PageHeader, Badge } from "react-bootstrap";
import "./../../css/userList.css";
import { db } from "../../firebase";
import { translate } from "react-i18next";
import withAuthorization from "../auth/withAutorization";

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: null
        };
        this.handleIconClick = this.handleIconClick.bind(this);
        this.loadUserList = this.loadUserList.bind(this);
    }

    componentDidMount() {
        this.loadUserList();
        this.loadRSVP();
        this.loadQuiz();
        this.props.setActiveNav("/admin/user-list");
    }

    loadUserList() {
        db.onceGetUsers()
            .then(snapshot => this.setState(() => ({ users: snapshot.val() })))
            .catch(() => this.setState(() => ({ users: [] })));
    }

    loadQuiz() {
        db.onceGetQuiz()
            .then(snapshot => this.setState(() => ({ quiz: snapshot.val() })))
            .catch(() => this.setState(() => ({ quiz: [] })));
    }

    loadRSVP() {
        db.onceGetRSVP()
            .then(snapshot => this.setState(() => ({ rsvp: snapshot.val() })))
            .catch(() => this.setState(() => ({ rsvp: [] })));
    }


    handleIconClick = (uid, route, tabId) => () => {
        const { props: { history, setUserReviewed }, state: { users } } = this;
        setUserReviewed(users[uid], route);
        history.push({//eslint-disable-line fp/no-mutating-methods
            pathname: route,
            search: null,
            state: { activeTab: tabId }
        });
    }

    renderPersons = persons => {        
        const reducer = (currentValue,accumulator) => `${accumulator} ${currentValue}`;
        return persons.map(p => `${p.name}(${p.age})`).reduce(reducer);
    }

    calculateTotals = uids =>{
        const {state:{rsvp}} = this;        
        const totals= {};
        totals.isConfirmed = uids.map(v => rsvp[v] && rsvp[v].isConfirmed === "Y" ? 1: 0).reduce((a,b) => a+b,0);        
        totals.persons = uids.map(v => rsvp[v] && rsvp[v].persons ? rsvp[v].persons.size: 0).reduce((a,b) => a+b,0);
        totals.stayNight = uids.map(v => rsvp[v] && rsvp[v].stayNight === "Y" ? 1: 0).reduce((a,b) => a+b,0);
        totals.foreign = uids.map(v => rsvp[v] && rsvp[v].foreign === "Y" ? 1: 0).reduce((a,b) => a+b,0);        
        totals.ride = uids.map(v => rsvp[v] && rsvp[v].ride === "Y" ? 
            (1 + (rsvp[v].persons? rsvp[v].persons.size: 0)) : 0).reduce((a,b) => a+b,0);
        return totals;
    }

    render() {
        const { props: { t }, state: { users,quiz,rsvp } } = this;
        if (!(quiz && users && rsvp)){
            return <div></div>;
        }
        const uids = Object.keys(users);        
        uids.sort((a,b) => users[a].username > users[b].username);
        const totals = this.calculateTotals(uids);
        return (
            <div>
                <Grid>
                    {!!users &&
                        <div>
                            <Row><PageHeader className="App">{t("List of Users")}</PageHeader> </Row>
                            <Row>                                
                                <Table className="App" striped bordered hover>
                                    <thead >
                                        <tr >                                            
                                            <th>{t("Username")}</th>
                                            <th>{t("Google Display Name")}</th>
                                            <th>{t("Email")}</th>
                                            <th>{t("Language")}</th>                                        
                                            <th>{t("Mark")}</th>                                                
                                            <th>{t("isConfirmed")}</th>                                                
                                            <th>{t("persons")}</th>                                                
                                            <th>{t("intollerance")}</th>                                                
                                            <th>{t("stayNight")}</th>                                                
                                            <th>{t("foreign")}</th>                                                
                                            <th>{t("arrival")}</th>                                                
                                            <th>{t("ride")}</th>                                                
                                            <th>{t("lastUpdate")}</th>                                                

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uids.map(key =>
                                            <tr key={key} >
                                                <td>
                                                    {<button type="button" className="btn btn-default btn-xs" onClick={this.handleIconClick(key, routes.WALL)}>
                                                        <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                                                    </button>}
                                                    {users[key].unreadMessages > 0 && <Badge className="badge-nav">{users[key].unreadMessages}</Badge>}
                                                    {" - "}{users[key].username}</td>
                                                <td>{users[key].googleDisplayName}</td>
                                                <td>{users[key].email}</td>
                                                <td>{users[key].language}</td>                                                                                  
                                                <td>{quiz[key] && quiz[key].mark}</td>
                                                <td>{rsvp[key] && rsvp[key].isConfirmed}</td>
                                                <td>{rsvp[key] && rsvp[key].persons &&
                                                this.renderPersons(rsvp[key].persons)} </td>                                               
                                                <td>{rsvp[key] && rsvp[key].intollerance}</td>
                                                <td>{rsvp[key] && rsvp[key].stayNight}</td>
                                                <td>{rsvp[key] && rsvp[key].foreign}</td>
                                                <td>{rsvp[key] && rsvp[key].arrival}</td>
                                                <td>{rsvp[key] && rsvp[key].ride}</td>
                                                <td>{rsvp[key] && new Date(rsvp[key].lastUpdate).toLocaleString()}</td>

                                            </tr>)
                                        }
                                        <tr> 
                                            <td>TOTAL</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>                                                                                  
                                            <td></td>
                                            <td>{totals.isConfirmed}</td>
                                            <td>{totals.persons}</td>                                                                                        
                                            <td></td>
                                            <td>{totals.stayNight}</td>
                                            <td>{totals.foreign}</td>
                                            <td></td>
                                            <td>{totals.ride}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </Table>                             
                            </Row>
                        </div>
                    }
                </Grid>
            </div>
        );
    }
}

UserList.propTypes = {
    history: PropTypes.object.isRequired,
    setActiveNav: PropTypes.func.isRequired,
    setUnreadMessagesCount: PropTypes.func.isRequired,
    setUserReviewed: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired

};
const authCondition = (authUser) => !!authUser;

export default translate("userList")(withAuthorization(authCondition)(withRouter(UserList)));