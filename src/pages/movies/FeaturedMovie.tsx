import {useEffect, useState} from "react";
import { Box, Typography, IconButton } from "@mui/material";

import {featuredMovie} from "../../types.tsx";
import {Link} from "react-router";
import {fetchFeaturedMovie} from "../../api/fetchFeaturedMovie.tsx";
export default function FeaturedMovie(){
    const [featuredMovie, setFeaturedMovie] = useState<featuredMovie | undefined>();

    useEffect(() => {
        fetchFeaturedMovie(setFeaturedMovie)
    }, [])

    return (
        <>

            <Box
                sx={{
                    height: "50vh",
                    backgroundImage: `url(https://image.tmdb.org/t/p/original/${featuredMovie?.backdrop_path})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    textAlign: "center",
                    position: "relative",
                    padding: { xs: "8px", md: "16px" },
                    borderRadius: "8px",
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        marginBottom: "16px",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        lineHeight: { xs: '1.2', md: '1.5' }
                    }}
                >
                    {featuredMovie?.title}
                </Typography>

                <Link to={`/${featuredMovie?.id}/${featuredMovie?.title}`}>
                    <IconButton
                        sx={{
                            position: "absolute",
                            bottom: "16px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "white",
                            fontSize: { xs: '36px', md: '48px' },
                            backgroundColor: "rgba(1,0,0,0.7)",
                            padding: { xs: '12px', md: '16px' },
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.7)",
                            },
                        }}
                    >
                        <Typography variant="h5" sx={{ marginBottom: 0, textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
                            Watch Now!
                        </Typography>
                    </IconButton>
                </Link>
            </Box>
        </>
    );

}