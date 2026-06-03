import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  FileQuestion,
  Gamepad2,
  Medal,
  RefreshCw,
  ShieldCheck,
  Timer,
  Trophy,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../context/LanguageContext";
import type { LucideIcon } from "lucide-react";

interface StudentData {
  name?: string;
  email?: string;

  lectureCompletedTopics?: string[];
  lectureCompletedCount?: number;
  lectureTotalTopics?: number;
  lecturePercentage?: number;
  lastLectureTopic?: string;

  dragDropScore?: number;
  dragDropTotal?: number;
  dragDropPercentage?: number;
  dragDropPerformance?: string;

  immuneMatchCompleted?: boolean;
  immuneMatchMoves?: number;
  immuneMatchTimeSeconds?: number;

  defenseLabCompleted?: boolean;
  defenseLabScore?: number;
  defenseLabMistakes?: number;

  quizScore?: number;
  quizTotal?: number;
  quizPercentage?: number;
  quizPerformance?: string;

  completedActivities?: string[];
  lastActivity?: string;
}

type SummaryItem = {
  title: string;
  percentage: number;
  scoreText: string;
  description: string;
  icon: LucideIcon;
  iconStyle: string;
};

export function StudentProgress() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();

  const text = {
    en: {
      loading: "Loading student progress...",
      failedLoad: "Failed to load student progress.",
      pageTitle: "Your Learning Progress",
      pageSubtitle:
        "Track your lecture notes, game activities, quiz score, and overall learning performance.",
      refresh: "Refresh Progress",
      overall: "Overall",
      overallProgress: "Overall Progress",
      lecture: "Lecture",
      lectureNotes: "Lecture Notes",
      topics: "topics",
      sections: "Sections",
      sectionsCompleted: "Sections Completed",
      badges: "Badges",
      studentInformation: "Student Information",
      studentName: "Student Name",
      email: "Email",
      lastActivity: "Last Activity",
      lastLectureTopic: "Last Lecture Topic",
      performanceSummary: "Performance Summary",
      completed: "Completed",
      notCompleted: "Not Completed",
      of: "of",
      performance: "Performance",
      score: "Score",
      moves: "Moves",
      time: "Time",
      mistakes: "Mistakes",
      chapterProgress: "Lecture Topic Progress",
      recentAchievements: "Recent Achievements",
      dragDropActivity: "Drag & Drop Game",
      immuneMatch: "Immune Match",
      defenseLab: "Defense Lab Mission",
      quizAssessment: "Quiz Assessment",
      introduction: "Introduction to Immunity",
      types: "Types of Immunity",
      pathogens: "Pathogens",
      whiteBloodCells: "White Blood Cells",
      vaccination: "Vaccination",
      startedLecture: "Started Lecture Notes",
      completedDrag: "Completed Drag & Drop Game",
      completedImmuneMatch: "Completed Immune Match",
      completedDefenseLab: "Completed Defense Lab Mission",
      completedQuiz: "Completed Quiz Assessment",
      earnedExcellent: "Earned Excellent Performance Badge",
      overallReached: "Overall progress reached",
      noAchievements:
        "No achievements yet. Read the lecture notes or complete an activity to unlock badges.",
      noActivity: "No activity yet",
      noLecture: "No lecture viewed yet",
      student: "Student",
      noEmail: "No email",
      excellent: "Excellent",
      good: "Good",
      needsImprovement: "Needs Improvement",
      activityProgress: "Activity Progress",
      fiveLearningSections: "Five learning sections",
    },

    ms: {
      loading: "Memuatkan kemajuan pelajar...",
      failedLoad: "Gagal memuatkan kemajuan pelajar.",
      pageTitle: "Kemajuan Pembelajaran Anda",
      pageSubtitle:
        "Pantau nota kuliah, aktiviti permainan, markah kuiz dan prestasi pembelajaran keseluruhan.",
      refresh: "Segar Semula Kemajuan",
      overall: "Keseluruhan",
      overallProgress: "Kemajuan Keseluruhan",
      lecture: "Kuliah",
      lectureNotes: "Nota Kuliah",
      topics: "topik",
      sections: "Bahagian",
      sectionsCompleted: "Bahagian Selesai",
      badges: "Lencana",
      studentInformation: "Maklumat Pelajar",
      studentName: "Nama Pelajar",
      email: "Emel",
      lastActivity: "Aktiviti Terakhir",
      lastLectureTopic: "Topik Kuliah Terakhir",
      performanceSummary: "Ringkasan Prestasi",
      completed: "Selesai",
      notCompleted: "Belum Selesai",
      of: "daripada",
      performance: "Prestasi",
      score: "Markah",
      moves: "Gerakan",
      time: "Masa",
      mistakes: "Kesalahan",
      chapterProgress: "Kemajuan Topik Kuliah",
      recentAchievements: "Pencapaian Terkini",
      dragDropActivity: "Permainan Seret dan Lepas",
      immuneMatch: "Immune Match",
      defenseLab: "Defense Lab Mission",
      quizAssessment: "Kuiz dan Penilaian",
      introduction: "Pengenalan kepada Imuniti",
      types: "Jenis Imuniti",
      pathogens: "Patogen",
      whiteBloodCells: "Sel Darah Putih",
      vaccination: "Vaksinasi",
      startedLecture: "Memulakan Nota Kuliah",
      completedDrag: "Menyelesaikan Permainan Seret dan Lepas",
      completedImmuneMatch: "Menyelesaikan Immune Match",
      completedDefenseLab: "Menyelesaikan Defense Lab Mission",
      completedQuiz: "Menyelesaikan Kuiz dan Penilaian",
      earnedExcellent: "Mendapat Lencana Prestasi Cemerlang",
      overallReached: "Kemajuan keseluruhan mencapai",
      noAchievements:
        "Belum ada pencapaian. Baca nota kuliah atau selesaikan aktiviti untuk membuka lencana.",
      noActivity: "Belum ada aktiviti",
      noLecture: "Belum melihat nota kuliah",
      student: "Pelajar",
      noEmail: "Tiada emel",
      excellent: "Cemerlang",
      good: "Baik",
      needsImprovement: "Perlu Penambahbaikan",
      activityProgress: "Kemajuan Aktiviti",
      fiveLearningSections: "Lima bahagian pembelajaran",
    },

    zh: {
      loading: "正在加载学生进度...",
      failedLoad: "无法加载学生进度。",
      pageTitle: "你的学习进度",
      pageSubtitle: "跟踪讲义、游戏活动、测验成绩和整体学习表现。",
      refresh: "刷新进度",
      overall: "总体",
      overallProgress: "总体进度",
      lecture: "讲义",
      lectureNotes: "讲义",
      topics: "个主题",
      sections: "部分",
      sectionsCompleted: "已完成部分",
      badges: "徽章",
      studentInformation: "学生信息",
      studentName: "学生姓名",
      email: "电子邮件",
      lastActivity: "最后活动",
      lastLectureTopic: "最后讲义主题",
      performanceSummary: "表现总结",
      completed: "已完成",
      notCompleted: "未完成",
      of: "共",
      performance: "表现",
      score: "分数",
      moves: "步数",
      time: "时间",
      mistakes: "错误",
      chapterProgress: "讲义主题进度",
      recentAchievements: "最近成就",
      dragDropActivity: "拖放游戏",
      immuneMatch: "免疫配对",
      defenseLab: "防御实验室任务",
      quizAssessment: "测验与评估",
      introduction: "免疫简介",
      types: "免疫类型",
      pathogens: "病原体",
      whiteBloodCells: "白细胞",
      vaccination: "疫苗接种",
      startedLecture: "开始学习讲义",
      completedDrag: "完成拖放游戏",
      completedImmuneMatch: "完成免疫配对",
      completedDefenseLab: "完成防御实验室任务",
      completedQuiz: "完成测验与评估",
      earnedExcellent: "获得优秀表现徽章",
      overallReached: "总体进度达到",
      noAchievements: "还没有成就。阅读讲义或完成活动即可解锁徽章。",
      noActivity: "还没有活动",
      noLecture: "还未查看讲义",
      student: "学生",
      noEmail: "没有电子邮件",
      excellent: "优秀",
      good: "良好",
      needsImprovement: "需要改进",
      activityProgress: "活动进度",
      fiveLearningSections: "五个学习部分",
    },

    ar: {
      loading: "جارٍ تحميل تقدم الطالب...",
      failedLoad: "فشل تحميل تقدم الطالب.",
      pageTitle: "تقدم التعلم الخاص بك",
      pageSubtitle:
        "تتبع ملاحظات المحاضرة وأنشطة الألعاب ودرجة الاختبار والأداء العام.",
      refresh: "تحديث التقدم",
      overall: "الإجمالي",
      overallProgress: "التقدم الإجمالي",
      lecture: "المحاضرة",
      lectureNotes: "ملاحظات المحاضرة",
      topics: "موضوعات",
      sections: "الأقسام",
      sectionsCompleted: "الأقسام المكتملة",
      badges: "الشارات",
      studentInformation: "معلومات الطالب",
      studentName: "اسم الطالب",
      email: "البريد الإلكتروني",
      lastActivity: "آخر نشاط",
      lastLectureTopic: "آخر موضوع محاضرة",
      performanceSummary: "ملخص الأداء",
      completed: "اكتمل",
      notCompleted: "غير مكتمل",
      of: "من",
      performance: "الأداء",
      score: "الدرجة",
      moves: "الحركات",
      time: "الوقت",
      mistakes: "الأخطاء",
      chapterProgress: "تقدم موضوعات المحاضرة",
      recentAchievements: "الإنجازات الأخيرة",
      dragDropActivity: "لعبة السحب والإفلات",
      immuneMatch: "مطابقة المناعة",
      defenseLab: "مهمة مختبر الدفاع",
      quizAssessment: "الاختبار والتقييم",
      introduction: "مقدمة إلى المناعة",
      types: "أنواع المناعة",
      pathogens: "مسببات المرض",
      whiteBloodCells: "خلايا الدم البيضاء",
      vaccination: "التطعيم",
      startedLecture: "بدأ ملاحظات المحاضرة",
      completedDrag: "أكمل لعبة السحب والإفلات",
      completedImmuneMatch: "أكمل مطابقة المناعة",
      completedDefenseLab: "أكمل مهمة مختبر الدفاع",
      completedQuiz: "أكمل الاختبار والتقييم",
      earnedExcellent: "حصل على شارة الأداء الممتاز",
      overallReached: "وصل التقدم الإجمالي إلى",
      noAchievements:
        "لا توجد إنجازات بعد. اقرأ ملاحظات المحاضرة أو أكمل نشاطاً لفتح الشارات.",
      noActivity: "لا يوجد نشاط بعد",
      noLecture: "لم يتم عرض أي محاضرة بعد",
      student: "طالب",
      noEmail: "لا يوجد بريد إلكتروني",
      excellent: "ممتاز",
      good: "جيد",
      needsImprovement: "يحتاج إلى تحسين",
      activityProgress: "تقدم النشاط",
      fiveLearningSections: "خمسة أقسام تعليمية",
    },
  };

  const currentText = text[language];

  const translatePerformance = (performance: string) => {
    if (performance === "Excellent") {
      return currentText.excellent;
    }

    if (performance === "Good") {
      return currentText.good;
    }

    if (performance === "Needs Improvement") {
      return currentText.needsImprovement;
    }

    return currentText.noActivity;
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const fetchProgress = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        setStudentData(null);
        return;
      }

      const studentRef = doc(db, "students", user.uid);

      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        setStudentData(studentSnap.data() as StudentData);
      } else {
        setStudentData({
          name: user.displayName || currentText.student,
          email: user.email || "",
          lastActivity: currentText.noActivity,
        });
      }
    } catch (error) {
      console.error("Error loading progress:", error);

      alert(currentText.failedLoad);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
        <div className="rounded-[2rem] border border-white bg-white/90 px-10 py-8 text-center shadow-xl">
          <RefreshCw className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-600" />

          <p className="font-semibold text-gray-600">{currentText.loading}</p>
        </div>
      </div>
    );
  }

  const studentName = studentData?.name || currentText.student;

  const studentEmail = studentData?.email || currentText.noEmail;

  const lastActivity = studentData?.lastActivity || currentText.noActivity;

  const lectureCompletedTopics = studentData?.lectureCompletedTopics ?? [];

  const lectureCompletedCount =
    studentData?.lectureCompletedCount ?? lectureCompletedTopics.length;

  const lectureTotalTopics = studentData?.lectureTotalTopics ?? 5;

  const lecturePercentage =
    studentData?.lecturePercentage ??
    Math.round((lectureCompletedCount / lectureTotalTopics) * 100);

  const lastLectureTopic =
    studentData?.lastLectureTopic || currentText.noLecture;

  const dragScore = studentData?.dragDropScore ?? 0;

  const dragTotal = studentData?.dragDropTotal ?? 10;

  const dragPercentage = studentData?.dragDropPercentage ?? 0;

  const dragPerformance =
    studentData?.dragDropPerformance ?? "No activity yet";

  const immuneMatchCompleted = studentData?.immuneMatchCompleted === true;

  const immuneMatchMoves = studentData?.immuneMatchMoves ?? 0;

  const immuneMatchTimeSeconds = studentData?.immuneMatchTimeSeconds ?? 0;

  const immuneMatchPercentage = immuneMatchCompleted ? 100 : 0;

  const defenseLabCompleted = studentData?.defenseLabCompleted === true;

  const defenseLabScore = studentData?.defenseLabScore ?? 0;

  const defenseLabMistakes = studentData?.defenseLabMistakes ?? 0;

  const defenseLabPercentage = defenseLabCompleted ? defenseLabScore : 0;

  const quizScore = studentData?.quizScore ?? 0;

  const quizTotal = studentData?.quizTotal ?? 10;

  const quizPercentage = studentData?.quizPercentage ?? 0;

  const quizPerformance = studentData?.quizPerformance ?? "No activity yet";

  const hasLectureActivity = lectureCompletedCount > 0;

  const hasDragActivity =
    typeof studentData?.dragDropPercentage === "number";

  const hasQuizActivity =
    typeof studentData?.quizPercentage === "number";

  const completedSections =
    (hasLectureActivity ? 1 : 0) +
    (hasDragActivity ? 1 : 0) +
    (immuneMatchCompleted ? 1 : 0) +
    (defenseLabCompleted ? 1 : 0) +
    (hasQuizActivity ? 1 : 0);

  const overallPercentage = Math.round(
    (lecturePercentage +
      dragPercentage +
      immuneMatchPercentage +
      defenseLabPercentage +
      quizPercentage) /
      5
  );

  let overallPerformance = currentText.noActivity;

  if (overallPercentage >= 80) {
    overallPerformance = currentText.excellent;
  } else if (overallPercentage >= 60) {
    overallPerformance = currentText.good;
  } else if (overallPercentage > 0) {
    overallPerformance = currentText.needsImprovement;
  }

  const badges =
    overallPercentage >= 80
      ? 6
      : overallPercentage >= 60
      ? 4
      : overallPercentage > 0
      ? 1
      : 0;

  const circleSize = 2 * Math.PI * 56;

  const summaryItems: SummaryItem[] = [
    {
      title: currentText.lectureNotes,
      percentage: lecturePercentage,
      scoreText: `${lectureCompletedCount}/${lectureTotalTopics} ${currentText.topics}`,
      description: lastLectureTopic,
      icon: BookOpen,
      iconStyle: "bg-green-100 text-green-700",
    },

    {
      title: currentText.dragDropActivity,
      percentage: dragPercentage,
      scoreText: `${dragScore}/${dragTotal}`,
      description: `${currentText.performance}: ${translatePerformance(
        dragPerformance
      )}`,
      icon: Gamepad2,
      iconStyle: "bg-blue-100 text-blue-700",
    },

    {
      title: currentText.immuneMatch,
      percentage: immuneMatchPercentage,
      scoreText: immuneMatchCompleted
        ? currentText.completed
        : currentText.notCompleted,
      description: immuneMatchCompleted
        ? `${currentText.moves}: ${immuneMatchMoves} • ${
            currentText.time
          }: ${formatTime(immuneMatchTimeSeconds)}`
        : currentText.noActivity,
      icon: Brain,
      iconStyle: "bg-purple-100 text-purple-700",
    },

    {
      title: currentText.defenseLab,
      percentage: defenseLabPercentage,
      scoreText: defenseLabCompleted
        ? `${defenseLabScore}/100`
        : currentText.notCompleted,
      description: defenseLabCompleted
        ? `${currentText.mistakes}: ${defenseLabMistakes}`
        : currentText.noActivity,
      icon: ShieldCheck,
      iconStyle: "bg-orange-100 text-orange-700",
    },

    {
      title: currentText.quizAssessment,
      percentage: quizPercentage,
      scoreText: `${quizScore}/${quizTotal}`,
      description: `${currentText.performance}: ${translatePerformance(
        quizPerformance
      )}`,
      icon: FileQuestion,
      iconStyle: "bg-pink-100 text-pink-700",
    },
  ];

  const lectureTopics = [
    {
      id: "intro",
      title: currentText.introduction,
    },
    {
      id: "types",
      title: currentText.types,
    },
    {
      id: "pathogens",
      title: currentText.pathogens,
    },
    {
      id: "white-blood-cells",
      title: currentText.whiteBloodCells,
    },
    {
      id: "vaccination",
      title: currentText.vaccination,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 px-6 py-8 font-nunito">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-fredoka text-4xl font-extrabold text-gray-900">
              {currentText.pageTitle}
            </h1>

            <p className="mt-2 max-w-3xl text-gray-600">
              {currentText.pageSubtitle}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => void fetchProgress()}
            variant="outline"
            className="gap-2 bg-white shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />

            {currentText.refresh}
          </Button>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none bg-white/95 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="relative mx-auto mb-4 h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />

                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${circleSize}`}
                    strokeDashoffset={`${
                      circleSize * (1 - overallPercentage / 100)
                    }`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-blue-600">
                      {overallPercentage}%
                    </div>

                    <div className="text-xs text-gray-600">
                      {currentText.overall}
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-fredoka text-lg font-extrabold">
                {currentText.overallProgress}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {overallPerformance}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-white/95 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="relative mx-auto mb-4 h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />

                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${circleSize}`}
                    strokeDashoffset={`${
                      circleSize * (1 - lecturePercentage / 100)
                    }`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-green-600">
                      {lecturePercentage}%
                    </div>

                    <div className="text-xs text-gray-600">
                      {currentText.lecture}
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-fredoka text-lg font-extrabold">
                {currentText.lectureNotes}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {lectureCompletedCount}/{lectureTotalTopics}{" "}
                {currentText.topics}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-white/95 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-blue-600">
                    {completedSections}
                  </div>

                  <div className="text-sm text-gray-600">/5</div>

                  <div className="mt-1 text-xs text-gray-600">
                    {currentText.sections}
                  </div>
                </div>
              </div>

              <h3 className="font-fredoka text-lg font-extrabold">
                {currentText.sectionsCompleted}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {currentText.fiveLearningSections}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-white/95 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center">
                <Trophy className="h-20 w-20 text-yellow-500" />
              </div>

              <div className="text-3xl font-extrabold">{badges}</div>

              <h3 className="font-fredoka text-lg font-extrabold">
                {currentText.badges}
              </h3>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-none bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="font-fredoka flex items-center gap-2 text-2xl">
                <User className="h-6 w-6 text-blue-600" />

                {currentText.studentInformation}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <InformationRow
                label={currentText.studentName}
                value={studentName}
              />

              <InformationRow
                label={currentText.email}
                value={studentEmail}
              />

              <InformationRow
                label={currentText.lastActivity}
                value={lastActivity}
              />

              <InformationRow
                label={currentText.lastLectureTopic}
                value={lastLectureTopic}
              />
            </CardContent>
          </Card>

          <Card className="border-none bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="font-fredoka flex items-center gap-2 text-2xl">
                <Activity className="h-6 w-6 text-green-600" />

                {currentText.performanceSummary}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {summaryItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconStyle}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="font-bold text-gray-800">
                          {item.title}
                        </span>
                      </div>

                      <span className="text-sm font-extrabold text-blue-700">
                        {item.scoreText}
                      </span>
                    </div>

                    <Progress value={item.percentage} className="h-2" />

                    <p className="mt-2 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-none bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="font-fredoka text-2xl">
                {currentText.chapterProgress}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {lectureTopics.map((topic) => {
                const topicCompleted = lectureCompletedTopics.includes(
                  topic.id
                );

                return (
                  <div key={topic.id}>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-medium">{topic.title}</span>

                      <span
                        className={`text-sm font-bold ${
                          topicCompleted ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {topicCompleted ? "100%" : "0%"}
                      </span>
                    </div>

                    <Progress
                      value={topicCompleted ? 100 : 0}
                      className="h-2"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-none bg-white/95 shadow-lg">
            <CardHeader>
              <CardTitle className="font-fredoka text-2xl">
                {currentText.recentAchievements}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {completedSections > 0 ? (
                <>
                  {hasLectureActivity && (
                    <AchievementCard
                      icon={CheckCircle}
                      iconStyle="bg-green-600"
                      cardStyle="bg-green-50"
                      title={currentText.startedLecture}
                      description={`${currentText.completed} ${lectureCompletedCount}/${lectureTotalTopics} ${currentText.topics}`}
                    />
                  )}

                  {hasDragActivity && (
                    <AchievementCard
                      icon={Medal}
                      iconStyle="bg-blue-600"
                      cardStyle="bg-blue-50"
                      title={currentText.completedDrag}
                      description={`${currentText.score}: ${dragScore}/${dragTotal}`}
                    />
                  )}

                  {immuneMatchCompleted && (
                    <AchievementCard
                      icon={Brain}
                      iconStyle="bg-purple-600"
                      cardStyle="bg-purple-50"
                      title={currentText.completedImmuneMatch}
                      description={`${currentText.moves}: ${immuneMatchMoves} • ${
                        currentText.time
                      }: ${formatTime(immuneMatchTimeSeconds)}`}
                    />
                  )}

                  {defenseLabCompleted && (
                    <AchievementCard
                      icon={ShieldCheck}
                      iconStyle="bg-orange-500"
                      cardStyle="bg-orange-50"
                      title={currentText.completedDefenseLab}
                      description={`${currentText.score}: ${defenseLabScore}/100 • ${currentText.mistakes}: ${defenseLabMistakes}`}
                    />
                  )}

                  {hasQuizActivity && (
                    <AchievementCard
                      icon={Award}
                      iconStyle="bg-pink-600"
                      cardStyle="bg-pink-50"
                      title={currentText.completedQuiz}
                      description={`${currentText.score}: ${quizScore}/${quizTotal}`}
                    />
                  )}

                  {overallPercentage >= 80 && (
                    <AchievementCard
                      icon={Trophy}
                      iconStyle="bg-yellow-500"
                      cardStyle="bg-yellow-50"
                      title={currentText.earnedExcellent}
                      description={`${currentText.overallReached} ${overallPercentage}%`}
                    />
                  )}
                </>
              ) : (
                <div className="rounded-2xl bg-gray-50 p-5 text-center">
                  <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-400" />

                  <p className="text-gray-600">
                    {currentText.noAchievements}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InformationRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-blue-50 p-4">
      <p className="text-sm font-bold text-gray-500">{label}</p>

      <p className="mt-1 break-all font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function AchievementCard({
  icon: Icon,
  iconStyle,
  cardStyle,
  title,
  description,
}: {
  icon: LucideIcon;
  iconStyle: string;
  cardStyle: string;
  title: string;
  description: string;
}) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl p-4 ${cardStyle}`}>
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconStyle}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-extrabold text-gray-900">{title}</h4>

        <p className="mt-1 text-xs text-gray-600">{description}</p>
      </div>
    </div>
  );
}