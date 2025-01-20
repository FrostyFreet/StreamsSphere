import axios from "axios";
import {seriesType} from "../types.tsx";

export const fetchRecommendedSeries=async (setRecommendedSeries: React.Dispatch<React.SetStateAction<seriesType[]>>)=>{
    const rand=Math.floor(Math.random()*300)
    await axios.get(`https://api.themoviedb.org/3/tv/popular?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
        .then((response)=>{setRecommendedSeries(response.data.results)})
        .catch((e)=>console.error("An error occured while fetching movie",e))
}