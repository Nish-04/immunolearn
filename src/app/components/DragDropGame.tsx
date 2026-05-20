import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

interface Question {
  id: number;
  question: string;
  items: DragItem[];
  dropZones: DropZone[];
}

interface DragItem {
  id: string;
  label: string;
  color: string;
  correctZone: string;
}

interface DropZone {
  id: string;
  label: string;
  color: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Match the immune system components to their functions",
    items: [
      { id: "antibody", label: "Antibody", color: "bg-purple-500", correctZone: "fight" },
      { id: "pathogen", label: "Pathogen", color: "bg-green-500", correctZone: "invade" },
      { id: "white-cell", label: "White Blood Cell", color: "bg-orange-500", correctZone: "defend" },
    ],
    dropZones: [
      { id: "fight", label: "Fights Infection", color: "border-blue-300" },
      { id: "invade", label: "Causes Disease", color: "border-red-300" },
      { id: "defend", label: "Defends Body", color: "border-green-300" },
    ],
  },
  {
    id: 2,
    question: "Classify these as innate or adaptive immunity",
    items: [
      { id: "skin", label: "Skin Barrier", color: "bg-blue-500", correctZone: "innate" },
      { id: "antibodies", label: "Antibodies", color: "bg-orange-500", correctZone: "adaptive" },
      { id: "stomach-acid", label: "Stomach Acid", color: "bg-pink-500", correctZone: "innate" },
    ],
    dropZones: [
      { id: "innate", label: "Innate Immunity", color: "border-orange-300" },
      { id: "adaptive", label: "Adaptive Immunity", color: "border-purple-300" },
    ],
  },
  {
    id: 3,
    question: "Match cell types to their roles",
    items: [
      { id: "tcell", label: "T Cell", color: "bg-red-500", correctZone: "killer" },
      { id: "bcell", label: "B Cell", color: "bg-cyan-500", correctZone: "producer" },
      { id: "memory", label: "Memory Cell", color: "bg-yellow-500", correctZone: "remember" },
    ],
    dropZones: [
      { id: "killer", label: "Kills Infected Cells", color: "border-indigo-300" },
      { id: "producer", label: "Produces Antibodies", color: "border-pink-300" },
      { id: "remember", label: "Remembers Pathogens", color: "border-cyan-300" },
    ],
  },
  {
    id: 4,
    question: "Sort these by physical or chemical barriers",
    items: [
      { id: "mucus", label: "Mucus", color: "bg-purple-500", correctZone: "physical" },
      { id: "tears", label: "Tears (Lysozyme)", color: "bg-red-500", correctZone: "chemical" },
      { id: "skin-barrier", label: "Skin", color: "bg-blue-500", correctZone: "physical" },
    ],
    dropZones: [
      { id: "physical", label: "Physical Barrier", color: "border-lime-300" },
      { id: "chemical", label: "Chemical Barrier", color: "border-teal-300" },
    ],
  },
  {
    id: 5,
    question: "Match pathogens to their types",
    items: [
      { id: "flu", label: "Influenza", color: "bg-yellow-500", correctZone: "virus" },
      { id: "ecoli", label: "E. coli", color: "bg-blue-500", correctZone: "bacteria" },
      { id: "candida", label: "Candida", color: "bg-green-500", correctZone: "fungi" },
    ],
    dropZones: [
      { id: "virus", label: "Virus", color: "border-rose-300" },
      { id: "bacteria", label: "Bacteria", color: "border-violet-300" },
      { id: "fungi", label: "Fungi", color: "border-fuchsia-300" },
    ],
  },
  {
    id: 6,
    question: "Match immunity types to examples",
    items: [
      { id: "vaccine", label: "Vaccination", color: "bg-red-500", correctZone: "active-artificial" },
      { id: "infection", label: "Natural Infection", color: "bg-purple-500", correctZone: "active-natural" },
      { id: "breast-milk", label: "Breast Milk", color: "bg-blue-500", correctZone: "passive-natural" },
    ],
    dropZones: [
      { id: "active-artificial", label: "Active Artificial", color: "border-sky-300" },
      { id: "active-natural", label: "Active Natural", color: "border-emerald-300" },
      { id: "passive-natural", label: "Passive Natural", color: "border-orange-300" },
    ],
  },
  {
    id: 7,
    question: "Identify the order of immune response",
    items: [
      { id: "recognition", label: "Antigen Recognition", color: "bg-green-500", correctZone: "first" },
      { id: "activation", label: "Cell Activation", color: "bg-red-500", correctZone: "second" },
      { id: "elimination", label: "Pathogen Elimination", color: "bg-purple-500", correctZone: "third" },
    ],
    dropZones: [
      { id: "first", label: "First Step", color: "border-blue-300" },
      { id: "second", label: "Second Step", color: "border-purple-300" },
      { id: "third", label: "Third Step", color: "border-green-300" },
    ],
  },
  {
    id: 8,
    question: "Match organs to their immune functions",
    items: [
      { id: "thymus", label: "Thymus", color: "bg-blue-500", correctZone: "tcell-dev" },
      { id: "bone-marrow", label: "Bone Marrow", color: "bg-red-500", correctZone: "cell-prod" },
      { id: "spleen", label: "Spleen", color: "bg-green-500", correctZone: "filter" },
    ],
    dropZones: [
      { id: "tcell-dev", label: "T Cell Development", color: "border-red-300" },
      { id: "cell-prod", label: "Blood Cell Production", color: "border-yellow-300" },
      { id: "filter", label: "Filters Blood", color: "border-indigo-300" },
    ],
  },
  {
    id: 9,
    question: "Categorize immune responses by speed",
    items: [
      { id: "phagocytosis", label: "Phagocytosis", color: "bg-purple-500", correctZone: "immediate" },
      { id: "antibody-prod", label: "Antibody Production", color: "bg-red-500", correctZone: "delayed" },
      { id: "inflammation", label: "Inflammation", color: "bg-green-500", correctZone: "immediate" },
    ],
    dropZones: [
      { id: "immediate", label: "Immediate Response", color: "border-orange-300" },
      { id: "delayed", label: "Delayed Response", color: "border-blue-300" },
    ],
  },
  {
    id: 10,
    question: "Match antibody types to their locations",
    items: [
      { id: "igg", label: "IgG", color: "bg-orange-500", correctZone: "blood" },
      { id: "iga", label: "IgA", color: "bg-blue-500", correctZone: "mucosa" },
      { id: "igm", label: "IgM", color: "bg-green-500", correctZone: "blood" },
    ],
    dropZones: [
      { id: "blood", label: "Blood", color: "border-purple-300" },
      { id: "mucosa", label: "Mucous Membranes", color: "border-green-300" },
    ],
  },
];

