import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

interface LectureContent {
  id: string;
  title: string;
  content: string[];
  keyPoints: string[];
  illustration?: string;
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

  const currentTopic = lectureTopics[currentTopicIndex];

  const saveLectureProgress = async (
    topicIndex: number,
    completedList: string[]
  ) => {
    const user = auth.currentUser;

    if (!user) return;

    const currentLectureTopic = lectureTopics[topicIndex];
    const lecturePercentage = Math.round(
      (completedList.length / lectureTopics.length) * 100
    );

    setSavingProgress(true);

    try {
      await setDoc(
        doc(db, "students", user.uid),
        {
          name: user.displayName || "Student",
          email: user.email || "",
          lectureCompletedTopics: completedList,
          lectureCompletedCount: completedList.length,
          lectureTotalTopics: lectureTopics.length,
          lecturePercentage: lecturePercentage,
          lastLectureTopic: currentLectureTopic.title,
          lastActivity: "Lecture Notes",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving lecture progress:", error);
      alert("Failed to save lecture progress.");
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

      if (!prev.includes(topicId)) {
        saveLectureProgress(topicIndex, updatedTopics);
      } else {
        saveLectureProgress(topicIndex, updatedTopics);
      }

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
  }, [currentTopicIndex, loadingProgress]);

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
        <p className="text-center text-gray-600">
          Loading lecture progress...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Lecture Notes</h1>
        <p className="text-gray-600">
          Read each topic to update your learning progress.
        </p>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-blue-900">
              Lecture Progress
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
            Completed {completedTopics.length} of {lectureTopics.length} topics
            {savingProgress ? " • Saving progress..." : " • Progress saved"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold mb-4">Topics</h2>

          <div className="space-y-2">
            {lectureTopics.map((topic, index) => {
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
                Topic {currentTopicIndex + 1} of {lectureTopics.length}
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
                <h3 className="font-semibold text-lg">Key Points</h3>

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
                  Previous
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  onClick={handleNext}
                  disabled={currentTopicIndex === lectureTopics.length - 1}
                >
                  Next Topic
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