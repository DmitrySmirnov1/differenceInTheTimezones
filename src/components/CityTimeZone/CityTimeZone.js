import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const CityTimeZone = ({ data = {}, upClick, downClick, time, isError }) => {

    return (
        data &&
        <div className="city-time-zone">
            <div className="date-time" >
                <span className="text" >{data.day}.{data.month}.{data.year}</span>
                <div className="sort-hours">
                    <FontAwesomeIcon icon={faCaretUp} onClick={() => upClick()} />
                    <input className={isError ? 'error' : ''} type="text" value={`${data.hours}`} onChange={e => time(e.target.value)} />
                    <FontAwesomeIcon icon={faCaretDown} onClick={() => downClick()} />
                </div>
            </div>
            <div className="day-utc" >
                <span className="text" >{data.dayOfWeek}</span>
                <span className="text" >{data.city ? `UTC ${data.utc}` : data.utc}</span>
            </div>
        </div>
    )
}

export default CityTimeZone