import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "../../theme";

// Active / inactive glyph pair per tab. "Search" composes a globe with a small
// magnifier because MaterialCommunityIcons has no `globe-with-magnifier` glyph.
const TAB_ICONS = {
  Home: { active: "home", inactive: "home-outline" },
  Search: { active: "earth", inactive: "earth", composed: true },
  MyTrips: { active: "ticket", inactive: "ticket-outline" },
  Profile: { active: "account", inactive: "account-outline" },
};

export default function TabIcon({ name, focused, size = 22 }) {
  const config = TAB_ICONS[name] || TAB_ICONS.Home;
  const color = focused ? colors.primary : colors.textSecondary;
  const glyph = focused ? config.active : config.inactive;

  if (config.composed) {
    return (
      <View style={[styles.composed, { width: size + 4, height: size + 4 }]}>
        <Icon name="earth" size={size - 3} color={color} />
        <Icon
          name="magnify"
          size={size - 9}
          color={color}
          style={styles.badge}
        />
      </View>
    );
  }

  return <Icon name={glyph} size={size} color={color} />;
}

const styles = StyleSheet.create({
  composed: { alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", right: -3, bottom: -2 },
});
