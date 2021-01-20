import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
    <div className="App">
      <h1>Project Home</h1>
      {/* Link to List.js */}
      <Link to={'./getData'}>
        <button variant="raised">
            View Database
        </button>
      </Link><br></br>
    </div>
    );
  }
}
export default Home;
