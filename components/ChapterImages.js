import React from "react";
import { View, Dimensions } from "react-native";
import AutoHeightImage from "react-native-auto-height-image";

const deviceWidth = Dimensions.get("window").width;
const ListItem = ({ item }) => {
  return (
    <View style={{ marginTop: 0 }}>
      <AutoHeightImage width={deviceWidth} source={{ uri: item }} />
    </View>
  );
};

export default ListItem;
