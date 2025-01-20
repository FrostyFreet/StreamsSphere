import {Link, useParams} from "react-router";
import {useEffect, useState} from "react";
import {seriesDetailTypes, seriesType} from "../../types.tsx";
import Navbar from "../../api/components/Navbar.tsx";
import Box from "@mui/material/Box";
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import {fetchRecommendedSeries} from "../../api/fetchRecommendedSeries.tsx";
import {fetchSeriesDetail} from "../../api/fetchSeriesDetail.tsx";
import '../../App.css'

export default function SeriesPlayer(){
    const {id} = useParams();
    const[recommendedSeries,setRecommendedSeries]=useState<seriesType[]>([])
    const [open, setOpen] = useState(false);
    const[clickedSeries,setClickedSeries]=useState<seriesType>()
    const[seriesDetail,setSeriesDetail]=useState<seriesDetailTypes[]>([])

    const handleClickOpen = (id:number) => {
        const found=recommendedSeries.find((series:seriesType)=>series.id===id)
        setClickedSeries(found)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};

    useEffect(() => {
        fetchRecommendedSeries(setRecommendedSeries)
        fetchSeriesDetail(setSeriesDetail,id)
    }, [id]);
    console.log(seriesDetail)
    return (
        <>
            <Navbar/>
            <Box style={{display:'flex', justifyContent:'center',paddingBottom:'50px',height:'50vh'}}>
                <iframe src={`https://vidsrc.cc/v2/embed/tv/${id}?autoPlay=false`}
                        className={'responsive-iframe'} allowFullScreen={true} controls>
                </iframe>
            </Box>

            <Typography variant={"h4"} style={{paddingBottom:'0',marginLeft:'55px',paddingTop:'25px'}}>Recommended by others</Typography>
            <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',background: "linear-gradient(90deg, #0F2027, #2C5364)", padding: "16px",textAlign: "center",}}>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{justifyContent: "center", alignItems: "center",}}>
                    {recommendedSeries.slice(0, 8).map((series:seriesType) => (
                        <Grid sx={{xs:6, sm:4, md:2}} key={series.id}>
                            <Box position="relative" sx={{width: "100%", maxWidth: "180px", height: "auto", borderRadius: "8px", overflow: "hidden",}}>

                                <img alt={series.name} style={{width: "100%", height: "auto", borderRadius: "8px",}}
                                     src={`https://image.tmdb.org/t/p/original/${series.poster_path}`}
                                     onClick={()=>handleClickOpen(series.id)}
                                />

                                <Box position="absolute" top={8} left={8} bgcolor="rgba(0, 0, 0, 0.5)" color="white" borderRadius="4px" padding="4px 8px"
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
                        <img alt={clickedSeries?.name} style={{width: "25%", height: "auto", borderRadius: "8px",marginLeft:'auto',marginRight:'auto'}}
                             src={`https://image.tmdb.org/t/p/original/${clickedSeries?.poster_path}`}
                        />
                        <Typography gutterBottom sx={{color:'white',paddingLeft:'10px',fontSize:'18px',flex:1}}>
                            {clickedSeries && clickedSeries.overview && clickedSeries.overview.length>0?
                                clickedSeries.overview
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
    );
}