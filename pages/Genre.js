import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { apiConfig } from "../config/config";
import MangaImage from "../components/MangaImage";
import LottieView from 'lottie-react-native';
const baseUrl = apiConfig.baseUrl;

function showManga(item) {
  const link = item.link;
  let res = link.split("/");
  res = res[res.length - 1];
  return res;
}

function backButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{ marginTop: 5 }}>
      <Icon
        name="arrow-back-outline"
        type="ionicon"
        color="#fff"
        onPress={() => navigation.goBack()}
      />
    </TouchableOpacity>
  );
}

function Loader(loading) {
  return loading ? (
    <ActivityIndicator
      animating={true}
      size="large"
      style={{ opacity: 1 }}
      color="#ff8303"
    />
  ) : null;
}
class Genre extends React.Component {
  _isMounted = false;
  onEndReachedCalledDuringMomentum = true;
  state = {
    genre: [],
    page: 1,
    loading: false,
		fetching : false,
		dataNull: false
  };
  componentDidMount() {
    this._isMounted = true;
    this.fetchData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  fetchData() {
    const genre = this.props.route.params.genre;
    const slug = this.replaceSpace(genre);
    const url = `${baseUrl}manga/genre/${slug}/${this.state.page}`;
		this.setState({fetching:true});
    axios
      .get(url)
      .then((resp) => {
        const data = resp.data.data;
        this.setState({ genre: data, page: this.state.page + 1,fetching:false });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  loadMore() {
    const genres = this.props.route.params.genre;
    const { genre } = this.state;
    const slug = this.replaceSpace(genres);
    this.setState({ loading: true });
    const url = `${baseUrl}manga/genre/${slug}/${this.state.page}`;

    axios
      .get(url)
      .then((resp) => {
        const data = resp.data.data;
        const updateData = genre.concat(data);
				
				this.setState({
					genre: updateData,
					page: this.state.page + 1,
					loading: false,
				});
		 
      })
      .catch((err) => {
        console.log(err);
      });
  }
  replaceSpace(slug) {
    let string = slug;
    string = slug.replace(/\s/g, "-");
    return string;
  }
  render() {
    const { genre,fetching } = this.state;
	
    return (
      <View style={styles.container}>
        <Header
          statusBarProps={{
            barStyle: "light-content",
            backgroundColor: "#7868e6",
          }}
          containerStyle={{
            backgroundColor: "#7868e6",
            borderBottomColor: "#12151C",
          }}
          leftComponent={backButton}
          centerComponent={
            <Text
              numberOfLines={1}
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#fff",
                paddingTop: 5,
              }}
            >
              {this.props.route.params.genre}
            </Text>
          }
        />
        {genre != "" ? (
          <FlatList
            numColumns={2}
            data={genre}
            onEndReached={({ distanceFromEnd }) => {
						
								this.loadMore();
							}    
            }
            onEndReachedThreshold={0.7}
            
            ListFooterComponent={<Loader loading={this.state.loading} />}
            renderItem={({ item }) => (
              <View style={{ marginTop: 10 }}>
                <MangaImage
                  item={item}
                  showManga={() => {
                    const url = showManga(item);

                    this.props.navigation.push("Manga", {
                      title: item.name,
                      name: url,
                    });
                  }}
                />
              </View>
            )}

            keyExtractor={(item, index) => index.toString()}
          />
        ) : 	<LottieView
				source={require("../lottie/46472-lurking-cat.json")}
				autoPlay
				loop
				style={{}}
			/>}
      </View>
    );
  }
}

export default Genre;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
