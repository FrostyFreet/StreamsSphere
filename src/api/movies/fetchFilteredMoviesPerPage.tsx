import {moviesType} from "../../types.tsx";
import axios from "axios";


export const fetchFilteredMoviesPerPage = async (
    page: number,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>,
    sortBy: string,
    setFilteredData: React.Dispatch<React.SetStateAction<moviesType[]>>,
    category: number[],
    releaseDate: string | undefined
) =>{
    try {
        let url = `https://api.themoviedb.org/3/discover/movie?page=${page}&sort_by=${sortBy}&api_key=${import.meta.env.VITE_TMDB_APIKEY}`;
        if (releaseDate) {
            url += `&release_date.lte=${releaseDate}`;
        }
        if (category.length > 0) {
            url += `&with_genres=${category.join(",")}`;
        }
        const resp = await axios.get(url)
        setFilteredData(resp.data.results);
        setTotalPages(resp.data.total_pages);
        return resp.data.results || [];
    } catch (error) {
        setFilteredData([]);
        setTotalPages(1);
        return [];
    }


}