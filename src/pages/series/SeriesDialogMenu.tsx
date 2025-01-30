import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {Link} from "react-router";
import {bookmarkedType, seriesType} from "../../types.tsx";

interface DialogMenuProps {
    open: boolean;
    handleClose: () => void;
    clickedSeries: seriesType | bookmarkedType | undefined;
}

export default function SeriesDialogMenu({open,handleClose,clickedSeries}:DialogMenuProps){
    return(
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{ m: 0, p: 2, textAlign: "center", fontWeight: "bold", color: "black" }}
                id={clickedSeries?.id?.toString()}
            >
                {clickedSeries ? clickedSeries.name : <Typography>N/A</Typography>}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
                <img
                    alt={clickedSeries?.name}
                    style={{
                        width: "100%",
                        maxWidth: "200px",
                        height: "auto",
                        borderRadius: "8px",
                        margin: "0 auto",
                        boxShadow: "3px 3px 3px black",
                    }}
                    src={`https://image.tmdb.org/t/p/original/${clickedSeries?.poster_path}`}
                />
                <Typography gutterBottom sx={{ color: "black", paddingLeft: { sm: "15px",md:'15px',lg:'15px' },paddingTop:{sm:"25px"}, fontSize: "18px", flex: 1 }}>
                    {clickedSeries && clickedSeries.overview && clickedSeries.overview.length > 0
                        ? clickedSeries.overview
                        : "No description found!"}
                </Typography>
                <Box sx={{ textAlign: "center", width: "auto", marginTop: "16px" }} >
                    <Link to={`/series/${clickedSeries?.id}/${clickedSeries?.name}`}>
                        <Button variant="contained" color="primary" onClick={handleClose}>
                            Watch Now
                        </Button>
                    </Link>
                </Box>
            </DialogContent>
        </Dialog>

    )
}