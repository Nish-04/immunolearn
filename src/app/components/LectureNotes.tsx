import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useLanguage } from "../context/LanguageContext";
import { InteractiveLectureDiagram } from "./InteractiveLectureDiagram";

interface LectureContent {
  id: string;
  title: string;
  content: string[];
  keyPoints: string[];
  funFact: string;
  miniQuestion: string;
  miniAnswer: string;
}

const lectureTopics: LectureContent[] = [
  {
    id: "intro",
    title: "Introduction to Immunity",
    content: [
      "Immunity is the body's defense system that protects us from harmful pathogens.",
      "The immune system is made up of cells, tissues, and organs that work together to keep the body healthy.",
    ],
    keyPoints: [
      "Protects the body from infections",
      "Detects harmful pathogens",
      "Uses cells, tissues, and organs",
      "Works like a defense network",
    ],
    funFact:
      "Your immune system is always active, even when you feel healthy.",
    miniQuestion: "What is the main function of the immune system?",
    miniAnswer:
      "The immune system protects the body from harmful pathogens and infections.",
  },

  {
    id: "types",
    title: "Types of Immunity",
    content: [
      "There are two main types of immunity: innate immunity and adaptive immunity.",
      "Innate immunity provides fast and general protection. Adaptive immunity targets specific pathogens and can create immune memory.",
    ],
    keyPoints: [
      "Innate immunity works quickly",
      "Adaptive immunity targets specific pathogens",
      "Both types work together",
      "Adaptive immunity can create memory cells",
    ],
    funFact:
      "Adaptive immunity can remember some infections for many years.",
    miniQuestion: "Which type of immunity can create memory cells?",
    miniAnswer: "Adaptive immunity.",
  },

  {
    id: "pathogens",
    title: "Pathogens",
    content: [
      "Pathogens are harmful microorganisms that can cause disease.",
      "Examples include viruses, bacteria, fungi, and parasites.",
    ],
    keyPoints: [
      "Pathogens can cause infections",
      "Viruses need host cells to reproduce",
      "Bacteria come in different shapes",
      "The immune system must detect pathogens quickly",
    ],
    funFact:
      "Not all bacteria are harmful. Some bacteria are useful for the body.",
    miniQuestion: "Name two types of pathogens.",
    miniAnswer:
      "Examples include viruses, bacteria, fungi, and parasites.",
  },

  {
    id: "white-blood-cells",
    title: "White Blood Cells",
    content: [
      "White blood cells are important immune cells that help protect the body from infections.",
      "Different white blood cells have different roles, such as attacking pathogens, cleaning damaged cells, and creating immune memory.",
    ],
    keyPoints: [
      "Macrophages swallow harmful particles",
      "Neutrophils respond quickly to infections",
      "Lymphocytes include B cells and T cells",
      "Different white blood cells have different roles",
    ],
    funFact:
      "Some white blood cells can swallow and destroy pathogens through a process called phagocytosis.",
    miniQuestion: "Which white blood cell acts like a cleaner?",
    miniAnswer: "Macrophage.",
  },

  {
    id: "vaccination",
    title: "Vaccination",
    content: [
      "Vaccination helps train the immune system to recognize specific pathogens.",
      "Vaccines help the body produce antibodies and memory cells so it can respond faster in the future.",
    ],
    keyPoints: [
      "Vaccines train the immune system",
      "The body learns to recognize antigens",
      "Vaccines help create memory cells",
      "The body can respond faster during future infections",
    ],
    funFact:
      "Memory cells help the immune system recognize a pathogen more quickly when it appears again.",
    miniQuestion: "What do vaccines help the body create?",
    miniAnswer: "Antibodies and memory cells.",
  },
];

