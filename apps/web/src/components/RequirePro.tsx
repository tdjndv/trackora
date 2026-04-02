import {Navigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

export default function RequirePro({children}: {children: React.ReactNode}) {
    const {user, loading} = useAuth()
    if (loading) return <div>Loading...</div>
    if (user?.plan === "FREE") return <Navigate to="/subscription" replace />

    return <>{children}</>
}