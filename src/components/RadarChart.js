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
    size: PropTypes.number
};
export default class RadarChart extends Component<Props> {
    middleX = 200;
    middleY = 200;
    firstAngleX = 201;
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
    baseSize = 400;

    firstPointX = 199;
    firstPointY = 70;
    secondPointX = 90;
    secondPointY = 140;
    thirdPointX = 90;
    thirdPointY = 260;
    fourthPointX = 199;
    fourthPointY = 325;
    fifthPointX = 310;
    fifthPointY = 260;
    sixthPointX = 310;
    sixthPointY = 140;

    constructor(props) {
        super(props)
        let ratio = props.size/this.baseSize;
        this.middleX *= ratio;
        this.middleY *= ratio;

        this.firstAngleX *= ratio;
        this.firstAngleY *= ratio;
        this.secondAngleX *= ratio;
        this.secondAngleY *= ratio;
        this.thirdAngleX *= ratio;
        this.thirdAngleY *= ratio;
        this.fourthAngleX *= ratio;
        this.fourthAngleY *= ratio;
        this.fifthAngleX *= ratio;
        this.fifthAngleY *= ratio;
        this.sixthAngleX *= ratio;
        this.sixthAngleY *= ratio;

        this.firstPointX *= ratio;
        this.firstPointY *= ratio;
        this.secondPointX *= ratio;
        this.secondPointY *= ratio;
        this.thirdPointX *= ratio;
        this.thirdPointY *= ratio;
        this.fourthPointX *= ratio;
        this.fourthPointY *= ratio;
        this.fifthPointX *= ratio;
        this.fifthPointY *= ratio;
        this.sixthPointX *= ratio;
        this.sixthPointY *= ratio;

    }

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
        const {firstValue, secondValue, thirdValue, fourthValue, fifthValue, sixthValue, size} = this.props;
        return (
            <Svg width={size} height={size}>

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
                    <G x={this.firstPointX} y={this.firstPointY}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={firstValue.color}
                        />
                        <Text y={-10} fill={firstValue.color} textAnchor="middle">  {firstValue.name}  </Text>
                    </G>

                    <Line
                        x1={`${this.firstAngleX}`}
                        y1={`${this.firstAngleY}`}
                        x2={`${this.secondAngleX}`}
                        y2={`${this.secondAngleY}`}
                        stroke="url(#grad_first)"
                        strokeWidth="1"
                    />

                    <Line
                        x1={`${this.firstAngleX}`}
                        y1={`${this.firstAngleY}`}
                        x2={`${this.middleX}`}
                        y2={`${this.middleY}`}
                        stroke="url(#grad_first_opacity)"
                        strokeWidth="1"
                    />


                    <G x={this.secondPointX} y={this.secondPointY}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={secondValue.color}
                        />
                        <Text y={5} fill={secondValue.color} textAnchor="end">{` ${secondValue.name} `}</Text>
                    </G>

                    <Line
                        x1={`${this.secondAngleX}`}
                        y1={`${this.secondAngleY}`}
                        x2={`${this.thirdAngleX}`}
                        y2={`${this.thirdAngleY}`}
                        stroke="url(#grad_second)"
                        strokeWidth="1"
                    />

                    <Line
                        x1={`${this.secondAngleX}`}
                        y1={`${this.secondAngleY}`}
                        x2={`${this.middleX}`}
                        y2={`${this.middleY}`}
                        stroke="url(#grad_second_opacity)"
                        strokeWidth="1"
                    />

                    <G x={this.thirdPointX} y={this.thirdPointY}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={thirdValue.color}
                        />
                        <Text y={5} fill={thirdValue.color} textAnchor="end">{` ${thirdValue.name} `}</Text>
                    </G>

                    <Line
                        x1={`${this.thirdAngleX}`}
                        y1={`${this.thirdAngleY}`}
                        x2={`${this.fourthAngleX}`}
                        y2={`${this.fourthAngleY}`}
                        stroke="url(#grad_third)"
                        strokeWidth="1"
                    />

                    <Line
                        x1={`${this.thirdAngleX}`}
                        y1={`${this.thirdAngleY}`}
                        x2={`${this.middleX}`}
                        y2={`${this.middleY}`}
                        stroke="url(#grad_third_opacity)"
                        strokeWidth="1"
                    />

                    <G x={this.fifthPointX} y={this.fifthPointY}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={fifthValue.color}
                        />
                        <Text y={5} fill={fifthValue.color} textAnchor="start">    {fifthValue.name}  </Text>
                    </G>

                    <Line
                        x1={`${this.fourthAngleX}`}
                        y1={`${this.fourthAngleY}`}
                        x2={`${this.fifthAngleX}`}
                        y2={`${this.fifthAngleY}`}
                        stroke="url(#grad_fourth)"
                        strokeWidth="1"
                    />

                    <Line
                        x1={`${this.fourthAngleX}`}
                        y1={`${this.fourthAngleY}`}
                        x2={`${this.middleX}`}
                        y2={`${this.middleY}`}
                        stroke="url(#grad_fourth_opacity)"
                        strokeWidth="1"
                    />

                    <G x={this.sixthPointX} y={this.sixthPointY}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={sixthValue.color}
                        />
                        <Text y={5} fill={sixthValue.color} textAnchor="start">    {sixthValue.name}  </Text>
                    </G>

                    <Line
                        x1={`${this.fifthAngleX}`}
                        y1={`${this.fifthAngleY}`}
                        x2={`${this.sixthAngleX}`}
                        y2={`${this.sixthAngleY}`}
                        stroke="url(#grad_fifth)"
                        strokeWidth="1"
                    />

                    <Line
                        x2={`${this.middleX}`}
                        y2={`${this.middleY}`}
                        x1={`${this.fifthAngleX}`}
                        y1={`${this.fifthAngleY}`}
                        stroke="url(#grad_fifth_opacity)"
                        strokeWidth="1"
                    />

                    <G x={this.fourthPointX} y={this.fourthPointY}>
                        <Circle
                            cx="2"
                            cy="2"
                            r="2"
                            fill={fourthValue.color}
                        />
                        <Text y={20} fill={fourthValue.color} textAnchor="middle">  {fourthValue.name}  </Text>
                    </G>

                    <Line
                        x1={`${this.sixthAngleX}`}
                        y1={`${this.sixthAngleY}`}
                        x2={`${this.firstAngleX}`}
                        y2={`${this.firstAngleY}`}
                        stroke="url(#grad_sixth)"
                        strokeWidth="1"
                    />

                    <Line
                        x2={`${this.middleX}`}
                        y2={`${this.middleY}`}
                        x1={`${this.sixthAngleX}`}
                        y1={`${this.sixthAngleY}`}
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

