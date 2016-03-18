import _ from 'lodash';
import alt from '../alt.js';
import Firebase from 'firebase';
import ParkingZoneActions from '../actions/ParkingZoneActions.js';
import moment from 'moment';

const db = new Firebase('https://scorching-fire-7518.firebaseio.com/');

class ParkingLotStore {

  constructor() {
    this.zones = [];
    this.places = {};
    this.suggestedZone = null;
    this.parkingHistory = [];

    db.child('zones').on('value', (snapshot) => {
      this.zones = _.map(_.toPairs(snapshot.val()), function(pair) {
        pair[1].id = pair[0];
        return pair[1];
      });
      this.emitChange();
    });

    db.child('suggestedZone').on('value', (snapshot) => {
      this.suggestedZone = _.find(this.zones, {id: snapshot.val()});
      this.emitChange();
    });

    db.child('places').on('value', (snapshot) => {
      this.places = snapshot.val();
      this.emitChange();
    })

    this.bindListeners({
      onParkingHistoryFilter: ParkingZoneActions.filterParkingHistorySuccess
    });

    ParkingZoneActions.filterParkingHistory({ plate: '', zone: 'ALL', startDay: moment().format('x'), endDay: '' });
  }

  onParkingHistoryFilter(parkingHistory) {
    console.log('onParkingHistoryFilter called');
    this.parkingHistory = parkingHistory;
  }

}

export default alt.createStore(ParkingLotStore, 'ParkingZonesStore');
