import {useEffect, useState} from "react";
import {moviesType} from "../../types.tsx";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Pagination,
    Stack,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import {Link} from "react-router";
import Navbar from "../../components/Navbar.tsx";
import {fetchMoviesPerPage} from "../../api/fetchMoviesPerPage.tsx";
import Filter from "../../components/Filter.tsx";
import {useQuery} from "@tanstack/react-query";

export default function MoviesPage() {
    const[movies,setMovies]=useState<moviesType[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const[clickedMovie,setClickedMovie]=useState<moviesType | undefined>()
    const [filteredData,setFilteredData]=useState<moviesType[]>([])


    const query = useQuery({ queryKey: ['movies'], queryFn: () => fetchMoviesPerPage(setMovies, page, setTotalPages) })

    const handleClickOpen = (id:number) => {
        const found=movies.find((movie)=>movie.id===id)
        setClickedMovie(found)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
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
                    <Filter setFilteredData={setFilteredData} />
                </Box>

                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    {filteredData && filteredData.length > 0
                        ? filteredData.map((filtered) => (
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
                                    <img
                                        alt={filtered.title}
                                        style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "3px 3px 3px black", }}
                                        src={`https://image.tmdb.org/t/p/original/${filtered.poster_path}`}
                                        onClick={() => handleClickOpen(filtered.id)}
                                        loading="eager"
                                    />

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
                                        <Typography variant="body2">{filtered.vote_average.toFixed(1)}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))
                        : movies.map((movie) => (
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
                                    <img
                                        alt={movie.title}
                                        style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "10px 5px 0px black"}}
                                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                        onClick={() => handleClickOpen(movie.id)}
                                        loading="eager"
                                    />

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
                                </Box>
                            </Grid>
                        ))}
                </Grid>

                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle
                        sx={{ m: 0, p: 2, textAlign: "center", fontWeight: "bold", color: "black" }}
                        id={clickedMovie?.id?.toString()}
                    >
                        {clickedMovie ? clickedMovie.title : <Typography>N/A</Typography>}
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
                        <img
                            alt={clickedMovie?.title}
                            style={{
                                width: "100%",
                                maxWidth: "200px",
                                height: "auto",
                                borderRadius: "8px",
                                margin: "0 auto",
                                boxShadow: "3px 3px 3px black",
                            }}
                            src={`https://image.tmdb.org/t/p/original/${clickedMovie?.poster_path}`}
                        />
                        <Typography gutterBottom sx={{ color: "black", paddingLeft: { sm: "15px",md:'15px',lg:'15px' },paddingTop:{sm:"25px"}, fontSize: "18px", flex: 1 }}>
                            {clickedMovie && clickedMovie.overview && clickedMovie.overview.length > 0
                                ? clickedMovie.overview
                                : "No description found!"}
                        </Typography>
                        <Box sx={{ textAlign: "center", width: "auto", marginTop: "16px" }}>
                            <Link to={`/movies/${clickedMovie?.id}/${clickedMovie?.title}`}>
                                <Button variant="contained" color="primary">
                                    Watch Now
                                </Button>
                            </Link>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>

            <Stack spacing={2} sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="secondary" />
            </Stack>
        </>
    )
}