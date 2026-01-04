import axios from "axios";
import {moviesType, seriesType} from "../../types.tsx";


export const fetchTopRatedData=async ()=>{
    const rand=Math.floor(Math.random()*50)
    const urls = [
        `https://api.themoviedb.org/3/movie/top_rated?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`,
        `https://api.themoviedb.org/3/tv/top_rated?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`,

    ];
    try{
        const requests = urls.map((url) => axios.get(url));
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
    catch (e) {
        console.error("Error fetching data:", e)
        return [];
    }

}