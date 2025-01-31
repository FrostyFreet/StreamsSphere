import axios from "axios";
import {seriesType} from "../../types.tsx";


export const fetchFilteredSeriesPerPage = async (page: number, setTotalPages: React.Dispatch<React.SetStateAction<number>>, sortBy: string, setFilteredData: (value: (((prevState: seriesType[]) => seriesType[]) | seriesType[])) => void) =>{
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_APIKEY}&page=${page}&sort_by=${sortBy}&include_adult=true`)
        setTotalPages(response.data.total_pages)
        setFilteredData(response.data.results)
        return response.data.results
    }
    catch (e) {
        console.error("Error fetching data",e)
    }
}