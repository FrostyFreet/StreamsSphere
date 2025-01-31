import axios from "axios";
import {moviesType, seriesType} from "../../types.tsx";

const urls = [
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_TMDB_APIKEY}`,
    `https://api.themoviedb.org/3/trending/tv/day?api_key=${import.meta.env.VITE_TMDB_APIKEY}`
]
const requests = urls.map((url) => axios.get(url));
export const fetchRecommendedData=async ()=>{
    try{
        const responses = await axios.all(requests);
        const [moviesResponse, tvShowsResponse] = responses;

        const results = [
            ...moviesResponse.data.results.map((movie:moviesType) => ({
                ...movie,
                type: "movie",
            })),
            ...tvShowsResponse.data.results.map((tvShow:seriesType) => ({
                ...tvShow,
                type: "tv",
            })),
        ];
        return results
    }
    catch (e) {console.error("Error fetching data:",e)}

}