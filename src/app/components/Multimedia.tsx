import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Play,
  Sparkles,
  Video,
  X,
} from "lucide-react";

type VideoItem = {
  id: number;
  title: string;
  description: string;
  sourceLabel: string;
  youtubeUrl: string;
};

const videos: VideoItem[] = [
  {
    id: 1,
    title: "How Your Immune System Works",
    description:
      "Learn how cells, tissues, and organs work together to protect the body from infections.",
    sourceLabel: "Nemours KidsHealth",
    youtubeUrl: "https://www.youtube.com/watch?v=24IYt5Z3eC4",
  },
  {
    id: 2,
    title: "Immune Response to Bacteria",
    description:
      "Watch how the body naturally responds to invading bacteria and destroys harmful microorganisms.",
    sourceLabel: "NIAID",
    youtubeUrl: "https://www.youtube.com/watch?v=skPtWocTKdU",
  },
  {
    id: 3,
    title: "How Do Vaccines Work?",
    description:
      "Understand how vaccines help the immune system produce antibodies to fight a specific disease.",
    sourceLabel: "OxfordSparks and Oxford Vaccine Group",
    youtubeUrl: "https://www.youtube.com/watch?v=-5jfcu8JHmY",
  },
];

function getYouTubeVideoId(youtubeUrl: string) {
  try {
    const url = new URL(youtubeUrl);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.includes("/shorts/")) {
        return url.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      }

      if (url.pathname.includes("/embed/")) {
        return url.pathname.split("/embed/")[1]?.split("/")[0] || "";
      }

      return url.searchParams.get("v") || "";
    }

    return "";
  } catch {
    return "";
  }
}

function getYouTubeThumbnail(youtubeUrl: string) {
  const videoId = getYouTubeVideoId(youtubeUrl);

  if (!videoId) {
    return "/images/homepageB.png";
  }

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function Multimedia() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  return (
    <div
      className="relative min-h-screen overflow-hidden px-6 py-10 font-nunito"
      style={{
        backgroundImage: "url('/images/backgrounds/multimedia-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[2px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/95 px-4 py-2 shadow-md">
            <Sparkles className="h-4 w-4 text-blue-600" />

            <span className="text-sm font-bold text-blue-700">
              Watch and Learn
            </span>
          </div>

          <h1 className="font-fredoka text-4xl font-extrabold text-blue-950 drop-shadow-sm lg:text-5xl">
            Multimedia Learning Hub
          </h1>

          <p className="mx-auto mt-3 max-w-3xl rounded-2xl bg-white/80 px-5 py-3 font-semibold text-gray-700 shadow-sm">
            Watch educational videos to understand the human immune system in a
            fun and simple way.
          </p>
        </header>

        <section className="mx-auto mb-8 max-w-md">
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-white bg-white/95 p-4 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Video className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-500">
                Learning Videos
              </p>

              <p className="font-fredoka text-xl font-extrabold text-gray-900">
                {videos.length} Videos
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {videos.map((video) => {
            const thumbnail = getYouTubeThumbnail(video.youtubeUrl);

            return (
              <button
                type="button"
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="group overflow-hidden rounded-[2rem] border border-white bg-white/95 text-left shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden bg-blue-100">
                  <img
                    src={thumbnail}
                    alt={`${video.title} YouTube thumbnail`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(event) => {
                      event.currentTarget.src = "/images/homepageB.png";
                    }}
                  />

                  <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 h-8 w-8 fill-current" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    YouTube Video
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Video className="h-6 w-6" />
                  </div>

                  <h2 className="font-fredoka text-xl font-extrabold text-gray-900">
                    {video.title}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {video.description}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-xs font-bold text-gray-500">
                      {video.sourceLabel}
                    </p>

                    <p className="flex-shrink-0 font-extrabold text-blue-700">
                      Watch Video →
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </section>

        <section className="mt-10 rounded-[2rem] border border-white bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <BookOpen className="h-7 w-7" />
            </div>

            <div>
              <h2 className="font-fredoka text-xl font-extrabold text-gray-900">
                Learn Through Educational Videos
              </h2>

              <p className="mt-1 text-gray-600">
                Watch all three videos before attempting the quiz assessment.
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700 md:flex">
              <CheckCircle2 className="h-5 w-5" />
              Visual Learning
            </div>
          </div>
        </section>
      </div>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: VideoItem;
  onClose: () => void;
}) {
  const youtubeVideoId = getYouTubeVideoId(video.youtubeUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Close video"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="overflow-hidden rounded-2xl bg-gray-900">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1`}
            title={video.title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="px-2 pt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">
            {video.sourceLabel}
          </p>

          <h2 className="font-fredoka text-2xl font-extrabold text-gray-900">
            {video.title}
          </h2>

          <p className="mt-2 text-gray-600">{video.description}</p>
        </div>
      </div>
    </div>
  );
}