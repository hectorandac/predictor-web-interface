import React from "react";

// Tags
import locationA from "../images/location_a.png"
import locationB from "../images/location_b.png"

const MapTerrain = ({ launchPosition, multiPolyline = [], mapCenter = [18.487876, -69.962292] }) => {
  if (typeof window !== `undefined`) {

    const Leaflet = require("leaflet")
    const ReactLeaflet = require("react-leaflet");

    const Map = ReactLeaflet.Map
    const Marker = ReactLeaflet.Marker
    const Popup = ReactLeaflet.Popup
    const TileLayer = ReactLeaflet.TileLayer
    const Polyline = ReactLeaflet.Polyline

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

    return (
      <Map
        style={{ width: "100%", height: "100vh" }}
        center={launchPosition || mapCenter}
        zoom={13}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
  } else {
    return <></>
  }
}

export default MapTerrain;