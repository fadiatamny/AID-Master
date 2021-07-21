export const shortifyString = (s: string, length = 15) => {
    if (s) {
        if (s.length >= length) {
            return s.substring(0, length) + '...'
        }
        return s
    }
    return ''
}

export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height
    }
}

export enum SupportedDevices {
    DESKTOP = 'desktop',
    TABLET = 'tablet'
}

export const checkDevice = (device: SupportedDevices) => {
    const { width, height } = getWindowDimensions()
    switch (device) {
        case SupportedDevices.DESKTOP:
            return width >= 1024 && height >= 720
        case SupportedDevices.TABLET:
            return width <= 1024 && height <= 720 && width >= 960 && height >= 600
    }
}

export const BLEACH_PUBLIC_URI = process.env.REACT_APP_BLEACH_PUBLIC_URI ?? 'http://79.136.30.122:8080'
