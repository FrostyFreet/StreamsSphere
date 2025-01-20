import axios from "axios";
import {moviesType, searchResultTypes, seriesType} from "../types.tsx";

export const fetchByName=async (query: React.SetStateAction<string>, setSearchResult: React.Dispatch<React.SetStateAction<searchResultTypes[]>>)=>{
   await Promise.all([
         axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_APIKEY}&query=${query}`),
         axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${import.meta.env.VITE_TMDB_APIKEY}&query=${query}`)
    ])
        .then(([moviesResponse, tvResponse]) => {

            const combinedResults = [
                ...moviesResponse.data.results.map((movie: moviesType) => ({ ...movie, type: 'movie' })),
                ...tvResponse.data.results.map((tvShow: seriesType) => ({ ...tvShow, type: 'series' }))
            ];

            setSearchResult(combinedResults);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });

}