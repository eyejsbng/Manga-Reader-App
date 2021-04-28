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
    <View style={styles.item}>
			<TouchableOpacity >
				<View style={{width:160, borderRadius:6}}>
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
					<Text numberOfLines={2} style={styles.title}>{item.name}</Text>
					<Text style={styles.chapter}>{item.latestChapter}</Text>
				</View>
     </TouchableOpacity>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
	subText: {
		position: 'absolute',
		bottom:0,
		marginTop: 5,
		opacity: 0.7,
		backgroundColor: 'black',
		height:50,
		width:160,
		paddingLeft:5
	},
	itemPhoto: {
    width: 160,
    height: 200,
		borderRadius:6,
	
  },
  title: {
		fontFamily:'nunito-regular',
    color: '#fff',
		width: 140,
		fontSize: 13,
		
  },
	chapter: {
		fontFamily:'nunito-regular',
		color: '#fff',
		fontSize: 11,
		bottom: 0
	},
	item: {
	
		paddingLeft:10,
		width:190,
		marginRight: 0
		
  },
})