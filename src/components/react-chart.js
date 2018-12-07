import React, { Component } from "react";

class ReactChart extends Component {
  constructor() {
    super();
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.chartRef.current.appendChild(this.props.canvas);
  }

  render() {
    this.props.chart.update();
    return <div ref={this.chartRef} />;
  }
}

export default ReactChart;
