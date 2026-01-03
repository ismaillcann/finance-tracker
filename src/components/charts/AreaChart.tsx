import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    useColorScheme,
    Text,
    PanResponder,
} from 'react-native';
import {
    VictoryChart,
    VictoryArea,
    VictoryAxis,
    VictoryTheme,
    VictoryScatter,
} from 'victory-native';
import { CandlestickData } from '../../types';
import { colors } from '../../theme/colors';
import { formatPrice } from '../../utils/formatters';

interface AreaChartProps {
    data: CandlestickData[];
    width?: number;
    height?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({
    data,
    width = Dimensions.get('window').width - 32,
    height = 300,
}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];
    const [activePoint, setActivePoint] = useState<any>(null);

    const chartData = data.map(item => ({
        x: new Date(item.timestamp),
        y: item.close,
    }));

    const minPrice = Math.min(...data.map(d => d.low));
    const maxPrice = Math.max(...data.map(d => d.high));

    // PanResponder for touch handling
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const touchX = evt.nativeEvent.locationX;
                findNearestPoint(touchX);
            },
            onPanResponderMove: (evt) => {
                const touchX = evt.nativeEvent.locationX;
                findNearestPoint(touchX);
            },
            onPanResponderRelease: () => {
                setActivePoint(null);
            },
        }),
    ).current;

    const findNearestPoint = (touchX: number) => {
        const padding = { left: 60, right: 20 };
        const chartWidth = width - padding.left - padding.right;
        const adjustedX = touchX - padding.left;

        if (adjustedX < 0 || adjustedX > chartWidth) {
            setActivePoint(null);
            return;
        }

        const index = Math.round((adjustedX / chartWidth) * (chartData.length - 1));
        const clampedIndex = Math.max(0, Math.min(index, chartData.length - 1));

        setActivePoint(chartData[clampedIndex]);
    };

    return (
        <View style={styles.container}>
            {activePoint && (
                <View style={[styles.tooltipContainer, { backgroundColor: theme.card }]}>
                    <Text style={[styles.tooltipPrice, { color: theme.text }]}>
                        {formatPrice(activePoint.y)}
                    </Text>
                    <Text style={[styles.tooltipDate, { color: theme.textSecondary }]}>
                        {new Date(activePoint.x).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Text>
                </View>
            )}
            <View {...panResponder.panHandlers}>
                <VictoryChart
                    width={width}
                    height={height}
                    theme={VictoryTheme.material}
                    padding={{ top: 20, bottom: 40, left: 60, right: 20 }}
                    domain={{ y: [minPrice * 0.99, maxPrice * 1.01] }}>
                    <VictoryAxis
                        style={{
                            axis: { stroke: theme.border },
                            tickLabels: { fill: theme.textSecondary, fontSize: 10 },
                            grid: { stroke: theme.border, strokeDasharray: '4,4' },
                        }}
                        tickFormat={t => {
                            const date = new Date(t);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        style={{
                            axis: { stroke: theme.border },
                            tickLabels: { fill: theme.textSecondary, fontSize: 10 },
                            grid: { stroke: theme.border, strokeDasharray: '4,4' },
                        }}
                        tickFormat={t => formatPrice(t).replace('$', '')}
                    />
                    <VictoryArea
                        data={chartData}
                        style={{
                            data: {
                                fill: theme.chart.line + '40', // 40 = 25% opacity in hex
                                stroke: theme.chart.line,
                                strokeWidth: 2,
                            },
                        }}
                        interpolation="monotoneX"
                    />
                    {activePoint && (
                        <VictoryScatter
                            data={[activePoint]}
                            size={6}
                            style={{
                                data: {
                                    fill: theme.primary,
                                    stroke: theme.background,
                                    strokeWidth: 2,
                                },
                            }}
                        />
                    )}
                </VictoryChart>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    tooltipContainer: {
        position: 'absolute',
        top: 10,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    tooltipPrice: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    tooltipDate: {
        fontSize: 12,
        marginTop: 2,
        textAlign: 'center',
    },
});
