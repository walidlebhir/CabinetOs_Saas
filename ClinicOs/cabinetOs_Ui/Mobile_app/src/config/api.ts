import { Platform } from 'react-native';

const DEV_ANDROID_EMULATOR = 'http://192.168.89.137:8080';
const DEV_LOCAL = 'http://localhost:8080';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android'
    ? DEV_ANDROID_EMULATOR
    : DEV_LOCAL);
