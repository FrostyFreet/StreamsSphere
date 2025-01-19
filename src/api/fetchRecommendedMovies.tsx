import axios from "axios";
import {moviesType} from "../types.tsx";

export const fetchRecommendedMovies= (setRecommendedMovies: (value: (((prevState: moviesType[]) => moviesType[]) | moviesType[])) => void)=>{
    const rand=Math.floor(Math.random()*300)
    axios.get(`https://api.themoviedb.org/3/movie/popular?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
        .then((response)=>{setRecommendedMovies(response.data.results)})
        .catch((e)=>console.error("An error occured while fetching movie",e))
}