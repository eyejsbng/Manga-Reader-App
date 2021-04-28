import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Animated,
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

function Chapter({ item, selectChapter }) {
  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: "#7868e6",
          width: 60,
          height: 30,
          margin: 15,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
        }}
        onPress={selectChapter}
      >
        <Text style={{ color: "#fff" }}>{item.chapter}</Text>
      </TouchableOpacity>
    </View>
  );
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
class Manga extends React.Component {
  state = {
    manga: [],
    loading: true,
    lengthMore: false,
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
    this.setState({ lengthMore: e.nativeEvent.lines.length >= 4 }); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }
  render() {
    const { manga, loading } = this.state;

      return (
        <View style={styles.container}>
          <Header
            statusBarProps={{
              barStyle: "light-content",
              backgroundColor: "#7868e6",
            }}
            containerStyle={{
              backgroundColor: "#7868e6",
              borderBottomColor: "#7868e6",
            }}
            leftComponent={backButton}
            centerComponent={
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "nunito-regular",
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#fff",
                  paddingTop: 5,
                }}
              >
                {this.props.route.params.title}
              </Text>
            }
          />
					{
						!loading ?  <ScrollView>
            <ImageBackground
              blurRadius={3}
              source={{ uri: manga.thumbnail }}
              style={styles.image}
            >
              <View style={{ backgroundColor: "rgba(0,0,0,0.5)" }} />
              <View style={{ flex: 1, flexDirection: "row", margin: 20 }}>
                <Image
                  style={styles.thumbnail}
                  source={{
                    uri: manga.thumbnail,
                  }}
                  resizeMode="cover"
                />
                <View
                  style={{ marginLeft: 10, flex: 1, flexDirection: "column" }}
                >
                  <Text
                    style={{ fontWeight: "700", color: "#fff", fontSize: 15 }}
                  >
                    Author
                  </Text>
                  <Text style={{ color: "#fff", fontSize: 15 }}>
                    {manga.author.replace(",", "")}
                  </Text>
                  <Text style={{ fontWeight: "700", color: "#fff" }}>
                    Status
                  </Text>
                  <Text style={{ color: "#fff" }}>
                    {manga.status.trim(" ")}
                  </Text>
                </View>
              </View>
            </ImageBackground>
            <View style={{ margin: 10 }}>
              <Text
                style={{
                  fontFamily: "nunito-regular",

                  fontSize: 15,
                  fontWeight: "700",
                  color: "#151515",
                }}
              >
                Description
              </Text>
              {manga.description == "" ? (
                <Text>Not Available</Text>
              ) : (
                <Text
                  numberOfLines={4}
                  style={{ textAlign: "justify", color: "#151515" }}
                >
                  {manga.description.trim(" ")}
                </Text>
              )}
            </View>

            <View style={{ margin: 10 }}>
              <Text style={{ fontWeight: "700", fontSize: 16, color: "#151515" }}>
                Chapters
              </Text>
            </View>
            <View
              style={{
             
                flexDirection: "row",
                flexWrap: "wrap",
              
              }}
            >
              {
								manga.chapters.map((d, i) => {
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
              	})
							}
            </View>
          </ScrollView>
						: <View style={styles.title}>
						<ActivityIndicator
							animating={true}
							size="small"
							style={{ opacity: 1 }}
							color="#7868e6"
						/>
					</View>
					}
         
        </View>
      );
    
    }
  }


const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#fff",
		flex:1
  },
  thumbnail: {
    height: 200,
    width: 170,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Manga;
