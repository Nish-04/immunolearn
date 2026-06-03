import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Bug,
  CheckCircle2,
  Droplets,
  HeartPulse,
  MousePointerClick,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

type LabelItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  selectedColor: string;
};

type TargetItem = {
  id: string;
  correctLabelId: string;
  position: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
};

const labelItems: LabelItem[] = [
  {
    id: "mucus",
    title: "Mucus",
    description:
      "Mucus in the nose traps harmful pathogens before they enter deeper into the body.",
    icon: Droplets,
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
    selectedColor: "bg-cyan-600 text-white border-cyan-600",
  },
  {
    id: "white-blood-cells",
    title: "White Blood Cells",
    description:
      "White blood cells move through the body and help fight harmful microorganisms.",
    icon: Activity,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    selectedColor: "bg-purple-600 text-white border-purple-600",
  },
  {
    id: "stomach-acid",
    title: "Stomach Acid",
    description:
      "Stomach acid destroys many germs that enter the body through food.",
    icon: HeartPulse,
    color: "bg-red-100 text-red-700 border-red-200",
    selectedColor: "bg-red-600 text-white border-red-600",
  },
  {
    id: "skin",
    title: "Skin",
    description:
      "Skin acts as the body's first physical barrier and helps stop pathogens from entering.",
    icon: Shield,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    selectedColor: "bg-orange-500 text-white border-orange-500",
  },
  {
    id: "pathogen",
    title: "Pathogen",
    description:
      "A pathogen is a harmful microorganism that can cause disease.",
    icon: Bug,
    color: "bg-green-100 text-green-700 border-green-200",
    selectedColor: "bg-green-600 text-white border-green-600",
  },
];

/*
  Kedudukan label dikekalkan sama seperti code asal kamu.
  Jangan ubah nilai ini jika kedudukan label sudah tepat.
*/
const targets: TargetItem[] = [
  {
    id: "target-nose",
    correctLabelId: "mucus",
    position: {
      top: "21.7%",
      left: "70.6%",
      width: "25.5%",
      height: "8.6%",
    },
  },
  {
    id: "target-chest",
    correctLabelId: "white-blood-cells",
    position: {
      top: "33.1%",
      left: "3.3%",
      width: "25.5%",
      height: "8.6%",
    },
  },
  {
    id: "target-stomach",
    correctLabelId: "stomach-acid",
    position: {
      top: "47.2%",
      left: "70.5%",
      width: "25.5%",
      height: "8.6%",
    },
  },
  {
    id: "target-skin",
    correctLabelId: "skin",
    position: {
      top: "72.8%",
      left: "3.1%",
      width: "25.5%",
      height: "8.6%",
    },
  },
  {
    id: "target-virus",
    correctLabelId: "pathogen",
    position: {
      top: "83.8%",
      left: "70.5%",
      width: "25.5%",
      height: "8.6%",
    },
  },
];

