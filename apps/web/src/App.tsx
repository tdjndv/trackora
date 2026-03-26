import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar.tsx"
import RequireAuth from "./components/RequireAuth.tsx"
import SignInPage from "./pages/SignInPage.tsx"
import SignUpPage from "./pages/SignUpPage.tsx"
import AccountsPage from "./pages/AccountsPage.tsx"
import TransactionsPage from "./pages/TransactionsPage.tsx"
import DashboardPage from "./pages/DashboardPage.tsx"
import SubscriptionPage from "./pages/SubscriptionPage.tsx"
import RequirePro from "./components/RequirePro.tsx"
import BillingSuccess from "./pages/BillingSuccess.tsx"
import BillingCancel from "./pages/BillingCancel.tsx"
import IntroPage from "./pages/IntroPage.tsx"

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/billing/success" element={<BillingSuccess />} />
        <Route path="/billing/cancel" element={<BillingCancel />} />

        <Route
          path="/accounts"
          element={
            <RequireAuth>
              <AccountsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/transactions"
          element={
            <RequireAuth>
              <TransactionsPage />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <RequirePro>
                <DashboardPage />
              </RequirePro>
            </RequireAuth>
          }
        />

        <Route
          path="/subscription"
          element={
            <RequireAuth>
              <SubscriptionPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/accounts" />} />
      </Routes>
    </BrowserRouter>
  )
}