import {ChangeEvent, useState} from "react"
import {supabase} from "../../api/supabaseClient.tsx"
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormGroup,
    FormHelperText, IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Typography
} from "@mui/material"
import {SubmitHandler, useForm} from "react-hook-form"
import {Visibility, VisibilityOff} from "@mui/icons-material"
import Navbar from "../../components/Navbar.tsx"
import {useQuery} from "@tanstack/react-query"
import {fetchSession} from "../../api/auth/fetchSession.tsx"
import { useNavigate} from "react-router"

interface registerType{
    newPassword:string,
    confirmNewPassword:string
    email?:string
}

export default function RecoverPassword() {
    const [newPassword, setNewPassword] = useState<string>("")

    const navigate = useNavigate()
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
    const { register, handleSubmit,formState: { errors } } = useForm<registerType>()

    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

    const {data:session}=useQuery({
        queryKey: ['session'],
        queryFn:fetchSession,
    })



    const handleClickShowNewPassword = () => {
        setShowNewPassword((prev) => !prev)
    }
    const handleClickShowConfirmNewPassword = () => {
        setShowConfirmNewPassword((prev) => !prev)
    }


    const handleBackToLogin = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const onSubmit: SubmitHandler<registerType> = async () => {
        setFeedback(null)

        if (newPassword === confirmNewPassword) {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                console.error("Error occurred while updating password:", error)
                setFeedback({ type: 'error', message: "Hiba történt a jelszó módosítása közben: " + error.message })
            } else if (data) {
                console.log(data)
                setNewPassword("")
                setConfirmNewPassword("")
                setFeedback({ type: 'success', message: "A jelszó sikeresen megváltoztatva!" })
            }
        } else {
            setFeedback({ type: 'error', message: "A jelszavak nem egyeznek meg." })
        }
    }
    return(
        <>
            {session!=null || session!=undefined &&
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
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setNewPassword(e.target.value)}
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
                                        validate: value => value === confirmNewPassword || "Passwords do not match"
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

                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                style={{ marginTop: '8px' }}
                                onClick={handleBackToLogin}
                            >
                                Back to Login
                            </Button>
                        </FormGroup>
                    </form>
                    {feedback && (
                        <Alert severity={feedback.type} sx={{ width: '100%', mb: 2 }}>
                            {feedback.message}
                        </Alert>
                    )}
                </Box>
            </Box>
        </>
    )
}