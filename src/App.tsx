import './App.scss'
import {Navigate, Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import MoviesPage from "./pages/movies/MoviesPage.tsx";
import SeriesPage from "./pages/series/SeriesPage.tsx";
import Register from "./pages/auth/Register.tsx";
import MoviePlayer from "./pages/movies/MoviePlayer.tsx";
import SeriesPlayer from "./pages/series/SeriesPlayer.tsx";
import {useEffect, useState} from "react";
import { Genre} from "./types.tsx";
import MainPage from "./pages/home/MainPage.tsx";
import {fetchUser} from "./api/auth/fetchUser.tsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute.tsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import Watchlist from "./pages/bookmarked/Watchlist.tsx";
import ChangePassword from "./pages/auth/ChangePassword.tsx";
import RecoverPasswordByEmail from "./pages/auth/RecoverPasswordByEmail.tsx";
import RecoverPassword from "./pages/auth/RecoverPassword.tsx";
import {supabase} from "./api/supabaseClient.tsx";

export default function App() {
    const[sortBy,setSortBy]=useState<string>("popularity.desc")
    const[releaseDate,setReleaseDate]=useState<string>()
    const[category,setCategory]=useState<number[]>([])
    const [genres, setGenres] = useState<Genre[]>([])

    const queryClient = useQueryClient();

    const {data: userResponse, isLoading: userLoading } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUser,
    });

    const isAuthenticated = userResponse && userResponse.user;


    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                queryClient.invalidateQueries({ queryKey: ['users'] });
            }
        });

        return () => subscription.unsubscribe();
    }, [queryClient]);

    if (userLoading) {
        return <div>Loading...</div>
    }

    return (
        <Routes>
            <Route path="/" element={!isAuthenticated ? <MainPage />  : <Navigate to="/home" /> } />

            <Route element={<ProtectedRoute user={userResponse} />}>
                <Route path="/home" element={<HomePage />}/>
                <Route path="/movies" element={<MoviesPage sortBy={sortBy} setSortBy={setSortBy} releaseDate={releaseDate}
                                                           setReleaseDate={setReleaseDate} category={category} setCategory={setCategory} genres={genres} setGenres={setGenres} />}/>
                <Route path="/series" element={<SeriesPage sortBy={sortBy} setSortBy={setSortBy} releaseDate={releaseDate}
                                                           setReleaseDate={setReleaseDate} category={category} setCategory={setCategory} genres={genres} setGenres={setGenres}/>}/>
                <Route path="/movies/:id/:name" element={<MoviePlayer />}/>
                <Route path="/watchlist" element={<Watchlist />}/>
                <Route path="/series/:id/:name" element={<SeriesPlayer />}/>
                <Route path="/change-password" element={<ChangePassword />}/>
                <Route path="/recover-password" element={<RecoverPassword />}/>
            </Route>
            <Route path="/recover-password-by-email" element={<RecoverPasswordByEmail />}/>
            <Route path="/register" element={<Register />}/>

        </Routes>
    )
}
