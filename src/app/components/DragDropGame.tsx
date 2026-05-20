import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useLanguage } from "../context/LanguageContext";

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

type Language = "en" | "ms" | "zh" | "ar";

const englishQuestions: Question[] = [
  {
    id: 1,
    question: "Match the immune system components to their functions",
    items: [
      {
        id: "antibody",
        label: "Antibody",
        color: "bg-purple-500",
        correctZone: "fight",
      },
      {
        id: "pathogen",
        label: "Pathogen",
        color: "bg-green-500",
        correctZone: "invade",
      },
      {
        id: "white-cell",
        label: "White Blood Cell",
        color: "bg-orange-500",
        correctZone: "defend",
      },
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
      {
        id: "skin",
        label: "Skin Barrier",
        color: "bg-blue-500",
        correctZone: "innate",
      },
      {
        id: "antibodies",
        label: "Antibodies",
        color: "bg-orange-500",
        correctZone: "adaptive",
      },
      {
        id: "stomach-acid",
        label: "Stomach Acid",
        color: "bg-pink-500",
        correctZone: "innate",
      },
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
      {
        id: "tcell",
        label: "T Cell",
        color: "bg-red-500",
        correctZone: "killer",
      },
      {
        id: "bcell",
        label: "B Cell",
        color: "bg-cyan-500",
        correctZone: "producer",
      },
      {
        id: "memory",
        label: "Memory Cell",
        color: "bg-yellow-500",
        correctZone: "remember",
      },
    ],
    dropZones: [
      {
        id: "killer",
        label: "Kills Infected Cells",
        color: "border-indigo-300",
      },
      {
        id: "producer",
        label: "Produces Antibodies",
        color: "border-pink-300",
      },
      {
        id: "remember",
        label: "Remembers Pathogens",
        color: "border-cyan-300",
      },
    ],
  },
  {
    id: 4,
    question: "Sort these by physical or chemical barriers",
    items: [
      {
        id: "mucus",
        label: "Mucus",
        color: "bg-purple-500",
        correctZone: "physical",
      },
      {
        id: "tears",
        label: "Tears (Lysozyme)",
        color: "bg-red-500",
        correctZone: "chemical",
      },
      {
        id: "skin-barrier",
        label: "Skin",
        color: "bg-blue-500",
        correctZone: "physical",
      },
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
      {
        id: "flu",
        label: "Influenza",
        color: "bg-yellow-500",
        correctZone: "virus",
      },
      {
        id: "ecoli",
        label: "E. coli",
        color: "bg-blue-500",
        correctZone: "bacteria",
      },
      {
        id: "candida",
        label: "Candida",
        color: "bg-green-500",
        correctZone: "fungi",
      },
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
      {
        id: "vaccine",
        label: "Vaccination",
        color: "bg-red-500",
        correctZone: "active-artificial",
      },
      {
        id: "infection",
        label: "Natural Infection",
        color: "bg-purple-500",
        correctZone: "active-natural",
      },
      {
        id: "breast-milk",
        label: "Breast Milk",
        color: "bg-blue-500",
        correctZone: "passive-natural",
      },
    ],
    dropZones: [
      {
        id: "active-artificial",
        label: "Active Artificial",
        color: "border-sky-300",
      },
      {
        id: "active-natural",
        label: "Active Natural",
        color: "border-emerald-300",
      },
      {
        id: "passive-natural",
        label: "Passive Natural",
        color: "border-orange-300",
      },
    ],
  },
  {
    id: 7,
    question: "Identify the order of immune response",
    items: [
      {
        id: "recognition",
        label: "Antigen Recognition",
        color: "bg-green-500",
        correctZone: "first",
      },
      {
        id: "activation",
        label: "Cell Activation",
        color: "bg-red-500",
        correctZone: "second",
      },
      {
        id: "elimination",
        label: "Pathogen Elimination",
        color: "bg-purple-500",
        correctZone: "third",
      },
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
      {
        id: "thymus",
        label: "Thymus",
        color: "bg-blue-500",
        correctZone: "tcell-dev",
      },
      {
        id: "bone-marrow",
        label: "Bone Marrow",
        color: "bg-red-500",
        correctZone: "cell-prod",
      },
      {
        id: "spleen",
        label: "Spleen",
        color: "bg-green-500",
        correctZone: "filter",
      },
    ],
    dropZones: [
      {
        id: "tcell-dev",
        label: "T Cell Development",
        color: "border-red-300",
      },
      {
        id: "cell-prod",
        label: "Blood Cell Production",
        color: "border-yellow-300",
      },
      { id: "filter", label: "Filters Blood", color: "border-indigo-300" },
    ],
  },
  {
    id: 9,
    question: "Categorize immune responses by speed",
    items: [
      {
        id: "phagocytosis",
        label: "Phagocytosis",
        color: "bg-purple-500",
        correctZone: "immediate",
      },
      {
        id: "antibody-prod",
        label: "Antibody Production",
        color: "bg-red-500",
        correctZone: "delayed",
      },
      {
        id: "inflammation",
        label: "Inflammation",
        color: "bg-green-500",
        correctZone: "immediate",
      },
    ],
    dropZones: [
      {
        id: "immediate",
        label: "Immediate Response",
        color: "border-orange-300",
      },
      {
        id: "delayed",
        label: "Delayed Response",
        color: "border-blue-300",
      },
    ],
  },
  {
    id: 10,
    question: "Match antibody types to their locations",
    items: [
      {
        id: "igg",
        label: "IgG",
        color: "bg-orange-500",
        correctZone: "blood",
      },
      {
        id: "iga",
        label: "IgA",
        color: "bg-blue-500",
        correctZone: "mucosa",
      },
      {
        id: "igm",
        label: "IgM",
        color: "bg-green-500",
        correctZone: "blood",
      },
    ],
    dropZones: [
      { id: "blood", label: "Blood", color: "border-purple-300" },
      {
        id: "mucosa",
        label: "Mucous Membranes",
        color: "border-green-300",
      },
    ],
  },
];

