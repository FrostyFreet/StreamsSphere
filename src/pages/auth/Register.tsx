import { useState } from "react";
import { supabase } from "../../api/supabaseClient.tsx";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormGroup,
    FormHelperText,
    Input,
    InputLabel,
    Typography,
    CircularProgress
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";

interface registerType {
    email: string,
    password: string,
    confirmPassword: string
}

export default function Register() {
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<registerType>();

    const password = watch("password");

    const onSubmit: SubmitHandler<registerType> = async (formData) => {
        setFeedback(null);

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
        });

        if (error) {
            console.error("Error occured while registering:", error);
            setFeedback({ type: 'error', message: "Error occured while registering: " + error.message });
        } else if (data) {
            setFeedback({ type: 'success', message: "Successfully registered! Please check your email to confirm your account." });
            reset()
        }
    };

    return (
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
                    Register
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                    <FormGroup>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="email">Email address</InputLabel>
                            <Input
                                id="email"
                                type="text"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email ?
                                <FormHelperText error>{errors.email.message}</FormHelperText> :
                                <FormHelperText>We'll never share your email.</FormHelperText>
                            }
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long"
                                    }
                                })}
                            />
                            {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="confirmPassword">Confirm password</InputLabel>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === password || "Passwords do not match"
                                })}
                            />
                            {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
                        </FormControl>

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            disabled={isSubmitting}
                            style={{marginTop: '16px'}}
                        >
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Register"}
                        </Button>

                        <Typography variant="body2" align="center" style={{marginTop: '12px'}}>
                            Already have an account? <Link to="/">Log In</Link>
                        </Typography>
                    </FormGroup>
                </form>

                {feedback && (
                    <Alert severity={feedback.type} sx={{ width: '100%', mt: 2 }}>
                        {feedback.message}
                    </Alert>
                )}
            </Box>
        </Box>
    )
}