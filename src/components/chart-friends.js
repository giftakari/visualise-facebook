import React, { Component } from "react";
import { processFriendsData } from "../functions/process-data";
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

class ChartFriends extends Component {
  constructor() {
    super();
    this.state = {
      cumulative: false,
      format: "day"
    };
  }

  render() {
    if (!this.props.zip) return null;
    if (!this.props.friends) {
      this.props.extractFriends();
      return <Loader />;
    }

    const data = processFriendsData(this.props.friends, this.state.format);
    chart.data.labels = data.map(d => d.label);

    chart.options.title = {
      display: true,
      fontSize: 32,
      fontColor: "white",
      padding: 20,
      text: `Friends by ${this.state.format}${
        this.state.cumulative ? " (cumulative)" : ""
        }`
    };

    chart.data.datasets = this.state.cumulative
      ? [
        {
          label: `Friends`,
          data: data
            .map(d => d.value)
            // Create cumulative sum
            .reduce((a, x, i) => [...a, x + (a[i - 1] || 0)], []),
          type: "line",
          borderWidth: 3,
          borderColor: Chart.helpers.color(chartColors.red).rgbString(),
          backgroundColor: Chart.helpers
            .color(chartColors.red)
            .alpha(0.5)
            .rgbString()
        }
      ]
      : [
        {
          label: `Friends`,
          data: data.map(d => d.value),
          type: data.length > 1000 ? "line" : "bar",
          borderWidth: 3,
          borderColor: Chart.helpers
            .color(chartColors.red)
            .lighten(0.025)
            .rgbString(),
          backgroundColor: Chart.helpers
            .color(chartColors.red)
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
              defaultChecked
              type="radio"
              id="FriendsByDay"
              name="FriendsPeriod"
            />
            <label className="custom-control-label" htmlFor="FriendsByDay">
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
              id="FriendsByMonth"
              name="FriendsPeriod"
            />
            <label className="custom-control-label" htmlFor="FriendsByMonth">
              By Month
            </label>
          </div>

          <div className="custom-control pr-4 custom-checkbox">
            <input
              className="custom-control-input"
              onChange={e => {
                this.setState({ cumulative: e.target.checked });
              }}
              type="checkbox"
              id="FriendsCumulative"
            />
            <label className="custom-control-label" htmlFor="FriendsCumulative">
              Cumulative
            </label>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedChartFriends = connect(
  "zip, friends",
  actions
)(ChartFriends);

export default WrappedChartFriends;
