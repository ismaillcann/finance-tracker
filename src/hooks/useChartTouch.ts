import { useRef, useState } from 'react';
import { PanResponder } from 'react-native';

interface UseChartTouchOptions {
    data: any[];
    width: number;
    paddingLeft?: number;
    paddingRight?: number;
}

interface UseChartTouchReturn {
    activePoint: any | null;
    panResponder: any;
}

/**
 * Custom hook for handling touch interactions on charts
 * Provides PanResponder logic for detecting touch position and finding nearest data point
 * 
 * @param options - Configuration options
 * @param options.data - Chart data array
 * @param options.width - Chart width in pixels
 * @param options.paddingLeft - Left padding (default: 60)
 * @param options.paddingRight - Right padding (default: 20)
 * @returns Object containing activePoint and panResponder
 */
export const useChartTouch = ({
    data,
    width,
    paddingLeft = 60,
    paddingRight = 20,
}: UseChartTouchOptions): UseChartTouchReturn => {
    const [activePoint, setActivePoint] = useState<any>(null);

    const findNearestPoint = (touchX: number) => {
        const chartWidth = width - paddingLeft - paddingRight;
        const adjustedX = touchX - paddingLeft;

        if (adjustedX < 0 || adjustedX > chartWidth) {
            setActivePoint(null);
            return;
        }

        const index = Math.round((adjustedX / chartWidth) * (data.length - 1));
        const clampedIndex = Math.max(0, Math.min(index, data.length - 1));

        setActivePoint(data[clampedIndex]);
    };

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

    return {
        activePoint,
        panResponder,
    };
};
