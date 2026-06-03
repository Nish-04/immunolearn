import { Shield } from "lucide-react";

function Bacteria({
  className = "",
  color = "bg-green-400",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className={`relative w-20 h-10 ${color} rounded-full shadow-lg animate-float-slow`}
      >
        <div className="absolute top-2 left-4 w-2 h-2 bg-white/70 rounded-full"></div>
        <div className="absolute bottom-2 right-5 w-2 h-2 bg-white/70 rounded-full"></div>

        <div className="absolute -top-3 left-3 w-1 h-4 bg-green-600 rounded-full rotate-45"></div>
        <div className="absolute -top-3 right-4 w-1 h-4 bg-green-600 rounded-full -rotate-45"></div>
        <div className="absolute -bottom-3 left-6 w-1 h-4 bg-green-600 rounded-full -rotate-45"></div>
        <div className="absolute -bottom-3 right-6 w-1 h-4 bg-green-600 rounded-full rotate-45"></div>
      </div>
    </div>
  );
}

function ImmuneCell({
  className = "",
  color = "bg-blue-300",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className={`relative w-20 h-20 ${color} rounded-full shadow-xl animate-pulse`}
      >
        <div className="absolute inset-3 bg-white/30 rounded-full"></div>
        <div className="absolute top-5 left-6 w-3 h-3 bg-white/80 rounded-full"></div>
        <div className="absolute bottom-5 right-6 w-3 h-3 bg-white/70 rounded-full"></div>

        <div className="absolute -top-2 left-8 w-4 h-4 bg-white/40 rounded-full"></div>
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white/40 rounded-full"></div>
        <div className="absolute top-8 -left-2 w-4 h-4 bg-white/40 rounded-full"></div>
        <div className="absolute top-8 -right-2 w-4 h-4 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
}

function Virus({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative w-16 h-16 bg-red-400 rounded-full shadow-lg animate-spin-slow">
        <div className="absolute -top-2 left-6 w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="absolute -bottom-2 left-6 w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="absolute top-6 -left-2 w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="absolute top-6 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>

        <div className="absolute top-3 left-3 w-2 h-2 bg-white/60 rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/60 rounded-full"></div>
      </div>
    </div>
  );
}

function Antibody({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative w-20 h-20 animate-float">
        <div className="absolute left-9 top-8 w-2 h-10 bg-yellow-400 rounded-full"></div>
        <div className="absolute left-6 top-2 w-2 h-12 bg-yellow-400 rounded-full -rotate-35"></div>
        <div className="absolute right-6 top-2 w-2 h-12 bg-yellow-400 rounded-full rotate-35"></div>
        <div className="absolute left-3 top-0 w-4 h-4 bg-yellow-300 rounded-full"></div>
        <div className="absolute right-3 top-0 w-4 h-4 bg-yellow-300 rounded-full"></div>
      </div>
    </div>
  );
}

export function AnimatedImmuneBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50"></div>

      <ImmuneCell className="top-24 left-10 animate-float" color="bg-blue-300" />
      <ImmuneCell
        className="bottom-28 left-24 animate-float-delay"
        color="bg-purple-300"
      />
      <ImmuneCell
        className="top-40 right-24 animate-float-slow"
        color="bg-cyan-300"
      />

      <Bacteria className="top-32 right-1/3" color="bg-green-400" />
      <Bacteria className="bottom-36 right-20" color="bg-lime-400" />

      <Virus className="top-24 right-12" />
      <Virus className="bottom-24 left-1/2" />

      <Antibody className="top-56 left-1/3" />
      <Antibody className="bottom-52 right-1/3" />

      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Shield className="w-[520px] h-[520px] text-blue-600" strokeWidth={1} />
      </div>
    </div>
  );
}