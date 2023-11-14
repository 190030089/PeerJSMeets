import React from "react";
import styles from "./Modal.module.css";
import { RiCloseLine } from "react-icons/ri";

const Modal = (props) => {
  return (
    <div className="bg-rgba-black-85 fixed height-full left top block width-full fadein">
      <div className={''} onClick={() => props.setIsOpen(false)} />
      <div className={'fixed top left height-full width-full flex flex-items-center justify-center'}>
        <div className={"duc-modal-content width-full height-full overflow-hidden rel bg-ui-white rel radius-lg"} style={{maxWidth: "500px", maxHeight:"150px"}}>
          <div className={'pad-t-sm flex justify-center '}>
            <h5 className={'heading-md css-bold'}>{props.heading}</h5>
          </div>
          <button className={'btn-reset flex flex-centered touch-space height-md-all width-md-all absolute top6 right6'} onClick={() => props.setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={"pad-t-md  pad-sm"} >{props?.children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
