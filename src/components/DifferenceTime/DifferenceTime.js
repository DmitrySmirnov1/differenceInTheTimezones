import React from 'react'

const DifferenceTime = ({ time, startCity, endCity }) => {

    const hours = Math.trunc(time)
    const minutes =  Math.abs(time % 1) > 0 ? '30' : '00'

    return (
        <div className="text difference">
            <span>{hours}:{minutes}</span>
        </div>
    )
}

export default DifferenceTime