import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { BookOpen, Target, Globe, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";

export function HomePage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const text = {
    en: {
      immunity: "Immunity",
      heroDescription:
        "Explore the fascinating world of the immune system through interactive lessons, activities, and multimedia.",
      explore: "Explore →",
      viewProgress: "View Progress →",
      chapterDescription: "View all chapters and topics in the course.",
      objectivesDescription:
        "Understand what you will learn in this course.",
      activitiesTitle: "Interactive Activities",
      activitiesDescription: "Practice with interactive exercises.",
      progressDescription: "Track your learning progress and scores.",
    },
    ms: {
      immunity: "Imuniti",
      heroDescription:
        "Terokai dunia sistem imun melalui pelajaran interaktif, aktiviti, dan multimedia.",
      explore: "Teroka →",
      viewProgress: "Lihat Kemajuan →",
      chapterDescription: "Lihat semua bab dan topik dalam kursus ini.",
      objectivesDescription:
        "Fahami apa yang akan anda pelajari dalam kursus ini.",
      activitiesTitle: "Aktiviti Interaktif",
      activitiesDescription: "Berlatih menggunakan latihan interaktif.",
      progressDescription: "Pantau kemajuan pembelajaran dan markah anda.",
    },
    zh: {
      immunity: "免疫",
      heroDescription:
        "通过互动课程、活动和多媒体探索免疫系统的世界。",
      explore: "探索 →",
      viewProgress: "查看进度 →",
      chapterDescription: "查看课程中的所有章节和主题。",
      objectivesDescription: "了解你将在本课程中学习的内容。",
      activitiesTitle: "互动活动",
      activitiesDescription: "通过互动练习进行学习。",
      progressDescription: "跟踪你的学习进度和分数。",
    },
    ar: {
      immunity: "المناعة",
      heroDescription:
        "استكشف عالم الجهاز المناعي من خلال الدروس التفاعلية والأنشطة والوسائط المتعددة.",
      explore: "استكشف →",
      viewProgress: "عرض التقدم →",
      chapterDescription: "عرض جميع الفصول والموضوعات في هذا المقرر.",
      objectivesDescription: "افهم ما ستتعلمه في هذا المقرر.",
      activitiesTitle: "الأنشطة التفاعلية",
      activitiesDescription: "تدرب باستخدام التمارين التفاعلية.",
      progressDescription: "تتبع تقدم التعلم والدرجات الخاصة بك.",
    },
  };

  const currentText = text[language];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-5xl font-bold mb-4">
            {t.humanImmunity.split(" ")[0]}{" "}
            <span className="text-blue-600">{currentText.immunity}</span>
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            {currentText.heroDescription}
          </p>

          <Button
            onClick={() => navigate("/lecture-notes")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
          >
            {t.startLearning} →
          </Button>
        </div>

        <div className="relative h-96 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl"></div>

          <Shield
            className="w-48 h-48 text-blue-600 relative z-10"
            strokeWidth={1.5}
          />

          <div className="absolute top-10 left-10 w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-purple-400 rounded-full"></div>
          </div>

          <div className="absolute top-20 right-20 w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-400 rounded-full"></div>
          </div>

          <div className="absolute bottom-10 left-20 w-14 h-14 bg-pink-200 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-pink-400 rounded-full"></div>
          </div>

          <div className="absolute bottom-20 right-10 w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-indigo-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/lecture-notes")}
        >
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>

            <CardTitle>{t.chapterOverview}</CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription>{currentText.chapterDescription}</CardDescription>

            <Button variant="link" className="text-blue-600 px-0 mt-2">
              {currentText.explore}
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/lecture-notes")}
        >
          <CardHeader>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-red-600" />
            </div>

            <CardTitle>{t.learningObjectives}</CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription>
              {currentText.objectivesDescription}
            </CardDescription>

            <Button variant="link" className="text-blue-600 px-0 mt-2">
              {currentText.explore}
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/activities")}
        >
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>

            <CardTitle>{currentText.activitiesTitle}</CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription>
              {currentText.activitiesDescription}
            </CardDescription>

            <Button variant="link" className="text-blue-600 px-0 mt-2">
              {currentText.explore}
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => navigate("/progress")}
        >
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>

            <CardTitle>{t.studentProgress}</CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription>{currentText.progressDescription}</CardDescription>

            <Button variant="link" className="text-blue-600 px-0 mt-2">
              {currentText.viewProgress}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}