import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import customFonts from "./app/utilities/fonts";
import { api, verifySession } from "./app/utilities/api";
import Authentication from "./app/screens/authentication/Authentication";
import TokenConfirmation from "./app/screens/authentication/TokenConfirmation";
import Home from "./app/screens/home/Home";
import { Context } from "./app/utilities/context";
import i18n from "./app/i18n/i18n";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeIcon from "./app/icons/HomeIcon";
import AnalyticsIcon from "./app/icons/AnalyticsIcon";
import { colors } from "./app/utilities/colors";
import SettingsIcon from "./app/icons/SettingsIcon";
import Settings from "./app/screens/settings/Settings";
import Analytics from "./app/screens/analytics/Analytics";
import Onboarding from "./app/screens/onboarding/Onboarding";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecordView from "./app/screens/record/RecordView";
import Integrations from "./app/screens/integrations/Integrations";


export default function App() {
  const [session, setSession] = useState();
  const [fontsLoaded] = useFonts(customFonts);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();





  useEffect(() => {
    verifySession(setSession);

    api.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const InitTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#FFF",
    },
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  function TabsView() {
    return (
      <Context.Provider
        value={{
          currentLanguage,
          setCurrentLanguage,
          session,
          setSession,
          expoPushToken,
        }}
      >
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: colors.darkBlue,
            tabBarInactiveTintColor: colors.darkGrey,
            tabBarStyle: {
              borderTopWidth: 0,
            },
          }}
          r
        >
          <Tab.Screen
            name="Home"
            options={{
              tabBarIcon: ({ color }) => <HomeIcon name="home" color={color} />,
            }}
          >
            {(props) => <Home session={session} />}
          </Tab.Screen>
          <Tab.Screen
            name="Analytics"
            options={{
              tabBarIcon: ({ color }) => (
                <AnalyticsIcon name="analytics" color={color} />
              ),
            }}
          >
            {(props) => <Analytics session={session} />}
          </Tab.Screen>
          <Tab.Screen
            name="Settings"
            options={{
              tabBarIcon: ({ color }) => (
                <SettingsIcon name="settings" color={color} />
              ),
            }}
          >
            {(props) => <Settings session={session} />}
          </Tab.Screen>
        </Tab.Navigator>
      </Context.Provider>
    );
  }

  return (
    <Context.Provider
      value={{
        currentLanguage,
        setCurrentLanguage,
        session,
        setSession,
        expoPushToken,
      }}
    >
      <NavigationContainer theme={InitTheme}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={session ? "TabsView" : "Auth"}
        >
          <Stack.Screen
            name="Auth"
            component={Authentication}
            pushToken={expoPushToken}
          />
          <Stack.Screen
            name="TokenConfirmation"
            component={TokenConfirmation}
          />
          <Stack.Screen name="RecordView" component={RecordView} />
          <Stack.Screen name="TabsView" component={TabsView} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Integrations" component={Integrations} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}
