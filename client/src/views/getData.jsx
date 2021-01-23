import React, { Component } from 'react';
import FlashMessage from 'react-flash-message';

class UsersTable extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      list: []
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

    // Retrieves the list of items from the Express app
    getList = () => {
        fetch('http://localhost:5000/getData')
        .then(function(response){
            return response.json();
        })
        .then(list => this.setState({ list }))
    }

  render() {
    const { list } = this.state;
    console.log("List: ", list);

    return (
      <div className="App">
        <a href="/home"><img className="logostyle" src="/mp-logo.png" alt="logo"/></a>
        <h1>List of Items</h1>
        {/* Check to see if any items are found*/}
        {list.length ? (
          <div>
            {/* Render the list of items */}
            <table className="center">
              <tbody>
            {list.map((sublist, idx) => {
              return(
                // <div key={idx}>
                    <tr key={idx}>
                      <th>{sublist.user_id}</th>
                      <th>{sublist.first_name}  {sublist.last_name}</th>
                      <th>{sublist.email}</th>
                    </tr>
                // </div>
              );
            })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {/* Comment Out: Avoids the temporary "No items found" img upon our initial render (looks smoother).
            <h2>No List Items Found</h2> */}
          </div>
        )
      }
      </div>
    );
  }
}

export default UsersTable;