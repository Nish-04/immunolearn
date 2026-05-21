import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Settings, LogOut, LogIn, UserPlus, Copy } from "lucide-react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  User as FirebaseUser,
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

type UserRole = "student" | "teacher";

const generateClassCode = () => {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TCH-${random}`;
};

export function UserMenu() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userClassCode, setUserClassCode] = useState("");

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const [loginRole, setLoginRole] = useState<UserRole>("student");
  const [registerRole, setRegisterRole] = useState<UserRole>("student");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerClassCode, setRegisterClassCode] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserRole(null);
        setUserClassCode("");
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserRole(data.role || null);
          setUserClassCode(data.classCode || "");
        }
      } catch (error) {
        console.error("Error loading user role:", error);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleLogin = async () => {
    try {
      if (!loginEmail || !loginPassword) {
        alert("Please enter email and password.");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail.trim().toLowerCase(),
        loginPassword
      );

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await signOut(auth);
        alert("User profile not found. Please register again.");
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== loginRole) {
        await signOut(auth);
        alert(
          `This account is registered as ${userData.role}. Please choose the correct login option.`
        );
        return;
      }

      setShowLoginDialog(false);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      if (!registerName || !registerEmail || !registerPassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (registerRole === "student" && !registerClassCode) {
        alert("Please enter your teacher class code.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail.trim().toLowerCase(),
        registerPassword
      );

      await updateProfile(userCredential.user, {
        displayName: registerName.trim(),
      });

      if (registerRole === "teacher") {
        const newClassCode = generateClassCode();

        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: registerName.trim(),
          email: registerEmail.trim().toLowerCase(),
          role: "teacher",
          classCode: newClassCode,
          createdAt: serverTimestamp(),
        });

        alert(
          `Teacher account created successfully!\n\nYour class code is: ${newClassCode}\n\nGive this code to your students.`
        );

        setShowRegisterDialog(false);
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterClassCode("");
        return;
      }

      const teacher = await findTeacherByClassCode(registerClassCode);

      if (!teacher) {
        await deleteUser(userCredential.user);
        alert(
          "Class code not found. Please ask your teacher for the correct class code."
        );
        return;
      }

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: registerName.trim(),
        email: registerEmail.trim().toLowerCase(),
        role: "student",
        teacherId: teacher.id,
        teacherEmail: teacher.data.email,
        teacherName: teacher.data.name,
        classCode: registerClassCode.trim().toUpperCase(),
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "students", userCredential.user.uid),
        {
          name: registerName.trim(),
          email: registerEmail.trim().toLowerCase(),
          role: "student",

          teacherId: teacher.id,
          teacherEmail: teacher.data.email,
          teacherName: teacher.data.name,
          classCode: registerClassCode.trim().toUpperCase(),

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
        },
        { merge: true }
      );

      alert("Student account created successfully!");

      setShowRegisterDialog(false);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterClassCode("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const copyClassCode = async () => {
    if (!userClassCode) return;

    await navigator.clipboard.writeText(userClassCode);
    alert("Class code copied!");
  };

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  const RoleButtons = ({
    role,
    setRole,
  }: {
    role: UserRole;
    setRole: (role: UserRole) => void;
  }) => (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => setRole("student")}
        className={`border rounded-lg py-3 font-semibold ${
          role === "student"
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700"
        }`}
      >
        Student
      </button>

      <button
        type="button"
        onClick={() => setRole("teacher")}
        className={`border rounded-lg py-3 font-semibold ${
          role === "teacher"
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700"
        }`}
      >
        Teacher
      </button>
    </div>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-full text-white font-medium text-sm hover:bg-blue-700 transition-colors">
          {user ? displayInitial : <User className="w-5 h-5" />}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72">
          {user ? (
            <>
              <div className="px-3 py-2">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="font-semibold text-sm">{displayName}</p>
                <p className="text-xs text-gray-500 break-all">{user.email}</p>
                <p className="text-xs mt-1 font-medium text-blue-600 capitalize">
                  Role: {userRole || "Unknown"}
                </p>

                {userRole === "teacher" && userClassCode && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-2">
                    <p className="text-xs text-blue-700">Your Class Code</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-blue-900">{userClassCode}</p>
                      <button
                        onClick={copyClassCode}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowProfileDialog(true)}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setShowSettingsDialog(true)}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onClick={() => setShowLoginDialog(true)}
                className="cursor-pointer"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setShowRegisterDialog(true)}
                className="cursor-pointer"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Choose Student or Teacher before login.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <RoleButtons role={loginRole} setRole={setLoginRole} />

            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="student@example.com"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login as {loginRole === "student" ? "Student" : "Teacher"}
            </Button>

            <button
              onClick={() => {
                setShowLoginDialog(false);
                setShowRegisterDialog(true);
              }}
              className="w-full text-blue-600 hover:underline text-sm"
            >
              New user? Register here
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register</DialogTitle>
            <DialogDescription>
              Teacher will get a class code. Student must use teacher class code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <RoleButtons role={registerRole} setRole={setRegisterRole} />

            <div>
              <Label htmlFor="register-name">Full Name</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Enter your name"
                value={registerName}
                onChange={(event) => setRegisterName(event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="student@example.com"
                value={registerEmail}
                onChange={(event) => setRegisterEmail(event.target.value)}
              />
            </div>

            {registerRole === "student" && (
              <div>
                <Label htmlFor="register-class-code">Teacher Class Code</Label>
                <Input
                  id="register-class-code"
                  type="text"
                  placeholder="Example: TCH-A91K"
                  value={registerClassCode}
                  onChange={(event) =>
                    setRegisterClassCode(event.target.value.toUpperCase())
                  }
                />
              </div>
            )}

            {registerRole === "teacher" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                Your class code will be generated automatically after register.
                Give that code to your students.
              </div>
            )}

            <div>
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
              />
            </div>

            <Button
              onClick={handleRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Register as {registerRole === "student" ? "Student" : "Teacher"}
            </Button>

            <button
              onClick={() => {
                setShowRegisterDialog(false);
                setShowLoginDialog(true);
              }}
              className="w-full text-blue-600 hover:underline text-sm"
            >
              Already have an account? Login
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>View your account information.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {displayInitial}
              </div>

              <div>
                <h3 className="text-xl font-bold">{displayName}</h3>
                <p className="text-gray-600 break-all">{user?.email}</p>
                <p className="text-sm text-blue-600 capitalize">
                  {userRole || "Unknown"}
                </p>
              </div>
            </div>

            {userRole === "teacher" && userClassCode && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Class Code</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userClassCode}
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                Your account and progress data are saved in Firebase.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Display Name</Label>
              <Input type="text" value={displayName} readOnly />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={user?.email || ""} readOnly />
            </div>

            <div>
              <Label>Role</Label>
              <Input type="text" value={userRole || ""} readOnly />
            </div>

            {userRole === "teacher" && (
              <div>
                <Label>Class Code</Label>
                <Input type="text" value={userClassCode} readOnly />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}