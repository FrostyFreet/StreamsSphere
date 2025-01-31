import {Box, Button, FormControl, FormGroup, FormHelperText, Input, InputLabel, Typography} from "@mui/material";
import {ChangeEvent, useState} from "react";
import {supabase} from "../../api/supabaseClient.tsx";
import {useNavigate} from "react-router";
import {SubmitHandler, useForm} from "react-hook-form";


interface loginType{
    email:string,
    password:string
}
export default function Login(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorOccurred, setErrorOccurred] = useState<string | null>(null);
    const navigate=useNavigate()
    const { register, handleSubmit,formState: { errors } } = useForm<loginType>();
    const onSubmit: SubmitHandler<loginType> =async()=>{
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if(error){
            console.error("Error occured while logging in:",error)
            setErrorOccurred(error.message);        }
        else if(data && data.user){
            console.log('User logged in:', data.user);
            setEmail("")
            setPassword("")
            navigate("/home")
        }
        else {
            console.error('Invalid login credentials');
            setErrorOccurred('Invalid login credentials');
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="email">Email address</InputLabel>
                            <Input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                                id="email" aria-describedby="email-helper-text" type="text" value={email}

                                   onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setEmail(e.target.value)}/>
                            {errors.email ? <FormHelperText error>{errors.email.message}</FormHelperText> :<FormHelperText>We'll never share your email.</FormHelperText>}
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" type="password" value={password}
                                   {...register("password", {
                                       required: "Password is required",
                                       minLength: {
                                           value: 8,
                                           message: "Password must be at least 8 characters long"
                                       }
                                   })}
                                   onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setPassword(e.target.value)}/>
                            <FormHelperText error>
                                {errors?.password?.message || errorOccurred}
                            </FormHelperText>

                        </FormControl>

                        <Button variant="contained" color="primary" type={"submit"} fullWidth
                                style={{marginTop: '16px'}}>
                            Login
                        </Button>

                        <Typography variant="body2" align="center" style={{marginTop: '12px'}}>
                            Don't have an account? <a href="/register">Sign Up</a>
                        </Typography>
                        <Typography variant="body2" align="center" style={{marginTop: '12px'}}>
                            Forgot Password? <a href="/recover-password-by-email">Reset Password</a>
                        </Typography>
                    </FormGroup>
                </form>
                
            </Box>
        </Box>
    )
}