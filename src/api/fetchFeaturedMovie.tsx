import axios from "axios";
import {featuredMovie} from "../types.tsx";

export const fetchFeaturedMovie =async (setFeaturedMovie: (value: (((prevState: (featuredMovie | undefined)) => (featuredMovie | undefined)) | featuredMovie | undefined)) => void) => {
    const rand = Math.floor(Math.random() * 20);
   await axios
        .get(`https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
        .then((response) => {
            setFeaturedMovie(response.data.results[rand]);
        })
        .catch((error) => {
            console.error("Error fetching featured movie:", error);
        });
};
