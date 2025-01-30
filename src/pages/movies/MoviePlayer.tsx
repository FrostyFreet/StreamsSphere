import {useParams} from "react-router";
import Box from '@mui/material/Box';
import Navbar from "../../components/Navbar.tsx";
import {Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {fetchRecommendedMovies} from "../../api/fetchRecommendedMovies.tsx";
import {moviesType} from "../../types.tsx";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import '../../App.scss'
import Iframe from 'react-iframe'
import MoviesDialogMenu from "./MoviesDialogMenu.tsx";

export default function MoviePlayer(){
    const {id} = useParams();
    const[recommendedMovies,setRecommendedMovies]=useState<moviesType[]>([])
    const [open, setOpen] = useState(false);
    const[clickedMovie,setClickedMovie]=useState<moviesType | undefined>()


    const handleClickOpen = (id:number) => {
        const found=recommendedMovies.find((movie:moviesType)=>movie.id===id)
        setClickedMovie(found)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};
    console.log(open)
    useEffect(() => {
        fetchRecommendedMovies(setRecommendedMovies)
    }, [id]);


    return (
        <>
            <Navbar/>
            <Box style={{display:'flex', justifyContent:'center',paddingBottom:'50px',height:'50vh'}}>
                <Iframe
                    url={`https://vidlink.pro/movie/${id}`}
                    width={'1000px'}
                    allowFullScreen={true}
                    loading={'eager'}
                />
            </Box>

            <Typography variant={"h4"} style={{paddingBottom:'0',marginLeft:'55px'}}>Recommended by others</Typography>
            <Box sx={{display:'flex',justifyContent:'center',alignItems:'center', padding: "16px",textAlign: "center",}}>
                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{justifyContent: "center", alignItems: "center",}}>
                            {recommendedMovies.slice(0, 8).map((movie) => (
                                <Grid sx={{xs:6, sm:4, md:2}} key={movie.id}>
                                    <Box position="relative" sx={{width: "100%", maxWidth: "200px", height: "auto", borderRadius: "8px", overflow: "hidden",}}>

                                        <img alt={movie.title}
                                             style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "3px 3px 3px black"}}

                                             src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                             onClick={()=>handleClickOpen(movie.id)}
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
                        <MoviesDialogMenu open={open} handleClose={handleClose} clickedMovie={clickedMovie}/>
            </Box>
        </>
    );
}
