import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";

interface DialogMenuProps {
    open: boolean;
    handleDisagree: () => void;
    handleAgree: () => void;
}

export default function AlertDialog({open,handleDisagree,handleAgree}:DialogMenuProps){
    return(
        <>
            <Dialog
                open={open}
                aria-labelledby="statement"
                aria-describedby="statement"
            >
                <DialogTitle id="statement" sx={{textAlign:"center",fontSize:'25px'}}>
                    {"Some movies and TV Shows are not available at the moment thank you for your understanding "}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleDisagree}>Disagree</Button>
                    <Button onClick={handleAgree} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}