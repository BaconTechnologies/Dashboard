import React from 'react';
import ParkingZonesStore from '../stores/ParkingZonesStore.js';

export default class ParkingLotDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getStateFromStores();
  }

  componentDidMount() {
    ParkingZonesStore.listen(this.onStoresChange);
  }

  componentWillUnmount() {
    ParkingZonesStore.unlisten(this.onStoresChange);
  }

  render() {
    const { zones } = this.state;
    console.log(zones);
    return (
      <div>
        {zones.map((z, i) => {
          return <p key={i}>Occupancy: {z.occupancy}</p>
        })}
      </div>
    );
  }

  getStateFromStores = () => {
    const { zones } = ParkingZonesStore.getState();
    return {
      zones: zones
    };
  }

  onStoresChange = () => {
    this.setState(this.getStateFromStores());
  }

}
