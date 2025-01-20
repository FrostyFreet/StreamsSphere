import axios from "axios";
import {seriesType} from "../types.tsx";


export const fetchHomePageSeries= async (setHomePageSeries: (value: (((prevState: seriesType[]) => seriesType[]) | seriesType[])) => void)=>{
    const rand=Math.floor(Math.random()*50)
    await axios.get(`https://api.themoviedb.org/3/tv/popular?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
        .then((response)=>{setHomePageSeries(response.data.results)})
        .catch((e)=>console.error("An error occured while fetching movie",e))
}