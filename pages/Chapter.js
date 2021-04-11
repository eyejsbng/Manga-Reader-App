import React from 'react';
import { View, Text, FlatList,ActivityIndicator} from 'react-native'
import { Image } from 'react-native-elements';
import axios from 'axios';
import ChapterImages from '../components/ChapterImages'

class Chapter extends React.Component {
		
		state = {
			images: [],
			loading: true,
		}

		getImages() {
			const {chapter} = this.props.route.params;
			axios.get('https://warm-refuge-03594.herokuapp.com/api/chapter/'+chapter).then((resp) => {
				this.setState({images: resp.data.data, loading:false})
				console.log(this.state.images)
			})
		}

		componentDidMount() {
			this.getImages();
		}

		render() {
			const {images, loading} = this.state
			if (loading) {
				return (
					<ActivityIndicator
						animating={true}
						size="large"
					/>
				);
			}
			return (
				<View>
					<FlatList numColumns={1} data={images} renderItem={({item}) => 
							<ChapterImages item={item}/>
					} keyExtractor={(item, index) => index.toString()}  />
					
				</View>
			)

		}
}

export default Chapter;