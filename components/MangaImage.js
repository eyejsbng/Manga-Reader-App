import React from 'react';
import {
  StyleSheet,
  Text,
  View,
	TouchableOpacity,
} from 'react-native';
import { Image } from 'react-native-elements'

const ListItem = ({ item , showManga}) => {
  return (
    <View key={item.name} style={styles.item}>
			<TouchableOpacity >
				<View>
					<Image
						transition={true}
						source={{
							uri: item.thumbnail,

						}}
						style={styles.itemPhoto}
						resizeMode="cover"
						onPress={() => showManga(item)}
					/>
				</View>
				<View style={styles.subText}>
					<Text style={styles.title}>{item.name}</Text>
					<Text style={styles.chapter}>{item.latestChapter}</Text>
				</View>
     </TouchableOpacity>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
	subText: {
		marginTop: 5
	},
	itemPhoto: {
    width: 170,
    height: 200,
		borderRadius: 5,
		shadowRadius: 10,
		shadowOffset: {
			width: 2,
			height: 5
		},
  },
  title: {
    color: '#424642',
 
		width: 140,
		fontWeight: '800',
		fontSize: 13
  },
	chapter: {
		color: 'gray'
	},
	item: {
		paddingLeft:10,
		width:190,
		marginRight: -10
  },
})