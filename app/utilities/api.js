import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { API_URL, API_KEY } from "@env";

export const api = createClient(API_URL, API_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// verifySession is used to verify a session by making an API call to get the session information
// and then updating the state with the returned data

export async function verifySession(setState) {
  api.auth.getSession().then(({ data: { session } }) => {
    setState(session);
  });
}
