import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import FeatureDetailPage from './pages/FeatureDetailPage'
import FaqPage from './pages/FaqPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CreateProjectPage from './pages/CreateProjectPage'
import WorkstationPage from './pages/WorkstationPage'
import MyPage from './pages/MyPage'
import ReportPage from './pages/ReportPage'
import ClaimReviewPage from './pages/ClaimReviewPage'

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/features/:slug" element={<FeatureDetailPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/report/:projectId" element={<ReportPage />} />

        {/* Protected */}
        <Route
          path="/claim-review"
          element={
            <ProtectedRoute redirectTo="/signup">
              <ClaimReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workstation/:projectId"
          element={
            <ProtectedRoute>
              <WorkstationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
