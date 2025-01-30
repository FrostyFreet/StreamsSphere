import {ChangeEvent, useState} from "react";
import {supabase} from "../../api/supabaseClient.tsx";
import {Box, Button, FormControl, FormGroup, FormHelperText, Input, InputLabel, Typography} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";

interface registerType{
    email:string,
    password:string,
    confirmPassword:string
}

export default function Register() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const { register, handleSubmit,formState: { errors } } = useForm<registerType>();
    const onSubmit: SubmitHandler<registerType> =async()=>{
        if(password===confirmPassword){
            const {data, error} = await supabase.auth.signUp({
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
                setConfirmPassword("")
            }
        }
    }
    return(

        <Box display="flex" alignItems="center" justifyContent="center" height={"100%"}>
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
                   Register
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="email">Email address</InputLabel>
                            <Input id="email" aria-describedby="email-helper-text" type="text" value={email}
                                   {...register("email", {
                                       required: "Email is required",
                                       pattern: {
                                           value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                           message: "Invalid email address"
                                       }
                                   })}
                                   onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setEmail(e.target.value)}

                            />
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
                            {errors.password ? <FormHelperText error>{errors.password.message}</FormHelperText> :<FormHelperText></FormHelperText>}


                        </FormControl>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="confirmPassword">Confirm password</InputLabel>
                            <Input id="confirmPassword" type="password" value={confirmPassword}
                                   {...register("confirmPassword", {
                                       required: "Please confirm your password",
                                       validate: value => value === password || "Passwords do not match"
                                   })}
                                   onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setConfirmPassword(e.target.value)}/>
                            {errors.confirmPassword ? <FormHelperText error>{errors.confirmPassword.message}</FormHelperText> :<FormHelperText></FormHelperText>}

                        </FormControl>

                        <Button variant="contained" color="primary" type={"submit"} fullWidth
                                style={{marginTop: '16px'}}>
                           Register
                        </Button>

                        <Typography variant="body2" align="center" style={{marginTop: '12px'}}>
                           Already have an account? <a href="/">Log In</a>
                        </Typography>
                    </FormGroup>
                </form>
            </Box>
        </Box>
    )
}