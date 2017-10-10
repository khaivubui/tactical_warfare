import React from "react";

class SessionForm extends React.Component {
  constructor(props) {
    this.state = {
      username: "",
      password: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
  }

  update(field) {
    return e => {
      this.setState({ [field]: e.currentTarget.value});
    };
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            placeholder="Username"
            value={this.state.username}
            onChange={this.update("username")}
          />
        </label>
        <label>
          Password:
          <input
            type="text"
            placeholder="Password"
            value={this.state.password}
            onChange={this.update("password")}
          />
        </label>
      </form>
    );
  }
}

export default SessionForm;
