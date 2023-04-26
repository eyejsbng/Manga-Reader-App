import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Header } from "react-native-elements";
import { Icon } from "react-native-elements";
import MangaImage from "../components/MangaImage";
import genre from "../utils/genre";
import axios from "axios";
import Carousel from "react-native-snap-carousel";
import { apiConfig } from "../config/config";
import { scrollInterpolator, animatedStyles } from "../utils/animation";

const baseUrl = apiConfig.baseUrl;

const SLIDER_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);

const Search = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity>
      <Icon
        name="search"
        size={30}
        color="#fff"
        onPress={() => navigation.push("Search")}
      ></Icon>
    </TouchableOpacity>
  );
};

const showManga = (item) => {
  const link = item.link;
  let res = link.split("/");
  res = res[res.length - 1];
  return res;
};

class HomePage extends React.Component {
  state = {
    mangaList: [],
    latestManga: [],
    loading: true,
    genre: [],
    index: 0,
  };
  componentDidMount() {
    this.fetchData();
  }
  fetchManga() {
    let reqOne = "manga/top";
    let reqTwo = "manga/latest";

    const requestOne = axios.get(baseUrl + reqOne);
    const requestTwo = axios.get(baseUrl + reqTwo);

    axios.get(requestOne).then((resp) => {
      this.setState({
        mangaList: resp.data,
      });
    });

    axios.get(requestTwo).then((resp) => {
      this.setState({
        latestManga: resp.data,
        loading: false,
        genre: genre,
      });
    });
  }
  fetchData() {
    let reqOne = "manga/top";
    let reqTwo = "manga/latest";

    const requestOne = axios.get(baseUrl + reqOne);
    const requestTwo = axios.get(baseUrl + reqTwo);
    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const respOne = responses[0];
          const respTwo = responses[1];

          this.setState({
            mangaList: respOne.data,
            latestManga: respTwo.data,
            loading: false,
            genre: genre,
          });
        })
      )
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    const { loading, genre, mangaList, latestManga } = this.state;
    const hot = mangaList.data;
    const latest = latestManga.data;
    if (!loading) {
      return (
        <View style={styles.container}>
          <Header
            statusBarProps={{
              barStyle: "light-content",
              backgroundColor: "#070D2D",
            }}
            leftComponent={
              <Text
                style={{
                  fontFamily: "nunito-bold",
                  color: "#7868e6",
                  fontSize: 25,
                  width: 150,
                }}
              >
                MangaSub
              </Text>
            }
            containerStyle={{
              backgroundColor: "#070D2D",
              borderBottomColor: "#070D2D",
            }}
            rightComponent={Search}
          ></Header>

          <ScrollView horizontal={false}>
            <Text
              style={{
                fontFamily: "nunito-bold",
                color: "#fff",
                fontSize: 30,
                padding: 10,
              }}
            >
              Discover
            </Text>
            <Text style={styles.sectionHeader}>Genres</Text>

            <View style={{ height: 70 }}>
              <ScrollView horizontal={true}>
                {genre.map((d) => (
                  <View key={d} style={{ flex: 2, padding: 2 }}>
                    <TouchableOpacity
                      style={styles.genre}
                      onPress={() => {
                        this.props.navigation.push("Genre", {
                          genre: d,
                        });
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "nunito-regular",
                          color: "#7868e6",
                        }}
                      >
                        {d}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={{ height: 300 }}>
              <Text style={styles.sectionHeader}>Hot Manga</Text>
              <Carousel
                ref={(c) => (this.carousel = c)}
                data={hot}
                renderItem={({ item }) => (
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
                )}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={170}
                containerCustomStyle={styles.carouselContainer}
                onSnapToItem={(index) => this.setState({ index })}
                scrollInterpolator={scrollInterpolator}
                slideInterpolatedStyle={animatedStyles}
                useScrollView={true}
                firstItem={1}
                loop={true}
                activeAnimationType={"spring"}
                inactiveSlideOpacity={0.7}
                inactiveSlideScale={0.8}
              />
            </View>
            <View style={{ height: 330 }}>
		<View style={{flex:1,flexDirection:'row', justifyContent:'space-between'}}>
		<Text style={styles.sectionHeader}>Latest Update</Text>

		<TouchableOpacity onPress={() => {
			this.props.navigation.push("Latest")
		}}>
		<Text style={{fontSize:15,
			fontWeight:'700', 
			color:'#fff',marginLeft:'auto',
			marginRight:10,top:20}}>
			View More
		</Text>
		</TouchableOpacity>
		</View>
              <FlatList
                bounces={true}
                initialNumToRender={2}
                style={{ height: 180 }}
                horizontal
                data={latest}
                renderItem={({ item, index }) => (
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
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View></View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.title}>
          <StatusBar barStyle="light-content" backgroundColor="#070D2D" />
          <View>
            <ActivityIndicator
              animating={true}
              size="large"
              style={{ opacity: 1 }}
              color="#7868e6"
            />
          </View>
        </View>
      );
    }
  }
}

export default HomePage;

const styles = StyleSheet.create({
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: "center",
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#070D2D",
  },
  container: {
    flex: 1,
    backgroundColor: "#070D2D",
  },
  sectionHeader: {
    fontFamily: "nunito-bold",
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10,
  },
  genre: {
    backgroundColor: "#161A37",
    width: 80,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 7,
  },
});
