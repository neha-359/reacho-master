import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";
import { isRTL } from "../../i18n/i18n";
import { colors } from "../../utilities/colors";
import { useTranslation } from "react-i18next";
import { Context } from "../../utilities/context";
import * as Clipboard from "expo-clipboard";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";

export default function Integrations() {
  const appContext = useContext(Context);
  const { session, expoPushToken } = appContext;
  const [showClipboardAlert, setShowClipboardAlert] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  async function copyToClipboard() {
    await Clipboard.setStringAsync(session?.user?.id);
    setShowClipboardAlert(true);

    setTimeout(() => {
      setShowClipboardAlert(false);
    }, 5000);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.goBack}>
        <Pressable onPress={() => navigation.navigate("Settings")}>
          <Text style={styles.goBack.Text}>{t("Go Back")}</Text>
        </Pressable>
      </View>
      <View style={styles.screenHeadline}>
        <Text style={styles.screenHeadline.Text}>{t("Integrations")}</Text>
      </View>
      <View style={styles.itemsView}>
        <View style={styles.keyView}>
          <Text style={styles.keyView.Text}>{session?.user?.id}</Text>
          <Pressable
            style={styles.keyView.Button}
            onPress={() => copyToClipboard()}
          >
            <Text style={styles.keyView.Button.Text}>{t("CopyKey")}</Text>
          </Pressable>
        </View>
        <View style={{ marginTop: 20 }}>
          <Pressable
            onPress={() =>
              Linking.openURL(
                "https://support.reacho.io/article/11-documentation"
              )
            }
          >
            <Text style={styles.itemsView.Text}>{t("DocsLink")}</Text>
          </Pressable>
        </View>
      </View>
      {showClipboardAlert ? (
        <Animated.View
          style={[styles.sharePopup]}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Text style={styles.sharePopup.text}>{t("APICopied")}</Text>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 0,
  },
  screenHeadline: {
    display: "flex",
    flexDirection:
      Platform.OS === "android"
        ? isRTL
          ? "row"
          : "row-reverse"
        : isRTL
        ? "row-reverse"
        : "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    paddingBottom: 10,
    alignItems: isRTL ? "flex-end" : "flex-start",
    marginTop: 5,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,

    Text: { fontFamily: "PloniDemi", fontSize: 30, letterSpacing: 1 },
  },
  itemsView: {
    padding: 30,
    flex: 1,
    flexDirection: "column",
    Text: {
      fontFamily: "PloniMedium",
      fontSize: 20,
      paddingVertical: 10,
      textAlign: "center",
    },
  },
  goBack: {
    display: "flex",
    flexDirection:
      Platform.OS === "android"
        ? isRTL
          ? "row"
          : "row-reverse"
        : isRTL
        ? "row-reverse"
        : "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    paddingBottom: 10,
    alignItems: isRTL ? "flex-end" : "flex-start",
    marginTop: 50,

    Text: { fontFamily: "PloniDemi", fontSize: 14, letterSpacing: 1 },
  },
  keyView: {
    display: "flex",
    flexDirection:
      Platform.OS === "android"
        ? isRTL
          ? "row"
          : "row-reverse"
        : isRTL
        ? "row-reverse"
        : "row",
    justifyContent: "space-between",
    alignItems: "center",
    Text: {
      fontFamily: "PloniMedium",
      fontSize: 12,
      borderWidth: 1,
      borderColor: colors.lightGrey,
      padding: 10,
      borderRadius: 8,
    },
    Button: {
      padding: 10,
      backgroundColor: colors.darkBlue,
      borderRadius: 8,
      Text: {
        fontFamily: "PloniMedium",
        color: "#FFF",
        fontSize: 14,
      },
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
