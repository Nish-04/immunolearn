import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useLanguage } from "../context/LanguageContext";

interface LectureContent {
  id: string;
  title: string;
  content: string[];
  keyPoints: string[];
}

const lectureTopics: LectureContent[] = [
  {
    id: "intro",
    title: "Introduction to Immunity",
    content: [
      "Immunity is the body's defense system that protects us from harmful pathogens. It consists of various biological structures and processes.",
      "The immune system is a complex network of cells, tissues, and organs that work together to defend the body against attacks by foreign invaders, such as bacteria, viruses, parasites, and fungi.",
    ],
    keyPoints: [
      "Protects the body from infections",
      "Detects and destroys harmful agents",
      "Involves cells, tissues, and organs",
      "Works through a complex network",
    ],
  },
  {
    id: "types",
    title: "Types of Immunity",
    content: [
      "There are two main types of immunity: innate immunity and adaptive immunity.",
      "Innate immunity is the first line of defense and provides immediate, non-specific protection. It includes physical barriers like skin, chemical barriers like stomach acid, and cellular defenses like white blood cells.",
      "Adaptive immunity develops over time and provides specific, long-lasting protection. It involves the production of antibodies and memory cells that remember past infections.",
    ],
    keyPoints: [
      "Innate immunity: immediate, non-specific",
      "Adaptive immunity: specific, long-lasting",
      "Both work together for complete protection",
      "Memory cells enable faster future responses",
    ],
  },
  {
    id: "active",
    title: "Active Immunity",
    content: [
      "Active immunity occurs when the body produces its own antibodies in response to an antigen.",
      "This can happen naturally through infection or artificially through vaccination.",
      "Active immunity provides long-lasting protection and develops immunological memory.",
    ],
    keyPoints: [
      "Body produces its own antibodies",
      "Can be natural or artificial",
      "Provides long-lasting protection",
      "Creates immunological memory",
    ],
  },
  {
    id: "passive",
    title: "Passive Immunity",
    content: [
      "Passive immunity involves receiving antibodies from an external source rather than producing them.",
      "Natural passive immunity occurs when antibodies pass from mother to baby through the placenta or breast milk.",
      "Artificial passive immunity involves receiving antibodies through medical treatment, such as immunoglobulin injections.",
      "Passive immunity provides immediate but temporary protection.",
    ],
    keyPoints: [
      "Receives antibodies from external source",
      "Can be natural mother to baby or artificial",
      "Provides immediate protection",
      "Protection is temporary",
    ],
  },
  {
    id: "components",
    title: "Immune System Components",
    content: [
      "The immune system consists of many different components that work together to protect the body.",
      "These include organs like the thymus and spleen, cells like white blood cells, and molecules like antibodies.",
      "Each component has a specific role in detecting and eliminating pathogens.",
    ],
    keyPoints: [
      "Multiple organs, cells, and molecules",
      "Each component has specific roles",
      "Work together as a coordinated system",
      "Constantly monitoring for threats",
    ],
  },
  {
    id: "pathogens",
    title: "Pathogens",
    content: [
      "Pathogens are microorganisms that cause disease. They include bacteria, viruses, fungi, and parasites.",
      "Each type of pathogen has different characteristics and requires different immune responses.",
      "The immune system must be able to recognize and respond to many different types of pathogens.",
    ],
    keyPoints: [
      "Disease-causing microorganisms",
      "Include bacteria, viruses, fungi, parasites",
      "Different types require different responses",
      "Constantly evolving and adapting",
    ],
  },
  {
    id: "antigens",
    title: "Antigens",
    content: [
      "Antigens are substances that trigger an immune response. They are typically proteins or polysaccharides on the surface of pathogens.",
      "The immune system recognizes antigens as foreign and produces antibodies to target them.",
      "Each antibody is specific to a particular antigen, like a lock and key.",
    ],
    keyPoints: [
      "Substances that trigger immune response",
      "Found on surface of pathogens",
      "Recognized as foreign by immune system",
      "Each antigen has specific antibody",
    ],
  },
  {
    id: "antibodies",
    title: "Antibodies",
    content: [
      "Antibodies, also called immunoglobulins, are Y-shaped proteins produced by B cells.",
      "They bind to specific antigens on pathogens, marking them for destruction by other immune cells.",
      "There are five main classes of antibodies: IgG, IgA, IgM, IgE, and IgD, each with different functions.",
    ],
    keyPoints: [
      "Y-shaped proteins produced by B cells",
      "Bind to specific antigens",
      "Mark pathogens for destruction",
      "Five main classes with different roles",
    ],
  },
  {
    id: "white-blood-cells",
    title: "White Blood Cells",
    content: [
      "White blood cells, or leukocytes, are the key cellular components of the immune system.",
      "There are several types including neutrophils, lymphocytes, monocytes, eosinophils, and basophils.",
      "Each type has specific functions in fighting infections and maintaining immune health.",
      "Lymphocytes include T cells and B cells, which are crucial for adaptive immunity.",
    ],
    keyPoints: [
      "Key cellular components of immunity",
      "Multiple types with specific functions",
      "Include neutrophils, lymphocytes, monocytes",
      "T cells and B cells drive adaptive immunity",
    ],
  },
  {
    id: "defense",
    title: "Body Defense Mechanisms",
    content: [
      "The body has multiple layers of defense against pathogens.",
      "Physical barriers like skin and mucous membranes provide the first line of defense.",
      "Chemical barriers like stomach acid and enzymes in tears destroy pathogens.",
      "Cellular defenses involve white blood cells that engulf and destroy invaders.",
      "Inflammatory responses help isolate and eliminate pathogens while promoting healing.",
    ],
    keyPoints: [
      "Multiple layers of protection",
      "Physical barriers such as skin and mucous membranes",
      "Chemical barriers such as acid and enzymes",
      "Cellular defenses and inflammation",
    ],
  },
  {
    id: "vaccination",
    title: "Vaccination",
    content: [
      "Vaccination is the process of introducing antigens into the body to stimulate immune memory without causing disease.",
      "Vaccines contain weakened, killed, or partial pathogens that trigger an immune response.",
      "This creates memory cells that provide long-lasting protection against future infections.",
      "Vaccination has been one of the most successful public health interventions, preventing millions of deaths.",
    ],
    keyPoints: [
      "Stimulates immune memory safely",
      "Contains weakened or partial pathogens",
      "Creates long-lasting protection",
      "Major public health success",
    ],
  },
];

