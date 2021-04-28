import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import axios from "axios";
import ChapterImages from "../components/ChapterImages";

class Chapter extends React.Component {
  state = {
    images: [],
    loading: true,
  };

  getImages() {
    const { chapter } = this.props.route.params;
    axios
      .get("https://warm-refuge-03594.herokuapp.com/api/chapter/" + chapter)
      .then((resp) => {
        this.setState({ images: resp.data.data, loading: false });
        console.log(this.state.images);
      });
  }

  componentDidMount() {
    this.getImages();
  }

  render() {
    const { images, loading } = this.state;
    if (loading) {
      return (
        <View style={styles.title}>
          <ActivityIndicator
            animating={true}
            size="large"
            style={{ opacity: 1 }}
            color="#ff8303"
          />
        </View>
      );
    } else {
      return (
        <View>
          <StatusBar translucent={true} hidden={false} />
          <FlatList
            initialNumToRender={4}
            data={images}
            renderItem={({ item }) => <ChapterImages item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    }
  }
}

export default Chapter;

const styles = StyleSheet.create({
  title: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
		backgroundColor: '#12151C'
  },
});
