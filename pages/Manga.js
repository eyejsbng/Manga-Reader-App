import React from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Header, Icon, Card } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import ParallaxScrollView from "react-native-parallax-scroll-view";

const window = Dimensions.get("window");
function Chapter({ item, selectChapter }) {
  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: "#161A37",
          width: 60,
          height: 30,
          margin: 15,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
        }}
        onPress={selectChapter}
      >
        <Text accessibilityRole="link" style={{ color: "#fff" }}>
          {item.chapter}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function BackButton() {
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
class Manga extends React.Component {
  state = {
    manga: [],
    loading: true,
    lengthMore: false,
    numOfLines: undefined,
    showMoreButton: false,
    textShown: false,
    offSetY: 0,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { name } = this.props.route.params;

    axios
      .get("https://warm-refuge-03594.herokuapp.com/api/manga/" + name)
      .then((data) => {
        this.setState({ manga: data.data, loading: false });
       
      })
      .catch((err) => {
        console.error(err);
      });
  }
  onTextLayout(e) {
    if (e.nativeEvent.lines.length > 3 && !textShown) {
      this.setState({ showMoreButton: true, numOfLines: 3 });
    }
  }
  _handleScroll(e) {
    console.log(e.nativeEvent.contentOffset.y);
    const offY = e.nativeEvent.contentOffset.y;
  }
  render() {
    const { manga, loading } = this.state;
    if (!loading) {
      return (
        <ParallaxScrollView

					backgroundColor="#070D2D"
					contentBackgroundColor="#070D2D"
          parallaxHeaderHeight={window.height / 2.2}
          renderStickyHeader={() => (
            <Header
              statusBarProps={{
                barStyle: "light-content",
                backgroundColor: "transparent",
              }}
              containerStyle={{
                backgroundColor: "#070D2D",
                borderBottomColor: "#070D2D",
              }}
              leftComponent={BackButton}
              centerComponent={
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "nunito-bold",
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                  numberOfLines={1}
                >
                  {this.props.route.params.title}
                </Text>
              }
            />
          )}
          stickyHeaderHeight={window.height / 7}

          renderBackground={() => (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: window.width,
                height: window.height / 2.2,
              }}
            >
              <Image
                blurRadius={1}
                style={styles.bgImage}
                source={require("../assets/img/new.jpg")}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  width: window.width,
                  backgroundColor: "rgba(0,0,0,.4)",
                  height: window.height / 2,
                }}
              />
            </View>
          )}
          renderForeground={() => (
            <View>
              <View style={{ alignItems: "center" }}>
                <Image
                  style={styles.thumbnail}
                  source={{
                    uri: manga.thumbnail,
                  }}
                  resizeMode="cover"
                />
              </View>

              <View style={{ padding: 10, marginTop: 40 }}></View>
            </View>
          )}
        >
          {!loading ? (
            <View style={{ backgroundColor: "#070D2D",height: 'auto'}}>
              <View style={{ margin: 15 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "nunito-bold",
                    fontSize: 25,
                    fontWeight: "700",
                  }}
                >
                  {this.props.route.params.title}
                </Text>
                <Text
                  style={{ fontWeight: "700", color: "#fff", fontSize: 16 }}
                >
                  <Icon
                    style={{ top: 4 }}
                    name="person-circle-outline"
                    type="ionicon"
                    color="#fff"
                  />{" "}
                  {manga.author.replace(",", "")}
                </Text>

                <Text
                  style={{ fontWeight: "700", color: "#fff", fontSize: 16 }}
                >
                  <Icon
                    style={{ top: 5 }}
                    name="pulse-outline"
                    type="ionicon"
                    color="#fff"
                  />{" "}
                  {manga.status.trim(" ")}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {manga.genres.map((d, index) => (
                    <Text key={index.toString()}
                      style={{
                        backgroundColor: "#7868e6",
                        width: 80,
                        borderRadius: 10,
                        height: 25,
                        color: "#fff",
                        margin: 7,
                        textAlign: "center",
                      }}
                    >
                      {d.genre}
                    </Text>
                  ))}
                </View>
              </View>

              <Card
                containerStyle={{
                  backgroundColor: "#161A37",
                  borderColor: "#161A37",
                  borderRadius: 10,
                }}
              >
                {manga.description.trim() == "" ? (
                  <Text style={{ color: "#fff", fontFamily: "nunito" }}>
                    --
                  </Text>
                ) : (
                  <View>
                    <Text
                      numberOfLines={5}
                      style={{ textAlign: "justify", color: "#797979" }}
                    >
                      {manga.description.trim(" ")}
                    </Text>
                  </View>
                )}
              </Card>
              <View style={{ margin: 10 }}>
                <Text
                  style={{ fontWeight: "700", fontSize: 16, color: "#fff" }}
                >
                  Chapters
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {manga.chapters.map((d, i) => {
                  return (
                    <Chapter
                      key={i}
                      item={d}
                      selectChapter={() => {
                        const link = d.link;
                        let chapter = link.split("/");
                        let chapterNumber = chapter[chapter.length - 1];

                        this.props.navigation.push("Chapter", {
                          chapter: chapterNumber,
                        });
                      }}
                    />
                  );
                })}
              </View>
            </View>
          ) : null}
        </ParallaxScrollView>
      );
    } else {
      return (
        <View style={styles.title}>
          <ActivityIndicator
            animating={true}
            size="large"
            style={{ opacity: 1 }}
            color="#7868e6"
          />
        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#070D2D",
    flex: 1,
  },
  thumbnail: {
    height: 260,
    width: 200,
    borderRadius: 10,

    top: window.height / 15,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#070D2D",
  },
  bgImage: {
    flex: 1,
    width: window.width,
    resizeMode: "cover",
    opacity: 0.8,
  },
});

export default Manga;
