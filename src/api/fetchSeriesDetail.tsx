import axios from "axios";

export const fetchSeriesDetail= async (setSeriesDetail, id: string | undefined)=>{
    await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_APIKEY}`
        )
        .then((response)=>setSeriesDetail(response.data))
}