import _ from 'lodash';
import $ from 'jquery';
import alt from '../alt';

// const baseAPIUrl = 'http://localhost:8080';
const baseAPIUrl = 'https://enigmatic-brushlands-35263.herokuapp.com';

class ParkingZoneActions {

  filterParkingHistory(searchParams) {
    $.ajax({
      method: 'GET',
      url: `${baseAPIUrl}/api/parking/history`,
      data: searchParams
    })
    .done(this.filterParkingHistorySuccess.bind(this))
    .fail(function() {
      console.error('Error at filtering parking history action.')
    });
    return true;
  }


  filterParkingHistorySuccess(parkingHistory) {
    return parkingHistory;
  }

}


export default alt.createActions(ParkingZoneActions);
