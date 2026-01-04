import {Box, Skeleton} from "@mui/material";

import {useQuery} from "@tanstack/react-query";
import {fetchPopularData} from "../api/moviesandseries/fetchPopularData.tsx";
import {CSSProperties, useState} from "react";
import {HomeCardsProps} from "../types.tsx";
import {fetchTopRatedData} from "../api/moviesandseries/fetchTopRatedData.tsx";
import {fetchRecommendedData} from "../api/moviesandseries/fetchRecommendedData.tsx";
import { fetchLatestData} from "../api/moviesandseries/fetchLatestData.tsx";
import MoviesDialogMenu from "../pages/movies/MoviesDialogMenu.tsx";
import SeriesDialogMenu from "../pages/series/SeriesDialogMenu.tsx";

export default function HomeCards({clickedButton}:HomeCardsProps){
    const {data:popularData } = useQuery({queryKey: ['popularData'],queryFn: fetchPopularData })
    const {data:latestData } = useQuery({queryKey: ['latestData'],queryFn: fetchLatestData })
    const {data:recommendedData } = useQuery({queryKey: ['recommendedData'],queryFn: fetchRecommendedData })
    const {data:topRatedData } = useQuery({queryKey: ['topRatedData'],queryFn: fetchTopRatedData })

    const [openMovieDialog, setOpenMovieDialog] = useState(false);
    const [openSeriesDialog, setOpenSeriesDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    let dataToRender=popularData
    if(clickedButton==="popular"){
        dataToRender=popularData
    }
    else if(clickedButton==="latest"){
        dataToRender=latestData
    }
    else if(clickedButton==="recommended"){
        dataToRender=recommendedData
    }
    else if(clickedButton==="top-rated"){
        dataToRender=topRatedData
    }

    const handleCardClick = (item: any) => {
        setSelectedItem(item);
        if (item.type === 'movie') {
            setOpenMovieDialog(true);
        } else {
            setOpenSeriesDialog(true);
        }
    };

    const handleCloseMovie = () => setOpenMovieDialog(false);
    const handleCloseSeries = () => setOpenSeriesDialog(false);

    return (
        <>
            <Box className="animation-container">
                <Box className="box">
                    {dataToRender?.slice(0, 10).map((i, index: number) => (
                        <span key={i.id} style={{ "--i": index + 1 } as CSSProperties}>
                            {i.poster_path ?
                                <img
                                    style={{ maxWidth: "200px", cursor: "pointer" }}
                                    src={`https://image.tmdb.org/t/p/original${i.poster_path}`}
                                    alt={i.title || i.name}
                                    className={index === 0 ? "front" : ""}
                                    onClick={() => handleCardClick(i)}
                                />
                                :
                                <Skeleton variant="rectangular" style={{
                                    width: "100%",
                                    maxWidth: "200px",
                                    height: "auto",
                                    borderRadius: "8px",
                                    boxShadow: "1px 1px 1px rgb(0,0,0.2)",
                                }} />
                            }
                        </span>
                    ))}
                </Box>
            </Box>

            {selectedItem && (
                <>
                    <MoviesDialogMenu
                        open={openMovieDialog}
                        handleClose={handleCloseMovie}
                        clickedMovie={selectedItem}
                    />
                    <SeriesDialogMenu
                        open={openSeriesDialog}
                        handleClose={handleCloseSeries}
                        clickedSeries={selectedItem}
                    />
                </>
            )}
        </>
    )
}