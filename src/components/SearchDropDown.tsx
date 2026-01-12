import {Box, ClickAwayListener, Divider, Popper, Typography} from "@mui/material";
import {searchResultTypes} from "../types.tsx";
import {Link} from "react-router";

interface SearchDropDownProps {
    anchorEl: HTMLElement | null;
    handleMenuClose: () => void;
    searchResult: searchResultTypes[];
}

export default function SearchDropDown({anchorEl,handleMenuClose,searchResult}:SearchDropDownProps){
    return(
        <>
            <ClickAwayListener onClickAway={handleMenuClose}>
                <Popper
                    open={Boolean(anchorEl) && searchResult?.length > 0}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    sx={{ zIndex: 1300 }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '4px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            maxWidth: '200px',
                            overflow: 'hidden'
                        }}
                    >
                        {searchResult?.length > 0 ? (
                            searchResult.slice(0,5).map((result: searchResultTypes, index: number) => (
                                <Box key={result.id}>
                                    {result.type==='movie' &&
                                        <Link to={`/movies/${result.id}/${result.title}`} style={{textDecoration:'none',color:'black'}}>
                                            <Box
                                                sx={{padding: "10px", display: "flex", flexDirection: "row", alignItems: "center",
                                                    '&:hover': { backgroundColor: '#f5f5f5' }, textDecoration:'none'
                                                }}
                                            >
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${result?.poster_path}`}
                                                    alt={result.title || result.name}
                                                    style={{ width: "70px", borderRadius: "4px", marginRight: "8px" }}
                                                />
                                                <Typography variant="body1">{result?.title || result?.name}</Typography>
                                            </Box>
                                        </Link>
                                    }
                                    {result.type==='series' &&
                                        <Link to={`/series/${result.id}/${result.name}`}>
                                            <Box sx={{padding: "10px", display: "flex", flexDirection: "row", alignItems: "center",
                                                '&:hover': { backgroundColor: '#f5f5f5' },textDecoration:'none'
                                            }}>
                                                <img src={`https://image.tmdb.org/t/p/w500${result?.poster_path}`}
                                                     alt={result.title || result.name}
                                                     style={{ width: "70px", borderRadius: "4px", marginRight: "8px" }}
                                                />
                                                <Typography variant="body1" sx={{ color: 'black' }}>{result?.title || result?.name}</Typography>
                                            </Box>
                                        </Link>
                                    }

                                    {index < searchResult.length - 1 && (
                                        <Divider sx={{ height: "2px", backgroundColor: "black" }}/>
                                    )}

                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ padding: "8px", textAlign: 'center', color: 'gray' }}>No results found!</Typography>
                        )}
                    </Box>
                </Popper>
            </ClickAwayListener>
        </>
    )
}