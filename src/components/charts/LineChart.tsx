import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    useColorScheme,
    Text,
} from 'react-native';
import {
    VictoryChart,
    VictoryLine,
    VictoryAxis,
    VictoryTheme,
    VictoryScatter,
} from 'victory-native';
import { CandlestickData } from '../../types';
import { colors } from '../../theme/colors';
import { formatPrice } from '../../utils/formatters';
import { useChartTouch } from '../../hooks/useChartTouch';

interface LineChartProps {
    data: CandlestickData[];
    width?: number;
    height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
    data,
    width = Dimensions.get('window').width - 32,
    height = 300,
}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    const chartData = data.map(item => ({
        x: new Date(item.timestamp),
        y: item.close,
    }));

    const minPrice = Math.min(...data.map(d => d.low));
    const maxPrice = Math.max(...data.map(d => d.high));

    const { activePoint, panResponder } = useChartTouch({
        data: chartData,
        width,
    });

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
                    <VictoryLine
                        data={chartData}
                        style={{
                            data: {
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