const malayQuestions: Question[] = [
  {
    id: 1,
    question: "Padankan komponen sistem imun dengan fungsinya",
    items: [
      {
        id: "antibody",
        label: "Antibodi",
        color: "bg-purple-500",
        correctZone: "fight",
      },
      {
        id: "pathogen",
        label: "Patogen",
        color: "bg-green-500",
        correctZone: "invade",
      },
      {
        id: "white-cell",
        label: "Sel Darah Putih",
        color: "bg-orange-500",
        correctZone: "defend",
      },
    ],
    dropZones: [
      { id: "fight", label: "Melawan Jangkitan", color: "border-blue-300" },
      { id: "invade", label: "Menyebabkan Penyakit", color: "border-red-300" },
      {
        id: "defend",
        label: "Mempertahankan Badan",
        color: "border-green-300",
      },
    ],
  },
  {
    id: 2,
    question: "Kelaskan kepada imuniti semula jadi atau imuniti adaptif",
    items: [
      {
        id: "skin",
        label: "Halangan Kulit",
        color: "bg-blue-500",
        correctZone: "innate",
      },
      {
        id: "antibodies",
        label: "Antibodi",
        color: "bg-orange-500",
        correctZone: "adaptive",
      },
      {
        id: "stomach-acid",
        label: "Asid Perut",
        color: "bg-pink-500",
        correctZone: "innate",
      },
    ],
    dropZones: [
      {
        id: "innate",
        label: "Imuniti Semula Jadi",
        color: "border-orange-300",
      },
      {
        id: "adaptive",
        label: "Imuniti Adaptif",
        color: "border-purple-300",
      },
    ],
  },
  {
    id: 3,
    question: "Padankan jenis sel dengan peranannya",
    items: [
      { id: "tcell", label: "Sel T", color: "bg-red-500", correctZone: "killer" },
      { id: "bcell", label: "Sel B", color: "bg-cyan-500", correctZone: "producer" },
      {
        id: "memory",
        label: "Sel Memori",
        color: "bg-yellow-500",
        correctZone: "remember",
      },
    ],
    dropZones: [
      {
        id: "killer",
        label: "Membunuh Sel Dijangkiti",
        color: "border-indigo-300",
      },
      {
        id: "producer",
        label: "Menghasilkan Antibodi",
        color: "border-pink-300",
      },
      {
        id: "remember",
        label: "Mengingati Patogen",
        color: "border-cyan-300",
      },
    ],
  },
  {
    id: 4,
    question: "Susun kepada halangan fizikal atau kimia",
    items: [
      {
        id: "mucus",
        label: "Mukus",
        color: "bg-purple-500",
        correctZone: "physical",
      },
      {
        id: "tears",
        label: "Air Mata",
        color: "bg-red-500",
        correctZone: "chemical",
      },
      {
        id: "skin-barrier",
        label: "Kulit",
        color: "bg-blue-500",
        correctZone: "physical",
      },
    ],
    dropZones: [
      {
        id: "physical",
        label: "Halangan Fizikal",
        color: "border-lime-300",
      },
      {
        id: "chemical",
        label: "Halangan Kimia",
        color: "border-teal-300",
      },
    ],
  },
  {
    id: 5,
    question: "Padankan patogen dengan jenisnya",
    items: [
      {
        id: "flu",
        label: "Influenza",
        color: "bg-yellow-500",
        correctZone: "virus",
      },
      {
        id: "ecoli",
        label: "E. coli",
        color: "bg-blue-500",
        correctZone: "bacteria",
      },
      {
        id: "candida",
        label: "Candida",
        color: "bg-green-500",
        correctZone: "fungi",
      },
    ],
    dropZones: [
      { id: "virus", label: "Virus", color: "border-rose-300" },
      { id: "bacteria", label: "Bakteria", color: "border-violet-300" },
      { id: "fungi", label: "Kulat", color: "border-fuchsia-300" },
    ],
  },
  {
    id: 6,
    question: "Padankan jenis imuniti dengan contoh",
    items: [
      {
        id: "vaccine",
        label: "Vaksinasi",
        color: "bg-red-500",
        correctZone: "active-artificial",
      },
      {
        id: "infection",
        label: "Jangkitan Semula Jadi",
        color: "bg-purple-500",
        correctZone: "active-natural",
      },
      {
        id: "breast-milk",
        label: "Susu Ibu",
        color: "bg-blue-500",
        correctZone: "passive-natural",
      },
    ],
    dropZones: [
      {
        id: "active-artificial",
        label: "Aktif Buatan",
        color: "border-sky-300",
      },
      {
        id: "active-natural",
        label: "Aktif Semula Jadi",
        color: "border-emerald-300",
      },
      {
        id: "passive-natural",
        label: "Pasif Semula Jadi",
        color: "border-orange-300",
      },
    ],
  },
  {
    id: 7,
    question: "Kenal pasti susunan tindak balas imun",
    items: [
      {
        id: "recognition",
        label: "Pengecaman Antigen",
        color: "bg-green-500",
        correctZone: "first",
      },
      {
        id: "activation",
        label: "Pengaktifan Sel",
        color: "bg-red-500",
        correctZone: "second",
      },
      {
        id: "elimination",
        label: "Penghapusan Patogen",
        color: "bg-purple-500",
        correctZone: "third",
      },
    ],
    dropZones: [
      { id: "first", label: "Langkah Pertama", color: "border-blue-300" },
      { id: "second", label: "Langkah Kedua", color: "border-purple-300" },
      { id: "third", label: "Langkah Ketiga", color: "border-green-300" },
    ],
  },
  {
    id: 8,
    question: "Padankan organ dengan fungsi imun",
    items: [
      {
        id: "thymus",
        label: "Timus",
        color: "bg-blue-500",
        correctZone: "tcell-dev",
      },
      {
        id: "bone-marrow",
        label: "Sumsum Tulang",
        color: "bg-red-500",
        correctZone: "cell-prod",
      },
      {
        id: "spleen",
        label: "Limpa",
        color: "bg-green-500",
        correctZone: "filter",
      },
    ],
    dropZones: [
      {
        id: "tcell-dev",
        label: "Perkembangan Sel T",
        color: "border-red-300",
      },
      {
        id: "cell-prod",
        label: "Penghasilan Sel Darah",
        color: "border-yellow-300",
      },
      { id: "filter", label: "Menapis Darah", color: "border-indigo-300" },
    ],
  },
  {
    id: 9,
    question: "Kategorikan tindak balas imun mengikut kelajuan",
    items: [
      {
        id: "phagocytosis",
        label: "Fagositosis",
        color: "bg-purple-500",
        correctZone: "immediate",
      },
      {
        id: "antibody-prod",
        label: "Penghasilan Antibodi",
        color: "bg-red-500",
        correctZone: "delayed",
      },
      {
        id: "inflammation",
        label: "Keradangan",
        color: "bg-green-500",
        correctZone: "immediate",
      },
    ],
    dropZones: [
      {
        id: "immediate",
        label: "Tindak Balas Segera",
        color: "border-orange-300",
      },
      {
        id: "delayed",
        label: "Tindak Balas Lambat",
        color: "border-blue-300",
      },
    ],
  },
  {
    id: 10,
    question: "Padankan jenis antibodi dengan lokasinya",
    items: [
      { id: "igg", label: "IgG", color: "bg-orange-500", correctZone: "blood" },
      { id: "iga", label: "IgA", color: "bg-blue-500", correctZone: "mucosa" },
      { id: "igm", label: "IgM", color: "bg-green-500", correctZone: "blood" },
    ],
    dropZones: [
      { id: "blood", label: "Darah", color: "border-purple-300" },
      { id: "mucosa", label: "Membran Mukus", color: "border-green-300" },
    ],
  },
];

