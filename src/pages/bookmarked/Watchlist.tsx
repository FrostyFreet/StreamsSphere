import {useQuery} from "@tanstack/react-query";

import {fetchBookmarked} from "../../api/watchlist/fetchWatchList.tsx";
import {bookmarkedType} from "../../types.tsx";
import Navbar from "../../components/Navbar.tsx";
import axios from "axios";
import {Box, Button, IconButton, Typography} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import Grid from "@mui/material/Grid2";
import {useState} from "react";
import SeriesDialogMenu from "../series/SeriesDialogMenu.tsx";
import MoviesDialogMenu from "../movies/MoviesDialogMenu.tsx";
import Modal from '@mui/material/Modal';
import {deleteFromWatchList} from "../../api/watchlist/deleteFromWatchList.tsx";
import {fetchUser} from "../../api/auth/fetchUser.tsx";

export default function Watchlist(){
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const[clickedItem,setClickedItem]=useState<bookmarkedType>()
    const[toBeDeletedItem,setToBeDeletedItem]=useState<number |null>(null)

    const {data: user } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUser,
    });

    const id:string | undefined=user?.user?.id
    const{data=[],refetch}=useQuery<bookmarkedType[]>({
        queryKey: ['BookmarkedData'],
        queryFn: ()=>fetchBookmarked(id)
    })

    const { data: detailsData } = useQuery({
        queryKey: ['BookmarkedDetails', data],
        queryFn: async () => {
            const movieRequests = data
                .filter((item) => item.type === "movie")
                .map((item) =>
                    axios.get(`https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
                );

            const seriesRequests = data
                .filter((item) => item.type === "tvShow")
                .map((item) =>
                    axios.get(`https://api.themoviedb.org/3/tv/${item.movie_id}?api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
                );

            const [movieResponses, seriesResponses] = await axios.all([
                axios.all(movieRequests),
                axios.all(seriesRequests),
            ]);

            return {
                movies: movieResponses.map((res) => res.data),
                series: seriesResponses.map((res) => res.data),
            };
        },
        enabled: data.length > 0
    });

    const results = [
        ...(detailsData?.movies.map(movie=>({...movie,type:"movie"})) || []),
        ...(detailsData?.series.map(series=>({...series,type:"tvShow"})) || []),
    ];

    const handleClickOpen = (id:number) => {
        const found=results.find((i:bookmarkedType)=>i.id===id)
        setClickedItem(found)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};

    const handleModelClose = () => {setOpenModal(false);};
    const openModalMenu=(id:number)=>{
        setOpenModal(true)
        setToBeDeletedItem(id);
    }

    return(
        <>
            <Navbar/>
            <Typography variant={"h4"} sx={{textAlign:'center',paddingBottom:"15px",fontWeight:"bold"}}>Watch your favourite movies right now</Typography>

            <Grid container spacing={1} sx={{ alignItems: "center" }}>
                {results && Array.isArray(results) && results.map((i:bookmarkedType) => (
                    <Grid key={i.id} size={{xs:12, sm:6, md:4, lg:1.5}}>
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
                                alt={i.title || i.name}
                                style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "3px 3px 3px black", }}
                                src={`https://image.tmdb.org/t/p/original/${i.poster_path}`}
                                onClick={() => handleClickOpen(i.id!)}
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
                                <Typography variant="body2">{i.vote_average!.toFixed(1)}</Typography>
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
                                <IconButton onClick={()=>openModalMenu(i.id!)}>
                                    <BookmarksIcon sx={{ fontSize: "1rem", marginRight: "4px", color:'white' }} />
                                </IconButton>
                                <Modal
                                    open={openModal}
                                    onClose={handleModelClose}
                                    aria-labelledby="bookmark-delete-confirmation"
                                    aria-describedby="bookmark-delete-confirmation"
                                    BackdropProps={{
                                        sx: { backgroundColor: "rgba(0, 0, 0, 0.05)" }, // Lighter background
                                    }}
                                >
                                    <Box sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 250,
                                        bgcolor: "white",
                                        boxShadow: 24,
                                        p: 3,
                                        borderRadius: 2,
                                    }}>
                                        <Typography id="bookmark-delete-confirmation" variant="h6" component="h2">
                                            Are you sure you want to delete this item from your watchlist?
                                        </Typography>
                                        <Box sx={{display:'flex',justifyContent:'center',gap:'35px',paddingTop:'5px'}}>
                                            <Button variant={"outlined"} onClick={()=>{deleteFromWatchList(toBeDeletedItem);handleModelClose();refetch()}}>Yes</Button>
                                            <Button variant={"outlined"} onClick={()=>setOpenModal(false)}>No</Button>
                                        </Box>

                                    </Box>
                                </Modal>
                            </Box>

                        </Box>
                    </Grid>
            ))}
            </Grid>
            {clickedItem && clickedItem.type==="movie" ?
                <MoviesDialogMenu open={open} handleClose={handleClose} clickedMovie={clickedItem}/>

                :
                <SeriesDialogMenu open={open} handleClose={handleClose} clickedSeries={clickedItem}/>


            }

        </>
    )
}