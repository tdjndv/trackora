import {Navigate} from "react-router-dom"
import { useAppSelector } from "../app/hooks"

export default function RequireAuth({children}: {children: React.ReactNode}) {
    const {user, loading} = useAppSelector((state) => state.auth)
    if (loading) return <div>Loading...</div>
    if (!user) return <Navigate to="/signin" replace />

    return <>{children}</>
}