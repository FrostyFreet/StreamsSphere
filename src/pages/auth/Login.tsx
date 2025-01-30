import {Box, Button, FormControl, FormGroup, FormHelperText, Input, InputLabel, Typography} from "@mui/material";
import {ChangeEvent, FormEvent, useState} from "react";
import {supabase} from "../../api/supabaseClient.tsx";
import {useNavigate} from "react-router";


export default function Login(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate=useNavigate()

    const handleLogin=async(e:FormEvent)=>{
        e.preventDefault()
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if(error){
            console.error("Error occured while logging in:",error)
        }
        if(data){
            console.log(data)
            setEmail("")
            setPassword("")
            navigate("/home")
        }

    }
    return(

        <Box display="flex" alignItems="center" justifyContent="center" id={"login-form"}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    width: '300px',
                    height: 'auto',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f9f9f9'
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <FormGroup>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="email">Email address</InputLabel>
                            <Input id="email" aria-describedby="email-helper-text" type="text" value={email}
                                   onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setEmail(e.target.value)}/>
                            <FormHelperText id="email-helper-text">We'll never share your email.</FormHelperText>
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" type="password" value={password}
                                   onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setPassword(e.target.value)}/>
                        </FormControl>

                        <Button variant="contained" color="primary" type={"submit"} fullWidth
                                style={{marginTop: '16px'}}>
                            Login
                        </Button>

                        <Typography variant="body2" align="center" style={{marginTop: '12px'}}>
                            Don't have an account? <a href="/register">Sign Up</a>
                        </Typography>
                    </FormGroup>
                </form>
                
            </Box>
        </Box>
    )
}