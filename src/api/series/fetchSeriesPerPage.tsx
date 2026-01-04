import axios from "axios"
import React from "react"
import {seriesType} from "../../types.tsx"


export const fetchSeriesPerPage=async (setSeries: React.Dispatch<React.SetStateAction<seriesType[]>>,page:number,setTotalPages: React.Dispatch<React.SetStateAction<number>>,sortBy:string)=>{
   try {
       const response= await axios.get(`https://api.themoviedb.org/3/tv/popular?page=${page}&sort_by=${sortBy}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
       setTotalPages(response.data.total_pages)
       setSeries(response.data.results)
       return response.data.results
   }
   catch (e) {
       console.error("Error fetching series",e)
   }
}