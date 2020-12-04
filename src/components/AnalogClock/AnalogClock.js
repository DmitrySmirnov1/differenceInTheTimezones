import React, {useState, useEffect} from 'react'
import './AnalogClock.scss'

const AnalogClock = ({ hours, minutes, seconds }) => {

    const [ timeHours, setHours ] = useState(null)
    const [ timeMinutes, setMinutes ] = useState(null)
    const [ timeSeconds, setSeconds ] = useState(null)

    useEffect(() => {
        setHours(hours * 30)
        setMinutes(minutes * 6)
        setSeconds(seconds * 6)
    }, [hours, minutes, seconds])

    return (
        <div className="clock">
            <div className="hour">
                <div className="hr" id="hr" style={{transform: `rotateZ(${(timeHours) + (timeMinutes / 12)}deg)`}} ></div>
            </div>
            <div className="min">
                <div className="mn" id="mn" style={{transform: `rotateZ(${timeMinutes}deg)`}} ></div>
            </div>
            <div className="sec">
                <div className="sc" id="sc" style={{transform: `rotateZ(${timeSeconds}deg)`}} ></div>
            </div>
        </div>
    )
}

export default AnalogClock