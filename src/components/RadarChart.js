import React, { Component, PropTypes } from 'react';
import Svg,{ G, Polygon, Line, Text, Circle, Defs, LinearGradient, Stop} from 'react-native-svg'
type Props = {
    firstValue : {
        name: PropTypes.string,
        color: PropTypes.string,
        percentage: PropTypes.number
    },
    secondValue: {
        name: PropTypes.string,
        color: PropTypes.string,
        percentage: PropTypes.number
    },
    thirdValue: {
        name: PropTypes.string,
        color: PropTypes.string,
        percentage: PropTypes.number
    },
    fourthValue: {
        name: PropTypes.string,
        color: PropTypes.string,
        percentage: PropTypes.number
    },
    fifthValue: {
        name: PropTypes.string,
        color: PropTypes.string,
        percentage: PropTypes.number
    },
    sixthValue: {
        name: PropTypes.string,
        color: PropTypes.string,
        percentage: PropTypes.number
    },
};
export default class RadarChart extends Component<Props> {
    middleX = 200;
    middleY = 200;
    firstAngleX = 200;
    firstAngleY = 80;
    secondAngleX = 98;
    secondAngleY = 142;
    thirdAngleX = 98;
    thirdAngleY = 263;
    fourthAngleX = 201;
    fourthAngleY = 320;
    fifthAngleX = 305;
    fifthAngleY = 263;
    sixthAngleX = 305;
    sixthAngleY = 142;

    componentDidMount() {

    }

    _generatePolygonCoordinate() {
        const {firstValue, secondValue, thirdValue, fourthValue, fifthValue, sixthValue} = this.props;
        let firstPolygonAngleX = Math.round(((this.firstAngleX - this.middleX) * (firstValue.percentage/100)) * 100) / 100 + this.middleX;
        let firstPolygonAngleY = Math.round(((this.firstAngleY - this.middleY) * (firstValue.percentage/100)) * 100) / 100 + this.middleY;

        let secondPolygonAngleX = Math.round(((this.secondAngleX - this.middleX) * (secondValue.percentage/100)) * 100) / 100 + this.middleX;
        let secondPolygonAngleY = Math.round(((this.secondAngleY - this.middleY) * (secondValue.percentage/100)) * 100) / 100 + this.middleY;

        let thirdPolygonAngleX = Math.round(((this.thirdAngleX - this.middleX) * (thirdValue.percentage/100)) * 100) / 100 + this.middleX;
        let thirdPolygonAngleY = Math.round(((this.thirdAngleY - this.middleY) * (thirdValue.percentage/100)) * 100) / 100 + this.middleY;

        let fourthPolygonAngleX = Math.round(((this.fourthAngleX - this.middleX) * (fourthValue.percentage/100)) * 100) / 100 + this.middleX;
        let fourthPolygonAngleY = Math.round(((this.fourthAngleY - this.middleY) * (fourthValue.percentage/100)) * 100) / 100 + this.middleY;

        let fifthPolygonAngleX = Math.round(((this.fifthAngleX - this.middleX) * (fifthValue.percentage/100)) * 100) / 100 + this.middleX;
        let fifthPolygonAngleY = Math.round(((this.fifthAngleY - this.middleY) * (fifthValue.percentage/100)) * 100) / 100 + this.middleY;

        let sixthPolygonAngleX = Math.round(((this.sixthAngleX - this.middleX) * (sixthValue.percentage/100)) * 100) / 100 + this.middleX;
        let sixthPolygonAngleY = Math.round(((this.sixthAngleY - this.middleY) * (sixthValue.percentage/100)) * 100) / 100 + this.middleY;

        let firstCoordinate = `${firstPolygonAngleX},${firstPolygonAngleY}`;
        let secondCoordinate = `${secondPolygonAngleX},${secondPolygonAngleY}`;
        let thirdCoordinate = `${thirdPolygonAngleX},${thirdPolygonAngleY}`;
        let fourthCoordinate = `${fourthPolygonAngleX},${fourthPolygonAngleY}`;
        let fifthCoordinate = `${fifthPolygonAngleX},${fifthPolygonAngleY}`;
        let sixthCoordinate = `${sixthPolygonAngleX},${sixthPolygonAngleY}`;

        let polygonDraw = `${firstCoordinate} ${secondCoordinate} ${thirdCoordinate} ${fourthCoordinate} ${fifthCoordinate} ${sixthCoordinate}`;
        console.log("Polygon: ", polygonDraw);
        return polygonDraw;
    }

