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
      {/*Link to user.js*/}
      <Link to={'./newUser'}>
        <button variant="raised">
            Add Name
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;
