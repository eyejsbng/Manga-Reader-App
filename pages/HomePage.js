import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native' 
import { Header } from 'react-native-elements'
import { Icon } from 'react-native-elements';
import MangaImage from '../components/MangaImage';
import axios from 'axios'

const Search = ()=> {
	const navigation = useNavigation()
	return (
		<TouchableOpacity >
		<Icon name="search" color="#364547" onPress={() => 
			navigation.push('Search')
		}></Icon>
		</TouchableOpacity>
	)
}

const showManga = (item) => {
	const link = item.link;
	let res = link.split('/');
	res = res[res.length - 1];
	return res;
}

class HomePage extends React.Component {
	
	state = {
		mangaList: [],
		latestManga: [],
		loading: true,
	}
	componentDidMount() {
		this.fetchData()
	}

	fetchData() {
		let reqOne = 'https://warm-refuge-03594.herokuapp.com/api/manga/top';
		let reqTwo = 'https://warm-refuge-03594.herokuapp.com/api/manga/latest';
		const requestOne = axios.get(reqOne);
		const requestTwo = axios.get(reqTwo);

		axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
			const respOne = responses[0]
			const respTwo = responses[1]

			this.setState({mangaList: respOne.data, latestManga: respTwo.data, loading:false})

		})).catch(err => {
			console.log(err)
		})
		// axios.get('https://warm-refuge-03594.herokuapp.com/api/manga/top').then(data => {
	
		// 	this.setState({ mangaList: data.data})
		// 	console.log(this.state.mangaList)
		// }).catch(err => {
		// 	Alert.alert(JSON.stringify(err))
		// })

		// axios.get('https://warm-refuge-03594.herokuapp.com/api/manga/latest').then(data => {
	
		// 	this.setState({ latestManga: data.data})
			
		// }).catch(err => {
		// 	Alert.alert(JSON.stringify(err))
		// })
	}
	render() {	
		const {loading } = this.state
		if (!loading) {
			return (	
				
				<View style={styles.container}>
					
					<Header statusBarProps={{ barStyle: 'dark-content', backgroundColor: '#fff'}}
						containerStyle={{
						backgroundColor: '#fff',
						borderBottomColor: '#dddddd'
		

					}} centerComponent={{ text:'Discover', style:{ fontSize: 20, color:'#364547'}}}
						rightComponent={Search} 
				></Header>

					<Text style={styles.sectionHeader}>Hot Manga</Text>
			
						<FlatList style={{ height:100}} horizontal data={this.state.mangaList.data} 
						renderItem={({item, index}) =>
						<MangaImage item={item} showManga={() => {
							const url = showManga(item);
							this.props.navigation.push('Manga', {
									title: item.name,
									name: url,
									
							})
						}} 
						/>
						} keyExtractor={(item, index) => index.toString()} />
		

					<Text style={styles.sectionHeader}>Latest Update</Text>
					<FlatList style={{ height:100}} horizontal data={this.state.latestManga.data} 
					renderItem={({item, index}) =>
						<MangaImage item={item} showManga={() => {
							const url = showManga(item);
							this.props.navigation.push('Manga', {
									title: item.name,
									name: url,
	
							})
						}}/>
					} keyExtractor={(item, index) => index.toString()} />

				</View>
			);
     
    } else {
			return (
				<View>
					<ActivityIndicator
						animating={true}
						style={styles.indicator}
						size="large"
					/>
				</View>
      );
			
		}
	}
};

export default HomePage;

const styles = StyleSheet.create({
	indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  sectionHeader: {
    fontWeight: '800',
    fontSize: 18,
    color: '#364547',
    marginTop: 20,
    marginBottom: 5,
		marginLeft: 10
  },
 
 
});