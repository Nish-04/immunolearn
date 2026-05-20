import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { LanguageProvider } from "./context/LanguageContext";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { LectureNotes } from "./components/LectureNotes";
import { InteractiveActivities } from "./components/InteractiveActivities";
import { DragDropGame } from "./components/DragDropGame";
import { QuizAssessment } from "./components/QuizAssessment";
import { Multimedia } from "./components/Multimedia";
import { StudentProgress } from "./components/StudentProgress";
import { AuthPage } from "./components/AuthPage";
import { Button } from "./components/ui/button";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
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

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-semibold">
                {user.displayName || user.email}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => signOut(auth)}
            >
              Logout
            </Button>
          </div>

          <Navigation />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lecture-notes" element={<LectureNotes />} />
              <Route path="/activities" element={<InteractiveActivities />} />
              <Route path="/activities/drag-drop" element={<DragDropGame />} />
              <Route path="/quiz" element={<QuizAssessment />} />
              <Route path="/multimedia" element={<Multimedia />} />
              <Route path="/progress" element={<StudentProgress />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}