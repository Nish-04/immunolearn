import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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

  // Extra common text
  welcome: string;
  logout: string;
  loggedInAs: string;
  dragDropActivity: string;
  quizAssessment: string;
  multimediaResources: string;
  yourLearningProgress: string;
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

    welcome: "Welcome",
    logout: "Logout",
    loggedInAs: "Logged in as",
    dragDropActivity: "Drag and Drop Activity",
    quizAssessment: "Quiz Assessment",
    multimediaResources: "Multimedia Resources",
    yourLearningProgress: "Your Learning Progress",
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

    welcome: "Selamat Datang",
    logout: "Log Keluar",
    loggedInAs: "Log masuk sebagai",
    dragDropActivity: "Aktiviti Seret dan Lepas",
    quizAssessment: "Kuiz dan Penilaian",
    multimediaResources: "Sumber Multimedia",
    yourLearningProgress: "Kemajuan Pembelajaran Anda",
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

    welcome: "欢迎",
    logout: "登出",
    loggedInAs: "登录为",
    dragDropActivity: "拖放活动",
    quizAssessment: "测验与评估",
    multimediaResources: "多媒体资源",
    yourLearningProgress: "你的学习进度",
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

    welcome: "مرحباً",
    logout: "تسجيل الخروج",
    loggedInAs: "تم تسجيل الدخول باسم",
    dragDropActivity: "نشاط السحب والإفلات",
    quizAssessment: "الاختبار والتقييم",
    multimediaResources: "موارد الوسائط المتعددة",
    yourLearningProgress: "تقدم التعلم الخاص بك",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("immunolearn_language");

    if (
      savedLanguage === "en" ||
      savedLanguage === "ms" ||
      savedLanguage === "zh" ||
      savedLanguage === "ar"
    ) {
      return savedLanguage;
    }

    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("immunolearn_language", lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
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