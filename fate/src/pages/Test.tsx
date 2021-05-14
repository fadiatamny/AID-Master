import React from 'react'
import RoundButton from '../components/RoundButton/RoundButton'
import newGame from '../images/CircleNew.png'
import uploadGame from '../images/CircleUpload.png'
import { clickNew, clickUpload } from '../services/buttons/ButtonFunctions'

Test.propTypes = {}

function Test() {
    return (
        <div>
            <p>testing</p>
            <RoundButton buttonImg={newGame} clickFunc={clickNew} />
            <RoundButton buttonImg={uploadGame} clickFunc={clickUpload} />
        </div>
    )
}

export default Test
