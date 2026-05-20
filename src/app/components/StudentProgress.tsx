import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Trophy,
  Award,
  Medal,
  CheckCircle,
  User,
  RefreshCw,
  Activity,
  BookOpen,
  Gamepad2,
  FileQuestion,
} from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../context/LanguageContext";

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

  quizScore?: number;
  quizTotal?: number;
  quizPercentage?: number;
  quizPerformance?: string;

  lastActivity?: string;
}

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
        "Track your lecture notes, quiz score, drag and drop score, and overall student performance.",
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
      of: "of",
      performance: "Performance",
      dragDropActivity: "Drag and Drop Activity",
      quizAssessment: "Quiz Assessment",
      chapterProgress: "Chapter Progress",
      recentAchievements: "Recent Achievements",
      introduction: "Introduction to Immunity",
      types: "Types of Immunity",
      components: "Immune System Components",
      defense: "Body Defense Mechanisms",
      vaccination: "Vaccination",
      startedLecture: "Started Lecture Notes",
      completedDrag: "Completed Drag and Drop Activity",
      completedQuiz: "Completed Quiz Assessment",
      earnedExcellent: "Earned Excellent Performance Badge",
      overallReached: "Overall progress reached",
      score: "Score",
      noAchievements:
        "No achievements yet. Read lecture notes or complete an activity to unlock badges.",
      noActivity: "No activity yet",
      noLecture: "No lecture viewed yet",
      student: "Student",
      noEmail: "No email",
      excellent: "Excellent",
      good: "Good",
      needsImprovement: "Needs Improvement",
    },

    ms: {
      loading: "Memuatkan kemajuan pelajar...",
      failedLoad: "Gagal memuatkan kemajuan pelajar.",
      pageTitle: "Kemajuan Pembelajaran Anda",
      pageSubtitle:
        "Pantau nota kuliah, markah kuiz, markah drag and drop, dan prestasi keseluruhan pelajar.",
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
      of: "daripada",
      performance: "Prestasi",
      dragDropActivity: "Aktiviti Seret dan Lepas",
      quizAssessment: "Kuiz dan Penilaian",
      chapterProgress: "Kemajuan Bab",
      recentAchievements: "Pencapaian Terkini",
      introduction: "Pengenalan kepada Imuniti",
      types: "Jenis Imuniti",
      components: "Komponen Sistem Imun",
      defense: "Mekanisme Pertahanan Badan",
      vaccination: "Vaksinasi",
      startedLecture: "Memulakan Nota Kuliah",
      completedDrag: "Menyelesaikan Aktiviti Seret dan Lepas",
      completedQuiz: "Menyelesaikan Kuiz dan Penilaian",
      earnedExcellent: "Mendapat Lencana Prestasi Cemerlang",
      overallReached: "Kemajuan keseluruhan mencapai",
      score: "Markah",
      noAchievements:
        "Belum ada pencapaian. Baca nota kuliah atau selesaikan aktiviti untuk membuka lencana.",
      noActivity: "Belum ada aktiviti",
      noLecture: "Belum melihat nota kuliah",
      student: "Pelajar",
      noEmail: "Tiada emel",
      excellent: "Cemerlang",
      good: "Baik",
      needsImprovement: "Perlu Penambahbaikan",
    },

    zh: {
      loading: "正在加载学生进度...",
      failedLoad: "无法加载学生进度。",
      pageTitle: "你的学习进度",
      pageSubtitle: "跟踪你的讲义、测验分数、拖放分数和整体学生表现。",
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
      of: "共",
      performance: "表现",
      dragDropActivity: "拖放活动",
      quizAssessment: "测验与评估",
      chapterProgress: "章节进度",
      recentAchievements: "最近成就",
      introduction: "免疫简介",
      types: "免疫类型",
      components: "免疫系统组成",
      defense: "身体防御机制",
      vaccination: "疫苗接种",
      startedLecture: "开始学习讲义",
      completedDrag: "完成拖放活动",
      completedQuiz: "完成测验与评估",
      earnedExcellent: "获得优秀表现徽章",
      overallReached: "总体进度达到",
      score: "分数",
      noAchievements: "还没有成就。阅读讲义或完成活动即可解锁徽章。",
      noActivity: "还没有活动",
      noLecture: "还未查看讲义",
      student: "学生",
      noEmail: "没有电子邮件",
      excellent: "优秀",
      good: "良好",
      needsImprovement: "需要改进",
    },

    ar: {
      loading: "جارٍ تحميل تقدم الطالب...",
      failedLoad: "فشل تحميل تقدم الطالب.",
      pageTitle: "تقدم التعلم الخاص بك",
      pageSubtitle:
        "تتبع ملاحظات المحاضرة ودرجة الاختبار ودرجة السحب والإفلات والأداء العام للطالب.",
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
      of: "من",
      performance: "الأداء",
      dragDropActivity: "نشاط السحب والإفلات",
      quizAssessment: "الاختبار والتقييم",
      chapterProgress: "تقدم الفصل",
      recentAchievements: "الإنجازات الأخيرة",
      introduction: "مقدمة إلى المناعة",
      types: "أنواع المناعة",
      components: "مكونات الجهاز المناعي",
      defense: "آليات دفاع الجسم",
      vaccination: "التطعيم",
      startedLecture: "بدأ ملاحظات المحاضرة",
      completedDrag: "أكمل نشاط السحب والإفلات",
      completedQuiz: "أكمل الاختبار والتقييم",
      earnedExcellent: "حصل على شارة الأداء الممتاز",
      overallReached: "وصل التقدم الإجمالي إلى",
      score: "الدرجة",
      noAchievements:
        "لا توجد إنجازات بعد. اقرأ ملاحظات المحاضرة أو أكمل نشاطاً لفتح الشارات.",
      noActivity: "لا يوجد نشاط بعد",
      noLecture: "لم يتم عرض أي محاضرة بعد",
      student: "طالب",
      noEmail: "لا يوجد بريد إلكتروني",
      excellent: "ممتاز",
      good: "جيد",
      needsImprovement: "يحتاج إلى تحسين",
    },
  };

  const currentText = text[language];

  const translatePerformance = (performance: string) => {
    if (performance === "Excellent") return currentText.excellent;
    if (performance === "Good") return currentText.good;
    if (performance === "Needs Improvement") return currentText.needsImprovement;
    return currentText.noActivity;
  };

  const fetchProgress = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        setStudentData(null);
        setLoading(false);
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

          lectureCompletedCount: 0,
          lectureTotalTopics: 11,
          lecturePercentage: 0,
          lastLectureTopic: currentText.noLecture,

          dragDropScore: 0,
          dragDropTotal: 10,
          dragDropPercentage: 0,
          dragDropPerformance: "No activity yet",

          quizScore: 0,
          quizTotal: 10,
          quizPercentage: 0,
          quizPerformance: "No activity yet",

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
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-center text-gray-600">{currentText.loading}</p>
      </div>
    );
  }

  const studentName = studentData?.name || currentText.student;
  const studentEmail = studentData?.email || currentText.noEmail;

  const lectureCompletedCount = studentData?.lectureCompletedCount ?? 0;
  const lectureTotalTopics = studentData?.lectureTotalTopics ?? 11;
  const lecturePercentage = studentData?.lecturePercentage ?? 0;
  const lastLectureTopic =
    studentData?.lastLectureTopic || currentText.noLecture;

  const dragScore = studentData?.dragDropScore ?? 0;
  const dragTotal = studentData?.dragDropTotal ?? 10;
  const dragPercentage = studentData?.dragDropPercentage ?? 0;
  const dragPerformance = studentData?.dragDropPerformance ?? "No activity yet";

  const quizScore = studentData?.quizScore ?? 0;
  const quizTotal = studentData?.quizTotal ?? 10;
  const quizPercentage = studentData?.quizPercentage ?? 0;
  const quizPerformance = studentData?.quizPerformance ?? "No activity yet";

  const hasLectureActivity = lecturePercentage > 0;
  const hasDragActivity = dragPercentage > 0;
  const hasQuizActivity = quizPercentage > 0;

  const completedActivities =
    (hasLectureActivity ? 1 : 0) +
    (hasDragActivity ? 1 : 0) +
    (hasQuizActivity ? 1 : 0);

  const overallPercentage = Math.round(
    (lecturePercentage + dragPercentage + quizPercentage) / 3
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
      ? 5
      : overallPercentage >= 60
      ? 3
      : overallPercentage > 0
      ? 1
      : 0;

  const circleSize = 2 * Math.PI * 56;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {currentText.pageTitle}
          </h1>
          <p className="text-gray-600">{currentText.pageSubtitle}</p>
        </div>

        <Button onClick={fetchProgress} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {currentText.refresh}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${circleSize}`}
                  strokeDashoffset={`${circleSize * (1 - overallPercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {overallPercentage}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {currentText.overall}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-semibold mb-1">
              {currentText.overallProgress}
            </h3>
            <p className="text-sm text-gray-500">{overallPerformance}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${circleSize}`}
                  strokeDashoffset={`${circleSize * (1 - lecturePercentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {lecturePercentage}%
                  </div>
                  <div className="text-xs text-gray-600">
                    {currentText.lecture}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-semibold mb-1">{currentText.lectureNotes}</h3>
            <p className="text-sm text-gray-500">
              {lectureCompletedCount}/{lectureTotalTopics} {currentText.topics}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-1">
                  {completedActivities}
                </div>
                <div className="text-sm text-gray-600">/3</div>
                <div className="text-xs text-gray-600 mt-1">
                  {currentText.sections}
                </div>
              </div>
            </div>

            <h3 className="font-semibold mb-1">
              {currentText.sectionsCompleted}
            </h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-20 h-20 text-yellow-500" />
            </div>

            <div className="text-3xl font-bold mb-1">{badges}</div>
            <h3 className="font-semibold">{currentText.badges}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              {currentText.studentInformation}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">{currentText.studentName}</p>
              <p className="font-semibold">{studentName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{currentText.email}</p>
              <p className="font-semibold break-all">{studentEmail}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{currentText.lastActivity}</p>
              <p className="font-semibold">
                {studentData?.lastActivity || currentText.noActivity}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                {currentText.lastLectureTopic}
              </p>
              <p className="font-semibold">{lastLectureTopic}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              {currentText.performanceSummary}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  {currentText.lectureNotes}
                </span>
                <span className="text-sm font-bold text-green-600">
                  {lecturePercentage}%
                </span>
              </div>
              <Progress value={lecturePercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                {currentText.completed} {lectureCompletedCount} {currentText.of}{" "}
                {lectureTotalTopics} {currentText.topics}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-blue-600" />
                  {currentText.dragDropActivity}
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {dragScore}/{dragTotal}
                </span>
              </div>
              <Progress value={dragPercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                {currentText.performance}: {translatePerformance(dragPerformance)}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-purple-600" />
                  {currentText.quizAssessment}
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {quizScore}/{quizTotal}
                </span>
              </div>
              <Progress value={quizPercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                {currentText.performance}: {translatePerformance(quizPerformance)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>{currentText.chapterProgress}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {[
              { title: currentText.introduction, value: lectureCompletedCount >= 1 ? 100 : 0 },
              { title: currentText.types, value: lectureCompletedCount >= 2 ? 100 : 0 },
              { title: currentText.components, value: lectureCompletedCount >= 5 ? 100 : 0 },
              { title: currentText.defense, value: lectureCompletedCount >= 10 ? 100 : 0 },
              { title: currentText.vaccination, value: lectureCompletedCount >= 11 ? 100 : 0 },
            ].map((item) => (
              <div key={item.title}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-sm font-bold text-blue-600">
                    {item.value}%
                  </span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>{currentText.recentAchievements}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {overallPercentage > 0 ? (
              <>
                {hasLectureActivity && (
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {currentText.startedLecture}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {currentText.completed} {lectureCompletedCount}/
                        {lectureTotalTopics} {currentText.topics}
                      </p>
                    </div>
                  </div>
                )}

                {hasDragActivity && (
                  <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Medal className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {currentText.completedDrag}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {currentText.score}: {dragScore}/{dragTotal}
                      </p>
                    </div>
                  </div>
                )}

                {hasQuizActivity && (
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {currentText.completedQuiz}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {currentText.score}: {quizScore}/{quizTotal}
                      </p>
                    </div>
                  </div>
                )}

                {overallPercentage >= 80 && (
                  <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {currentText.earnedExcellent}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {currentText.overallReached} {overallPercentage}%
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">{currentText.noAchievements}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}