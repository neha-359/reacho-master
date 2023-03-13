import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/colors";
import { api, verifySession } from "../../utilities/api";
import { Context } from "../../utilities/context";

export default function SignIn({ navigation }) {
  const appContext = useContext(Context);
  const { session, setSession } = appContext;
  const { t, i18n } = useTranslation();
  const [activity, setActivity] = useState(false);

  const isRTL = i18n.dir() === "rtl" ? true : false;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });
  const onSubmit = (data) =>
    data.phoneNumber === "0505005050"
      ? signInTest(data.phoneNumber)
      : signIn(data.phoneNumber);

  async function signIn(phoneNumber) {
    let internationalPhoneNumber = "+972" + phoneNumber;
    setActivity(true);

    let { data, error } = await api.auth.signInWithOtp({
      phone: internationalPhoneNumber,
      options: {
        shouldCreateUser: false,
      },
    });

    if (!error) {
      setActivity(false);
      navigation.navigate("TokenConfirmation", {
        phoneNumber: phoneNumber,
        type: "SignIn",
      });
    } else {
      alert(error);
      setActivity(false);
    }
  }

  async function signInTest(phoneNumber) {
    let internationalPhoneNumber = "+972" + phoneNumber;
    setActivity(true);

    let { data, error } = await api.auth.signInWithPassword({
      phone: internationalPhoneNumber,
      password: "testerStuff",
    });

    if (!error) {
      verifySession(setSession);
      setActivity(false);
      navigation.navigate("TabsView");
    } else {
      alert(error);
      setActivity(false);
    }
  }

  return (
    <>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            textAlign={isRTL ? "right" : "left"}
            style={[styles.formInput]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={t("Phone Number")}
          />
        )}
        name="phoneNumber"
      />
      {errors.phoneNumber && (
        <Text style={styles.error}>{t("Phone number is required")}</Text>
      )}

      <View style={{ height: 10 }} />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={[styles.formButton, activity ? styles.formButton.Active : null]}
        disabled={activity ? true : false}
      >
        <Text style={styles.formButton.Title}>{t("Sign In")}</Text>
      </TouchableOpacity>
      {activity ? (
        <ActivityIndicator
          color={colors.darkBlue}
          style={{ marginVertical: 10 }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
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
