import {Box, Skeleton} from "@mui/material";

import {useQuery} from "@tanstack/react-query";
import {fetchPopularData} from "../api/moviesandseries/fetchPopularData.tsx";
import {CSSProperties} from "react";
import {Link} from "react-router";
import {HomeCardsProps} from "../types.tsx";
import {fetchTopRatedData} from "../api/moviesandseries/fetchTopRatedData.tsx";
import {fetchRecommendedData} from "../api/moviesandseries/fetchRecommendedData.tsx";
import { fetchLatestData} from "../api/moviesandseries/fetchLatestData.tsx";

export default function HomeCards({clickedButton}:HomeCardsProps){
    const {data:popularData } = useQuery({queryKey: ['popularData'],queryFn: fetchPopularData })
    const {data:latestData } = useQuery({queryKey: ['latestData'],queryFn: fetchLatestData })
    const {data:recommendedData } = useQuery({queryKey: ['recommendedData'],queryFn: fetchRecommendedData })
    const {data:topRatedData } = useQuery({queryKey: ['topRatedData'],queryFn: fetchTopRatedData })
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

    return(
        <>
            <Box className="animation-container">
                <Box className="box">
                    {dataToRender?.slice(0,10).map((i,index:number)=>(
                        <span key={i.id} style={{"--i": index + 1} as CSSProperties}>
                                <Link
                                    to={i.type === "movie" ? `/movies/${i.id}/${i.title}` : `/series/${i.id}/${i.name}`}>
                                    {i.poster_path ?
                                        <img
                                            style={{maxWidth: "200px"}}
                                            src={`https://image.tmdb.org/t/p/original${i.poster_path}`}
                                            alt={i.title || i.name}
                                            className={index === 0 ? "front" : ""}
                                        />
                                        :
                                        <Skeleton variant="rectangular" style={{
                                            width: "100%",
                                            maxWidth: "200px",
                                            height: "auto",
                                            borderRadius: "8px",
                                            boxShadow: "1px 1px 1px rgb(0,0,0.2)",
                                        }}/>

                                    }
                                </Link>
                            </span>
                    ))}
                </Box>
            </Box>


        </>
    )
}