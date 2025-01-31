import axios from "axios";
import {moviesType} from "../../types.tsx";

export const fetchMoviesPerPage=async (setMoviesPerPage: React.Dispatch<React.SetStateAction<moviesType[]>>, page: number, setTotalPages: React.Dispatch<React.SetStateAction<number>>)=>{
    const resp=await axios.get(`https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
        .then((response)=>{
            setMoviesPerPage(response.data.results)
            setTotalPages(response.data.total_pages)
        })
    return resp
}