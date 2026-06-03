import { useNavigate } from "react-router";
import {
  ArrowRight,
  Brain,
  LayoutTemplate,
  Move,
  Play,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type GameItem = {
  title: string;
  subtitle: string;
  description: string;
  path: string;
  image: string;
  icon: LucideIcon;
  badge: string;
  difficulty: string;
  difficultyStyle: string;
  gradient: string;
  iconColor: string;
  buttonStyle: string;
  smallFeature: string;
};

const games: GameItem[] = [
  {
    title: "Drag & Drop Game",
    subtitle: "Match the Immunity Concepts",
    description:
      "Drag each immunity term and place it in the correct answer area.",
    path: "/activities/drag-drop",
    image: "/images/activities/drag-drop-thumbnail.png",
    icon: Move,
    badge: "Game 1",
    difficulty: "Easy",
    difficultyStyle: "bg-green-100 text-green-700",
    gradient: "from-blue-500 via-cyan-500 to-sky-400",
    iconColor: "text-blue-700",
    buttonStyle: "bg-blue-600 hover:bg-blue-700",
    smallFeature: "Drag and Match",
  },
  {
    title: "Immune Match",
    subtitle: "Flip, Match, and Protect!",
    description:
      "Flip the cards and find matching immune system pairs using your memory.",
    path: "/activities/memory-card",
    image: "/images/activities/immune-match-thumbnail.png",
    icon: Brain,
    badge: "Game 2",
    difficulty: "Memory",
    difficultyStyle: "bg-purple-100 text-purple-700",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    iconColor: "text-purple-700",
    buttonStyle: "bg-purple-600 hover:bg-purple-700",
    smallFeature: "Flip the Cards",
  },
  {
    title: "Defense Lab Mission",
    subtitle: "Label, Learn, and Protect!",
    description:
      "Identify the body's defense mechanisms and place each label on the correct diagram target.",
    path: "/activities/diagram-label",
    image: "/images/activities/defense-lab-thumbnail.png",
    icon: LayoutTemplate,
    badge: "Game 3",
    difficulty: "Challenge",
    difficultyStyle: "bg-orange-100 text-orange-700",
    gradient: "from-green-500 via-emerald-500 to-teal-400",
    iconColor: "text-green-700",
    buttonStyle: "bg-green-600 hover:bg-green-700",
    smallFeature: "Label the Diagram",
  },
];

export function InteractiveActivities() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen overflow-hidden px-6 py-10 font-nunito"
      style={{
        backgroundImage: "url('/images/backgrounds/activities-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>

      <div className="absolute left-8 top-28 hidden h-16 w-16 rounded-full bg-blue-300/40 blur-xl lg:block animate-pulse"></div>

      <div className="absolute bottom-24 right-10 hidden h-20 w-20 rounded-full bg-purple-300/40 blur-xl lg:block animate-pulse"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-4 py-2 shadow-md">
            <Sparkles className="h-4 w-4 text-blue-600" />

            <span className="text-sm font-bold text-blue-700">
              Learn Through Games
            </span>
          </div>

          <h1 className="font-fredoka text-4xl font-extrabold text-blue-950 drop-shadow-sm lg:text-5xl">
            Interactive Activities
          </h1>

          <p className="mx-auto mt-3 max-w-2xl rounded-full bg-white/85 px-5 py-3 font-semibold text-gray-700 shadow-sm">
            Choose a game, complete the challenge, and improve your immune
            system knowledge.
          </p>
        </header>

        <section className="grid gap-7 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard
              key={game.title}
              game={game}
              onPlay={() => navigate(game.path)}
            />
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-white bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
              <Trophy className="h-8 w-8" />
            </div>

            <div>
              <h2 className="font-fredoka text-2xl font-extrabold text-gray-900">
                Complete All Three Activities
              </h2>

              <p className="mt-1 text-gray-600">
                Finish each game to practice matching, memory skills, and body
                defense labeling.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:ml-auto">
              <MiniMission
                number="1"
                label="Match"
                style="bg-blue-100 text-blue-700"
              />

              <MiniMission
                number="2"
                label="Memory"
                style="bg-purple-100 text-purple-700"
              />

              <MiniMission
                number="3"
                label="Label"
                style="bg-green-100 text-green-700"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function GameCard({
  game,
  onPlay,
}: {
  game: GameItem;
  onPlay: () => void;
}) {
  const Icon = game.icon;

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white bg-white/95 text-left shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">
      <div
        className={`relative h-52 overflow-hidden bg-gradient-to-br ${game.gradient}`}
      >
        <img
          src={game.image}
          alt={`${game.title} thumbnail`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/20"></div>

        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-gray-700 shadow-md">
            {game.badge}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-extrabold shadow-md ${game.difficultyStyle}`}
          >
            {game.difficulty}
          </span>
        </div>

        <Sparkles className="absolute right-4 top-4 z-10 h-6 w-6 text-white animate-pulse drop-shadow-lg" />

        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${game.title}`}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/90 bg-white/95 text-blue-700 shadow-2xl transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-600 group-hover:text-white">
            <Play className="ml-1 h-8 w-8 fill-current" />
          </span>
        </button>
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
            <Zap className="h-3.5 w-3.5" />

            {game.smallFeature}
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Icon className={`h-5 w-5 ${game.iconColor}`} />
          </div>
        </div>

        <h2 className="font-fredoka text-2xl font-extrabold text-gray-900">
          {game.title}
        </h2>

        <p className="mt-1 font-bold text-blue-700">{game.subtitle}</p>

        <p className="mt-3 min-h-[72px] leading-relaxed text-gray-600">
          {game.description}
        </p>

        <button
          type="button"
          onClick={onPlay}
          className={`mt-5 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-white shadow-md transition-all duration-300 group-hover:shadow-lg ${game.buttonStyle}`}
        >
          <span className="font-extrabold">Play Now</span>

          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
        </button>
      </div>
    </article>
  );
}

function MiniMission({
  number,
  label,
  style,
}: {
  number: string;
  label: string;
  style: string;
}) {
  return (
    <div className={`rounded-2xl px-4 py-3 text-center ${style}`}>
      <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-sm font-extrabold">
        {number}
      </div>

      <p className="text-xs font-extrabold">{label}</p>
    </div>
  );
}