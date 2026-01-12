import axios from "axios";
import {moviesType, searchResultTypes, seriesType} from "../../types.tsx";

export const fetchByName = async (query: string): Promise<searchResultTypes[]> => {
    try {
        const [moviesResponse, tvResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_APIKEY}&query=${query}`),
            axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${import.meta.env.VITE_TMDB_APIKEY}&query=${query}`)
        ]);

        const combinedResults = [
            ...moviesResponse.data.results.map((movie: moviesType) => ({ ...movie, type: 'movie' })),
            ...tvResponse.data.results.map((tvShow: seriesType) => ({ ...tvShow, type: 'series' }))
        ];

        return combinedResults as searchResultTypes[];
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};