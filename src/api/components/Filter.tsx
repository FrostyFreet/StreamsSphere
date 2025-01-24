
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Button,
    Chip,
    Select,
    MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useState} from "react";
import {log} from "video.js";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {moviesType} from "../../types.tsx";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export default function Filter({setFilteredData}){
    const queryClient = useQueryClient()
    const[sortBy,setSortBy]=useState<string>("popularity.desc")
    const[releaseDate,setReleaseDate]=useState<Date>()
    const[category,setCategory]=useState<string[]>([])
    const[clickedButton,setClickedButton]= useState<{ [ key:string]: boolean }>({})
    const[filtersApplied,setFiltersApplied]=useState<boolean>(false)
    const [genres, setGenres] = useState([]);

    let url=`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_APIKEY}&sort_by&include_adult=true`

    const handleSortChange=(e)=>{
        setSortBy(e.target.value)
    }
    const handleReleaseChange=(e)=>{
        setReleaseDate(e.target.value)
    }

    const handleClickButton = (genre: string,id:number) => {
        setClickedButton((prevState) => ({
            ...prevState,
            [genre]: !prevState[genre]
        }));

        setCategory((prevState) => {
            if (prevState.includes(id)) {
                return prevState.filter((item) => item !== id);
            } else {
                return [...prevState, id];
            }
        });
    };
    const fetchGenres=()=>{
        axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
            .then((res) => setGenres(res.data.genres))
            .catch((err) => console.error(err));
    }

    const fetchFilteredMovies=async ()=>{
        if(sortBy){
            url+=`&sort_by=${sortBy}`
        }

        if(releaseDate!==undefined){
            url+=`&release_date.lte=${releaseDate}`
        }
        if (category.length > 0) {
            url += `&with_genres=${category.join("%2")}`;
        }
        url+=`&api_key=${import.meta.env.VITE_TMDB_APIKEY}`
        console.log(url)
        const response = await axios.get(url);
        setFilteredData(response.data.results);
        return response.data.results;
    }
    const filtered = useQuery({
        queryKey: ["filteredMovies", sortBy, releaseDate, category],
        queryFn: fetchFilteredMovies,
        enabled: filtersApplied
    });
    const genre = useQuery({
        queryKey: ["genres"],
        queryFn: fetchGenres,

    });
    const applyFilters=(e)=>{
        e.preventDefault()
        console.log(url)
        setFiltersApplied(true)
    }
    console.log(category)


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
                <Accordion defaultExpanded>
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