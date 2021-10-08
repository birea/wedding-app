import PropTypes from "prop-types";
import * as React from "react";
import { translate } from "react-i18next";
import Countdown from "react-countdown-now";
import {Row} from "react-bootstrap";

class CountDown extends React.Component {
  
    renderer = ({ days,hours, minutes, seconds, completed }) => {
        const{props: {t}}= this;
        if (completed) {          
            return (<h2>{this.props.t("CountDownEnded")}</h2>);
        } else {          
            return (
                <Row>
                    <div className="countdown">
                        <h2 className="carousel-cap"><i class="glyphicon glyphicon-heart-empty"></i> {t("countDownIntro")}
                        <i class="glyphicon glyphicon-heart-empty"></i></h2>
                        <h1 className="countdown">{days} {t("days")}  {hours}:{minutes}:{seconds}</h1>
                    </div>
                </Row>);
        }
    };

    render() {
        return (
            <Countdown
                date={new Date(2018, 11, 8, 11)}
                renderer={this.renderer}
            />
        );
    }
}
CountDown.propTypes = {
    t: PropTypes.func.isRequired
};

export default translate("home")(CountDown);