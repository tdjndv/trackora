import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as authApi from "../../api/auth"
import type { UserDTO } from "../../types/auth"

type AuthState = {
  user: UserDTO | null
  loading: boolean
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
}

// 🔄 check current user (on app start)
export const refreshMe = createAsyncThunk<UserDTO>(
  "auth/refreshMe",
  async (_, thunkAPI) => {
    try {
      return await authApi.me()
    } catch {
      return thunkAPI.rejectWithValue("Not authenticated")
    }
  }
)

// 🔐 signin
export const signin = createAsyncThunk<
  UserDTO,
  { email: string; password: string }
>("auth/signin", async (input, thunkAPI) => {
  try {
    await authApi.signin(input)
    return await authApi.me()
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error)
  }
})

// 🆕 signup
export const signup = createAsyncThunk<
  UserDTO,
  { email: string; password: string; confirm: string }
>("auth/signup", async (input, thunkAPI) => {
  try {
    await authApi.signup(input)
    return await authApi.me()
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

// 🚪 signout
export const signout = createAsyncThunk(
  "auth/signout",
  async (_, thunkAPI) => {
    try {
      await authApi.signout()
    } catch {
      return thunkAPI.rejectWithValue("Signout failed")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // refresh
      .addCase(refreshMe.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.initialized = true
      })
      .addCase(refreshMe.rejected, (state) => {
        state.user = null
        state.loading = false
        state.initialized = true
      })

      // signin
      .addCase(signin.pending, (state) => {
        state.loading = true
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.initialized = true
      })
      .addCase(signin.rejected, (state) => {
        state.loading = false
        state.initialized = true
      })

      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.initialized = true
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false
        state.initialized = true
      })

      // signout
      .addCase(signout.fulfilled, (state) => {
        state.user = null
        state.loading = false
        state.initialized = true
      })
  },
})

export default authSlice.reducer