    render() {
        const {firstValue, secondValue, thirdValue, fourthValue, fifthValue, sixthValue} = this.props;
        return (
            <Svg width={400} height={400}>

                <Defs>
                    <LinearGradient id="grad_first" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={firstValue.color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={secondValue.color} stopOpacity="1" />
                    </LinearGradient>

                    <LinearGradient id="grad_second" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={secondValue.color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={thirdValue.color} stopOpacity="1" />
                    </LinearGradient>

                    <LinearGradient id="grad_third" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={thirdValue.color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={fourthValue.color} stopOpacity="1" />
                    </LinearGradient>

                    <LinearGradient id="grad_fourth" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={fourthValue.color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={fifthValue.color} stopOpacity="1" />
                    </LinearGradient>

                    <LinearGradient id="grad_fifth" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="100%" stopColor={fifthValue.color} stopOpacity="1" />
                        <Stop offset="0%" stopColor={sixthValue.color} stopOpacity="1" />
                    </LinearGradient>

                    <LinearGradient id="grad_sixth" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="100%" stopColor={sixthValue.color} stopOpacity="1" />
                        <Stop offset="0%" stopColor={firstValue.color} stopOpacity="1" />
                    </LinearGradient>



                    <LinearGradient id="grad_first_opacity" x1="0%" y1="0%" x2="75%" y2="75%">
                        <Stop offset="0%" stopColor={firstValue.color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={firstValue.color} stopOpacity="0" />
                    </LinearGradient>

                    <LinearGradient id="grad_second_opacity" x1="0%" y1="0%" x2="75%" y2="75%">
                        <Stop offset="0%" stopColor={secondValue.color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={secondValue.color} stopOpacity="0" />
                    </LinearGradient>

                    <LinearGradient id="grad_third_opacity" x1="0%" y1="0%" x2="65%" y2="65%">
                        <Stop offset="0%" stopColor={thirdValue.color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={thirdValue.color} stopOpacity="0" />
                    </LinearGradient>

                    <LinearGradient id="grad_fourth_opacity" x1="50%" y1="50%" x2="0%" y2="0%">
                        <Stop offset="0%" stopColor={fourthValue.color} stopOpacity="1" />
                        <Stop offset="60%" stopColor={fourthValue.color} stopOpacity="0" />
                    </LinearGradient>

                    <LinearGradient id="grad_fifth_opacity" x1="50%" y1="50%" x2="0%" y2="0%">
                        <Stop offset="0%" stopColor={fifthValue.color} stopOpacity="1" />
                        <Stop offset="60%" stopColor={fifthValue.color} stopOpacity="0" />
                    </LinearGradient>

                    <LinearGradient id="grad_sixth_opacity" x1="100%" y1="100%" x2="0%" y2="0%">
                        <Stop offset="0%" stopColor={sixthValue.color} stopOpacity="1" />
                        <Stop offset="65%" stopColor={sixthValue.color} stopOpacity="0" />
                    </LinearGradient>

                </Defs>

                <G>
                    <G x={199} y={70}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={firstValue.color}
                        />
                        <Text y={-10} fill={firstValue.color} textAnchor="middle">  {firstValue.name}  </Text>
                    </G>

                    <Line
                        x1="201"
                        y1="80"
                        x2="98"
                        y2="142"
                        stroke="url(#grad_first)"
                        strokeWidth="1"
                    />

                    <Line
                        x1="201"
                        y1="80"
                        x2="201"
                        y2="200"
                        stroke="url(#grad_first_opacity)"
                        strokeWidth="1"
                    />


                    <G x={90} y={140}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={secondValue.color}
                        />
                        <Text y={5} fill={secondValue.color} textAnchor="end">{` ${secondValue.name} `}</Text>
                    </G>

                    <Line
                        x1="98"
                        y1="142"
                        x2="98"
                        y2="263"
                        stroke="url(#grad_second)"
                        strokeWidth="1"
                    />

                    <Line
                        x1="98"
                        y1="142"
                        x2="201"
                        y2="200"
                        stroke="url(#grad_second_opacity)"
                        strokeWidth="1"
                    />

                    <G x={90} y={260}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={thirdValue.color}
                        />
                        <Text y={5} fill={thirdValue.color} textAnchor="end">{` ${thirdValue.name} `}</Text>
                    </G>

                    <Line
                        x1="98"
                        y1="263"
                        x2="201"
                        y2="320"
                        stroke="url(#grad_third)"
                        strokeWidth="1"
                    />

                    <Line
                        x1="98"
                        y1="263"
                        x2="201"
                        y2="200"
                        stroke="url(#grad_third_opacity)"
                        strokeWidth="1"
                    />

                    <G x={310} y={260}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={fifthValue.color}
                        />
                        <Text y={5} fill={fifthValue.color} textAnchor="start">    {fifthValue.name}  </Text>
                    </G>

                    <Line
                        x1="201"
                        y1="320"
                        x2="305"
                        y2="263"
                        stroke="url(#grad_fourth)"
                        strokeWidth="1"
                    />

                    <Line
                        x1="201"
                        y1="320"
                        x2="201"
                        y2="200"
                        stroke="url(#grad_fourth_opacity)"
                        strokeWidth="1"
                    />

                    <G x={310} y={140}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={sixthValue.color}
                        />
                        <Text y={5} fill={sixthValue.color} textAnchor="start">    {sixthValue.name}  </Text>
                    </G>

                    <Line
                        x1="305"
                        y1="263"
                        x2="305"
                        y2="142"
                        stroke="url(#grad_fifth)"
                        strokeWidth="1"
                    />

                    <Line
                        x2="201"
                        y2="200"
                        x1="305"
                        y1="263"
                        stroke="url(#grad_fifth_opacity)"
                        strokeWidth="1"
                    />

                    <G x={199} y={325}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={fourthValue.color}
                        />
                        <Text y={20} fill={fourthValue.color} textAnchor="middle">  {fourthValue.name}  </Text>
                    </G>

                    <Line
                        x1="305"
                        y1="142"
                        x2="201"
                        y2="80"
                        stroke="url(#grad_sixth)"
                        strokeWidth="1"
                    />

                    <Line
                        x2="201"
                        y2="200"
                        x1="305"
                        y1="142"
                        stroke="url(#grad_sixth_opacity)"
                        strokeWidth="1"
                    />
                    <Polygon
                        points={this._generatePolygonCoordinate()}
                        fill="#35AFFC1A"
                        stroke="#35AFFC"
                        strokeWidth="1"
                    />


                </G>
            </Svg>
        );
    }
}

