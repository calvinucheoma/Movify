import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles, theme } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import CastMembers from "../components/CastMembers";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from "../api/moviedb";

var { width, height } = Dimensions.get("window");

const MovieScreen = () => {
  const { params: item } = useRoute();

  const [isFavorite, setIsFavorite] = useState(false);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});

  const navigation = useNavigation();

  const topMargin = Platform.OS === "android" ? "mt-3" : "";

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  }, [item]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    // console.log(data);
    if (data) {
      setMovie(data);
    }
    setLoading(false);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) {
      setCast(data.cast);
    }
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="flex-1 bg-neutral-900"
    >
      {/* Back button and movie poster here */}
      <View className="w-full">
        <SafeAreaView
          className={`absolute z-20 w-full flex flex-row justify-between items-center px-4 pt-2 ${topMargin}`}
        >
          <TouchableOpacity
            style={styles.background}
            className="rounded-xl p-1"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFavorite((prevState) => !prevState)}
          >
            <HeartIcon
              size={35}
              color={isFavorite ? theme.background : "white"}
            />
          </TouchableOpacity>
        </SafeAreaView>

        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                uri: image500(movie?.poster_path) || fallbackMoviePoster,
              }}
              style={{ width: width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
              style={{ width: width, height: height * 0.4 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute bottom-0"
            />
          </View>
        )}
      </View>

      {/* MOVIE DETAILS VIEW */}
      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        {/* Movie Title */}
        <Text className="text-white text-center text-3xl font-bold tracking-wider">
          {movie.title}
        </Text>

        {/* Movie status, release date and runtime */}

        {movie?.id ? (
          <Text className="text-neutral-400 text-base text-center font-semibold">
            {movie?.status} * {movie?.release_data?.split("-")[0]} *{" "}
            {movie?.runtime} min
          </Text>
        ) : null}

        {/* Movie genres */}
        <ScrollView
          className="mx-4 space-x-2"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
            justifyContent: "center",
          }}
        >
          {movie?.genres?.map((genre, index) => {
            let showDot = index < movie.genres.length - 1;

            return (
              <Text
                key={index}
                className="text-neutral-400 font-semibold text-base text-center"
              >
                {genre?.name} {showDot ? "•" : null}
              </Text>
            );
          })}
        </ScrollView>

        {/* Movie Description */}
        <Text className="text-neutral-400 mx-4 tracking-wide">
          {movie?.overview}
        </Text>
      </View>

      {/* Movie cast members */}
      {cast.length > 0 && <CastMembers cast={cast} navigation={navigation} />}

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <MovieList
          title="Similar Movies"
          data={similarMovies}
          hideSeeAll={true}
        />
      )}
    </ScrollView>
  );
};

export default MovieScreen;
