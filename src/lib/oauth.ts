import type { Provider } from "@supabase/supabase-js";
import { supabase } from "./supabase";

const redirectTo = `${window.location.origin}/auth/callback`;

export async function signInWithProvider(provider: Provider) {
    const {error} = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
    })

    if (error) throw error;
}