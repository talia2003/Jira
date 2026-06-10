import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLoading } from '../components/PageLoading'
import { PageError } from '../components/PageError'
import { supabase } from '../lib/supabase'

export function AuthCallbackPage() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const finishSignIn = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                setError(error.message);
                return;
            }

            if (data.session) {
                navigate("/", { replace: true });
                return;
            }

            setError("Sign in failed");
        }

        void finishSignIn()
        }, [navigate])

        if (error) {
            return <PageError message={error} size="sm" />
}
return <PageLoading message="Signing you in..." size="sm" />
}