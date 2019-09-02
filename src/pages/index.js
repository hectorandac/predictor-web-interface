import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Leaflet from "leaflet"
import locationA from "../images/location_a.png"
import locationB from "../images/location_b.png"
import styled from "styled-components"
import axios from "axios"
import Card from "@material-ui/core/Card"
import LinearProgress from "@material-ui/core/LinearProgress"

import { Map, Marker, Popup, TileLayer, Polyline } from "react-leaflet"

const ControlPanel = styled(Card)`
  position: absolute;
  width: 360px;
  height: 100%;
  max-height: 600px;
  overflow: auto;
  background: rgba(255, 255, 255, 0.7) !important;
  border-radius: 8px;
  right: 16px;
  top: 16px;
  padding: 32px;
  z-index: 1000;
`

const launchIcon = Leaflet.icon({
  iconUrl: locationA,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

const landingIcon = Leaflet.icon({
  iconUrl: locationB,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

const MapTerrain = ({ launchPosition, multiPolyline = [] }) => {
  const mapCenter = [18.487876, -69.962292]
  return (
    <Map
      style={{ width: "100%", height: "100vh" }}
      center={launchPosition || mapCenter}
      zoom={13}
    >
      <TileLayer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {launchPosition ? (
        <Marker position={launchPosition} icon={launchIcon}>
          <Popup>{launchPosition}</Popup>
        </Marker>
      ) : (
        <></>
      )}

      {multiPolyline[multiPolyline.length - 1] ? (
        <Marker
          position={multiPolyline[multiPolyline.length - 1]}
          icon={landingIcon}
        >
          <Popup>{multiPolyline[multiPolyline.length - 1]}</Popup>
        </Marker>
      ) : (
        <></>
      )}

      <Polyline color="red" positions={multiPolyline} />
    </Map>
  )
}

const requestWindPull = callback => {
  axios
    .post(
      "https://wind-predictor-back-end.herokuapp.com/winddata/pull",
      {
        "launch-site:latitude": 18.487876,
        "launch-site:longitude": -69.962292,
        "launch-site:altitude": 0,
        "launch-site:timestamp": 1567970657,
        "atmosphere:wind-error": 0,
        "altitude-model:ascent-rate": 3,
        "altitude-model:descent-rate": 5,
        "altitude-model:burst-altitude": 10000,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    )
    .then(response => {
      callback(response, null)
    })
    .catch(error => {
      callback(null, error)
    })
}

const requestInterval = (callback, target) => {
  axios
    .get(
      `https://wind-predictor-back-end.herokuapp.com/status/${target}?timestamp=${new Date().getTime()}`
    )
    .then(response => {
      callback(response, null)
    })
    .catch(error => {
      callback(null, error)
    })
}

const requestTrajectory = (callback) => {
  axios
    .post(
      "https://wind-predictor-back-end.herokuapp.com/predict",
      {
        "launch-site:latitude": 18.487876,
        "launch-site:longitude": -69.962292,
        "launch-site:altitude": 0,
        "launch-site:timestamp": 1567460317,
        "atmosphere:wind-error": 0,
        "altitude-model:ascent-rate": 3,
        "altitude-model:descent-rate": 5,
        "altitude-model:burst-altitude": 10000,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    )
    .then(response => {
      callback(response, null)
    })
    .catch(error => {
      callback(null, error)
    })
}

const IndexPage = () => {
  const [loading, setLoading] = useState(null)
  const [time, setTime] = useState(null)
  const [launchPosition, setLaunchPosition] = useState([18.487876, -69.962292])
  const [trajectory, setTrajectory] = useState([])

  const onButtonClick = () => {
    function queryProgress(target, parent) {
      requestInterval(function(response, error) {
        if (response !== null) {
          setLoading(response.data.gfs_percent)
          setTime(response.data.gfs_timeremaining)
          if (response.data.gfs_complete) {
            clearInterval(parent);
            requestTrajectory(function (response, error) {
              if (response !== null) {
                setTrajectory(response.data.output.map((item) => [item[1], item[2]]))
                console.log(response)
              } else {
                console.log(error)
              }
            });
          }
        } else {
          console.log(error)
        }
      }, target)
    }

    requestWindPull(function(response, error) {
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
    })
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
        <br />
        <button onClick={onButtonClick}>Predecir trayectoria</button>
      </ControlPanel>
      <MapTerrain launchPosition={launchPosition} multiPolyline={trajectory} />
    </Layout>
  )
}

export default IndexPage