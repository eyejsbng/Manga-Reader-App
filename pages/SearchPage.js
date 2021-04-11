import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
	Alert,
	TouchableOpacity,
	ActivityIndicator,
	TextInput,
} from 'react-native';
import { Header,Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import MangaImage from '../components/MangaImage';
function backButton() {
	const navigation = useNavigation()
	return (
		<TouchableOpacity >
			<Icon name="arrow-back-outline" type="ionicon" color="#364547" onPress={() => navigation.goBack()} />
		</TouchableOpacity>
	)
}

function searchButton() {
	return (
		<TouchableOpacity >
			<Icon name="search" color="#364547" onPress={() => console.log('hello')} />
		</TouchableOpacity>
	) 
}

class SearchPage extends React.Component {

	state = {
		manga: [],
		keyword: '',
		loading: false,
	}
	alert(msg) {
		Alert.alert('Message', msg)
	}
	fetchData(keyword) {
		this.setState({loading: true})
		axios.get('https://warm-refuge-03594.herokuapp.com/api/manga/search/' + keyword).then((resp) => {
			const data = resp.data;
			this.setState({manga:data});
			this.setState({loading: false})
		}).catch((err) => {
			alert(err)
		})
	}
	render() {
		const { keyword , loading} = this.state

		if(loading) {
				return (
					<View>
						<ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999" />
					</View>
				)
		}
		return (
			<View>
				<Header statusBarProps={{ barStyle: 'dark-content', backgroundColor: '#fff'}}
						containerStyle={{
						backgroundColor: '#fff',
						borderBottomColor: '#dddddd'
					}} leftComponent={backButton}
					centerComponent={
					<TextInput style={{width:220, fontSize: 15}} value={keyword} placeholder="Search ..."
						onChangeText={keyword => this.setState({keyword: keyword})}
						onSubmitEditing={() => {this.fetchData(keyword)}}
					/>} rightComponent={searchButton}
				></Header>
				
				{ this.state.manga != ''
				
				? <FlatList data={this.state.manga.data} renderItem={({item}) => {
					<MangaImage item={item} showManga={() => {
						const url = showManga(item);
						this.props.navigation.push('Manga', {
								title: item.name,
								name: url,
								
						})
					}} 
					/>
				}} keyExtractor={(item, index) => index.toString()} />
				
				: 
					<View style={styles.title}> 
						<View>
						<ActivityIndicator animating={true} size="large" style={{opacity:1}} color="#999999" />
					</View>
						
					</View>
					
				}
			
			</View>
		)
	}
}

export default SearchPage;

const styles = StyleSheet.create({
	title: {
		top: 100,
		justifyContent:'center', 
		alignItems:'center', 
		flex:1
	}
})