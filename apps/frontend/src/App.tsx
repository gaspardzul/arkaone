import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MembersPage } from './pages/MembersPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { AttendancePage } from './pages/AttendancePage';
import { MinistriesPage } from './pages/MinistriesPage';
import { FollowUpPage } from './pages/FollowUpPage';
import { OfferingsPage } from './pages/OfferingsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/meetings" element={<MeetingsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/ministries" element={<MinistriesPage />} />
        <Route path="/follow-up" element={<FollowUpPage />} />
        <Route path="/offerings" element={<OfferingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
