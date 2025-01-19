import axios from "axios";
import {seriesType} from "../types.tsx";

export const fetchSeriesPerPage=(setSeriesPerPage:React.Dispatch<React.SetStateAction<seriesType[]>>,page:number,setTotalPages: React.Dispatch<React.SetStateAction<number>>)=>{
    axios.get(`https://api.themoviedb.org/3/tv/popular?page=${page}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
        .then((response)=>{
            setSeriesPerPage(response.data.results)
            setTotalPages(response.data.total_pages)
        })
}