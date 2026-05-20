import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { MousePointer } from "lucide-react";

export function InteractiveActivities() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Interactive Activities</h1>
        <p className="text-gray-600">Learn by doing! Choose an activity below to get started.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl">
        <Card className="border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <CardHeader>
            <div className="relative h-40 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg mb-4 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-16 bg-cyan-500 rounded-lg shadow-lg"></div>
                <MousePointer className="absolute -bottom-2 -right-2 w-8 h-8 text-gray-700" />
              </div>
            </div>
            <CardTitle>Drag and Drop Activity</CardTitle>
            <CardDescription>Drag and drop items to the correct place.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/activities/drag-drop")}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Start Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
