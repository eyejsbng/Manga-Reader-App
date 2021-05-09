import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList} from "react-native";
import { Header, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { apiConfig } from '../config/config';
import MangaImage from "../components/MangaImage";

import axios from 'axios';
const baseUrl = apiConfig.baseUrl;
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
      color="#7868e6"
    />
  ) : null;
}

function showManga(item) {
  const link = item.link;
  let res = link.split("/");
  res = res[res.length - 1];
  return res;
}

class Latest extends React.Component {
	state = {
		page: 1,
		manga: [],
		loading : false,
	}
	 
	_fetchData() {
			this.setState({loading:true});
			axios.get(`${baseUrl}manga/latest`).then((resp) => {
				const data = resp.data.data;

				this.setState({
					manga:data, 
					loading:false, 
					page: this.state.page + 1,
				})
		
			})
	}
	_loadMore() {
		const { manga } = this.state;
    this.setState({ loading: true });
    axios
      .get(`${baseUrl}manga/latest/${this.state.page}`)
      .then((resp) => {
        const data = resp.data.data;
        const updateData = manga.concat(data);

        this.setState({
          manga: updateData,
          page: this.state.page + 1,
          loading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
	}
  componentDidMount() {
		this._fetchData()
	}
  render() {
		const { manga, loading } = this.state
    return (
      <View style={styles.container}>
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
            <Text
              numberOfLines={1}
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#fff",
                paddingTop: 5,
              }}
            >
              Latest
            </Text>
          }
        />

				{
					manga == '' ? (
						<ActivityIndicator
            animating={true}
            size="large"
            style={{ opacity: 1, top: 100 }}
            color="#7868e6"
          />
					) : (
						<FlatList
            numColumns={2}
            data={manga}
            onEndReached={({ distanceFromEnd }) => {
              this._loadMore();
            }}
            onEndReachedThreshold={0.7}
            ListFooterComponent={<Loader loading={loading} />}
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
					)
				}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070D2D",
  },
});

export default Latest;
