import Navbar from "../../api/components/Navbar.tsx";
import FeaturedMovie from "../movies/FeaturedMovie.tsx";
import PopularSeries from "../series/PopularSeries.tsx";
import PopularMovies from "../movies/PopularMovies.tsx";

export default function HomePage(){
    return(
        <>
            <Navbar/>
            <FeaturedMovie/>
            <PopularSeries/>
            <PopularMovies/>
        </>

    )
}