import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChapterPage from "./pages/ChapterPage";
import BonusBook from "./pages/BonusBook";
import NotFound from "./pages/NotFound";
import PremiumUpsell from "./pages/premium/PremiumUpsell";
import PremiumDashboard from "./pages/premium/PremiumDashboard";
import ProgressQuestionnaires from "./pages/premium/ProgressQuestionnaires";
import FocusMode from "./pages/premium/FocusMode";
import FamilyManagement from "./pages/premium/FamilyManagement";
import FamilyMemberEdit from "./pages/premium/FamilyMemberEdit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path=":chapterId" element={<ChapterPage />} />
              <Route path="bonus/:bookId" element={<BonusBook />} />
            </Route>
            <Route path="/premium" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<PremiumDashboard />} />
              <Route path="family" element={<FamilyManagement />} />
              <Route path="family/edit/:id" element={<FamilyMemberEdit />} />
              <Route path="questionnaires" element={<ProgressQuestionnaires />} />
              <Route path="focus-mode" element={<FocusMode />} />
            </Route>
            <Route path="/premium/upsell" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<PremiumUpsell />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
