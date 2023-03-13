import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isRTL } from "../../i18n/i18n";
import { colors } from "../../utilities/colors";
import { api } from "../../utilities/api";
import * as Clipboard from "expo-clipboard";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SHORT_IO_API_KEY } from "@env";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";

export default function Settings({ session }) {
  const [sharedUrl, setSharedUrl] = useState(null);
  const [showClipboardAlert, setShowClipboardAlert] = useState(false);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  async function signOut() {
    const { error } = await api.auth.signOut();
  }

  async function shortLink(originalLink, pageID) {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: SHORT_IO_API_KEY,
      },
      body: JSON.stringify({
        domain: "rcho.me",
        originalURL: originalLink,
        title: "Reacho Page # " + pageID,
      }),
    };

    fetch("https://api.short.io/links", options)
      .then((response) => response.json())
      .then((response) => setSharedUrl(response.shortURL))
      .catch((err) => console.error(err));
  }

  async function getMyLink() {
    const { data, error } = await api
      .from("pages")
      .select()
      .eq("p_relatedUser", session.user.id);

    if (!error) {
      shortLink("https://pages.reacho.io/" + data[0].id, data[0].id);
    } else {
      alert(error);
    }
  }

  useEffect(() => {
    getMyLink();
  }, []);

  async function copyToClipboard() {
    await Clipboard.setStringAsync(sharedUrl);
    setShowClipboardAlert(true);

    setTimeout(() => {
      setShowClipboardAlert(false);
    }, 5000);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeadline}>
        <Text style={styles.screenHeadline.Text}>{t("Settings")}</Text>
        <TouchableOpacity
          style={styles.share}
          onPress={copyToClipboard}
          disabled={showClipboardAlert ? true : false}
        >
          <Text style={styles.share.text}>{t("SmartLinkURL")}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.itemsView}>
        <View>
          <TouchableOpacity>
            <Text style={styles.itemsView.Text}>
              {t("My Profile")}{" "}
              <Text style={{ fontSize: 14, fontFamily: "PloniBold" }}>
                {t("Coming Soon")}
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Integrations")}>
            <Text style={styles.itemsView.Text}>{t("Integrations")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://support.reacho.io/")}
          >
            <Text style={styles.itemsView.Text}>{t("Support")} </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://reacho.io/feedback/")}
          >
            <Text style={styles.itemsView.Text}>{t("Feedback")} </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text
            style={[
              styles.itemsView.Text,
              { color: colors.darkGrey, fontSize: 18 },
            ]}
          >
            {session?.user?.user_metadata.firstName +
              " " +
              session?.user?.user_metadata.lastName}
          </Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Text style={styles.itemsView.Text}>{t("Sign Out")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showClipboardAlert ? (
        <Animated.View
          style={[styles.sharePopup]}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Text style={styles.sharePopup.text}>{t("LinkCopied")}</Text>
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
    marginTop: 50,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,

    Text: { fontFamily: "PloniDemi", fontSize: 30, letterSpacing: 1 },
  },
  itemsView: {
    padding: 30,
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "column",
    Text: {
      fontFamily: "PloniMedium",
      fontSize: 20,
      paddingVertical: 10,
      textAlign:
        Platform.OS === "android"
          ? isRTL
            ? "left"
            : "right"
          : isRTL
          ? "right"
          : "left",
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
