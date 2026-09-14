import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { League, stadiums } from "../../domain/constants/stadiums";

export default function StadiumSelector({ stadium, onSelect, colors }) {
  const [visible, setVisible] = useState(false);
  const [league, setLeague] = useState(stadium.league);

  const filteredStadiums = stadiums.filter((item) => item.league === league);

  const openSelector = () => {
    setLeague(stadium.league);
    setVisible(true);
  };

  const selectStadium = (item) => {
    onSelect(item);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        style={[styles.button, { borderColor: colors.content }]}
        onPress={openSelector}
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, { color: colors.content }]}>
          경기장 선택
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.title}>경기장 선택</Text>

            <View style={styles.tabs}>
              {[League.KBO, League.FUTURES].map((item) => (
                <Pressable
                  key={item}
                  style={[styles.tab, league === item && styles.selectedTab]}
                  onPress={() => setLeague(item)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: league === item }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      league === item && styles.selectedTabText,
                    ]}
                  >
                    {item === League.KBO ? "KBO" : "퓨처스"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <FlatList
              style={styles.list}
              data={filteredStadiums}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => {
                const selected = item.code === stadium.code;

                return (
                  <Pressable
                    style={[styles.stadium, selected && styles.selectedStadium]}
                    onPress={() => selectStadium(item)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={[
                        styles.stadiumName,
                        selected && styles.selectedStadiumName,
                      ]}
                    >
                      {item.signBoard}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.closeText}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    width: "88%",
    height: "70%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D141C",
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
  },
  selectedTab: {
    borderBottomColor: "#0D141C",
  },
  tabText: {
    fontSize: 16,
    color: "#757575",
  },
  selectedTabText: {
    color: "#0D141C",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  stadium: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
  },
  selectedStadium: {
    backgroundColor: "#E3F2FD",
  },
  stadiumName: {
    fontSize: 16,
    color: "#0D141C",
  },
  selectedStadiumName: {
    fontWeight: "bold",
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 12,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D141C",
  },
});
