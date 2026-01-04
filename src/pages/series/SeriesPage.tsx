import {useMemo, useState} from "react";
import {bookmarkedType, FilterProps, seriesType} from "../../types.tsx";
import Navbar from "../../components/Navbar.tsx";
import {Box, IconButton, Pagination, Stack, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import {fetchSeriesPerPage} from "../../api/series/fetchSeriesPerPage.tsx";
import Filter from "../../components/Filter.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchFilteredSeriesPerPage} from "../../api/series/fetchFilteredSeriesPerPage.tsx";
import SeriesDialogMenu from "./SeriesDialogMenu.tsx";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import {addToWatchList} from "../../api/watchlist/addToWatchList.tsx";
import {useNavigate} from "react-router";
import {fetchSession} from "../../api/auth/fetchSession.tsx";
import {fetchBookmarked} from "../../api/watchlist/fetchWatchList.tsx";

export default function SeriesPage<T>({sortBy,setSortBy,releaseDate,setReleaseDate,category,setCategory,genres,setGenres}:FilterProps<T>) {
    const[series,setSeries]=useState<seriesType[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const[clickedSeries,setClickedSeries]=useState<seriesType>()
    const [filteredData,setFilteredData]=useState<seriesType[]>([])
    const navigate=useNavigate()

    const { refetch } = useQuery({
        queryKey: ['seriesData', page, sortBy],
        queryFn: () => fetchSeriesPerPage(setSeries, page, setTotalPages, sortBy),
        refetchOnWindowFocus: false
    })
    const{refetch:refetchFiltered}=useQuery({
        queryKey: ['filteredSeriesData'],
        queryFn: () => fetchFilteredSeriesPerPage(page, setTotalPages, category, releaseDate, sortBy, setFilteredData),
        refetchOnWindowFocus:false
    })

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

    const watchedSeriesIds = useMemo(() => {
        const ids = bookmarkData
            .filter(item => item.type === 'tvShow')
            .map(item => item.movie_id);
        return new Set(ids);
    }, [bookmarkData])

    const handleClickOpen = (item:seriesType) => {
        setClickedSeries(item)
        setOpen(true);
    };
    const handleClose = () => {setOpen(false);};
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        refetch()
        refetchFiltered()
    };

    const addSeriesToWatchList = async (id: number, title: string) => {
        if (!userId) {
            navigate("/")
            return
        }

        if (watchedSeriesIds.has(id)) {
            return
        }

        try {
            await addToWatchList({ movie_id: id, title, type: "tvShow", user_id: userId });
            await queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        } catch (error) {
            console.error("Error while adding to bookmark:", error);
        }
    }
    if(!session){
        navigate("/")
    }

    const renderSeriesCard = (item: seriesType, loadingAttr: "lazy" | "eager") => {
        const isWatched = watchedSeriesIds.has(item.id);

        return (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
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
                        alt={item.name || item.title}
                        style={{ width: "100%", height: "auto", borderRadius: "8px", boxShadow: "3px 3px 3px black", }}
                        src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                        onClick={() => handleClickOpen(item)}
                        loading={loadingAttr}
                    />

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
                        <Typography variant="body2">{item.vote_average ? item.vote_average.toFixed(1) : "N/A"}</Typography>
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
                        <IconButton onClick={() => addSeriesToWatchList(item.id, item.name!)}>
                            <BookmarksIcon sx={{
                                fontSize: "1.2rem",
                                color: isWatched ? 'gold' : 'white',
                                transition: 'color 0.3s ease'
                            }} />
                        </IconButton>
                    </Box>
                </Box>
            </Grid>
        );
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
                            setReleaseDate={setReleaseDate} setCategory={setCategory} setGenres={setGenres} category={category} releaseDate={releaseDate} />
                </Box>

                <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    {sortBy != "popularity.desc" || releaseDate != undefined || category.length > 0
                        ? filteredData.map((filtered) => renderSeriesCard(filtered, "lazy"))
                        : series.map((seriesItem) => renderSeriesCard(seriesItem, "eager"))
                    }
                </Grid>

                <SeriesDialogMenu open={open} handleClose={handleClose} clickedSeries={clickedSeries} />

            </Box>
            <Stack spacing={2} sx={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="secondary" />
            </Stack>
        </>
    )
}