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
    VictoryArea,
    VictoryAxis,
    VictoryTheme,
    VictoryScatter,
    VictoryZoomContainer,
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
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const chartData = data.map(item => ({
        x: new Date(item.timestamp),
        y: item.close,
    }));

    const minPrice = Math.min(...data.map(d => d.low));
    const maxPrice = Math.max(...data.map(d => d.high));

    // Determine color based on trend
    const startPrice = chartData[0]?.y || 0;
    const endPrice = chartData[chartData.length - 1]?.y || 0;
    const isUp = endPrice >= startPrice;
    const chartColor = isUp ? theme.chart.up : theme.chart.down;

    return (
        <View style={styles.container}>
            <VictoryChart
                width={width}
                height={height}
                theme={VictoryTheme.material}
                padding={{ top: 20, bottom: 40, left: 60, right: 20 }}
                domain={{ y: [minPrice * 0.99, maxPrice * 1.01] }}
                containerComponent={
                    <VictoryZoomContainer
                        zoomDimension="x"
                        zoomDomain={{ x: [chartData[Math.floor(chartData.length * 0.75)].x, chartData[chartData.length - 1].x] }}
                    />
                }>
                <VictoryAxis
                    style={{
                        axis: { stroke: 'transparent' },
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
                        axis: { stroke: 'transparent' },
                        tickLabels: { fill: theme.textSecondary, fontSize: 10 },
                        grid: { stroke: theme.border, strokeDasharray: '4,4' },
                    }}
                    tickFormat={t => formatPrice(t).replace('$', '')}
                />
                <VictoryArea
                    data={chartData}
                    style={{
                        data: {
                            fill: chartColor,
                            fillOpacity: 0.2,
                            stroke: chartColor,
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
