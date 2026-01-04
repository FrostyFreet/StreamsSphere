import {ChangeEvent, useMemo, useState} from "react";
import {bookmarkedType, FilterProps, moviesType} from "../../types.tsx";
import {Box, IconButton, Pagination, Skeleton, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Navbar from "../../components/Navbar.tsx";
import {fetchMoviesPerPage} from "../../api/moviesandseries/fetchMoviesPerPage.tsx";
import Filter from "../../components/Filter.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchFilteredMoviesPerPage} from "../../api/movies/fetchFilteredMoviesPerPage.tsx";
import MoviesDialogMenu from "./MoviesDialogMenu.tsx";
import {useNavigate} from "react-router";
import {addToWatchList} from "../../api/watchlist/addToWatchList.tsx";
import {fetchSession} from "../../api/auth/fetchSession.tsx";
import { fetchBookmarked } from "../../api/watchlist/fetchWatchList.tsx";

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
    })

    const queryClient = useQueryClient()
    const userId = session?.user?.id;
    const { data: bookmarkData = [] } = useQuery<bookmarkedType[]>({
        queryKey: ['watchlist', userId],
        queryFn: () => fetchBookmarked(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5
    })

    const watchedMovieIds = useMemo(() => {
        const ids = bookmarkData
            .filter(item => item.type === 'movie')
            .map(item => item.movie_id);
        return new Set(ids);
    }, [bookmarkData])


    const {refetch}= useQuery({
        queryKey: ['movies',page, sortBy],
        queryFn: () => fetchMoviesPerPage(setMovies, page, setTotalPages, sortBy),
        refetchOnWindowFocus:false
    })
    const{refetch:refetchFiltered}=useQuery({
        queryKey: ['filteredMovies',page],
        queryFn: () => fetchFilteredMoviesPerPage(page, setTotalPages, sortBy, setFilteredData, category, releaseDate),
        refetchOnWindowFocus:false })

    const handleClickOpen = (item: moviesType) => {
        setClickedMovie(item)
        setOpen(true)
    }

    const handleClose = () => {setOpen(false);};
    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
        refetch()
        refetchFiltered()
    };


    const addMovieToWatchList=async (id:number,title:string)=>{
        if (!userId) {
            navigate("/")
            return
        }
        if (watchedMovieIds.has(id)) {
            return
        }
        try {
            await addToWatchList({ movie_id: id, title, type: "movie", user_id: userId });
            await queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        } catch (error) {
            console.error("Error while adding to bookmark:", error);
        }
    }

    if(!session){
        navigate("/")
    }
    const renderMovieCard = (movie: moviesType, loadingAttr: "lazy" | "eager") => {
        const isWatched = watchedMovieIds.has(movie.id);

        return (
            <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
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
                    {movie.poster_path ?
                        <img
                            alt={movie.title}
                            style={{ width: "100%", height: "auto", borderRadius: "8px", boxShadow: "3px 3px 3px black", }}
                            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                            onClick={() => handleClickOpen(movie)}
                            loading={loadingAttr}
                        />
                        :
                        <Skeleton variant="rectangular" style={{ width: "100%", height: "auto", borderRadius: "8px", boxShadow: "3px 3px 3px black", }} />
                    }

                    <Box
                        position="absolute"
                        top={8}
                        left={8}
                        bgcolor="rgba(0, 0, 0, 0.6)"
                        color="white"
                        borderRadius="4px"
                        padding="4px 8px"
                        display="flex"
                        alignItems="center"
                    >
                        <StarIcon sx={{ fontSize: "1rem", marginRight: "4px", color: "gold" }} />
                        <Typography variant="body2">{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</Typography>
                    </Box>

                    <Box
                        position="absolute"
                        top={8}
                        right={8}
                        bgcolor="rgba(0,0,0,0.3)"
                        borderRadius="50%"
                        padding="4px"
                        display="flex"
                        alignItems="center"
                    >
                        <IconButton onClick={() => addMovieToWatchList(movie.id, movie.title)} size="small">
                            <BookmarksIcon
                                sx={{
                                    fontSize: "1.2rem",
                                    color: isWatched ? 'gold' : 'white',
                                    transition: 'color 0.3s ease'
                                }}
                            />
                        </IconButton>
                    </Box>
                </Box>
            </Grid>
        );
    };


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
                            setReleaseDate={setReleaseDate} setCategory={setCategory} setGenres={setGenres} category={category} releaseDate={releaseDate} />
                </Box>

                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    {filteredData && filteredData.length > 0
                        ? filteredData.map((movie) => renderMovieCard(movie, "lazy"))
                        : movies.map((movie) => renderMovieCard(movie, "eager"))
                    }
                </Grid>

                <MoviesDialogMenu open={open} handleClose={handleClose} clickedMovie={clickedMovie} />

            </Box>
            <Stack spacing={2} sx={{ display: "flex", alignItems: "center", marginTop: "16px", paddingBottom: "20px" }}>
                <Pagination count={totalPages > 500 ? 500 : totalPages} page={page} onChange={handlePageChange} color="secondary" />
            </Stack>
        </>
    )
}