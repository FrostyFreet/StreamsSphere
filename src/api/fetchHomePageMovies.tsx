import axios from "axios";
import {moviesType} from "../types.tsx";

export const fetchHomePageMovies=async (setHomePageMovies: (value: (((prevState: moviesType[]) => moviesType[]) | moviesType[])) => void)=>{
    const rand=Math.floor(Math.random()*50)
    await axios.get(`https://api.themoviedb.org/3/movie/popular?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
            .then((response)=>{setHomePageMovies(response.data.results)})
            .catch((e)=>console.error("An error occured while fetching movie",e))
}