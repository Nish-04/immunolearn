import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";
import { LanguageProvider } from "./context/LanguageContext";

import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { LectureNotes } from "./components/LectureNotes";
import { InteractiveActivities } from "./components/InteractiveActivities";
import { DragDropGame } from "./components/DragDropGame";
import { MemoryCardGame } from "./components/MemoryCardGame";
import { DiagramLabelGame } from "./components/DiagramLabelGame";
import { QuizAssessment } from "./components/QuizAssessment";
import { Multimedia } from "./components/Multimedia";
import { StudentProgress } from "./components/StudentProgress";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { AuthPage } from "./components/AuthPage";
import { Button } from "./components/ui/button";

type UserRole = "student" | "teacher" | null;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const teacherSnap = await getDoc(
          doc(db, "teachers", currentUser.uid)
        );

        if (teacherSnap.exists()) {
          setRole("teacher");
          setLoading(false);
          return;
        }

        const studentSnap = await getDoc(
          doc(db, "students", currentUser.uid)
        );

        if (studentSnap.exists()) {
          setRole("student");
          setLoading(false);
          return;
        }

        setRole("student");
      } catch (error) {
        console.error("Error checking account role:", error);
        setRole("student");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 font-medium">
            Loading ImmunoLearn...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (role === "teacher") {
    return (
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <div className="flex justify-end px-6 py-4 bg-white border-b">
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>

            <TeacherDashboard />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route
                path="/lecture-notes"
                element={<LectureNotes />}
              />

              <Route
                path="/activities"
                element={<InteractiveActivities />}
              />

              <Route
                path="/activities/drag-drop"
                element={<DragDropGame />}
              />

              <Route
                path="/activities/memory-card"
                element={<MemoryCardGame />}
              />

              <Route
                path="/activities/diagram-label"
                element={<DiagramLabelGame />}
              />

              <Route
                path="/quiz"
                element={<QuizAssessment />}
              />

              <Route
                path="/multimedia"
                element={<Multimedia />}
              />

              <Route
                path="/progress"
                element={<StudentProgress />}
              />

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}