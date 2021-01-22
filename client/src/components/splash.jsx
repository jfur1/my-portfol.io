import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Splash extends Component {
  render() {
    return (
    <div className="App">
      <img src="/mp-logo.png" alt="logo" />
      {/* Link to List.js */}
      <Link to={'./getData'}>
        <button className="btn btn-dark btn-lg" variant="raised">
            View Database
        </button>
      </Link>
      <br><br/>
      <Link to={'./newUser'}>
        <button variant="raised">
          Sign Up
        </button>
      </Link>
    </div>
    );
  }
}
export default Splash;
