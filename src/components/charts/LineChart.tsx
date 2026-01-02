import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';
import { CandlestickData } from '../../types';
import { colors } from '../../theme/colors';
import { formatPrice } from '../../utils/formatters';

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

    return (
        <View style={styles.container}>
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
            </VictoryChart>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
});
