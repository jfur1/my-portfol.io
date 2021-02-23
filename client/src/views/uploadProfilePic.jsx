import React from 'react';
import Avatar from 'react-avatar-edit';

function getBase64(file, cb) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
      cb(reader.result)
  };
  reader.onerror = function (error) {
      console.log('Error: ', error);
  };
}

class UploadProfilePicture extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
          preview: null,
          src: props.src
        }
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onFileLoad = this.onFileLoad.bind(this)
        console.log(props)
      }
      
      onClose() {
        this.setState({preview: null})
      }
      
      onCrop(preview) {
        this.setState({preview});
        this.props.stagePreview(preview);
      }

      onFileLoad(file){
        let fullImg = '';
        getBase64(file, (result) => {
          fullImg = result;
          this.props.stageImage(fullImg);
        })
      }
      
      render () {
        return (
          <div>
            <Avatar
              width={390}
              height={295}
              onCrop={this.onCrop}
              onClose={this.onClose}
              closeIconColor={"black"}
              onFileLoad={this.onFileLoad}
              src={this.state.src}
              
            />

            <br></br>
            <img src={this.state.preview} alt="Preview" />
            
          </div>
        )
      }
}

export default UploadProfilePicture;