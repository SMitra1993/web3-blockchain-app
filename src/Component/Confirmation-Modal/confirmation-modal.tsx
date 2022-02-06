import React, { FunctionComponent } from "react";
import { ConfirmationModalProps } from "../../Interface/confirm-modal-props";
import {
  ConfirmationButtons,
  Message,
  NoButton,
  YesButton,
} from "./confirmation-modal.style";

export const ConfirmationModal: FunctionComponent<ConfirmationModalProps> = (
  props
) => {
  return (
    <React.Fragment>
      <Message>{props.message}</Message>
      <ConfirmationButtons>
        <YesButton onClick={props.onConfirm}>Yes</YesButton>
        <NoButton onClick={props.onCancel}>No</NoButton>
      </ConfirmationButtons>
    </React.Fragment>
  );
};
