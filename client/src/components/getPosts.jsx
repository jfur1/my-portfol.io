import React, { Component } from 'react';

class GetPosts extends Component {
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
        fetch('http://localhost:5000/getPosts',{
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
    console.log("List: ", list);

    return (
      <div className="posts">
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
                      <th>{sublist.post}</th>
                      <th>{sublist.date}</th>
                    </tr>
                // </div>
              );
            })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {/* Comment Out: Avoids the temporary "No items found" img upon our initial render (looks smoother).*/}
            <h2>No List Items Found</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default GetPosts;
