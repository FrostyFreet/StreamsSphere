import {Box, Button, Typography} from "@mui/material";
import HomeCards from "./HomeCards.tsx";
import React, {useState} from "react";

export default function Header(){
    const[clickedButton,setClickedButton]=useState<string>("");
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement
        setClickedButton(target.id)

    }
    return(
        <>
            <Box>
                <Typography variant={"h2"} id={"head-title"}>Discover Unlimited Content </Typography>
                <Box id={"button-container"}>
                    <Button id={"popular"} onClick={handleClick}>Popular</Button>
                    <Button id={"latest"} onClick={ handleClick}>Latest</Button>
                    <Button id={"top-rated"} onClick={handleClick}>Top Rated</Button>
                    <Button id={"recommended"} onClick={handleClick}>Recommended</Button>
                </Box>
            </Box>
            <HomeCards clickedButton={clickedButton}/>
        </>
    )
}