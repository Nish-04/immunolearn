import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { LanguageProvider } from "./context/LanguageContext";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { LectureNotes } from "./components/LectureNotes";
import { InteractiveActivities } from "./components/InteractiveActivities";
import { DragDropGame } from "./components/DragDropGame";
import { QuizAssessment } from "./components/QuizAssessment";
import { Multimedia } from "./components/Multimedia";
import { StudentProgress } from "./components/StudentProgress";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { AuthPage } from "./components/AuthPage";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserRole(userSnap.data().role || null);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error loading role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const isTeacher = userRole === "teacher";

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />

          <main>
            <Routes>
              {isTeacher ? (
                <>
                  <Route
                    path="/teacher-dashboard"
                    element={<TeacherDashboard />}
                  />

                  <Route
                    path="*"
                    element={<Navigate to="/teacher-dashboard" replace />}
                  />
                </>
              ) : (
                <>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/lecture-notes" element={<LectureNotes />} />
                  <Route
                    path="/activities"
                    element={<InteractiveActivities />}
                  />
                  <Route
                    path="/activities/drag-drop"
                    element={<DragDropGame />}
                  />
                  <Route path="/quiz" element={<QuizAssessment />} />
                  <Route path="/multimedia" element={<Multimedia />} />
                  <Route path="/progress" element={<StudentProgress />} />

                  <Route
                    path="/teacher-dashboard"
                    element={<TeacherDashboard />}
                  />
                </>
              )}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}