const questionsByLanguage: Record<Language, Question[]> = {
  en: englishQuestions,
  ms: malayQuestions,
  zh: englishQuestions,
  ar: englishQuestions,
};

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
      className={`${item.color} text-white px-4 py-4 rounded-lg shadow-md text-center font-medium ${
        disabled
          ? "cursor-not-allowed opacity-80"
          : "cursor-move hover:shadow-xl active:scale-95"
      } transition-all`}
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
  text: {
    dropHere: string;
  };
}

function DropZoneComponent({
  zone,
  placedItems,
  onDropItem,
  showFeedback,
  text,
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
        <div className="text-gray-400 text-sm text-center">{text.dropHere}</div>
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
  const { language } = useLanguage();

  const text = {
    en: {
      backToActivities: "Back to Activities",
      title: "Drag and Drop Activity",
      subtitle: "Test your knowledge by dragging items to the correct zones!",
      howToPlay: "How to Play:",
      instruction1: "1. Drag the colored boxes from Items to Drag.",
      instruction2: "2. Drop each item into the correct category.",
      instruction3:
        "3. Reminder: one box can fill 2 answers if the category is the same.",
      instruction4:
        "4. Example: Skin Barrier and Stomach Acid both go into Innate Immunity.",
      instruction5: "5. Click Check Answer when all items are placed.",
      instruction6: "6. Green means correct, red means incorrect.",
      question: "Question",
      correct: "Correct",
      total: "Total",
      itemsToDrag: "Items to Drag:",
      dropZones: "Drop Zones:",
      dropReminder:
        "Reminder: One box can have 2 answers if both items belong to the same category.",
      allItemsPlaced: "All items placed",
      dropHere: "Drop here",
      checkAnswer: "Check Answer",
      nextQuestion: "Next Question",
      finish: "Finish",
      savingScore: "Saving Score...",
      resetCurrent: "Reset Current Question",
      gameComplete: "Game Complete! 🎉",
      youScored: "You scored",
      outOf: "out of",
      excellentWork: "Excellent Work!",
      goodJob: "Good Job!",
      keepLearning: "Keep Learning!",
      savedExcellent: "Your score has been saved to your student progress.",
      savedGood: "Your score has been saved to your student progress.",
      savedLow: "Your score has been saved. Review the notes and try again.",
      playAgain: "Play Again",
      viewProgress: "View Student Progress",
      userNotLoggedIn: "User not logged in. Score cannot be saved.",
      failedSave:
        "Failed to save score. Please check your Firebase Firestore settings.",
      lastActivity: "Drag and Drop Activity",
      student: "Student",
    },
    ms: {
      backToActivities: "Kembali ke Aktiviti",
      title: "Aktiviti Seret dan Lepas",
      subtitle: "Uji pengetahuan anda dengan menyeret item ke zon yang betul!",
      howToPlay: "Cara Bermain:",
      instruction1: "1. Seret kotak berwarna dari bahagian Item untuk Diseret.",
      instruction2: "2. Lepaskan setiap item ke kategori yang betul.",
      instruction3:
        "3. Peringatan: satu kotak boleh diisi 2 jawapan jika kategorinya sama.",
      instruction4:
        "4. Contoh: Halangan Kulit dan Asid Perut masuk ke Imuniti Semula Jadi.",
      instruction5: "5. Klik Semak Jawapan apabila semua item sudah diletakkan.",
      instruction6: "6. Hijau bermaksud betul, merah bermaksud salah.",
      question: "Soalan",
      correct: "Betul",
      total: "Jumlah",
      itemsToDrag: "Item untuk Diseret:",
      dropZones: "Zon Jawapan:",
      dropReminder:
        "Peringatan: Satu kotak boleh mempunyai 2 jawapan jika kedua-duanya dalam kategori yang sama.",
      allItemsPlaced: "Semua item telah diletakkan",
      dropHere: "Letak di sini",
      checkAnswer: "Semak Jawapan",
      nextQuestion: "Soalan Seterusnya",
      finish: "Tamat",
      savingScore: "Menyimpan Markah...",
      resetCurrent: "Reset Soalan Ini",
      gameComplete: "Permainan Selesai! 🎉",
      youScored: "Anda mendapat markah",
      outOf: "daripada",
      excellentWork: "Sangat Bagus!",
      goodJob: "Bagus!",
      keepLearning: "Teruskan Belajar!",
      savedExcellent: "Markah anda telah disimpan dalam kemajuan pelajar.",
      savedGood: "Markah anda telah disimpan dalam kemajuan pelajar.",
      savedLow: "Markah anda telah disimpan. Baca semula nota dan cuba lagi.",
      playAgain: "Main Semula",
      viewProgress: "Lihat Kemajuan Pelajar",
      userNotLoggedIn: "Pengguna belum log masuk. Markah tidak dapat disimpan.",
      failedSave:
        "Gagal menyimpan markah. Sila semak tetapan Firebase Firestore.",
      lastActivity: "Aktiviti Seret dan Lepas",
      student: "Pelajar",
    },
    zh: {
      backToActivities: "返回活动",
      title: "拖放活动",
      subtitle: "通过拖放项目到正确区域来测试你的知识！",
      howToPlay: "玩法：",
      instruction1: "1. 从“要拖动的项目”中拖动彩色方块。",
      instruction2: "2. 将每个项目放到正确的类别。",
      instruction3: "3. 提醒：如果类别相同，一个框可以放 2 个答案。",
      instruction4: "4. Example: Skin Barrier and Stomach Acid both go into Innate Immunity.",
      instruction5: "5. 所有项目放好后点击检查答案。",
      instruction6: "6. 绿色表示正确，红色表示错误。",
      question: "问题",
      correct: "正确",
      total: "总数",
      itemsToDrag: "要拖动的项目：",
      dropZones: "放置区域：",
      dropReminder: "提醒：如果两个项目属于同一类别，一个框可以有 2 个答案。",
      allItemsPlaced: "所有项目已放置",
      dropHere: "放在这里",
      checkAnswer: "检查答案",
      nextQuestion: "下一题",
      finish: "完成",
      savingScore: "正在保存分数...",
      resetCurrent: "重置当前问题",
      gameComplete: "游戏完成！🎉",
      youScored: "你的得分是",
      outOf: "共",
      excellentWork: "非常棒！",
      goodJob: "做得好！",
      keepLearning: "继续学习！",
      savedExcellent: "你的分数已保存到学生进度。",
      savedGood: "你的分数已保存到学生进度。",
      savedLow: "你的分数已保存。请复习笔记后再试。",
      playAgain: "再玩一次",
      viewProgress: "查看学生进度",
      userNotLoggedIn: "用户未登录，无法保存分数。",
      failedSave: "保存分数失败。请检查 Firebase Firestore 设置。",
      lastActivity: "拖放活动",
      student: "学生",
    },
    ar: {
      backToActivities: "العودة إلى الأنشطة",
      title: "نشاط السحب والإفلات",
      subtitle: "اختبر معرفتك بسحب العناصر إلى المناطق الصحيحة!",
      howToPlay: "طريقة اللعب:",
      instruction1: "1. اسحب الصناديق الملونة من قسم العناصر.",
      instruction2: "2. ضع كل عنصر في الفئة الصحيحة.",
      instruction3:
        "3. تذكير: يمكن لصندوق واحد أن يحتوي على إجابتين إذا كانت الفئة نفسها.",
      instruction4: "4. Example: Skin Barrier and Stomach Acid in Innate Immunity.",
      instruction5: "5. انقر على تحقق من الإجابة عند وضع جميع العناصر.",
      instruction6: "6. اللون الأخضر يعني صحيح، والأحمر يعني خطأ.",
      question: "السؤال",
      correct: "صحيح",
      total: "المجموع",
      itemsToDrag: "العناصر للسحب:",
      dropZones: "مناطق الإفلات:",
      dropReminder:
        "تذكير: يمكن لصندوق واحد أن يحتوي على إجابتين إذا كانا من نفس الفئة.",
      allItemsPlaced: "تم وضع جميع العناصر",
      dropHere: "ضع هنا",
      checkAnswer: "تحقق من الإجابة",
      nextQuestion: "السؤال التالي",
      finish: "إنهاء",
      savingScore: "جارٍ حفظ النتيجة...",
      resetCurrent: "إعادة تعيين السؤال الحالي",
      gameComplete: "اكتملت اللعبة! 🎉",
      youScored: "حصلت على",
      outOf: "من",
      excellentWork: "عمل ممتاز!",
      goodJob: "عمل جيد!",
      keepLearning: "استمر في التعلم!",
      savedExcellent: "تم حفظ نتيجتك في تقدم الطالب.",
      savedGood: "تم حفظ نتيجتك في تقدم الطالب.",
      savedLow: "تم حفظ نتيجتك. راجع الملاحظات وحاول مرة أخرى.",
      playAgain: "العب مرة أخرى",
      viewProgress: "عرض تقدم الطالب",
      userNotLoggedIn: "المستخدم غير مسجل الدخول. لا يمكن حفظ النتيجة.",
      failedSave: "فشل حفظ النتيجة. تحقق من إعدادات Firebase Firestore.",
      lastActivity: "نشاط السحب والإفلات",
      student: "طالب",
    },
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [savingScore, setSavingScore] = useState(false);

  const currentText = text[language];
  const questions = questionsByLanguage[language];
  const currentQ = questions[currentQuestion];

  const handleDropItem = (itemId: string, zoneId: string) => {
    setPlacements((prev) => ({
      ...prev,
      [itemId]: zoneId,
    }));
  };

  const getCurrentQuestionCorrect = () => {
    return currentQ.items.every(
      (item) => placements[item.id] === item.correctZone
    );
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
      alert(currentText.userNotLoggedIn);
      return;
    }

    const percentage = Math.round((finalScore / questions.length) * 100);
    const performance = getPerformance(percentage);

    setSavingScore(true);

    try {
      await setDoc(
        doc(db, "students", user.uid),
        {
          name: user.displayName || currentText.student,
          email: user.email || "",
          dragDropScore: finalScore,
          dragDropTotal: questions.length,
          dragDropPercentage: percentage,
          dragDropPerformance: performance,
          lastActivity: currentText.lastActivity,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving drag drop progress:", error);
      alert(currentText.failedSave);
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
      setScore(finalScore);
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
              {currentText.gameComplete}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {percentage}%
              </div>

              <p className="text-xl text-gray-600 mb-4">
                {currentText.youScored} {score} {currentText.outOf}{" "}
                {questions.length}
              </p>

              {percentage >= 80 && (
                <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    {currentText.excellentWork}
                  </h3>
                  <p className="text-green-600">
                    {currentText.savedExcellent}
                  </p>
                </div>
              )}

              {percentage >= 60 && percentage < 80 && (
                <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">
                    {currentText.goodJob}
                  </h3>
                  <p className="text-blue-600">{currentText.savedGood}</p>
                </div>
              )}

              {percentage < 60 && (
                <div className="bg-orange-50 border-2 border-orange-600 rounded-lg p-6 mb-4">
                  <h3 className="text-2xl font-bold text-orange-700 mb-2">
                    {currentText.keepLearning}
                  </h3>
                  <p className="text-orange-600">{currentText.savedLow}</p>
                </div>
              )}

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={handleRestart}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  {currentText.playAgain}
                </Button>

                <Button
                  onClick={() => navigate("/progress")}
                  variant="outline"
                  className="px-8"
                >
                  {currentText.viewProgress}
                </Button>

                <Button
                  onClick={() => navigate("/activities")}
                  variant="outline"
                  className="px-8"
                >
                  {currentText.backToActivities}
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
          {currentText.backToActivities}
        </Button>

        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{currentText.title}</h1>
          <p className="text-gray-600 mb-4">{currentText.subtitle}</p>

          <Card className="border-2 border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                {currentText.howToPlay}
              </h3>

              <div className="text-sm text-blue-800 text-left space-y-1">
                <p>{currentText.instruction1}</p>
                <p>{currentText.instruction2}</p>
                <p className="font-semibold">{currentText.instruction3}</p>
                <p>{currentText.instruction4}</p>
                <p>{currentText.instruction5}</p>
                <p>{currentText.instruction6}</p>
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
            <div className="text-sm text-gray-600">
              {currentText.question}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600">{currentText.correct}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {questions.length}
            </div>
            <div className="text-sm text-gray-600">{currentText.total}</div>
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
              {currentText.itemsToDrag}
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
                  {currentText.allItemsPlaced}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-center">
              {currentText.dropZones}
            </h3>

            <p className="text-sm text-gray-500 text-center mb-3 font-medium">
              {currentText.dropReminder}
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
                    text={{ dropHere: currentText.dropHere }}
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
                {currentText.checkAnswer}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={savingScore}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {savingScore
                  ? currentText.savingScore
                  : currentQuestion < questions.length - 1
                  ? currentText.nextQuestion
                  : currentText.finish}
              </Button>
            )}

            <Button
              onClick={handleResetCurrent}
              variant="outline"
              className="gap-2 px-6"
            >
              <RotateCcw className="w-4 h-4" />
              {currentText.resetCurrent}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}