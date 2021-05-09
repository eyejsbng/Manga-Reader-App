import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import MangaImage from "../components/MangaImage";
import axios from "axios";
import LottieView from "lottie-react-native";
import { apiConfig } from "../config/config";

const baseUrl = apiConfig.baseUrl;
const HEADER_HEIGHT = 50;

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

function Loader({ loading, color }) {
  return loading ? (
    <ActivityIndicator size="large" style={{ opacity: 1 }} color={color} />
  ) : null;
}
function showManga(item) {
  const link = item.link;
  let res = link.split("/");
  res = res[res.length - 1];
  return res;
}

class SearchPage extends React.Component {
  state = {
    manga: [],
    keyword: "",
    loading: false,
    page: 1,
    search: false,
    dataNull: false,
    loadMore: false,
  };
  alert(msg) {
    Alert.alert("Message", msg);
  }

  fetchData(keyword) {
    this.setState({ loading: true });

    axios
      .get(baseUrl + "manga/search/" + keyword)
      .then((resp) => {
        const data = resp.data.data;
        if (data == "") {
          this.setState({ search: true });
        }
        this.setState({
          manga: data,
          loading: false,
          page: this.state.page + 1,
        });
      })
      .catch((err) => {
        alert(err);
      });
  }
  loadMore() {
    const { manga } = this.state;

    axios
      .get(
        baseUrl + "manga/search/" + this.state.keyword + "/" + this.state.page
      )
      .then((resp) => {
        const data = resp.data.data;
        const updateData = manga.concat(data);

        if (data == "") {
          this.setState({ dataNull: true });
        } else {
          this.setState({
            manga: updateData,
            loadMore: true,
            page: this.state.page + 1,
          });
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  render() {
    const { keyword, manga } = this.state;

    return (
      <View style={styles.container}>
        <View>
          <Header
            statusBarProps={{
              barStyle: "light-content",
              backgroundColor: "#070D2D",
            }}
            containerStyle={{
              backgroundColor: "#070D2D",
              borderBottomColor: "#070D2D",
            }}
            leftComponent={backButton}
            centerComponent={
              <TextInput
                editable={!this.state.loading}
                selectionColor={"#fff"}
                focusable={true}
                style={styles.searchInput}
                value={this.state.keyword}
                placeholder="Search"
                placeholderTextColor="#fff"
                onChangeText={(keyword) => this.setState({ keyword: keyword })}
                onSubmitEditing={() => {
                  this.fetchData(keyword);
                }}
              />
            }
            rightComponent={
              <Loader loading={this.state.loading} color={"#7868e6"} />
            }
          />
        </View>
        <View style={{ flex: 2, flexDirection: "row" }}>
          {manga != "" ? (
            <FlatList
              numColumns={2}
              data={manga}
              onEndReachedThreshold={0.7}
              onEndReached={({ distanceFromEnd }) => {
                this.loadMore();
              }}
              ListFooterComponent={
                <Loader loading={this.state.loadMore} color={"#7868e6"} />
              }
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
          ) : this.state.search ? (
            <View style={styles.error}>
              <Text style={{ color: "#fff" }}>
                Sorry, we can't find what you are looking for.
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

export default SearchPage;

const styles = StyleSheet.create({
  searchInput: {
    paddingLeft: 10,
    height: 40,
    borderRadius: 5,
    width: 250,
    fontSize: 18,
    backgroundColor: "#161A37",
    color: "#fff",
  },
  error: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    top: 40,
  },
  title: {
    top: 100,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#070D2D",
  },
});
