import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import DropZone from "./components/dropzone";
import { Provider } from "unistore/react";
import { store } from "./functions/store";
import DropMessage from "./components/drop-message";
import ChartFriends from "./components/chart-friends";
import ChartMessages from "./components/chart-messages";
import ChartWords from "./components/chart-words";
import ChartReactions from "./components/chart-reactions";

import Chart from "chart.js";
Chart.defaults.global.defaultFontColor = "#AAA";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10">
              <DropZone>
                <DropMessage />
                <ChartFriends />
                <ChartMessages />
                <ChartReactions />
                <ChartWords />
              </DropZone>
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
