import styled from "styled-components"

import Card from "@material-ui/core/Card"

export const ControlPanel = styled(Card)`
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