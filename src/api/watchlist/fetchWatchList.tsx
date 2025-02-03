import {supabase} from "../supabaseClient.tsx";
import {bookmarkedType} from "../../types.tsx";

export const fetchBookmarked = async (id:string | undefined): Promise<bookmarkedType[]> => {
    if (!id) {
        console.error("User ID is undefined");
        return [];
    }

    try{
        const {data}=await supabase.from('bookmarked').select().eq('user_id',id)
        return data || []
    }
    catch (e) {
        console.error(e)
        return [];
    }

}