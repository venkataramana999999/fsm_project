import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    CardText,
    CardLink,
    Row,
    Col,
    Button,
    Label,
    Input,
    CardSubtitle
  } from "reactstrap"


  import '@styles/react/libs/flatpickr/flatpickr.scss'
  // import GoogleMapReact from 'google-map-react'
  import { MapContainer, Marker, Pane, Popup, TileLayer } from "react-leaflet"
  import 'leaflet/dist/leaflet.css'


  import { withTranslation } from 'react-i18next'
  
  const Map_View = ({}) => {
    const position = [17.688983, 74.001390]
    return (
      <>
   <Card>
    <Row>
    <Col md={12} xs={12} lg={12}>
      <MapContainer
        center={position}
        zoom={12}
        attributionControl={false}
        layersControl={false}
        style={{ height: '75vh' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    
      </MapContainer>
      {/* </div> */}
    </Col>                       

    </Row>
   </Card>
      </>
       
    )
  }
  
  export default (withTranslation()(Map_View))
  