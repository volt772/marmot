import AsyncStorage from "@react-native-async-storage/async-storage";

const STADIUM_CODE_KEY = "selectedStadiumCode";

export async function saveStadiumCode(code) {
  await AsyncStorage.setItem(STADIUM_CODE_KEY, code);
}

export async function loadStadiumCode() {
  return await AsyncStorage.getItem(STADIUM_CODE_KEY);
}

const APP_INFO_CONFIRMED_KEY = "appInfoConfirmed";

export async function saveAppInfoConfirmed() {
  await AsyncStorage.setItem(APP_INFO_CONFIRMED_KEY, "true");
}

export async function loadAppInfoConfirmed() {
  return (await AsyncStorage.getItem(APP_INFO_CONFIRMED_KEY)) === "true";
}
