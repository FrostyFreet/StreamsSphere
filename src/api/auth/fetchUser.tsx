import {supabase} from "../supabaseClient.tsx";

export const fetchUser=async()=>{
    try {
        const {data} = await supabase.auth.getUser()
        return data
    }
    catch (e) {
        console.error(e)
    }
}