interface DraggableItemProps {
  item: DragItem;
  disabled?: boolean;
}

function DraggableItem({ item, disabled = false }: DraggableItemProps) {
  return (
    <div
      draggable={!disabled}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", item.id);
      }}
      className={`${item.color} text-white px-4 py-4 rounded-lg shadow-md text-center font-medium
      ${disabled ? "cursor-not-allowed opacity-80" : "cursor-move hover:shadow-xl active:scale-95"}
      transition-all`}
    >
      {item.label}
    </div>
  );
}

interface DropZoneComponentProps {
  zone: DropZone;
  placedItems: DragItem[];
  onDropItem: (itemId: string, zoneId: string) => void;
  showFeedback: boolean;
}

function DropZoneComponent({
  zone,
  placedItems,
  onDropItem,
  showFeedback,
}: DropZoneComponentProps) {
  const allCorrect =
    placedItems.length > 0 &&
    placedItems.every((item) => item.correctZone === zone.id);

  const hasWrong =
    placedItems.length > 0 &&
    placedItems.some((item) => item.correctZone !== zone.id);

  let boxStyle = `border-2 border-dashed ${zone.color} bg-white`;

  if (showFeedback && placedItems.length > 0) {
    boxStyle = allCorrect
      ? "border-2 border-solid border-green-600 bg-green-50"
      : "border-2 border-solid border-red-600 bg-red-50";
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();

        if (showFeedback) return;

        const itemId = event.dataTransfer.getData("text/plain");

        if (itemId) {
          onDropItem(itemId, zone.id);
        }
      }}
      className={`${boxStyle} rounded-xl p-4 min-h-40 flex flex-col items-center justify-center transition-all relative`}
    >
      <div className="text-sm font-semibold text-gray-700 mb-3 text-center">
        {zone.label}
      </div>

      {placedItems.length > 0 ? (
        <div className="w-full space-y-2">
          {placedItems.map((item) => (
            <DraggableItem key={item.id} item={item} disabled={showFeedback} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-sm text-center">Drop here</div>
      )}

      {showFeedback && placedItems.length > 0 && (
        <div className="absolute -top-3 -right-3 bg-white rounded-full">
          {hasWrong ? (
            <XCircle className="w-7 h-7 text-red-600" />
          ) : (
            <CheckCircle className="w-7 h-7 text-green-600" />
          )}
        </div>
      )}
    </div>
  );
}

export function DragDropGame() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [savingScore, setSavingScore] = useState(false);

  const currentQ = questions[currentQuestion];

  const handleDropItem = (itemId: string, zoneId: string) => {
    setPlacements((prev) => ({
      ...prev,
      [itemId]: zoneId,
    }));
  };

  const getCurrentQuestionCorrect = () => {
    return currentQ.items.every((item) => placements[item.id] === item.correctZone);
  };

  const getPerformance = (percentage: number) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage > 0) return "Needs Improvement";
    return "No activity yet";
  };

  const saveDragDropProgress = async (finalScore: number) => {
    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in. Score cannot be saved.");
      return;
    }

    const percentage = Math.round((finalScore / questions.length) * 100);
    const performance = getPerformance(percentage);

    setSavingScore(true);

    try {
      await setDoc(
        doc(db, "students", user.uid),
        {
          name: user.displayName || "Student",
          email: user.email || "",
          dragDropScore: finalScore,
          dragDropTotal: questions.length,
          dragDropPercentage: percentage,
          dragDropPerformance: performance,
          lastActivity: "Drag and Drop Activity",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving drag drop progress:", error);
      alert("Failed to save score. Please check your Firebase Firestore settings.");
    } finally {
      setSavingScore(false);
    }
  };

  const handleSubmit = () => {
    const isAllCorrect = getCurrentQuestionCorrect();

    if (isAllCorrect && !answeredCorrectly.includes(currentQuestion)) {
      setScore((prev) => prev + 1);
      setAnsweredCorrectly((prev) => [...prev, currentQuestion]);
    }

    setShowFeedback(true);
  };

  const handleNext = async () => {
    const finalScore = answeredCorrectly.includes(currentQuestion)
      ? score
      : getCurrentQuestionCorrect()
      ? score + 1
      : score;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setPlacements({});
      setShowFeedback(false);
    } else {
      await saveDragDropProgress(finalScore);
      setGameComplete(true);
    }
  };

  const handleResetCurrent = () => {
    setPlacements({});
    setShowFeedback(false);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setPlacements({});
    setShowFeedback(false);
    setScore(0);
    setAnsweredCorrectly([]);
    setGameComplete(false);
    setSavingScore(false);
  };

  const allPlaced = currentQ.items.every((item) => placements[item.id]);
  const unplacedItems = currentQ.items.filter((item) => !placements[item.id]);

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Game Complete! 🎉
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {percentage}%
              </div>

              <p className="text-xl text-gray-600 mb-4">
                You scored {score} out of {questions.length}
              </p>

              {percentage >= 80 && (
                <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    Excellent Work!
                  </h3>
                  <p className="text-green-600">
                    Your score has been saved to your student progress.
                  </p>
                </div>
              )}

              {percentage >= 60 && percentage < 80 && (
                <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">
                    Good Job!
                  </h3>
                  <p className="text-blue-600">
                    Your score has been saved to your student progress.
                  </p>
                </div>
              )}

              {percentage < 60 && (
                <div className="bg-orange-50 border-2 border-orange-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-orange-700 mb-2">
                    Keep Learning!
                  </h3>
                  <p className="text-orange-600">
                    Your score has been saved. Review the notes and try again.
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={handleRestart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Play Again
                </Button>

                <Button
                  onClick={() => navigate("/progress")}
                  variant="outline"
                  className="px-8"
                >
                  View Student Progress
                </Button>

                <Button
                  onClick={() => navigate("/activities")}
                  variant="outline"
                  className="px-8"
                >
                  Back to Activities
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/activities")}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Activities
        </Button>

        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Drag and Drop Activity
          </h1>

          <p className="text-gray-600 mb-4">
            Test your knowledge by dragging items to the correct zones!
          </p>

          <Card className="border-2 border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                How to Play:
              </h3>

              <div className="text-sm text-blue-800 text-left space-y-1">
                <p>1. Drag the colored boxes from Items to Drag.</p>
                <p>2. Drop each item into the correct category.</p>
                <p className="font-semibold">
                  3. Reminder: one box can fill 2 answers if the category is the same.
                </p>
                <p>
                  4. Example: Skin Barrier and Stomach Acid both go into Innate Immunity.
                </p>
                <p>5. Click Check Answer when all items are placed.</p>
                <p>6. Green means correct, red means incorrect.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {currentQuestion + 1}/{questions.length}
            </div>
            <div className="text-sm text-gray-600">Question</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {questions.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg mb-6 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {currentQ.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-center">
              Items to Drag:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto min-h-24">
              {unplacedItems.length > 0 ? (
                unplacedItems.map((item) => (
                  <DraggableItem
                    key={item.id}
                    item={item}
                    disabled={showFeedback}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg py-6">
                  All items placed
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-center">Drop Zones:</h3>
            <p className="text-sm text-gray-500 text-center mb-3 font-medium">
              Reminder: One box can have 2 answers if both items belong to the same category.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {currentQ.dropZones.map((zone) => {
                const placedItems = currentQ.items.filter(
                  (item) => placements[item.id] === zone.id
                );

                return (
                  <DropZoneComponent
                    key={zone.id}
                    zone={zone}
                    placedItems={placedItems}
                    onDropItem={handleDropItem}
                    showFeedback={showFeedback}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {!showFeedback ? (
              <Button
                onClick={handleSubmit}
                disabled={!allPlaced}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={savingScore}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {savingScore
                  ? "Saving Score..."
                  : currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "Finish"}
              </Button>
            )}

            <Button
              onClick={handleResetCurrent}
              variant="outline"
              className="gap-2 px-6"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Current Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}