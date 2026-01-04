import axios from "axios";
import {seriesType} from "../../types.tsx";


export const fetchFilteredSeriesPerPage = async (
    page: number,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>,
    category: number[],
    releaseDate: string | undefined,
    sortBy: string, setFilteredData: (value: (((prevState: seriesType[]) => seriesType[]) | seriesType[])) => void) =>{
    try {
        let url = `https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_APIKEY}&page=${page}&sort_by=${sortBy}&include_adult=false`
        if (releaseDate) {
            url += `&release_date.lte=${releaseDate}`;
        }
        if (category.length > 0) {
            url += `&with_genres=${category.join(",")}`;
        }
        const response = await axios.get(url)
        setTotalPages(response.data.total_pages)
        setFilteredData(response.data.results)
        return response.data.results
    }
    catch (e) {
        console.error("Error fetching data",e)
        return []
    }
}