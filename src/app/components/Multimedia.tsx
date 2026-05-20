import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Play, Volume2, BarChart3, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

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
    thumbnail: "purple",
  },
  {
    id: "v2",
    title: "How Antibodies Work",
    description: "Learn about antibody structure and function.",
    type: "video",
    url: "https://www.youtube.com/embed/gJiSwo7d3OU",
    thumbnail: "blue",
  },
  {
    id: "v3",
    title: "White Blood Cells in Action",
    description: "See how white blood cells defend the body.",
    type: "video",
    url: "https://www.youtube.com/embed/lXfEK8G8CUI",
    thumbnail: "cyan",
  },
  {
    id: "a1",
    title: "Immune System Overview",
    description: "Listen to audio explanations of immunity.",
    type: "audio",
    url: "https://www.youtube.com/embed/IHDiN9r3b-Q",
    thumbnail: "purple",
  },
  {
    id: "a2",
    title: "Vaccination Explained",
    description: "Audio narration about how vaccines work.",
    type: "audio",
    url: "https://www.youtube.com/embed/y1B3VzqMpXs",
    thumbnail: "pink",
  },
  {
    id: "i1",
    title: "Immune System Components",
    description: "Visual guide to immune system parts.",
    type: "infographic",
    url: "https://www.youtube.com/embed/PSRJfaAYkW4",
    thumbnail: "orange",
  },
];

export function Multimedia() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      purple: "from-purple-600 to-blue-600",
      blue: "from-blue-500 to-cyan-500",
      cyan: "from-cyan-500 to-blue-500",
      pink: "from-purple-600 to-pink-600",
      orange: "from-orange-500 to-yellow-500",
    };
    return colors[color] || colors.purple;
  };

  const videos = mediaItems.filter((item) => item.type === "video");
  const audios = mediaItems.filter((item) => item.type === "audio");
  const infographics = mediaItems.filter((item) => item.type === "infographic");

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Multimedia Resources</h1>
          <p className="text-gray-600">Enhance your learning with videos, audio, and infographics.</p>
        </div>

        {/* Animation Videos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Animation Videos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((item) => (
              <Card
                key={item.id}
                className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                <CardContent className="p-0">
                  <div
                    className={`relative h-48 bg-gradient-to-br ${getColorClasses(
                      item.thumbnail
                    )} rounded-t-lg flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white rounded-full"></div>
                      <div className="absolute bottom-4 right-4 w-12 h-12 border-4 border-white rounded-full"></div>
                    </div>
                    <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-purple-600 ml-1" />
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <CardTitle className="mb-2">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Watch Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Audio Narration */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Audio Narration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {audios.map((item) => (
              <Card
                key={item.id}
                className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                <CardContent className="p-0">
                  <div
                    className={`relative h-48 bg-gradient-to-br ${getColorClasses(
                      item.thumbnail
                    )} rounded-t-lg flex items-center justify-center`}
                  >
                    <div className="absolute inset-0">
                      <div className="absolute inset-x-0 top-1/2 h-16 opacity-20">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute bottom-0 w-6 bg-white"
                            style={{
                              left: `${i * 12 + 10}%`,
                              height: `${Math.random() * 80 + 20}%`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Volume2 className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <CardTitle className="mb-2">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Listen Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Infographics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Infographics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {infographics.map((item) => (
              <Card
                key={item.id}
                className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                <CardContent className="p-0">
                  <div
                    className={`relative h-48 bg-gradient-to-br ${getColorClasses(
                      item.thumbnail
                    )} rounded-t-lg flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 opacity-20">
                      <BarChart3 className="absolute top-6 left-6 w-12 h-12 text-white" />
                    </div>
                    <div className="relative grid grid-cols-2 gap-2">
                      <div className="w-12 h-16 bg-white rounded"></div>
                      <div className="w-12 h-16 bg-white rounded"></div>
                      <div className="w-12 h-16 bg-white rounded"></div>
                      <div className="w-12 h-16 bg-white rounded"></div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <CardTitle className="mb-2">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      View Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Media Player Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
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
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
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
