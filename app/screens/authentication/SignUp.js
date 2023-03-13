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
import { api } from "../../utilities/api";
import { Context } from "../../utilities/context";

export default function SignUp({ navigation }) {
  const { t, i18n } = useTranslation();
  const [responseData, setResponseData] = useState(null);
  const [activity, setActivity] = useState(false);
  const appContext = useContext(Context);
  const { expoPushToken } = appContext;

  const isRTL = i18n.dir() === "rtl" ? true : false;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      email: "",
    },
  });
  const onSubmit = (data) =>
    signUpAndGetToken(
      data.phoneNumber,
      data.email,
      data.firstName,
      data.lastName
    );

  async function registerOnboardingMailing(firstName, lastName, email, phone) {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        phoneNumber: phone,
        firstName: firstName,
        lastName: lastName,
      }),
    };

    fetch("https://hook.eu1.make.com/rnkocxzvhu4xtpg60pssswrqeiklp7pk", options)
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }

  async function signUpAndGetToken(phoneNumber, email, firstName, lastName) {
    setActivity(true);
    let internationalPhoneNumber = "+972" + phoneNumber;

    let { data, user, error } = await api.auth.signUp({
      phone: internationalPhoneNumber,
      password: Math.random().toString(36).slice(2),
      options: {
        data: {
          firstName: firstName,
          lastName: lastName,
        },
      },
    });

    if (!error) {
      registerOnboardingMailing(firstName, lastName, email, phoneNumber);
      setResponseData(data.user?.phone);
      createUserPage(data.user?.id);
      setActivity(false);
      navigation.navigate("TokenConfirmation", {
        phoneNumber: phoneNumber,
        type: "SignUp",
      });
    } else {
      alert(error);
      setActivity(false);
    }
  }

  async function createUserPage(newUserID) {
    const { error } = await api
      .from("pages")
      .insert({ p_relatedUser: newUserID, p_pushToken: expoPushToken });
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
            placeholder={t("First Name")}
          />
        )}
        name="firstName"
      />
      {errors.firstName && (
        <Text style={styles.error}>{t("Field is required")}</Text>
      )}

      <View style={{ height: 10 }} />
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
            placeholder={t("Last Name")}
          />
        )}
        name="lastName"
      />
      {errors.lastName && (
        <Text style={styles.error}>{t("Field is required")}</Text>
      )}

      <View style={{ height: 10 }} />

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
            placeholder={t("Email")}
          />
        )}
        name="email"
      />
      {errors.email && (
        <Text style={styles.error}>{t("Email is required")}</Text>
      )}

      <View style={{ height: 10 }} />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={[styles.formButton, activity ? styles.formButton.Active : null]}
        disabled={activity ? true : false}
      >
        <Text style={styles.formButton.Title}>{t("Sign Up")}</Text>
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
