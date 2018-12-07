import React, { Component } from "react";
import { processMessagesData } from "../functions/process-data";
import Chart from "chart.js";
import ReactChart from "./react-chart";
import { actions } from "../functions/store";
import { connect } from "unistore/react";
import Loader from "./loader";
import { chartColors } from "../functions/colors";

const canvas = document.createElement("canvas");
canvas.classList.add("chart");
const chart = new Chart(canvas, {
  type: "bar",
  data: {
    labels: [],
    datasets: []
  },
  options: {
    scales: {
      yAxes: [
        {
          gridLines: { color: "#444" },
          ticks: {
            beginAtZero: true
          }
        }
      ],
      xAxes: [
        {
          gridLines: { color: "#444" }
        }
      ]
    }
  }
});

class ChartMessages extends Component {
  constructor() {
    super();
    this.state = {
      cumulative: false,
      format: "day"
    };
    this.cumulativeRef = React.createRef();
  }

  render() {
    if (!this.props.zip) return null;
    if (!this.props.messages) {
      this.props.extractMessages();
      return <Loader />;
    }

    const data = processMessagesData(this.props.messages, this.state.format);
    chart.data.labels = data.map(d => d.label);

    chart.options.title = {
      display: true,
      fontSize: 32,
      fontColor: 'white',
      padding: 20,
      text: `Messages by ${this.state.format}${
        this.state.cumulative ? " (cumulative)" : ""
      }`
    };

    chart.data.datasets = this.state.cumulative
      ? [
          {
            label: `Messages`,
            data: data
              .map(d => d.value)
              // Create cumulative sum
              .reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []),
            type: "line",
            borderWidth: 3,
            borderColor: Chart.helpers.color(chartColors.orange).rgbString(),
            backgroundColor: Chart.helpers
              .color(chartColors.orange)
              .alpha(0.75)
              .rgbString()
          }
        ]
      : [
          {
            label: `Messages`,
            data: data.map(d => d.value),
            borderWidth: 1,
            type: "bar",
            borderWidth: 3,
            borderColor: Chart.helpers.color(chartColors.orange).rgbString(),
            backgroundColor: Chart.helpers
              .color(chartColors.orange)
              .alpha(0.5)
              .rgbString()
          }
        ];

    return (
      <div className="py-5">
        <ReactChart chart={chart} canvas={canvas} />
        <div className="row justify-content-center mt-5">
          <div className="custom-control pr-4 custom-radio">
            <input
              className="custom-control-input"
              onClick={e => {
                this.setState({ format: "day" });
              }}
              type="radio"
              defaultChecked
              id="MessagesByDay"
              name="MessagesPeriod"
            />
            <label className="custom-control-label" htmlFor="MessagesByDay">
              By Day
            </label>
          </div>

          <div className="custom-control pr-4 custom-radio">
            <input
              className="custom-control-input"
              onClick={e => {
                this.setState({ format: "month" });
              }}
              type="radio"
              id="MessagesByMonth"
              name="MessagesPeriod"
            />
            <label className="custom-control-label" htmlFor="MessagesByMonth">
              By Month
            </label>
          </div>

          <div className="custom-control pr-4 custom-radio">
            <input
              className="custom-control-input"
              onClick={e => {
                this.cumulativeRef.current.checked = false;
                this.setState({ format: "hour", cumulative: false });
              }}
              type="radio"
              id="MessagesByHour"
              name="MessagesPeriod"
            />
            <label className="custom-control-label" htmlFor="MessagesByHour">
              By Hour of Day
            </label>
          </div>

          <div className="custom-control pr-4 custom-check">
            <input
              className="custom-control-input"
              ref={this.cumulativeRef}
              disabled={this.state.format === "hour"}
              onChange={e => {
                this.setState({ cumulative: e.target.checked });
              }}
              type="checkbox"
              id="MessagesCumulative"
            />
            <label
              className="custom-control-label"
              htmlFor="MessagesCumulative"
            >
              Cumulative
            </label>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedChartMessages = connect(
  "zip, messages",
  actions
)(ChartMessages);

export default WrappedChartMessages;
