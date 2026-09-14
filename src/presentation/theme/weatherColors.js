export const defaultWeatherColors = {
  background: "#FFFFFF", // MgWhite
  content: "#0D141C", // MgDarkBlue
  secondary: "#0D141C", // MgDarkBlue
};

const weatherColors = {
  Thunderstorm: {
    background: "#1A237E", // AxIndigo900
    content: "#FBC02D", // AxYellow700
    secondary: "#303F9F", // AxIndigo700
  },
  Drizzle: {
    background: "#607D8B", // AxBlueGray500
    content: "#FFFFFF", // AxWhite
    secondary: "#90CAF9", // AxBlue200
  },
  Rain: {
    background: "#1E293B", // AxSlate800
    content: "#BAE6FD", // AxSky200
    secondary: "#2196F3", // AxBlue500
  },
  Snow: {
    background: "#E3F2FD", // AxBlue50
    content: "#1E293B", // AxSlate800
    secondary: "#7DD3FC", // AxSky300
  },
  Atmosphere: {
    background: "#BDBDBD", // AxGray400
    content: "#FAFAFA", // AxGray50
    secondary: "#E0E0E0", // AxGray300
  },
  Clear: {
    background: "#7DD3FC", // AxSky300
    content: "#FFFFFF", // AxWhite
    secondary: "#00BCD4", // AxCyan500
  },
  Clouds: {
    background: "#E0E0E0", // AxGray300
    content: "#1E293B", // AxSlate800
    secondary: "#F5F5F5", // AxGray100
  },
};

export function getWeatherColors(weatherId) {
  // 날씨 데이터가 없으면 기본 색상 사용
  if (weatherId == null) {
    return defaultWeatherColors;
  }

  const group = Math.floor(weatherId / 100);
  const remainder = weatherId % 100;

  switch (group) {
    case 2:
      return weatherColors.Thunderstorm;
    case 3:
      return weatherColors.Drizzle;
    case 5:
      return weatherColors.Rain;
    case 6:
      return weatherColors.Snow;
    case 7:
      return weatherColors.Atmosphere;
    case 8:
      if (remainder > 2) {
        return weatherColors.Clouds;
      }
      return weatherColors.Clear;
    default:
      return weatherColors.Clear;
  }
}
