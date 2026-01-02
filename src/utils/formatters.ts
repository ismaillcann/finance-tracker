export const formatCurrency = (
    value: number,
    currency: string = 'USD',
    decimals: number = 2,
): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};

export const formatPercent = (value: number, decimals: number = 2): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
};

export const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) {
        return `${(value / 1e12).toFixed(2)}T`;
    }
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)}M`;
    }
    if (value >= 1e3) {
        return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toFixed(2);
};

export const formatPrice = (price: number): string => {
    if (price >= 1000) {
        return formatCurrency(price, 'USD', 0);
    }
    if (price >= 1) {
        return formatCurrency(price, 'USD', 2);
    }
    if (price >= 0.01) {
        return formatCurrency(price, 'USD', 4);
    }
    return formatCurrency(price, 'USD', 6);
};

export const formatVolume = (volume: number): string => {
    return formatLargeNumber(volume);
};
