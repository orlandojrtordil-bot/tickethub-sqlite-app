import { useState } from "react";
import { Image, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { Icon } from "../components/Icon";
import ScreenStatusBar from "../components/ScreenStatusBar";
import { colors, radii, spacing } from "../../theme";
import { useProfile } from "../context/ProfileContext";

const STATS = [
  { value: "18", label: "Trips Taken" },
  { value: "3", label: "Upcoming" },
  { value: "2", label: "Passports" },
];

const MENU = [
  { icon: "account-details", label: "Personal Details", screen: "EditProfile" },
  { icon: "credit-card", label: "Payment Methods", badge: "1 Card" },
  { icon: "account-group", label: "Saved Travelers", badge: "2 Travelers" },
];

// Frame 07 — Profile.
export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { profile, initials } = useProfile();

  return (
    <View style={styles.container}>
      <ScreenStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity accessibilityLabel="Menu">
          <Icon name="menu" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <AppText style={styles.logo}>TicketHub</AppText>
        <TouchableOpacity
          accessibilityLabel="Edit profile"
          accessibilityRole="button"
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Icon name="account-circle" size={26} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Identity card */}
        <LinearGradient
          colors={["#DCEBF7", "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.avatarWrap}>
            <TouchableOpacity
              style={styles.avatar}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("EditProfile")}
              accessibilityRole="button"
              accessibilityLabel="Edit profile photo"
            >
              {profile.photoUri ? (
                <Image
                  source={{ uri: profile.photoUri }}
                  style={styles.avatarImage}
                />
              ) : (
                <AppText weight="700" style={styles.avatarText}>
                  {initials}
                </AppText>
              )}
            </TouchableOpacity>
            <View style={styles.verifiedBadge}>
              <Icon name="check" size={13} color={colors.white} />
            </View>
          </View>

          <AppText weight="700" style={styles.name}>
            {profile.fullName}
          </AppText>
          <AppText style={styles.email}>{profile.email}</AppText>

          <View style={styles.memberPill}>
            <Icon name="star" size={14} color={colors.primary} />
            <AppText weight="600" style={styles.memberText}>
              TicketHub Silver Member • 14,250 Miles
            </AppText>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.statsRow}>
            {STATS.map((stat, index) => (
              <View key={stat.label} style={styles.statCell}>
                {index > 0 ? <View style={styles.statDivider} /> : null}
                <AppText weight="700" style={styles.statValue}>
                  {stat.value}
                </AppText>
                <AppText style={styles.statLabel}>{stat.label}</AppText>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Account rows */}
        <View style={styles.menuCard}>
          {MENU.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuRow,
                index < MENU.length - 1 && styles.menuRowBorder,
              ]}
              activeOpacity={0.7}
              onPress={
                item.screen
                  ? () => navigation.navigate(item.screen)
                  : undefined
              }
              accessibilityRole={item.screen ? "button" : undefined}
            >
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={18} />
              </View>
              <AppText weight="600" style={styles.menuLabel}>
                {item.label}
              </AppText>
              {item.badge ? (
                <View style={styles.menuBadge}>
                  <AppText style={styles.menuBadgeText}>{item.badge}</AppText>
                </View>
              ) : null}
              <Icon
                name="chevron-right"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings rows */}
        <View style={styles.menuCard}>
          <View style={[styles.menuRow, styles.menuRowBorder]}>
            <View style={styles.menuIcon}>
              <Icon name="bell-outline" size={18} />
            </View>
            <AppText weight="600" style={styles.menuLabel}>
              Notifications
            </AppText>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            activeOpacity={0.7}
          >
            <View style={styles.menuIcon}>
              <Icon name="help-circle" size={18} />
            </View>
            <AppText weight="600" style={styles.menuLabel}>
              Help &amp; Support
            </AppText>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={styles.menuIcon}>
              <Icon name="logout" size={18} color={colors.error} />
            </View>
            <AppText weight="600" style={[styles.menuLabel, styles.logoutText]}>
              Log Out
            </AppText>
            <AppText style={styles.version}>v2.4.1</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F6F8",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: { fontSize: 20, fontWeight: "700", color: colors.primary },

  content: { flex: 1 },
  contentContainer: { padding: spacing.md, paddingBottom: spacing.lg },

  // Identity card
  profileCard: {
    borderRadius: radii.xxl,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  avatarWrap: { position: "relative", marginBottom: spacing.md },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: 84, height: 84, borderRadius: 42 },
  avatarText: { fontSize: 30, color: colors.white },
  verifiedBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 20, color: colors.textPrimary },
  email: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  memberPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.accentPale,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    marginTop: spacing.md,
  },
  memberText: { fontSize: 12, color: colors.primary },
  cardDivider: {
    alignSelf: "stretch",
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.lg,
  },

  statsRow: { flexDirection: "row", alignSelf: "stretch", marginTop: spacing.md },
  statCell: { flex: 1, alignItems: "center" },
  statDivider: {
    position: "absolute",
    left: 0,
    top: 4,
    bottom: 4,
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: { fontSize: 20, color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  // Menu cards
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm + 2,
    backgroundColor: colors.iconTile,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 15, color: colors.textPrimary },
  menuBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  menuBadgeText: { fontSize: 11, color: colors.textSecondary },
  logoutText: { color: colors.error },
  version: { fontSize: 12, color: colors.textMuted },
});
