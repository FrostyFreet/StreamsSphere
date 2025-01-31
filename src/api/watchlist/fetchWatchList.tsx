import {supabase} from "../supabaseClient.tsx";
import {bookmarkedType} from "../../types.tsx";

export const fetchBookmarked = async (): Promise<bookmarkedType[]> => {
    try{
        const {data}=await supabase.from('bookmarked').select()
        return data || []
    }
    catch (e) {
        console.error(e)
        return [];
    }

}