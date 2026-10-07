import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TripProvider } from "./src/context/TripContext";
import { ProfileProvider } from "./src/context/ProfileContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { useInterFonts } from "./src/components/AppText";
import { db, initDatabase } from "./src/services/db";

// Open the offline database (tickethub.db) exactly once at startup, before
// any screen queries it. Tables are created and seeded on first launch.
try {
  // A database created by an earlier schema is missing duration_min, which
  // CREATE TABLE IF NOT EXISTS will not add. Rebuild only the flights table
  // in that case so initDatabase() can reseed the Lab 05 flights; the
  // bookings table shape is unchanged, so existing bookings survive.
  const flightColumns = db.getAllSync(
    "SELECT name FROM pragma_table_info('flights');"
  );
  const isLegacySchema =
    flightColumns.length > 0 &&
    !flightColumns.some((column) => column.name === "duration_min");
  if (isLegacySchema) {
    db.execSync("DROP TABLE flights;");
  }

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
