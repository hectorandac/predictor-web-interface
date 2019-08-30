import React, { useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Leaflet from "leaflet"
import locationA from "../images/location_a.png"
import locationB from "../images/location_b.png"
import styled from "styled-components"
import axios from 'axios'

import { Map, Marker, Popup, TileLayer, Polyline } from "react-leaflet"

const ControlPanel = styled.div`
  position: absolute;
  width: 360px;
  height: 100%;
  max-height: 600px;
  overflow: auto;
  background: rgba(255, 255, 255, 0.7);
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
        <Marker position={multiPolyline[multiPolyline.length - 1]} icon={landingIcon}>
          <Popup>{multiPolyline[multiPolyline.length - 1]}</Popup>
        </Marker>
      ) : (
        <></>
      )}

      <Polyline color="red" positions={multiPolyline} />
    </Map>
  )
}

const IndexPage = () => {

  var a = [18.487876, -69.962292]

  const instance = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
    }
  });

  const onButtonClick = () => {
    instance.post('/runpred.cgi', {
      "launch-site:latitude": "52",
      "launch-site:longitude": "0",
      "launch-site:altitude": "0",
      "launch-site:timestamp": "1566996921",
      "atmosphere:wind-error": "0",
      "altitude-model:ascent-rate": "3",
      "altitude-model:descent-rate": "5",
      "altitude-model:burst-altitude": "10000",
      "target": "load"
    })
  }

  return (
    <Layout>
      <SEO title="Home" />
      <ControlPanel>
        <button onClick={onButtonClick}>Focus the input</button>
      </ControlPanel>
      <MapTerrain />
    </Layout>
  )
}

export default IndexPage
