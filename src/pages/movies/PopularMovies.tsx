import {useEffect, useState} from "react";

import {moviesType} from "../../types.tsx";
import Grid from '@mui/material/Grid2';
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import {Link} from "react-router";
import {fetchHomePageMovies} from "../../api/fetchHomePageMovies.tsx";

export default function PopularMovies(){
    const[popularMovies,setPopularMovies]=useState<moviesType[]>([])
    const [open, setOpen] = useState(false);
    const[clickedMovie,setClickedMovie]=useState<moviesType | undefined>()

    useEffect(() => {
        fetchHomePageMovies(setPopularMovies)
    }, []);
    console.log(popularMovies)
    const handleClickOpen = (id:number) => {
        const found=popularMovies.find((movie)=>movie.id===id)
        setClickedMovie(found)
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    console.log(clickedMovie)
    return(
        <>
            <Box sx={{background: "linear-gradient(90deg, #0F2027, #2C5364)", padding: "16px", textAlign: "center",}}>
                <Typography variant="h5" gutterBottom sx={{justifyContent: "center", color: "white", marginBottom: "16px",}}>
                    Popular Movies
                </Typography>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{justifyContent: "center", alignItems: "center",}}>
                    {popularMovies.slice(0, 10).map((movie) => (
                        <Grid sx={{xs:6, sm:4, md:2}} key={movie.id}>
                            <Box position="relative" sx={{width: "100%", maxWidth: "150px", height: "auto", borderRadius: "8px", overflow: "hidden",}}>

                                <img alt={movie.title} style={{width: "100%", height: "auto", borderRadius: "8px",}}
                                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                    onClick={()=>handleClickOpen(movie.id)} loading={"eager"}
                                />

                                <Box position="absolute" top={8} left={8} bgcolor="rgba(0, 0, 0, 0.5)" color="white" borderRadius="4px" padding="4px 8px"
                                    display="flex"
                                    alignItems="center">
                                    <StarIcon sx={{ fontSize: "1rem", marginRight: "4px",color:'gold' }} />
                                    <Typography variant="body2">{movie.vote_average.toFixed(1)}</Typography>
                                </Box>

                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle sx={{ m: 0, p: 2,textAlign:"center",fontWeight:"bold",background: "linear-gradient(90deg, #0F2027, #2C5364)",color:'white' }} id={clickedMovie?.id?.toString()}>
                        {clickedMovie?
                            clickedMovie.title
                            :
                            <Typography>N/A</Typography>
                        }

                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500],})}>
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers sx={{display:'flex',alignItems:'center',background: "linear-gradient(90deg, #0F2027, #2C5364)"}}>
                        <img alt={clickedMovie?.title} style={{width: "25%", height: "auto", borderRadius: "8px",marginLeft:'auto',marginRight:'auto'}}
                             src={`https://image.tmdb.org/t/p/original/${clickedMovie?.poster_path}`} loading={"eager"}
                        />
                        <Typography gutterBottom sx={{color:'white',paddingLeft:'10px',fontSize:'18px',flex:1}}>
                            {clickedMovie?
                                clickedMovie.overview
                                :
                                <Typography>No description found!</Typography>
                            }
                        </Typography>
                        <Box sx={{ textAlign: 'center', width: 'auto', marginTop: '16px' }}>
                            <Link to={`/movies/${clickedMovie?.id}/:${clickedMovie?.title}`}>
                                <Button variant="contained" color="primary">
                                    Watch Now
                                </Button>
                            </Link>

                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>

        </>
    )
}