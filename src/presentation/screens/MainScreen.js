import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  loadAppInfoConfirmed,
  loadStadiumCode,
  saveAppInfoConfirmed,
  saveStadiumCode,
} from "../../data/local/preferenceStorage";
import { getStadium } from "../../domain/constants/stadiums";
import AppInfoDialog from "../components/AppInfoDialog";
import CurrentWeather from "../components/CurrentWeather";
import ForecastWeather from "../components/ForecastWeather";
import MyTopBar from "../components/MyTopBar";
import StadiumSelector from "../components/StadiumSelector";
import useWeather from "../hooks/useWeather";
import { getWeatherColors } from "../theme/weatherColors";
import AppInfoScreen from "./AppInfoScreen";

// 상단 안전 영역(status bar/노치) 아래에서 TopBar까지의 간격.
const TOP_BAR_GAP = 8;

export default function MainScreen({ getWeather }) {
  const [stadium, setStadium] = useState(null);
  const [showAppInfoDialog, setShowAppInfoDialog] = useState(false);
  const [showAppInfoScreen, setShowAppInfoScreen] = useState(false);

  const { data, loading, refreshing, error, refresh } = useWeather(
    stadium,
    getWeather,
  );

  const colors = getWeatherColors(data?.currentWeather?.weatherId);

  useEffect(() => {
    let active = true;

    const restoreStadium = async () => {
      let restoredStadium = getStadium("SOJ");

      try {
        const code = await loadStadiumCode();
        const savedStadium = getStadium(code);

        if (savedStadium.code !== "NAN") {
          restoredStadium = savedStadium;
        }
      } catch {
        if (active) {
          Alert.alert(
            "경기장 불러오기 실패",
            "저장된 경기장을 불러오지 못해 잠실로 시작합니다.",
          );
        }
      }

      if (active) {
        setStadium(restoredStadium);
      }
    };

    restoreStadium();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const restoreAppInfoConfirmed = async () => {
      try {
        const confirmed = await loadAppInfoConfirmed();
        console.log("confirmed : ", confirmed);
        if (active) {
          setShowAppInfoDialog(!confirmed);
        }
      } catch (error) {
        console.log("confirmed (catch): ", error);
        if (active) {
          setShowAppInfoDialog(true);
        }
      }
    };

    restoreAppInfoConfirmed();

    return () => {
      active = false;
    };
  }, []);

  const confirmAppInfo = async () => {
    try {
      await saveAppInfoConfirmed();
      setShowAppInfoDialog(false);
    } catch {
      Alert.alert(
        "확인 상태 저장 실패",
        "확인 상태를 저장하지 못했습니다. 다시 눌러 주세요.",
      );
    }
  };

  const selectStadium = (item) => {
    setStadium(item);

    saveStadiumCode(item.code).catch(() => {
      Alert.alert(
        "경기장 저장 실패",
        "선택한 경기장을 저장하지 못했습니다. 다시 선택해 주세요.",
      );
    });
  };

  if (showAppInfoScreen) {
    return <AppInfoScreen onBack={() => setShowAppInfoScreen(false)} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />

      <SafeAreaView edges={["top", "left", "right"]} style={styles.header}>
        <MyTopBar
          onInfoClick={() => setShowAppInfoScreen(true)}
          colors={colors}
        />
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            enabled={stadium !== null && !loading}
            tintColor={colors.content}
            colors={[colors.content]}
            progressBackgroundColor={colors.background}
          />
        }
      >
        {stadium === null || loading ? (
          <View style={styles.message}>
            <ActivityIndicator size="large" color={colors.content} />

            <Text style={[styles.messageText, { color: colors.content }]}>
              {stadium === null
                ? "선택한 경기장을 불러오는 중입니다."
                : `${stadium.signBoard} 날씨를 불러오는 중입니다.`}
            </Text>
          </View>
        ) : (
          <>
            {data && (
              <>
                <CurrentWeather
                  weather={data.currentWeather}
                  stadiumName={stadium.signBoard}
                  colors={colors}
                />

                <ForecastWeather forecast={data.forecast} colors={colors} />
              </>
            )}

            {data?.warning && (
              <Text style={[styles.notice, { color: colors.content }]}>
                {data.warning}
              </Text>
            )}

            {data?.isStale && (
              <Text style={[styles.notice, { color: colors.content }]}>
                저장 기준: {new Date(data.updatedAt).toLocaleString()}
              </Text>
            )}

            {error && (
              <View style={styles.message}>
                <Text style={[styles.notice, { color: colors.content }]}>
                  {error}
                </Text>

                <Pressable
                  style={[styles.retryButton, { borderColor: colors.content }]}
                  onPress={refresh}
                  accessibilityRole="button"
                >
                  <Text style={[styles.retryText, { color: colors.content }]}>
                    다시 시도
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}

        {stadium !== null && (
          <StadiumSelector
            stadium={stadium}
            onSelect={selectStadium}
            colors={colors}
          />
        )}
      </ScrollView>

      <AppInfoDialog visible={showAppInfoDialog} onConfirm={confirmAppInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: TOP_BAR_GAP,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 8,
    paddingVertical: 48,
  },
  message: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  messageText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  notice: {
    paddingHorizontal: 24,
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
