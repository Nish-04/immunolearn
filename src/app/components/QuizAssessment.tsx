import { useEffect, useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Award,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useLanguage } from "../context/LanguageContext";

interface Question {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

type Language = "en" | "ms" | "zh" | "ar";

const englishQuestions: Question[] = [
  {
    id: 1,
    question: "Which of the following is a part of the innate immune system?",
    options: [
      { id: "A", text: "Antibodies" },
      { id: "B", text: "White Blood Cells" },
      { id: "C", text: "Memory Cells" },
      { id: "D", text: "T-lymphocytes" },
    ],
    correctAnswer: "B",
    explanation:
      "White blood cells are a key component of the innate immune system.",
  },
  {
    id: 2,
    question: "What is the primary function of antibodies?",
    options: [
      { id: "A", text: "Produce energy for cells" },
      { id: "B", text: "Identify and neutralize pathogens" },
      { id: "C", text: "Transport oxygen in blood" },
      { id: "D", text: "Digest food particles" },
    ],
    correctAnswer: "B",
    explanation:
      "Antibodies identify and neutralize foreign objects like bacteria and viruses.",
  },
  {
    id: 3,
    question: "Which type of immunity is acquired through vaccination?",
    options: [
      { id: "A", text: "Innate immunity" },
      { id: "B", text: "Active artificial immunity" },
      { id: "C", text: "Passive natural immunity" },
      { id: "D", text: "Genetic immunity" },
    ],
    correctAnswer: "B",
    explanation:
      "Vaccination provides active artificial immunity by introducing antigens to stimulate an immune response.",
  },
  {
    id: 4,
    question: "What are pathogens?",
    options: [
      { id: "A", text: "Beneficial bacteria in the gut" },
      { id: "B", text: "Disease-causing microorganisms" },
      { id: "C", text: "Blood cells that carry oxygen" },
      { id: "D", text: "Proteins that fight infection" },
    ],
    correctAnswer: "B",
    explanation:
      "Pathogens are microorganisms that cause disease, including bacteria, viruses, and fungi.",
  },
  {
    id: 5,
    question: "What is the role of memory cells in the immune system?",
    options: [
      { id: "A", text: "Store nutrients for future use" },
      { id: "B", text: "Remember previous infections for a faster response" },
      { id: "C", text: "Create new blood cells" },
      { id: "D", text: "Filter waste from blood" },
    ],
    correctAnswer: "B",
    explanation:
      "Memory cells remember past infections, allowing the immune system to respond more quickly if the same pathogen returns.",
  },
  {
    id: 6,
    question: "Which cells are primarily responsible for killing infected cells?",
    options: [
      { id: "A", text: "Red blood cells" },
      { id: "B", text: "Platelets" },
      { id: "C", text: "T-lymphocytes" },
      { id: "D", text: "Plasma cells" },
    ],
    correctAnswer: "C",
    explanation:
      "T-lymphocytes, especially cytotoxic T cells, are responsible for directly killing infected cells.",
  },
  {
    id: 7,
    question: "What is an antigen?",
    options: [
      { id: "A", text: "A substance that triggers an immune response" },
      { id: "B", text: "A type of white blood cell" },
      { id: "C", text: "A protein that transports oxygen" },
      { id: "D", text: "An enzyme that digests food" },
    ],
    correctAnswer: "A",
    explanation:
      "An antigen is a substance that triggers an immune response.",
  },
  {
    id: 8,
    question: "Which organ produces white blood cells?",
    options: [
      { id: "A", text: "Liver" },
      { id: "B", text: "Bone marrow" },
      { id: "C", text: "Stomach" },
      { id: "D", text: "Kidneys" },
    ],
    correctAnswer: "B",
    explanation:
      "Bone marrow is the primary site of white blood cell production in the body.",
  },
  {
    id: 9,
    question:
      "What type of immunity do babies receive from their mothers during breastfeeding?",
    options: [
      { id: "A", text: "Active natural immunity" },
      { id: "B", text: "Active artificial immunity" },
      { id: "C", text: "Passive natural immunity" },
      { id: "D", text: "Innate immunity" },
    ],
    correctAnswer: "C",
    explanation:
      "Babies receive passive natural immunity through antibodies in breast milk.",
  },
  {
    id: 10,
    question:
      "Which of the following is NOT a physical barrier of the immune system?",
    options: [
      { id: "A", text: "Skin" },
      { id: "B", text: "Mucus membranes" },
      { id: "C", text: "Antibodies" },
      { id: "D", text: "Stomach acid" },
    ],
    correctAnswer: "C",
    explanation:
      "Antibodies are part of the adaptive immune response, not a physical barrier.",
  },
];

const malayQuestions: Question[] = [
  {
    id: 1,
    question:
      "Antara berikut, yang manakah sebahagian daripada sistem imun semula jadi?",
    options: [
      { id: "A", text: "Antibodi" },
      { id: "B", text: "Sel Darah Putih" },
      { id: "C", text: "Sel Memori" },
      { id: "D", text: "T-limfosit" },
    ],
    correctAnswer: "B",
    explanation:
      "Sel darah putih ialah komponen penting dalam sistem imun semula jadi.",
  },
  {
    id: 2,
    question: "Apakah fungsi utama antibodi?",
    options: [
      { id: "A", text: "Menghasilkan tenaga untuk sel" },
      { id: "B", text: "Mengenal pasti dan meneutralkan patogen" },
      { id: "C", text: "Mengangkut oksigen dalam darah" },
      { id: "D", text: "Mencerna zarah makanan" },
    ],
    correctAnswer: "B",
    explanation:
      "Antibodi mengenal pasti dan meneutralkan objek asing seperti bakteria dan virus.",
  },
  {
    id: 3,
    question: "Jenis imuniti manakah yang diperoleh melalui vaksinasi?",
    options: [
      { id: "A", text: "Imuniti semula jadi" },
      { id: "B", text: "Imuniti aktif buatan" },
      { id: "C", text: "Imuniti pasif semula jadi" },
      { id: "D", text: "Imuniti genetik" },
    ],
    correctAnswer: "B",
    explanation:
      "Vaksinasi memberi imuniti aktif buatan dengan memperkenalkan antigen untuk merangsang tindak balas imun.",
  },
  {
    id: 4,
    question: "Apakah itu patogen?",
    options: [
      { id: "A", text: "Bakteria baik dalam usus" },
      { id: "B", text: "Mikroorganisma penyebab penyakit" },
      { id: "C", text: "Sel darah yang membawa oksigen" },
      { id: "D", text: "Protein yang melawan jangkitan" },
    ],
    correctAnswer: "B",
    explanation:
      "Patogen ialah mikroorganisma yang menyebabkan penyakit seperti bakteria, virus dan kulat.",
  },
  {
    id: 5,
    question: "Apakah peranan sel memori dalam sistem imun?",
    options: [
      { id: "A", text: "Menyimpan nutrien untuk kegunaan masa depan" },
      {
        id: "B",
        text: "Mengingati jangkitan terdahulu untuk tindak balas lebih cepat",
      },
      { id: "C", text: "Mencipta sel darah baharu" },
      { id: "D", text: "Menapis bahan buangan daripada darah" },
    ],
    correctAnswer: "B",
    explanation:
      "Sel memori mengingati jangkitan lampau supaya sistem imun boleh bertindak lebih cepat jika patogen sama kembali.",
  },
  {
    id: 6,
    question: "Sel manakah yang bertanggungjawab membunuh sel yang dijangkiti?",
    options: [
      { id: "A", text: "Sel darah merah" },
      { id: "B", text: "Platelet" },
      { id: "C", text: "T-limfosit" },
      { id: "D", text: "Sel plasma" },
    ],
    correctAnswer: "C",
    explanation:
      "T-limfosit, terutama sel T sitotoksik, membunuh sel yang dijangkiti secara langsung.",
  },
  {
    id: 7,
    question: "Apakah itu antigen?",
    options: [
      { id: "A", text: "Bahan yang mencetuskan tindak balas imun" },
      { id: "B", text: "Sejenis sel darah putih" },
      { id: "C", text: "Protein yang mengangkut oksigen" },
      { id: "D", text: "Enzim yang mencerna makanan" },
    ],
    correctAnswer: "A",
    explanation:
      "Antigen ialah bahan yang mencetuskan tindak balas imun.",
  },
  {
    id: 8,
    question: "Organ manakah yang menghasilkan sel darah putih?",
    options: [
      { id: "A", text: "Hati" },
      { id: "B", text: "Sumsum tulang" },
      { id: "C", text: "Perut" },
      { id: "D", text: "Buah pinggang" },
    ],
    correctAnswer: "B",
    explanation:
      "Sumsum tulang ialah tempat utama penghasilan sel darah putih dalam badan.",
  },
  {
    id: 9,
    question:
      "Apakah jenis imuniti yang bayi terima daripada ibu melalui penyusuan?",
    options: [
      { id: "A", text: "Imuniti aktif semula jadi" },
      { id: "B", text: "Imuniti aktif buatan" },
      { id: "C", text: "Imuniti pasif semula jadi" },
      { id: "D", text: "Imuniti semula jadi" },
    ],
    correctAnswer: "C",
    explanation:
      "Bayi menerima imuniti pasif semula jadi melalui antibodi dalam susu ibu.",
  },
  {
    id: 10,
    question:
      "Antara berikut, yang manakah BUKAN halangan fizikal sistem imun?",
    options: [
      { id: "A", text: "Kulit" },
      { id: "B", text: "Membran mukus" },
      { id: "C", text: "Antibodi" },
      { id: "D", text: "Asid perut" },
    ],
    correctAnswer: "C",
    explanation:
      "Antibodi ialah sebahagian daripada tindak balas imun adaptif, bukan halangan fizikal.",
  },
];

const quizQuestionsByLanguage: Record<Language, Question[]> = {
  en: englishQuestions,
  ms: malayQuestions,
  zh: englishQuestions,
  ar: englishQuestions,
};

export function QuizAssessment() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const text = {
    en: {
      quickQuiz: "Quiz Challenge",
      question: "Question",
      of: "of",
      score: "Score",
      submitAnswer: "Submit Answer",
      nextQuestion: "Next Question",
      finishQuiz: "Finish Quiz",
      savingScore: "Saving Score...",
      correct: "Correct!",
      incorrect: "Incorrect",
      quizComplete: "Quiz Complete!",
      timeExpired: "Time is up!",
      timeExpiredMessage:
        "Your current score has been saved. You can retake the quiz to improve your result.",
      youScored: "You scored",
      outOf: "out of",
      excellentWork: "Excellent Work!",
      goodJob: "Good Job!",
      keepLearning: "Keep Learning!",
      savedExcellent: "Your quiz score has been saved to your student progress.",
      savedGood: "Your quiz score has been saved to your student progress.",
      savedLow:
        "Your quiz score has been saved. Review the lecture notes and try again.",
      retakeQuiz: "Retake Quiz",
      viewProgress: "View Student Progress",
      userNotLoggedIn: "User not logged in. Quiz score cannot be saved.",
      failedSave:
        "Failed to save quiz score. Please check your Firebase Firestore settings.",
      student: "Student",
      lastActivity: "Quiz Assessment",
      timer: "Time",
    },

    ms: {
      quickQuiz: "Cabaran Kuiz",
      question: "Soalan",
      of: "daripada",
      score: "Markah",
      submitAnswer: "Hantar Jawapan",
      nextQuestion: "Soalan Seterusnya",
      finishQuiz: "Tamat Kuiz",
      savingScore: "Menyimpan Markah...",
      correct: "Betul!",
      incorrect: "Salah",
      quizComplete: "Kuiz Selesai!",
      timeExpired: "Masa sudah tamat!",
      timeExpiredMessage:
        "Markah semasa anda telah disimpan. Anda boleh cuba semula untuk meningkatkan keputusan.",
      youScored: "Anda mendapat markah",
      outOf: "daripada",
      excellentWork: "Sangat Bagus!",
      goodJob: "Bagus!",
      keepLearning: "Teruskan Belajar!",
      savedExcellent: "Markah kuiz anda telah disimpan dalam kemajuan pelajar.",
      savedGood: "Markah kuiz anda telah disimpan dalam kemajuan pelajar.",
      savedLow:
        "Markah kuiz anda telah disimpan. Baca semula nota kuliah dan cuba lagi.",
      retakeQuiz: "Ambil Semula Kuiz",
      viewProgress: "Lihat Kemajuan Pelajar",
      userNotLoggedIn:
        "Pengguna belum log masuk. Markah kuiz tidak dapat disimpan.",
      failedSave:
        "Gagal menyimpan markah kuiz. Sila semak tetapan Firebase Firestore.",
      student: "Pelajar",
      lastActivity: "Kuiz dan Penilaian",
      timer: "Masa",
    },

    zh: {
      quickQuiz: "测验挑战",
      question: "问题",
      of: "共",
      score: "分数",
      submitAnswer: "提交答案",
      nextQuestion: "下一题",
      finishQuiz: "完成测验",
      savingScore: "正在保存分数...",
      correct: "正确！",
      incorrect: "错误",
      quizComplete: "测验完成！",
      timeExpired: "时间到了！",
      timeExpiredMessage: "当前分数已保存。你可以重新测验以提高成绩。",
      youScored: "你的得分是",
      outOf: "共",
      excellentWork: "非常棒！",
      goodJob: "做得好！",
      keepLearning: "继续学习！",
      savedExcellent: "你的测验分数已保存到学生进度。",
      savedGood: "你的测验分数已保存到学生进度。",
      savedLow: "你的测验分数已保存。请复习讲义后再试。",
      retakeQuiz: "重新测验",
      viewProgress: "查看学生进度",
      userNotLoggedIn: "用户未登录，无法保存测验分数。",
      failedSave: "保存测验分数失败。请检查 Firebase Firestore 设置。",
      student: "学生",
      lastActivity: "测验与评估",
      timer: "时间",
    },

    ar: {
      quickQuiz: "تحدي الاختبار",
      question: "السؤال",
      of: "من",
      score: "الدرجة",
      submitAnswer: "إرسال الإجابة",
      nextQuestion: "السؤال التالي",
      finishQuiz: "إنهاء الاختبار",
      savingScore: "جارٍ حفظ الدرجة...",
      correct: "صحيح!",
      incorrect: "خطأ",
      quizComplete: "اكتمل الاختبار!",
      timeExpired: "انتهى الوقت!",
      timeExpiredMessage:
        "تم حفظ درجتك الحالية. يمكنك إعادة الاختبار لتحسين النتيجة.",
      youScored: "حصلت على",
      outOf: "من",
      excellentWork: "عمل ممتاز!",
      goodJob: "عمل جيد!",
      keepLearning: "استمر في التعلم!",
      savedExcellent: "تم حفظ درجة الاختبار في تقدم الطالب.",
      savedGood: "تم حفظ درجة الاختبار في تقدم الطالب.",
      savedLow:
        "تم حفظ درجة الاختبار. راجع ملاحظات المحاضرة وحاول مرة أخرى.",
      retakeQuiz: "إعادة الاختبار",
      viewProgress: "عرض تقدم الطالب",
      userNotLoggedIn: "المستخدم غير مسجل الدخول. لا يمكن حفظ درجة الاختبار.",
      failedSave: "فشل حفظ درجة الاختبار. تحقق من إعدادات Firebase Firestore.",
      student: "طالب",
      lastActivity: "الاختبار والتقييم",
      timer: "الوقت",
    },
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [savingScore, setSavingScore] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const currentText = text[language];
  const quizQuestions = quizQuestionsByLanguage[language];
  const currentQ = quizQuestions[currentQuestion];

  const progress =
    ((currentQuestion + (showFeedback ? 1 : 0)) / quizQuestions.length) * 100;

  const getPerformance = (percentage: number) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage > 0) return "Needs Improvement";

