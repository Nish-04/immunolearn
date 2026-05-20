import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const quizQuestions: Question[] = [
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
    explanation: "White blood cells are a key component of the innate immune system.",
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
    explanation: "Antibodies identify and neutralize foreign objects like bacteria and viruses.",
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
      "Vaccination provides active artificial immunity by introducing antigens to stimulate immune response.",
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
      { id: "B", text: "Remember previous infections for faster response" },
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
      "An antigen is any substance that causes the immune system to produce antibodies against it.",
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
    question: "What type of immunity do babies receive from their mothers during breastfeeding?",
    options: [
      { id: "A", text: "Active natural immunity" },
      { id: "B", text: "Active artificial immunity" },
      { id: "C", text: "Passive natural immunity" },
      { id: "D", text: "Innate immunity" },
    ],
    correctAnswer: "C",
    explanation:
      "Babies receive passive natural immunity through antibodies in breast milk from their mothers.",
  },
  {
    id: 10,
    question: "Which of the following is NOT a physical barrier of the immune system?",
    options: [
      { id: "A", text: "Skin" },
      { id: "B", text: "Mucus membranes" },
      { id: "C", text: "Antibodies" },
      { id: "D", text: "Stomach acid" },
    ],
    correctAnswer: "C",
    explanation:
      "Antibodies are part of the adaptive immune response, not a physical barrier. Skin, mucus, and stomach acid are physical/chemical barriers.",
  },
];

export function QuizAssessment() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [savingScore, setSavingScore] = useState(false);

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
      alert("User not logged in. Quiz score cannot be saved.");
      return;
    }

    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    const performance = getPerformance(percentage);

    setSavingScore(true);

    try {
      await setDoc(
        doc(db, "students", user.uid),
        {
          name: user.displayName || "Student",
          email: user.email || "",
          quizScore: finalScore,
          quizTotal: quizQuestions.length,
          quizPercentage: percentage,
          quizPerformance: performance,
          lastActivity: "Quiz Assessment",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving quiz progress:", error);
      alert("Failed to save quiz score. Please check your Firebase Firestore settings.");
    } finally {
      setSavingScore(false);
    }
  };

  const handleSubmit = () => {
    setShowFeedback(true);

    if (
      selectedAnswer === currentQ.correctAnswer &&
      !answeredQuestions.includes(currentQuestion)
    ) {
      setScore((prev) => prev + 1);
      setAnsweredQuestions((prev) => [...prev, currentQuestion]);
    }
  };

  const handleNext = async () => {
    const finalScore =
      answeredQuestions.includes(currentQuestion)
        ? score
        : selectedAnswer === currentQ.correctAnswer
        ? score + 1
        : score;

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    } else {
      await saveQuizProgress(finalScore);
      setScore(finalScore);
      setQuizComplete(true);
    }
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
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (quizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Quiz Complete! 🎉
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {percentage}%
              </div>

              <p className="text-xl text-gray-600 mb-4">
                You scored {score} out of {quizQuestions.length}
              </p>

              <div className="w-full max-w-md mx-auto mb-6">
                <Progress value={percentage} className="h-4" />
              </div>

              {percentage >= 80 && (
                <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    Excellent Work!
                  </h3>
                  <p className="text-green-600">
                    Your quiz score has been saved to your student progress.
                  </p>
                </div>
              )}

              {percentage >= 60 && percentage < 80 && (
                <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">
                    Good Job!
                  </h3>
                  <p className="text-blue-600">
                    Your quiz score has been saved to your student progress.
                  </p>
                </div>
              )}

              {percentage < 60 && (
                <div className="bg-orange-50 border-2 border-orange-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-orange-700 mb-2">
                    Keep Learning!
                  </h3>
                  <p className="text-orange-600">
                    Your quiz score has been saved. Review the lecture notes and try again.
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  onClick={handleRestart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Retake Quiz
                </Button>

                <Button
                  onClick={() => navigate("/progress")}
                  variant="outline"
                  className="px-8"
                >
                  View Student Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl">Quick Quiz</CardTitle>

            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>

              <span className="text-blue-600 font-medium">
                Score: {score}/{quizQuestions.length}
              </span>
            </div>

            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-6">
              {currentQ.question}
            </h3>

            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={showFeedback}
            >
              <div className="space-y-3">
                {currentQ.options.map((option) => {
                  const isCorrect = option.id === currentQ.correctAnswer;
                  const isSelected = selectedAnswer === option.id;

                  let borderColor = "border-gray-200";
                  let bgColor = "";

                  if (showFeedback) {
                    if (isCorrect) {
                      borderColor = "border-green-600";
                      bgColor = "bg-green-50";
                    } else if (isSelected && !isCorrect) {
                      borderColor = "border-red-600";
                      bgColor = "bg-red-50";
                    }
                  } else if (isSelected) {
                    borderColor = "border-blue-600";
                    bgColor = "bg-blue-50";
                  }

                  return (
                    <div
                      key={option.id}
                      className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors ${borderColor} ${bgColor}`}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        className="mt-0.5"
                      />

                      <Label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer"
                      >
                        <span className="font-medium mr-2">
                          {option.id}.
                        </span>
                        {option.text}
                      </Label>

                      {showFeedback && isCorrect && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}

                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {showFeedback && (
            <div
              className={`border-2 rounded-lg p-4 ${
                selectedAnswer === currentQ.correctAnswer
                  ? "bg-green-50 border-green-600"
                  : "bg-red-50 border-red-600"
              }`}
            >
              <div className="flex items-start gap-3">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}

                <div>
                  <h4
                    className={`font-semibold mb-1 ${
                      selectedAnswer === currentQ.correctAnswer
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    {selectedAnswer === currentQ.correctAnswer
                      ? "Correct!"
                      : "Incorrect"}
                  </h4>

                  <p
                    className={`text-sm ${
                      selectedAnswer === currentQ.correctAnswer
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            {!showFeedback ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={savingScore}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {savingScore
                  ? "Saving Score..."
                  : currentQuestion < quizQuestions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}