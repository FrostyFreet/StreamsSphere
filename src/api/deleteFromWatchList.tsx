import {supabase} from "./supabaseClient.tsx";

export const deleteFromWatchList=async(movie_id:number|null)=>{
    try {
        const {data} = await supabase
            .from('bookmarked')
            .delete()
            .eq('movie_id', movie_id)
        return data
    }
    catch (e) {
        console.error(e)
    }
}