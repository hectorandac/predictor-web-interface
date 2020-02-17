import React, { useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

import MapTerrain from '../components/map'
import { predictionStatus, predictTrajectory, downloadWindData } from "../components/predictor"

import LinearProgress from "@material-ui/core/LinearProgress"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import styled from "styled-components";
import Card from "@material-ui/core/Card";

const ControlPanel = styled(Card)`
  position: absolute;
  width: 360px;
  height: 100%;
  max-height: 600px;
  background: rgba(255, 255, 255, 0.8) !important;
  border-radius: 8px;
  right: 16px;
  top: 16px;
  padding: 32px;
  z-index: 1000;
  overflow: auto !important;
`

const IndexPage = () => {
  const [loading, setLoading] = useState(null)
  const [time, setTime] = useState(null)
  const [launchPosition, setLaunchPosition] = useState([18.487876, -69.962292])
  const [trajectory, setTrajectory] = useState([])
  const [timestamp, setTimestamp] = useState(Math.round((new Date()).getTime() / 1000))
  const [launchAltitude, setLaunchAltitude] = useState(0)
  const [ascentRate, setAscentRate] = useState(5)
  const [descentRate, setDescentRate] = useState(9.8)
  const [burstAltitude, setBurstAltitude] = useState(2000)

  const onButtonClick = () => {
    function queryProgress(target, parent) {
      predictionStatus(function (response, error) {
        if (response !== null) {
          setLoading(response.data.gfs_percent)
          setTime(response.data.gfs_timeremaining)
          if (response.data.gfs_complete) {
            clearInterval(parent);
            predictTrajectory(function (response, error) {
              if (response !== null) {
                let coordinates = response.data.output.map((item) => [item[1], item[2]])
                coordinates.unshift(launchPosition);
                setTrajectory(coordinates)
                console.log(response)
              } else {
                console.log(error)
              }
            }, launchPosition, timestamp, launchAltitude, ascentRate, descentRate, burstAltitude);
          }
        } else {
          console.log(error)
        }
      }, target)
    }

    downloadWindData(function (response, error) {
      if (response !== null) {
        const target = response.data.output
        setLoading(0)
        const progressQuery = setInterval(
          () => queryProgress(target, progressQuery),
          1000
        )
      } else {
        console.log(error)
      }
    }, launchPosition, timestamp, launchAltitude, ascentRate, descentRate, burstAltitude)
  }

  return (
    <Layout>
      <SEO title="Home" />
      <ControlPanel>
        {loading !== null ? (
          <>
            <p>Calculating: {time}</p>
            <LinearProgress variant="determinate" value={loading} />
          </>
        ) : (
            <></>
          )}
        <TextField
          style={{ width: '100%' }}
          id="latitude"
          label="Latitude"
          margin="normal"
          value={launchPosition[0]}
          onChange={(node) => { setLaunchPosition([node.target.value, launchPosition[1]]) }}
          variant="outlined"
        />

        <TextField
          style={{ width: '100%' }}
          id="longitude"
          label="Longitude"
          margin="normal"
          value={launchPosition[1]}
          onChange={(node) => { setLaunchPosition([launchPosition[0], node.target.value]) }}
          variant="outlined"
        />

        <TextField
          style={{ width: '100%' }}
          id="launch-time"
          label="Launch timestamp"
          type="datetime-local"
          variant="outlined"
          margin="normal"
          defaultValue={new Date()}
          onChange={(node) => { setTimestamp(Math.round((new Date(node.target.value)).getTime() / 1000)); console.log(timestamp) }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          style={{ width: '100%' }}
          label="Launch altitude"
          id="launch-altitude"
          type="number"
          margin="normal"
          onChange={(node) => { setLaunchAltitude(node.target.value) }}
          value={launchAltitude}
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          variant="outlined"
        />

        <TextField
          style={{ width: '100%' }}
          label="Ascent Rate"
          id="ascent-rate"
          margin="normal"
          onChange={(node) => { setAscentRate(node.target.value) }}
          value={ascentRate}
          InputProps={{
            endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
          }}
          variant="outlined"
        />

        <TextField
          style={{ width: '100%' }}
          label="Descent Rate"
          id="descent-rate"
          margin="normal"
          onChange={(node) => { setDescentRate(node.target.value) }}
          value={descentRate}
          InputProps={{
            endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
          }}
          variant="outlined"
        />


        <TextField
          style={{ width: '100%' }}
          label="Burst Altitude"
          id="burst-altitude"
          type="number"
          margin="normal"
          onChange={(node) => { setBurstAltitude(node.target.value) }}
          value={burstAltitude}
          InputProps={{
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          }}
          variant="outlined"
        />

        <Button variant="contained" color="primary" onClick={onButtonClick}>Predecir trayectoria</Button>
        <Button variant="contained" style={{ marginTop: '16px' }} onClick={() => (setTrajectory([]))}>Limpiar resultados</Button>
      </ControlPanel>
      <MapTerrain launchPosition={launchPosition} multiPolyline={trajectory} />
    </Layout >
  )
}

export default IndexPage
