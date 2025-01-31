import {Avatar,  Divider, ListItemIcon, Menu, MenuItem} from "@mui/material";
import {Logout} from "@mui/icons-material";

import {supabase} from "../api/supabaseClient.tsx";
import {Link, useNavigate} from "react-router";

interface AvatarMenuProps {
    avatarAnchorEl: HTMLElement | null;
    handleClose: () => void;
    isAvatarOpen: boolean;
}



export default function AvatarMenu({avatarAnchorEl, handleClose, isAvatarOpen}: AvatarMenuProps) {
    const navigate = useNavigate();

    const signOut=async()=>{
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error("Sign out error:", error.message);
        } else {
            console.log("Successfully logged out!");
            navigate("/");
            window.location.reload();
        }
    }

    return (
        <>
            <Menu
                anchorEl={avatarAnchorEl}
                id="account-menu"
                open={isAvatarOpen}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <Link to={"/change-password"} style={{textDecoration:'none',color:'black'}}>
                    <MenuItem onClick={handleClose}>
                        <Avatar/> Profile
                    </MenuItem>
                </Link>
                <Divider/>

                <MenuItem onClick={signOut} style={{color:'black'}}>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

        </>
    )
}

