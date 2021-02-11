import Alert from 'react-bootstrap/Alert';
import { Button } from 'react-bootstrap';

export const AlertDismissible = (props) => {
    return (
      <>
        <Alert bsPrefix="edit-alert" show={props.showAlert} variant="warning">
        <Alert.Heading style={{textAlign: 'center'}}>Attention!</Alert.Heading>
          <p style={{textAlign: 'center'}}>
            You have unsaved changes! Are you sure you want to exit?
          </p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button onClick={() => {
                props.setShow(false); 
                props.handleSave(); 
                props.setEdited(false); 
                props.setShowAlert(false);
            }} variant="outline-success">
                Save Changes
            </Button>
            <Button onClick={() => {
                props.setShow(false); 
                props.discardChanges();
                props.setEdited(false); 
                props.setShowAlert(false);
            }} variant="outline-danger">
                Exit
            </Button>
          </div>
        </Alert>
      </>
    );
}