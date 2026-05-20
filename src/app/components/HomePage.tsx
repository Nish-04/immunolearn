import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { BookOpen, Target, Globe, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-5xl font-bold mb-4">
            Human <span className="text-blue-600">Immunity</span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Explore the fascinating world of the immune system through interactive lessons, activities, and multimedia.
          </p>
          <Button
            onClick={() => navigate("/lecture-notes")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
          >
            Start Learning →
          </Button>
        </div>

        <div className="relative h-96 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl"></div>
          <Shield className="w-48 h-48 text-blue-600 relative z-10" strokeWidth={1.5} />
          <div className="absolute top-10 left-10 w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-purple-400 rounded-full"></div>
          </div>
          <div className="absolute top-20 right-20 w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-10 left-20 w-14 h-14 bg-pink-200 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-pink-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-indigo-400 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/lecture-notes")}>
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Chapter Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>View all chapters and topics in the course.</CardDescription>
            <Button variant="link" className="text-blue-600 px-0 mt-2">Explore →</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/lecture-notes")}>
          <CardHeader>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Understand what you will learn in this course.</CardDescription>
            <Button variant="link" className="text-blue-600 px-0 mt-2">Explore →</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/activities")}>
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Interactive Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Practice with interactive exercises.</CardDescription>
            <Button variant="link" className="text-blue-600 px-0 mt-2">Explore →</Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/progress")}>
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle>Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Track your learning progress and scores.</CardDescription>
            <Button variant="link" className="text-blue-600 px-0 mt-2">View Progress →</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
