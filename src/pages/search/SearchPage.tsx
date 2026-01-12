import { Box, Grid2, Typography, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar.tsx";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { searchResultTypes } from "../../types.tsx";
import { fetchByName } from "../../api/moviesandseries/fetchByName.tsx";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<searchResultTypes[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getResults = async () => {
            setLoading(true);
            const data = await fetchByName(query);
            setResults(data);
            setLoading(false);
        };

        if (query) {
            getResults();
        }
    }, [query]);

    return (
        <>
            <Navbar />
            <Box sx={{ padding: "20px", marginTop: "20px", minHeight: "80vh" }}>
                <Typography variant="h4" sx={{ marginBottom: "30px", fontWeight: 'bold', textAlign: 'center' }}>
                    Search Results for: "{query}"
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid2 container spacing={3} sx={{ justifyContent: "center" }}>
                        {results.length > 0 ? (
                            results.map((result) => (
                                <Grid2 key={result.id} sx={{ width: "200px" }}>
                                    <Link
                                        to={result.type === 'movie'
                                            ? `/movies/${result.id}/${result.title}`
                                            : `/series/${result.id}/${result.name}`
                                        }
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Box sx={{
                                            transition: 'transform 0.3s',
                                            cursor: 'pointer',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}>
                                            <img
                                                src={result.poster_path
                                                    ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
                                                    : 'https://via.placeholder.com/200x300?text=No+Image'
                                                }
                                                alt={result.title || result.name}
                                                style={{
                                                    width: "100%",
                                                    borderRadius: "8px",
                                                    objectFit: "cover",
                                                    aspectRatio: "2/3",
                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                                                }}
                                            />
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: 'black',
                                                    textAlign: 'center',
                                                    marginTop: 1,
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {result.title || result.name}
                                            </Typography>
                                        </Box>
                                    </Link>
                                </Grid2>
                            ))
                        ) : (
                            <Typography variant="h6" color="textSecondary">
                                No results found for "{query}".
                            </Typography>
                        )}
                    </Grid2>
                )}
            </Box>
        </>
    )
}