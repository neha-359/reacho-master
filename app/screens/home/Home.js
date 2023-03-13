import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../utilities/api";
import Record from "./Record";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/colors";
import { isRTL } from "../../i18n/i18n";
import { Context } from "../../utilities/context";
import { useIsFocused } from "@react-navigation/native";



export default function Home() {
  const appContext = useContext(Context);
  const { session, expoPushToken } = appContext;
  const [records, setRecords] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused();

  const { t, i18n } = useTranslation();




  async function fetchRecords() {
    const { data, error } = await api
      .from("records")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("c_relatedUser", session.user.id);

    if (!error) {
      setRecords(data);
    } else {
      alert(error);
    }
  }

  async function comparePushTokens() {
    let { data, error } = await api
      .from("pages")
      .select()
      .eq("p_relatedUser", session.user.id);

    if (!error) {
      if (data[0].p_pushToken !== expoPushToken) {
        let { data, error } = await api
          .from("pages")
          .update({ p_pushToken: expoPushToken })
          .eq("p_relatedUser", session.user.id);
      }
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchRecords();
    }
    comparePushTokens();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeadline}>
        <Text style={styles.screenHeadline.Text}>{t("Recent Activites")}</Text>
      </View>
      <FlatList
        style={styles.recordsView}
        initialNumToRender={10}
        data={records}
        keyExtractor={(item) => item.id}
        extraData={records}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchRecords}
            tintColor={colors.darkBlue}
          />
        }
        renderItem={({ item }) => (
          <Record
            key={item.id}
            id={item.id}
            createdTime={item.created_at}
            name={item.c_name}
            phone={item.c_phone}
            status={item.c_status}
            notes={item.c_notes}
            fetchRecords={fetchRecords}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 0,
  },
  screenHeadline: {
    marginHorizontal: 30,
    paddingBottom: 10,
    display: "flex",
    flexDirection:
      Platform.OS === "android"
        ? isRTL
          ? "row"
          : "row-reverse"
        : isRTL
        ? "row-reverse"
        : "row",
    marginTop: 50,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,

    Text: { fontFamily: "PloniDemi", fontSize: 30, letterSpacing: 1 },
  },
  recordsView: {
    padding: 30,
  },
});
