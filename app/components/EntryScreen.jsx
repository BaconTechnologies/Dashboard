import _ from 'lodash';
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
    const { suggestedZone } = this.state;

    return (
      <div>
        <h2 className="ui horizontal divider header">Parking Brain</h2>
        <div className="ui center aligned segment">
          <h3>Favor de estacionarse en</h3>
          <h1 className="parking-zone-sign"
            style={{fontSize: 65}}>
            {_.get(suggestedZone, 'name', '')}
          </h1>
        </div>
      </div>
    );
  }

  onStoresChange = () => {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores = () => {
    const { suggestedZone } = ParkingZonesStore.getState();
    return {
      suggestedZone: suggestedZone
    };
  }

}
