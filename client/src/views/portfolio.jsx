import { useEffect, useState } from 'react';
import { PencilFill } from 'react-bootstrap-icons';
import { Button, Form, Col } from 'react-bootstrap';
import { PortfolioForm } from '../components/EditForms/PortfolioForm';
import DatePicker from 'react-datepicker'
import Fade from 'react-reveal/Fade';

export const Portfolio = props => {
    //console.log("Portfolio Recieved Props: ", props);
    // Data passed down from Profile through the parent state
    const user = props.location.state.user;
    const portfolioData = (props.data.portfolio !== null) ? props.data.portfolio: props.location.state.portfolio;
    const educationData = (props.data.education !== null) ? props.data.education : props.location.state.education;
    const projectsData = (props.data.projects !== null) ? props.data.projects : props.location.state.projects;

    // Display Toggles
    const [show, setShow] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false); 
    const [showDelete, setShowDelete] = useState(false);
    const [requestedDelete, setRequestedDelete] = useState('');
    const [requestedDeleteIdx, setRequestedDeleteIdx] = useState(null);

    const [reordered, setReordered] = useState(false);
    const [changingOrder, setChangingOrder] = useState(false);

    const [validated, setValidated] = useState(false);
    const [errs, setErrs] = useState({"project": {}, "portfolio": {}, "education": {}}); 

    const [duplicateProject, setDuplicateProject] = useState({});
    const [duplicateWork, setDuplicateWork] = useState({});
    const [duplicateEducation, setDuplicateEducation] = useState({});
    
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited) setShowAlert(true);
        else{
            setChangingOrder(false);
            setShow(false);
            setProjects({values: projectsData});
            setPortfolio({values: portfolioData});
            setEducation({values: educationData});
            setValidated(false);
            setErrs({"project": {}, "portfolio": {}, "education": {}});
            setDuplicateProject({});
            setDuplicateWork({});
            setDuplicateEducation({});
            setRequestedDelete('');
        }
    }

    // Replace state with original data
    const discardChanges = () => {
        setProjects({values: projectsData});
        setPortfolio({values: portfolioData});
        setEducation({values: educationData});
        setProjectsToDelete([]);
        setWorkExperienceToDelete([]);
        setEducationToDelete([]);
        setChangingOrder(false);
        setReordered(false);
        setValidated(false);
        setErrs({"project": {}, "portfolio": {}, "education": {}});
        setDuplicateProject({});
        setDuplicateWork({});
        setDuplicateEducation({});
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

        setValidated(false);
        setErrs({"project": {}, "portfolio": {}, "education": {}});

        setDuplicateProject({});
        setDuplicateWork({});
        setDuplicateEducation({});
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
        // Delete empty-error if user fills out field
        if((typeof(errs["project"]["Idx"+idx]) !== 'undefined') 
        && (tmpProjects[idx].title !== "")){
            delete errs["project"]["Idx"+idx];
        }
        // New event is a duplicate? Add idx as duplicate
        if(projects.values.some(e => e.title === event.target.value)){
            setDuplicateProject({...duplicateProject, ["Idx"+idx]: true});
        }
        // No longer a duplicate? Delete from duplicates
        else if(!(projects.values.some(e => e.title === event.target.value)) && typeof(duplicateProject["Idx"+idx]) !== 'undefined'){
            if(typeof(errs["project"]["Idx"+idx]) !== 'undefined'){
                delete errs["project"]["Idx"+idx];
            }
            console.log("Deleting dup project at idx:", idx)
            delete duplicateProject["Idx"+idx];
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
        let errors = {};
        let duplicates = {}
        if(typeof(tmpProjects[idx]) == 'undefined'){}
        else if((typeof(tmpProjects[idx].project_id) !== 'undefined')){
            setProjectsToDelete(
                [
                    ...projectsToDelete, 
                    {project_id: tmpProjects[idx].project_id}
                ]);
        }
        tmpProjects.splice(idx, 1);
        
        // Indexes are shifted upon a delete, so we need to recalculate blanks, and/or duplicates
        tmpProjects.forEach((row, newIdx) => {
            if((row.title === "")){
                errors["Idx"+newIdx] = true;
            } else{
                tmpProjects.forEach((tmpRow, tmpIdx) => {
                    if(tmpRow.title === row.title && tmpIdx !== newIdx){
                        duplicates["Idx"+tmpIdx] = true;
                        duplicates["Idx"+newIdx] = true;
                    }
                })
            }
        })

        setErrs({
            project: errors,
            portfolio: {...errs["portfolio"]},
            education: {...errs["education"]}
        })
        setDuplicateProject(duplicates)
        console.log("New dups after delete:", duplicates)
        console.log("errors['project'] after delete:", errors);
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
        // Delete empty-error if user fills out field
        if((typeof(errs["portfolio"]["Idx"+idx]) !== 'undefined') 
        && (tmpPortfolio[idx].occupation !== "")){
            delete errs["portfolio"]["Idx"+idx];
        }
        // New event is a duplicate? Add idx as duplicate
        if((portfolio.values.some(e => (e.occupation + e.organization) === (event.target.value + tmpPortfolio[idx].organization)))){
            setDuplicateWork({...duplicateWork, ["Idx"+idx] : true});
        }
         // No longer a duplicate? Delete from duplicates
        else if(!(portfolio.values.some(e => (e.occupation + e.organization) === event.target.value + tmpPortfolio[idx].organization)) && typeof(duplicateWork["Idx"+idx]) !== 'undefined'){
            delete duplicateWork["Idx"+idx];
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
        if((portfolio.values.some(e => (e.occupation + e.organization) === (tmpPortfolio[idx].occupation + event.target.value)))){
            setDuplicateWork({...duplicateWork, ["Idx"+idx] : true});
        }         
        else if(!(portfolio.values.some(e => (e.occupation + e.organization) === tmpPortfolio[idx].occupation + event.target.value)) && typeof(duplicateWork["Idx"+idx]) !== 'undefined'){
            delete duplicateWork["Idx"+idx];
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
        let errors = {};
        let duplicates = {};
        if(typeof(tmpPortfolio[idx]) == 'undefined'){}
        else if((typeof(tmpPortfolio[idx].portfolio_id) !== 'undefined')){
            setWorkExperienceToDelete(
                [
                    ...workExperienceToDelete, 
                    {portfolio_id: tmpPortfolio[idx].portfolio_id}
                ]);
        }
        tmpPortfolio.splice(idx, 1);

        // Indexes are shifted upon a delete, so we need to recalculate blanks, and/or duplicates
        tmpPortfolio.forEach((row, newIdx) => {
            if(row.occupation === ""){
                errors["Idx"+newIdx] = true;
            } else{
                tmpPortfolio.forEach((tmpRow, tmpIdx) => {
                    if((tmpRow.occupation + tmpRow.organization) === (row.occupation + row.organization) && tmpIdx !== newIdx){
                        duplicates["Idx"+tmpIdx] = true;
                        duplicates["Idx"+newIdx] = true;
                    }
                })
            }
        })

        setErrs({
            project: {...errs["project"]},
            portfolio: errors,
            education: {...errs["education"]}
        })
        setDuplicateWork(duplicates);
        console.log("New dups after delete:", duplicates)
        console.log("errors['portfolio'] after delete:", errors);
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
        // Delete empty-error if user fills out field
        if((typeof(errs["education"]["Idx"+idx]) !== 'undefined') 
        && (tmpEducation[idx].education !== "")){
            delete errs["education"]["Idx"+idx];
        }
        // New event is a duplicate? Add idx as duplicate
        if((education.values.some(e => e.education === event.target.value))){
            setDuplicateEducation({...duplicateEducation, ["Idx"+idx] : true});
        }
        // No longer a duplicate? Delete from duplicates
        else if(!(education.values.some(e => e.education === event.target.value)) && typeof(duplicateEducation["Idx"+idx]) !== 'undefined'){
            delete duplicateEducation["Idx"+idx];
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
        let duplicates = {};
        let errors = {};
        if(typeof(tmpEducation[idx]) == 'undefined'){
            
        }
        else if((typeof(tmpEducation[idx].education_id) !== 'undefined')){
            setEducationToDelete(
                [
                    ...educationToDelete, 
                    {education_id: tmpEducation[idx].education_id}
                ]);
        }
        tmpEducation.splice(idx, 1);

        tmpEducation.forEach((row, newIdx) => {
            if(row.education === ""){
                errors["Idx"+idx] = true;
            } else{
                tmpEducation.forEach((tmpRow, tmpIdx) => {
                    if(tmpRow.education === row.education && tmpIdx !== newIdx){
                        duplicates["Idx"+tmpIdx] = true;
                        duplicates["Idx"+newIdx] = true;
                    }
                })
            }
        })
        setErrs({
            project: {...errs["project"]},
            portfolio: {...errs["portfolio"]},
            education: errors
        })
        setDuplicateEducation(duplicates);
        console.log("New dups after delete:", duplicates)
        console.log("errors['project'] after delete:", errors);
        setEducation({values: tmpEducation});
        setEdited(true);
    }


    // --------------- End Education Event Handling --------------

    const validate = () => {
        let isValidated = true;
        setErrs({});
        let errors = {};
        errors["project"] = {};
        errors["portfolio"] = {};
        errors["education"] = {};
        projects.values.forEach((row, idx) => {
            if((row.title === "")){
                isValidated = false;
                setValidated(false);
                errors["project"]["Idx"+idx] = true;
            }
            if(typeof(duplicateProject["Idx"+idx]) !== 'undefined'){
                isValidated = false;
                setValidated(false);
            }
        })
        portfolio.values.forEach((row, idx) => {
            if((row.occupation === "")){
                isValidated = false;
                setValidated(false);
                errors["portfolio"]["Idx"+idx] = true;
            }
            if(typeof(duplicateWork["Idx"+idx]) !== 'undefined'){
                isValidated = false;
                setValidated(false);
            }
        })
        education.values.forEach((row, idx) => {
            if((row.education === "")){
                isValidated = false;
                setValidated(false);
                errors["education"]["Idx"+idx] = true;
            }
            if(typeof(duplicateEducation["Idx"+idx]) !== 'undefined'){
                isValidated = false;
                setValidated(false);
            }
        })

        console.log("errors['project'] in validate():", errors["project"]);
        console.log("duplicate projects in validate():", duplicateProject);
        setErrs(errors);
        return isValidated;
    }

    const handleSave = async(event) => {
        if(!validate()){
            event.preventDefault();
            event.stopPropagation();
        } else{

        var projectsToCreate = [];
        var projectsToUpdate = [];
        var workExperienceToCreate = [];
        var workExperienceToUpdate = [];
        var educationToCreate = [];
        var educationToUpdate = [];

        // Determine what needs to be created vs. updated
        projects.values.forEach((row, idx) => {
            
            if(!(typeof(row.project_id) !== 'undefined')){
                if(row.title === ''){
                    console.log("A title is required in order to create!");
                } else {
                    projectsToCreate.push({
                        title: row.title,
                        description: row.description,
                        organization: row.organization,
                        from_when: row.from_when,
                        to_when: row.to_when,
                        link: row.link,
                        rowIdx: idx
                    });
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                projectsToUpdate.push({
                    project_id: row.project_id,
                    title: row.title,
                    description: row.description,
                    organization: row.organization,
                    from_when: row.from_when,
                    to_when: row.to_when,
                    link: row.link,
                    rowIdx: idx
                })
            }
        })
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
                        description: row.description,
                        rowIdx: idx
                    });
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                workExperienceToUpdate.push({
                    portfolio_id: row.portfolio_id,
                    occupation: row.occupation,
                    organization: row.organization,
                    from_when: row.from_when,
                    to_when: row.to_when,
                    description: row.description,
                    rowIdx: idx
                })
            }
        })
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
                        description: row.description,
                        rowIdx: idx
                    });
                }
            } else if(typeof(row.toUpdate) !== 'undefined'){
                educationToUpdate.push({
                    education_id: row.education_id,
                    organization: row.organization,
                    education: row.education,
                    from_when: row.from_when,
                    to_when: row.to_when,
                    description: row.description,
                    rowIdx: idx
                })
            }
        })

        // console.log("Projects to Create:", projectsToCreate);
        // console.log("Projects to Update:", projectsToUpdate);
        // console.log("Projects to Delete:", projectsToDelete);
        // console.log("Work Experience to Create:", workExperienceToCreate);
        // console.log("Work Experience to Update:", workExperienceToUpdate);
        // console.log("Work Experience to Delete:", workExperienceToDelete);
        // console.log("Education to Create:", educationToCreate);
        // console.log("Education to Update:", educationToUpdate);
        // console.log("Education to Delete:", educationToDelete);

        // Begin POST Requests
        if(projectsToCreate.length){
            for await (const projectToCreate of projectsToCreate){
                await props.createProject(user.user_id, projectToCreate, projectToCreate.rowIdx);
            }
        }

        if(projectsToUpdate.length){
            for(const projectToUpdate of projectsToUpdate){
                await props.updateProject(user.user_id, projectToUpdate, projectToUpdate.rowIdx);
            }
        }

        if(workExperienceToCreate.length){
            for await (let workToCreate of workExperienceToCreate){
                await props.createWorkExperience(user.user_id, workToCreate, workToCreate.rowIdx);
            }
        }

        if(workExperienceToUpdate.length){
            for(const workToUpdate of workExperienceToUpdate){
                await props.updateWorkExperience(user.user_id, workToUpdate, workToUpdate.rowIdx);
            }
        }

        if(educationToCreate.length){
            for await (let eduToCreate of educationToCreate){
                await props.createEducation(user.user_id, eduToCreate, eduToCreate.rowIdx);
            }
        }

        if(educationToUpdate.length){
            for await (const eduToUpdate of educationToUpdate){
                await props.updateEducation(user.user_id, eduToUpdate, eduToUpdate.rowIdx);
            }
        }

        if(projectsToDelete.length){
            for await (let projectToDelete of projectsToDelete){
                await props.deleteProject(projectToDelete.project_id);
            }
        }

        if(workExperienceToDelete.length){
            for await (let workToDelete of workExperienceToDelete){
                await props.deleteWorkExperience(workToDelete.portfolio_id);
            }
        }

        if(educationToDelete.length){
            for await (let eduToDelete of educationToDelete){
                await props.deleteEducation(eduToDelete.education_id);
            }
        }

        if(reordered){
            console.log("Reordered projects:");
            projects.values.forEach(async (row, rowIdx) => {
                console.log("Row:", row);
                console.log("New Position:", rowIdx);
                await props.updateProject(user.user_id, row, rowIdx);
            })
            console.log("Reordered Work Experience:");
            portfolio.values.forEach(async (row, rowIdx) => {
                console.log("Row:", row);
                console.log("New Position:", rowIdx);
                await props.updateWorkExperience(user.user_id, row, rowIdx);
            })
            education.values.forEach(async (row, rowIdx) => {
                console.log("Row:", row);
                console.log("New Position:", rowIdx);
                await props.updateEducation(user.user_id, row, rowIdx);
            })
        }

        window.location.reload();
        }
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
                    <Form.Control 
                        required
                        style={{textAlign: "left"}}
                        isInvalid={(length(errs["project"]) > 0 && row.title==="") || (typeof(duplicateProject["Idx"+idx]) !== 'undefined' && row.title !== "")}
                        type="text" 
                        value={row.title || ''} 
                        placeholder={"Project Title (Required)"} 
                        onChange={e => handleProjectTitleChange(e, idx)}
                    />
                    <Form.Control.Feedback type="invalid">
                        {(length(errs["project"]) > 0) && row.title === ""
                            ? "Please provide a project title."
                            : null}
                        {(typeof(duplicateProject["Idx"+idx]) !== 'undefined' && row.title !== "")
                            ? "Duplicate project titles are not allowed."
                            : null
                        }
                    </Form.Control.Feedback>
                </Col>
            </Form.Row>

            <Col className='mt-1'>
                <Button variant="outline-danger" size="sm"
                    onClick={() => {
                        setShowDelete(true);
                        setRequestedDelete('project');
                        setRequestedDeleteIdx(idx);
                    }}
                >Delete Project</Button>
            </Col>   

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Description
                </Form.Label>
                <Col>
                    <Form.Control as="textarea" id="description" rows="3" 
                    defaultValue={row.description !== null 
                        ? row.description.replace(/\\n/g, '\n') 
                        : ''} 
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
                    <Form.Control type="text" id="project-organization" style={{textAlign: "left"}}
                    value={row.organization !== null ? row.organization : ''} 
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
                    selected={(row.from_when !== "infinity" && typeof(row.from_when) !== 'undefined' && row.from_when !== null) 
                    //eslint-disable-next-line
                    ? new Date(row.from_when.replace(/-/g, '\/').replace(/T.+/, ''))
                    : ''}
                    placeholder={"Add a start date for your project (Optional)"} 
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
                    selected={(row.to_when !== "infinity" && typeof(row.to_when) !== 'undefined' && row.to_when !== null) 
                    //eslint-disable-next-line
                    ? new Date(row.to_when.replace(/-/g, '\/').replace(/T.+/, ''))
                    : ''}  
                    placeholder={"Add a finish date for your project (Optional)"} 
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
                    <Form.Control type="text" id="project-link" style={{textAlign: "left"}} value={row.link !== null ? row.link : ''} placeholder={"Ex: http://www.example.com"} 
                        onChange={e => handleProjectLinkChange(e, idx)}
                    />
                </Col>
            </Form.Row>
        </Form.Row>
        )
    }

    const renderWorkExperienceForm = () => {

        return portfolio.values.map((row, idx) => 
        <Form.Row className='draggable-container mb-4 ml-3' key={idx}>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Title
                </Form.Label>
                <Col>
                    <Form.Control 
                        type="text" 
                        required
                        style={{textAlign: "left"}}
                        isInvalid={(length(errs["portfolio"]) > 0 && row.occupation === "") || (typeof(duplicateWork["Idx"+idx]) !== 'undefined' && row.occupation !== "")}
                        value={row.occupation !== null ? row.occupation : ''} 
                        placeholder={"Occupation Title"} 
                        onChange={e => {handlePortfolioOccupationChange(e, idx)}}
                    />
                    <Form.Control.Feedback type="invalid">
                    {(length(errs["portfolio"]) > 0 && row.occupation === "")
                        ? "Please provide an occupation."
                        : null} 
                    {(typeof(duplicateWork["Idx"+idx]) !== 'undefined' && row.occupation !== "")
                        ? "Duplicate (occupation titles, organization) not allowed."
                        : null}
                    </Form.Control.Feedback>
                </Col>
            </Form.Row>

            <Col className='mt-1'><Button variant="outline-danger" size="sm"
                onClick={() => {
                    setShowDelete(true);
                    setRequestedDelete('work experience');
                    setRequestedDeleteIdx(idx);
                }}
            >Delete Work</Button></Col>   

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Organization
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="organization" style={{textAlign: "left"}} value={row.organization !== null ? row.organization : ''} placeholder={"Add an organization (Optional)"} 
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
                    selected={(row.from_when !== "infinity" && typeof(row.from_when) !== 'undefined' && row.from_when !== null) 
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
                    selected={(row.to_when !== "infinity" && typeof(row.to_when) !== 'undefined' && row.to_when !== null) 
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
                    style={{textAlign: "left"}}
                    defaultValue={row.description !== null 
                        ? row.description.replace(/\\n/g, '\n') 
                        : ''}
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
        <Form.Row className='draggable-container mb-4 ml-3' key={idx}>
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Education
                </Form.Label>
                <Col>
                    <Form.Control 
                        type="text" 
                        required
                        style={{textAlign: "left"}}
                        isInvalid={(length(errs["education"]) > 0 && row.education === "") || (typeof(duplicateEducation["Idx"+idx]) !== 'undefined' && row.education !== "")}
                        value={row.education !== null ? row.education : ''} 
                        placeholder={"Education (Required)"} 
                        onChange={e => {handleEducationChange(e, idx)}}
                    />
                    <Form.Control.Feedback type="invalid">
                    {(length(errs["education"]) > 0 && row.education === "")
                        ? "Please provide education."
                        : null}
                    {(typeof(duplicateEducation["Idx"+idx]) !== 'undefined' && row.education !== "")
                        ? "Duplicate education is not allowed."
                        :null}
                    </Form.Control.Feedback>
                </Col>
            </Form.Row>

            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Organization
                </Form.Label>
                <Col>
                    <Form.Control type="text" id="education-organization" style={{textAlign: "left"}} value={row.organization !== null ? row.organization : ''} placeholder={"Add an organization (Optional)"}
                        onChange={e => {handleEducationOrganizationChange(e, idx)}}
                    ></Form.Control>
                </Col>
            </Form.Row>


            <Col className='mt-1'>
                <Button variant="outline-danger" size="sm"
                    onClick={() => {
                        setShowDelete(true);
                        setRequestedDelete('education');
                        setRequestedDeleteIdx(idx);
                    }}
                >Delete Education</Button>
            </Col>   
        
            <Form.Row className='mt-1' style={{width: "75%"}}>
                <Form.Label column sm={3}>
                    Start Date
                </Form.Label>
                <Col>
                    <Form.Control as={ DatePicker } 
                    selected={(row.from_when !== "infinity" && typeof(row.from_when) !== 'undefined' && row.from_when !== null) 
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
                    selected={(row.to_when !== "infinity" && typeof(row.to_when) !== 'undefined' && row.to_when !== null) 
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
                    style={{textAlign: "left"}}
                    defaultValue={row.description !== null
                        ? row.description.replace(/\\n/g, '\n')  
                        : ''}
                    placeholder={"Add a description (Optional)"}
                    onChange={e => {handleEducationDescriptionChange(e, idx)}}
                    />
                </Col>
            </Form.Row>
        </Form.Row>
        )
    }

    

    const FormatDate = (props) => {
        let date = props.dateString;
        const months = {"01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June", 
                        "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"};
        const year = date.substring(0, 4);
        const monthDecimal = date.substring(5, 7);
        const month = months[monthDecimal];
        const formattedDate = month + ' ' + year;
        return ' ' + formattedDate + ' ';
    }

    function length(obj) {
        if((!(typeof(obj) !== 'undefined')) || (obj == null)) return 0;
        return Object.keys(obj).length;
    }

    function FormatTextarea(props) {
        let text = props.text;
        if(text == null) return null;
        return text.split("\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        )
    }


    return(
        <div className="tab-container">        
        {props.data.ownedByUser ? <Button variant="warning" className="edit-button" onClick={handleShow}>Edit&nbsp;<PencilFill size={25}/></Button> : null}
        <h3>Portfolio</h3>
    
        <PortfolioForm
            show={show}
            setShow={setShow}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            showDelete={showDelete}
            setShowDelete={setShowDelete}
            errs={errs}
            edited={edited}
            duplicateProject={duplicateProject}
            duplicateEducation={duplicateEducation}
            duplicateWork={duplicateWork}
            renderProjectsForm={renderProjectsForm}
            renderEducationForm={renderEducationForm}
            renderWorkExperienceForm={renderWorkExperienceForm}
            addEducation={addEducation}
            addProject={addProject}
            addWorkExperience={addWorkExperience}
            deleteWorkExperience={deleteWorkExperience}
            deleteEducation={deleteEducation}
            deleteProject={deleteProject}
            requestedDelete={requestedDelete}
            setRequestedDelete={setRequestedDelete}
            requestedDeleteIdx={requestedDeleteIdx}
            setRequestedDeleteIdx={setRequestedDeleteIdx}
            validated={validated}
            validate={validate}
            setEdited={setEdited}
            projects={projects}
            projectsData={projectsData}
            portfolio={portfolio}
            portfolioData={portfolioData}
            education={education}
            educationData={educationData}
            changingOrder={changingOrder}
            setChangingOrder={setChangingOrder}
            discardChanges={discardChanges}
            handleSave={handleSave}
            handleClose={handleClose}
            handleOnDragEnd={handleOnDragEnd}
        />
        <br></br>
        
        <Fade left>
        <h3 className="h3-style">Projects</h3>
        </Fade>
        <hr color="black"/>
        <Fade left>
        <div className="info-container">
            {projectsData
            ? projectsData.map((row, idx) => 
                <div className="mb-2 ml-3 mr-3" key={idx}>
                    
                    <div className='row mb-1'>
                        <h5 className='d-flex flex-column h5-style h5-style'><b>{row.title}</b></h5>
                    
                        {(row.organization && row.organization !== "null")
                        ? <h5 className="d-flex flex-column h5-style h5-style ml-1">{'| ' + row.organization}</h5>
                        : null}
                    </div>

                    <div className="mb-3">
                        {(row.from_when && row.from_when !== "infinity")
                        ? <FormatDate dateString={row.from_when}/>
                        : null
                        }
                        
                        {(row.from_when && row.from_when !== "infinity") && (row.to_when && row.to_when !== "infinity") 
                        ? ' - '
                        : null}

                        {(row.to_when && row.to_when !== "infinity")
                        ?  <FormatDate dateString={row.to_when}/>
                        : null}
                    </div>

                    {row.description 
                    ? <><FormatTextarea text={row.description}/></>
                    : null}

                    {(row.link && row.link !== "null")
                    ? <div className='my-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-1 bi bi-link-45deg" viewBox="0 0 16 16">
                            <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
                        </svg>
                        <a href={row.link} target="_blank" rel="noreferrer">{row.link}</a>
                    </div>
                    : null}
                    
                    <hr/>
                </div>
            )
            : null}
        </div>
        </Fade>

        <Fade left>
        <h3 className="h3-style">Work Experience</h3>
        </Fade>
        <hr color="black"/>
        <Fade left>
        <div className="info-container">
        {portfolioData
        ? portfolioData.map((row, idx) => 
            <div className="mb-3 ml-3 mr-3" key={idx}>
                
                <div className='row'>
                    <h5 className='d-flex flex-column h5-style h5-style'><b>{row.occupation}</b></h5>
                    <h5 className='d-flex flex-column h5-style h5-style ml-1'>
                        <p className='mb-2'>{!row.organization ? '' :  ' | ' + row.organization}</p></h5>
                </div>

                <div className="mb-3">
                    {(row.from_when && row.from_when !== "infinity")
                    ? <FormatDate dateString={row.from_when}/>
                    : null}
                    
                    {(row.from_when && row.from_when !== "infinity") && (row.to_when && row.to_when !== "infinity")
                    ? ' - '
                    : null}

                    {(row.to_when && row.to_when !== "infinity")
                    ? <FormatDate dateString={row.to_when}/>
                    : null}
                </div>

                {(row.description)
                ? <FormatTextarea text={row.description}/>
                : null}

                <hr/>
            </div>
        )
        : null } 
        </div>
        </Fade>

        <Fade left>
        <h3 className="h3-style">Education</h3>
        </Fade>
        <hr color="black"/>
        <Fade left>
        <div className="info-container">
            {educationData 
            ? educationData.map((row, idx) => 
                <div className="ml-3 mr-3" key={idx}>
                    
                    <div className='row'>
                        <h5 className='d-flex flex-column h5-style'>
                            <b>{row.education}</b></h5>

                        {row.organization 
                        ? <h5 className="d-flex flex-column h5-style ml-1">
                            <p className='mb-2'>{'| ' + row.organization}</p></h5>
                        : null}
                    </div>
                    
                    <div className="mb-3">
                        {(row.from_when && row.from_when !== "infinity")
                        ? <FormatDate dateString={row.from_when}/>
                        : null}
                        
                        {(row.from_when && row.from_when !== "infinity") && (row.to_when && row.to_when !== "infinity")
                        ? ' - '
                        : null}
                        
                        {(row.to_when && row.to_when !== "infinity")
                        ? <FormatDate dateString={row.to_when}/>
                        : null}
                    </div>

                    {row.description
                    ? <FormatTextarea text={row.description}/>
                    : null}
                    <hr/>
                </div>
            )
            : null}
        </div>
        </Fade>
        </div>
    );
}