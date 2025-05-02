import React, { Component } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: "",
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  fetchValues = async () => {
    try {
      const { data } = await axios.get("/api/values/current");
      this.setState({ values: data.data });
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch values");
    }
  };

  fetchIndexes = async () => {
    try {
      const { data } = await axios.get("/api/values/all");
      this.setState({ seenIndexes: data.data });
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch values");
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/api/values", {
        index: this.state.index,
      });
      this.setState({ index: "" });
      toast.success("Value calculated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to calculate value");
    }
  };

  onChange = (event) => {
    this.setState({ index: event.target.value });
  };

  render() {
    return (
      <div className="container my-4">
        <form className="bg-body" onSubmit={this.handleSubmit}>
          <div className="d-flex mb-3">
            <div className="flex-grow-1 me-2">
              <label htmlFor="index" className="form-label">
                Enter your index:
              </label>
              <input
                type="text"
                className="form-control"
                id="index"
                aria-describedby="index"
                placeholder="Enter the index of the Fibonacci number you want to calculate."
                value={this.state.index}
                onChange={this.onChange}
              />
            </div>
            <button type="submit" className="btn btn-primary align-self-end">
              Submit
            </button>
          </div>
        </form>
        <h3>Indexes I have seen:</h3>
        {this.state.seenIndexes.map(({ number }) => number).join(", ")}
        <h3>Calculated Values:</h3>
        {Object.entries(this.state.values).map(([key, value]) => (
          <div key={key}>
            For index {key} I calculated {value}
          </div>
        ))}
      </div>
    );
  }
}
