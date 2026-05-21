import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import {
  RefreshCw,
  Users,
  BookOpen,
  Gamepad2,
  FileQuestion,
  Copy,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router";

interface StudentData {
  id: string;
  name?: string;
  email?: string;

  role?: string;
  teacherId?: string;
  teacherEmail?: string;
  teacherName?: string;
  classCode?: string;

  lectureCompletedCount?: number;
  lectureTotalTopics?: number;
  lecturePercentage?: number;

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

export function TeacherDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherClassCode, setTeacherClassCode] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setIsTeacher(false);
        setStudents([]);
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setIsTeacher(false);
        setStudents([]);
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== "teacher") {
        setIsTeacher(false);
        setStudents([]);
        return;
      }

      setIsTeacher(true);
      setTeacherName(userData.name || "Teacher");
      setTeacherEmail(userData.email || currentUser.email || "");
      setTeacherClassCode(userData.classCode || "");

      const studentsQuery = query(
        collection(db, "students"),
        where("teacherId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(studentsQuery);

      const studentList: StudentData[] = snapshot.docs.map((studentDoc) => ({
        id: studentDoc.id,
        ...(studentDoc.data() as Omit<StudentData, "id">),
      }));

      setStudents(studentList);
    } catch (error) {
      console.error("Error loading students:", error);
      alert("Failed to load student progress.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const copyClassCode = async () => {
    if (!teacherClassCode) return;

    await navigator.clipboard.writeText(teacherClassCode);
    alert("Class code copied!");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-center text-gray-600">
          Loading teacher dashboard...
        </p>
      </div>
    );
  }

  if (!isTeacher) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Card className="border-none shadow-lg">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              This page is only for teacher accounts.
            </p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalStudents = students.length;

  const averageProgress =
    totalStudents > 0
      ? Math.round(
          students.reduce((sum, student) => {
            const lecture = student.lecturePercentage ?? 0;
            const drag = student.dragDropPercentage ?? 0;
            const quiz = student.quizPercentage ?? 0;

            return sum + Math.round((lecture + drag + quiz) / 3);
          }, 0) / totalStudents
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>

              <div>
                <h1 className="text-4xl font-bold">Teacher Dashboard</h1>
                <p className="text-blue-100">
                  Welcome, {teacherName}
                </p>
              </div>
            </div>

            <p className="text-blue-50 max-w-2xl">
              This dashboard only shows students who registered using your
              class code. Students under other teachers will not appear here.
            </p>

            <div className="mt-5 text-sm text-blue-100">
              Teacher Email: {teacherEmail}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-2">Your Class Code</p>

            <div className="flex items-center justify-between gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-4">
              <div>
                <p className="text-3xl font-bold text-blue-700">
                  {teacherClassCode || "No Code"}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Give this code to your students
                </p>
              </div>

              <Button
                onClick={copyClassCode}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>

            <Button
              onClick={fetchStudents}
              variant="outline"
              className="gap-2 w-full mt-4"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">My Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-2">
              Average Overall Progress
            </p>

            <p className="text-3xl font-bold text-green-600 mb-3">
              {averageProgress}%
            </p>

            <Progress value={averageProgress} className="h-3" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Student Progress List</CardTitle>
        </CardHeader>

        <CardContent>
          {students.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg font-semibold mb-2">
                No students registered yet.
              </p>
              <p className="text-sm">
                Ask your students to register using your class code:
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-3">
                {teacherClassCode}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {students.map((student) => {
                const lecturePercentage = student.lecturePercentage ?? 0;
                const dragPercentage = student.dragDropPercentage ?? 0;
                const quizPercentage = student.quizPercentage ?? 0;

                const overall = Math.round(
                  (lecturePercentage + dragPercentage + quizPercentage) / 3
                );

                return (
                  <div
                    key={student.id}
                    className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                      <div>
                        <h3 className="text-xl font-bold">
                          {student.name || "Student"}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {student.email || "No email"}
                        </p>

                        <p className="text-xs text-blue-600 mt-1">
                          Class Code: {student.classCode || "-"}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500">
                          Overall Progress
                        </p>

                        <p className="text-2xl font-bold text-blue-600">
                          {overall}%
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-sm">
                            Lecture Notes
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-2">
                          {student.lectureCompletedCount ?? 0}/
                          {student.lectureTotalTopics ?? 11} topics
                        </p>

                        <Progress value={lecturePercentage} className="h-2" />

                        <p className="text-sm font-semibold mt-2">
                          {lecturePercentage}%
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Gamepad2 className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-sm">
                            Drag & Drop
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-2">
                          Score: {student.dragDropScore ?? 0}/
                          {student.dragDropTotal ?? 10}
                        </p>

                        <Progress value={dragPercentage} className="h-2" />

                        <p className="text-sm font-semibold mt-2">
                          {dragPercentage}%
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileQuestion className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-sm">
                            Quiz Assessment
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-2">
                          Score: {student.quizScore ?? 0}/
                          {student.quizTotal ?? 10}
                        </p>

                        <Progress value={quizPercentage} className="h-2" />

                        <p className="text-sm font-semibold mt-2">
                          {quizPercentage}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      Last Activity: {student.lastActivity || "No activity yet"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}