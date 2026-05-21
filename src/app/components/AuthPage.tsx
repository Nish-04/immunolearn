import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type UserRole = "student" | "teacher";

const generateClassCode = () => {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TCH-${random}`;
};

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);
  const [role, setRole] = useState<UserRole>("student");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [classCode, setClassCode] = useState("");
  const [password, setPassword] = useState("");

  const findTeacherByClassCode = async (codeValue: string) => {
    const teacherQuery = query(
      collection(db, "users"),
      where("classCode", "==", codeValue.trim().toUpperCase()),
      where("role", "==", "teacher")
    );

    const teacherSnapshot = await getDocs(teacherQuery);

    if (teacherSnapshot.empty) {
      return null;
    }

    const teacherDoc = teacherSnapshot.docs[0];

    return {
      id: teacherDoc.id,
      data: teacherDoc.data(),
    };
  };

  const handleRegister = async () => {
    try {
      if (!name.trim() || !email.trim() || !password.trim()) {
        alert("Please fill in name, email and password.");
        return;
      }

      if (role === "student" && !classCode.trim()) {
        alert("Please enter your teacher class code.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      if (role === "teacher") {
        const newClassCode = generateClassCode();

        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: "teacher",
          classCode: newClassCode,
          createdAt: serverTimestamp(),
        });

        console.log("Teacher class code:", newClassCode);

        setName("");
        setEmail("");
        setPassword("");
        setClassCode("");
        return;
      }

      const teacher = await findTeacherByClassCode(classCode);

      if (!teacher) {
        await deleteUser(userCredential.user);
        alert(
          "Class code not found. Please ask your teacher for the correct class code."
        );
        return;
      }

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "student",
        teacherId: teacher.id,
        teacherEmail: teacher.data.email,
        teacherName: teacher.data.name,
        classCode: classCode.trim().toUpperCase(),
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "students", userCredential.user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "student",

        teacherId: teacher.id,
        teacherEmail: teacher.data.email,
        teacherName: teacher.data.name,
        classCode: classCode.trim().toUpperCase(),

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

        lastActivity: "New user",
        createdAt: serverTimestamp(),
      });

      alert("Student account created successfully!");

      setName("");
      setEmail("");
      setClassCode("");
      setPassword("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        alert("Please enter email and password.");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await signOut(auth);
        alert("User profile not found. Please register again.");
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== role) {
        await signOut(auth);
        alert(
          `This account is registered as ${userData.role}. Please choose the correct login option.`
        );
        return;
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAuth = async () => {
    if (isRegister) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            {isRegister ? "Create Account" : "Login"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Welcome to ImmunoLearn. Choose your account type.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`border rounded-lg py-3 font-semibold transition-colors ${
                role === "student"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`border rounded-lg py-3 font-semibold transition-colors ${
                role === "teacher"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Teacher
            </button>
          </div>

          {isRegister && (
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {isRegister && role === "student" && (
            <input
              type="text"
              placeholder="Enter teacher class code, example: TCH-A91K"
              value={classCode}
              onChange={(event) =>
                setClassCode(event.target.value.toUpperCase())
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {isRegister && role === "teacher" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              Your class code will appear in Teacher Dashboard after
              registration.
            </div>
          )}

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            onClick={handleAuth}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRegister
              ? `Register as ${role === "student" ? "Student" : "Teacher"}`
              : `Login as ${role === "student" ? "Student" : "Teacher"}`}
          </Button>

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="w-full text-blue-600 hover:underline"
          >
            {isRegister
              ? "Already have an account? Login"
              : "New user? Register here"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}