    return "No activity yet";
  };

  const saveQuizProgress = async (finalScore: number) => {
    const user = auth.currentUser;

    if (!user) {
      alert(currentText.userNotLoggedIn);
      return;
    }

    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    const performance = getPerformance(percentage);

    setSavingScore(true);

    try {
      await setDoc(
        doc(db, "students", user.uid),
        {
          name: user.displayName || currentText.student,
          email: user.email || "",
          quizScore: finalScore,
          quizTotal: quizQuestions.length,
          quizPercentage: percentage,
          quizPerformance: performance,
          lastActivity: currentText.lastActivity,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving quiz progress:", error);
      alert(currentText.failedSave);
    } finally {
      setSavingScore(false);
    }
  };

  useEffect(() => {
    if (quizComplete) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemaining((previousTime) => {
        if (previousTime <= 1) {
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quizComplete]);

  useEffect(() => {
    if (timeRemaining !== 0 || quizComplete) {
      return;
    }

    const finishQuizBecauseTimeExpired = async () => {
      setTimeExpired(true);
      await saveQuizProgress(score);
      setQuizComplete(true);
    };

    void finishQuizBecauseTimeExpired();
  }, [timeRemaining, quizComplete, score]);

  const handleSubmit = () => {
    if (!selectedAnswer) {
      return;
    }

    setShowFeedback(true);

    if (
      selectedAnswer === currentQ.correctAnswer &&
      !answeredQuestions.includes(currentQuestion)
    ) {
      setScore((previousScore) => previousScore + 1);

      setAnsweredQuestions((previousAnswers) => [
        ...previousAnswers,
        currentQuestion,
      ]);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((previousQuestion) => previousQuestion + 1);
      setSelectedAnswer("");
      setShowFeedback(false);

      return;
    }

    await saveQuizProgress(score);
    setQuizComplete(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
    setTimeRemaining(600);
    setSavingScore(false);
    setTimeExpired(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (quizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);

    return (
      <QuizBackground>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-white/95 backdrop-blur rounded-[2rem] shadow-2xl border border-white overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="p-8 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-5 animate-bounce">
                <Trophy className="w-14 h-14" />
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                {timeExpired
                  ? currentText.timeExpired
                  : currentText.quizComplete}
              </h1>

              {timeExpired && (
                <p className="text-orange-700 font-semibold mb-4">
                  {currentText.timeExpiredMessage}
                </p>
              )}

              <p className="text-gray-600 mb-6">
                {currentText.youScored} {score} {currentText.outOf}{" "}
                {quizQuestions.length}
              </p>

              <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                {percentage}%
              </div>

              <div className="max-w-xl mx-auto mb-6">
                <Progress value={percentage} className="h-4" />
              </div>

              <div
                className={`rounded-3xl p-6 mb-6 border-2 ${
                  percentage >= 80
                    ? "bg-green-50 border-green-300"
                    : percentage >= 60
                    ? "bg-blue-50 border-blue-300"
                    : "bg-orange-50 border-orange-300"
                }`}
              >
                <h2
                  className={`text-2xl font-extrabold mb-2 ${
                    percentage >= 80
                      ? "text-green-700"
                      : percentage >= 60
                      ? "text-blue-700"
                      : "text-orange-700"
                  }`}
                >
                  {percentage >= 80
                    ? currentText.excellentWork
                    : percentage >= 60
                    ? currentText.goodJob
                    : currentText.keepLearning}
                </h2>

                <p
                  className={
                    percentage >= 80
                      ? "text-green-700"
                      : percentage >= 60
                      ? "text-blue-700"
                      : "text-orange-700"
                  }
                >
                  {percentage >= 80
                    ? currentText.savedExcellent
                    : percentage >= 60
                    ? currentText.savedGood
                    : currentText.savedLow}
                </p>
              </div>

              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  type="button"
                  onClick={handleRestart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  {currentText.retakeQuiz}
                </Button>

                <Button
                  type="button"
                  onClick={() => navigate("/progress")}
                  variant="outline"
                  className="px-8 py-6 rounded-xl bg-white"
                >
                  <Award className="w-5 h-5 mr-2" />
                  {currentText.viewProgress}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </QuizBackground>
    );
  }

  return (
    <QuizBackground>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-purple-200 px-4 py-2 text-sm font-bold text-purple-700 shadow-md mb-3">
            <Sparkles className="w-4 h-4" />
            Immunity Quiz Time
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 drop-shadow-sm">
            {currentText.quickQuiz}
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label={currentText.score}
            value={`${score}/${quizQuestions.length}`}
            color="blue"
          />

          <StatCard
            label={`${currentText.question} ${currentQuestion + 1}`}
            value={`${currentQuestion + 1}/${quizQuestions.length}`}
            color="purple"
          />

          <div className="bg-white/95 rounded-3xl p-4 shadow-xl border border-white flex items-center justify-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                timeRemaining <= 60
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-pink-100 text-pink-600"
              }`}
            >
              <Clock className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-500">
                {currentText.timer}
              </p>

              <p
                className={`text-2xl font-extrabold ${
                  timeRemaining <= 60 ? "text-red-600" : "text-pink-600"
                }`}
              >
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-[2rem] shadow-2xl border border-white overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="p-6 md:p-8">
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span>
                  {currentText.question} {currentQuestion + 1} {currentText.of}{" "}
                  {quizQuestions.length}
                </span>

                <span>{Math.round(progress)}%</span>
              </div>

              <Progress value={progress} className="h-3" />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100 mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className="grid gap-4">
              {currentQ.options.map((option) => {
                const isCorrect = option.id === currentQ.correctAnswer;
                const isSelected = selectedAnswer === option.id;

                let buttonStyle =
                  "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50";

                if (showFeedback) {
                  if (isCorrect) {
                    buttonStyle = "bg-green-50 border-green-500";
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = "bg-red-50 border-red-500";
                  }
                } else if (isSelected) {
                  buttonStyle = "bg-blue-50 border-blue-500 shadow-lg";
                }

                return (
                  <button
                    type="button"
                    key={option.id}
                    disabled={showFeedback}
                    onClick={() => setSelectedAnswer(option.id)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all hover:-translate-y-1 hover:shadow-lg ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold ${
                          showFeedback && isCorrect
                            ? "bg-green-500 text-white"
                            : showFeedback && isSelected && !isCorrect
                            ? "bg-red-500 text-white"
                            : isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {option.id}
                      </div>

                      <p className="flex-1 font-semibold text-gray-800">
                        {option.text}
                      </p>

                      {showFeedback && isCorrect && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}

                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div
                className={`mt-6 rounded-3xl p-5 border-2 ${
                  selectedAnswer === currentQ.correctAnswer
                    ? "bg-green-50 border-green-400"
                    : "bg-red-50 border-red-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  {selectedAnswer === currentQ.correctAnswer ? (
                    <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-7 h-7 text-red-600 flex-shrink-0 mt-0.5" />
                  )}

                  <div>
                    <h3
                      className={`font-extrabold text-lg mb-1 ${
                        selectedAnswer === currentQ.correctAnswer
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {selectedAnswer === currentQ.correctAnswer
                        ? currentText.correct
                        : currentText.incorrect}
                    </h3>

                    <p
                      className={`text-sm ${
                        selectedAnswer === currentQ.correctAnswer
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              {!showFeedback ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl"
                >
                  {currentText.submitAnswer}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={savingScore}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl"
                >
                  {savingScore
                    ? currentText.savingScore
                    : currentQuestion < quizQuestions.length - 1
                    ? currentText.nextQuestion
                    : currentText.finishQuiz}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </QuizBackground>
  );
}

function QuizBackground({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/backgrounds/quiz-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[2px]"></div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "blue" | "purple";
}) {
  const colorClass =
    color === "blue"
      ? "bg-blue-100 text-blue-600"
      : "bg-purple-100 text-purple-600";

  return (
    <div className="bg-white/95 rounded-3xl p-4 shadow-xl border border-white text-center">
      <div
        className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${colorClass}`}
      >
        <Sparkles className="w-6 h-6" />
      </div>

      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  );
}