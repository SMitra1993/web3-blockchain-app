import React, { FunctionComponent, useEffect } from "react";
import ReactDOM from "react-dom";
import { ModalProps } from "../../Interface/modal-props";
import {
  Backdrop,
  CloseButton,
  Content,
  Header,
  HeaderText,
  StyledModal,
  Wrapper,
} from "./modal.style";

export const Modal: FunctionComponent<ModalProps> = ({
  isShown,
  hide,
  modalContent,
  headerText,
}) => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'escape' && isShown) {
      hide();
    }
  };

  useEffect(() => {
    isShown
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
    document.addEventListener("keydown", onKeyDown, false);
    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, [isShown]);
  const modal = (
    <React.Fragment>
      <Backdrop onClick={hide} />
      <Wrapper
        aria-modal
        aria-labelledby={headerText}
        tabIndex={-1}
        role="dialog"
      >
        <StyledModal>
          <Header>
            <HeaderText>{headerText}</HeaderText>
            <CloseButton
              type="button"
              data-dismiss="modal"
              aria-label="Close"
              onClick={hide}
            >
              X
            </CloseButton>
          </Header>
          <Content>{modalContent}</Content>
        </StyledModal>
      </Wrapper>
    </React.Fragment>
  );

  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};
