import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ms" | "zh" | "ar";

interface Translations {
  home: string;
  lectureNotes: string;
  activities: string;
  quiz: string;
  multimedia: string;
  progress: string;
  humanImmunity: string;
  courseware: string;
  startLearning: string;
  chapterOverview: string;
  learningObjectives: string;
  languageToggle: string;
  studentProgress: string;
}

const translations: Record<Language, Translations> = {
  en: {
    home: "Home",
    lectureNotes: "Lecture Notes",
    activities: "Activities",
    quiz: "Quiz & Assessment",
    multimedia: "Multimedia",
    progress: "Student Progress",
    humanImmunity: "Human Immunity",
    courseware: "Courseware",
    startLearning: "Start Learning",
    chapterOverview: "Chapter Overview",
    learningObjectives: "Learning Objectives",
    languageToggle: "Language Toggle",
    studentProgress: "Student Progress",
  },
  ms: {
    home: "Laman Utama",
    lectureNotes: "Nota Kuliah",
    activities: "Aktiviti",
    quiz: "Kuiz & Penilaian",
    multimedia: "Multimedia",
    progress: "Kemajuan Pelajar",
    humanImmunity: "Imuniti Manusia",
    courseware: "Kursus",
    startLearning: "Mula Belajar",
    chapterOverview: "Gambaran Bab",
    learningObjectives: "Objektif Pembelajaran",
    languageToggle: "Tukar Bahasa",
    studentProgress: "Kemajuan Pelajar",
  },
  zh: {
    home: "主页",
    lectureNotes: "讲义",
    activities: "活动",
    quiz: "测验与评估",
    multimedia: "多媒体",
    progress: "学生进度",
    humanImmunity: "人体免疫",
    courseware: "课程",
    startLearning: "开始学习",
    chapterOverview: "章节概述",
    learningObjectives: "学习目标",
    languageToggle: "语言切换",
    studentProgress: "学生进度",
  },
  ar: {
    home: "الرئيسية",
    lectureNotes: "ملاحظات المحاضرة",
    activities: "الأنشطة",
    quiz: "الاختبار والتقييم",
    multimedia: "الوسائط المتعددة",
    progress: "تقدم الطالب",
    humanImmunity: "المناعة البشرية",
    courseware: "المقرر الدراسي",
    startLearning: "ابدأ التعلم",
    chapterOverview: "نظرة عامة على الفصل",
    learningObjectives: "أهداف التعلم",
    languageToggle: "تبديل اللغة",
    studentProgress: "تقدم الطالب",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
