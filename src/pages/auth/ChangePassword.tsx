import {ChangeEvent, useState} from "react";
import {supabase} from "../../api/supabaseClient.tsx";
import {
    Box,
    Button,
    FormControl,
    FormGroup,
    FormHelperText, IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Typography,
    Alert
} from "@mui/material";
import {SubmitHandler, useForm} from "react-hook-form";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Navbar from "../../components/Navbar.tsx";
import {useQuery} from "@tanstack/react-query";
import {fetchSession} from "../../api/auth/fetchSession.tsx";

interface registerType{
    currentPassword:string,
    newPassword:string,
    confirmNewPassword:string
    email?:string | undefined
}

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState<string>("")
    const [newPassword, setNewPasswordPassword] = useState<string>("")
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
    const { register, handleSubmit,formState: { errors } } = useForm<registerType>()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [messageType, setMessageType] = useState<'success' | 'error'>('success')

    const {data:session}=useQuery({
        queryKey: ['session'],
        queryFn:fetchSession,
    });

    const handleClickShowCurrentPassword = () => {
        setShowCurrentPassword((prev) => !prev)
    };
    const handleClickShowNewPassword = () => {
        setShowNewPassword((prev) => !prev)
    };
    const handleClickShowConfirmNewPassword = () => {
        setShowConfirmNewPassword((prev) => !prev)
    };

    const onSubmit: SubmitHandler<registerType> = async () => {
        try {
            const email = session?.user?.email
            if (!email) {
                setMessage("User email is not available.")
                setMessageType('error')
                return
            }

            const { data: reAuthData, error: reAuthError } = await supabase.auth.signInWithPassword({
                email: email,
                password: currentPassword,
            })
            if (reAuthError) {
                setMessage("Current password is incorrect.")
                setMessageType('error')
                return
            }
            if (reAuthData) {
                if (newPassword === confirmNewPassword) {
                    const { data, error } = await supabase.auth.updateUser({
                        password: newPassword
                    })
                    if (error) {
                        setMessage("Error occurred while changing password.")
                        setMessageType('error')
                    } else {
                        setMessage("Password changed successfully.")
                        setMessageType('success')
                        setCurrentPassword("")
                        setNewPasswordPassword("")
                        setConfirmNewPassword("")
                    }
                } else {
                    setMessage("New passwords do not match.")
                    setMessageType('error')
                }
            }
        } catch (e) {
            setMessage("An unexpected error occurred.")
            setMessageType('error')
        }
    }

    return(
        <>
            {session &&
                <Navbar/>
            }
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
                        <Alert severity={messageType} sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
                                <Input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    id="currentPassword" aria-describedby="currentPassword-helper-text" value={currentPassword}
                                    {...register("currentPassword", {
                                        required: "Current password is required",
                                    })}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setCurrentPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowCurrentPassword} edge="end">
                                                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {errors.currentPassword && <FormHelperText error>{errors.currentPassword.message}</FormHelperText>}
                            </FormControl>

                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="newPassword">New Password</InputLabel>
                                <Input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"  value={newPassword}
                                    {...register("newPassword", {
                                        required: "New Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters long"
                                        }
                                    })}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setNewPasswordPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowNewPassword} edge="end">
                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {errors.newPassword ? <FormHelperText error>{errors.newPassword.message}</FormHelperText> :<FormHelperText></FormHelperText>}
                            </FormControl>
                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="confirmNewPassword">Confirm New Password</InputLabel>
                                <Input
                                    type={showConfirmNewPassword ? 'text' : 'password'}
                                    id="confirmNewPassword" value={confirmNewPassword}
                                    {...register("confirmNewPassword", {
                                        required: "Please confirm your password",
                                        validate: value => value === newPassword || "Passwords do not match"
                                    })}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setConfirmNewPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowConfirmNewPassword} edge="end">
                                                {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {errors.confirmNewPassword ? <FormHelperText error>{errors.confirmNewPassword.message}</FormHelperText> :<FormHelperText></FormHelperText>}
                            </FormControl>

                            <Button variant="contained" color="primary" type={"submit"} fullWidth
                                    style={{marginTop: '16px'}}>
                                Submit
                            </Button>
                        </FormGroup>
                    </form>
                </Box>
            </Box>
        </>
    )
}