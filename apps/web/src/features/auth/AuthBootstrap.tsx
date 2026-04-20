import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import { refreshMe } from "./authSlice"

export default function AuthBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(refreshMe())
  }, [dispatch])

  return null
}