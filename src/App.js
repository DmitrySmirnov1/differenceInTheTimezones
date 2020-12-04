import React, { useState, useEffect } from 'react'
import CityTimeZone from './components/CityTimeZone/CityTimeZone'
import AnalogClock from './components/AnalogClock/AnalogClock'
import * as moment from 'moment-timezone';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import './App.scss';

function App() {
  const [startCity, setStartCity] = useState({ country: 'Europe', city: 'Moscow', name: 'Moscow' })
  const [endCity, setEndCity] = useState({ country: 'America', city: 'New_York', name: 'New-York' })
  const [cities] = useState(moment.tz.names())
  const [citiesOfWorld, setCitiesOfWorld] = useState([])
  const [dataStartCity, setDataStartCity] = useState(null)
  const [dataEndCity, setDataEndCity] = useState(null)
  const [differenceInTime, setdifferenceInTime] = useState(null)
  const [choice, setChoice] = useState('city')
  const [week] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
  const [isErrorStart, setIsErrorStart] = useState(false)
  const [isErrorEnd, setIsErrorEnd] = useState(false)

  useEffect(() => {
    switch (choice) {
      case 'city': {
        cities.forEach((value) => {
          if (value.includes('/') && value.split('/')[0] !== 'Etc') {
            value.split('/')[2]
              ? setCitiesOfWorld(oldArray => [...oldArray, {
                country: `${value.split('/')[0]}/${value.split('/')[1]}`,
                city: value.split('/')[2],
                name: value.split('/')[2].replace(/_/g, '-')
              }])
              : setCitiesOfWorld(oldArray => [...oldArray, {
                country: value.split('/')[0],
                city: value.split('/')[1],
                name: value.split('/')[1].replace(/_/g, '-')
              }])
          }
        })
        break;
      }
      case 'zone': {
        cities.forEach((value) => {
          if (value.includes('/') && value.includes('GMT') && !value.includes('0')) {
            setCitiesOfWorld(oldArray => [...oldArray, {
              country: value.split('/')[0],
              city: value.split('/')[1],
              name: `GMT ${value.split('T')[1]}`
            }])
          }
        })
        break;
      }
      default: {
        console.log('error')
      }
    }

  }, [cities, choice])

  useEffect(() => {
    const now = moment.utc();
    if (startCity && endCity) {
      const start = moment.tz.zone(`${startCity.country}/${startCity.city}`).utcOffset(now);
      const end = moment.tz.zone(`${endCity.country}/${endCity.city}`).utcOffset(now);

      setdifferenceInTime((start - end) / 60)
    }
  }, [dataStartCity, dataEndCity, startCity, endCity])


  useEffect(() => {
    if (startCity) {
      const date = moment.utc().tz(`${startCity.country}/${startCity.city}`)

      setDataStartCity({
        year: date.format('YYYY'),
        month: date.format('MM'),
        day: date.format('DD'),
        dayOfWeek: date.format('dddd'),
        hours: date.format('HH:mm:ss'),
        utc: choice === 'city' ? date.format('Z') : startCity.name,
        city: choice === 'city' ? startCity.name : null,
      })
    }
  }, [startCity, endCity, choice])

  useEffect(() => {
    if (endCity) {
      const date = moment.utc().tz(`${endCity.country}/${endCity.city}`)

      setDataEndCity({
        year: date.format('YYYY'),
        month: date.format('MM'),
        day: date.format('DD'),
        dayOfWeek: date.format('dddd'),
        hours: date.format('HH:mm:ss'),
        utc: choice === 'city' ? date.format('Z') : endCity.name,
        city: choice === 'city' ? endCity.name : null,
      })
    }
  }, [endCity, startCity, choice])

  const upHours = () => {
    let startHours
    let endHours
    let startDay = dataStartCity.dayOfWeek
    let endDay = dataEndCity.dayOfWeek
    if (Number(dataStartCity.hours.split(':')[0]) === 23) {
      startHours = 0
      startDay = week.indexOf(dataStartCity.dayOfWeek) === 6 ? week[0] : week[week.indexOf(dataStartCity.dayOfWeek) + 1]
    } else {
      startHours = Number(dataStartCity.hours.split(':')[0]) + 1
    }
    if (Number(dataEndCity.hours.split(':')[0]) === 23) {
      endHours = 0
      endDay = week.indexOf(dataEndCity.dayOfWeek) === 6 ? week[0] : week[week.indexOf(dataEndCity.dayOfWeek) + 1]
    } else {
      endHours = Number(dataEndCity.hours.split(':')[0]) + 1
    }

    setDataStartCity(oldObject => ({ ...oldObject, hours: `${startHours < 10 ? `0${startHours}` : startHours}:${dataStartCity.hours.split(':')[1]}:${dataStartCity.hours.split(':')[2]}`, dayOfWeek: startDay }))
    setDataEndCity(oldObject => ({ ...oldObject, hours: `${endHours < 10 ? `0${endHours}` : endHours}:${dataEndCity.hours.split(':')[1]}:${dataEndCity.hours.split(':')[2]}`, dayOfWeek: endDay }))
  }

  const downHours = () => {
    let startHours
    let endHours
    let startDay = dataStartCity.dayOfWeek
    let endDay = dataEndCity.dayOfWeek

    if (Number(dataStartCity.hours.split(':')[0]) === 0) {
      startHours = 23
      startDay = week.indexOf(dataStartCity.dayOfWeek) === 0 ? week[6] : week[week.indexOf(dataStartCity.dayOfWeek) - 1]
    } else {
      startHours = Number(dataStartCity.hours.split(':')[0]) - 1
    }
    if (Number(dataEndCity.hours.split(':')[0]) === 0) {
      endHours = 23
      endDay = week.indexOf(dataEndCity.dayOfWeek) === 0 ? week[6] : week[week.indexOf(dataEndCity.dayOfWeek) - 1]
    } else {
      endHours = Number(dataEndCity.hours.split(':')[0]) - 1
    }

    setDataStartCity(oldObject => ({ ...oldObject, hours: `${startHours < 10 ? `0${startHours}` : startHours}:${dataStartCity.hours.split(':')[1]}:${dataStartCity.hours.split(':')[2]}`, dayOfWeek: startDay }))
    setDataEndCity(oldObject => ({ ...oldObject, hours: `${endHours < 10 ? `0${endHours}` : endHours}:${dataEndCity.hours.split(':')[1]}:${dataEndCity.hours.split(':')[2]}`, dayOfWeek: endDay }))
  }

  const timeStart = value => {
    if (/^([01]\d|2[0-3])$/.test(value) || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      setDataStartCity(oldObject => ({ ...oldObject, hours: `${value}:` }))
    } else if (value.length < 8) {
      setDataStartCity(oldObject => ({ ...oldObject, hours: value }))
      setIsErrorStart(true)
    } else if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value)) {
      setDataStartCity(oldObject => ({ ...oldObject, hours: value }))
      setIsErrorStart(false)
      difference(value, 'start')
    }
  }

  const timeEnd = value => {
    if (/^([01]\d|2[0-3])$/.test(value) || /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
      setDataEndCity(oldObject => ({ ...oldObject, hours: `${value}:` }))
    } else if (value.length < 8) {
      setDataEndCity(oldObject => ({ ...oldObject, hours: value }))
      setIsErrorEnd(true)
    } else if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value)) {
      setDataEndCity(oldObject => ({ ...oldObject, hours: value }))
      setIsErrorEnd(false)
      difference(value, 'end')
    }
  }

  const difference = (value, method) => {
    let hours = +value.split(':')[0]
    let mm = value.split(':')[1]
    let ss = value.split(':')[2]
    let startDay = dataStartCity.dayOfWeek
    let endDay = dataEndCity.dayOfWeek

    if (method === 'start') {
      hours += differenceInTime
      if (hours < 0) {
        hours += 24
        endDay = week.indexOf(dataEndCity.dayOfWeek) === 0 ? week[6] : week[week.indexOf(dataEndCity.dayOfWeek) - 1]
      } else if (hours > 23) {
        hours -= 24
        endDay = week.indexOf(dataEndCity.dayOfWeek) === 6 ? week[0] : week[week.indexOf(dataEndCity.dayOfWeek) + 1]
      }
      setDataEndCity(oldObject => ({ ...oldObject, hours: `${hours < 10 ? `0${hours}` : hours}:${mm}:${ss}`, dayOfWeek: endDay }))
    } else if (method === 'end') {
      hours -= differenceInTime
      if (hours < 0) {
        hours += 24
        startDay = week.indexOf(dataEndCity.dayOfWeek) === 0 ? week[6] : week[week.indexOf(dataEndCity.dayOfWeek) - 1]
      } else if (hours > 23) {
        hours -= 24
        startDay = week.indexOf(dataEndCity.dayOfWeek) === 6 ? week[0] : week[week.indexOf(dataEndCity.dayOfWeek) + 1]
      }
      setDataStartCity(oldObject => ({ ...oldObject, hours: `${hours < 10 ? `0${hours}` : hours}:${mm}:${ss}`, dayOfWeek: startDay }))
    }


  }

  return (
    <div className="App">
      <Grid className="choice" component="label" >
        <Grid item className={`text ${choice === 'city' ? '' : 'disabled'}`}>City</Grid>
        <Grid item>
          <Switch
            onClick={() => {
              if (choice === 'city') {
                setStartCity({ country: 'Etc', city: 'GMT+0', name: 'GMT' })
                setEndCity({ country: 'Etc', city: 'GMT-14', name: 'GMT -14' })
                setCitiesOfWorld([])
                setChoice('zone')
              } else if (choice === 'zone') {
                setStartCity({ country: 'Europe', city: 'Moscow', name: 'Moscow' })
                setEndCity({ country: 'America', city: 'New_York', name: 'New-York' })
                setCitiesOfWorld([])
                setChoice('city')
              }
            }}
            disableRipple
          />
        </Grid>
        <Grid item className={`text ${choice === 'zone' ? '' : 'disabled'}`} >TimeZone</Grid>
      </Grid>
      <div className="content">
        <div className="information" >
          <Autocomplete
            value={startCity}
            onChange={(event, newValue) => {
              if (newValue) {
                setStartCity(newValue)
              } else {
                setStartCity('')
              }
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={citiesOfWorld}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            renderOption={(option) => option.name}
            style={{ width: 145, height: 40 }}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
          <CityTimeZone data={dataStartCity} upClick={upHours} downClick={downHours} time={timeStart} isError={isErrorStart} />
        </div>
        <div className="information" >
          <AnalogClock hours={dataStartCity?.hours.split(':')[0]} minutes={dataStartCity?.hours.split(':')[1]} seconds={dataStartCity?.hours.split(':')[2]} />
        </div>
      </div>
      <div className="content">
        <div className="information" >
          <Autocomplete
            value={endCity}
            onChange={(event, newValue) => {
              if (newValue) {
                setEndCity(newValue)
              } else {
                setEndCity('')
              }
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={citiesOfWorld}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.name;
            }}
            renderOption={(option) => option.name}
            style={{ width: 145, height: 40 }}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
          <CityTimeZone data={dataEndCity} upClick={upHours} downClick={downHours} time={timeEnd} isError={isErrorEnd} />
        </div>
        <div className="information" >
          <AnalogClock hours={dataEndCity?.hours.split(':')[0]} minutes={dataEndCity?.hours.split(':')[1]} seconds={dataEndCity?.hours.split(':')[2]} />
        </div>
      </div>
    </div>
  );
}

export default App;
