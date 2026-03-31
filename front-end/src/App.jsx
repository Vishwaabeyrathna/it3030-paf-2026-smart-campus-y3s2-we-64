import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import OAuth2CallbackPage from './pages/OAuth2CallbackPage'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import TechnicianDashboard from './pages/TechnicianDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRedirect from './components/RoleRedirect'
import ResourceListPage from './pages/ResourceListPage'
import AddResourcePage from './pages/AddResourcePage'
import ResourceDetailsPage from './pages/ResourceDetailsPage'
import EditResourcePage from './pages/EditResourcePage'
import ResourceAvailabilityPage from './pages/ResourceAvailabilityPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

      {/* Role-based redirect from / */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Resource Routes */}
      <Route path="/resources" element={<ResourceListPage />} />
      <Route path="/resources/new" element={<AddResourcePage />} />
      <Route path="/resources/:id" element={<ResourceDetailsPage />} />
      <Route path="/resources/edit/:id" element={<EditResourcePage />} />
      <Route path="/resources/:id/availability" element={<ResourceAvailabilityPage />} />

      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute roles={['USER']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/technician"
        element={
          <ProtectedRoute roles={['TECHNICIAN']}>
            <TechnicianDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all → role redirect */}
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  )
}

export default App
