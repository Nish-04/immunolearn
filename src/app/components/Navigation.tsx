import { Link, useLocation, useNavigate } from "react-router";
import { Home, BookOpen, Gamepad2, FileQuestion, PlayCircle, TrendingUp, Menu, Shield, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLanguage } from "../context/LanguageContext";
import { UserMenu } from "./UserMenu";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: "/", label: t.home, icon: Home },
    { path: "/lecture-notes", label: t.lectureNotes, icon: BookOpen },
    { path: "/activities", label: t.activities, icon: Gamepad2 },
    { path: "/quiz", label: t.quiz, icon: FileQuestion },
    { path: "/multimedia", label: t.multimedia, icon: PlayCircle },
    { path: "/progress", label: t.progress, icon: TrendingUp },
  ];

  const languageOptions = [
    { code: "en" as const, label: "English" },
    { code: "ms" as const, label: "Bahasa Melayu" },
    { code: "zh" as const, label: "中文" },
    { code: "ar" as const, label: "العربية" },
  ];

  const getCurrentLanguageLabel = () => {
    return languageOptions.find(lang => lang.code === language)?.code.toUpperCase() || "EN";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-xl">ImmunoLearn</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="cursor-pointer"
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center w-9 h-9 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Menu className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
