import _ from 'lodash';
import alt from '../alt.js';
import Firebase from 'firebase';

const db = new Firebase('https://scorching-fire-7518.firebaseio.com/');

class ParkingLotStore {

  constructor() {
    this.zones = [];
    this.places = {};
    this.suggestedZone = null;
    this.chartData = [];

    db.on('value', (snapshot) => {
      const data = snapshot.val();
      this.zones = _.map(_.toPairs(data.zones), function(pair) {
        pair[1].id = pair[0];
        return pair[1];
      });
      this.places = data.places;
      this.suggestedZone = _.find(this.zones, {id: data.suggestedZone});
      this.chartData = _.map(this.zones, function(z) {
        return [
        ];
      });

      console.log(this.chartData);
      this.emitChange();
    });

  }

}

export default alt.createStore(ParkingLotStore);
