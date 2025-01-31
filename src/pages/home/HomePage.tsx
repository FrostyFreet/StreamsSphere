import Navbar from "../../components/Navbar.tsx";
import Header from "../../components/Header.tsx";
import AlertDialog from "../../components/AlertDialog.tsx";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {supabase} from "../../api/supabaseClient.tsx";


export default function HomePage(){
    const [open, setOpen] = useState(false);
    const location=useLocation()
    const navigate=useNavigate()



    useEffect(() => {
        if (location.pathname === "/home") {
            setOpen(true);
        }
    }, [location.pathname]);

    const handleDisagree = async() => {
        setOpen(false);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Error signing out:", error.message);
            }
        } catch (err) {
            console.error("Unexpected error during sign out:", err);
        }

        navigate("/");
    };
    const handleAgree = () => {
        setOpen(false);
    };

    return(
        <>
            <Navbar/>
            <Header/>
            <AlertDialog open={open}  handleDisagree={handleDisagree} handleAgree={handleAgree}/>
        </>

    )
}