import { useParams} from "react-router";
import {useEffect, useState} from "react";
import Navbar from "../../components/Navbar.tsx";
import Box from "@mui/material/Box";
import {MenuItem, Select, SelectChangeEvent, Skeleton, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import '../../App.scss'


import axios from "axios";
import {episodeType} from "../../types.tsx";


export default function SeriesPlayer(){
    const {id} = useParams();
    const[numberOfSeasons,setNumberOfSeasons]=useState<number>()
    const[numberOfEpisodes,setNumberOfEpisodes]=useState<episodeType[]>([])
    const[selectedSeason,setSelectedSeason]=useState<number | string | undefined>(1)
    const[selectedEpisode,setSelectedEpisode]=useState<number | string | undefined>(1)

    const fetchNumberOfSeasons=async()=>{
        const response=await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_APIKEY}`)
        setNumberOfSeasons(response.data.number_of_seasons)
    }
    const fetchNumberOfEpisodes=async()=>{
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${import.meta.env.VITE_TMDB_APIKEY}`);
        setNumberOfEpisodes(response.data.episodes)
    }
    useEffect(() => {
        fetchNumberOfSeasons()
        fetchNumberOfEpisodes()
    }, [id]);
    useEffect(() => {
        fetchNumberOfEpisodes()
    }, [selectedSeason]);


    const handleChange=(e:SelectChangeEvent<string | number>)=>{
        const target=e.target.value
        setSelectedSeason(target)

    }

    return (
        <>
            <Navbar/>
            <Box style={{display:'flex', justifyContent:'center',paddingBottom:'50px',height:'50vh',paddingTop:'35px'}}>
                <iframe
                    src={`https://vidlink.pro/tv/${id}/${selectedSeason}/${selectedEpisode}?poster=true&autoPlay=false&primaryColor=f5f5f5&secondaryColor=f5f5f5`}
                        width={'1000px'}
                         allowFullScreen={true}
                >
                </iframe>
            </Box>
            <Box display={"flex"} gap={"10px"}>
                <Typography variant={"h4"} style={{paddingBottom:'0',marginLeft:'55px',paddingTop:'25px',}}>Episodes |</Typography>

                    <Select
                        id="season-select"
                        value={selectedSeason}
                        defaultValue={"Season 1"}
                        label="Age"
                        onChange={handleChange}
                        sx={{
                            color:'gray',
                            paddingTop:'20px',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                            '& .MuiSelect-icon': {
                                top: '45%',
                            },
                        }}
                    >
                        {numberOfSeasons &&
                            Array.from({ length: numberOfSeasons }, (_, i) => (
                                <MenuItem value={`${i + 1}`} key={i}>
                                    {`Season ${i + 1}`}
                                </MenuItem>
                            ))
                        }
                    </Select>
            </Box>

            <Box sx={{display:'flex',justifyContent:'center',alignItems:'center', padding: "16px",textAlign: "center",}}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2,lg:1 }} sx={{justifyContent: "center", alignItems: "center",}}>
                    {numberOfEpisodes && numberOfEpisodes.map((i:episodeType) => (
                        <Grid sx={{xs:6, sm:4, md:2,lg:1}} key={i.id}>
                            <Box position="relative" sx={{width: "100%", maxWidth: "250px", height: "auto", borderRadius: "8px", overflow: "hidden",}}>
                                {i.still_path?
                                    <>
                                        <img alt={i.name} style={{width: "100%", height: "100%", borderRadius: "8px",boxShadow: "10px 10px 12px black"}}
                                           src={`https://image.tmdb.org/t/p/original/${i.still_path}`}
                                           onClick={() => setSelectedEpisode(i.episode_number)}/>

                                        <Box
                                            position="absolute" top={8} left={8} bgcolor="rgba(0, 0, 0, 0.5)" color="white"
                                            borderRadius="4px" padding="4px 8px"
                                            display="flex"
                                            alignItems="center">
                                            <StarIcon sx={{fontSize: "1rem", marginRight: "4px", color: 'gold'}}/>
                                            <Typography variant="body2">{i.vote_average.toFixed(1)}</Typography>
                                        </Box>
                                    </>
                                    :
                                    <>
                                        {i.air_date?
                                            <Typography variant={"h6"}>Coming Soon-Release Date:{i.air_date}</Typography>
                                            :
                                            <Typography variant={"h6"}>Coming Soon</Typography>
                                        }
                                        <Skeleton variant="rectangular" style={{ marginTop:"15px",width: "100%", maxWidth:"200px",height: "auto", borderRadius: "8px",boxShadow: "3px 3px 3px black", }}/>

                                    </>

                                }



                            </Box>
                            <Box>
                                <Typography sx={{float:"center"}} variant={"body1"}>Episode:{i.episode_number}</Typography>
                                <Typography sx={{color:'gray'}} variant={"body1"}>{i.runtime} minutes</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>


            </Box>
        </>
    );
}