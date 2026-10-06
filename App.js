import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TripProvider } from "./src/context/TripContext";
import { ProfileProvider } from "./src/context/ProfileContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { useInterFonts } from "./src/components/AppText";
import { initDatabase } from "./src/services/db";

// Open the offline database (tickethub.db) exactly once at startup, before
// any screen queries it. Tables are created and seeded on first launch.
try {
  initDatabase();
} catch (error) {
  Alert.alert(
    "Database error",
    `Could not open the local database: ${error?.message ?? error}`
  );
}

export default function App() {
  const fontsLoaded = useInterFonts();

  // Hold the first frame until Inter is registered so nothing flashes the
  // platform fallback font.
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TripProvider>
        <ProfileProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </ProfileProvider>
      </TripProvider>
    </SafeAreaProvider>
  );
}
