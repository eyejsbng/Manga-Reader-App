import React from 'react';
import {View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios'; 
import { FlatList } from 'react-native-gesture-handler';

function Chapter({item, selectChapter}) {
	return(
		<View>
			<TouchableOpacity style={{
				backgroundColor: '#1b1717', width:60 ,height:30,margin:10, alignItems:'center',
				justifyContent:'center', borderRadius: 5
				}} onPress={selectChapter}>
				<Text style={{color:'#fff'}}>{item.chapter}</Text>
			</TouchableOpacity>
		</View>
		
	
	)
}
class Manga extends React.Component {

	state = {
		manga: [],
		loading:true,
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		const {name} = this.props.route.params;

		axios.get('https://warm-refuge-03594.herokuapp.com/api/manga/'+ name).then(data => {
			this.setState({ manga: data.data, loading:false})
		}).catch(err => {
			console.error(err)
		})
	}

	render() {
		const { manga, loading } = this.state;
		if(!loading) {
			return (
				<View >
					<ScrollView style={{margin:10}}>
						<View style={{ marginTop: 10,marginLeft:20}}>
							<Image style={styles.thumbnail} fadeDuration={400}
							source={{
								uri: manga.thumbnail,
			
							}}
							resizeMode="cover"
						
							/>
							<Text>{manga.author.trim(" ,")}</Text>
						</View>
				<View>
					<Text style={{ textAlign: 'justify'}}>{manga.description.trim(" ")}</Text>
				</View>
				<View>
					<Text style={{fontWeight:'700', fontSize: 20}}>Chapters</Text>		
				</View>	
				<View style={{ flex: 1,flexDirection: 'row', flexWrap: 'wrap' , alignItems:'center', justifyContent: 'center',}}>
					{
						manga.chapters.map((d) => {
							return (
							
								<Chapter item={d} selectChapter={() => {
								
									const link = d.link;
									let chapter = link.split('/');
									let chapterNumber = chapter[chapter.length - 1];

									this.props.navigation.push('Chapter', {
											chapter: chapterNumber
									})
								}} keyExtractor={(item, index) => index.toString()}/>
							)
						})
					}
					</View>
					</ScrollView>
				</View>
		
			)
		} else {
			return (
				<View style={styles.title}>
					<ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999" />
				</View>
			)
		}
	
	}
}

const styles = StyleSheet.create({
	thumbnail: {
		height:200,
		width:170
	},
	title: {
		justifyContent:'center', 
		alignItems:'center', 
		flex:1
	}
})
export default Manga;