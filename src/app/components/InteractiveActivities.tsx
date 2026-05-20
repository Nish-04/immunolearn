import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { MousePointer } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function InteractiveActivities() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const text = {
    en: {
      title: "Interactive Activities",
      subtitle: "Learn by doing! Choose an activity below to get started.",
      dragDropTitle: "Drag and Drop Activity",
      dragDropDescription: "Drag and drop items to the correct place.",
      startActivity: "Start Activity",
    },
    ms: {
      title: "Aktiviti Interaktif",
      subtitle: "Belajar sambil buat aktiviti! Pilih aktiviti di bawah untuk mula.",
      dragDropTitle: "Aktiviti Seret dan Lepas",
      dragDropDescription: "Seret dan lepas item ke tempat yang betul.",
      startActivity: "Mula Aktiviti",
    },
    zh: {
      title: "互动活动",
      subtitle: "通过实践学习！选择下面的活动开始。",
      dragDropTitle: "拖放活动",
      dragDropDescription: "将项目拖放到正确的位置。",
      startActivity: "开始活动",
    },
    ar: {
      title: "الأنشطة التفاعلية",
      subtitle: "تعلم من خلال التطبيق! اختر نشاطاً أدناه للبدء.",
      dragDropTitle: "نشاط السحب والإفلات",
      dragDropDescription: "اسحب العناصر وضعها في المكان الصحيح.",
      startActivity: "ابدأ النشاط",
    },
  };

  const currentText = text[language];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{currentText.title}</h1>
        <p className="text-gray-600">{currentText.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl">
        <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader>
            <div className="relative h-40 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg mb-4 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-16 bg-cyan-500 rounded-lg shadow-lg"></div>
                <MousePointer className="absolute -bottom-2 -right-2 w-8 h-8 text-gray-700" />
              </div>
            </div>

            <CardTitle>{currentText.dragDropTitle}</CardTitle>
            <CardDescription>
              {currentText.dragDropDescription}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              onClick={() => navigate("/activities/drag-drop")}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {currentText.startActivity}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}