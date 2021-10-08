import PropTypes from "prop-types";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { auth } from "../../firebase";

import {Grid, Row, Col, Panel, FormGroup, ControlLabel, FormControl, Button} from "react-bootstrap";
import { translate } from "react-i18next";

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value
});

class PasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {email: "", emailSent: false };
    }

  handleOnSubmit = (event) => {
      const { state: { email } } = this;

      //const { props: { history } } = this;

      auth.doPasswordReset(email)
          .then(() => this.setState({ email: "", emailSent: true }))
          .catch(error => {
              this.setState({error: error});
          });

      event.preventDefault();
  }

  render() {
      const { state: { email, emailSent, error }, props: { t } } = this;
      const isInvalid = email === "";        
      return (
          <div>
                <Grid>
                    <Row>
                        <Col xsOffset={3} xs={6}>
                <Panel>
                    <Panel.Heading>
                        <Panel.Title className="login-header" componentClass="h3">{t("passwordReset")}</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <form onSubmit={this.handleOnSubmit}>
                        <FormGroup>
                                <ControlLabel>{t("emailAddress")}</ControlLabel>
                                <FormControl id="emailId" name="email" type="text" onChange={event => this.setState(byPropKey("email", event.target.value))} placeholder={t("enterMail")} />
                        </FormGroup>
                        <FormGroup>
                            <Button className="signUp-button" disabled={isInvalid} type="submit">{t("resetPassword")}</Button>             
                        </FormGroup>
                        </form>
                        {emailSent && <ControlLabel>{t("mailSent")}</ControlLabel>}
                        {error && <ControlLabel>{error.message}</ControlLabel>}
                        
                    </Panel.Body>
                </Panel>
                </Col>
                    </Row>
                </Grid>     
          </div>

      );
  }
}
PasswordReset.propTypes = {
    t: PropTypes.func.isRequired
};


export default translate("login")(withRouter(PasswordReset));
