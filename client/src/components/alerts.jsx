import Alert from '@material-ui/lab/Alert';

/* Valid "severity" types: {error, warning, info, success} */

export const AlertMsg = (type, msg) => {
    let severity;
    
    if (type === "error" || type === "warning" || type === "success" || type === "info"){
        severity = type;
    } else{
        return null;
    }

    return (
        <Alert severity={severity}> {msg} </Alert>
    );
}