import React, {useEffect, useState} from "react";
import {AppBar, Toolbar, Typography, Box, IconButton, Button, Menu, MenuItem, useMediaQuery, Input,} from "@mui/material";
import { Menu as MenuIcon, Search } from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import {Link} from "react-router";
import {fetchByName} from "../fetchByName.tsx";

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const[searchParam,setSearchParam]=useState<string>("")
    const[searchResult,setSearchResult]=useState([])

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenuOpen = (event: { currentTarget: React.SetStateAction<null>; }) => {setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {setAnchorEl(null);
    };

    const handleInputChange=(e: React.ChangeEvent<HTMLInputElement>)=>{setSearchParam(e.target.value)}

    useEffect(() => {
        if (searchParam) {
            fetchByName(searchParam, setSearchResult);
        } else {
            setSearchResult([]);
        }
    }, [searchParam]);

    console.log(searchParam)
    return (
        <AppBar position="static" sx={{background: "linear-gradient(90deg, #0F2027, #2C5364)", boxShadow: "none",width: "100%",}}>
            <Toolbar sx={{ padding: 0 }}>
                <Typography variant="h6" sx={{flexGrow: isMobile ? 1 : 0, paddingLeft: "16px"}}>
                    StreamSphere
                </Typography>

                {!isMobile && (
                    <Box sx={{display: "flex", flexGrow: 1, justifyContent: "center", gap: "16px",}}>
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
                            <Search /><Input placeholder={"Search"} sx={{color:'white'}} onChange={handleInputChange}></Input>

                            <Menu
                                id="searchResult-meni" anchorEl={anchorEl}  open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                {searchResult.length>0 ?
                                    searchResult.map((result) => (
                                        <MenuItem key={result?.id}>{result?.name || result?.title}</MenuItem>
                                    ))
                                    :
                                        <Typography variant={"h5"}>No result found with these params!</Typography>
                                }
                            </Menu>




                        </IconButton>
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
                    <IconButton color="inherit" edge="end" onClick={handleMenuOpen} sx={{ marginLeft: "auto", paddingRight: "16px" }}>
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
