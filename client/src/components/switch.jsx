import React from 'react';

const Switch = ({ isOn, handleToggle, type }) => {
  if(type === "register"){
    return(
        <>
          <input
            checked={isOn}
            onChange={handleToggle}
            className="register-switch-checkbox"
            id={`register-switch-new`}
            type="checkbox"
          />
            <label
            style={{ background: isOn && '#06D6A0' }}
            className="register-switch-label"
            htmlFor={`register-switch-new`}
            >
            <span className={`register-switch-button`} />
          </label>
        </>
    );
  } else{
    return (
      <>
        <input
          checked={isOn}
          onChange={handleToggle}
          className="react-switch-checkbox"
          id={`react-switch-new`}
          type="checkbox"
        />
          <label
          style={{ background: isOn && '#06D6A0' }}
          className="react-switch-label"
          htmlFor={`react-switch-new`}
          >
          <span className={`react-switch-button`} />
        </label>
      </>
    );
  }
  
};

export default Switch;