import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { isRTL } from "../../i18n/i18n";
import { colors } from "../../utilities/colors";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { api } from "../../utilities/api";
import TrashIcon from "../../../assets/trash.png";

export default function RecordView() {
  const [activity, setActivity] = useState(false);
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      notes: "",
    },
  });
  const onSubmit = (data) => updateNotes(data.notes);

  async function updateNotes(note) {
    const { error } = await api
      .from("records")
      .update({ c_notes: note })
      .eq("id", route.params.recordData.id);

    if (!error) {
      navigation.navigate("Home");
    }
  }

  async function deleteNotes() {
    const { error } = await api
      .from("records")
      .update({ c_notes: null })
      .eq("id", route.params.recordData.id);

    if (!error) {
      navigation.navigate("Home");
    }
  }

  async function deleteRecord() {
    const { error } = await api
      .from("records")
      .delete()
      .eq("id", route.params.recordData.id);

    if (!error) {
      navigation.navigate("Home");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.goBack}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.goBack.Text}>{t("Go Back")}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.screenHeadline}>
        <Text style={styles.screenHeadline.Text}>
          {route.params.recordData.name}
        </Text>

        <TouchableOpacity style={styles.Delete} onPress={() => deleteRecord()}>
          <Image source={TrashIcon} style={{ width: 14, height: 17 }} />
        </TouchableOpacity>

        <Text
          style={[
            styles.Status,
            { backgroundColor: route.params.recordData.statusColor },
          ]}
        >
          {route.params.recordData.status}
        </Text>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.itemsView}>
          {route.params.recordData.notes ? (
            <Text style={styles.Note}>{route.params.recordData.notes}</Text>
          ) : (
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  textAlign={isRTL ? "right" : "left"}
                  style={[styles.formInput]}
                  multiline={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder={t("Notes")}
                />
              )}
              name="notes"
            />
          )}
          {errors.notes && (
            <Text style={styles.error}>{t("Field is required")}</Text>
          )}

          {route.params.recordData.notes ? (
            <TouchableOpacity
              onPress={() => deleteNotes()}
              style={[
                styles.formButton,
                activity ? styles.formButton.Active : null,
              ]}
              disabled={activity ? true : false}
            >
              <Text style={styles.formButton.Title}>{t("Delete Notes")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={[
                styles.formButton,
                activity ? styles.formButton.Active : null,
              ]}
              disabled={activity ? true : false}
            >
              <Text style={styles.formButton.Title}>{t("Submit Notes")}</Text>
            </TouchableOpacity>
          )}
          {activity ? (
            <ActivityIndicator
              color={colors.darkBlue}
              style={{ marginVertical: 10 }}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 0,
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
  Status: {
    fontFamily: "PloniDemi",
    textTransform: "uppercase",
    padding: 10,
    width: 82,
    textAlign: "center",
  },

  Delete: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 40,
    textAlign: "center",
    backgroundColor: "#FFCBCB",
  },
  Note: {
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
  formInput: {
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
    height: 150,
    borderColor: colors.lightGrey,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: colors.darkBlack,
    fontFamily: "PloniMedium",
    textAlignVertical: "top",
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
