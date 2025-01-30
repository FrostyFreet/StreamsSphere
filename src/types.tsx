import React, {Dispatch} from "react";


export interface seriesType {
    title: string  | undefined,
    name?: string,
    id: number,
    poster_path: string,
    vote_average: number,
    overview?: string,
}

export interface moviesType {
    title: string,
    id: number,
    poster_path: string,
    vote_average: number,
    backdrop_path: string,
    overview: string
}

export interface HomeCardsProps {
    clickedButton: string;
}

export interface searchResultTypes {
    title?: string,
    id?: number,
    name?: string
    poster_path?: string,
    vote_average?: number,
    backdrop_path?: string,
    overview?: string,
    type?: string
}


export interface genreType {
    id: number;
    name: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface FilterProps<T> {
    setFilteredData?: React.Dispatch<React.SetStateAction<T[]>>
    sortBy: string
    releaseDate: string | undefined
    setReleaseDate: React.Dispatch<React.SetStateAction<string | undefined>>
    category: number[]
    setCategory: Dispatch<React.SetStateAction<number[]>>
    genres: Genre[]
    setGenres: Dispatch<React.SetStateAction<Genre[]>>
    setPage?: Dispatch<React.SetStateAction<number>>
    setSortBy: Dispatch<React.SetStateAction<string>>
}

export interface episodeType {
    id: number,
    still_path: string,
    name: string,
    episode_number: number,
    vote_average: number
    runtime: number
    air_date?: string
}
export interface bookmarkedType{
    movie_id?:number,
    id?:number
    title?:string | undefined
    name?:string | undefined
    type?:string
    poster_path?:string
    vote_average?:number
    backdrop_path?: string,
    overview?: string
    user_id?:string
}

export interface userType {
    id: string,
    email: string,
    role: string,
}