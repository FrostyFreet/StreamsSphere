import axios from "axios";
import {moviesType, seriesType} from "../../types.tsx";

const rand=Math.floor(Math.random()*50)
const urls = [
    `https://api.themoviedb.org/3/movie/popular?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`,
    `https://api.themoviedb.org/3/tv/popular?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`,

];

const requests = urls.map((url) => axios.get(url));
export const fetchLatestData=async ()=>{
    try{
        const responses = await axios.all(requests);
        const [moviesResponse, tvShowsResponse] = responses;

        const results = [
            ...moviesResponse.data.results.map((movie: moviesType) => ({
                ...movie,
                type: "movie", // Add a type to distinguish between movies and TV shows
            })),
            ...tvShowsResponse.data.results.map((tvShow: seriesType) => ({
                ...tvShow,
                type: "tv", // Add a type to distinguish between movies and TV shows
            })),
        ];
        return results
    }
    catch (e) {console.error("Error fetching data:",e)}

}