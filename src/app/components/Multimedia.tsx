import { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Play, Volume2, BarChart3, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useLanguage } from "../context/LanguageContext";

interface MediaItem {
  id: string;
  type: "video" | "audio" | "infographic";
  url: string;
  thumbnail: string;
}

const mediaItems: MediaItem[] = [
  {
    id: "v1",
    type: "video",
    url: "https://www.youtube.com/embed/z3M0vU3Dv8E",
    thumbnail: "https://img.youtube.com/vi/z3M0vU3Dv8E/hqdefault.jpg",
  },
  {
    id: "v2",
    type: "video",
    url: "https://www.youtube.com/embed/gJiSwo7d3OU",
    thumbnail: "https://img.youtube.com/vi/gJiSwo7d3OU/hqdefault.jpg",
  },
  {
    id: "v3",
    type: "video",
    url: "https://www.youtube.com/embed/lXfEK8G8CUI",
    thumbnail: "https://img.youtube.com/vi/lXfEK8G8CUI/hqdefault.jpg",
  },
  {
    id: "a1",
    type: "audio",
    url: "https://www.youtube.com/embed/IHDiN9r3b-Q",
    thumbnail: "https://img.youtube.com/vi/IHDiN9r3b-Q/hqdefault.jpg",
  },
  {
    id: "a2",
    type: "audio",
    url: "https://www.youtube.com/embed/y1B3VzqMpXs",
    thumbnail: "https://img.youtube.com/vi/y1B3VzqMpXs/hqdefault.jpg",
  },
  {
    id: "i1",
    type: "infographic",
    url: "https://www.youtube.com/embed/PSRJfaAYkW4",
    thumbnail: "https://img.youtube.com/vi/PSRJfaAYkW4/hqdefault.jpg",
  },
];

