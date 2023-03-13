import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React, { useContext, useState } from "react";
import { Context } from "../../utilities/context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/colors";
import Logo from "../../../assets/logo.png";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function Authentication({ navigation }) {
  const appContext = useContext(Context);
  const { currentLanguage, setCurrentLanguage } = appContext;
  const [authType, setAuthType] = useState("SignIn");

  const { t, i18n } = useTranslation();

  function switchAuthType() {
    if (authType === "SignIn") {
      setAuthType("SignUp");
    } else {
      setAuthType("SignIn");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageHeader}>
        <Image source={Logo} height={30} />
      </View>
      <View style={styles.formView}>
        {authType === "SignIn" ? (
          <SignIn navigation={navigation} />
        ) : (
          <SignUp navigation={navigation} />
        )}
        <Pressable
          onPress={() => switchAuthType()}
          style={styles.authTypeButtons}
        >
          <Text style={styles.authTypeButtons.Text}>
            {authType === "SignIn"
              ? t("I don't have an account")
              : t("I have an account")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageHeader: {
    marginBottom: 90,
  },
  langToggleView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
    Buttons: {
      color: colors.darkBlack,
      marginHorizontal: 15,
      Text: {
        fontFamily: "PloniMedium",
      },
    },
  },
  formView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 300,
    width: "100%",
  },
  authTypeButtons: {
    marginTop: 10,
    color: colors.darkBlack,
    marginHorizontal: 15,
    Text: {
      fontFamily: "PloniMedium",
    },
  },
});
