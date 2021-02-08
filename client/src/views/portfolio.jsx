import { PencilFill } from 'react-bootstrap-icons';

export const Portfolio = props => {
    console.log("Portfolio Recieved Props: ", props);
    const user = props.location.state.user;
    const portfolio = props.location.state.portfolio;
    const education = props.location.state.education;
    const projects = props.location.state.projects;

    return(
        <div className="tab-container">        

        <h3>Hey {user.firstname} {user.lastname}</h3>
        <p>Portfolio Page</p>

        {props.data.ownedByUser ? <PencilFill size={25} onClick={() => console.log("click")}/> : null}

        
        <div className="user-container">
            <h3>Projects</h3>
            {projects 
            ? projects.map((row, idx) => 
                <div key={idx}>
                    <h4><b>Project: </b>{row.title}</h4>

                    <p>{row.organization 
                    ? row.organization : null}</p>

                    <p>{row.description 
                    ? row.description : null}</p>
                    
                    <p><b>From:</b> {row.from_when}</p>
                    <p><b>To:</b> {row.to_when}</p>
                    <p><b>To:</b> {row.link}</p>
                    <br></br>
                </div>
            )
            : null}
        </div>

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

        </div>
    );
}