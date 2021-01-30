import React from 'react';


export const Post = (post) => {
    //console.log("Single Post: ", post["data"]);
    const data = post["data"];

    const date = data["date_created"];
    //console.log("DATE TYPE: ", typeof date);
    //console.log("DATE: ", date);
    var year = date.substring(0, 4);
    var month = date.slice(5, 7);
    var months = {"01" : "Jan", "02" : "Feb", "03" : "Mar", "04" : "Apr", "05" : "May", "06" : "Jun", "07" : "Jul", "08" : "Aug", "09" : "Sep", "10" : "Oct", "11": "Nov", "12" : "Dec"};
    const month_name = months[month];
    const day = date.slice(8, 10);
    const date_tag = `Published: ${month_name} / ${day} / ${year}`; 
    
    return(
        <div className="post-container">
            <h6>{data["body"]}</h6>
            <br></br>
            <p>{date_tag}</p>
        </div>
    );
}