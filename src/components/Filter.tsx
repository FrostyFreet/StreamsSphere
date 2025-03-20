import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    SelectChangeEvent,
    useMediaQuery, IconButton, Menu,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, {SyntheticEvent, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useLocation} from "react-router";
import {FilterProps, genreType} from "../types.tsx";
import FilterListIcon from '@mui/icons-material/FilterList';
let movie=`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_APIKEY}&sort_by&include_adult=false`
let tv=`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_APIKEY}&sort_by&include_adult=false`
export default function Filter<T>({ setFilteredData,sortBy,setSortBy,setPage,releaseDate,setReleaseDate,category,setCategory,genres,setGenres }: FilterProps<T>) {

    const[clickedButton,setClickedButton]= useState<{ [ key:string]: boolean }>({})
    const[filtersApplied,setFiltersApplied]=useState<boolean>(false)

    const location=useLocation()
    const isMoviePage = location.pathname === '/movies'
    const isSeriesPage = location.pathname === '/series'
    const isMobile = useMediaQuery("(max-width:750px)")
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const handleMenuOpen = (event:React.MouseEvent<HTMLElement>) => {setAnchorEl(event.currentTarget)}
    const handleMenuClose = () => {
        setAnchorEl(null)}

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
        if (setFilteredData) {
            setFilteredData(response.data.results);
        }
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
        if (setFilteredData) {
            setFilteredData(response.data.results);
        }
        return response.data.results;
    }

    const { refetch: refetchFilteredMovies } = useQuery({
        queryKey: ["filteredMovies"],
        queryFn: fetchFilteredMovies,
        enabled: filtersApplied  && isMoviePage,
        refetchOnWindowFocus:false
    });
    const { refetch: refetchFilteredSeries } = useQuery({
        queryKey: ["fetchFilterSeries"],
        queryFn: fetchFilterSeries,
        enabled: filtersApplied && isSeriesPage,
        refetchOnWindowFocus:false
    });
     useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,
         refetchOnWindowFocus:false

    });


    const applyFilters=async (e: SyntheticEvent)=>{
        e.preventDefault()

        if (isMoviePage) {
            await refetchFilteredMovies();
        } else if (isSeriesPage) {
            await refetchFilteredSeries();
        }
        if (setPage) {
            setPage(1)
        }
        setFiltersApplied(true)
        handleMenuClose();
    }


    return (
        <form onSubmit={applyFilters}>
            {!isMobile?
            <Box
                sx={{
                    display:"flex",
                    flexDirection: "column",
                    width:"300px",
                    padding: "20px",
                    backgroundColor:'white',
                    borderRadius: "8px",
                    boxShadow: "0 5px 25px rgba(0, 0, 0, 0.9)",

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


                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Category</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {genres.map((genre:genreType) => (
                                <Button key={genre.id} value={genre.name} onClick={() => {
                                    handleClickButton(genre?.name,genre.id);
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
                :
                <Box>
                    <IconButton onClick={handleMenuOpen}>
                        <FilterListIcon id="burger-menu" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {/* Sort Section */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">Sort by:</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Select fullWidth value={sortBy} onChange={handleSortChange}>
                                    <MenuItem value="popularity.desc">Rating Descending</MenuItem>
                                    <MenuItem value="popularity.asc">Rating Ascending</MenuItem>
                                    <MenuItem value="primary_release_date.desc">Release Date Descending</MenuItem>
                                    <MenuItem value="primary_release_date.asc">Release Date Ascending</MenuItem>
                                </Select>
                            </AccordionDetails>
                        </Accordion>

                        {/* Release Date Section */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">Release date:</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body2" gutterBottom>
                                    Before:
                                </Typography>
                                <TextField
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={releaseDate}
                                    onChange={handleReleaseChange}
                                />
                            </AccordionDetails>
                        </Accordion>

                        {/* Genres Section */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">Category</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {genres.map((genre: genreType) => (
                                        <Button
                                            key={genre.id}
                                            variant={clickedButton[genre.name] ? "contained" : "outlined"}
                                            onClick={() => handleClickButton(genre.name, genre.id)}
                                            sx={{
                                                borderRadius: "20px",
                                                textTransform: "none",
                                            }}
                                        >
                                            {genre.name}
                                        </Button>
                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Button
                            onClick={(e) => {
                                applyFilters(e)
                                handleMenuClose()
                            }}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2, mx: 2 }}
                        >
                            Apply
                        </Button>
                    </Menu>
                </Box>
            }
        </form>
    )
}