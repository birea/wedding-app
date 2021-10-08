import * as React from "react";
import { Col, ControlLabel, FormGroup, FormControl, HelpBlock } from "react-bootstrap";
import PropTypes from "prop-types";

export function FieldGroup({ id, t, label, validationState, inputSize, ...props }) {
    return (
        <FormGroup controlId={id} validationState={validationState}>
            <Col componentClass={ControlLabel} >{label}</Col><Col sm={9}>
                <FormControl {...props} />
                <FormControl.Feedback />
                {inputSize && props.value && <HelpBlock>{props.value.length} {t("of")} {inputSize}</HelpBlock>}
            </Col>

        </FormGroup>
    );
}

FieldGroup.propTypes = {
    id: PropTypes.string.isRequired,
    inputSize: PropTypes.number,
    label: PropTypes.string.isRequired,
    t: PropTypes.func,
    validationState: PropTypes.string,
    value: PropTypes.string
};

FieldGroup.defaultProps = {
    inputSize: null,
    value: null,
    t: null
};