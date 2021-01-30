import React, { Component } from 'react';

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
        fetch('http://localhost:5000/getData',{
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          withCredentials: true
        })
        .then(function(response){
            return response.json();
        })
        .then(list => this.setState({ list }))
    }

  render() {
    const { list } = this.state;

    return (
        <div className="getDataList">
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
                <tr key={idx}>
                  <th>{sublist.user_id}</th>
                  <th>{sublist.first_name}  {sublist.last_name}</th>
                  <th>{sublist.email}</th>
                </tr>
              );
            })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h2>No List Items Found</h2> 
          </div>
        )
      }
    </div>
    );
  }
}

export default UsersTable;
