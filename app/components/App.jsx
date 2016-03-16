import _ from 'lodash';
import React from 'react';
import ParkingLotDashboard from './ParkingLotDashboard.jsx';
import EntryScreen from './EntryScreen.jsx';

const styles = {
  default: {
    marginTop: 50,
    marginBottom: 100
  }
};

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="ui container" style={_.extend({}, styles.default, this.props.style)}>
        { componentType === 'DASHBOARD' ?
          <ParkingLotDashboard /> :
          <EntryScreen /> }
      </div>
    );
  }

}
