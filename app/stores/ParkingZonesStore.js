import _ from 'lodash';
import alt from '../alt.js';
import Firebase from 'firebase';

const db = new Firebase('https://scorching-fire-7518.firebaseio.com/');

class ParkingLotStore {

  constructor() {
    this.zones = [];
    this.suggestedZone = null;

    db.on('value', (snapshot) => {
      const data = snapshot.val();
      this.zones = _.map(_.toPairs(data.zones), function(pair) {
        pair[1].id = pair[0];
        return pair[1];
      });
      this.suggestedZone = _.find(this.zones, {id: data.suggestedZone});
      this.emitChange();
    });
  }

}

export default alt.createStore(ParkingLotStore);
