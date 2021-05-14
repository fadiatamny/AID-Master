import React, { MouseEventHandler } from 'react'
import PropTypes from 'prop-types'
import styles from './RoundButton.module.css'

interface RoundButtonProps {
    buttonImg: string
    clickFunc: (e: MouseEvent) => void
}

const RoundButton = ({ buttonImg, clickFunc }: RoundButtonProps) => {
    return (
        <div>
            <button style={styles} onClick={clickFunc}>
                <img src={buttonImg} alt="adventurer circle" />
            </button>
        </div>
    )
}

export default RoundButton
