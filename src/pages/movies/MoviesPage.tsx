import {ChangeEvent, useState} from "react";
import {FilterProps, moviesType} from "../../types.tsx";
import {Box, IconButton, Pagination, Skeleton, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Navbar from "../../components/Navbar.tsx";
import {fetchMoviesPerPage} from "../../api/moviesandseries/fetchMoviesPerPage.tsx";
import Filter from "../../components/Filter.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchFilteredMoviesPerPage} from "../../api/movies/fetchFilteredMoviesPerPage.tsx";
import MoviesDialogMenu from "./MoviesDialogMenu.tsx";
import {fetchUser} from "../../api/auth/fetchUser.tsx";
import {Navigate, useNavigate} from "react-router";
import {addToWatchList} from "../../api/watchlist/addToWatchList.tsx";
import {fetchSession} from "../../api/auth/fetchSession.tsx";

export default function MoviesPage<T>({sortBy,setSortBy,releaseDate,
                                          setReleaseDate,
                                          category,
                                          setCategory,
                                          genres,
                                          setGenres}:FilterProps<T>) {
    const[movies,setMovies]=useState<moviesType[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const[clickedMovie,setClickedMovie]=useState<moviesType | undefined>()
    const [filteredData,setFilteredData]=useState<moviesType[]>([])
    const navigate=useNavigate()

    const {data:session}=useQuery({
        queryKey: ['session'],
        queryFn:fetchSession,
    });

    const {refetch}= useQuery({
        queryKey: ['movies',page],
        queryFn: () => fetchMoviesPerPage(setMovies, page, setTotalPages),
        refetchOnWindowFocus:false
    })
    const{refetch:refetchFiltered}=useQuery({
        queryKey: ['filteredMovies',page],
        queryFn: () => fetchFilteredMoviesPerPage(page, setTotalPages,sortBy,setFilteredData),
        refetchOnWindowFocus:false })
    const handleClickOpen = (id:number) => {
        const found=movies.find((movie)=>movie.id===id)
        setClickedMovie(found)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};
    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
        refetch()
        refetchFiltered()
    };

    const{data:user}=useQuery({
        queryKey: ['users'],
        queryFn: () => fetchUser()
    })

    const addMovieToWatchList=(id:number,title:string)=>{
        if(user) {
            addToWatchList({movie_id: id, title, type: "movie", user_id: user.user?.id})
        }
        else{
            <Navigate to={"/"}/>
        }
    }

    if(!session){
        navigate("/")
    }

    return (
        <>
            <Navbar />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: "16px",
                    textAlign: "center",
                }}
            >
                <Box sx={{ paddingRight: "10px" }}>
                    <Filter setFilteredData={setFilteredData} sortBy={sortBy} setSortBy={setSortBy} setPage={setPage} genres={genres}
                            setReleaseDate={setReleaseDate} setCategory={setCategory} setGenres={setGenres} category={category}  releaseDate={releaseDate}/>
                </Box>

                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    {filteredData && sortBy!="popularity.desc" || releaseDate!=undefined || category!=undefined || genres!=undefined
                        ? filteredData.map((filtered:moviesType) => (
                            <Grid key={filtered.id} size={{xs:12, sm:6, md:4, lg:2.4}}>
                                <Box
                                    position="relative"
                                    sx={{
                                        width: "100%",
                                        maxWidth: "300px",
                                        height: "auto",
                                        borderRadius: "8px",
                                        overflow: "hidden",

                                    }}
                                >
                                    {filtered.poster_path?
                                    <img
                                        alt={filtered.title}
                                        style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "3px 3px 3px black", }}
                                        src={`https://image.tmdb.org/t/p/original/${filtered.poster_path}`}
                                        onClick={() => handleClickOpen(filtered.id)}
                                        loading="lazy"
                                    />
                                        :
                                        <Skeleton variant="rectangular" style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "3px 3px 3px black", }}/>
                                    }

                                    <Box
                                        position="absolute"
                                        top={8}
                                        left={8}
                                        bgcolor="rgba(0, 0, 0, 0.3)"
                                        color="white"
                                        borderRadius="4px"
                                        padding="4px 8px"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <StarIcon sx={{ fontSize: "1rem", marginRight: "4px", color: "gold" }} />
                                        <Typography variant="body2">{filtered.vote_average.toFixed(1)}</Typography>
                                    </Box>

                                    <Box
                                        position="absolute"
                                        top={8}
                                        right={8}

                                        color="white"
                                        borderRadius="4px"
                                        padding="1px 1px"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <IconButton onClick={()=>addMovieToWatchList(filtered.id,filtered.title)}>
                                            <BookmarksIcon sx={{ fontSize: "1rem", marginRight: "4px", color:'white' }} />
                                        </IconButton>
                                    </Box>


                                </Box>
                            </Grid>
                        ))
                        : movies.map((movie:moviesType) => (
                            <Grid key={movie.id} size={{xs:12, sm:6, md:4, lg:2.4}}>
                                <Box
                                    position="relative"
                                    sx={{
                                        width: "100%",
                                        maxWidth: "300px",
                                        height: "auto",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {movie.poster_path?
                                        <img
                                            alt={movie.title}
                                            style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "10px 5px 0px black"}}
                                            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                            onClick={() => handleClickOpen(movie.id)}
                                            loading="eager"
                                        />
                                            :
                                        <Skeleton variant="rectangular" style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "3px 3px 3px black",border:'1px solid black' }}/>
                                    }

                                    <Box
                                        position="absolute"
                                        top={8}
                                        left={8}
                                        bgcolor="rgba(0, 0, 0, 0.5)"
                                        color="white"
                                        borderRadius="4px"
                                        padding="4px 8px"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <StarIcon sx={{ fontSize: "1rem", marginRight: "4px", color: "gold" }} />
                                        <Typography variant="body2">{movie.vote_average.toFixed(1)}</Typography>
                                    </Box>
                                    <Box
                                        position="absolute"
                                        top={8}
                                        right={8}

                                        color="white"
                                        borderRadius="4px"
                                        padding="1px 1px"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <IconButton onClick={()=>addMovieToWatchList(movie.id,movie.title)}>
                                            <BookmarksIcon sx={{ fontSize: "1rem", marginRight: "4px", color:'white' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                </Grid>

                <MoviesDialogMenu open={open} handleClose={handleClose} clickedMovie={clickedMovie}/>

        </Box>
            <Stack spacing={2} sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
                <Pagination count={Math.floor(totalPages/2)} page={page} onChange={handlePageChange} color="secondary" />
            </Stack>
        </>
    )
}