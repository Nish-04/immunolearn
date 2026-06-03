import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  BookOpen,
  Gamepad2,
  PlayCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { AnimatedImmuneBackground } from "./AnimatedImmuneBackground";

export function HomePage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const text = {
    en: {
      titleSmall: "Explore Your Body’s",
      titleLineOne: "Immune Defense",
      titleLineTwo: "System",
      heroDescription:
        "Learn how white blood cells, antibodies, vaccines, and body defense mechanisms protect us from harmful pathogens through interactive lessons, games, quizzes, and multimedia.",
      startLearning: "Start Learning",
      tryGames: "Try Games",
      sectionTitle: "Learn Human Immunity in a Fun Way",
      chapterDescription:
        "Study immunity topics with interactive visuals, short notes, key points, and mini challenges.",
      objectivesDescription:
        "Understand antibodies, pathogens, white blood cells, vaccination, and body defense mechanisms.",
      activitiesTitle: "Interactive Games",
      activitiesDescription:
        "Practice immunity concepts using drag and drop, matching cards, and true or false challenges.",
      progressDescription:
        "Track your scores, completed topics, quiz results, and overall learning progress.",
      explore: "Explore",
      immuneDefense: "Immune Defense",
      activeProtection: "Active Protection",
      learningMode: "Learning Mode",
      interactive: "Interactive",
    },

    ms: {
      titleSmall: "Terokai Sistem",
      titleLineOne: "Pertahanan Imun",
      titleLineTwo: "Badan Anda",
      heroDescription:
        "Belajar bagaimana sel darah putih, antibodi, vaksin dan mekanisme pertahanan badan melindungi kita daripada patogen berbahaya melalui nota interaktif, permainan, kuiz dan multimedia.",
      startLearning: "Mula Belajar",
      tryGames: "Cuba Permainan",
      sectionTitle: "Belajar Imuniti Manusia Dengan Cara Menarik",
      chapterDescription:
        "Belajar topik imuniti dengan visual interaktif, nota ringkas, isi penting dan cabaran mini.",
      objectivesDescription:
        "Fahami antibodi, patogen, sel darah putih, vaksinasi dan mekanisme pertahanan badan.",
      activitiesTitle: "Permainan Interaktif",
      activitiesDescription:
        "Latih konsep imuniti melalui drag and drop, matching card dan cabaran betul atau salah.",
      progressDescription:
        "Pantau markah, topik yang selesai, keputusan kuiz dan kemajuan pembelajaran.",
      explore: "Terokai",
      immuneDefense: "Pertahanan Imun",
      activeProtection: "Perlindungan Aktif",
      learningMode: "Mod Pembelajaran",
      interactive: "Interaktif",
    },

    zh: {
      titleSmall: "探索身体的",
      titleLineOne: "免疫防御",
      titleLineTwo: "系统",
      heroDescription:
        "通过互动课程、游戏、测验和多媒体学习白细胞、抗体、疫苗和身体防御机制如何保护我们。",
      startLearning: "开始学习",
      tryGames: "尝试游戏",
      sectionTitle: "用有趣的方式学习人体免疫",
      chapterDescription:
        "通过互动视觉、简短笔记、重点和小挑战学习免疫主题。",
      objectivesDescription:
        "了解抗体、病原体、白细胞、疫苗和身体防御机制。",
      activitiesTitle: "互动游戏",
      activitiesDescription:
        "通过拖放、配对卡和判断题练习免疫概念。",
      progressDescription:
        "追踪分数、完成主题、测验成绩和整体学习进度。",
      explore: "探索",
      immuneDefense: "免疫防御",
      activeProtection: "主动保护",
      learningMode: "学习模式",
      interactive: "互动",
    },

    ar: {
      titleSmall: "اكتشف نظام",
      titleLineOne: "الدفاع المناعي",
      titleLineTwo: "في جسمك",
      heroDescription:
        "تعلم كيف تحمي خلايا الدم البيضاء والأجسام المضادة واللقاحات وآليات الدفاع الجسم من مسببات المرض من خلال الدروس والألعاب والاختبارات والوسائط المتعددة.",
      startLearning: "ابدأ التعلم",
      tryGames: "جرّب الألعاب",
      sectionTitle: "تعلم المناعة البشرية بطريقة ممتعة",
      chapterDescription:
        "ادرس موضوعات المناعة باستخدام الرسوم التفاعلية والملاحظات القصيرة والتحديات الصغيرة.",
      objectivesDescription:
        "افهم الأجسام المضادة ومسببات المرض وخلايا الدم البيضاء والتطعيم.",
      activitiesTitle: "ألعاب تفاعلية",
      activitiesDescription:
        "تدرب على مفاهيم المناعة باستخدام السحب والإفلات وبطاقات المطابقة وأسئلة صح أو خطأ.",
      progressDescription:
        "تتبع الدرجات والموضوعات المكتملة ونتائج الاختبار وتقدم التعلم.",
      explore: "استكشف",
      immuneDefense: "الدفاع المناعي",
      activeProtection: "حماية نشطة",
      learningMode: "وضع التعلم",
      interactive: "تفاعلي",
    },
  };

  const currentText = text[language];

  const cards = [
    {
      title: t.chapterOverview,
      description: currentText.chapterDescription,
      icon: BookOpen,
      path: "/lecture-notes",
      gradient: "from-blue-500 to-cyan-500",
      iconBackground: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: t.learningObjectives,
      description: currentText.objectivesDescription,
      icon: Target,
      path: "/lecture-notes",
      gradient: "from-purple-500 to-pink-500",
      iconBackground: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: currentText.activitiesTitle,
      description: currentText.activitiesDescription,
      icon: Gamepad2,
      path: "/activities",
      gradient: "from-cyan-500 to-teal-500",
      iconBackground: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      title: t.studentProgress,
      description: currentText.progressDescription,
      icon: TrendingUp,
      path: "/progress",
      gradient: "from-green-500 to-emerald-500",
      iconBackground: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden font-nunito">
      <AnimatedImmuneBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="mb-6">
              <p className="font-fredoka text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight fun-text-shadow">
                {currentText.titleSmall}
              </p>

              <h1 className="font-fredoka mt-2 leading-[0.95] tracking-tight">
                <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500">
                  {currentText.titleLineOne}
                </span>

                <span className="block mt-2 text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-600 to-fuchsia-500">
                  {currentText.titleLineTwo}
                </span>
              </h1>
            </div>

            <p className="font-nunito text-gray-600 mb-8 text-lg md:text-xl leading-relaxed max-w-xl">
              {currentText.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                onClick={() => navigate("/lecture-notes")}
                className="font-nunito bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                {currentText.startLearning} →
              </Button>

              <Button
                type="button"
                onClick={() => navigate("/activities")}
                variant="outline"
                className="font-nunito px-8 py-6 text-lg rounded-xl bg-white/90 hover:scale-105 transition-transform"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                {currentText.tryGames}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-[2rem] blur-2xl opacity-30 animate-pulse"></div>

            <div className="relative bg-white rounded-[2rem] p-4 shadow-2xl border border-white overflow-hidden">
              <img
                src="/images/homepageB.png"
                alt="Human immune system defense illustration"
                className="w-full h-[430px] object-cover rounded-[1.5rem]"
              />

              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-lg border border-white">
                <p className="text-xs text-gray-500">
                  {currentText.immuneDefense}
                </p>

                <p className="font-bold text-blue-700">
                  {currentText.activeProtection}
                </p>
              </div>

              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 shadow-lg border border-white">
                <p className="text-xs text-gray-500">
                  {currentText.learningMode}
                </p>

                <p className="font-bold text-purple-700">
                  {currentText.interactive}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 text-center">
          <h2 className="font-fredoka text-3xl lg:text-4xl font-bold text-gray-900">
            {currentText.sectionTitle}
          </h2>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Card
                key={card.title}
                className="border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer bg-white/90 overflow-hidden group"
                onClick={() => navigate(card.path)}
              >
                <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>

                <CardHeader>
                  <div
                    className={`w-16 h-16 ${card.iconBackground} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-8 h-8 ${card.iconColor}`} />
                  </div>

                  <CardTitle className="font-fredoka text-xl">
                    {card.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="font-nunito leading-relaxed">
                    {card.description}
                  </CardDescription>

                  <Button
                    type="button"
                    variant="link"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(card.path);
                    }}
                    className="font-nunito text-blue-600 px-0 mt-3 font-bold"
                  >
                    {currentText.explore} →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}