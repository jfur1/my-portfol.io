// Home Tab on a User's Profile
import { useState } from 'react';
import { Button} from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { HomeForm } from '../components/EditForms/HomeForm';
import Fade from 'react-reveal/Fade';

export const Home = (props) => {
    const user = props.data.user;
    const profile = (props.data.profile !== null) ? props.data.profile : props.location.state.profile;
    const images = (props.data.images !== null) ? props.data.images : props.location.state.images;
    const info = (props.data.about !== null) ? props.data.about : null;

    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [edited, setEdited] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [fullname, setFullname] = useState(user.fullname);
    const [publicEmail, setPublicEmail] = useState(typeof(profile[0]) !== 'undefined' ? profile[0].public_email : '');
    const [phone, setPhone] = useState(typeof(profile[0]) !== 'undefined' ? profile[0].phone : '');
    const [location, setLocation] = useState((info !== null && info.location !== null) ? info.location : null);
    const [currentOccupation, setCurrentOccupation]
    = useState(
        typeof(profile[0]) !== 'undefined' 
            ? profile[0].current_occupation 
            : null
    );
    const [currentOrganization, setCurrentOrganization] 
    = useState(
        typeof(profile[0]) !== 'undefined' 
            ? profile[0].current_organization 
            : null
    );
    const [font, setFont] = useState(typeof(profile[0]) !== 'undefined' ? profile[0].font : null);
    const [size, setSize] = useState(typeof(profile[0]) !== 'undefined' && profile[0].font_size ? profile[0].font_size : "100%");
    const [showEditPic, setShowEditPic] = useState(false);

    const [profilePic, setProfilePic] 
    = useState(
        typeof(images[0]) !== 'undefined' && typeof(images[0].base64image) !== 'undefined'
            ? binaryToBase64(images[0].base64image.data) 
            : ""
    );
    
    const [profileAvatar, setProfileAvatar] 
    = useState(
        typeof(images[0]) !== 'undefined' && typeof(images[0].base64preview) !== 'undefined'
            ? binaryToBase64(images[0].base64preview.data) 
            : ""
    );
    
    const [prefix, setPrefix] 
    = useState(
        typeof(images[0]) !== 'undefined' && typeof(images[0].prefix) !== 'undefined'
            ? images[0].prefix 
            : ""
    );

    // Modal Alert
    const handleShow = () => setShow(true);
    const handleClose = () => {
        if(edited){
            setShowAlert(true);
        } else{
            setShow(false);
            setShowEditPic(false);
        }
    }
    const discardChanges = () => {
        setFullname(user.fullname);
        setCurrentOccupation(typeof(profile[0]) !== 'undefined' ? profile[0].current_occupation : null);
        setCurrentOrganization(typeof(profile[0]) !== 'undefined' ? profile[0].current_organization : null);
        setFont(typeof(profile[0]) !== 'undefined' ? profile[0].font : null);
        setSize(typeof(profile[0]) !== 'undefined' && profile[0].font_size ? profile[0].font_size : "100%");
        setShowEditPic(false);
    }

    const stageImage = (fullImage) => {
        setProfilePic(fullImage.substring(fullImage.indexOf(',')+1));
        setPrefix(fullImage.substring(0, fullImage.indexOf(',')+1));
    }
    const stagePreview = (preview) => {
        setProfileAvatar(preview.substring(preview.indexOf(',')+1));
    }

    const handleSave = async() => {
        let locationToCreate = [];
        let locationToUpdate = [];

        // Conditionally Call Functions
        if(fullname !== user.fullname) 
            await props.updateFullname(user.user_id, fullname);

        if((!info && location) || (info !== null && info.location !== location)){
            locationToUpdate.push(location);
        }

        if(locationToCreate.length) 
            await props.createLocation(user.user_id, locationToCreate[0]);

        if(locationToUpdate.length) 
            await props.updateLocation(locationToUpdate[0], user.user_id);

        if((!typeof(profile.current_occupation) !== 'undefined') && currentOccupation)
            await props.createCurrentOccupation(user.user_id, currentOccupation);
        else if(typeof(profile[0]) !== 'undefined' && currentOccupation !== profile[0].current_occupation)
            await props.updateCurrentOccupation(user.user_id, currentOccupation);

        if((!typeof(profile.current_organization) !== 'undefined') && currentOrganization)
            await props.createCurrentOrganization(user.user_id, currentOrganization);
        else if(typeof(profile[0]) !== 'undefined' && currentOrganization !== profile[0].current_organization)
            await props.updateCurrentOrganization(user.user_id, currentOrganization);

        if((typeof(profile[0]) == 'undefined' && phone) || (typeof(profile[0]) !== 'undefined' && phone !== profile[0].phone)) await props.updatePhone(user.user_id, phone);

        if((typeof(profile[0]) == 'undefined' && publicEmail) || (typeof(profile[0]) !== 'undefined' && publicEmail !== profile[0].public_email)) 
            await props.updateEmail(user.user_id, publicEmail);

        if(typeof(profile[0]) !== 'undefined' && font !== profile[0].font)
            await props.updateFont(user.user_id, font);
        
        if(typeof(profile[0]) !== 'undefined' && size !== profile[0].font_size)
            await props.updateSize(user.user_id, size);
            
        // Create Profile Picture
        if(typeof(images[0]) == 'undefined' && (profileAvatar || profilePic)){
            await props.createProfileImages(user.user_id, profilePic, profileAvatar, prefix)
        }
        else if(typeof(images[0]) !== 'undefined' && typeof(images[0].base64image) !== 'undefined'  && (profilePic !== images[0].base64image || profileAvatar !== images[0].base64preview)){
            await props.updateProfileImages(user.user_id, profilePic, profileAvatar, prefix)
        }

        window.location.reload();
    }

    function binaryToBase64(data){
        var image = btoa(new Uint8Array(data).reduce(function (tmp, byte) {
            return tmp + String.fromCharCode(byte);
        }, ''));
        return image;
    }

    function FormatTextarea(props) {
        let text = props.text;
        if(text == null) return null;
        return text.split("\\n").map((str, idx) => 
            <div key={idx}>{str.length === 0 ? <br/> : str}</div>
        )
    }

    return(
        <div className="tab-container"> 
        {props.data.ownedByUser 
        ? <Button variant="warning" className="edit-button" onClick={handleShow}>Edit&nbsp;<PencilFill size={25}/></Button>
        : null}
        
        <HomeForm
            info={info}
            user={user}
            profile={profile}
            images={images}
            show={show}
            setShowEditPic={setShowEditPic}
            stagePreview={stagePreview}
            stageImage={stageImage}
            setPublicEmail={setPublicEmail}
            setPhone={setPhone}
            setLocation={setLocation}
            setShow={setShow}
            font={font}
            setFont={setFont}
            prefix={prefix}
            profileAvatar={profileAvatar}
            size={size}
            setSize={setSize}
            showEditPic={showEditPic}
            showDelete={showDelete}
            setShowDelete={setShowDelete}
            setEdited={setEdited}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            fullname={fullname}
            setFullname={setFullname}
            currentOccupation={currentOccupation}
            setCurrentOccupation={setCurrentOccupation}
            currentOrganization={currentOrganization}
            setCurrentOrganization={setCurrentOrganization}
            discardChanges={discardChanges}
            handleSave={handleSave}
            handleClose={handleClose}
        ></HomeForm>

            {(user !== null && typeof user !== 'undefined')
            ? 
            <Fade bottom>
            <div className='home-container'>
                <div className="mt-3 ml-2 mr-4">
                {typeof(images[0]) !== 'undefined' && images[0].base64preview.data.length > 0
                 ? <img src={prefix + `${binaryToBase64(images[0].base64preview.data)}`}  alt="Preview"/>
                 : null}
                </div> 


                <div className="mt-4 ml-4" style={{width: '100%'}}>
                    <h3><b>{user.fullname}</b></h3>
                    
                    <p>
                        {typeof(profile[0]) !== 'undefined' && profile[0].current_occupation
                        ? <b>{profile[0].current_occupation}</b>
                        : null}
                        {typeof(profile[0]) !== 'undefined' && profile[0].current_organization
                            ? <> at {profile[0].current_organization}</>
                            : null}
                    </p>

                    {info !== null && info.location !== null && location !== ''
                    ? <div className="row ml-1 d-flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="align-self-center mr-2 bi bi-geo-alt-fill" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                        </svg>
                        <FormatTextarea text={info.location === "" ? '' : info.location}/>
                        </div>
                    : null}
                    
                    {info !== null && info.public_email !== null && publicEmail !== ''
                    ?<div className="row ml-1 mt-3 d-flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="align-self-center mr-2 bi bi-envelope-fill" viewBox="0 0 16 16">
                            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/>
                        </svg>
                        {info.public_email}
                        </div>
                    : null}
                    

                    {info !== null && info.phone !== null && phone !== ''
                    ? <div className="row ml-1 mt-3 d-flex flex-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="align-self-center mr-2 bi bi-telephone-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                        </svg>
                        {info.phone}
                    </div>
                    : null}
                
                </div>

                <br></br>
            </div> 
            </Fade>
            : null}

        </div>
    )
}