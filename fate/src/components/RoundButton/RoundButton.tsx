import React from 'react';
import PropTypes from 'prop-types';
import styles from './RoundButton.module.css';


RoundButton.propTypes = {
    buttonImg: PropTypes.string,
    clickFunc: PropTypes.func
};

function RoundButton(props:any) {
    return (
        <div>
            <button style={styles} onClick={props.clickFunc}>
                <img src={props.buttonImg} alt="adventurer circle"/>
            </button>
        </div>
    );
}

export default RoundButton;
