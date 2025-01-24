import './App.css'
import {Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import MoviesPage from "./pages/movies/MoviesPage.tsx";
import SeriesPage from "./pages/series/SeriesPage.tsx";
import LoginPage from "./api/LoginPage.tsx";
import RegisterPage from "./api/RegisterPage.tsx";
import MoviePlayer from "./pages/movies/MoviePlayer.tsx";
import SeriesPlayer from "./pages/series/SeriesPlayer.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
const queryClient = new QueryClient()

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/movies" element={<MoviesPage />}/>
            <Route path="/series" element={<SeriesPage />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage />}/>
            <Route path="/movies/:id/:name" element={<MoviePlayer />}/>
            <Route path="/series/:id/:name" element={<SeriesPlayer />}/>

        </Routes>
      </QueryClientProvider>
  )
}

export default App

