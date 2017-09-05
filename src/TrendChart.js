import React from 'react';
import Tooltip from './Tooltip';

class TrendChart extends React.Component {

  static defaultProps = {
    height: 250,
    width: 1000,
    marginTop: 20,
    marginSides: 20,
    marginBottom: 40,
  }

  constructor(props) {
    super(props);
    const {values, height, width, marginTop, marginBottom, marginSides} = this.props;

    const sortedValues = values.slice().sort(this.sortValues);
    this.sortedValues = sortedValues;

    const maxY = sortedValues[0];
    const minY = sortedValues.slice(-1).pop();

    this.weightY = (height - (marginTop + marginBottom)) / (maxY - minY);
    this.weightX = (width - marginSides * 2) / values.length;

    this.points = values.map((value, id, values) => {
      const pointCenter = this.getXCoord(id);
      const pointLeftX = pointCenter - this.weightX / 2;
      const pointRightX = pointCenter + this.weightX / 2;

      return {
        score: `$ ${value}`,
        letfX: pointLeftX,
        x: pointCenter,
        rightX: pointRightX,
        y: this.getYCoord(value),
        trend: value - values[id-1]
      }
    })

    this.state = {
      tooltipDataPoint: null
    };
  }

  getYCoord(value) {
    const {props: {height, marginTop}, weightY} = this;
    return height - (weightY * value + marginTop);
  }

  getXCoord(id) {
    return (this.props.marginSides * 2 + this.weightX * id);
  }

  getCoordPair = (point, id) => {
    return `${this.getXCoord(id)} ${this.getYCoord(point)} `;
  }

  sortValues(v1, v2) {
    return v2 - v1;
  }

  calcChartLeftOffset() {
    const {ref} = this;
    if (ref) {
      this.leftOffset = ref.getBoundingClientRect().left;
    }
  }

  findDataPoint() {
    
  }

  chooseDisplayedPoint = ({clientX}) => {
    const {leftOffset, points, weightX} = this;
    const xCoordChartRelative = clientX - leftOffset;

    let displayedPointId = Math.floor(xCoordChartRelative / weightX);
    if (Number.isFinite(displayedPointId) && (displayedPointId >= 0 && displayedPointId < points.length)) {
      const {leftX, rightX} = points[displayedPointId];
      
      if (xCoordChartRelative < leftX) {
        displayedPointId -= 1;
      } else if (xCoordChartRelative > rightX) {
        displayedPointId += 1;
      }

      this.setState({tooltipDataPoint: displayedPointId});
    }
  };

  hideToolTip = () => {
    this.setState({tooltipDataPoint: null});
  }

  renderTrendLine() {
    const {values} = this.props;

    const pathDefinition = values.map(this.getCoordPair).join(' L ');

    return <path ref={ref => this.path = ref} d={`M ${pathDefinition}`} stroke="#B1CBDE" strokeWidth="2" fill="none"/>
  }

  renderTooltip() {
    const {props: {values, height}, points} = this;
    let {tooltipDataPoint} = this.state;
    if (!tooltipDataPoint) return null;

    if (!values[tooltipDataPoint]) {
      if (tooltipDataPoint > values.length) {
        tooltipDataPoint -= 1;
      } else {
        tooltipDataPoint += 1;
      }
    }

    const {x, y} = points[tooltipDataPoint];

    return (
      <g key="chart-parts">
        <circle cx={x} cy={y} r="3" stroke="#B1CBDE" fill="#B1CBDE"/>
        <line strokeDasharray="5, 5" x1={x} y1={y} x2={x} y2={height} stroke="#ddd"/>
      </g>
    )
  }

  componentDidMount() {
    this.calcChartLeftOffset();
  }

  render() {
    const {width, height} = this.props;
    const {tooltipDataPoint} = this.state;

    const {points} = this;
    const datatPoint = points[tooltipDataPoint];

    return (
      <div className="chart-container">
        <svg className="chart" onMouseMove={this.chooseDisplayedPoint} onMouseOut={this.hideToolTip} ref={ref => this.ref = ref} style={{width, height}}>
          {this.renderTrendLine()}
          {this.renderTooltip()}
        </svg>
        {tooltipDataPoint ? <Tooltip {...datatPoint} x={this.leftOffset + datatPoint.x}/> : null}
      </div>
    );
  }
}

export default TrendChart;