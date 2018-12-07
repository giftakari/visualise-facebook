import JSZip from "jszip";
import React, { Component } from "react";
import { connect } from "unistore/react";
import { actions } from "../functions/store";

class DropZone extends Component {
  constructor() {
    super();
    this.state = { active: false };
    this.handleDrop = this.handleDrop.bind(this);
  }

  handleDrop(e) {
    e.preventDefault();
    this.setState({ active: false });
    if (e.dataTransfer.files) {
      if (e.dataTransfer.files.length > 1) {
        alert("Too many files");
      } else {
        const file = e.dataTransfer.files[0];
        var zip = new JSZip();
        zip.loadAsync(file).then(
          zip => {
            this.props.dropData(zip);
          },
          () => {
            alert("Not a valid zip file");
          }
        );
      }
    }
  }

  render() {
    return (
      <div
        className={`drop-zone ${this.state.active ? "is-active" : ""} ${
          this.props.zip ? "inactive" : ""
        }`}
        ref={this.dropzone}
        onDragOver={e => {
          e.preventDefault();
          this.setState({ active: true });
        }}
        onDragLeave={e => {
          e.preventDefault();
          this.setState({ active: false });
        }}
        onDrop={this.handleDrop}
      >
        {this.props.children}
      </div>
    );
  }
}

const WrappedDropZone = connect(
  "zip",
  actions
)(DropZone);

export default WrappedDropZone;
