import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Trophy,
  Award,
  Medal,
  CheckCircle,
  User,
  RefreshCw,
  Activity,
  BookOpen,
  Gamepad2,
  FileQuestion,
} from "lucide-react";
import { Button } from "./ui/button";

interface StudentData {
  name?: string;
  email?: string;

  lectureCompletedTopics?: string[];
  lectureCompletedCount?: number;
  lectureTotalTopics?: number;
  lecturePercentage?: number;
  lastLectureTopic?: string;

  dragDropScore?: number;
  dragDropTotal?: number;
  dragDropPercentage?: number;
  dragDropPerformance?: string;

  quizScore?: number;
  quizTotal?: number;
  quizPercentage?: number;
  quizPerformance?: string;

  lastActivity?: string;
}

export function StudentProgress() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        setStudentData(null);
        setLoading(false);
        return;
      }

      const studentRef = doc(db, "students", user.uid);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        setStudentData(studentSnap.data() as StudentData);
      } else {
        setStudentData({
          name: user.displayName || "Student",
          email: user.email || "",

          lectureCompletedCount: 0,
          lectureTotalTopics: 11,
          lecturePercentage: 0,
          lastLectureTopic: "No lecture viewed yet",

          dragDropScore: 0,
          dragDropTotal: 10,
          dragDropPercentage: 0,
          dragDropPerformance: "No activity yet",

          quizScore: 0,
          quizTotal: 10,
          quizPercentage: 0,
          quizPerformance: "No activity yet",

          lastActivity: "No activity yet",
        });
      }
    } catch (error) {
      console.error("Error loading progress:", error);
      alert("Failed to load student progress.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-center text-gray-600">
          Loading student progress...
        </p>
      </div>
    );
  }

  const studentName = studentData?.name || "Student";
  const studentEmail = studentData?.email || "No email";

  const lectureCompletedCount = studentData?.lectureCompletedCount ?? 0;
  const lectureTotalTopics = studentData?.lectureTotalTopics ?? 11;
  const lecturePercentage = studentData?.lecturePercentage ?? 0;
  const lastLectureTopic =
    studentData?.lastLectureTopic || "No lecture viewed yet";

  const dragScore = studentData?.dragDropScore ?? 0;
  const dragTotal = studentData?.dragDropTotal ?? 10;
  const dragPercentage = studentData?.dragDropPercentage ?? 0;
  const dragPerformance = studentData?.dragDropPerformance ?? "No activity yet";

  const quizScore = studentData?.quizScore ?? 0;
  const quizTotal = studentData?.quizTotal ?? 10;
  const quizPercentage = studentData?.quizPercentage ?? 0;
  const quizPerformance = studentData?.quizPerformance ?? "No activity yet";

  const hasLectureActivity = lecturePercentage > 0;
  const hasDragActivity = dragPercentage > 0;
  const hasQuizActivity = quizPercentage > 0;

  const completedActivities =
    (hasLectureActivity ? 1 : 0) +
    (hasDragActivity ? 1 : 0) +
    (hasQuizActivity ? 1 : 0);

  const overallPercentage = Math.round(
    (lecturePercentage + dragPercentage + quizPercentage) / 3
  );

  let overallPerformance = "No activity yet";

  if (overallPercentage >= 80) {
    overallPerformance = "Excellent";
  } else if (overallPercentage >= 60) {
    overallPerformance = "Good";
  } else if (overallPercentage > 0) {
    overallPerformance = "Needs Improvement";
  }

  const badges =
    overallPercentage >= 80
      ? 5
      : overallPercentage >= 60
      ? 3
      : overallPercentage > 0
      ? 1
      : 0;

  const circleSize = 2 * Math.PI * 56;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Learning Progress</h1>
          <p className="text-gray-600">
            Track your lecture notes, quiz score, drag and drop score, and
            overall student performance.
          </p>
        </div>

        <Button onClick={fetchProgress} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Progress
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${circleSize}`}
                  strokeDashoffset={`${
                    circleSize * (1 - overallPercentage / 100)
                  }`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {overallPercentage}%
                  </div>
                  <div className="text-xs text-gray-600">Overall</div>
                </div>
              </div>
            </div>

            <h3 className="font-semibold mb-1">Overall Progress</h3>
            <p className="text-sm text-gray-500">{overallPerformance}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${circleSize}`}
                  strokeDashoffset={`${
                    circleSize * (1 - lecturePercentage / 100)
                  }`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {lecturePercentage}%
                  </div>
                  <div className="text-xs text-gray-600">Lecture</div>
                </div>
              </div>
            </div>

            <h3 className="font-semibold mb-1">Lecture Notes</h3>
            <p className="text-sm text-gray-500">
              {lectureCompletedCount}/{lectureTotalTopics} topics
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-1">
                  {completedActivities}
                </div>
                <div className="text-sm text-gray-600">/3</div>
                <div className="text-xs text-gray-600 mt-1">Sections</div>
              </div>
            </div>

            <h3 className="font-semibold mb-1">Sections Completed</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-20 h-20 text-yellow-500" />
            </div>

            <div className="text-3xl font-bold mb-1">{badges}</div>
            <h3 className="font-semibold">Badges</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Student Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <p className="font-semibold">{studentName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold break-all">{studentEmail}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Activity</p>
              <p className="font-semibold">
                {studentData?.lastActivity || "No activity yet"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Lecture Topic</p>
              <p className="font-semibold">{lastLectureTopic}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Performance Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  Lecture Notes
                </span>
                <span className="text-sm font-bold text-green-600">
                  {lecturePercentage}%
                </span>
              </div>
              <Progress value={lecturePercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                Completed {lectureCompletedCount} of {lectureTotalTopics} topics
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-blue-600" />
                  Drag and Drop Activity
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {dragScore}/{dragTotal}
                </span>
              </div>
              <Progress value={dragPercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                Performance: {dragPerformance}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-purple-600" />
                  Quiz Assessment
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {quizScore}/{quizTotal}
                </span>
              </div>
              <Progress value={quizPercentage} className="h-2" />
              <p className="text-sm text-gray-500 mt-2">
                Performance: {quizPerformance}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Chapter Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Introduction to Immunity
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {lectureCompletedCount >= 1 ? "100%" : "0%"}
                </span>
              </div>
              <Progress
                value={lectureCompletedCount >= 1 ? 100 : 0}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Types of Immunity</span>
                <span className="text-sm font-bold text-blue-600">
                  {lectureCompletedCount >= 2 ? "100%" : "0%"}
                </span>
              </div>
              <Progress
                value={lectureCompletedCount >= 2 ? 100 : 0}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Immune System Components
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {lectureCompletedCount >= 5 ? "100%" : "0%"}
                </span>
              </div>
              <Progress
                value={lectureCompletedCount >= 5 ? 100 : 0}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Body Defense Mechanisms
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {lectureCompletedCount >= 10 ? "100%" : "0%"}
                </span>
              </div>
              <Progress
                value={lectureCompletedCount >= 10 ? 100 : 0}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Vaccination</span>
                <span className="text-sm font-bold text-blue-600">
                  {lectureCompletedCount >= 11 ? "100%" : "0%"}
                </span>
              </div>
              <Progress
                value={lectureCompletedCount >= 11 ? 100 : 0}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {overallPercentage > 0 ? (
              <>
                {hasLectureActivity && (
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        Started Lecture Notes
                      </h4>
                      <p className="text-xs text-gray-600">
                        Completed {lectureCompletedCount}/{lectureTotalTopics}{" "}
                        topics
                      </p>
                    </div>
                  </div>
                )}

                {hasDragActivity && (
                  <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Medal className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        Completed Drag and Drop Activity
                      </h4>
                      <p className="text-xs text-gray-600">
                        Score: {dragScore}/{dragTotal}
                      </p>
                    </div>
                  </div>
                )}

                {hasQuizActivity && (
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        Completed Quiz Assessment
                      </h4>
                      <p className="text-xs text-gray-600">
                        Score: {quizScore}/{quizTotal}
                      </p>
                    </div>
                  </div>
                )}

                {overallPercentage >= 80 && (
                  <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        Earned Excellent Performance Badge
                      </h4>
                      <p className="text-xs text-gray-600">
                        Overall progress reached {overallPercentage}%
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">
                  No achievements yet. Read lecture notes or complete an
                  activity to unlock badges.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}