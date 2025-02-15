import {Avatar, Box, IconButton, Input, Menu, MenuItem, Tooltip, Typography, useMediaQuery} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, {ChangeEvent, useEffect, useState} from "react";
import GridViewIcon from '@mui/icons-material/GridView';
import {searchResultTypes} from "../types.tsx";
import {Link, useLocation} from "react-router";
import {fetchByName} from "../api/moviesandseries/fetchByName.tsx";
import SearchDropDown from "./SearchDropDown.tsx";
import AvatarMenu from "./AvatarMenu.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchUser} from "../api/auth/fetchUser.tsx";




export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [searchAnchorEl, setSearchAnchorEl] = useState<HTMLElement | null>(null);

    const [avatarAnchorEl, setAvatarAnchorEl] = useState<HTMLElement | null>(null);
    const isAvatarOpen = Boolean(avatarAnchorEl);

    const isMobile = useMediaQuery("(max-width:750px)");

    const[searchParam,setSearchParam]=useState< React.SetStateAction<string>>("")
    const[searchResult,setSearchResult]=useState<searchResultTypes[]>([])
    const location=useLocation()
    const home=location.pathname==="/home"
    const series=location.pathname==="/series"
    const movies=location.pathname==="/movies"
    const watchlist=location.pathname==="/watchlist"


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchParam(e.target.value);
    };

    const handleMenuOpen = (event:React.MouseEvent<HTMLElement>) => {setAnchorEl(event.currentTarget)}

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSearchParam("")
        setSearchResult([])
    }

    const handleAvatarMenuOpen = (event:React.MouseEvent<HTMLElement>) => {setAvatarAnchorEl(event.currentTarget)}
    const handleAvatarMenuClose = () => {setAvatarAnchorEl(null)}

    useEffect(() => {
        if (searchParam) {
            fetchByName(searchParam, setSearchResult);

        } else {
            setSearchResult([]);
        }
    }, [searchParam]);

    const{data:user}=useQuery({
        queryKey: ['users'],
        queryFn: fetchUser
    })


    return(
        <>
            <Box id={"header"}>

                {!isMobile ? (
                    <Box id={"nav_links"}>
                        <Typography id={"logo"} sx={{textDecoration:'none',color:'black'}}>S</Typography>
                        <Link to={"/home"} style={{ color: 'black', textDecoration: 'none' }}>
                            <Typography id={"home"} className={`nav-link-text ${home ? 'underlined' : ''}`}>
                                Home
                            </Typography>
                        </Link>
                        <Link to={"/movies"} style={{color:'black',textDecoration:"none"}}>
                            <Typography id={"movies"} className={`nav-link-text ${movies ? 'underlined' : ''}`}>
                                Movies
                            </Typography>
                        </Link>
                        <Link to={"/series"} style={{color:'black',textDecoration:"none"}}  >
                            <Typography id={"tv_shows"} className={`nav-link-text ${series ? 'underlined' : ''}`}>TV Shows
                            </Typography>
                        </Link>
                        <Link to={"/watchlist"} style={{color:'black',textDecoration:"none"}} >
                            <Typography id={"watchlist"} className={`watchlist-text ${watchlist ? 'underlined' : ''}`}>
                                Watchlist
                            </Typography>
                        </Link>
                    </Box>

                    )
                    :
                    (
                        <Box>
                            <IconButton onClick={handleMenuOpen}>
                                <GridViewIcon id={"burger-menu"}/>
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <Link to={"/home"} style={{color:'black',textDecoration:"none"}}>
                                    <MenuItem onClick={handleMenuClose} id={"home"} className={`mobile-menu-item ${home ? 'underlined' : ''}`}>Home</MenuItem>
                                </Link>
                                <Link to={"/movies"} style={{color:'black',textDecoration:"none"}}>
                                    <MenuItem onClick={handleMenuClose} id={"movies"} className={`mobile-menu-item ${movies ? 'underlined' : ''}`}>Movies</MenuItem>
                                </Link>
                                <Link to={"/series"} style={{color:'black',textDecoration:"none"}} >
                                    <MenuItem onClick={handleMenuClose} id={"tv_shows"} className={`mobile-menu-item ${series ? 'underlined' : ''}`}>TV Shows</MenuItem>
                                </Link>
                                <Link to={"/watchlist"} style={{color:'black',textDecoration:"none"}}>
                                    <MenuItem onClick={handleMenuClose} id={"watchlist"} className={`mobile-menu-item ${watchlist ? 'underlined' : ''}`}
                                    >Watchlist</MenuItem>
                                </Link>
                            </Menu>
                        </Box>
                    )
                }

                <Box id={"icons"}>

                    <IconButton>
                        <SearchIcon id={"search"}/>

                    </IconButton>
                    <Input placeholder={"Search for anything..."} id={"search_input"}
                           onChange={handleInputChange} value={searchParam}
                           onFocus={(e)=> setSearchAnchorEl(e.currentTarget)}/>

                    {user &&
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleAvatarMenuOpen}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={isAvatarOpen ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={isAvatarOpen ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32 }} id={"avatar"}>M</Avatar>
                        </IconButton>
                    </Tooltip>
                    }
                </Box>
                {user && <AvatarMenu avatarAnchorEl={avatarAnchorEl} handleClose={handleAvatarMenuClose} isAvatarOpen={isAvatarOpen}/>}

                <SearchDropDown anchorEl={searchAnchorEl} handleMenuClose={handleMenuClose} searchResult={searchResult}/>
            </Box>

        </>
    )
}