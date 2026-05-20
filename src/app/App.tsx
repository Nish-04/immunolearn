import { BrowserRouter, Routes, Route } from "react-router";
import { LanguageProvider } from "./context/LanguageContext";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { LectureNotes } from "./components/LectureNotes";
import { InteractiveActivities } from "./components/InteractiveActivities";
import { DragDropGame } from "./components/DragDropGame";
import { QuizAssessment } from "./components/QuizAssessment";
import { Multimedia } from "./components/Multimedia";
import { StudentProgress } from "./components/StudentProgress";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
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