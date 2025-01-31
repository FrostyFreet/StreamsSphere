import {supabase} from "../supabaseClient.tsx";
import {bookmarkedType} from "../../types.tsx";


export const addToWatchList = async ({ movie_id, title, type, user_id }: bookmarkedType) => {
    const { data } = await supabase
        .from('bookmarked')
        .select()
        .eq('movie_id', movie_id)

    if (data && data.length === 0) {
        const { error } = await supabase
            .from('bookmarked')
            .insert([{ movie_id, title, type, user_id }])

        if (error) {
            return "No data added"
        }
        return "Added to bookmark"
    }
    return "Movie already bookmarked"
};