export function LectureNotes() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [savingProgress, setSavingProgress] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [showKeyPoints, setShowKeyPoints] = useState(true);
  const [showMiniAnswer, setShowMiniAnswer] = useState(false);

  const { language } = useLanguage();

  const text = {
    en: {
      pageTitle: "Lecture Notes",
      subtitle:
        "Explore five important topics with interactive diagrams, animated illustrations, key points, and mini challenges.",
      lectureProgress: "Lecture Progress",
      completed: "Completed",
      of: "of",
      topics: "topics",
      saving: "Saving progress...",
      saved: "Progress saved",
      loading: "Loading lecture progress...",
      topic: "Topic",
      keyPoints: "Key Points",
      previous: "Previous",
      nextTopic: "Next Topic",
      failedSave: "Failed to save lecture progress.",
      student: "Student",
      lastActivity: "Lecture Notes",
      showKeyPoints: "Show Key Points",
      hideKeyPoints: "Hide Key Points",
      funFact: "Did You Know?",
      miniChallenge: "Mini Challenge",
      revealAnswer: "Reveal Answer",
      hideAnswer: "Hide Answer",
      topicMap: "Topic Map",
      interactiveLabel: "Interactive Learning Notes",
      completedLabel: "Completed",
      readingLabel: "Reading",
    },

    ms: {
      pageTitle: "Nota Kuliah",
      subtitle:
        "Terokai lima topik penting dengan diagram interaktif, ilustrasi bergerak, isi penting dan cabaran mini.",
      lectureProgress: "Kemajuan Nota Kuliah",
      completed: "Selesai",
      of: "daripada",
      topics: "topik",
      saving: "Sedang simpan kemajuan...",
      saved: "Kemajuan disimpan",
      loading: "Memuatkan kemajuan nota kuliah...",
      topic: "Topik",
      keyPoints: "Isi Penting",
      previous: "Sebelumnya",
      nextTopic: "Topik Seterusnya",
      failedSave: "Gagal menyimpan kemajuan nota kuliah.",
      student: "Pelajar",
      lastActivity: "Nota Kuliah",
      showKeyPoints: "Tunjuk Isi Penting",
      hideKeyPoints: "Sembunyi Isi Penting",
      funFact: "Tahukah Anda?",
      miniChallenge: "Cabaran Mini",
      revealAnswer: "Tunjuk Jawapan",
      hideAnswer: "Sembunyi Jawapan",
      topicMap: "Peta Topik",
      interactiveLabel: "Nota Pembelajaran Interaktif",
      completedLabel: "Selesai",
      readingLabel: "Sedang Baca",
    },

    zh: {
      pageTitle: "讲义",
      subtitle: "通过互动图表、动画插图、重点和小挑战学习五个重要主题。",
      lectureProgress: "讲义进度",
      completed: "已完成",
      of: "共",
      topics: "个主题",
      saving: "正在保存进度...",
      saved: "进度已保存",
      loading: "正在加载讲义进度...",
      topic: "主题",
      keyPoints: "重点",
      previous: "上一个",
      nextTopic: "下一个主题",
      failedSave: "无法保存讲义进度。",
      student: "学生",
      lastActivity: "讲义",
      showKeyPoints: "显示重点",
      hideKeyPoints: "隐藏重点",
      funFact: "你知道吗？",
      miniChallenge: "小挑战",
      revealAnswer: "显示答案",
      hideAnswer: "隐藏答案",
      topicMap: "主题地图",
      interactiveLabel: "互动学习笔记",
      completedLabel: "已完成",
      readingLabel: "阅读中",
    },

    ar: {
      pageTitle: "ملاحظات المحاضرة",
      subtitle:
        "استكشف خمسة موضوعات مهمة باستخدام الرسوم التفاعلية والرسوم المتحركة والنقاط الرئيسية.",
      lectureProgress: "تقدم المحاضرة",
      completed: "اكتمل",
      of: "من",
      topics: "موضوعات",
      saving: "جارٍ حفظ التقدم...",
      saved: "تم حفظ التقدم",
      loading: "جارٍ تحميل تقدم المحاضرة...",
      topic: "الموضوع",
      keyPoints: "النقاط الرئيسية",
      previous: "السابق",
      nextTopic: "الموضوع التالي",
      failedSave: "فشل حفظ تقدم المحاضرة.",
      student: "طالب",
      lastActivity: "ملاحظات المحاضرة",
      showKeyPoints: "إظهار النقاط",
      hideKeyPoints: "إخفاء النقاط",
      funFact: "هل تعلم؟",
      miniChallenge: "تحدي صغير",
      revealAnswer: "عرض الإجابة",
      hideAnswer: "إخفاء الإجابة",
      topicMap: "خريطة الموضوعات",
      interactiveLabel: "ملاحظات تعليمية تفاعلية",
      completedLabel: "مكتمل",
      readingLabel: "قراءة",
    },
  };

  const currentText = text[language];
  const currentTopic = lectureTopics[currentTopicIndex];

  const saveLectureProgress = async (
    topicIndex: number,
    completedList: string[]
  ) => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const selectedLectureTopic = lectureTopics[topicIndex];

    const lecturePercentage = Math.round(
      (completedList.length / lectureTopics.length) * 100
    );

    setSavingProgress(true);

    try {
      await setDoc(
        doc(db, "students", user.uid),
        {
          name: user.displayName || currentText.student,
          email: user.email || "",
          lectureCompletedTopics: completedList,
          lectureCompletedCount: completedList.length,
          lectureTotalTopics: lectureTopics.length,
          lecturePercentage,
          lastLectureTopic: selectedLectureTopic.title,
          lastActivity: currentText.lastActivity,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving lecture progress:", error);
      alert(currentText.failedSave);
    } finally {
      setSavingProgress(false);
    }
  };

  const loadLectureProgress = async () => {
    const user = auth.currentUser;

    if (!user) {
      setLoadingProgress(false);
      return;
    }

    try {
      const studentRef = doc(db, "students", user.uid);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        const studentData = studentSnap.data();

        if (Array.isArray(studentData.lectureCompletedTopics)) {
          const validCompletedTopics =
            studentData.lectureCompletedTopics.filter((topicId: string) =>
              lectureTopics.some((lectureTopic) => lectureTopic.id === topicId)
            );

          setCompletedTopics(validCompletedTopics);
        }
      }
    } catch (error) {
      console.error("Error loading lecture progress:", error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const markTopicAsRead = async (topicIndex: number) => {
    const topicId = lectureTopics[topicIndex].id;

    setCompletedTopics((previousTopics) => {
      const updatedTopics = previousTopics.includes(topicId)
        ? previousTopics
        : [...previousTopics, topicId];

      void saveLectureProgress(topicIndex, updatedTopics);

      return updatedTopics;
    });
  };

  useEffect(() => {
    void loadLectureProgress();
  }, []);

  useEffect(() => {
    if (!loadingProgress) {
      void markTopicAsRead(currentTopicIndex);
      setShowMiniAnswer(false);
      setShowKeyPoints(true);
    }
  }, [currentTopicIndex, loadingProgress]);

  const handlePrevious = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex((previousIndex) => previousIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTopicIndex < lectureTopics.length - 1) {
      setCurrentTopicIndex((previousIndex) => previousIndex + 1);
    }
  };

  const handleSelectTopic = (index: number) => {
    setCurrentTopicIndex(index);
  };

  const lectureProgress = Math.round(
    (completedTopics.length / lectureTopics.length) * 100
  );

  if (loadingProgress) {
    return (
      <div
        className="relative min-h-screen flex items-center justify-center font-nunito"
        style={{
          backgroundImage: "url('/images/backgrounds/lecture-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/35 backdrop-blur-[2px]"></div>

        <div className="relative z-10 text-center bg-white/90 rounded-[2rem] px-10 py-8 shadow-2xl border border-white">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>

          <p className="text-gray-600 font-semibold">{currentText.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden font-nunito"
      style={{
        backgroundImage: "url('/images/backgrounds/lecture-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/28 backdrop-blur-[1px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/95 border border-blue-200 rounded-full px-4 py-2 mb-4 shadow-md">
            <Sparkles className="w-4 h-4 text-blue-600" />

            <span className="text-sm font-bold text-blue-700">
              {currentText.interactiveLabel}
            </span>
          </div>

          <h1 className="font-fredoka text-4xl lg:text-5xl font-extrabold mb-2 text-blue-950 drop-shadow-sm">
            {currentText.pageTitle}
          </h1>

          <p className="text-gray-700 font-semibold max-w-3xl mx-auto bg-white/80 rounded-2xl px-5 py-3 shadow-sm">
            {currentText.subtitle}
          </p>

          <div className="mt-5 max-w-4xl mx-auto bg-white/95 border border-blue-100 rounded-2xl p-5 shadow-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-blue-900">
                {currentText.lectureProgress}
              </span>

              <span className="font-extrabold text-blue-700">
                {lectureProgress}%
              </span>
            </div>

            <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${lectureProgress}%` }}
              />
            </div>

            <p className="text-sm text-blue-800 mt-2 font-semibold">
              {currentText.completed} {completedTopics.length} {currentText.of}{" "}
              {lectureTopics.length} {currentText.topics}
              {savingProgress
                ? ` • ${currentText.saving}`
                : ` • ${currentText.saved}`}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="border border-white shadow-2xl bg-white/95 backdrop-blur sticky top-24 rounded-[2rem] overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600"></div>

              <CardHeader>
                <CardTitle className="font-fredoka flex items-center gap-2 text-2xl">
                  <Target className="w-6 h-6 text-blue-600" />
                  {currentText.topicMap}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {lectureTopics.map((topic, index) => {
                    const isCompleted = completedTopics.includes(topic.id);

                    return (
                      <button
                        type="button"
                        key={topic.id}
                        onClick={() => handleSelectTopic(index)}
                        className={`w-full text-left px-4 py-4 rounded-2xl transition-all flex items-center justify-between gap-3 hover:-translate-y-1 hover:shadow-md ${
                          currentTopicIndex === index
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg"
                            : "bg-blue-50 hover:bg-blue-100 text-gray-700"
                        }`}
                      >
                        <span className="text-sm">
                          {index + 1}. {topic.title}
                        </span>

                        {isCompleted && (
                          <CheckCircle
                            className={`w-5 h-5 flex-shrink-0 ${
                              currentTopicIndex === index
                                ? "text-white"
                                : "text-green-600"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-white shadow-2xl bg-white/95 backdrop-blur overflow-hidden rounded-[2rem]">
              <div className="h-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600"></div>

              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <CardTitle className="font-fredoka text-3xl lg:text-4xl text-gray-900">
                      {currentTopic.title}
                    </CardTitle>

                    <p className="text-sm text-gray-500 mt-2 font-semibold">
                      {currentText.topic} {currentTopicIndex + 1}{" "}
                      {currentText.of} {lectureTopics.length}
                    </p>
                  </div>

                  <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-bold">
                    {completedTopics.includes(currentTopic.id)
                      ? currentText.completedLabel
                      : currentText.readingLabel}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <InteractiveLectureDiagram topicId={currentTopic.id} />

                <div className="grid gap-4">
                  {currentTopic.content.map((paragraph, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-100 rounded-2xl p-5 hover:bg-cyan-50 hover:-translate-y-1 hover:shadow-md transition-all"
                    >
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                    </div>

                    <div>
                      <h3 className="font-fredoka font-extrabold text-yellow-900 mb-1 text-lg">
                        {currentText.funFact}
                      </h3>

                      <p className="text-yellow-800">
                        {currentTopic.funFact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="font-fredoka font-extrabold text-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      {currentText.keyPoints}
                    </h3>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeyPoints(!showKeyPoints)}
                    >
                      {showKeyPoints
                        ? currentText.hideKeyPoints
                        : currentText.showKeyPoints}
                    </Button>
                  </div>

                  {showKeyPoints && (
                    <div className="grid md:grid-cols-2 gap-3">
                      {currentTopic.keyPoints.map((point, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 bg-blue-50 rounded-xl p-3 border border-blue-100"
                        >
                          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />

                          <p className="text-gray-700 text-sm font-medium">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-fredoka font-extrabold text-purple-900 mb-2 text-lg">
                    {currentText.miniChallenge}
                  </h3>

                  <p className="text-gray-700 mb-4 font-medium">
                    {currentTopic.miniQuestion}
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMiniAnswer(!showMiniAnswer)}
                    className="bg-white"
                  >
                    {showMiniAnswer
                      ? currentText.hideAnswer
                      : currentText.revealAnswer}
                  </Button>

                  {showMiniAnswer && (
                    <div className="mt-4 bg-white/90 rounded-xl p-4 border border-purple-100">
                      <p className="font-bold text-purple-800">
                        {currentTopic.miniAnswer}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 bg-white"
                    onClick={handlePrevious}
                    disabled={currentTopicIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {currentText.previous}
                  </Button>

                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    onClick={handleNext}
                    disabled={currentTopicIndex === lectureTopics.length - 1}
                  >
                    {currentText.nextTopic}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}