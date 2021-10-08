import * as React from "react";
import { Col, ControlLabel, FormGroup, FormControl } from "react-bootstrap";
import PropTypes from "prop-types";

export function WallFieldGroup({ id, label, validationState, ...props }) {
    
    return (
        <FormGroup controlId={id} validationState={validationState}>
            <Col xs={1} componentClass={ControlLabel} >{label}</Col>
            <Col xs={11}>
                <FormControl {...props} />
                <FormControl.Feedback />    
            </Col>

        </FormGroup>
    );
}

WallFieldGroup.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    t: PropTypes.func,
    validationState: PropTypes.string.isRequired,
    value: PropTypes.string
};

WallFieldGroup.defaultProps = {    
    value: null,
    t: null
};