import axios from "axios"

const OVER_HEAD = 1000

export const downloadWindData = (callback, launchPosition, timestamp, altitude, ascentR, descentR, burstAltitude) => {
  axios
    .post(
      `${process.env.GATSBY_PREDICTOR_URI}/winddata/pull`,
      {
        "launch-site:latitude": launchPosition[0].toString(),
        "launch-site:longitude": launchPosition[1].toString(),
        "launch-site:altitude": altitude,
        "launch-site:timestamp": timestamp,
        "atmosphere:wind-error": 0,
        "altitude-model:ascent-rate": ascentR,
        "altitude-model:descent-rate": descentR,
        "altitude-model:burst-altitude": (parseInt(burstAltitude) + OVER_HEAD),
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

export const predictionStatus = (callback, target) => {
  axios
    .get(
      `${process.env.GATSBY_PREDICTOR_URI}/status/${target}?timestamp=${new Date().getTime()}`
    )
    .then(response => {
      callback(response, null)
    })
    .catch(error => {
      callback(null, error)
    })
}

export const predictTrajectory = (callback, launchPosition, timestamp, altitude, ascentR, descentR, burstAltitude) => {
  axios
    .post(
      `${process.env.GATSBY_PREDICTOR_URI}/predict`,
      {
        "launch-site:latitude": launchPosition[0].toString(),
        "launch-site:longitude": launchPosition[1].toString(),
        "launch-site:altitude": altitude,
        "launch-site:timestamp": timestamp,
        "atmosphere:wind-error": 0,
        "altitude-model:ascent-rate": ascentR,
        "altitude-model:descent-rate": descentR,
        "altitude-model:burst-altitude": burstAltitude,
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