import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { colors } from "../../utilities/colors";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { api } from "../../utilities/api";
import { isRTL } from "../../i18n/i18n";
import * as Linking from "expo-linking";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

export default function Record({
  id,
  createdTime,
  name,
  phone,
  status,
  notes,
  fetchRecords,
}) {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  async function changeStatus(newStatus) {
    const { data, error } = await api
      .from("records")
      .update({ c_status: newStatus })
      .eq("id", id);

    if (!error) {
      swipeableRef.current.close();
      fetchRecords();
    }
  }

  const swipeableRef = useRef(null);

  const statusResponse = () => {
    if (status === "queued") {
      return t("Queued");
    }
    if (status === "na") {
      return t("N/A");
    }
    if (status === "reached") {
      return t("Reached");
    }
  };

  const statusColors = () => {
    if (status === "queued") {
      return "#FFAAAA";
    }
    if (status === "na") {
      return "#FFE8AA";
    }
    if (status === "reached") {
      return "#D5FFAA";
    }
  };

  const swipeQueuedAction = () => {
    return (
      <Pressable onPress={() => changeStatus("queued")}>
        <Text
          style={[
            styles.contactDetails.Status,
            {
              backgroundColor: "#FFAAAA",
            },
          ]}
        >
          {t("Queued")}
        </Text>
      </Pressable>
    );
  };

  const swipeNAAction = () => {
    return (
      <Pressable onPress={() => changeStatus("na")}>
        <Text
          style={[
            styles.contactDetails.Status,
            {
              backgroundColor: "#FFE8AA",
            },
          ]}
        >
          {t("N/A")}
        </Text>
      </Pressable>
    );
  };

  const swipeReachedAction = () => {
    return (
      <Pressable onPress={() => changeStatus("reached")}>
        <Text
          style={[
            styles.contactDetails.Status,
            {
              backgroundColor: "#D5FFAA",
            },
          ]}
        >
          {t("Reached")}
        </Text>
      </Pressable>
    );
  };

  const checkCurrentStatusAndReturnProperActions = () => {
    if (status === "queued") {
      return [swipeReachedAction(), swipeNAAction()];
    }
    if (status === "na") {
      return [swipeReachedAction(), swipeQueuedAction()];
    }
    if (status === "reached") {
      return [swipeNAAction(), swipeQueuedAction()];
    }
  };

  const rightSideActions = () => {
    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingVertical: 20,
        }}
      >
        {checkCurrentStatusAndReturnProperActions()}
      </View>
    );
  };

  const leftSideActions = () => {
    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingVertical: 20,
        }}
      >
        <Pressable
          onPress={() => Linking.openURL(`tel:${phone}`).catch(console.error)}
        >
          <Text
            style={[
              styles.contactDetails.Status,
              {
                backgroundColor: colors.darkBlue,
              },
            ]}
          >
            {t("Call")}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={isRTL ? leftSideActions : rightSideActions}
        renderLeftActions={isRTL ? rightSideActions : leftSideActions}
        ref={swipeableRef}
        friction={2}
        leftThreshold={40}
        rightThreshold={40}
        containerStyle={{
          opacity: dayjs(createdTime).isBefore(dayjs().subtract(14, "days"))
            ? 0.5
            : 1,
        }}
      >
        <View style={[styles.row]} key={id}>
          <TouchableOpacity
            style={{ width: "40%" }}
            onPress={() =>
              navigation.navigate("RecordView", {
                recordData: {
                  id: id,
                  status: statusResponse(),
                  name: name,
                  phone: phone,
                  notes: notes,
                  statusColor: statusColors(),
                },
              })
            }
          >
            <View>
              <Text style={styles.contactDetails.FullName}>
                {name ? name : "No Name"}
              </Text>
              <Text style={styles.contactDetails.PhoneNumber}>{phone}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.contactDetails.DateTime}>
            {dayjs(createdTime).format("DD/MM/YYYY")}
          </Text>
          <View>
            <Text
              style={[
                styles.contactDetails.Status,
                {
                  backgroundColor: statusColors(),
                },
              ]}
            >
              {statusResponse()}
            </Text>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
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
    paddingVertical: 20,
    backgroundColor: "#FFF",
  },
  contactDetails: {
    FullName: {
      fontFamily: "PloniMedium",
      fontSize: 14,
      color: colors.darkGrey,
      textAlign:
        Platform.OS === "android"
          ? isRTL
            ? "left"
            : "right"
          : isRTL
          ? "right"
          : "left",
    },
    PhoneNumber: {
      fontFamily: "PloniMedium",
      fontSize: 18,
      color: colors.darkBlack,
      textAlign:
        Platform.OS === "android"
          ? isRTL
            ? "left"
            : "right"
          : isRTL
          ? "right"
          : "left",
    },
    DateTime: {
      fontFamily: "PloniMedium",
      fontSize: 14,
      color: colors.darkBlack,
      width: "30%",
      padding: 10,
      textAlign:
        Platform.OS === "android"
          ? isRTL
            ? "left"
            : "right"
          : isRTL
          ? "right"
          : "left",
    },
    Status: {
      fontFamily: "PloniDemi",
      textTransform: "uppercase",
      padding: 10,
      width: 82,
      textAlign: "center",
    },
  },
});