export function LectureNotes() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [savingProgress, setSavingProgress] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const { language, t } = useLanguage();

  const text = {
    en: {
      pageTitle: "Lecture Notes",
      subtitle: "Read each topic to update your learning progress.",
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
    },
    ms: {
      pageTitle: "Nota Kuliah",
      subtitle: "Baca setiap topik untuk mengemas kini kemajuan pembelajaran anda.",
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
    },
    zh: {
      pageTitle: "讲义",
      subtitle: "阅读每个主题以更新你的学习进度。",
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
    },
    ar: {
      pageTitle: "ملاحظات المحاضرة",
      subtitle: "اقرأ كل موضوع لتحديث تقدم التعلم الخاص بك.",
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
    },
  };

  const topicTranslations = {
    en: lectureTopics,
    ms: [
      {
        id: "intro",
        title: "Pengenalan kepada Imuniti",
        content: [
          "Imuniti ialah sistem pertahanan badan yang melindungi kita daripada patogen berbahaya. Ia terdiri daripada pelbagai struktur dan proses biologi.",
          "Sistem imun ialah rangkaian sel, tisu, dan organ yang bekerjasama untuk mempertahankan badan daripada bakteria, virus, parasit, dan kulat.",
        ],
        keyPoints: [
          "Melindungi badan daripada jangkitan",
          "Mengesan dan memusnahkan agen berbahaya",
          "Melibatkan sel, tisu, dan organ",
          "Berfungsi melalui rangkaian yang kompleks",
        ],
      },
      {
        id: "types",
        title: "Jenis Imuniti",
        content: [
          "Terdapat dua jenis utama imuniti: imuniti semula jadi dan imuniti adaptif.",
          "Imuniti semula jadi ialah pertahanan pertama yang memberi perlindungan segera dan tidak khusus. Ia termasuk kulit, asid perut, dan sel darah putih.",
          "Imuniti adaptif berkembang dari masa ke masa dan memberi perlindungan khusus serta tahan lama. Ia melibatkan antibodi dan sel memori.",
        ],
        keyPoints: [
          "Imuniti semula jadi: segera dan tidak khusus",
          "Imuniti adaptif: khusus dan tahan lama",
          "Kedua-duanya bekerjasama untuk perlindungan lengkap",
          "Sel memori membantu tindak balas lebih cepat pada masa depan",
        ],
      },
      {
        id: "active",
        title: "Imuniti Aktif",
        content: [
          "Imuniti aktif berlaku apabila badan menghasilkan antibodi sendiri sebagai tindak balas terhadap antigen.",
          "Ia boleh berlaku secara semula jadi melalui jangkitan atau secara buatan melalui vaksinasi.",
          "Imuniti aktif memberi perlindungan jangka panjang dan membentuk memori imunologi.",
        ],
        keyPoints: [
          "Badan menghasilkan antibodi sendiri",
          "Boleh berlaku secara semula jadi atau buatan",
          "Memberi perlindungan jangka panjang",
          "Membentuk memori imunologi",
        ],
      },
      {
        id: "passive",
        title: "Imuniti Pasif",
        content: [
          "Imuniti pasif berlaku apabila badan menerima antibodi daripada sumber luar.",
          "Imuniti pasif semula jadi berlaku apabila antibodi dipindahkan daripada ibu kepada bayi melalui plasenta atau susu ibu.",
          "Imuniti pasif buatan berlaku melalui rawatan perubatan seperti suntikan imunoglobulin.",
          "Imuniti pasif memberi perlindungan segera tetapi sementara.",
        ],
        keyPoints: [
          "Menerima antibodi daripada sumber luar",
          "Boleh berlaku secara semula jadi atau buatan",
          "Memberi perlindungan segera",
          "Perlindungan adalah sementara",
        ],
      },
      {
        id: "components",
        title: "Komponen Sistem Imun",
        content: [
          "Sistem imun terdiri daripada banyak komponen yang bekerjasama untuk melindungi badan.",
          "Ini termasuk organ seperti timus dan limpa, sel seperti sel darah putih, dan molekul seperti antibodi.",
          "Setiap komponen mempunyai peranan tertentu dalam mengesan dan menghapuskan patogen.",
        ],
        keyPoints: [
          "Melibatkan organ, sel, dan molekul",
          "Setiap komponen mempunyai peranan khusus",
          "Bekerjasama sebagai satu sistem",
          "Sentiasa memantau ancaman",
        ],
      },
      {
        id: "pathogens",
        title: "Patogen",
        content: [
          "Patogen ialah mikroorganisma yang menyebabkan penyakit. Ia termasuk bakteria, virus, kulat, dan parasit.",
          "Setiap jenis patogen mempunyai ciri yang berbeza dan memerlukan tindak balas imun yang berbeza.",
          "Sistem imun perlu mengenal pasti dan bertindak balas terhadap pelbagai jenis patogen.",
        ],
        keyPoints: [
          "Mikroorganisma penyebab penyakit",
          "Termasuk bakteria, virus, kulat, dan parasit",
          "Jenis berbeza memerlukan tindak balas berbeza",
          "Sentiasa berubah dan menyesuaikan diri",
        ],
      },
      {
        id: "antigens",
        title: "Antigen",
        content: [
          "Antigen ialah bahan yang mencetuskan tindak balas imun. Biasanya ia berada pada permukaan patogen.",
          "Sistem imun mengenali antigen sebagai benda asing dan menghasilkan antibodi untuk menyasarkannya.",
          "Setiap antibodi adalah khusus kepada antigen tertentu.",
        ],
        keyPoints: [
          "Bahan yang mencetuskan tindak balas imun",
          "Dijumpai pada permukaan patogen",
          "Dikenali sebagai benda asing oleh sistem imun",
          "Setiap antigen mempunyai antibodi khusus",
        ],
      },
      {
        id: "antibodies",
        title: "Antibodi",
        content: [
          "Antibodi ialah protein berbentuk Y yang dihasilkan oleh sel B.",
          "Antibodi melekat pada antigen tertentu dan menandakan patogen untuk dimusnahkan oleh sel imun lain.",
          "Terdapat lima kelas utama antibodi: IgG, IgA, IgM, IgE, dan IgD.",
        ],
        keyPoints: [
          "Protein berbentuk Y yang dihasilkan oleh sel B",
          "Melekat pada antigen tertentu",
          "Menandakan patogen untuk dimusnahkan",
          "Mempunyai beberapa kelas dengan fungsi berbeza",
        ],
      },
      {
        id: "white-blood-cells",
        title: "Sel Darah Putih",
        content: [
          "Sel darah putih ialah komponen sel utama dalam sistem imun.",
          "Terdapat beberapa jenis seperti neutrofil, limfosit, monosit, eosinofil, dan basofil.",
          "Setiap jenis mempunyai fungsi khusus dalam melawan jangkitan.",
          "Limfosit termasuk sel T dan sel B yang penting untuk imuniti adaptif.",
        ],
        keyPoints: [
          "Komponen sel utama imuniti",
          "Mempunyai pelbagai jenis dan fungsi",
          "Termasuk neutrofil, limfosit, dan monosit",
          "Sel T dan sel B penting untuk imuniti adaptif",
        ],
      },
      {
        id: "defense",
        title: "Mekanisme Pertahanan Badan",
        content: [
          "Badan mempunyai beberapa lapisan pertahanan terhadap patogen.",
          "Halangan fizikal seperti kulit dan membran mukus menjadi pertahanan pertama.",
          "Halangan kimia seperti asid perut dan enzim dalam air mata membantu memusnahkan patogen.",
          "Pertahanan sel melibatkan sel darah putih yang menelan dan memusnahkan penceroboh.",
          "Keradangan membantu mengasingkan dan menghapuskan patogen serta menyokong penyembuhan.",
        ],
        keyPoints: [
          "Mempunyai beberapa lapisan perlindungan",
          "Halangan fizikal seperti kulit dan membran mukus",
          "Halangan kimia seperti asid dan enzim",
          "Pertahanan sel dan keradangan",
        ],
      },
      {
        id: "vaccination",
        title: "Vaksinasi",
        content: [
          "Vaksinasi ialah proses memperkenalkan antigen ke dalam badan untuk merangsang memori imun tanpa menyebabkan penyakit.",
          "Vaksin mengandungi patogen yang dilemahkan, dimatikan, atau sebahagian daripadanya.",
          "Ini menghasilkan sel memori yang memberi perlindungan jangka panjang terhadap jangkitan pada masa depan.",
          "Vaksinasi ialah salah satu kejayaan besar dalam kesihatan awam.",
        ],
        keyPoints: [
          "Merangsang memori imun dengan selamat",
          "Mengandungi patogen yang dilemahkan atau sebahagian patogen",
          "Membentuk perlindungan jangka panjang",
          "Kejayaan penting dalam kesihatan awam",
        ],
      },
    ],
    zh: lectureTopics,
    ar: lectureTopics,
  };

  const currentText = text[language];
  const translatedTopics = topicTranslations[language];
  const currentTopic = translatedTopics[currentTopicIndex];

  const saveLectureProgress = async (
    topicIndex: number,
    completedList: string[]
  ) => {
    const user = auth.currentUser;

    if (!user) return;

    const currentLectureTopic = translatedTopics[topicIndex];
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
          lastLectureTopic: currentLectureTopic.title,
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
        const data = studentSnap.data();

        if (Array.isArray(data.lectureCompletedTopics)) {
          setCompletedTopics(data.lectureCompletedTopics);
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

    setCompletedTopics((prev) => {
      const updatedTopics = prev.includes(topicId) ? prev : [...prev, topicId];

      saveLectureProgress(topicIndex, updatedTopics);

      return updatedTopics;
    });
  };

  useEffect(() => {
    loadLectureProgress();
  }, []);

  useEffect(() => {
    if (!loadingProgress) {
      markTopicAsRead(currentTopicIndex);
    }
  }, [currentTopicIndex, loadingProgress, language]);

  const handlePrevious = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentTopicIndex < lectureTopics.length - 1) {
      setCurrentTopicIndex((prev) => prev + 1);
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
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-center text-gray-600">{currentText.loading}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">{t.lectureNotes}</h1>
        <p className="text-gray-600">{currentText.subtitle}</p>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-blue-900">
              {currentText.lectureProgress}
            </span>

            <span className="font-bold text-blue-700">
              {lectureProgress}%
            </span>
          </div>

          <div className="w-full bg-blue-100 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${lectureProgress}%` }}
            />
          </div>

          <p className="text-sm text-blue-800 mt-2">
            {currentText.completed} {completedTopics.length} {currentText.of}{" "}
            {lectureTopics.length} {currentText.topics}
            {savingProgress
              ? ` • ${currentText.saving}`
              : ` • ${currentText.saved}`}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold mb-4">{currentText.pageTitle}</h2>

          <div className="space-y-2">
            {translatedTopics.map((topic, index) => {
              const isCompleted = completedTopics.includes(topic.id);

              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between gap-3 ${
                    currentTopicIndex === index
                      ? "bg-blue-600 text-white font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span>
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
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl">{currentTopic.title}</CardTitle>

              <div className="text-sm text-gray-500">
                {currentText.topic} {currentTopicIndex + 1} {currentText.of}{" "}
                {lectureTopics.length}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {currentTopic.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}

              {currentTopicIndex === 0 && (
                <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="w-32 h-40 bg-blue-600 rounded-full relative opacity-80">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-20 bg-blue-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="absolute top-8 left-16 w-8 h-8">
                    <div className="w-full h-full bg-purple-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="absolute top-12 right-20 w-6 h-6">
                    <div className="w-full h-full bg-pink-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="absolute bottom-16 left-24 w-7 h-7">
                    <div className="w-full h-full bg-blue-300 rounded-full animate-pulse"></div>
                  </div>

                  <div className="absolute bottom-12 right-16 w-5 h-5">
                    <div className="w-full h-full bg-purple-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {currentText.keyPoints}
                </h3>

                <div className="space-y-2">
                  {currentTopic.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handlePrevious}
                  disabled={currentTopicIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {currentText.previous}
                </Button>

                <Button
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
  );
}