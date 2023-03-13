import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { isRTL } from "../../i18n/i18n";
import { colors } from "../../utilities/colors";
import { api } from "../../utilities/api";

export default function Analytics({ session }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activity, setActivity] = useState(false);
  const { t, i18n } = useTranslation();

  async function fetchRecordsByUser() {
    setActivity(true);
    const { data, error } = await api
      .from("records")
      .select()
      .eq("c_relatedUser", session.user.id);

    if (!error) {
      setActivity(false);
      setAnalyticsData(data);
    }
  }

  useEffect(() => {
    fetchRecordsByUser();
  }, []);

  const QueuedRecords = analyticsData?.filter(
    (record) => record.c_status === "queued"
  );
  const ReachedRecords = analyticsData?.filter(
    (record) => record.c_status === "reached"
  );
  const NotAvailableRecords = analyticsData?.filter(
    (record) => record.c_status === "na"
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeadline}>
        <Text style={styles.screenHeadline.Text}>{t("Analytics")}</Text>
      </View>
      <View style={styles.itemsView}>
        <View style={styles.itemsView.Row}>
          <Text style={[styles.itemsView.Row.Total, styles.itemsView.Row.text]}>
            {t("TotalRecords")}{" "}
          </Text>
          {activity ? (
            <ActivityIndicator
              color={colors.darkBlue}
              style={{ marginVertical: 10 }}
            />
          ) : (
            <Text style={styles.itemsView.Row.text}>
              {analyticsData?.length}
            </Text>
          )}
        </View>

        <View style={styles.itemsView.Row}>
          <Text
            style={[styles.itemsView.Row.Reached, styles.itemsView.Row.text]}
          >
            {t("ReachedRecords")}
          </Text>
          {activity ? (
            <ActivityIndicator
              color={colors.darkBlue}
              style={{ marginVertical: 10 }}
            />
          ) : (
            <Text style={styles.itemsView.Row.text}>
              {ReachedRecords?.length}
            </Text>
          )}
        </View>

        <View style={styles.itemsView.Row}>
          <Text
            style={[styles.itemsView.Row.Queued, styles.itemsView.Row.text]}
          >
            {t("QueuedRecords")}{" "}
          </Text>
          {activity ? (
            <ActivityIndicator
              color={colors.darkBlue}
              style={{ marginVertical: 10 }}
            />
          ) : (
            <Text style={styles.itemsView.Row.text}>
              {QueuedRecords?.length}
            </Text>
          )}
        </View>

        <View style={styles.itemsView.Row}>
          <Text
            style={[
              styles.itemsView.Row.NotAvailable,
              styles.itemsView.Row.text,
            ]}
          >
            {t("NotAvailableRecords")}
          </Text>
          {activity ? (
            <ActivityIndicator
              color={colors.darkBlue}
              style={{ marginVertical: 10 }}
            />
          ) : (
            <Text style={styles.itemsView.Row.text}>
              {NotAvailableRecords?.length}
            </Text>
          )}
        </View>
      </View>
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
  itemsView: {
    padding: 30,
    flex: 1,
    flexDirection: "column",
    Row: {
      display: "flex",
      flexDirection:
        Platform.OS === "android"
          ? isRTL
            ? "row"
            : "row-reverse"
          : isRTL
          ? "row-reverse"
          : "row",
      alignItems: isRTL ? "flex-end" : "flex-start",
      justifyContent: "space-between",
      paddingBottom: 15,
      text: {
        fontFamily: "PloniMedium",
        fontSize: 16,
        paddingVertical: 10,
      },
      Reached: {
        backgroundColor: "#C0F788",
        padding: 10,
      },
      Queued: {
        backgroundColor: "#FFAAAA",
        padding: 10,
      },
      NotAvailable: {
        backgroundColor: "#FFE8AA",
        padding: 10,
      },
      Total: {
        backgroundColor: colors.darkBlue,
        padding: 10,
      },
    },
  },
});
