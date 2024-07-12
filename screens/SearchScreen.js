import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../components/Loading";
import { debounce } from "lodash";
import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";

var { width, height } = Dimensions.get("window");

const SearchScreen = () => {
  const paddingTop = Platform.OS === "android" ? "pt-3" : "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  let movieName = "Ant Man and the Wasp";

  const handleSearch = (value) => {
    // console.log(value)
    if (value && value.length > 2) {
      setLoading(true);
      searchMovies({
        query: value,
        include_adult: "false",
        language: "en-US",
        page: "1",
      }).then((data) => {
        // console.log('Searched Movies', data)

        if (data && data.results) {
          setResults(data.results);
        }

        setLoading(false);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  };

  // To avoid calling our api for every keystroke the user makes when searching for a movie
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView className={`bg-neutral-800 flex-1 ${paddingTop}`}>
      <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movie"
          placeholderTextColor="lightgray"
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="rounded-full p-3 m-1 bg-neutral-500"
        >
          <XMarkIcon size={25} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className="space-y-3"
        >
          <Text className="text-white font-semibold ml-1">
            Results ({results.length})
          </Text>

          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => navigation.push("Movie", item)}
              >
                <View className="space-y-2 mb-4">
                  <Image
                    className="rounded-3xl"
                    source={{
                      uri: image185(item?.poster_path) || fallbackMoviePoster,
                    }}
                    style={{ width: width * 0.44, height: height * 0.3 }}
                  />

                  <Text className="text-neutral-300 ml-1">
                    {item?.title.length > 22
                      ? item?.title.slice(0, 22) + "..."
                      : item?.title}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-row justify-center">
          <Image
            source={require("../assets/chill.png")}
            className="h-96 w-96"
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

// API READ ACCESS TOKEN = eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNjQwNjdmNDQ3YjdhMWZjMjRiOWIyZGZmOGQxYjFiNCIsIm5iZiI6MTcyMDUxODI5My41NDA3OTEsInN1YiI6IjYyNTZlMWI1ZDM4YjU4MDA1MGUyZGQxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JfkWc5ZwkSAH7RuIHRQxvyZ5AHRFLvo-_bLsSoYbUgA
