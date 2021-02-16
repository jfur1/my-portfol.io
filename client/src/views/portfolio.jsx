import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Nav, Tab, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { AlertDismissible } from '../components/alertDismissible';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Switch  from '../components/switch';
import DatePicker from 'react-datepicker'

export const Portfolio = props => {
    console.log("Portfolio Recieved Props: ", props);
    // Data passed down from Profile through the parent state
    const user = props.location.state.user;
    const portfolioData = (props.data.portfolio !== null) ? props.data.portfolio: props.location.state.portfolio;
    const educationData = (props.data.education !== null) ? props.data.education : props.location.state.education;
    const projectsData = (props.data.projects !== null) ? props.data.projects : props.location.state.projects;

    // Display Toggles
    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 

    const [reordered, setReordered] = useState(false);
    const [changingOrder, setChangingOrder] = useState(false);
    
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited) setShowAlert(true);
        else{
            setChangingOrder(false);
            setShow(false);
        }
    }

    // Replace state with original data
    const discardChanges = () => {
        setProjects({values: projectsData});
        setPortfolio({values: portfolioData});
        setEducation({values: educationData});
        setChangingOrder(false);
        setReordered(false);
    }

    // Data to be Modified
    const [projects, setProjects] = useState({values: projectsData});
    const [projectsToDelete, setProjectsToDelete] = useState([]);

    const [portfolio, setPortfolio] = useState({values: portfolioData});
    const [workExperienceToDelete, setWorkExperienceToDelete] = useState([]);

    const [education, setEducation] = useState({values: educationData});
    const [educationToDelete, setEducationToDelete] = useState([]);

    // Upon successful POST response, props will change, so reset hooks
    useEffect(() => {
        setProjects({values: projectsData});
        setProjectsToDelete([]);

        setPortfolio({values: portfolioData});
        setWorkExperienceToDelete([]);

        setEducation({values: educationData});
        setEducationToDelete([]);
    }, [props, projectsData, portfolioData, educationData])


    // --------------- Begin Projects Event Handling --------------

    const handleProjectTitleChange = (event, idx) => {
        let tmpProjects = [...projects.values];
        tmpProjects[idx] = {
            project_id: projects.values[idx].project_id,
            uid: projects.values[idx].uid,
            title: event.target.value,
            description: projects.values[idx].description,
            organization: projects.values[idx].organization,
            from_when: projects.values[idx].from_when,
            to_when: projects.values[idx].to_when,
            link: projects.values[idx].link
        }
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }
    
    const handleProjectDescriptionChange = (event, idx) => {
        let tmpProjects = [...projects.values];
        tmpProjects[idx] = {
            project_id: projects.values[idx].project_id,
            uid: projects.values[idx].uid,
            title: projects.values[idx].title,
            description: event.target.value,
            organization: projects.values[idx].organization,
            from_when: projects.values[idx].from_when,
            to_when: projects.values[idx].to_when,
            link: projects.values[idx].link
        }
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const handleProjectOrganizationChange = (event, idx) => {
        let tmpProjects = [...projects.values];
        tmpProjects[idx] = {
            project_id: projects.values[idx].project_id,
            uid: projects.values[idx].uid,
            title: projects.values[idx].title,
            description: projects.values[idx].description,
            organization: event.target.value,
            from_when: projects.values[idx].from_when,
            to_when: projects.values[idx].to_when,
            link: projects.values[idx].link
        }
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const handleProjectStartChange = (date, idx) => {
        let newDate;
        if(date !== null){
            const offset = date.getTimezoneOffset();
            console.log("offset:", offset)
            if(offset < 0) date.setHours(12, 0, 0);
            //eslint-disable-next-line
            newDate = date.toISOString().replace(/-/g, '\/').replace(/T.+/, '');
            // console.log("Formatted Start Date Object:", date);
            // console.log("Formatted Start Date String:", newDate);
            // console.log("\n")
        }
        let tmpProjects = [...projects.values];
        tmpProjects[idx] = {
            project_id: projects.values[idx].project_id,
            uid: projects.values[idx].uid,
            title: projects.values[idx].title,
            description: projects.values[idx].description,
            organization: projects.values[idx].organization,
            from_when: newDate,
            to_when: projects.values[idx].to_when,
            link: projects.values[idx].link
        }
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const handleProjectFinishChange = (date, idx) => {
        let newDate;
        if(date !== null){
            const offset = date.getTimezoneOffset();
            if(offset < 0) date.setHours(12, 0, 0);
            //eslint-disable-next-line
            newDate = date.toISOString().replace(/-/g, '\/').replace(/T.+/, '');
        }
        let tmpProjects = [...projects.values];
        tmpProjects[idx] = {
            project_id: projects.values[idx].project_id,
            uid: projects.values[idx].uid,
            title: projects.values[idx].title,
            description: projects.values[idx].description,
            organization: projects.values[idx].organization,
            from_when: projects.values[idx].from_when,
            to_when: newDate,
            link: projects.values[idx].link
        }
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const handleProjectLinkChange = (event, idx) => {
        let tmpProjects = [...projects.values];
        tmpProjects[idx] = {
            project_id: projects.values[idx].project_id,
            uid: projects.values[idx].uid,
            title: projects.values[idx].title,
            description: projects.values[idx].description,
            organization: projects.values[idx].organization,
            from_when: projects.values[idx].from_when,
            to_when: projects.values[idx].to_when,
            link: event.target.value
        }
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')
        && !(typeof(tmpProjects[idx].toUpdate) !== 'undefined')){
            tmpProjects[idx].toUpdate = true;
        }
        setProjects({values: tmpProjects});
        setEdited(true);
    }

    const addProject = () => {
        setProjects({
            values: [
                ...projects.values, 
                {
                    title: '',
                    description: '',
                    organization: '',
                    from_when: "infinity",
                    to_when: "infinity",
                    link: ''
                }
            ]
        });
    }

    const deleteProject = (idx) => {
        let tmpProjects = [...projects.values];
        if((typeof(tmpProjects[idx].project_id) !== 'undefined')){
            setProjectsToDelete(
                [
                    ...projectsToDelete, 
                    {project_id: tmpProjects[idx].project_id}
                ]);
        }
        tmpProjects.splice(idx, 1);
        setProjects({values: tmpProjects});
        setEdited(true);
    };
    // -----------------------------------------------------
    function handleOnDragEnd(result) {
        console.log(result)
      if (!result.destination) return;

      // Sorting in same list
      if(result.source.droppableId === result.destination.droppableId){
        if(result.source.droppableId === "projects"){
            const items = Array.from(projects.values);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
        
            setReordered(true);
            setEdited(true);
            setProjects({values: items});
        } else if(result.source.droppableId === "work-experience"){
            const items = Array.from(portfolio.values);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
        
            setReordered(true);
            setEdited(true);
            setPortfolio({values: items});
        } else if(result.source.droppableId === "education"){
            const items = Array.from(education.values);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
        
            setReordered(true);
            setEdited(true);
            setEducation({values: items});
        }

      } else{
          console.log("No sorting between lists!");
          return;
      }
    }

    
    // --------------- Begin Portfolio Event Handling ------------

    const handlePortfolioOccupationChange = (event, idx) => {
        let tmpPortfolio = [...portfolio.values];
        tmpPortfolio[idx] = {
            portfolio_id: portfolio.values[idx].portfolio_id,
            uid: portfolio.values[idx].uid,
            occupation: event.target.value,
            organization: portfolio.values[idx].organization,
            from_when: portfolio.values[idx].from_when,
            to_when: portfolio.values[idx].to_when,
            description: portfolio.values[idx].description
        }
        if((typeof(tmpPortfolio[idx].portfolio_id) !== 'undefined')
        && !(typeof(tmpPortfolio[idx].toUpdate) !== 'undefined')){
            tmpPortfolio[idx].toUpdate = true;
        }
        setPortfolio({values: tmpPortfolio});
        setEdited(true);
    }

    const handlePortfolioOrganizationChange = (event, idx) => {
        let tmpPortfolio = [...portfolio.values];
        tmpPortfolio[idx] = {
            portfolio_id: portfolio.values[idx].portfolio_id,
            uid: portfolio.values[idx].uid,
            occupation: portfolio.values[idx].occupation,
            organization: event.target.value,
            from_when: portfolio.values[idx].from_when,
            to_when: portfolio.values[idx].to_when,
            description: portfolio.values[idx].description
        }
        if((typeof(tmpPortfolio[idx].portfolio_id) !== 'undefined')
        && !(typeof(tmpPortfolio[idx].toUpdate) !== 'undefined')){
            tmpPortfolio[idx].toUpdate = true;
        }
        setPortfolio({values: tmpPortfolio});
        setEdited(true);
    }

    const handlePortfolioStartChange = (date, idx) => {
        let newDate;
        if(date !== null){
            const offset = date.getTimezoneOffset();
            if(offset < 0) date.setHours(12, 0, 0);
            //eslint-disable-next-line
            newDate = date.toISOString().replace(/-/g, '\/').replace(/T.+/, '');
        }
        let tmpPortfolio = [...portfolio.values];
        tmpPortfolio[idx] = {
            portfolio_id: portfolio.values[idx].portfolio_id,
            uid: portfolio.values[idx].uid,
            occupation: portfolio.values[idx].occupation,
            organization: portfolio.values[idx].organization,
            from_when: newDate,
            to_when: portfolio.values[idx].to_when,
            description: portfolio.values[idx].description
        }
        if((typeof(tmpPortfolio[idx].portfolio_id) !== 'undefined')
        && !(typeof(tmpPortfolio[idx].toUpdate) !== 'undefined')){
            tmpPortfolio[idx].toUpdate = true;
        }
        setPortfolio({values: tmpPortfolio});
        setEdited(true);
    }

    const handlePortfolioFinishChange = (date, idx) => {
        let newDate;
        if(date !== null){
            const offset = date.getTimezoneOffset();
            if(offset < 0) date.setHours(12, 0, 0);
            //eslint-disable-next-line
            newDate = date.toISOString().replace(/-/g, '\/').replace(/T.+/, '');
        }
        let tmpPortfolio = [...portfolio.values];
        tmpPortfolio[idx] = {
            portfolio_id: portfolio.values[idx].portfolio_id,
            uid: portfolio.values[idx].uid,
            occupation: portfolio.values[idx].occupation,
            organization: portfolio.values[idx].organization,
            from_when: portfolio.values[idx].from_when,
            to_when: newDate,
            description: portfolio.values[idx].description
        }
        if((typeof(tmpPortfolio[idx].portfolio_id) !== 'undefined')
        && !(typeof(tmpPortfolio[idx].toUpdate) !== 'undefined')){
            tmpPortfolio[idx].toUpdate = true;
        }
        setPortfolio({values: tmpPortfolio});
        setEdited(true);
    }

    const handlePortfolioDescriptionChange = (event, idx) => {
        let tmpPortfolio = [...portfolio.values];
        tmpPortfolio[idx] = {
            portfolio_id: portfolio.values[idx].portfolio_id,
            uid: portfolio.values[idx].uid,
            occupation: portfolio.values[idx].occupation,
            organization: portfolio.values[idx].organization,
            from_when: portfolio.values[idx].from_when,
            to_when: portfolio.values[idx].to_when,
            description: event.target.value
        }
        if((typeof(tmpPortfolio[idx].portfolio_id) !== 'undefined')
        && !(typeof(tmpPortfolio[idx].toUpdate) !== 'undefined')){
            tmpPortfolio[idx].toUpdate = true;
        }
        setPortfolio({values: tmpPortfolio});
        setEdited(true);
    }

    const addWorkExperience = () => {
        setPortfolio({
            values: [
                ...portfolio.values, 
                {
                    occupation: '',
                    organization: '',
                    from_when: "infinity",
                    to_when: "infinity",
                    description: ''
                }
            ]
        });
    }

    const deleteWorkExperience = (idx) => {
        let tmpPortfolio = [...portfolio.values];
        if((typeof(tmpPortfolio[idx].portfolio_id) !== 'undefined')){
            setWorkExperienceToDelete(
                [
                    ...workExperienceToDelete, 
                    {portfolio_id: tmpPortfolio[idx].portfolio_id}
                ]);
        }
        tmpPortfolio.splice(idx, 1);
        setPortfolio({values: tmpPortfolio});
        setEdited(true);
    }


    // --------------- Begin Education Event Handling ------------

    const handleEducationOrganizationChange = (event, idx) => {
        let tmpEducation = [...education.values];
        tmpEducation[idx] = {
            education_id: education.values[idx].education_id,
            uid: education.values[idx].uid,
            organization: event.target.value,
            education: education.values[idx].education,
            from_when: education.values[idx].from_when,
            to_when: education.values[idx].to_when,
            description: education.values[idx].description
        }
        if((typeof(tmpEducation[idx].education_id) !== 'undefined')
        && !(typeof(tmpEducation[idx].toUpdate) !== 'undefined')){
            tmpEducation[idx].toUpdate = true;
        }
        setEducation({values: tmpEducation});
        setEdited(true);
    }

    const handleEducationChange = (event, idx) => {
        let tmpEducation = [...education.values];
        tmpEducation[idx] = {
            education_id: education.values[idx].education_id,
            uid: education.values[idx].uid,
            organization: education.values[idx].organization,
            education: event.target.value,
            from_when: education.values[idx].from_when,
            to_when: education.values[idx].to_when,
            description: education.values[idx].description
        }
        if((typeof(tmpEducation[idx].education_id) !== 'undefined')
        && !(typeof(tmpEducation[idx].toUpdate) !== 'undefined')){
            tmpEducation[idx].toUpdate = true;
        }
        setEducation({values: tmpEducation});
        setEdited(true);
    }

    const handleEducationStartChange = (date, idx) => {
        let newDate;
        if(date !== null){
            const offset = date.getTimezoneOffset();
            if(offset < 0) date.setHours(12, 0, 0);
            //eslint-disable-next-line
            newDate = date.toISOString().replace(/-/g, '\/').replace(/T.+/, '');
        }
        let tmpEducation = [...education.values];
        tmpEducation[idx] = {
            education_id: education.values[idx].education_id,
            uid: education.values[idx].uid,
            organization: education.values[idx].organization,
            education: education.values[idx].education,
            from_when: newDate,
            to_when: education.values[idx].to_when,
            description: education.values[idx].description
        }
        if((typeof(tmpEducation[idx].education_id) !== 'undefined')
        && !(typeof(tmpEducation[idx].toUpdate) !== 'undefined')){
            tmpEducation[idx].toUpdate = true;
        }
        setEducation({values: tmpEducation});
        setEdited(true);
    }

    const handleEducationFinishChange = (date, idx) => {
        let newDate;
        if(date !== null){
            const offset = date.getTimezoneOffset();
            if(offset < 0) date.setHours(12, 0, 0);
            //eslint-disable-next-line
            newDate = date.toISOString().replace(/-/g, '\/').replace(/T.+/, '');
        }
        let tmpEducation = [...education.values];
        tmpEducation[idx] = {
            education_id: education.values[idx].education_id,
            uid: education.values[idx].uid,
            organization: education.values[idx].organization,
            education: education.values[idx].education,
            from_when: education.values[idx].from_when,
            to_when: newDate,
            description: education.values[idx].description
        }
        if((typeof(tmpEducation[idx].education_id) !== 'undefined')
        && !(typeof(tmpEducation[idx].toUpdate) !== 'undefined')){
            tmpEducation[idx].toUpdate = true;
        }
        setEducation({values: tmpEducation});
        setEdited(true);
    }

    const handleEducationDescriptionChange = (event, idx) => {
        let tmpEducation = [...education.values];
        tmpEducation[idx] = {
            education_id: education.values[idx].education_id,
            uid: education.values[idx].uid,
            organization: education.values[idx].organization,
            education: education.values[idx].education,
            from_when: education.values[idx].from_when,
            to_when: education.values[idx].to_when,
            description: event.target.value
        }
        if((typeof(tmpEducation[idx].education_id) !== 'undefined')
        && !(typeof(tmpEducation[idx].toUpdate) !== 'undefined')){
            tmpEducation[idx].toUpdate = true;
        }
        setEducation({values: tmpEducation});
        setEdited(true);
    }

    // Inserting null dates in psql is tricky -- instead use special value "infinity"
    const addEducation = () => {
        setEducation({
            values: [
                ...education.values, 
                {
                    organization: '',
                    education: '',
                    from_when: "infinity",
                    to_when: "infinity",
                    description: ''
                }
            ]
        });
    }

    const deleteEducation = (idx) => {
        let tmpEducation = [...education.values];
        if((typeof(tmpEducation[idx].education_id) !== 'undefined')){
            setEducationToDelete(
                [
                    ...educationToDelete, 
                    {education_id: tmpEducation[idx].education_id}
                ]);
        }
        tmpEducation.splice(idx, 1);
        setEducation({values: tmpEducation});
        setEdited(true);
    }


    // --------------- End Education Event Handling --------------

    const handleSave = () => {
        console.log("'Saving' Changes:");

        // ------------------- Begin Projects ----------------------------
        var projectsToCreate = [];
        var projectsToUpdate = [];

        // Determine what needs to be created vs. updated
        projects.values.forEach((row, idx) => {
            
            if(!(typeof(row.project_id) !== 'undefined')){
                if(row.title === ''){
                    console.log("A title is required in order to create!");
                } else {
                    projectsToCreate.push({
                        title: row.title,
                        description: JSON.stringify(row.description).replace(/['"]+/g, ''),
                        organization: row.organization,
                        from_when: row.from_when,
                        to_when: row.to_when,
                        link: row.link
                    });
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                projectsToUpdate.push({
                    project_id: row.project_id,
                    title: row.title,
                    description: JSON.stringify(row.description).replace(/['"]+/g, ''),
                    organization: row.organization,
                    from_when: row.from_when,
                    to_when: row.to_when,
                    link: row.link,
                    rowIdx: idx
                })
            }
        })

        console.log("Projects to Create:", projectsToCreate);
        console.log("Projects to Update:", projectsToUpdate);
        console.log("Projects to Delete:", projectsToDelete);

        if(projectsToCreate.length){
            const createProjects = async() => {
                var newProjects = [];
                var idx = 0;
                for await (let projectToCreate of projectsToCreate){
                    const data = await props.createProject(user.user_id, projectToCreate, idx);
                    newProjects.push(data);
                    idx++;
                }
                console.log("[About.jsx] Newly Created Projects: ", newProjects);
                props.setCreatedProjects(newProjects);
            }
            createProjects();
        }

        if(projectsToUpdate.length){
            projectsToUpdate.forEach((row, idx) => {
                console.log("Row To Update: ", row)
                props.updateProject(user.user_id, row, row.rowIdx);
            })
        }
        // ------------------- Begin Portfolio ----------------------------
        var workExperienceToCreate = [];
        var workExperienceToUpdate = [];

        // Determine what needs to be created vs. updated
        portfolio.values.forEach((row, idx) => {
            if(!(typeof(row.portfolio_id) !== 'undefined')){
                if(row.occupation === ''){
                    console.log("An occupation is required in order to create!");
                } else {
                    workExperienceToCreate.push({
                        occupation: row.occupation,
                        organization: row.organization,
                        from_when: row.from_when,
                        to_when: row.to_when,
                        description: JSON.stringify(row.description).replace(/['"]+/g, '')
                    });
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                workExperienceToUpdate.push({
                    portfolio_id: row.portfolio_id,
                    occupation: row.occupation,
                    organization: row.organization,
                    from_when: row.from_when,
                    to_when: row.to_when,
                    description: JSON.stringify(row.description).replace(/['"]+/g, ''),
                    rowIdx: idx
                })
            }
        })
        console.log("Work Experience to Create:", workExperienceToCreate);
        console.log("Work Experience to Update:", workExperienceToUpdate);
        console.log("Work Experience to Delete:", workExperienceToDelete);

        if(workExperienceToCreate.length){
            const createPortfolio = async() => {
                var newWorkExperiences = [];
                var idx = 0;
                for await (let workToCreate of workExperienceToCreate){
                    const data = await props.createWorkExperience(user.user_id, workToCreate, idx);
                    newWorkExperiences.push(data);
                    idx++;
                }
                console.log("[About.jsx] Newly Created Portfolio: ", newWorkExperiences);
                props.setCreatedWorkExperience(newWorkExperiences);
            }
            createPortfolio();
        }

        if(workExperienceToUpdate.length){
            workExperienceToUpdate.forEach((row, idx) => {
                props.updateWorkExperience(user.user_id, row, row.rowIdx);
            })
        }
        // ------------------- Begin Projects ----------------------------

        var educationToCreate = [];
        var educationToUpdate = [];

        // Determine what needs to be created vs. updated
        education.values.forEach((row, idx) => {
            if(!(typeof(row.education_id) !== 'undefined')){
                if(row.education === ''){
                    console.log("Education Field is required in order to create!");
                } else {
                    educationToCreate.push({
                        organization: row.organization,
                        education: row.education,
                        from_when: row.from_when,
                        to_when: row.to_when,
                        description: JSON.stringify(row.description).replace(/['"]+/g, '')
                    });
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                educationToUpdate.push({
                    education_id: row.education_id,
                    organization: row.organization,
                    education: row.education,
                    from_when: row.from_when,
                    to_when: row.to_when,
                    description: JSON.stringify(row.description).replace(/['"]+/g, ''),
                    rowIdx: idx
                })
            }
        })

        console.log("Education to Create:", educationToCreate);
        console.log("Education to Update:", educationToUpdate);
        console.log("Education to Delete:", educationToDelete);

        if(educationToCreate.length){
            const createEdu = async() => {
                var newEducation = [];
                var idx=0;
                for await (let eduToCreate of educationToCreate){
                    const data = await props.createEducation(user.user_id, eduToCreate, idx);
                    newEducation.push(data);
                    idx++;
                }
                console.log("[About.jsx] Newly Created Education: ", newEducation);
                props.setCreatedEducation(newEducation);
            }
            createEdu();
        }

        if(educationToUpdate.length){
            educationToUpdate.forEach((row, idx) => {
                props.updateEducation(user.user_id, row, row.rowIdx);
            });
        }

        // -------------- Handle Deletes ----------------------------
        // Possible DELETE ops should come last -- involves forced refresh

        if(projectsToDelete.length) {
            //console.log(`** DELETE Skills with ID: ${skillsToDelete}`);
            const deleteProjects = async() => {
                for await (let projectToDelete of projectsToDelete){
                    await props.deleteProject(projectToDelete.project_id);
                }
                props.reloadProfile();
            }
            deleteProjects();
        };

        if(workExperienceToDelete.length){
            const deleteWork = async() => {
                for await (let workToDelete of workExperienceToDelete){
                    await props.deleteWorkExperience(workToDelete.portfolio_id);
                }
                props.reloadProfile();
            }
            deleteWork();
        }

        if(educationToDelete.length){
            const deleteEdu = async() => {
                for await (let eduToDelete of educationToDelete){
                    await props.deleteEducation(eduToDelete.education_id);
                }
                props.reloadProfile();
            }
            deleteEdu();
        }
        //-------- Handle Reorder

        if(reordered){
            console.log("Reordered projects:");
            projects.values.forEach((row, rowIdx) => {
                console.log("Row:", row);
                console.log("New Position:", rowIdx);
                props.updateProject(user.user_id, row, rowIdx);
            })
            console.log("Reordered Work Experience:");
            portfolio.values.forEach((row, rowIdx) => {
                console.log("Row:", row);
                console.log("New Position:", rowIdx);
                props.updateWorkExperience(user.user_id, row, rowIdx);
            })
            education.values.forEach((row, rowIdx) => {
                console.log("Row:", row);
                console.log("New Position:", rowIdx);
                props.updateEducation(user.user_id, row, rowIdx);
            })
            props.reloadProfile();
        }

        setChangingOrder(false);
        setShow(false);
    }


    // Dynamically render list of forms
    const renderProjectsForm = () => {
        return projects.values.map((row, idx) => 
        <Form.Row className='draggable-container mb-4 ml-1' key={idx}>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Project
                </Form.Label>
                <Col>
                    <Form.Control type="text" value={row.title || ''} placeholder={"Project Title (Required)"} 
                        onChange={e => handleProjectTitleChange(e, idx)}
                    />
                </Col>
            </Form.Row>

            <Col className='mt-1'>
                <Button variant="outline-danger" size="sm"
                    onClick={() => deleteProject(idx)}
                >Delete Project</Button>
            </Col>   

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Description
                </Form.Label>
                <Col>
                    <Form.Control as="textarea" id="description" rows="3" 
                    value={row.description.replace(/\\n/g, '\n') || ''} 
                    placeholder={"Add a description for your project!"} 
                    onChange={e => handleProjectDescriptionChange(e, idx)}
                    />
                </Col>
            </Form.Row>
        
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Organization
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="project-organization" 
                    value={row.organization || ''} 
                    placeholder={"Add an organization (Optional)"} 
                    onChange={e => handleProjectOrganizationChange(e, idx)}></Form.Control>
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Start Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.from_when !== "infinity" && typeof(row.from_when) !== 'undefined') 
                    //eslint-disable-next-line
                    ? new Date(row.from_when.replace(/-/g, '\/').replace(/T.+/, ''))
                    : ''}
                    placeholder={"Add a start date for your project! (Optional)"} 
                    onChange={ date => {
                            handleProjectStartChange(date, idx);
                    }}></Form.Control>
                    
                </Col>
            </Form.Row>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Finish Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.to_when !== "infinity" && typeof(row.to_when) !== 'undefined') 
                    //eslint-disable-next-line
                    ? new Date(row.to_when.replace(/-/g, '\/').replace(/T.+/, ''))
                    : ''}  
                    placeholder={"Add a finish date for your project! (Optional)"} 
                    onChange={date => {
                        handleProjectFinishChange(date, idx);
                    }}></Form.Control>

                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Link
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="project-link" value={row.link || ''} placeholder={"Add an link for your project! (Optional)"} 
                        onChange={e => handleProjectLinkChange(e, idx)}
                    />
                </Col>
            </Form.Row>
        </Form.Row>
        )
    }

    const renderWorkExperienceForm = () => {

        return portfolio.values.map((row, idx) => 
        <Form.Row className='mb-4 ml-3' key={idx}>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Title
                </Form.Label>
                <Col>
                    <Form.Control type="text" value={row.occupation || ''} placeholder={"Occupation Title"} 
                        onChange={e => {handlePortfolioOccupationChange(e, idx)}}
                    />
                </Col>
            </Form.Row>

            <Col className='mt-1'><Button variant="outline-danger" size="sm"
                onClick={() => deleteWorkExperience(idx)}
            >Delete Work</Button></Col>   

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Organization
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="organization" value={row.organization || ''} placeholder={"Add an organization. (Optional)"} 
                        onChange={e => {handlePortfolioOrganizationChange(e, idx)}}>
                    </Form.Control>
                </Col>
            </Form.Row>
        
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Start Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.from_when !== "infinity" && typeof(row.from_when) !== 'undefined') 
                    //eslint-disable-next-line
                    ? new Date(row.from_when.replace(/-/g, '\/').replace(/T.+/, ''))
                    : ''}   
                    placeholder=
                    {"Add a start date (Optional)"} 
                    onChange={ date => {
                        handlePortfolioStartChange(date, idx);
                    }}></Form.Control>
                </Col>
            </Form.Row>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Finish Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.to_when !== "infinity" && typeof(row.to_when) !== 'undefined') 
                    //eslint-disable-next-line
                    ? new Date(row.to_when.replace(/-/g, '\/').replace(/T.+/, ''))
                    : ''}  
                    placeholder={"Add a finish date (Optional)"} 
                    onChange={date => {
                        handlePortfolioFinishChange(date, idx);
                    }}></Form.Control>
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Description
                </Form.Label>
                <Col>
                    <Form.Control as="textarea" rows="3" 
                    value={row.description.replace(/\\n/g, '\n') || ''} 
                    placeholder={"Add a description (Optional)"} 
                    onChange={e => handlePortfolioDescriptionChange(e, idx)}
                    />
                </Col>
            </Form.Row>
        </Form.Row>
        )
    }

    const renderEducationForm = () => {
        return education.values.map((row, idx) => 
        <Form.Row className='mb-4 ml-3' key={idx}>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Education
                </Form.Label>
                <Col>
                    <Form.Control type="text" value={row.education || ''} placeholder={"Education (Required)"} 
                        onChange={e => {handleEducationChange(e, idx)}}
                    />
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Organization
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="education-organization" value={row.organization || ''} placeholder={"Add an organization (Optional)"}
                        onChange={e => {handleEducationOrganizationChange(e, idx)}}
                    ></Form.Control>
                </Col>
            </Form.Row>


            <Col className='mt-1'>
                <Button variant="outline-danger" size="sm"
                    onClick={() => deleteEducation(idx)}
                >Delete Education</Button>
            </Col>   
        
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Start Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.from_when !== "infinity" && typeof(row.from_when) !== 'undefined') 
                    //eslint-disable-next-line
                    ? new Date(row.from_when.replace(/-/g, '\/'))
                    : ''}   
                    placeholder=
                    {"Add a start date (Optional)"} 
                    onChange={ date => {
                        handleEducationStartChange(date, idx)
                    }}></Form.Control>
                </Col>
            </Form.Row>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Finish Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.to_when !== "infinity" && typeof(row.to_when) !== 'undefined') 
                    //eslint-disable-next-line
                    ? new Date(row.to_when.replace(/-/g, '\/')) 
                    : ''}  
                    placeholder={"Add a finish date (Optional)"} 
                    onChange={date => {
                        handleEducationFinishChange(date, idx)
                    }}></Form.Control>
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Description
                </Form.Label>
                <Col>
                    <Form.Control as="textarea" rows="3" 
                    value={row.description.replace(/\\n/g, '\n') || ''} 
                    placeholder={"Add a description (Optional)"}
                    onChange={e => {handleEducationDescriptionChange(e, idx)}}
                    />
                </Col>
            </Form.Row>
        </Form.Row>
        )
    }

    const ChangeOrder = (props) => {
        console.log("ChangeOrder Component Recieved ID:", props.droppableId)
        return (
            <DragDropContext 
                onDragEnd={handleOnDragEnd}
            >
            {props.droppableId === "projects"
            ? <Droppable droppableId="projects">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {projects.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.title} index={idx}>
                                {(provided) => (
                                
                                    <div className='draggable-container mb-4 ml-3 mr-3' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                    {row.title
                                        ? row.title
                                        : null}
                                    <br></br>
                                    {row.description
                                        ? <NewlineText text={row.description} key={idx}/>
                                        : null} 
                                    <br></br>
                                    {row.organization
                                        ? row.organization
                                        : null} 
                                    <br></br>
                                    {(row.from_when && row.from_when !== "infinity")
                                        ? row.from_when
                                        : null} 
                                    <br></br>
                                    {(row.to_when && row.to_when !== "infinity")
                                        ? row.to_when
                                        : null}
                                    <br></br> 
                                    {row.link
                                        ? row.link
                                        : null} 

                                    </div>
                                )}
                            </Draggable>
                        );
                    })}
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
            : null}

            {props.droppableId === "work-experience"
            ? <Droppable droppableId="work-experience">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {portfolio.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.occupation} index={idx}>
                                {(provided) => (
                                
                                    <div className='draggable-container mb-4 ml-3 mr-3' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                    {row.occupation
                                        ? row.occupation
                                        : null}
                                    </div>
                                )}
                            </Draggable>
                        );
                    })}
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
            : null}

            {props.droppableId === "education"
            ? <Droppable droppableId="education">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {education.values.map((row, idx) => {
                        return (
                            <Draggable key={idx} draggableId={row.education} index={idx}>
                                {(provided) => (
                                
                                    <div className='draggable-container mb-4 ml-3 mr-3' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                    {row.education
                                        ? row.education
                                        : null}
                                        
                                    </div>
                                )}
                            </Draggable>
                        );
                    })}
                    {provided.placeholder}
                </div>
            )}
            </Droppable>
            : null}
            </DragDropContext>
        );
    }

    function NewlineText(props) {
        const text = props.text;
        if(text == null) return null;
        return text.split("\\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        );
    }

    return(
        <div className="tab-container">        

        <h3>{user.firstname} {user.lastname}</h3>
        <p>Portfolio</p>

        {props.data.ownedByUser ? <PencilFill size={25} onClick={handleShow}/> : null}

        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
            centered
            scrollable={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit
                    <AlertDismissible
                        setShow={setShow}
                        setEdited={setEdited}
                        setShowAlert={setShowAlert}
                        showAlert={showAlert}
                        handleSave={handleSave}
                        discardChanges={discardChanges}
                    />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Tab.Container id="left-tabs-example" defaultActiveKey="projects">
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey="projects" onClick={() => setChangingOrder(false)}>Projects</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="work-exerience" 
                            onClick={() => setChangingOrder(false)}>Work Experience</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="education" onClick={() => setChangingOrder(false)}>Education</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="projects">
                            <Form>
                                <h4>Projects</h4>
                                {projects.values.length < 4
                                ? <Button onClick={() => addProject()} variant="outline-success" size="sm">Add Project</Button>  
                                : null }<br></br>
                                                               
                                {projectsData.length > 1
                                ? <><label>Change Order</label>
                                    <Switch
                                        isOn={changingOrder}
                                        handleToggle={() => setChangingOrder(!changingOrder)}
                                    /></>
                                : null}

                                {changingOrder
                                ? <ChangeOrder droppableId="projects"></ChangeOrder>
                                : renderProjectsForm()}

                            </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey="work-exerience">
                            <Form>
                                <h4>Work Experience</h4>
                                {portfolio.values.length < 4
                                ? <Button onClick={() => addWorkExperience()} variant="outline-success" size="sm">Add Work Experience</Button>  
                                : null }<br></br>

                                {portfolioData.length > 1
                                ? <><label>Change Order</label>
                                    <Switch
                                        isOn={changingOrder}
                                        handleToggle={() => setChangingOrder(!changingOrder)}
                                    /></>
                                : null}

                                {changingOrder
                                ? <ChangeOrder droppableId="work-experience"></ChangeOrder>
                                : renderWorkExperienceForm()}
                            </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey="education">
                            <Form>
                                <h4>Education</h4>
                                {education.values.length < 4
                                ? <Button onClick={() => addEducation()} variant="outline-success" size="sm">Add Education</Button>  
                                : null }<br></br>

                                {educationData.length > 1
                                ? <><label>Change Order</label>
                                    <Switch
                                        isOn={changingOrder}
                                        handleToggle={() => setChangingOrder(!changingOrder)}
                                    /></>
                                : null} 
                                
                                {changingOrder
                                ? <ChangeOrder droppableId="education"></ChangeOrder>
                                : renderEducationForm()}


                            </Form>
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>

            </Tab.Container>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
        <br></br>

        <h3>Projects</h3>
        <div className="info-container">
            {projectsData
            ? projectsData.map((row, idx) => 
                <div className="draggable-container mb-4 ml-3 mr-3" key={idx}>
                    <h4><b>{row.title}</b></h4>
                    
                    {row.description 
                    ? <><NewlineText text={row.description} key={idx}/></>
                    : null}

                    <br></br>

                    {(row.organization && row.organization !== "null")
                    ? <p><b>Organization:</b> {row.organization}</p>
                    : null}

                    {(row.link && row.link !== "null")
                    ? <p><b>Link: </b>{row.link}</p>
                    : null}
                    
                    
                    {(row.from_when && row.from_when !== "infinity")
                    ? <p><b>From:</b> {row.from_when} </p>
                    : null
                    }
                    
                    {(row.to_when && row.to_when !== "infinity")
                    ? <p><b>To:</b> {(row.to_when)}</p>
                    : <p><b>To:</b> Current</p>}
                    <br></br>
                </div>
            )
            : null}
        </div>

        <h3>Work Experience:</h3>
        <div className="info-container">
        {portfolioData
        ? portfolioData.map((row, idx) => 
            <div className="draggable-container" key={idx}>
                <p><b>Occupation:</b> {row.occupation}</p>
                <p><b>Organization:</b> {row.organization}</p>
                
                {(row.from_when && row.from_when !== "infinity")
                ? <p><b>From:</b> {row.from_when} </p>
                : null
                }
                
                {(row.to_when && row.to_when !== "infinity")
                ? <p><b>To:</b> {row.to_when}</p>
                : <p><b>To:</b> Current</p>}

                {(row.description)
                ? <><b>Description: </b>
                    <><NewlineText text={row.description} key={idx}/></>
                </>
                : null}
                <br></br>
            </div>
        )
        : null } 
        </div>

        <h3>Education</h3>
        <div className="info-container">
            {educationData 
            ? educationData.map((row, idx) => 
                <div className="draggable-container" key={idx}>
                    <p><b>Education: </b>{row.education}</p>

                    {row.organization 
                    ? <><b>Organization:</b><p>{row.organization}</p></>
                    : null}

                    {(row.from_when && row.from_when !== "infinity")
                    ? <p><b>From:</b> {row.from_when} </p>
                    : null
                    }
                    
                    {(row.to_when && row.to_when !== "infinity")
                    ? <p><b>To:</b> {row.to_when}</p>
                    : <p><b>To:</b> Current</p>}

                    {row.description
                    ? <><NewlineText text={row.description} key={idx}/></>
                    : null}
                    <br></br>
                </div>
            )
            : null}
        </div>

        </div>
    );
}