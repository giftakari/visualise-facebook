import React, { Component } from "react";
import { processWordData } from "../functions/process-data";
import { actions } from "../functions/store";
import { connect } from "unistore/react";
import Loader from "./loader";


class ChartWords extends Component {
  constructor() {
    super();
  }

  render() {
    if (!this.props.zip) return null;
    if (!this.props.words) {
      this.props.extractWords();
      return <Loader />;
    }
    console.log(processWordData(this.props.words))
    return (
      <div className="py-5">
        <div>
          {" "}
        </div>
      </div>
    );
  }
}

const WrappedChartWords = connect(
  "zip, words",
  actions
)(ChartWords);

export default WrappedChartWords;
