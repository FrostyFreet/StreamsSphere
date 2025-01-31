import axios from "axios";
import {moviesType} from "../../types.tsx";

export const fetchRecommendedMovies= async (setRecommendedMovies: React.Dispatch<React.SetStateAction<moviesType[]>>)=>{
    const rand=Math.floor(Math.random()*300)
    await axios.get(`https://api.themoviedb.org/3/movie/popular?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
        .then((response)=>{setRecommendedMovies(response.data.results)})
        .catch((e)=>console.error("An error occured while fetching movie",e))
}