import {moviesType} from "../../types.tsx";
import axios from "axios";


export const fetchFilteredMoviesPerPage = async (page: number, setTotalPages: React.Dispatch<React.SetStateAction<number>>, sortBy: string,
    setFilteredData: React.Dispatch<React.SetStateAction<moviesType[]>>
) =>{
    try {
        const resp = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?page=${page}&sort_by=${sortBy}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`
        );
        setFilteredData(resp.data.results);
        setTotalPages(resp.data.total_pages);
        return resp.data.results || [];
    } catch (error) {
        setFilteredData([]);
        setTotalPages(1);
        return [];
    }


}