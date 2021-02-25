import React from 'react';
import Avatar from '../components/testAvatar';

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
          src: props.src,
          img: props.img,
          initXcoord: props.x,
          initYcoord: props.y,
          initRadius: props.r,
          new: false,
          currentPrefix: null,
        }
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onFileLoad = this.onFileLoad.bind(this)
        this.getCropCoords = this.getCropCoords.bind(this)
        //console.log(props)
      }
      
      onClose() {
        this.setState({preview: null});
        console.log("Closed");
      }
      
      onCrop(preview) {
        this.setState({preview});
        //console.log("Recieved Preview:", preview)
        this.props.stagePreview(preview);
      }

      onFileLoad(file){
        let fullImg = '';
        this.setState({new: true})
        getBase64(file, (result) => {
          fullImg = result;
          this.props.stageImage(fullImg);
          //console.log("Image orientation:", file)
        })
      }

      getCropCoords(x, y, r){
        // console.log("Middle Component Recieved Crop Coordinates:");
        // console.log("(x: " + x ,", y: " + y + ", Radius: ", + r + ")");
        this.props.stageCoords(x, y, r);
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
              new={this.state.new}
              cropX={this.state.initXcoord}
              cropY={this.state.initYcoord}
              cropRadius={this.state.initRadius}
              getCropCoords={this.getCropCoords}
              minCropRadius={60}
            />
            <br></br>
            <img src={this.state.preview} alt="Preview" />
            
          </div>
        )
      }
}

export default UploadProfilePicture;