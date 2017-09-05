import React, { Component } from 'react';
import TrendChart from './TrendChart';
import {getRandomNumber} from './utils';

class App extends Component {
  render() {
    return (
      <TrendChart
        values={[...new Array(50)].map(() => getRandomNumber(80, 0))}
      />
    );
  }
}

export default App;
