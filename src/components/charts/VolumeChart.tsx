import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';
import { CandlestickData } from '../../types';
import { colors } from '../../theme/colors';
import { formatVolume } from '../../utils/formatters';

interface VolumeChartProps {
    data: CandlestickData[];
    width?: number;
    height?: number;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({
    data,
    width = Dimensions.get('window').width - 32,
    height = 150,
}) => {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];

    const chartData = data.map(item => ({
        x: new Date(item.timestamp),
        y: item.volume,
        fill: item.close >= item.open ? theme.chart.up : theme.chart.down,
    }));

    return (
        <View style={styles.container}>
            <VictoryChart
                width={width}
                height={height}
                theme={VictoryTheme.material}
                padding={{ top: 10, bottom: 40, left: 60, right: 20 }}>
                <VictoryAxis
                    style={{
                        axis: { stroke: theme.border },
                        tickLabels: { fill: theme.textSecondary, fontSize: 10 },
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
                    tickFormat={t => formatVolume(t)}
                />
                <VictoryBar
                    data={chartData}
                    style={{
                        data: {
                            fill: ({ datum }) => datum.fill,
                            opacity: 0.7,
                        },
                    }}
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
