import { Modal, Button } from 'react-bootstrap';

export const AreYouSure = (props) => {
    console.log("AreYouSure recieved props:", props)
    return(
        <Modal
            show={props.showDelete}
            onHide={() => props.setShowDelete(false)}
            backdrop="static"
            keyboard={false}
            size="sm"
            centered
            scrollable={false}
            >
            <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to remove this {props.requestedDelete}?</p>
                </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" 
                    onClick={() => {
                        props.setRequestedDelete('');   
                        props.setRequestedDeleteIdx(null);
                        props.setShowDelete(false);
                    }}>Cancel</Button>
                <Button variant="danger" 
                    onClick={() => {
                        if(props.requestedDelete === 'project')
                            props.deleteProject(props.idx);
                        else if(props.requestedDelete === 'work experience')
                            props.deleteWork(props.idx)
                        else if(props.requestedDelete === 'education')
                            props.deleteEdu(props.idx)
                        props.setEdited(true);
                        props.setShowDelete(false);
                        props.setRequestedDelete('');   
                        props.setRequestedDeleteIdx(null);                 
                    }}>
                OK</Button>
            </Modal.Footer>
        </Modal>
    )
}