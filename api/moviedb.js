import axios from "axios";
import { apiKey } from "../constants";

// ENDPOINTS
const apiBaseUrl = "https://api.themoviedb.org/3";

const trendingMoviesEndpoint = `${apiBaseUrl}/trending/movie/day?api_key=${apiKey}`;

const upcomingMoviesEndpoint = `${apiBaseUrl}/movie/upcoming?api_key=${apiKey}`;

const topRatedMoviesEndpoint = `${apiBaseUrl}/movie/top_rated?api_key=${apiKey}`;

const searchMoviesEndpoint = `${apiBaseUrl}/search/movie?api_key=${apiKey}`;

// DYNAMIC ENDPOINTS
const movieDetailsEndpoint = (id) =>
  `${apiBaseUrl}/movie/${id}?api_key=${apiKey}`;

const movieCreditsEndpoint = (id) =>
  `${apiBaseUrl}/movie/${id}/credits?api_key=${apiKey}`;

const similarMoviesEndpoint = (id) =>
  `${apiBaseUrl}/movie/${id}/similar?api_key=${apiKey}`;

const personDetailsEndpoint = (id) =>
  `${apiBaseUrl}/person/${id}?api_key=${apiKey}`;

const personMoviesEndpoint = (id) =>
  `${apiBaseUrl}/person/${id}/movie_credits?api_key=${apiKey}`;

// MOVIE IMAGES
export const image500 = (path) =>
  path ? `https://image.tmdb.org/t/p/w500/${path}` : null;

export const image342 = (path) =>
  path ? `https://image.tmdb.org/t/p/w342/${path}` : null;

export const image185 = (path) =>
  path ? `https://image.tmdb.org/t/p/w185/${path}` : null;

export const fallbackMoviePoster =
  "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";

export const fallbackPersonImage =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

// FETCH MOVIE DATA
const apiCall = async (endpoint, params) => {
  const options = {
    method: "GET",
    url: endpoint,
    params: params ? params : {},
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    return {};
  }
};

export const fetchTrendingMovies = () => {
  return apiCall(trendingMoviesEndpoint);
};

export const fetchUpcomingMovies = () => {
  return apiCall(upcomingMoviesEndpoint);
};

export const fetchTopRatedMovies = () => {
  return apiCall(topRatedMoviesEndpoint);
};

export const fetchMovieDetails = (id) => {
  return apiCall(movieDetailsEndpoint(id));
};

export const fetchMovieCredits = (id) => {
  return apiCall(movieCreditsEndpoint(id));
};

export const fetchSimilarMovies = (id) => {
  return apiCall(similarMoviesEndpoint(id));
};

export const fetchPersonDetails = (id) => {
  return apiCall(personDetailsEndpoint(id));
};

export const fetchPersonMovies = (id) => {
  return apiCall(personMoviesEndpoint(id));
};

export const searchMovies = (params) => {
  return apiCall(searchMoviesEndpoint, params);
};
