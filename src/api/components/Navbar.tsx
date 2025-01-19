import React, {useEffect, useState} from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Button,
    Menu,
    MenuItem,
    useMediaQuery,
    Input,
    Popper, Divider,
    ClickAwayListener
} from "@mui/material";
import { Menu as MenuIcon, Search } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {Link} from "react-router";
import {fetchByName} from "../fetchByName.tsx";
import {searchResultTypes} from "../../types.tsx";

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const[searchParam,setSearchParam]=useState< React.SetStateAction<string>>("")
    const[searchResult,setSearchResult]=useState<searchResultTypes[]>([])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParam(e.target.value);
        // @ts-expect-error
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSearchParam("")
        setSearchResult([])
    };
    useEffect(() => {
        if (searchParam) {
            fetchByName(searchParam, setSearchResult);

        } else {
            setSearchResult([]);
        }
    }, [searchParam]);

    return (
        <AppBar position="static" sx={{background: "linear-gradient(90deg, #0F2027, #2C5364)", boxShadow: "none",width: "100%",}}>
            <Toolbar sx={{ padding: 0 }}>
                <Typography variant="h6" sx={{flexGrow: isMobile ? 1 : 0, paddingLeft: "16px"}}>
                    StreamsSphere
                </Typography>

                {!isMobile && (
                    <Box sx={{display: "flex", flexGrow: 1, justifyContent: "center", gap: "16px",marginLeft:'250px'}}>
                        <Link to={"/"} style={{textDecoration:'none', color:"white"}}>
                            <Button color="inherit">Home</Button>
                        </Link>

                        <Link to={"/movies"} style={{textDecoration:'none', color:"white"}}>
                            <Button color="inherit">Movies</Button>
                        </Link>

                        <Link to={"/series"} style={{textDecoration:'none', color:"white"}}>
                            <Button color="inherit">TV Shows</Button>
                        </Link>
                    </Box>
                )}

                {!isMobile ? (
                    <Box
                        sx={{display: "flex", alignItems: "center", paddingRight: "16px", gap: "8px",}}>
                        <IconButton color="inherit">
                            <Search />
                        </IconButton>
                        <Input placeholder={"Search"} sx={{color:'white'}} onChange={handleInputChange} value={searchParam}></Input>
                        <ClickAwayListener onClickAway={handleMenuClose}>
                            <Popper
                                open={Boolean(anchorEl) && searchResult.length > 0}
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
                                    {searchResult.length > 0 ? (
                                        searchResult.map((result: searchResultTypes, index: number) => (
                                            <Box key={result.id}>
                                                {result.type==='movie' &&
                                                    <Link to={`/movies/${result.id}/${result.title}`}>
                                                        <Box
                                                            sx={{padding: "10px", display: "flex", flexDirection: "row", alignItems: "center",
                                                            '&:hover': { backgroundColor: '#f5f5f5' }, textDecoration:'none'
                                                    }}
                                                        >
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w500${result?.poster_path}`}
                                                            alt={result.title || result.name}
                                                            style={{ width: "70px", borderRadius: "4px", marginRight: "8px" }} // Adjusted size and margin
                                                            />
                                                        <Typography variant="body1" sx={{ color: 'black' }}>{result?.title || result?.name}</Typography>
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
                                                                 style={{ width: "70px", borderRadius: "4px", marginRight: "8px" }} // Adjusted size and margin
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



                        <Link to={"/login"} style={{textDecoration:'none', color:"white"}}>
                            <Button color="inherit">Login</Button>
                        </Link>
                        <Link to={"/register"} style={{textDecoration:'none', color:"white"}}>
                            <Button color="inherit">Register</Button>
                        </Link>
                    </Box>
                    )
                    :
                    (
                    <IconButton color="inherit" edge="end"  sx={{ marginLeft: "auto", paddingRight: "16px" }}>
                        <MenuIcon />
                    </IconButton>
                )}
            </Toolbar>

            {/* Mobile Menu */}
            {isMobile && (
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: "top", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} sx={{
                    "& .MuiPaper-root": {
                        background: "linear-gradient(90deg, #0F2027, #2C5364)",
                        color: "white",
                    },
                }}>
                    <Link to={"/"} style={{textDecoration:'none', color:"white"}}>
                        <MenuItem onClick={handleMenuClose}>Home</MenuItem>
                    </Link>
                    <Link to={"/movies"} style={{textDecoration:'none', color:"white"}}>
                        <MenuItem onClick={handleMenuClose}>Movies</MenuItem>
                    </Link>
                    <Link to={"/series"} style={{textDecoration:'none', color:"white"}}>
                        <MenuItem onClick={handleMenuClose}>TV Shows</MenuItem>
                    </Link>

                    <MenuItem><Search /><Input placeholder={"Search"} sx={{color:'white'}} onChange={handleInputChange}></Input></MenuItem>

                    <Link to={"/login"} style={{textDecoration:'none', color:"white"}}>
                        <MenuItem onClick={handleMenuClose}>Login</MenuItem>
                    </Link>
                    <Link to={"/register"} style={{textDecoration:'none', color:"white"}}>
                        <MenuItem onClick={handleMenuClose}>Register</MenuItem>
                    </Link>
                </Menu>
            )}
        </AppBar>
    );
};

export default Navbar;
