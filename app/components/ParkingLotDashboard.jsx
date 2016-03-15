import $ from 'jquery';
import React from 'react';
import ParkingZonesStore from '../stores/ParkingZonesStore.js';

export default class ParkingLotDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getStateFromStores();
  }

  componentDidMount() {
    ParkingZonesStore.listen(this.onStoresChange);
    this.$getAllPopups().popup();
  }

  componentWillUnmount() {
    ParkingZonesStore.unlisten(this.onStoresChange);
  }

  componentDidUpdate() {
    this.$getAllPopups().popup('hide all');
    this.$getAllPopups().popup();
  }

  render() {
    const { zones } = this.state;
    return (
      <div>
        <h1 className="centered">Parking Lot Dashboard</h1>

        <div className="ui icon buttons" ref="toolbar">
          <button className="ui basic blue button" data-content="New parking zone">
            <i className="add circle icon"></i>
          </button>
        </div>

        <table className="ui celled table">
          <thead>
            <tr>
              <th>Zone Name</th>
              <th>Capacity</th>
              <th>Occupancy</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z, i) => {
              return (
                <tr key={i}>
                  <td>{z.name}</td>
                  <td>{z.capacity}</td>
                  <td>{z.occupancy}</td>
                  <td>
                    <div className="ui icon buttons">
                      <button className="ui red basic button"
                        onClick={_.partial(this.deleteParkingZone, z.name)}
                        data-content="Delete parking zone">
                        <i className="trash outline icon"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Totals</th>
              <th>{this.getCapacityTotal()}</th>
              <th>{this.getOccupancyTotal()}</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
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

  getCapacityTotal = () => {
    const { zones } = this.state;
    return _.reduce(zones, function(result, value, key) {
      return result += value.capacity;
    }, 0);
  }

  $getAllPopups = () => {
    return $('[data-content]');
  }

  getOccupancyTotal = () => {
    const { zones } = this.state;
    return _.reduce(zones, function(result, value, key) {
      return result += value.occupancy;
    }, 0);
  }

  deleteParkingZone = (zoneName) => {
    $.ajax({
      method: 'DELETE',
      url: `http://localhost:8000/api/zone/${zoneName}`,
      crossDomain: true
    });
  }

}