export function DiagramLabelGame() {
  const navigate = useNavigate();

  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  const [completedTargetIds, setCompletedTargetIds] = useState<string[]>([]);

  const [mistakes, setMistakes] = useState(0);

  const [message, setMessage] = useState(
    "Choose a label from the Label Bank, then click the correct answer box."
  );

  const [feedbackType, setFeedbackType] = useState<
    "neutral" | "success" | "error"
  >("neutral");

  const [savingProgress, setSavingProgress] = useState(false);

  const [progressSaved, setProgressSaved] = useState(false);

  const [saveError, setSaveError] = useState(false);

  const totalTargets = targets.length;

  const completedCount = completedTargetIds.length;

  const isCompleted = completedCount === totalTargets;

  const progress = useMemo(() => {
    return Math.round((completedCount / totalTargets) * 100);
  }, [completedCount, totalTargets]);

  const score = Math.max(0, completedCount * 20 - mistakes * 5);

  /*
    Progress disimpan secara automatik apabila semua label selesai.
  */
  useEffect(() => {
    if (!isCompleted || progressSaved || savingProgress) {
      return;
    }

    const saveDefenseLabProgress = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("Student is not logged in.");

        setSaveError(true);

        return;
      }

      setSavingProgress(true);

      setSaveError(false);

      try {
        await setDoc(
          doc(db, "students", user.uid),
          {
            name: user.displayName || "Student",
            email: user.email || "",

            completedActivities: arrayUnion("defense-lab-mission"),

            defenseLabCompleted: true,
            defenseLabScore: score,
            defenseLabMistakes: mistakes,
            defenseLabCompletedAt: serverTimestamp(),

            lastActivity: "Defense Lab Mission",
            updatedAt: serverTimestamp(),
          },
          {
            merge: true,
          }
        );

        setProgressSaved(true);
      } catch (error) {
        console.error("Failed to save Defense Lab Mission progress:", error);

        setSaveError(true);
      } finally {
        setSavingProgress(false);
      }
    };

    void saveDefenseLabProgress();
  }, [isCompleted, progressSaved, savingProgress, score, mistakes]);

  const resetGame = () => {
    setSelectedLabelId(null);

    setCompletedTargetIds([]);

    setMistakes(0);

    setMessage(
      "Choose a label from the Label Bank, then click the correct answer box."
    );

    setFeedbackType("neutral");

    setSavingProgress(false);

    setProgressSaved(false);

    setSaveError(false);
  };

  const handleLabelClick = (labelId: string) => {
    const selectedLabel = labelItems.find((label) => label.id === labelId);

    setSelectedLabelId(labelId);

    setMessage(
      `${selectedLabel?.title || "Label"} selected. Now click the correct answer box.`
    );

    setFeedbackType("neutral");
  };

  const handleTargetClick = (target: TargetItem) => {
    if (completedTargetIds.includes(target.id)) {
      setMessage("This answer box has already been completed.");

      setFeedbackType("neutral");

      return;
    }

    if (!selectedLabelId) {
      setMessage("Please choose one label from the Label Bank first.");

      setFeedbackType("error");

      return;
    }

    const selectedLabel = labelItems.find(
      (label) => label.id === selectedLabelId
    );

    if (selectedLabelId === target.correctLabelId) {
      setCompletedTargetIds((previousTargets) => [
        ...previousTargets,
        target.id,
      ]);

      setMessage(`Correct! ${selectedLabel?.description || "Good job!"}`);

      setFeedbackType("success");

      setSelectedLabelId(null);

      return;
    }

    setMistakes((previousMistakes) => previousMistakes + 1);

    setMessage("Not quite. Try another answer box.");

    setFeedbackType("error");
  };

  const getCompletedLabel = (target: TargetItem) => {
    if (!completedTargetIds.includes(target.id)) {
      return null;
    }

    return labelItems.find((label) => label.id === target.correctLabelId);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-50 to-purple-100 px-5 py-8 font-nunito">
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-300/30 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl"></div>

      <div className="absolute top-32 right-16 hidden h-20 w-20 rounded-full border-4 border-white/50 bg-cyan-200/40 lg:block animate-float"></div>

      <div className="absolute bottom-24 left-12 hidden h-14 w-14 rounded-full border-4 border-white/50 bg-purple-200/40 lg:block animate-float-slow"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <button
            type="button"
            onClick={() => navigate("/activities")}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-5 py-3 font-bold text-blue-800 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" />

            Back to Activities
          </button>

          <div className="text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-2 text-sm font-bold text-purple-700 shadow-md">
              <Sparkles className="h-4 w-4" />

              Label, Learn, and Protect!
            </div>

            <h1 className="font-fredoka text-4xl font-extrabold text-slate-900 md:text-5xl">
              Defense Lab Mission
            </h1>

            <p className="mt-2 text-gray-600">
              Identify the body's defense mechanisms and complete the diagram.
            </p>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-5 py-3 font-bold text-blue-800 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <RotateCcw className="h-5 w-5" />

            Restart
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Completed"
            value={`${completedCount}/${totalTargets}`}
            icon={CheckCircle2}
            color="bg-green-100 text-green-700"
          />

          <StatCard
            title="Score"
            value={`${score}`}
            icon={Trophy}
            color="bg-yellow-100 text-yellow-700"
          />

          <StatCard
            title="Mistakes"
            value={`${mistakes}`}
            icon={XCircle}
            color="bg-red-100 text-red-700"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-[2rem] border border-white bg-white/90 p-5 shadow-2xl backdrop-blur">
            <div className="mb-5">
              <div className="mb-2 flex justify-between text-sm font-bold text-gray-600">
                <span>Mission Progress</span>

                <span>{progress}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
            </div>

            {isCompleted && (
              <div className="mb-5 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 p-5 text-white shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20">
                    <Trophy className="h-9 w-9" />
                  </div>

                  <div>
                    <h2 className="font-fredoka text-2xl font-extrabold">
                      Mission Complete!
                    </h2>

                    <p className="font-medium">
                      You successfully labeled all body defense mechanisms.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white/20 px-4 py-3 text-sm font-bold">
                  {savingProgress && "Saving your progress..."}

                  {progressSaved &&
                    "Progress saved successfully to Student Progress."}

                  {saveError &&
                    "Progress could not be saved. Please check your login and Firestore settings."}
                </div>
              </div>
            )}

            <div className="relative mx-auto max-w-[650px] overflow-hidden rounded-[2rem] border-4 border-blue-100 bg-white shadow-inner">
              <img
                src="/images/diagram/body-defense-diagram.png"
                alt="Body defense diagram with blank answer boxes"
                className="block h-auto w-full"
              />

              {targets.map((target) => {
                const completedLabel = getCompletedLabel(target);

                const CompletedIcon = completedLabel?.icon;

                return (
                  <button
                    type="button"
                    key={target.id}
                    onClick={() => handleTargetClick(target)}
                    aria-label={
                      completedLabel
                        ? `${completedLabel.title} completed`
                        : "Empty answer box"
                    }
                    className={`absolute flex items-center justify-center rounded-xl border-2 px-2 py-1 text-center transition-all duration-300 ${
                      completedLabel
                        ? "border-green-400 bg-green-50/95 shadow-lg"
                        : selectedLabelId
                        ? "border-blue-500 bg-white/80 shadow-md animate-pulse hover:scale-105"
                        : "border-blue-300 bg-white/45 hover:bg-white/80 hover:shadow-md"
                    }`}
                    style={{
                      top: target.position.top,
                      left: target.position.left,
                      width: target.position.width,
                      height: target.position.height,
                    }}
                  >
                    {completedLabel && CompletedIcon ? (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <CompletedIcon className="h-4 w-4 text-green-700 sm:h-5 sm:w-5" />

                        <span className="text-[8px] font-extrabold leading-tight text-green-800 sm:text-[10px] md:text-xs">
                          {completedLabel.title}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <MousePointerClick className="h-3 w-3 text-blue-700 sm:h-4 sm:w-4" />

                        <span className="text-[7px] font-bold leading-tight text-blue-700 sm:text-[9px] md:text-[10px]">
                          Place label here
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="h-fit rounded-[2rem] border border-white bg-white/95 p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-fredoka text-2xl font-extrabold text-gray-900">
                  Label Bank
                </h2>

                <p className="text-xs text-gray-500">
                  Choose one label at a time
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {labelItems.map((label) => {
                const Icon = label.icon;

                const labelAlreadyUsed = targets.some(
                  (target) =>
                    target.correctLabelId === label.id &&
                    completedTargetIds.includes(target.id)
                );

                const isSelected = selectedLabelId === label.id;

                return (
                  <button
                    type="button"
                    key={label.id}
                    disabled={labelAlreadyUsed}
                    onClick={() => handleLabelClick(label.id)}
                    className={`w-full rounded-2xl border-2 p-3 text-left transition-all duration-300 ${
                      labelAlreadyUsed
                        ? "cursor-not-allowed border-green-200 bg-green-50 opacity-60"
                        : isSelected
                        ? `${label.selectedColor} -translate-y-1 shadow-lg`
                        : `${label.color} hover:-translate-y-1 hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                          isSelected
                            ? "bg-white/20"
                            : labelAlreadyUsed
                            ? "bg-green-100 text-green-700"
                            : "bg-white/70"
                        }`}
                      >
                        {labelAlreadyUsed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <p className="font-extrabold">{label.title}</p>

                        <p
                          className={`text-xs ${
                            isSelected ? "text-white/90" : "opacity-70"
                          }`}
                        >
                          {labelAlreadyUsed
                            ? "Completed"
                            : isSelected
                            ? "Selected"
                            : "Click to select"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className={`mt-5 rounded-2xl border-2 p-4 ${
                feedbackType === "success"
                  ? "border-green-300 bg-green-50 text-green-800"
                  : feedbackType === "error"
                  ? "border-red-300 bg-red-50 text-red-800"
                  : "border-yellow-200 bg-yellow-50 text-yellow-800"
              }`}
            >
              <p className="text-sm font-bold leading-relaxed">{message}</p>
            </div>

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <h3 className="mb-1 font-extrabold text-blue-800">
                How to Play
              </h3>

              <p className="text-sm leading-relaxed text-blue-700">
                Select one label, then click the correct empty answer box on the
                diagram.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl border border-white bg-white/95 p-4 shadow-xl">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-sm font-bold text-gray-500">{title}</p>

        <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
}