import {useEffect, useState} from "react";
import {seriesType} from "../../types.tsx";

import Navbar from "../../api/components/Navbar.tsx";
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Pagination, Skeleton, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import {Link} from "react-router";
import {fetchSeriesPerPage} from "../../api/fetchSeriesPerPage.tsx";
import Filter from "../../api/components/Filter.tsx";

export default function SeriesPage() {
    const[series,setSeries]=useState<seriesType[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const[clickedSeries,setClickedSeries]=useState<seriesType>()
    const [filteredData,setFilteredData]=useState<seriesType[]>([])

    useEffect(() => {
        fetchSeriesPerPage(setSeries,page,setTotalPages)
    }, [page]);
    const handleClickOpen = (id:number) => {
        const found=series.find((series:seriesType)=>series.id===id)
        setClickedSeries(found)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    return(
        <>
            <Navbar/>
            <Box sx={{display:'flex',justifyContent:'center',alignItems:'flex-start',background: "linear-gradient(90deg, #0F2027, #2C5364)", padding: "16px", textAlign: "center",}}>
                <Box sx={{paddingRight:'10px'}}>
                    <Filter setFilteredData={setFilteredData}/>
                </Box>
                <Grid container spacing={1} sx={{justifyContent: "space-between", alignItems: "center",}}>

                    {filteredData && filteredData.length>0 ?
                        (
                            filteredData.map((filtered)=>(
                                <Grid size={{xs:6, sm:4, md:2.4}} key={filtered.id}>
                                    <Box position="relative" sx={{width: "100%", maxWidth: "300px", height: "auto", borderRadius: "8px", overflow: "hidden",}}>

                                        <img alt={filtered.title} style={{width: "100%", height: "auto", borderRadius: "8px",}}
                                             src={`https://image.tmdb.org/t/p/original/${filtered.poster_path}`}
                                             onClick={()=>handleClickOpen(filtered.id)} loading={"eager"}
                                        />

                                        <Box position="absolute" top={8} left={8} bgcolor="rgba(0, 0, 0, 0.5)" color="white" borderRadius="4px" padding="4px 8px"
                                             display="flex"
                                             alignItems="center">
                                            <StarIcon sx={{ fontSize: "1rem", marginRight: "4px",color:'gold' }} />
                                            <Typography variant="body2">{filtered.vote_average.toFixed(1)}</Typography>
                                        </Box>

                                    </Box>
                                </Grid>


                            ))
                        ):(
                            series.map((series) => (
                                <Grid size={{xs:6, sm:4, md:2.4}} key={series.id}>
                                    <Box position="relative" sx={{width: "100%", maxWidth: "300px", height: "auto", borderRadius: "8px", overflow: "hidden",}}>

                                        <img alt={series.title} style={{width: "100%", height: "auto", borderRadius: "8px",}}
                                             src={`https://image.tmdb.org/t/p/original/${series.poster_path}`}
                                             onClick={()=>handleClickOpen(series.id)} loading={"eager"}
                                        />

                                        <Box position="absolute" top={8} left={8} bgcolor="rgba(0, 0, 0, 0.5)" color="white" borderRadius="4px" padding="4px 8px"
                                             display="flex"
                                             alignItems="center">
                                            <StarIcon sx={{ fontSize: "1rem", marginRight: "4px",color:'gold' }} />
                                            <Typography variant="body2">{series.vote_average.toFixed(1)}</Typography>
                                        </Box>

                                    </Box>
                                </Grid>
                    )))}
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
                            {clickedSeries && clickedSeries.overview && clickedSeries.overview.length > 0 ? (
                                clickedSeries.overview
                            ) : (
                                <Typography>No description found!</Typography>
                            )}
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
            <Stack spacing={2} style={{display:'flex',alignItems:'center'}}>
                <Pagination
                    count={Math.floor(totalPages/20)}
                    page={page}
                    onChange={handlePageChange}
                    color="secondary"
                />
            </Stack>

        </>
    )
}