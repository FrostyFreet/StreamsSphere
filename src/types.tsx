export interface seriesType{
    title:string ,
    name?:string ,
    id:number ,
    poster_path:string ,
    vote_average:number,
    overview?: string ,
}
export interface moviesType{
    title:string ,
    id:number ,
    poster_path:string ,
    vote_average:number ,
    backdrop_path:string ,
    overview:string
}

export interface featuredMovie{
    title:string ,
    id:number,
    poster_path:string ,
    vote_average:number ,
    backdrop_path:string
}
export interface searchResultTypes{
    title?:string,
    id?:number,
    name?:string
    poster_path?:string ,
    vote_average?:number ,
    backdrop_path?:string,
    overview?:string,
    type?:string
}
export interface seriesDetailTypes{
    seasons?:number,
    episode_count:number,
    poster_path?:string,
    season_number:number,
    overview:string
}

export interface genreType {
    id: number;
    name: string;
}

export interface FilterProps<T> {
    setFilteredData: React.Dispatch<React.SetStateAction<T[]>>

}