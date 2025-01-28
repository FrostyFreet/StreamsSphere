import {useEffect, useState} from "react";
import {seriesType} from "../../types.tsx";
import Navbar from "../../components/Navbar.tsx";
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Pagination,Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import {Link} from "react-router";
import {fetchSeriesPerPage} from "../../api/fetchSeriesPerPage.tsx";
import Filter from "../../components/Filter.tsx";

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
                                        minWidth:"300px",
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
                        : series.map((series) => (
                            <Grid key={series.id} size={{xs:12, sm:6, md:4, lg:2.4}}>
                                <Box
                                    position="relative"
                                    sx={{
                                        width: "100%",
                                        maxWidth: "300px",
                                        minWidth:"300px",
                                        height: "auto",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        alt={series.title}
                                        style={{ width: "100%", height: "auto", borderRadius: "8px",boxShadow: "10px 5px 0px black"}}
                                        src={`https://image.tmdb.org/t/p/original/${series.poster_path}`}
                                        onClick={() => handleClickOpen(series.id)}
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
                                        <Typography variant="body2">{series.vote_average.toFixed(1)}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                </Grid>

                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle
                        sx={{ m: 0, p: 2, textAlign: "center", fontWeight: "bold", color: "black" }}
                        id={clickedSeries?.id?.toString()}
                    >
                        {clickedSeries ? clickedSeries.name : <Typography>N/A</Typography>}
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
                            alt={clickedSeries?.name}
                            style={{
                                width: "100%",
                                maxWidth: "200px",
                                height: "auto",
                                borderRadius: "8px",
                                margin: "0 auto",
                                boxShadow: "3px 3px 3px black",
                            }}
                            src={`https://image.tmdb.org/t/p/original/${clickedSeries?.poster_path}`}
                        />
                        <Typography gutterBottom sx={{ color: "black", paddingLeft: { sm: "15px",md:'15px',lg:'15px' },paddingTop:{sm:"25px"}, fontSize: "18px", flex: 1 }}>
                            {clickedSeries && clickedSeries.overview && clickedSeries.overview.length > 0
                                ? clickedSeries.overview
                                : "No description found!"}
                        </Typography>
                        <Box sx={{ textAlign: "center", width: "auto", marginTop: "16px" }}>
                            <Link to={`/series/${clickedSeries?.id}/${clickedSeries?.name}`}>
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