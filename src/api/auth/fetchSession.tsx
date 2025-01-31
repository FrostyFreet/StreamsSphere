import { supabase } from "../supabaseClient.tsx";


export const fetchSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            throw new Error(error.message);
        }

        if (session) {
            return session;
        } else {
            return null;
        }
    } catch (e) {
        console.error('Error fetching session:', e);
    }
};

// Set up a listener for authentication state changes
supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {

    } else if (event === 'SIGNED_OUT') {

    }
});
