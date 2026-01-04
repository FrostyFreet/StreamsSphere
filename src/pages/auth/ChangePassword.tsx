import { ChangeEvent, useEffect, useState, FormEvent } from "react";
import { supabase } from "../../api/supabaseClient.tsx";
import {
    Box,
    Button,
    FormControl,
    FormGroup,
    FormHelperText,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Typography,
    Alert,
    LinearProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Navbar from "../../components/Navbar.tsx";
import { useQuery } from "@tanstack/react-query";
import { fetchSession } from "../../api/auth/fetchSession.tsx";
import { useNavigate } from "react-router";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const navigate = useNavigate();

    const { data: session } = useQuery({
        queryKey: ['session'],
        queryFn: fetchSession,
    });

    const handleBackToLogin = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;

        if (countdown !== null && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (countdown === 0) {
            handleBackToLogin();
        }

        return () => clearInterval(timer);
    }, [countdown, navigate]);

    const handleClickShowCurrentPassword = () => setShowCurrentPassword((prev) => !prev);
    const handleClickShowNewPassword = () => setShowNewPassword((prev) => !prev);
    const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword((prev) => !prev);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { currentPassword: "", newPassword: "", confirmNewPassword: "" };

        if (!currentPassword) {
            newErrors.currentPassword = "Current password is required";
            isValid = false;
        }

        if (!newPassword) {
            newErrors.newPassword = "New Password is required";
            isValid = false;
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters long";
            isValid = false;
        }

        if (!confirmNewPassword) {
            newErrors.confirmNewPassword = "Please confirm your password";
            isValid = false;
        } else if (newPassword !== confirmNewPassword) {
            newErrors.confirmNewPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!validateForm()) {
            return;
        }

        try {
            const email = session?.user?.email;
            if (!email) {
                setMessage("User email is not available.");
                setMessageType('error');
                return;
            }

            const { error: reAuthError } = await supabase.auth.signInWithPassword({
                email: email,
                password: currentPassword,
            });

            if (reAuthError) {
                setMessage("Current password is incorrect.");
                setMessageType('error');
                return;
            }

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                setMessage("Error occurred while changing password.");
                setMessageType('error');
            } else {
                setMessage("Password changed successfully.");
                setMessageType('success');

                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
                setErrors({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

                setCountdown(10);
            }
        } catch (error) {
            console.error(error);
            setMessage("An unexpected error occurred.");
            setMessageType('error');
        }
    }

    return (
        <>
            {session && <Navbar />}
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
                        Change Password
                    </Typography>

                    {message && (
                        <Box width="100%" mb={2}>
                            <Alert severity={messageType}>
                                {message}
                                {countdown !== null && (
                                    <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                                        Redirecting to login in {countdown} seconds...
                                    </div>
                                )}
                            </Alert>
                            {countdown !== null && (
                                <LinearProgress
                                    variant="determinate"
                                    value={(10 - countdown) * 10}
                                    sx={{ mt: 1 }}
                                />
                            )}
                        </Box>
                    )}

                    {countdown === null && (
                        <form onSubmit={onSubmit} style={{ width: '100%' }}>
                            <FormGroup>
                                <FormControl margin="normal" fullWidth>
                                    <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
                                    <Input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setCurrentPassword(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowCurrentPassword} edge="end">
                                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    {errors.currentPassword && <FormHelperText error>{errors.currentPassword}</FormHelperText>}
                                </FormControl>

                                <FormControl margin="normal" fullWidth>
                                    <InputLabel htmlFor="newPassword">New Password</InputLabel>
                                    <Input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setNewPassword(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowNewPassword} edge="end">
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    {errors.newPassword && <FormHelperText error>{errors.newPassword}</FormHelperText>}
                                </FormControl>

                                <FormControl margin="normal" fullWidth>
                                    <InputLabel htmlFor="confirmNewPassword">Confirm New Password</InputLabel>
                                    <Input
                                        type={showConfirmNewPassword ? 'text' : 'password'}
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setConfirmNewPassword(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowConfirmNewPassword} edge="end">
                                                    {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    {errors.confirmNewPassword && <FormHelperText error>{errors.confirmNewPassword}</FormHelperText>}
                                </FormControl>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    style={{ marginTop: '16px' }}
                                >
                                    Submit
                                </Button>
                            </FormGroup>
                        </form>
                    )}
                </Box>
            </Box>
        </>
    )
}