import $ from 'jquery';
import React from 'react';
import ParkingZonesStore from '../stores/ParkingZonesStore.js';
import ParkingZoneActions from '../actions/ParkingZoneActions.js';
import ZonePieChart from './ZonePieChart.jsx';
import cn from 'classnames';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';

// const baseAPIUrl = 'http://localhost:8080';
const baseAPIUrl = 'https://enigmatic-brushlands-35263.herokuapp.com';

const styles = {
  toolbarBtn: {
    marginLeft: 2
  }
};

function chooseFile(name) {
  var chooser = $(name);
  chooser.unbind('change');
  chooser.trigger('click');
}

function mapObject(object, callback) {
  return Object.keys(object).map(function (key, i) {
    return callback(key, object[key], i);
  });
}

export default class ParkingLotDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = _.extend({}, this.getStateFromStores(), {
      editingNewParkignZone: false,
      existingParkingZoneInEdition: null,
      editingPlaces: false,
      previousVisibleTab: 'overview',
      visibleTab: 'overview',
      analyticsStartDate: moment(),
      analyticsEndDate: null
    });
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
    const { zones, places, editingPlaces, editingNewParkignZone, chartData, visibleTab } = this.state;

    return (
      <div>

        <h1>Overview</h1>

        <div className="ui top attached tabular menu">
          <div className="active item"
            className={cn({ 'item': true, 'active': visibleTab === 'overview' })}
            ref="overviewTab"
            style={{cursor: "pointer"}}
            onClick={_.partial(this.setVisibleTab, 'overview')}>
            Overview
          </div>
          <div className={cn({ 'item': true, 'active': visibleTab === 'details'})}
            ref="detailsTab"
            style={{cursor: "pointer"}}
            onClick={_.partial(this.setVisibleTab, 'details')}>
            Details
          </div>
          <div className={cn({ 'item': true, 'active': visibleTab === 'analytics'})}
            ref="detailsTab"
            style={{cursor: "pointer"}}
            onClick={_.partial(this.setVisibleTab, 'analytics')}>
            Analytics
          </div>
        </div>

        <div className={cn({'ui bottom attached tab segment': true, 'active': visibleTab === 'overview'})}
          ref="overview">
          <div className="ui two column grid">
            <div className="column">
              <h3><i className="stop icon" style={{color: '#F7464A'}}></i> Occupied spots</h3>
            </div>
            <div className="column">
              <h3><i className="stop icon" style={{color: '#46BFBD'}}></i> Available spots</h3>
            </div>
            {zones.map(function(z, i) {
              return (
                <div className="column" key={i}>
                  <ZonePieChart zone={z} key={_.uniqueId()} />
                </div>
              );
            })}
          </div>
        </div>

        {this.renderAnalytics()}

        <div className={cn({'ui bottom attached tab segment': true, 'active': visibleTab === 'details'})}
          ref="details">
          <h1>Parking Lot Details</h1>

          <input style={{display: "none"}} id="fileDialog" type="file" onChange={this.importCSVData} accept=".csv"/>
          <div className="ui icon buttons" ref="toolbar">
            <button className="ui basic blue button"
              onClick={this.editNewParkingZone}
              data-content="New parking zone">
              <i className="add circle icon"></i>
            </button>
            <button className="ui basic yellow button"
              style={_.extend({}, styles.toolbarBtn)}
              onClick={this.promptForCSVFile}
              data-content="New parking zone from csv">
              <i className="file outline icon"></i>
            </button>
          </div>

          <table className="ui celled table">
            <thead>
              <tr>
                <th>Zone ID</th>
                <th>Zone Name</th>
                <th>Availability</th>
                <th>Capacity</th>
                <th>Occupancy</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {editingNewParkignZone ?
                this.renderNewParkingZoneEditor() :
                null
              }
              {zones.map((z, i) => {
                return z.id === this.state.existingParkingZoneInEdition ?
                this.renderExistingParkingZoneEditor(z, i) :
                this.renderParkingZoneRow(z, i)
              })}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="2"><b>Totals</b></th>
                <th>{this.getAvailabilityTotal()}</th>
                <th>{this.getCapacityTotal()}</th>
                <th>{this.getOccupancyTotal()}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>

          <h1>Places</h1>

          <div className="ui icon buttons" ref="toolbar">
            <button className="ui basic blue button"
              onClick={this.beginEditingPlaces}
              data-content="Edit places">
              <i className="edit icon"></i>
            </button>
            <button className="ui basic yellow button"
              onClick={this.savePlacesData}
              style={_.extend({}, styles.toolbarBtn)}
              data-content="Save places">
              <i className="save icon"></i>
            </button>
          </div>

          <table className="ui celled table">
            <thead>
              <tr>
                <th>Place</th>
                <th>ZoneID</th>
                <th>Category</th>
                <th></th>
              </tr>
            </thead>
            { editingPlaces ?
              this.renderPlacesRowsEditor() :
              this.renderPlacesRows() }
            </table>
          </div>
        </div>
      );
    }

    getStateFromStores = () => {
      const { zones, places, parkingHistory } = ParkingZonesStore.getState();


      return {
        zones: zones,
        places: places,
        parkingHistory: parkingHistory
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

    getOccupancyTotal = () => {
      const { zones } = this.state;
      return _.reduce(zones, function(result, value, key) {
        return result += value.occupancy;
      }, 0);
    }

    getAvailabilityTotal = () => {
      const { zones } = this.state;
      return _.reduce(zones, function(result, value, key) {
        return result += (value.capacity - value.occupancy);
      }, 0);
    }

    $getAllPopups = () => {
      return $('[data-content]');
    }

    deleteParkingZone = (zoneName) => {
      $.ajax({
        method: 'DELETE',
        url: `${baseAPIUrl}/api/zone/${zoneName}`,
      });
    }

    renderParkingZoneRow = (zone, i) => {
      return (
        <tr key={i}>
          <td>{zone.id}</td>
          <td>{zone.name}</td>
          <td>{zone.capacity - zone.occupancy}</td>
          <td>{zone.capacity}</td>
          <td>{zone.occupancy}</td>
          <td>
            <div className="ui icon buttons">
              <button className="ui violet basic button"
                onClick={_.partial(this.editExistingParkingZone, zone.id)}
                data-content="Modify zone">
                <i className="edit icon"></i>
              </button>
              <button className="ui red basic button"
                onClick={_.partial(this.deleteParkingZone, zone.id)}
                style={_.extend({}, styles.toolbarBtn)}
                data-content="Delete parking zone">
                <i className="trash outline icon"></i>
              </button>
            </div>
          </td>
        </tr>
      );
    }

    editNewParkingZone = () => {
      this.setState({ editingNewParkignZone: true });
    }

    cancelNewParkingZoneEdition = () => {
      this.setState({ editingNewParkignZone: false });
    }

    renderNewParkingZoneEditor = () => {
      return (
        <tr className="ui form">
          <td>
            <input type="text" ref="newZoneId"/>
          </td>
          <td>
            <input type="text" ref="newZoneName"/>
          </td>
          <td></td>
          <td>
            <input type="number" ref="newZoneCapacity"/>
          </td>
          <td>
            <input type="number" defaultValue={0} ref="newZoneOccupancy"/>
          </td>
          <td>
            <div className="ui icon buttons">
              <button className="ui basic green button"
                onClick={this.createNewParkingZone}>
                <i className="save icon"></i>
              </button>
              <button className="ui basic orange button"
                style={_.extend({}, styles.toolbarBtn)}
                onClick={this.cancelNewParkingZoneEdition}>
                <i className="remove icon"></i>
              </button>
            </div>
          </td>
        </tr>
      );
    }

    createNewParkingZone = () => {
      const zoneData = {
        id: $(this.refs.newZoneId).val(),
        name: $(this.refs.newZoneName).val(),
        capacity: parseInt($(this.refs.newZoneCapacity).val(), 10),
        occupancy: parseInt($(this.refs.newZoneOccupancy).val(), 10)
      };

      $.ajax({
        method: 'POST',
        url: `${baseAPIUrl}/api/zone`,
        contentType: 'application/json',
        data: JSON.stringify(zoneData),
        success: (data, status, xhr) => {
          this.setState({ editingNewParkignZone: false });
        },
        error: function(xhr, status, err) {
          console.error('TODO: Inform user of mistakes');
        }
      });
    }

    editExistingParkingZone = (zoneId) => {
      this.setState({ existingParkingZoneInEdition: zoneId });
    }

    cancelExistingParkingZoneEdition = () => {
      this.setState({ existingParkingZoneInEdition: null });
    }

    renderExistingParkingZoneEditor = (zone, i) => {
      return (
        <tr className="ui form" key={i}>
          <td>{zone.id}</td>
          <td>
            <input type="text" defaultValue={zone.name} ref="existingZoneName"/>
          </td>
          <td></td>
          <td>
            <input type="number" defaultValue={zone.capacity} ref="existingZoneCapacity"/>
          </td>
          <td>
            <input type="number" defaultValue={zone.occupancy} ref="existingZoneOccupancy"/>
          </td>
          <td>
            <div className="ui icon buttons">
              <button className="ui basic green button"
                onClick={_.partial(this.modifyExistingParkingZone, zone.id)}>
                <i className="save icon"></i>
              </button>
              <button className="ui basic orange button"
                style={_.extend({}, styles.toolbarBtn)}
                onClick={this.cancelExistingParkingZoneEdition}>
                <i className="remove icon"></i>
              </button>
            </div>
          </td>
        </tr>
      );
    }

    modifyExistingParkingZone = (zoneId) => {
      const zoneData = {
        name: $(this.refs.existingZoneName).val(),
        capacity: parseInt($(this.refs.existingZoneCapacity).val(), 10),
        occupancy: parseInt($(this.refs.existingZoneOccupancy).val(), 10)
      };

      $.ajax({
        method: 'PUT',
        url: `${baseAPIUrl}/api/zone/${zoneId}`,
        contentType: 'application/json',
        data: JSON.stringify(zoneData),
        success: (data, status, xhr) => {
          this.setState({ existingParkingZoneInEdition: null });
        },
        error: function(xhr, status, err) {
          console.error('TODO: Inform user of mistakes');
        }
      });
    }

    beginEditingPlaces = () => {
      this.setState({ editingPlaces: !this.state.editingPlaces });
    }

    renderPlacesRows = (placeName, placeData, i) => {
      const { places } = this.state;

      return (
        <tbody>
          {mapObject(places || {}, (placeName, placeData, i) => {
            return (
              <tr key={i}>
                <td>{placeName}</td>
                <td>{placeData.zoneID}</td>
                <td>{placeData.category}</td>
                <td>
                  <div className="ui icon buttons">
                    <button className="ui basic red button"
                      data-content="Delete place"
                      style={_.extend({}, styles.toolbarBtn)}
                      onClick={_.partial(this.deletePlace, placeName)}>
                      <i className="trash icon"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      );
    };

    renderPlacesRowsEditor = (placeName, placeData, i) => {
      const { places } = this.state;

      return (
        <tbody className="ui form">
          <tr>
            <td>
              <input type="text" ref="newPlaceName"/>
            </td>
            <td>
              <input type="text" ref="newPlaceZoneID"/>
            </td>
            <td>
              <input type="text" ref="newPlaceCategory"/>
            </td>
          </tr>
          {mapObject(places || {}, (placeName, placeData, i) => {
            return (
              <tr key={i}>
                <td>{placeName}</td>
                <td>
                  <input defaultValue={placeData.zoneID} type="text"
                    onChange={_.partial(this.changePlaceData, _, placeName, 'zoneID')}/>
                </td>
                <td>
                  <input defaultValue={placeData.category} type="text"
                    onChange={_.partial(this.changePlaceData, _, placeName, 'category')}/>
                </td>
              </tr>
            );
          })}
        </tbody>
      );
    }

    changePlaceData = (e, placeName, attribute) => {
      const { places } = this.state;
      const newPlaces = _.clone(places);
      _.set(newPlaces, placeName + '.' + attribute, $(e.target).val());
      this.setState({
        places: newPlaces
      });
    }

    savePlacesData = () => {
      const newPlaceName = $(this.refs.newPlaceName).val();
      const newPlaceData = {
        zoneID: $(this.refs.newPlaceZoneID).val(),
        category: $(this.refs.newPlaceCategory).val()
      };

      let payload = {};

      if (newPlaceName && newPlaceData.zoneID && newPlaceData.category) {
        _.extend(payload, _.set({}, newPlaceName, newPlaceData));
      }

      _.extend(payload, this.state.places);

      $.ajax({
        method: 'POST',
        url: `${baseAPIUrl}/api/places`,
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: () => {
          this.setState({ editingPlaces: false });
        }
      });
    }

    deletePlace = (placeName) => {
      $.ajax({
        method: 'DELETE',
        url: `${baseAPIUrl}/api/places/${placeName}`,
      });
    }

    promptForCSVFile = () => {
      chooseFile('#fileDialog');
    }

    importCSVData = () => {
      var file = $('#fileDialog').get(0).files[0];
      var textType = /text.*/;

      if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = (e) => {
          this.createZonesFromCSVData(reader.result);
        }

        reader.readAsText(file);
      } else {
        fileDisplayArea.innerText = "File not supported!"
      }
    }

    createZonesFromCSVData = (rawcsv) => {
      let lines = rawcsv.split('\n');
      lines.splice(lines.length - 1, 1);
      let zonesData = {};

      _.each(lines, function(line) {
        let tokens = line.split(',');
        let zoneID = tokens[0];
        let parkingSpot = tokens[1];
        let occupied = tokens[2] == 1;

        if(_.isUndefined(zonesData[zoneID])) {
          zonesData[zoneID] = {};
        }

        const zone = zonesData[zoneID];

        if (!_.isUndefined(zone.capacity)) {
          zone.capacity += 1;
        } else{
          zone.capacity = 1;
        }

        if (occupied) {
          if (_.isUndefined(zone.occupancy)) {
            zone.occupancy = 1;
          } else {
            zone.occupancy += 1;
          }
        }

        if (_.isUndefined(zone.occupancy)) {
          zone.occupancy = 0;
        }

        zone.name = `Zona ${zoneID}`;
      });

      $.ajax({
        method: 'PUT',
        url: `${baseAPIUrl}/api/zone`,
        contentType: 'application/json',
        data: JSON.stringify(zonesData)
      });

    }

    setVisibleTab = (tabName) => {
      this.setState({
        previousVisibleTab: this.state.visibleTab,
        visibleTab: tabName
      });
    }

    renderAnalytics = () => {
      const { visibleTab, parkingHistory } = this.state;

      return (
        <div className={cn({'ui bottom attached tab segment': true, 'active': visibleTab === 'analytics'})}>
          <h1>Analytics</h1>

          <div className="ui form">
            <div className="four fields">
              <div className="field">
                <label>Plate</label>
                <input className="fluid" type="text" ref="analyticsPlate"/>
              </div>
              <div className="field">
                <label>Zone</label>
                <select className="ui fluid dropdown" ref="analyticsZone">
                  <option value="ALL">ALL</option>
                  {this.state.zones.map((zoneData) => {
                    return <option key={zoneData.id} value={zoneData.id}>{zoneData.id + ' ' + zoneData.name}</option>
                  })}
                </select>
              </div>
              <div className="field">
                <label>Entry day</label>
                <DatePicker
                  isClearable={true}
                  selected={this.state.analyticsStartDate}
                  onChange={_.partial(this.setAnalyticDate, _, 'start')}
                  placeholderText='Any' />
              </div>
              <div className="field">
                <label>Exit day</label>
                <DatePicker
                  isClearable={true}
                  selected={this.state.analyticsEndDate}
                  onChange={_.partial(this.setAnalyticDate, _, 'end')}
                  placeholderText='Any' />
              </div>
            </div>
            <button className="ui basic blue button"
              onClick={this.filterParkingHistory}>
              <i className="search icon"></i>
            </button>
          </div>

          <table className="ui celled table">
            <thead>
              <tr>
                <th>Plates</th>
                <th>Zone</th>
                <th>Entry Timestamp</th>
                <th>Exit Timestamp</th>
              </tr>
            </thead>
            <tbody>
              { parkingHistory.map((datum, i) => {
                return (
                  <tr key={datum.plates + datum.entryTimestamp}>
                    <td>{datum.plates}</td>
                    <td>{datum.zoneId}</td>
                    <td>{datum.entryTimestamp ? moment(datum.entryTimestamp).format('MMMM Do YYYY, h:mm:ss a') : ''}</td>
                    <td>{datum.exitTimestamp ? moment(datum.exitTimestamp).format('MMMM Do YYYY, h:mm:ss a') : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    calculateParkingTime(datum) {
      if (datum.entryTimestamp && datum.exitTimestamp) {
        return (datum.exitTimestamp - datum.entryTimestamp) / 60000 + ' minutes';
      } else {
        return ''
      }
    };

    filterParkingHistory = () => {
      const {analyticsStartDate, analyticsEndDate} = this.state;

      const plate = $(this.refs.analyticsPlate).val();
      const zone = $(this.refs.analyticsZone).val();
      const startDay = _.isNull(analyticsStartDate) ? null : analyticsStartDate.format('x');
      const endDay = _.isNull(analyticsEndDate) ? null : analyticsEndDate.format('x');

      let searchParams = {};

      if (!_.isUndefined(plate) && plate !== '') {
        searchParams.plate = plate;
      }

      if (!_.isUndefined(zone) && zone !== '') {
        searchParams.zone = zone;
      }

      if (!_.isNull(startDay)) {
        searchParams.startDay = startDay;
      }

      if (!_.isNull(endDay)) {
        searchParams.endDay = endDay;
      }

      ParkingZoneActions.filterParkingHistory(searchParams);
    }

    setAnalyticDate = (date, kind) => {
      if (kind === 'start') {
        this.setState({
          analyticsStartDate: date
        });
      } else if (kind === 'end') {
        this.setState({
          analyticsEndDate: date
        });
      }
    }

  }
