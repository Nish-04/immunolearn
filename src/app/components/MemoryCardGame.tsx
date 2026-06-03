import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Clock3,
  Footprints,
  HelpCircle,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useNavigate } from "react-router";

type GameCard = {
  uniqueId: string;
  pairId: string;
  label: string;
  image?: string;
  emoji?: string;
  background: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const cardPairs = [
  {
    pairId: "virus",
    label: "Virus",
    image: "/images/lecture/virus-coronavirus.png",
    background: "from-green-100 to-lime-50",
  },
  {
    pairId: "antibody",
    label: "Antibody",
    emoji: "🛡️",
    background: "from-cyan-100 to-blue-50",
  },
  {
    pairId: "white-blood-cell",
    label: "White Blood Cell",
    image: "/images/cells/cell-neutrophil.png",
    background: "from-purple-100 to-pink-50",
  },
  {
    pairId: "vaccine",
    label: "Vaccine",
    emoji: "💉",
    background: "from-yellow-100 to-orange-50",
  },
  {
    pairId: "bacteria",
    label: "Bacteria",
    emoji: "🦠",
    background: "from-pink-100 to-red-50",
  },
  {
    pairId: "macrophage",
    label: "Macrophage",
    image: "/images/cells/cell-macrophage.png",
    background: "from-indigo-100 to-purple-50",
  },
];

function shuffleCards(cards: GameCard[]) {
  return [...cards].sort(() => Math.random() - 0.5);
}

function createGameCards(): GameCard[] {
  const duplicatedCards = cardPairs.flatMap((card) => [
    {
      ...card,
      uniqueId: `${card.pairId}-a`,
      isFlipped: false,
      isMatched: false,
    },
    {
      ...card,
      uniqueId: `${card.pairId}-b`,
      isFlipped: false,
      isMatched: false,
    },
  ]);

  return shuffleCards(duplicatedCards);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function MemoryCardGame() {
  const navigate = useNavigate();

  const [cards, setCards] = useState<GameCard[]>(createGameCards);
  const [selectedCards, setSelectedCards] = useState<GameCard[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const totalPairs = cardPairs.length;
  const gameCompleted = matchedPairs === totalPairs;

  const progress = useMemo(() => {
    return Math.round((matchedPairs / totalPairs) * 100);
  }, [matchedPairs, totalPairs]);

  useEffect(() => {
    if (!gameStarted || gameCompleted) {
      return;
    }

    const timer = window.setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameStarted, gameCompleted]);

  const resetGame = () => {
    setCards(createGameCards());
    setSelectedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setSeconds(0);
    setIsChecking(false);
    setGameStarted(false);
  };

  const handleCardClick = (clickedCard: GameCard) => {
    if (
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      isChecking ||
      selectedCards.length >= 2
    ) {
      return;
    }

    setGameStarted(true);

    const flippedCard = {
      ...clickedCard,
      isFlipped: true,
    };

    setCards((currentCards) =>
      currentCards.map((card) =>
        card.uniqueId === clickedCard.uniqueId
          ? { ...card, isFlipped: true }
          : card
      )
    );

    if (selectedCards.length === 0) {
      setSelectedCards([flippedCard]);
      return;
    }

    const firstCard = selectedCards[0];
    const secondCard = flippedCard;

    setSelectedCards([firstCard, secondCard]);
    setMoves((currentMoves) => currentMoves + 1);
    setIsChecking(true);

    window.setTimeout(() => {
      if (firstCard.pairId === secondCard.pairId) {
        setCards((currentCards) =>
          currentCards.map((card) =>
            card.pairId === firstCard.pairId
              ? {
                  ...card,
                  isMatched: true,
                  isFlipped: true,
                }
              : card
          )
        );

        setMatchedPairs((currentPairs) => currentPairs + 1);
      } else {
        setCards((currentCards) =>
          currentCards.map((card) =>
            card.uniqueId === firstCard.uniqueId ||
            card.uniqueId === secondCard.uniqueId
              ? {
                  ...card,
                  isFlipped: false,
                }
              : card
          )
        );
      }

      setSelectedCards([]);
      setIsChecking(false);
    }, 800);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden px-5 py-6 font-nunito"
      style={{
        backgroundImage: "url('/images/backgrounds/memory-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[1px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
          <button
            type="button"
            onClick={() => navigate("/activities")}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-5 py-3 font-bold text-indigo-800 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-700/85 px-4 py-2 text-sm font-bold text-white shadow-md">
              <Sparkles className="w-4 h-4" />
              Flip, Match, and Protect!
            </div>

            <h1 className="font-fredoka mt-2 text-5xl font-extrabold tracking-tight text-yellow-300 drop-shadow-lg md:text-6xl">
              Immune
            </h1>

            <p className="font-fredoka text-3xl font-extrabold text-white drop-shadow md:text-4xl">
              Match
            </p>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-5 py-3 font-bold text-indigo-800 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            Restart
          </button>
        </div>

        <div className="mb-6 grid gap-4 rounded-[2rem] bg-white/95 p-4 shadow-2xl sm:grid-cols-3">
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-blue-50 px-4 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Footprints className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-500">Moves</p>
              <p className="text-3xl font-extrabold text-blue-600">{moves}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 rounded-2xl bg-green-50 px-4 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-500">Matches</p>

              <p className="text-3xl font-extrabold text-green-600">
                {matchedPairs}/{totalPairs}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 rounded-2xl bg-purple-50 px-4 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Clock3 className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-500">Time</p>

              <p className="text-3xl font-extrabold text-purple-600">
                {formatTime(seconds)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_270px]">
          <div className="rounded-[2rem] bg-white/90 p-5 shadow-2xl backdrop-blur">
            {gameCompleted && (
              <div className="mb-5 flex items-center gap-4 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 p-5 text-white shadow-lg">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                  <Trophy className="w-9 h-9" />
                </div>

                <div>
                  <h2 className="font-fredoka text-2xl font-extrabold">
                    Great Job!
                  </h2>

                  <p className="font-medium">
                    You completed Immune Match in {moves} moves and{" "}
                    {formatTime(seconds)}.
                  </p>
                </div>
              </div>
            )}

            <div className="mb-5">
              <div className="mb-2 flex justify-between text-sm font-bold text-gray-600">
                <span>Game Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {cards.map((card) => {
                const showFront = card.isFlipped || card.isMatched;

                return (
                  <button
                    type="button"
                    key={card.uniqueId}
                    onClick={() => handleCardClick(card)}
                    className={`group relative min-h-[145px] overflow-hidden rounded-2xl border-2 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      card.isMatched
                        ? "border-green-300 bg-green-50"
                        : showFront
                        ? "border-blue-200 bg-white"
                        : "border-blue-500 bg-gradient-to-br from-blue-600 to-indigo-700"
                    }`}
                  >
                    {showFront ? (
                      <div
                        className={`flex h-full flex-col items-center justify-center bg-gradient-to-br ${card.background} p-3`}
                      >
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.label}
                            className="mb-2 h-20 w-20 object-contain animate-float"
                          />
                        ) : (
                          <span className="mb-3 text-5xl">{card.emoji}</span>
                        )}

                        <p className="text-center text-sm font-extrabold text-slate-800">
                          {card.label}
                        </p>

                        {card.isMatched && (
                          <CheckCircle className="mt-2 h-5 w-5 text-green-600" />
                        )}
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-white">
                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/10 shadow-inner transition-transform group-hover:scale-110">
                          <Shield className="h-10 w-10 text-blue-100" />
                        </div>

                        <p className="text-sm font-bold text-blue-100">
                          Flip Card
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] bg-white/95 p-5 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <HelpCircle className="h-6 w-6" />
              </div>

              <h2 className="font-fredoka text-xl font-extrabold text-purple-700">
                How to Play
              </h2>
            </div>

            <div className="space-y-4">
              <Instruction
                number="1"
                title="Flip a card"
                description="Click any blue card to reveal the picture."
                color="bg-blue-500"
              />

              <Instruction
                number="2"
                title="Find its pair"
                description="Click another card and try to find the matching pair."
                color="bg-green-500"
              />

              <Instruction
                number="3"
                title="Match all cards"
                description="Complete all pairs using the lowest number of moves."
                color="bg-purple-500"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="font-extrabold text-yellow-800">Tip</p>

              <p className="mt-1 text-sm text-yellow-700">
                Remember the position of each card before it flips back.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Instruction({
  number,
  title,
  description,
  color,
}: {
  number: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white ${color}`}
      >
        {number}
      </div>

      <div>
        <p className="font-extrabold text-slate-800">{title}</p>

        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </div>
    </div>
  );
}