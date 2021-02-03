class EditProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: (typeof this.props.location.state !== "undefined" && typeof this.props.location.state["user"] !== 'undefined') ? this.props.location.state["user"] : null,
        }
    }

    render(){
        return(
            <p>Edit Profile</p>

        );
    }
}

export default EditProfile;