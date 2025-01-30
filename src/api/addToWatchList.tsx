import {supabase} from "./supabaseClient.tsx";
import {bookmarkedType} from "../types.tsx";


export const addToWatchList = async ({ movie_id, title,type }: bookmarkedType) => {
    const {data}=await supabase
        .from('bookmarked')
        .select()
        .eq('movie_id',movie_id);

    if(!data){
        const { error } = await supabase
            .from('bookmarked')
            .insert([{ movie_id, title,type }]);
        if(error){
            return "No data added"
        }
        return "Added to bookmark"
    }

}