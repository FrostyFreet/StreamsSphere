import {seriesType} from "../../types.tsx";
import axios from "axios";

export const fetchHomePageSeries= async (setPopularSeries: (value: (((prevState: seriesType[]) => seriesType[]) | seriesType[])) => void)=>{
    const rand=Math.floor(Math.random()*50)
    const url=`https://api.themoviedb.org/3/tv/popular?page=${rand}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`

    await axios.get(url)
            .then((resp)=>setPopularSeries(resp.data))
            .catch((e)=>console.error("Error fetching popular series",e))


}