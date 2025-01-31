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
    const [aggreed,setAgreed]=useState<boolean>(false)


    useEffect(() => {
        const hasAgreed = localStorage.getItem("hasAgreed");
        if (location.pathname === "/home" && !hasAgreed) {
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
        setAgreed(true)
        localStorage.setItem("hasAgreed", "true");
    };

    return(
        <>
            <Navbar/>
            <Header/>
            {!aggreed && <AlertDialog open={open}  handleDisagree={handleDisagree} handleAgree={handleAgree}/>}

        </>

    )
}