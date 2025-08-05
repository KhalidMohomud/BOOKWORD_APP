import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "./components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { userAuth } from "../store/authstore";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, authcheck, token } = userAuth();

  const [isReady, setIsReady] = useState(false);

  // Run auth check once when the app starts
  useEffect(() => {
    const init = async () => {
      authcheck();
      setIsReady(true); // mark as ready after authcheck
    };
    init();
  }, []);

  // Only navigate after authcheck is done
  useEffect(() => {
    if (!isReady) return;

    const isAuthScreen = segments[0] === "(auth)";
    const isSignedIn = !!user && !!token;

    if (!isAuthScreen && !isSignedIn) {
      router.replace("/(auth)");
    } else if (isAuthScreen && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isReady, segments, user, token]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
        <StatusBar style="dark" />
      </SafeScreen>
    </SafeAreaProvider>
  );
}