export function Multimedia() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const { language, t } = useLanguage();

  const text = {
    en: {
      pageTitle: "Multimedia Resources",
      pageSubtitle:
        "Enhance your learning with videos, audio, and infographics.",
      animationVideos: "Animation Videos",
      audioNarration: "Audio Narration",
      infographics: "Infographics",
      watchNow: "Watch Now",
      listenNow: "Listen Now",
      viewNow: "View Now",
      video: "video",
      audio: "audio",
      infographic: "infographic",
      media: {
        v1: {
          title: "Introduction to Immune System",
          description: "Watch animations that explain immune processes.",
        },
        v2: {
          title: "How Antibodies Work",
          description: "Learn about antibody structure and function.",
        },
        v3: {
          title: "White Blood Cells in Action",
          description: "See how white blood cells defend the body.",
        },
        a1: {
          title: "Immune System Overview",
          description: "Listen to audio explanations of immunity.",
        },
        a2: {
          title: "Vaccination Explained",
          description: "Audio narration about how vaccines work.",
        },
        i1: {
          title: "Immune System Components",
          description: "Visual guide to immune system parts.",
        },
      },
    },

    ms: {
      pageTitle: "Sumber Multimedia",
      pageSubtitle:
        "Tingkatkan pembelajaran anda dengan video, audio, dan infografik.",
      animationVideos: "Video Animasi",
      audioNarration: "Narasi Audio",
      infographics: "Infografik",
      watchNow: "Tonton Sekarang",
      listenNow: "Dengar Sekarang",
      viewNow: "Lihat Sekarang",
      video: "video",
      audio: "audio",
      infographic: "infografik",
      media: {
        v1: {
          title: "Pengenalan kepada Sistem Imun",
          description: "Tonton animasi yang menerangkan proses imun.",
        },
        v2: {
          title: "Bagaimana Antibodi Berfungsi",
          description: "Pelajari struktur dan fungsi antibodi.",
        },
        v3: {
          title: "Sel Darah Putih Bertindak",
          description: "Lihat bagaimana sel darah putih mempertahankan badan.",
        },
        a1: {
          title: "Gambaran Sistem Imun",
          description: "Dengar penerangan audio tentang imuniti.",
        },
        a2: {
          title: "Vaksinasi Diterangkan",
          description: "Narasi audio tentang bagaimana vaksin berfungsi.",
        },
        i1: {
          title: "Komponen Sistem Imun",
          description: "Panduan visual kepada bahagian sistem imun.",
        },
      },
    },

    zh: {
      pageTitle: "多媒体资源",
      pageSubtitle: "通过视频、音频和信息图提升你的学习。",
      animationVideos: "动画视频",
      audioNarration: "音频讲解",
      infographics: "信息图",
      watchNow: "立即观看",
      listenNow: "立即收听",
      viewNow: "立即查看",
      video: "视频",
      audio: "音频",
      infographic: "信息图",
      media: {
        v1: {
          title: "免疫系统简介",
          description: "观看解释免疫过程的动画。",
        },
        v2: {
          title: "抗体如何工作",
          description: "学习抗体的结构和功能。",
        },
        v3: {
          title: "白细胞的作用",
          description: "了解白细胞如何保护身体。",
        },
        a1: {
          title: "免疫系统概述",
          description: "收听有关免疫的音频讲解。",
        },
        a2: {
          title: "疫苗接种解释",
          description: "关于疫苗如何工作的音频讲解。",
        },
        i1: {
          title: "免疫系统组成",
          description: "免疫系统各部分的视觉指南。",
        },
      },
    },

    ar: {
      pageTitle: "موارد الوسائط المتعددة",
      pageSubtitle:
        "عزز تعلمك باستخدام الفيديو والصوت والرسوم المعلوماتية.",
      animationVideos: "فيديوهات الرسوم المتحركة",
      audioNarration: "السرد الصوتي",
      infographics: "الرسوم المعلوماتية",
      watchNow: "شاهد الآن",
      listenNow: "استمع الآن",
      viewNow: "اعرض الآن",
      video: "فيديو",
      audio: "صوت",
      infographic: "رسم معلوماتي",
      media: {
        v1: {
          title: "مقدمة إلى الجهاز المناعي",
          description: "شاهد رسومًا متحركة تشرح العمليات المناعية.",
        },
        v2: {
          title: "كيف تعمل الأجسام المضادة",
          description: "تعلم عن تركيب ووظيفة الأجسام المضادة.",
        },
        v3: {
          title: "خلايا الدم البيضاء أثناء العمل",
          description: "شاهد كيف تدافع خلايا الدم البيضاء عن الجسم.",
        },
        a1: {
          title: "نظرة عامة على الجهاز المناعي",
          description: "استمع إلى شرح صوتي حول المناعة.",
        },
        a2: {
          title: "شرح التطعيم",
          description: "سرد صوتي حول كيفية عمل اللقاحات.",
        },
        i1: {
          title: "مكونات الجهاز المناعي",
          description: "دليل بصري لأجزاء الجهاز المناعي.",
        },
      },
    },
  };

  const currentText = text[language];

  const videos = mediaItems.filter((item) => item.type === "video");
  const audios = mediaItems.filter((item) => item.type === "audio");
  const infographics = mediaItems.filter(
    (item) => item.type === "infographic"
  );

  const getMediaText = (id: string) => {
    return currentText.media[id as keyof typeof currentText.media];
  };

  const getIcon = (type: MediaItem["type"]) => {
    if (type === "audio") {
      return <Volume2 className="w-8 h-8 text-purple-600" />;
    }

    if (type === "infographic") {
      return <BarChart3 className="w-8 h-8 text-orange-600" />;
    }

    return <Play className="w-8 h-8 text-purple-600 ml-1" />;
  };

  const getButtonText = (type: MediaItem["type"]) => {
    if (type === "audio") return currentText.listenNow;
    if (type === "infographic") return currentText.viewNow;
    return currentText.watchNow;
  };

  const getTypeLabel = (type: MediaItem["type"]) => {
    if (type === "audio") return currentText.audio;
    if (type === "infographic") return currentText.infographic;
    return currentText.video;
  };

  const getButtonColor = (type: MediaItem["type"]) => {
    if (type === "infographic") {
      return "bg-orange-600 hover:bg-orange-700";
    }

    return "bg-purple-600 hover:bg-purple-700";
  };

  const renderMediaCard = (item: MediaItem) => {
    const mediaText = getMediaText(item.id);

    return (
      <Card
        key={item.id}
        className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
        onClick={() => setSelectedMedia(item)}
      >
        <CardContent className="p-0">
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            <img
              src={item.thumbnail}
              alt={mediaText.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                {getIcon(item.type)}
              </div>
            </div>

            <div className="absolute top-3 left-3">
              <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full capitalize">
                {getTypeLabel(item.type)}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <CardTitle className="mb-2">{mediaText.title}</CardTitle>
              <CardDescription>{mediaText.description}</CardDescription>
            </div>

            <Button
              className={`w-full ${getButtonColor(item.type)} text-white`}
            >
              {getButtonText(item.type)}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {t.multimediaResources || currentText.pageTitle}
          </h1>
          <p className="text-gray-600">{currentText.pageSubtitle}</p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            {currentText.animationVideos}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(renderMediaCard)}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            {currentText.audioNarration}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {audios.map(renderMediaCard)}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            {currentText.infographics}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {infographics.map(renderMediaCard)}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {selectedMedia ? getMediaText(selectedMedia.id).title : ""}
              </DialogTitle>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedMedia(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-4">
            {selectedMedia && (
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={selectedMedia.url}
                  title={getMediaText(selectedMedia.id).title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}