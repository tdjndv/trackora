import {Navigate} from "react-router-dom"

import { useAppSelector } from "../app/hooks"

export default function RequirePro({children}: {children: React.ReactNode}) {
    const {user, loading} = useAppSelector((state) => state.auth)
    if (loading) return <div>Loading...</div>
    if (user?.plan === "FREE") return <Navigate to="/subscription" replace />

    return <>{children}</>
}