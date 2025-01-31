import './App.scss'
import {Navigate, Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import MoviesPage from "./pages/movies/MoviesPage.tsx";
import SeriesPage from "./pages/series/SeriesPage.tsx";
import Register from "./pages/auth/Register.tsx";
import MoviePlayer from "./pages/movies/MoviePlayer.tsx";
import SeriesPlayer from "./pages/series/SeriesPlayer.tsx";
import { useState} from "react";
import {Genre} from "./types.tsx";
import MainPage from "./pages/home/MainPage.tsx";
import {fetchUser} from "./api/auth/fetchUser.tsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute.tsx";
import {useQuery} from "@tanstack/react-query";
import Watchlist from "./pages/bookmarked/Watchlist.tsx";
import ChangePassword from "./pages/auth/ChangePassword.tsx";
import {fetchSession} from "./api/auth/fetchSession.tsx";
import RecoverPasswordByEmail from "./pages/auth/RecoverPasswordByEmail.tsx";
import RecoverPassword from "./pages/auth/RecoverPassword.tsx";


function App() {
    const[sortBy,setSortBy]=useState<string>("popularity.desc")
    const[releaseDate,setReleaseDate]=useState<string>()
    const[category,setCategory]=useState<number[]>([])
    const [genres, setGenres] = useState<Genre[]>([])


    const {data:user } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUser,
    });

    const {data:session}=useQuery({
        queryKey: ['session'],
        queryFn:fetchSession,
    });

    return (

        <Routes>
            <Route path="/" element={session===null || session===undefined  ? <MainPage />  : <Navigate to="/home" /> } />
            <Route element={<ProtectedRoute user={user} />}>
                <Route path="/home" element={<HomePage />}/>
                <Route path="/movies" element={<MoviesPage sortBy={sortBy} setSortBy={setSortBy} releaseDate={releaseDate}
                                                           setReleaseDate={setReleaseDate} category={category} setCategory={setCategory} genres={genres} setGenres={setGenres} />}/>
                <Route path="/series" element={<SeriesPage sortBy={sortBy} setSortBy={setSortBy} releaseDate={releaseDate}
                                                           setReleaseDate={setReleaseDate} category={category} setCategory={setCategory} genres={genres} setGenres={setGenres}/>}/>
                <Route path="/movies/:id/:name" element={<MoviePlayer />}/>
                <Route path="/watchlist" element={<Watchlist />}/>
                <Route path="/series/:id/:name" element={<SeriesPlayer />}/>
                <Route path="/change-password" element={<ChangePassword />}/>
            </Route>
            <Route path="/recover-password-by-email" element={<RecoverPasswordByEmail />}/>
            <Route path="/recover-password" element={<RecoverPassword />}/>
            <Route path="/register" element={<Register />}/>

        </Routes>

  )
}

export default App

