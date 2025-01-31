import {moviesType} from "../../types.tsx";
import axios from "axios";


export const fetchFilteredMoviesPerPage = async (page: number, setTotalPages: React.Dispatch<React.SetStateAction<number>>, sortBy: string,
    setFilteredData: React.Dispatch<React.SetStateAction<moviesType[]>>
) =>{        await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_APIKEY}&page=${page}&sort_by=${sortBy}&include_adult=true`)
            .then((response)=>{
            setTotalPages(response.data.total_pages)
            setFilteredData(response.data.results)
        })
}