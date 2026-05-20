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

interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "audio" | "infographic";
  url: string;
  thumbnail: string;
}

const mediaItems: MediaItem[] = [
  {
    id: "v1",
    title: "Introduction to Immune System",
    description: "Watch animations that explain immune processes.",
    type: "video",
    url: "https://www.youtube.com/embed/z3M0vU3Dv8E",
    thumbnail: "https://img.youtube.com/vi/z3M0vU3Dv8E/hqdefault.jpg",
  },
  {
    id: "v2",
    title: "How Antibodies Work",
    description: "Learn about antibody structure and function.",
    type: "video",
    url: "https://www.youtube.com/embed/gJiSwo7d3OU",
    thumbnail: "https://img.youtube.com/vi/gJiSwo7d3OU/hqdefault.jpg",
  },
  {
    id: "v3",
    title: "White Blood Cells in Action",
    description: "See how white blood cells defend the body.",
    type: "video",
    url: "https://www.youtube.com/embed/lXfEK8G8CUI",
    thumbnail: "https://img.youtube.com/vi/lXfEK8G8CUI/hqdefault.jpg",
  },
  {
    id: "a1",
    title: "Immune System Overview",
    description: "Listen to audio explanations of immunity.",
    type: "audio",
    url: "https://www.youtube.com/embed/IHDiN9r3b-Q",
    thumbnail: "https://img.youtube.com/vi/IHDiN9r3b-Q/hqdefault.jpg",
  },
  {
    id: "a2",
    title: "Vaccination Explained",
    description: "Audio narration about how vaccines work.",
    type: "audio",
    url: "https://www.youtube.com/embed/y1B3VzqMpXs",
    thumbnail: "https://img.youtube.com/vi/y1B3VzqMpXs/hqdefault.jpg",
  },
  {
    id: "i1",
    title: "Immune System Components",
    description: "Visual guide to immune system parts.",
    type: "infographic",
    url: "https://www.youtube.com/embed/PSRJfaAYkW4",
    thumbnail: "https://img.youtube.com/vi/PSRJfaAYkW4/hqdefault.jpg",
  },
];

export function Multimedia() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const videos = mediaItems.filter((item) => item.type === "video");
  const audios = mediaItems.filter((item) => item.type === "audio");
  const infographics = mediaItems.filter(
    (item) => item.type === "infographic"
  );

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
    if (type === "audio") return "Listen Now";
    if (type === "infographic") return "View Now";
    return "Watch Now";
  };

  const getButtonColor = (type: MediaItem["type"]) => {
    if (type === "infographic") {
      return "bg-orange-600 hover:bg-orange-700";
    }

    return "bg-purple-600 hover:bg-purple-700";
  };

  const renderMediaCard = (item: MediaItem) => {
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
              alt={item.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                {getIcon(item.type)}
              </div>
            </div>

            <div className="absolute top-3 left-3">
              <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full capitalize">
                {item.type}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <CardTitle className="mb-2">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
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
          <h1 className="text-4xl font-bold mb-2">Multimedia Resources</h1>
          <p className="text-gray-600">
            Enhance your learning with videos, audio, and infographics.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Animation Videos</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(renderMediaCard)}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Audio Narration</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {audios.map(renderMediaCard)}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Infographics</h2>

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
              <DialogTitle>{selectedMedia?.title}</DialogTitle>

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
                  title={selectedMedia.title}
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