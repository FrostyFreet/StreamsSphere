import { useState} from "react";
import {FilterProps, seriesType} from "../../types.tsx";
import Navbar from "../../components/Navbar.tsx";
import {Box, IconButton, Pagination, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import {fetchSeriesPerPage} from "../../api/series/fetchSeriesPerPage.tsx";
import Filter from "../../components/Filter.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchFilteredSeriesPerPage} from "../../api/series/fetchFilteredSeriesPerPage.tsx";
import SeriesDialogMenu from "./SeriesDialogMenu.tsx";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import {fetchUser} from "../../api/auth/fetchUser.tsx";
import {addToWatchList} from "../../api/watchlist/addToWatchList.tsx";
import {Navigate, useNavigate} from "react-router";
import {fetchSession} from "../../api/auth/fetchSession.tsx";

export default function SeriesPage<T>({sortBy,setSortBy,releaseDate,setReleaseDate,category,setCategory,genres,setGenres}:FilterProps<T>) {
    const[series,setSeries]=useState<seriesType[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const[clickedSeries,setClickedSeries]=useState<seriesType>()
    const [filteredData,setFilteredData]=useState<seriesType[]>([])
    const navigate=useNavigate()
    const{refetch}=useQuery({ queryKey: ['seriesData',page], queryFn: () => fetchSeriesPerPage(setSeries,page,setTotalPages),refetchOnWindowFocus:false })
    const{refetch:refetchFiltered}=useQuery({ queryKey: ['filteredSeriesData'], queryFn: () => fetchFilteredSeriesPerPage(page, setTotalPages,sortBy,setFilteredData), refetchOnWindowFocus:false })

    const {data:session}=useQuery({
        queryKey: ['session'],
        queryFn:fetchSession,
    });

    const handleClickOpen = (id:number) => {
        const found=series.find((series:seriesType)=>series.id===id)
        setClickedSeries(found)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        refetch()
        refetchFiltered()
    };
    const{data:user}=useQuery({
        queryKey: ['users'],
        queryFn: () => fetchUser()
    })

    const addSeriesToWatchList=(id:number,title:string)=>{
        if(user) {
            addToWatchList({movie_id: id, title, type: "tvShow", user_id: user.user?.id})
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
                    {sortBy!="popularity.desc" || releaseDate!=undefined || category.length>0
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
                                        loading="lazy"
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
                                        <IconButton onClick={()=>addSeriesToWatchList(filtered.id,filtered.name!)}>
                                            <BookmarksIcon sx={{ fontSize: "1rem", marginRight: "4px", color:'white' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        ))
                        :
                        series.map((series:seriesType) => (
                            <Grid key={series.id} size={{xs:12, sm:6, md:4, lg:2.4}}>
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
                                        <IconButton onClick={()=>addSeriesToWatchList(series.id,series.name!)}>
                                            <BookmarksIcon sx={{ fontSize: "1rem", marginRight: "4px", color:'white' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>

                        ))
                    }

                </Grid>
                <SeriesDialogMenu open={open} handleClose={handleClose} clickedSeries={clickedSeries}/>

            </Box>
            <Stack spacing={2} sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="secondary" />
            </Stack>
        </>
    )
}