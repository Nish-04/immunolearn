import { useState } from "react";
import {
  Shield,
  Bug,
  Syringe,
  Brain,
  Sparkles,
  Droplets,
  Activity,
  Target,
  Zap,
  HeartPulse,
  Eye,
  CheckCircle,
  Hand,
  LockKeyhole,
  ScanSearch,
} from "lucide-react";

interface InteractiveLectureDiagramProps {
  topicId: string;
}

type InfoItem = {
  title: string;
  subtitle: string;
  detail: string;
  icon: any;
  color: string;
  bg: string;
};

export function InteractiveLectureDiagram({
  topicId,
}: InteractiveLectureDiagramProps) {
  if (topicId === "pathogens") {
    return <PathogensVirusDiagram />;
  }

  if (topicId === "types") {
    return <TypesOfImmunityGame />;
  }

  if (topicId === "active" || topicId === "passive") {
    return <ActivePassiveGame />;
  }

  if (topicId === "antigens" || topicId === "antibodies") {
    return <AntigenAntibodyGame />;
  }

  if (topicId === "white-blood-cells") {
    return <WhiteBloodCellsGame />;
  }

  if (topicId === "defense") {
    return <BodyDefenseGame />;
  }

  if (topicId === "vaccination") {
    return <VaccinationGame />;
  }

  return <ImmuneSystemIntroGame />;
}

function TapHint() {
  return (
    <div className="inline-flex items-center gap-2 bg-white/90 border border-blue-200 rounded-full px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
      <Hand className="w-4 h-4" />
      Tap / Click the cards to explore
    </div>
  );
}

function InfoPanel({ item }: { item: InfoItem }) {
  const Icon = item.icon;

  return (
    <div className={`rounded-3xl p-6 border shadow-lg ${item.bg}`}>
      <div className="flex flex-col md:flex-row items-center gap-5">
        <div
          className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-md ${item.color}`}
        >
          <Icon className="w-12 h-12" />
        </div>

        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-gray-500 mb-1">
            Selected Item
          </p>

          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {item.title}
          </h3>

          <p className="text-gray-700 font-medium mb-2">{item.subtitle}</p>

          <p className="text-gray-600">{item.detail}</p>
        </div>
      </div>
    </div>
  );
}

function ClickableCard({
  item,
  selected,
  onClick,
}: {
  item: InfoItem;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-3xl p-4 border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        selected
          ? "bg-blue-600 border-blue-600 text-white shadow-xl scale-[1.02]"
          : "bg-white border-gray-100 hover:border-blue-300 text-gray-800"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            selected ? "bg-white/20 text-white" : item.color
          }`}
        >
          <Icon className="w-8 h-8" />
        </div>

        <div>
          <h4 className="font-bold text-lg">{item.title}</h4>

          <p
            className={`text-sm ${
              selected ? "text-blue-50" : "text-gray-500"
            }`}
          >
            {item.subtitle}
          </p>
        </div>
      </div>
    </button>
  );
}

function ImmuneSystemIntroGame() {
  const items: InfoItem[] = [
    {
      title: "Immune Shield",
      subtitle: "Protects the body",
      detail:
        "The immune system works like a shield that protects your body from harmful pathogens.",
      icon: Shield,
      color: "bg-blue-100 text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      title: "Pathogen Detector",
      subtitle: "Finds harmful invaders",
      detail:
        "Immune cells can detect bacteria, viruses, fungi, and parasites that may cause disease.",
      icon: ScanSearch,
      color: "bg-purple-100 text-purple-600",
      bg: "bg-purple-50 border-purple-100",
    },
    {
      title: "Attack Team",
      subtitle: "Destroys threats",
      detail:
        "White blood cells and antibodies work together to destroy or neutralize harmful invaders.",
      icon: Zap,
      color: "bg-yellow-100 text-yellow-600",
      bg: "bg-yellow-50 border-yellow-100",
    },
  ];

  const [selected, setSelected] = useState(items[0]);

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-blue-100 shadow-xl space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">
            How Immunity Protects You
          </h3>

          <p className="text-gray-600">
            Click each part to understand how the immune system works.
          </p>
        </div>

        <TapHint />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <ClickableCard
            key={item.title}
            item={item}
            selected={selected.title === item.title}
            onClick={() => setSelected(item)}
          />
        ))}
      </div>

      <InfoPanel item={selected} />
    </div>
  );
}

