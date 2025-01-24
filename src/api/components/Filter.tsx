import {Box, Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button, Select, MenuItem, SelectChangeEvent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {SyntheticEvent, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useLocation} from "react-router";
import {FilterProps} from "../../types.tsx";

export default function Filter<T>({ setFilteredData }: FilterProps<T>) {
    const[sortBy,setSortBy]=useState<string>("popularity.desc")
    const[releaseDate,setReleaseDate]=useState<string>()
    const[category,setCategory]=useState<number[]>([])
    const[clickedButton,setClickedButton]= useState<{ [ key:string]: boolean }>({})
    const[filtersApplied,setFiltersApplied]=useState<boolean>(false)
    const [genres, setGenres] = useState([]);
    const location=useLocation()
    const isMoviePage = location.pathname === '/movies'
    const isSeriesPage = location.pathname === '/series'

    let movie=`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_APIKEY}&sort_by&include_adult=true`
    let tv=`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_APIKEY}&sort_by&include_adult=true`

    const handleSortChange=(e: SelectChangeEvent<string>)=>{
        setSortBy(e.target.value)
    }
    const handleReleaseChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        setReleaseDate(e.target.value)
    }

    const handleClickButton = (genre: string,id:number) => {
        setClickedButton((prevState) => ({
            ...prevState,
            [genre]: !prevState[genre]
        }));

        setCategory((prevState:number[]) => {
            if (prevState.includes(id)) {
                return prevState.filter((item:number) => item !== id);
            } else {
                return [...prevState, id];
            }
        });
    };
    const fetchGenres=async ()=>{
        const moviesUrl=`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_APIKEY}`
        const seriesUrl=`https://api.themoviedb.org/3/genre/tv/list?api_key=${import.meta.env.VITE_TMDB_APIKEY}`
        if(isMoviePage){
            const response = await axios.get(moviesUrl);
            setGenres(response.data.genres);
            return response.data.results;
        }
        if(isSeriesPage){
            const response = await axios.get(seriesUrl);
            setGenres(response.data.genres);
            return response.data.results;
        }

    }
    const fetchFilteredMovies=async ()=>{
        if(sortBy){
            movie+=`&sort_by=${sortBy}`
        }
        if(releaseDate!==undefined){
            movie+=`&release_date.lte=${releaseDate}`
        }
        if (category.length > 0) {
            movie += `&with_genres=${category.join("%2")}`;
        }
        console.log(movie)
        const response = await axios.get(movie);
        setFilteredData(response.data.results);
        return response.data.results;
    }
    const fetchFilterSeries=async ()=>{
        if(sortBy){
            tv+=`&sort_by=${sortBy}`
        }
        if(releaseDate!==undefined){
            tv+=`&release_date.lte=${releaseDate}`
        }
        if (category.length > 0) {
            tv += `&with_genres=${category.join("%2")}`;
        }
        console.log(tv)
        const response = await axios.get(tv);
        setFilteredData(response.data.results);
        return response.data.results;
    }




    const movies = useQuery({
        queryKey: ["filteredMovies", sortBy, releaseDate, category],
        queryFn: fetchFilteredMovies,
        enabled: filtersApplied  && isMoviePage
    });
    const series = useQuery({
        queryKey: ["fetchFilterSeries", sortBy, releaseDate, category],
        queryFn: fetchFilterSeries,
        enabled: filtersApplied && isSeriesPage
    });
    const genre = useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,

    });
    const applyFilters=(e: SyntheticEvent)=>{
        e.preventDefault()
        setFiltersApplied(true)
    }



    return (
        <form onSubmit={applyFilters}>
            <Box
                sx={{
                    width: "300px",
                    padding: "16px",
                    backgroundColor:'white',
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    overflowY: "auto",
                    maxHeight: "90vh",
                }}
            >
                {/* Sort Section */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Sort by:</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Select fullWidth defaultValue="popularity.desc" onChange={handleSortChange}>
                            <MenuItem value="popularity.desc" >Rating Descending</MenuItem>
                            <MenuItem value="popularity.asc" >Rating Ascending</MenuItem>
                            <MenuItem value="primary_release_date.desc">Release Date Descending</MenuItem>
                            <MenuItem value="primary_release_date.asc">Release Date Ascending</MenuItem>
                        </Select>
                    </AccordionDetails>
                </Accordion>

                {/* Premier Date Section */}
                <Accordion >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                        <Typography variant="subtitle1">Release date:</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" gutterBottom>
                            Before:
                        </Typography>
                    </AccordionDetails>
                    <AccordionDetails>
                        <TextField type="date" fullWidth variant="outlined" size="small" onChange={handleReleaseChange} />
                    </AccordionDetails>
                </Accordion>

                {/* Genres Section */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Category</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {genres.map((genre) => (
                                <Button key={genre.id} value={genre.name} onClick={() => {
                                    handleClickButton(genre.name,genre.id);
                                }}   className={`button ${clickedButton[genre.name] ? 'clicked' : ''}`}>{genre.name} </Button>
                            ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Button
                    onClick={applyFilters}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}

                >
                    Apply
                </Button>
            </Box>
        </form>
    )
}