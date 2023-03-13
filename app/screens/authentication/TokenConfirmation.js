import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/colors";
import { api, verifySession } from "../../utilities/api";
import { Context } from "../../utilities/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TokenConfirmation({ navigation, route }) {
  const appContext = useContext(Context);
  const { session, setSession } = appContext;
  const { t, i18n } = useTranslation();
  const [activity, setActivity] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const isRTL = i18n.dir() === "rtl" ? true : false;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: route.params.phoneNumber,
      token: "",
    },
  });
  const onSubmit = (data) => verifyOtp(data.phoneNumber, data.token);

  async function checkForFirstTimeLoad() {
    const result = await AsyncStorage.getItem("firstTime");
    if (result === null) {
      setIsFirstTime(true);
    }
  }

  async function verifyOtp(phoneNumber, token) {
    setActivity(true);

    let internationalPhoneNumber = "+972" + phoneNumber;

    let { session, error } = await api.auth.verifyOtp({
      phone: internationalPhoneNumber,
      token: token,
      type: "sms",
    });

    if (!error) {
      verifySession(setSession);
      setActivity(false);
      if (isFirstTime) {
        navigation.navigate("Onboarding");
      } else {
        navigation.navigate("TabsView");
      }
    } else {
      alert(error);
      setActivity(false);
    }
  }

  useEffect(() => {
    checkForFirstTimeLoad();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formView}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              textAlign={isRTL ? "right" : "left"}
              style={styles.formInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t("Verification Code")}
            />
          )}
          name="token"
        />
        {errors.token && (
          <Text style={styles.error}>{t("OTP Token is required")}</Text>
        )}

        <View style={{ height: 10 }} />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.formButton,
            activity ? styles.formButton.Active : null,
          ]}
          disabled={activity ? true : false}
        >
          <Text style={styles.formButton.Title}>{t("Verify")}</Text>
        </TouchableOpacity>
        {activity ? (
          <ActivityIndicator
            color={colors.darkBlue}
            style={{ marginVertical: 10 }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 30,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 300,
    width: "100%",
  },
  formInput: {
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
    height: 35,
    borderColor: colors.lightGrey,
    paddingHorizontal: 15,
    color: colors.darkBlack,
    fontFamily: "PloniMedium",
  },
  formButton: {
    backgroundColor: colors.darkBlue,
    color: colors.allWhite,
    width: "100%",
    height: 35,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    Active: {
      opacity: 0.2,
    },
    Title: {
      color: colors.allWhite,
      fontFamily: "PloniBold",
    },
  },
  error: {
    color: colors.darkBlack,
    fontFamily: "PloniDemi",
  },
});