function PathogensVirusDiagram() {
  const viruses = [
    {
      name: "Coronavirus",
      type: "Enveloped spherical virus",
      image: "/images/lecture/virus-coronavirus.png",
      light: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      description:
        "Coronavirus has crown-like spike proteins around its surface and can infect respiratory cells.",
    },
    {
      name: "Influenza Virus",
      type: "Enveloped virus",
      image: "/images/lecture/virus-influenza.png",
      light: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      description:
        "Influenza virus causes flu and spreads through droplets from coughs or sneezes.",
    },
    {
      name: "Adenovirus",
      type: "Icosahedral virus",
      image: "/images/lecture/virus-adenovirus.png",
      light: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      description:
        "Adenovirus has a polygon-like shape and can cause colds, sore throat, fever, and eye infections.",
    },
    {
      name: "Bacteriophage",
      type: "Complex virus",
      image: "/images/lecture/virus-bacteriophage.png",
      light: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      description:
        "Bacteriophage is a virus that infects bacteria using its head, tail, and tail fibers.",
    },
  ];

  const [selectedVirus, setSelectedVirus] = useState(viruses[0]);

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-red-100 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">Virus Explorer</h3>

          <p className="text-gray-600">
            Click each animated virus to learn its type and description.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-full px-4 py-2 text-sm font-semibold text-red-700">
          Animated + Clickable
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {viruses.map((virus, index) => (
          <button
            key={virus.name}
            type="button"
            onClick={() => setSelectedVirus(virus)}
            className={`rounded-3xl p-4 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
              selectedVirus.name === virus.name
                ? `${virus.light} ${virus.border} scale-[1.03] shadow-xl`
                : "bg-white border-gray-100 hover:border-red-200"
            }`}
          >
            <div className="h-44 flex items-center justify-center overflow-hidden">
              <img
                src={virus.image}
                alt={virus.name}
                className={`max-h-36 object-contain transition-all duration-300 ${
                  selectedVirus.name === virus.name
                    ? "scale-110 animate-float"
                    : index % 2 === 0
                    ? "animate-float"
                    : "animate-float-slow"
                }`}
              />
            </div>

            <h4 className={`font-bold text-lg mt-2 ${virus.text}`}>
              {virus.name}
            </h4>

            <p className="text-xs text-gray-500">{virus.type}</p>
          </button>
        ))}
      </div>

      <div
        className={`rounded-3xl p-6 border shadow-inner ${selectedVirus.light} ${selectedVirus.border}`}
      >
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center justify-center">
            <div className="bg-white/80 rounded-3xl p-6 shadow-md">
              <img
                src={selectedVirus.image}
                alt={selectedVirus.name}
                className="w-64 max-w-full object-contain animate-float"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">
              Selected Virus
            </p>

            <h4 className={`text-3xl font-bold mb-2 ${selectedVirus.text}`}>
              {selectedVirus.name}
            </h4>

            <p className="font-semibold text-gray-700 mb-3">
              {selectedVirus.type}
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              {selectedVirus.description}
            </p>

            <div className="bg-white/80 rounded-2xl p-4 border">
              <p className="text-sm text-gray-600">
                Viruses are very small infectious agents. They need host cells
                to reproduce and spread inside the body.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypesOfImmunityGame() {
  const items: InfoItem[] = [
    {
      title: "Macrophage",
      subtitle: "Innate immunity",
      detail:
        "Macrophages act like cleaners. They swallow pathogens and cell debris to protect the body.",
      icon: Shield,
      color: "bg-purple-100 text-purple-600",
      bg: "bg-purple-50 border-purple-100",
    },
    {
      title: "Natural Killer Cell",
      subtitle: "Innate immunity",
      detail:
        "Natural killer cells attack virus-infected cells and abnormal cells quickly.",
      icon: Zap,
      color: "bg-red-100 text-red-600",
      bg: "bg-red-50 border-red-100",
    },
    {
      title: "B Cell",
      subtitle: "Adaptive immunity",
      detail:
        "B cells produce antibodies that target specific antigens on pathogens.",
      icon: Sparkles,
      color: "bg-green-100 text-green-600",
      bg: "bg-green-50 border-green-100",
    },
    {
      title: "T Cell",
      subtitle: "Adaptive immunity",
      detail:
        "T cells help coordinate the immune response and destroy infected cells.",
      icon: Brain,
      color: "bg-blue-100 text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
  ];

  const [selected, setSelected] = useState(items[0]);

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-blue-100 shadow-xl space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">
            Innate vs Adaptive Immunity
          </h3>

          <p className="text-gray-600">
            Click the immune cells to compare their roles.
          </p>
        </div>

        <TapHint />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
          <h4 className="text-xl font-bold text-blue-700 mb-1">
            Innate Immune System
          </h4>

          <p className="text-sm text-gray-600 mb-4">
            Fast, general, first line of defense.
          </p>

          <div className="space-y-3">
            {items.slice(0, 2).map((item) => (
              <ClickableCard
                key={item.title}
                item={item}
                selected={selected.title === item.title}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-3xl p-5">
          <h4 className="text-xl font-bold text-green-700 mb-1">
            Adaptive Immune System
          </h4>

          <p className="text-sm text-gray-600 mb-4">
            Specific, long-lasting, creates memory.
          </p>

          <div className="space-y-3">
            {items.slice(2, 4).map((item) => (
              <ClickableCard
                key={item.title}
                item={item}
                selected={selected.title === item.title}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>
        </div>
      </div>

      <InfoPanel item={selected} />
    </div>
  );
}

function ActivePassiveGame() {
  const active: InfoItem = {
    title: "Active Immunity",
    subtitle: "Body produces its own antibodies",
    detail:
      "Protection develops slower, but it usually lasts longer because the body creates memory cells.",
    icon: Sparkles,
    color: "bg-green-100 text-green-600",
    bg: "bg-green-50 border-green-100",
  };

  const passive: InfoItem = {
    title: "Passive Immunity",
    subtitle: "Body receives ready-made antibodies",
    detail:
      "Protection is immediate, but temporary because the body does not create its own immune memory.",
    icon: Droplets,
    color: "bg-blue-100 text-blue-600",
    bg: "bg-blue-50 border-blue-100",
  };

  const [selected, setSelected] = useState(active);

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-blue-100 shadow-xl space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">
            Active vs Passive Immunity
          </h3>

          <p className="text-gray-600">
            Choose one type to see the difference clearly.
          </p>
        </div>

        <TapHint />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ClickableCard
          item={active}
          selected={selected.title === active.title}
          onClick={() => setSelected(active)}
        />

        <ClickableCard
          item={passive}
          selected={selected.title === passive.title}
          onClick={() => setSelected(passive)}
        />
      </div>

      <InfoPanel item={selected} />

      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-white border rounded-2xl p-4">
          <p className="font-bold text-gray-900">Speed</p>

          <p className="text-sm text-gray-600">
            {selected.title === "Active Immunity"
              ? "Slower to develop"
              : "Immediate protection"}
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-4">
          <p className="font-bold text-gray-900">Duration</p>

          <p className="text-sm text-gray-600">
            {selected.title === "Active Immunity"
              ? "Long-lasting"
              : "Temporary"}
          </p>
        </div>

        <div className="bg-white border rounded-2xl p-4">
          <p className="font-bold text-gray-900">Example</p>

          <p className="text-sm text-gray-600">
            {selected.title === "Active Immunity"
              ? "Vaccination"
              : "Mother to baby"}
          </p>
        </div>
      </div>
    </div>
  );
}

function AntigenAntibodyGame() {
  const steps: InfoItem[] = [
    {
      title: "Antigen Appears",
      subtitle: "Pathogen enters body",
      detail:
        "The pathogen has antigens on its surface. These antigens act like ID tags.",
      icon: Bug,
      color: "bg-red-100 text-red-600",
      bg: "bg-red-50 border-red-100",
    },
    {
      title: "Antibody Matches",
      subtitle: "Lock and key",
      detail:
        "The antibody recognizes and binds to the antigen that matches its shape.",
      icon: LockKeyhole,
      color: "bg-blue-100 text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      title: "Pathogen Marked",
      subtitle: "Immune response starts",
      detail:
        "The pathogen is neutralized or marked so other immune cells can destroy it.",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      bg: "bg-green-50 border-green-100",
    },
  ];

  const [index, setIndex] = useState(0);
  const selected = steps[index];

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-blue-100 shadow-xl space-y-5">
      <div>
        <h3 className="text-3xl font-bold text-gray-900">
          Antigen and Antibody Interaction
        </h3>

        <p className="text-gray-600">
          Click the steps to see how antibodies fight pathogens.
        </p>
      </div>

      <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="relative w-44 h-44 bg-purple-400 rounded-full shadow-xl flex items-center justify-center">
          <Bug className="w-20 h-20 text-purple-900" />

          <div className="absolute -top-4 left-16 w-8 h-8 bg-red-400 rounded-xl animate-pulse"></div>

          <div className="absolute top-16 -left-4 w-7 h-7 bg-red-400 rounded-xl animate-pulse"></div>

          <div
            className={`absolute top-8 -right-20 w-20 h-20 transition-all duration-500 ${
              index >= 1
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-20"
            }`}
          >
            <div className="absolute left-9 top-8 w-2 h-12 bg-blue-500 rounded-full"></div>

            <div className="absolute left-5 top-1 w-2 h-14 bg-blue-500 rounded-full -rotate-45"></div>

            <div className="absolute right-5 top-1 w-2 h-14 bg-blue-500 rounded-full rotate-45"></div>
          </div>

          {index >= 2 && (
            <div className="absolute inset-[-25px] border-4 border-green-400 rounded-full animate-ping"></div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {steps.map((item, stepIndex) => (
          <ClickableCard
            key={item.title}
            item={item}
            selected={index === stepIndex}
            onClick={() => setIndex(stepIndex)}
          />
        ))}
      </div>

      <InfoPanel item={selected} />
    </div>
  );
}

function WhiteBloodCellsGame() {
  const cells = [
    {
      title: "Macrophage",
      subtitle: "The Eater",
      detail:
        "Macrophages swallow and digest bacteria, damaged cells, and unwanted particles. This process is called phagocytosis.",
      image: "/images/cells/cell-macrophage.png",
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      badge: "bg-purple-100 text-purple-700",
      fact: "Macrophages act like the cleaners of your immune system.",
    },
    {
      title: "Neutrophil",
      subtitle: "First Responder",
      detail:
        "Neutrophils quickly travel to the infection site. They attack bacteria and help stop an infection before it spreads.",
      image: "/images/cells/cell-neutrophil.png",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      fact: "Neutrophils are usually among the first immune cells to arrive.",
    },
    {
      title: "Lymphocyte",
      subtitle: "Smart Fighter",
      detail:
        "Lymphocytes include B cells and T cells. They recognize specific pathogens and help the body remember past infections.",
      image: "/images/cells/cell-lymphocyte.png",
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      text: "text-cyan-700",
      badge: "bg-cyan-100 text-cyan-700",
      fact: "Some lymphocytes create antibodies and immune memory.",
    },
    {
      title: "Monocyte",
      subtitle: "The Transformer",
      detail:
        "Monocytes travel through the blood. When they enter body tissues, they can develop into macrophages or dendritic cells.",
      image: "/images/cells/cell-monocyte.png",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
      badge: "bg-indigo-100 text-indigo-700",
      fact: "Monocytes can transform into other immune cells when needed.",
    },
    {
      title: "Eosinophil",
      subtitle: "Parasite Fighter",
      detail:
        "Eosinophils help fight parasites and are also involved in allergic reactions. They contain many granules inside the cell.",
      image: "/images/cells/cell-eosinophil.png",
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      badge: "bg-orange-100 text-orange-700",
      fact: "Eosinophils are easy to recognize because they contain many granules.",
    },
  ];

  const [selectedCell, setSelectedCell] = useState(cells[0]);

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-blue-100 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">
            White Blood Cell Explorer
          </h3>

          <p className="text-gray-600">
            Click each animated cell to learn its role in protecting your body.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
          <Hand className="w-4 h-4" />
          Click a cell to explore
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cells.map((cell, index) => (
          <button
            type="button"
            key={cell.title}
            onClick={() => setSelectedCell(cell)}
            className={`rounded-3xl p-4 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
              selectedCell.title === cell.title
                ? `${cell.bg} ${cell.border} scale-[1.04] shadow-xl`
                : "bg-white border-gray-100 hover:border-blue-300"
            }`}
          >
            <div className="h-36 flex items-center justify-center overflow-hidden">
              <img
                src={cell.image}
                alt={cell.title}
                className={`max-h-28 object-contain transition-all duration-300 ${
                  selectedCell.title === cell.title
                    ? "scale-110 animate-float"
                    : index % 2 === 0
                    ? "animate-float"
                    : "animate-float-slow"
                }`}
              />
            </div>

            <p className={`font-bold text-lg mt-2 ${cell.text}`}>
              {cell.title}
            </p>

            <p className="text-xs text-gray-500">{cell.subtitle}</p>
          </button>
        ))}
      </div>

      <div
        className={`rounded-3xl p-6 border shadow-inner ${selectedCell.bg} ${selectedCell.border}`}
      >
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center justify-center">
            <div className="bg-white/90 rounded-3xl p-6 shadow-md">
              <img
                src={selectedCell.image}
                alt={selectedCell.title}
                className="w-72 max-w-full object-contain animate-float"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">
              Selected White Blood Cell
            </p>

            <h4 className={`text-3xl font-bold mb-2 ${selectedCell.text}`}>
              {selectedCell.title}
            </h4>

            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-semibold mb-4 ${selectedCell.badge}`}
            >
              {selectedCell.subtitle}
            </span>

            <p className="text-gray-700 leading-relaxed mb-4">
              {selectedCell.detail}
            </p>

            <div className="bg-white/90 rounded-2xl p-4 border border-white shadow-sm">
              <p className="text-sm font-bold text-gray-800 mb-1">
                Did You Know?
              </p>

              <p className="text-sm text-gray-600">{selectedCell.fact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BodyDefenseGame() {
  const defenses: InfoItem[] = [
    {
      title: "Skin",
      subtitle: "Physical barrier",
      detail:
        "Skin acts like a strong wall that blocks many germs from entering the body.",
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
      bg: "bg-orange-50 border-orange-100",
    },
    {
      title: "Mucus",
      subtitle: "Sticky trap",
      detail:
        "Mucus traps germs so they cannot easily move deeper into the body.",
      icon: Droplets,
      color: "bg-green-100 text-green-600",
      bg: "bg-green-50 border-green-100",
    },
    {
      title: "Tears",
      subtitle: "Wash and kill",
      detail:
        "Tears wash away germs and contain enzymes that can kill bacteria.",
      icon: Eye,
      color: "bg-blue-100 text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      title: "Stomach Acid",
      subtitle: "Chemical defense",
      detail:
        "Strong stomach acid kills many microbes that enter with food.",
      icon: HeartPulse,
      color: "bg-red-100 text-red-600",
      bg: "bg-red-50 border-red-100",
    },
    {
      title: "Inflammation",
      subtitle: "Alarm signal",
      detail:
        "Inflammation causes redness, heat, and swelling to help the body heal.",
      icon: Sparkles,
      color: "bg-purple-100 text-purple-600",
      bg: "bg-purple-50 border-purple-100",
    },
    {
      title: "White Blood Cells",
      subtitle: "Immune fighters",
      detail:
        "White blood cells attack germs and help protect the body from infection.",
      icon: Activity,
      color: "bg-cyan-100 text-cyan-600",
      bg: "bg-cyan-50 border-cyan-100",
    },
  ];

  const [selected, setSelected] = useState(defenses[0]);

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-blue-100 shadow-xl space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">
            Body Defense Mechanisms
          </h3>

          <p className="text-gray-600">
            Choose a defense to see how it protects the body.
          </p>
        </div>

        <TapHint />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {defenses.map((item) => (
          <ClickableCard
            key={item.title}
            item={item}
            selected={selected.title === item.title}
            onClick={() => setSelected(item)}
          />
        ))}
      </div>

      <InfoPanel item={selected} />
    </div>
  );
}

function VaccinationGame() {
  const steps: InfoItem[] = [
    {
      title: "Vaccine Enters Body",
      subtitle: "Step 1",
      detail:
        "A vaccine introduces a safe antigen so the immune system can learn.",
      icon: Syringe,
      color: "bg-blue-100 text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      title: "Immune System Recognizes Antigen",
      subtitle: "Step 2",
      detail:
        "Immune cells identify the antigen and understand that it is foreign.",
      icon: ScanSearch,
      color: "bg-green-100 text-green-600",
      bg: "bg-green-50 border-green-100",
    },
    {
      title: "Body Produces Antibodies",
      subtitle: "Step 3",
      detail:
        "The body creates antibodies and memory cells to remember the antigen.",
      icon: Sparkles,
      color: "bg-yellow-100 text-yellow-600",
      bg: "bg-yellow-50 border-yellow-100",
    },
    {
      title: "Future Pathogen Defeated Quickly",
      subtitle: "Step 4",
      detail:
        "If the real pathogen appears later, memory cells help the body respond faster.",
      icon: Shield,
      color: "bg-purple-100 text-purple-600",
      bg: "bg-purple-50 border-purple-100",
    },
  ];

  const [step, setStep] = useState(0);

  const selected = steps[step];

  const Icon = selected.icon;

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-blue-100 shadow-xl space-y-5">
      <div>
        <h3 className="text-3xl font-bold text-gray-900">
          How Vaccination Works
        </h3>

        <p className="text-gray-600">
          Use the controls to move through the vaccination process.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-[2rem] p-8 text-center border">
        <div
          className={`w-32 h-32 rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg ${selected.color}`}
        >
          <Icon className="w-16 h-16" />
        </div>

        <p className="text-sm font-bold text-blue-600 mb-2">
          {selected.subtitle} of 4
        </p>

        <h4 className="text-3xl font-bold text-gray-900 mb-3">
          {selected.title}
        </h4>

        <p className="text-gray-700 max-w-xl mx-auto">{selected.detail}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {steps.map((item, index) => (
          <button
            type="button"
            key={item.title}
            onClick={() => setStep(index)}
            className={`h-3 rounded-full transition-all ${
              step === index ? "bg-blue-600" : "bg-gray-200 hover:bg-blue-300"
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={previousStep}
          disabled={step === 0}
          className="px-5 py-3 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={nextStep}
          disabled={step === steps.length - 1}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}