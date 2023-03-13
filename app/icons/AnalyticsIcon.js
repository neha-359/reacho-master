import { View, Text } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

export default function AnalyticsIcon({ color }) {
  return (
    <Svg
      id="pie-chart"
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
    >
      <Path
        id="Path_26"
        data-name="Path 26"
        d="M21.289,13.232H11.768V3.711a.732.732,0,0,0-.732-.732A11.011,11.011,0,1,0,22.021,13.965.732.732,0,0,0,21.289,13.232Zm-10.254,10.3A9.545,9.545,0,0,1,10.3,4.471v9.494a.732.732,0,0,0,.732.732h9.494A9.554,9.554,0,0,1,11.035,23.535ZM13.965,0a.732.732,0,0,0-.732.732v10.3a.732.732,0,0,0,.732.732h10.3A.732.732,0,0,0,25,11.035,11.063,11.063,0,0,0,13.965,0ZM14.7,10.3V1.493a9.586,9.586,0,0,1,8.81,8.81Zm5.127-4.395h-2.93a.732.732,0,0,0,0,1.465h2.93a.732.732,0,0,0,0-1.465Z"
        fill={color}
      />
    </Svg>
  );
}
