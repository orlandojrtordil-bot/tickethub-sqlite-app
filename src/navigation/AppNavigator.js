import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import TabIcon from "../components/TabIcon";
import { colors, radii, spacing } from "../../theme";
import BookingConfirmedScreen from "../screens/BookingConfirmedScreen";
import BookTripScreen from "../screens/BookTripScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import MyTripsScreen from "../screens/MyTripsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Figma labels (route names themselves stay space-free to keep navigation
// calls unambiguous).
const TAB_LABELS = {
  Home: "Home",
  Search: "Search",
  MyTrips: "My Trips",
  Profile: "Profile",
};

// 80px tab bar: white, hairline top border. The focused tab gets a light-blue
// rounded pill wrapping an outline icon + label, exactly like the prototype.
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = TAB_LABELS[route.name] || route.name;

        const handlePress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canGoBack: false,
          });
          if (event.defaultPrevented) return;

          // "Search" is a full-screen stack route (Select Trip) that sits
          // above the tabs, so it navigates on the parent stack instead of
          // switching the tab.
          if (route.name === "Search") {
            navigation.navigate("BookTrip");
            return;
          }

          if (!focused) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={handlePress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
          >
            <View style={[styles.pill, focused && styles.pillActive]}>
              <TabIcon name={route.name} focused={focused} size={22} />
              <AppText
                variant="labelSmall"
                weight={focused ? "700" : "500"}
                style={[styles.label, focused && styles.labelActive]}
              >
                {label}
              </AppText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tabItem: { flex: 1, alignItems: "center" },
  pill: {
    minWidth: 74,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.lg,
  },
  pillActive: { backgroundColor: colors.accentLight },
  label: { marginTop: 2, color: colors.textSecondary },
  labelActive: { color: colors.primary },
});

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={BookTripScreen} />
      <Tab.Screen name="MyTrips" component={MyTripsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="BookTrip" component={BookTripScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen
          name="BookingConfirmed"
          component={BookingConfirmedScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
