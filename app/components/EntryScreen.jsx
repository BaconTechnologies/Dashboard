import React from 'react';
import ParkingZonesStore from '../stores/ParkingZonesStore.js';

export default class EntryScreen extends React.Component {

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
    const { nextToPark } = this.state;

    return (
      <div>
        <h2>Nombre de la institución</h2>

        <h4>Favor de estacionarse en</h4>
        <h1>{nextToPark}</h1>
      </div>
    );
  }

  onStoresChange = () => {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores = () => {
    const { nextToPark } = ParkingZonesStore.getState();
    return {
      nextToPark: nextToPark
    };
  }

}
