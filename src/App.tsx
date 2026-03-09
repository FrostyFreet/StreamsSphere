import './App.scss'
import {Navigate, Route, Routes} from "react-router"
import {lazy, Suspense, useState} from "react"
import { Genre} from "./types.tsx"
import {fetchUser} from "./api/auth/fetchUser.tsx"
import ProtectedRoute from "./pages/auth/ProtectedRoute.tsx"
import {useQuery} from "@tanstack/react-query"
import {fetchSession} from "./api/auth/fetchSession.tsx"
import {fetchPopularData} from "./api/moviesandseries/fetchPopularData.tsx";

const MainPage = lazy(() => import("./pages/home/MainPage.tsx"))
const HomePage = lazy(() => import("./pages/home/HomePage.tsx"))
const MoviesPage = lazy(() => import("./pages/movies/MoviesPage.tsx"))
const SeriesPage = lazy(() => import("./pages/series/SeriesPage.tsx"))
const MoviePlayer = lazy(() => import("./pages/movies/MoviePlayer.tsx"))
const SeriesPlayer = lazy(() => import("./pages/series/SeriesPlayer.tsx"))
const Register = lazy(() => import("./pages/auth/Register.tsx"))
const Watchlist = lazy(() => import("./pages/bookmarked/Watchlist.tsx"))
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword.tsx"))
const RecoverPasswordByEmail = lazy(() => import("./pages/auth/RecoverPasswordByEmail.tsx"))
const RecoverPassword = lazy(() => import("./pages/auth/RecoverPassword.tsx"))
const SearchPage = lazy(() => import("./pages/search/SearchPage.tsx"))

function App() {
    const[sortBy,setSortBy]=useState<string>("popularity.desc")
    const[releaseDate,setReleaseDate]=useState<string>()
    const[category,setCategory]=useState<number[]>([])
    const [genres, setGenres] = useState<Genre[]>([])


    const {data:user } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUser,
    })
    const {data:session}=useQuery({
        queryKey: ['session'],
        queryFn:fetchSession,
    })
    useQuery({
        queryKey: ['popularData'],
        queryFn: fetchPopularData,
    });

    if (session === undefined) {
        return <div>Loading...</div>
    }


    return (
        <Suspense fallback={<div>Loading Page...</div>}>
            <Routes>
                <Route path="/" element={session === undefined || session === null ? <MainPage /> : <Navigate to="/home" />} />
                <Route element={<ProtectedRoute user={user} />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/movies" element={<MoviesPage sortBy={sortBy} setSortBy={setSortBy} releaseDate={releaseDate} setReleaseDate={setReleaseDate} category={category} setCategory={setCategory} genres={genres} setGenres={setGenres} />} />
                    <Route path="/series" element={<SeriesPage sortBy={sortBy} setSortBy={setSortBy} releaseDate={releaseDate} setReleaseDate={setReleaseDate} category={category} setCategory={setCategory} genres={genres} setGenres={setGenres} />} />
                    <Route path="/movies/:id/:name" element={<MoviePlayer />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/series/:id/:name" element={<SeriesPlayer />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/recover-password" element={<RecoverPassword />} />
                    <Route path={"/search"} element={<SearchPage />} />
                </Route>
                <Route path="/recover-password-by-email" element={<RecoverPasswordByEmail />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Suspense>
  )
}

export default App

