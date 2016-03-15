import _ from 'lodash';
import alt from '../alt.js';
import Firebase from 'firebase';

const db = new Firebase('https://scorching-fire-7518.firebaseio.com/');

class ParkingLotStore {

  constructor() {
    this.zones = [];
    this.nextToPark = null;

    db.child('zones').on('value', (snapshot) => {
      this.zones = _.values(_.mapValues(snapshot.val(), function(value, key) {
        value.name = key;
        return value;
      }));
      this.emitChange();
    });

    db.child('nextToPark').on('value', (snapshot) => {
      this.nextToPark = snapshot.val();
      this.emitChange();
    });
  }

}

export default alt.createStore(ParkingLotStore);
