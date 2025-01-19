import axios from "axios";
import {moviesType, seriesType} from "../types.tsx";

export const fetchByName=async (query:string,setSearchResult)=>{
   await Promise.all([
         axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_APIKEY}&query=${query}`),
         axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${import.meta.env.VITE_TMDB_APIKEY}&query=${query}`)
    ])
        .then(([moviesResponse, tvResponse]) => {
            console.log('Movies response:', moviesResponse.data.results);
            console.log('TV response:', tvResponse.data.results);
            const combinedResults = [
                ...moviesResponse.data.results.map((movie: moviesType) => ({ ...movie, type: 'movie' })),
                ...tvResponse.data.results.map((tvShow: seriesType) => ({ ...tvShow, type: 'series' }))
            ];
            console.log('Combined results:', combinedResults);
            setSearchResult(combinedResults);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            setSearchResult({ movies: [], tvShows: [] });
        });

}