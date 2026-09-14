import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import appConfig from "../../../app.json";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AppInfoScreen({ onBack }) {
  const appVersion = appConfig.expo.version;

  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 130,
      useNativeDriver: true,
    }).start();
  }, [translateX]);

  const handleBack = () => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onBack();
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
          >
            <Svg width={28} height={28} viewBox="0 0 24 24">
              <Path
                d="M15 18L9 12L15 6"
                fill="none"
                stroke="#071722"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>

          <Text style={styles.title}>앱정보</Text>

          <View style={styles.topBarSpace} />
        </View>

        <View style={styles.content}>
          <View style={styles.logoArea}>
            <Image
              source={require("../../../assets/icon_marmot.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.versionCard}>
            <Text style={styles.versionLabel}>앱버전</Text>
            <Text style={styles.version}>v{appVersion}</Text>
          </View>

          <Text style={styles.description}>
            본 서비스는{"\n"}
            OpenWeather(www.openweathermap.org)의 API를{"\n"}
            통해 제공되는 정보를 활용하고 있습니다.
          </Text>

          {__DEV__ && <Text style={styles.checking}>Checking</Text>}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    height: 56,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    color: "#071722",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  topBarSpace: {
    width: 56,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
  },
  logoArea: {
    height: 390,
    justifyContent: "center",
    alignItems: "center",
  },

  versionCard: {
    height: 56,
    borderRadius: 8,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  versionLabel: {
    fontSize: 16,
    color: "#333333",
  },
  version: {
    fontSize: 16,
    color: "#333333",
  },
  description: {
    marginTop: 24,
    color: "#999999",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  checking: {
    marginTop: "auto",
    marginBottom: 30,
    color: "#333333",
    fontSize: 16,
    textAlign: "center",
  },
  logo: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
  },
});
