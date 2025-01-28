import axios from "axios";
import { SetStateAction } from "react";
import { seriesDetailTypes } from "../types";

export const fetchSeriesDetail = async (setSeriesDetail: { (value: SetStateAction<seriesDetailTypes[]>): void; (arg0: any): any; }, id: string | undefined)=>{
    await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_APIKEY}`
        )
        .then((response)=>setSeriesDetail(response.data))
}