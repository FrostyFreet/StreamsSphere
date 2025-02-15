import {useState} from "react";
import {seriesType} from "../../types.tsx";
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import {Link} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {fetchHomePageSeries} from "../../api/series/fetchHomePageSeries.tsx";

export default function PopularSeries(){
    const[popularSeries,setPopularSeries]=useState<seriesType[]>([])
    const [open, setOpen] = useState(false);
    const[clickedSeries,setClickedSeries]=useState<seriesType>()



    useQuery({ queryKey: ['HomePageSeries'], queryFn: () => fetchHomePageSeries(setPopularSeries) })

    const handleClickOpen = (id:number) => {
        const found=popularSeries.find((series:seriesType)=>series.id===id)
        setClickedSeries(found)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};

    return(
        <>
            <Box
                sx={{background: "linear-gradient(90deg, #0F2027, #2C5364)", padding: "16px", textAlign: "center",}}>
                <Typography variant="h5" gutterBottom sx={{justifyContent: "center", color: "white", marginBottom: "16px",}}>
                    Popular TV Shows
                </Typography>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{justifyContent: "center", alignItems: "center",}}>
                    {popularSeries.slice(0, 10).map((series) => (
                        <Grid sx={{xs:6, sm:4, md:2}} key={series.id}>
                            <Box position="relative" sx={{width: "100%", maxWidth: "150px", height: "auto", borderRadius: "8px", overflow: "hidden",}}>
                                {series?.poster_path && series?.poster_path.length > 0 ?
                                    <img alt={series.name} style={{width: "100%", height: "auto", borderRadius: "8px",}}
                                         src={`https://image.tmdb.org/t/p/original/${series.poster_path}`}
                                         loading={"eager"} onClick={() => handleClickOpen(series.id)}
                                    />
                                    :
                                    <Skeleton variant="rectangular" width={"100%"} height={"auto"}></Skeleton>

                                }

                                {/* Star icon and number overlay */}
                                <Box position="absolute" top={8} left={8} bgcolor="rgba(0, 0, 0, 0.5)" color="white"
                                     borderRadius="4px" padding="4px 8px"
                                     display="flex"
                                    alignItems="center">
                                    <StarIcon sx={{ fontSize: "1rem", marginRight: "4px",color:'gold' }} />
                                    <Typography variant="body2">{series.vote_average.toFixed(1)}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle sx={{ m: 0, p: 2,textAlign:"center",fontWeight:"bold",background: "linear-gradient(90deg, #0F2027, #2C5364)",color:'white' }} id={clickedSeries?.id?.toString()}>
                        {clickedSeries?
                            clickedSeries.name
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
                        {clickedSeries?.poster_path && clickedSeries?.poster_path.length > 0 ?
                            <img alt={clickedSeries?.name} style={{width: "25%", height: "auto", borderRadius: "8px", marginLeft: 'auto', marginRight: 'auto'}}
                                 src={`https://image.tmdb.org/t/p/original/${clickedSeries?.poster_path}`}
                                 loading={"eager"}
                            />
                            :
                            <Skeleton variant="rectangular" width={"25%"} height={"auto"}></Skeleton>
                        }
                        <Typography gutterBottom sx={{color: 'white', paddingLeft: '10px', fontSize: '18px', flex: 1}}>
                            {clickedSeries ?
                                clickedSeries?.overview
                                :
                                <Typography>No description found!</Typography>
                            }
                        </Typography>
                        <Box sx={{ textAlign: 'center', width: 'auto', marginTop: '16px' }}>
                            <Link to={`/series/${clickedSeries?.id}/${clickedSeries?.name}`}>
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