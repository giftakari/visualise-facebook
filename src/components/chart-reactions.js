import React, { Component } from "react";
import { processReactionData } from "../functions/process-data";
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
          gridLines: { color: "#444" },
          type: "time"
        }
      ]
    }
  }
});

class ChartReactions extends Component {
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
    if (!this.props.reactions) {
      this.props.extractReactions();
      return <Loader />;
    }

    const datasets = processReactionData(
      this.props.reactions,
      this.state.format
    );

    chart.options.title = {
      display: true,
      fontSize: 32,
      fontColor: "white",
      padding: 20,
      text: `Reactions by ${this.state.format}${
        this.state.cumulative ? " (cumulative)" : ""
        }`
    };

    chart.data.datasets = this.state.cumulative
      ? datasets.map((d, i) => {
        return {
          label: d.label,
          data: d.data
            .map(d => ({ x: d.x, y: d.y }))
            // Create cumulative sum
            .reduce((a, b, i) => {
              const c = a[i - 1] ? a[i - 1].y : 0;
              return [...a, { y: b.y + c, x: b.x }];
            }, []),
          type: "line",
          borderColor: Chart.helpers
            .color(
              chartColors[
              Object.keys(chartColors)[i % Object.keys(chartColors).length]
              ]
            )
            .rgbString(),
          backgroundColor: Chart.helpers
            .color(
              chartColors[
              Object.keys(chartColors)[i % Object.keys(chartColors).length]
              ]
            )
            .alpha(0.15)
            .rgbString(),
          lineTension: 0
        };
      })
      : datasets.map((d, i) => {
        return {
          label: d.label,
          data: d.data.map(d => ({ x: d.x, y: d.y })),
          type: d.data.length > 1000 ? "line" : "bar",
          borderColor: Chart.helpers
            .color(
              chartColors[
              Object.keys(chartColors)[i % Object.keys(chartColors).length]
              ]
            )
            .rgbString(),
          backgroundColor: Chart.helpers
            .color(
              chartColors[
              Object.keys(chartColors)[i % Object.keys(chartColors).length]
              ]
            )
            .alpha(0.15)
            .rgbString(),
          lineTension: this.state.format === "hour" ? 0.25 : 0
        };
      });

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
              id="ReactionsByDay"
              name="ReactionsPeriod"
            />
            <label className="custom-control-label" htmlFor="ReactionsByDay">
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
              id="ReactionsByMonth"
              name="ReactionsPeriod"
            />
            <label className="custom-control-label" htmlFor="ReactionsByMonth">
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
              id="ReactionsByHour"
              name="ReactionsPeriod"
            />
            <label className="custom-control-label" htmlFor="ReactionsByHour">
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
              id="ReactionsCumulative"
            />
            <label
              className="custom-control-label"
              htmlFor="ReactionsCumulative"
            >
              Cumulative
            </label>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedChartReactions = connect(
  "zip, reactions",
  actions
)(ChartReactions);

export default WrappedChartReactions;
