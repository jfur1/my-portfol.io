export const Portfolio = props => {
    console.log("Portfolio Recieved Props: ", props);
    const user = props.location.state.user;
    const portfolio = props.location.state.portfolio;
    const education = props.location.state.education;

    return(
        <>        

        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>Portfolio Page</p>

        <div className="user-container">
        <h3>Work Experience:</h3>
        {portfolio
        ? portfolio.map((row, idx) => 
            <div key={idx}>
                <p><b>Occupation:</b> {row.occupation}</p>
                <p><b>Organization:</b> {row.organization}</p>
                <p><b>From:</b> {row.from_when}</p>
                <p><b>To:</b> {row.to_when}</p>
                <br></br>
            </div>
        )
        : null } 
        </div>
        <div className="user-container">
        <h3>Education</h3>
        {education 
        ? education.map((row, idx) => 
            <div key={idx}>
                <p><b>Education: </b>{row.education}</p>
                <p>{row.organization 
                ? row.organization : null}</p>
                <br></br>
            </div>
        )
        : null}
        </div>
        </>
    );
}