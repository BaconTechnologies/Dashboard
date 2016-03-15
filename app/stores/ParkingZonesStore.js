import _ from 'lodash';
import alt from '../alt.js';
import Firebase from 'firebase';

const db = new Firebase('https://scorching-fire-7518.firebaseio.com/');

class ParkingLotStore {

  constructor() {
    this.zones = [];

    db.child('zones').on('value', (snapshot) => {
      this.zones = _.values(_.mapValues(snapshot.val(), function(value, key) {
        value.name = key;
        return value;
      }));
      this.emitChange();
    });
  }

}

export default alt.createStore(ParkingLotStore);
