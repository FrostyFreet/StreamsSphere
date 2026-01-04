import {ChangeEvent, useState} from "react";
import {
    Box,
    Button,
    FormControl,
    FormGroup,
    FormHelperText,
    Input,
    InputLabel,
    Typography
} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";

import Navbar from "../../components/Navbar.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchSession} from "../../api/auth/fetchSession.tsx";
import {supabase} from "../../api/supabaseClient.tsx";

interface registerType{
    currentPassword:string,
    newPassword:string,
    confirmNewPassword:string
    email?:string
}

export default function RecoverPasswordByEmail() {

    const [email, setEmail] = useState<string>("");
    const[success,setSuccess]=useState<boolean>(false)

    const { register, handleSubmit,formState: { errors } } = useForm<registerType>();

    const {data:session}=useQuery({
        queryKey: ['session'],
        queryFn:fetchSession,
    });

    const onSubmit: SubmitHandler<registerType> = async () => {
        if (email) {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/recover-password`,
            })
            if (error) {
                    console.error("Something went wrong", error);
            } else {
                setSuccess(true);
            }

        }
    }

    return(
        <>
            {session &&
                <Navbar/>
            }
            <Box display="flex" alignItems="center" justifyContent="center" height={"100vh"}>
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
                        Change Password
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <FormControl margin="normal" fullWidth>

                                        <InputLabel htmlFor="currentPassword">Email</InputLabel>
                                        <Input
                                            type="text"
                                            id="email" aria-describedby="email-helper-text" value={email}
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                    message: "Invalid email address",
                                                },
                                            })}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setEmail(e.target.value)}
                                        />
                                        {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                                        {success && <FormHelperText sx={{color:'green',fontSize:"15px"}}>Check your emails</FormHelperText>}



                            </FormControl>

                            <Button variant="contained" color="primary" type={"submit"} fullWidth
                                    style={{marginTop: '16px'}}>
                                Send Email
                            </Button>

                        </FormGroup>
                    </form>
                </Box>
            </Box>
        </>
    )
}