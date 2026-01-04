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

export default function Filter<T>({ setFilteredData, sortBy, setSortBy, setPage, releaseDate, setReleaseDate, category, setCategory, genres, setGenres }: FilterProps<T>) {


    const location = useLocation();
    const isMoviePage = location.pathname === '/movies';
    const isSeriesPage = location.pathname === '/series';
    const isMobile = useMediaQuery("(max-width:750px)");
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
    const handleMenuClose = () => { setAnchorEl(null); };

    const handleSortChange = (e: SelectChangeEvent<string>) => {
        setSortBy(e.target.value);
    };

    const handleReleaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReleaseDate(e.target.value);
    };

    const handleClickButton = (id: number) => {
        setCategory((prevState: number[]) => {
            if (prevState.includes(id)) {
                return prevState.filter((item: number) => item !== id);
            } else {
                return [...prevState, id];
            }
        });
    };

    const fetchGenres = async () => {
        const moviesUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_APIKEY}`;
        const seriesUrl = `https://api.themoviedb.org/3/genre/tv/list?api_key=${import.meta.env.VITE_TMDB_APIKEY}`;

        let responseData = [];
        if (isMoviePage) {
            const response = await axios.get(moviesUrl);
            responseData = response.data.genres;
        } else if (isSeriesPage) {
            const response = await axios.get(seriesUrl);
            responseData = response.data.genres;
        }

        // State frissítése itt még elfogadható, vagy useEffect-ben lehetne
        if (setGenres) setGenres(responseData);
        return responseData || [];
    };

    // JAVÍTÁS 2: URL paraméterek javítása (vessző, dátum check, adult check)
    // JAVÍTÁS 3: Ez csak visszaadja az adatot, nem állít state-et (side-effect mentes)
    const fetchFilteredMovies = async () => {
        let movie = `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_APIKEY}&include_adult=false`;

        if (sortBy) {
            movie += `&sort_by=${sortBy}`;
        }

        if (releaseDate) { // Csak ha nem üres string
            movie += `&release_date.lte=${releaseDate}`;
        }

        if (category.length > 0) {
            movie += `&with_genres=${category.join(",")}`; // Helyes elválasztó
        }

        const response = await axios.get(movie);
        return response.data.results;
    };

    const fetchFilterSeries = async () => {
        let tv = `https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_APIKEY}&include_adult=false`; // False legyen, ne True

        if (sortBy) {
            tv += `&sort_by=${sortBy}`;
        }
        if (releaseDate) {
            tv += `&release_date.lte=${releaseDate}`;
        }
        if (category.length > 0) {
            tv += `&with_genres=${category.join(",")}`;
        }

        const response = await axios.get(tv);
        return response.data.results;
    };

    // React Query hookok - enabled: false, mert gombra hívjuk őket
    const { refetch: refetchFilteredMovies } = useQuery({
        queryKey: ["filteredMovies"], // Opcionális: a függőségeket (category, sortBy) ideírhatod, ha cache-elni akarod
        queryFn: fetchFilteredMovies,
        enabled: false,
        refetchOnWindowFocus: false
    });

    const { refetch: refetchFilteredSeries } = useQuery({
        queryKey: ["fetchFilterSeries"],
        queryFn: fetchFilterSeries,
        enabled: false,
        refetchOnWindowFocus: false
    });

    useQuery({
        queryKey: ["genres", isMoviePage, isSeriesPage],
        queryFn: fetchGenres,
        refetchOnWindowFocus: false,
        enabled: isMoviePage || isSeriesPage
    });

    const applyFilters = async (e: SyntheticEvent) => {
        e.preventDefault();

        let newData = [];

        if (isMoviePage) {
            const result = await refetchFilteredMovies();
            if (result.data) newData = result.data;
        } else if (isSeriesPage) {
            const result = await refetchFilteredSeries();
            if (result.data) newData = result.data;
        }

        if (setFilteredData) {
            setFilteredData(newData);
        }

        if (setPage) {
            setPage(1);
        }
        handleMenuClose();
    };

    return (
        <form onSubmit={applyFilters}>
            {!isMobile ?
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "300px",
                        padding: "20px",
                        backgroundColor: 'white',
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
                            <Select fullWidth value={sortBy} onChange={handleSortChange}>
                                <MenuItem value="popularity.desc">Rating Descending</MenuItem>
                                <MenuItem value="popularity.asc">Rating Ascending</MenuItem>
                                <MenuItem value="primary_release_date.desc">Release Date Descending</MenuItem>
                                <MenuItem value="primary_release_date.asc">Release Date Ascending</MenuItem>
                            </Select>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">Release date:</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" gutterBottom>
                                Before:
                            </Typography>
                        </AccordionDetails>
                        <AccordionDetails>
                            <TextField
                                type="date"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={releaseDate || ''} // Controlled input
                                onChange={handleReleaseChange}
                            />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">Category</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {genres.map((genre: genreType) => {
                                    // JAVÍTÁS 5: A gomb stílusa a category tömbtől függ
                                    const isActive = category.includes(genre.id);
                                    return (
                                        <Button
                                            key={genre.id}
                                            onClick={() => handleClickButton(genre.id)}
                                            variant={isActive ? "contained" : "outlined"}
                                            // Megtarthatod a class nevet, ha a CSS-ben van stílus rá, de a variant tisztább
                                            className={`button ${isActive ? 'clicked' : ''}`}
                                        >
                                            {genre.name}
                                        </Button>
                                    );
                                })}
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
                        {/* Mobile Sort Section */}
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

                        {/* Mobile Release Date Section */}
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
                                    value={releaseDate || ''}
                                    onChange={handleReleaseChange}
                                />
                            </AccordionDetails>
                        </Accordion>

                        {/* Mobile Genres Section */}
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1">Category</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {genres.map((genre: genreType) => {
                                        const isActive = category.includes(genre.id);
                                        return (
                                            <Button
                                                key={genre.id}
                                                variant={isActive ? "contained" : "outlined"}
                                                onClick={() => handleClickButton(genre.id)}
                                                sx={{
                                                    borderRadius: "20px",
                                                    textTransform: "none",
                                                }}
                                            >
                                                {genre.name}
                                            </Button>
                                        );
                                    })}
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Button
                            onClick={(e) => {
                                applyFilters(e);
                                handleMenuClose();
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
    );
}