import React from 'react';
import { Pie } from 'react-chartjs';

export default class ZonePieChart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { zone } = this.props;
    const data = [
      {
        value: zone.occupancy,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: `Occupancy of ${zone.name}`
      },
      {
        value: zone.capacity - zone.occupancy,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: `Availability of ${zone.name}`
      }
    ];

    return (
      <div>
        <h3 style={{textAlign: "center"}}>{zone.name}</h3>
        <Pie data={data} width="400" height="250" />
      </div>
    )
  }

}
