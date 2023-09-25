import React from 'react'
import './marker.css'
const Marker = (props) => {
    const { name } = props
    return (
      <div className="pin"
        style={{ backgroundColor: "blue", cursor: 'pointer'}}
        title={name}
      />
    )
  }

  export default Marker