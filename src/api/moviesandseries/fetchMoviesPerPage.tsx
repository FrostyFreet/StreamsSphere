import axios from "axios";
import {moviesType} from "../../types.tsx";
import React from "react";

export const fetchMoviesPerPage=async (setMoviesPerPage: React.Dispatch<React.SetStateAction<moviesType[]>>, page: number, setTotalPages: React.Dispatch<React.SetStateAction<number>>, sortBy:string)=>{
    const resp=await axios.get(
        `https://api.themoviedb.org/3/discover/movie?page=${page}&sort_by=${sortBy}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`
    )
    setMoviesPerPage(resp.data.results)
    setTotalPages(resp.data.total_pages)
    return resp.data.results
}