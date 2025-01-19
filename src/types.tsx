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