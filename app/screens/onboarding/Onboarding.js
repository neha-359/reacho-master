import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRTL } from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/colors";
import LottieView from "lottie-react-native";
import OnboardingLottie from "../../../assets/onboarding.json";
import OnbooardingAndroid from "../../../assets/onboardingAndroid.png";

export default function Onboarding({ navigation, session }) {
  const { t } = useTranslation();
  const animation = useRef(null);

  const setCompleted = async () => {
    try {
      await AsyncStorage.setItem("firstTime", "false");
    } catch (err) {
      console.log(err);
    }
  };

  const completeOnboarding = async () => {
    setCompleted();
    const result = await AsyncStorage.getItem("firstTime");
    console.log(result);
    navigation.navigate("TabsView");
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "android" ? (
        <Image
          source={OnbooardingAndroid}
          style={{ width: 400, height: 400 }}
        />
      ) : (
        <LottieView
          autoPlay
          ref={animation}
          source={OnboardingLottie}
          style={{ width: 600, marginTop: 30, marginBottom: 30 }}
          loop={false}
        />
      )}
      <Text style={styles.onboarding.Text}>{t("Onboarding")}</Text>

      <TouchableOpacity
        onPress={completeOnboarding}
        style={styles.onboarding.Button}
      >
        <Text style={styles.onboarding.Button.Text}>{t("Start Now")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 40,
  },
  onboarding: {
    Text: {
      paddingHorizontal: 30,
      fontSize: 16,
      fontFamily: "PloniMedium",
      textAlign:
        Platform.OS === "android"
          ? isRTL
            ? "left"
            : "right"
          : isRTL
          ? "right"
          : "left",
      flex: 1,
    },
    Button: {
      borderRadius: 8,
      backgroundColor: colors.lightGrey,
      padding: 10,
      Text: {
        fontSize: 16,
        fontFamily: "PloniMedium",
      },
    },
  },
  share: {
    backgroundColor: colors.darkBlue,
    padding: 10,
    borderRadius: 8,

    text: {
      fontFamily: "PloniMedium",
      fontSize: 14,
      color: colors.allWhite,
    },
  },
  sharePopup: {
    position: "absolute",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    top: 500,
    paddingHorizontal: 30,
    backgroundColor: "#C0F788",
    text: {
      fontFamily: "PloniMedium",
      textAlign: "center",
      fontSize: 16,
      color: colors.darkBlack,
    },
  },
});
