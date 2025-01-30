import { supabase } from "./supabaseClient.tsx";

// Function to fetch the current session
export const fetchSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            throw new Error(error.message);
        }

        if (session) {
            console.log('Current session:', session);
            return session; // Return the current session
        } else {
            console.log('No active session found.');
            return null; // No active session
        }
    } catch (e) {
        console.error('Error fetching session:', e);
    }
};

// Set up a listener for authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session);
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
    }
});
