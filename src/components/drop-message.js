import React from "react";
import { connect } from "unistore/react";

const DropMessage = props => {
  if (props.zip) return null;

  return (
    <div className="d-flex justify-content-center align-items-center drop-message">
      <p>DROP FACEBOOK FILES HERE</p>
    </div>
  );
};

const WrappedDropMessage = connect("zip")(DropMessage);

export default WrappedDropMessage;
