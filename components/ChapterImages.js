import React from 'react';
import {
  StyleSheet,
  View,
	ScrollView,
	ActivityIndicator,
	Image
} from 'react-native';


const ListItem = ({ item }) => {
  return (
	
      <Image
        source={{
          uri: item,

        }}
        style={styles.itemPhoto}
				resizeMode="cover"
				PlaceholderContent={<ActivityIndicator/>}
      />


  );
};

export default ListItem;

const styles = StyleSheet.create({
	itemPhoto: {
    width: '100%',
    height: 700,
		marginTop: 'auto',
  },
})