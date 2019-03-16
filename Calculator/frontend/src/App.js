import React, { Component } from "react";
import axios from "axios";
import "./App.css";

// App -> Container -> (row which has bootstrap display card/panel and below it are the rows for the digits/operators)

const cardStyle = {
  // Setting the css to be used in JSX. Card is the display where result is shown
  // We use such a size such that character limit that can be displayed in the card is 42. Any more characters will cross the border of the card
  height: "100px",
  width: "165px"
};

const appStyle = {
  // Setting the css to be used in JSX. App contains the calculator container
  width: "178px"
};

class App extends Component {
  state = {
    expression: "", // Initially we set expression to empty. Expression is the property which is sent to the backend. eval function evaluates this expression
    errorFlag: false // this flag is set when there is invalid expression. We need this flag so as to refresh the expression property when the expression is invalid
  };

  handleEquals = async () => {
    // Uses async await. async keyword after the = is the current syntax. Previously, async keyword before the handleClick was valid syntax
    console.log("Submit Clicked!");
    let data;

    if (this.state.expression === "") {
      // If expression is empty and equal is clicked, print empty
      return;
    }

    if (this.state.errorFlag === true) {
      // If invalid expression or equal is clicked a number of times after invalid exp, empty the expression
      this.setState({ expression: "", errorFlag: !this.state.errorFlag });
    }

    try {
      // fetch data from a url endpoint. We need try catch as catch block will catch the error which is sent by the backend eval function when the expression is invalid
      data = await axios.post("http://localhost:3001/", {
        query: this.state.expression // query is accessible at the backend by req.body.query
      });
      //console.log(data);
      //console.log(data.data.value);
      this.setState({ expression: data.data.value });
    } catch (error) {
      //console.log("Errors");
      //console.log(error);
      //console.log(error.response.data);
      this.setState({ expression: error.response.data, errorFlag: !this.state.errorFlag }); // If error then change the error flag
    }
  };

  handleClick = event => {
    // clicking all except the equals button
    // We want to send the button id of 0-9, +,-,/,* and we want to handle them all with a single handler as we only want to concat them into the previous expression
    // Refer - https://developer.mozilla.org/en-US/docs/Web/API/Event/target
    // Refer - https://www.freecodecamp.org/forum/t/react-js-passing-button-id-as-parameter-onclick-function/62301
    console.log(event.target.id); // event is the property of each click event and it has a target property which stores the button id. Using event.target - https://developer.mozilla.org/en-US/docs/Web/API/Event/target
    var previousExpression = this.state.expression;

    if (this.state.errorFlag === true) {
      // When a button is clicked after and invalid input error was generated, we need to flush all of the previously stored expression
      previousExpression = "";
      this.setState({ errorFlag: !this.state.errorFlag });
    }

    var expression = previousExpression + event.target.id; // Concat current click will the previous expression
    console.log(expression);
    this.setState({ expression });
  };

  displayTruncated = () => {
    // This is displayed on the display card
    // Our card can only display 42 characters, therefore we have to truncate what we are displaying in the card if the length of expression is large, else the characters print out of the card
    let currentExpression = this.state.expression;
    let expressionLength = currentExpression.length;

    if (expressionLength === 0) {
      return "0";
    } else if (expressionLength > 35) {
      let truncatedExpression = "..." + currentExpression.substring(expressionLength - 36, expressionLength - 1);
      return truncatedExpression;
    } else {
      return currentExpression;
    }
  };

  render() {
    return (
      <div className="App border border-primary" style={appStyle}>
        <div className="container m-1">
          <div className="row">
            <div className="card border border-primary" style={cardStyle}>
              <div className="card-body">
                <p className="card-title">{this.displayTruncated()}</p>{" "}
                {/* Here we have used this.displayTruncated() instead of this.displayTruncated. When ever we have to print the returned value of function that is call the function, we use (), and whenever we have to use the reference that is, when we have to only execute that function, we dont use ()*/}
              </div>
            </div>
          </div>
          <div className="row">
            <button id="7" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              7
            </button>
            <button id="8" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              8
            </button>
            <button id="9" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              9
            </button>
            <button id="/" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              &divide;
            </button>
          </div>

          <div className="row">
            <button id="4" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              4
            </button>
            <button id="5" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              5
            </button>
            <button id="6" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              6
            </button>
            <button id="*" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              x
            </button>
          </div>

          <div className="row">
            <button id="1" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              1
            </button>
            <button id="2" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              2
            </button>
            <button id="3" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              3
            </button>
            <button id="-" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              -
            </button>
          </div>

          <div className="row">
            <button id="0" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              0
            </button>
            <button id="." onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              .
            </button>
            <button id="=" onClick={this.handleEquals} type="button" className="btn btn-outline-primary waves-effect m-1">
              =
            </button>
            <button id="+" onClick={this.handleClick} type="button" className="btn btn-outline-primary waves-effect m-1">
              +
            </button>
          </div>
          <div className="row px-3">
            <button
              id="clear"
              onClick={() => {
                this.setState({ expression: "", errorFlag: false });
              }}
              type="button"
              className="btn btn-outline-primary waves-effect px-5"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
