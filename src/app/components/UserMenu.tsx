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
import { User, Settings, LogOut, LogIn, UserPlus } from "lucide-react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export function UserMenu() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      if (!loginEmail || !loginPassword) {
        alert("Please enter email and password.");
        return;
      }

      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      await updateProfile(userCredential.user, {
        displayName: registerName,
      });

      await setDoc(
        doc(db, "students", userCredential.user.uid),
        {
          name: registerName,
          email: registerEmail,

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

      setShowRegisterDialog(false);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
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

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Student";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-full text-white font-medium text-sm hover:bg-blue-700 transition-colors">
          {user ? displayInitial : <User className="w-5 h-5" />}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {user ? (
            <>
              <div className="px-3 py-2">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="font-semibold text-sm">{displayName}</p>
                <p className="text-xs text-gray-500 break-all">{user.email}</p>
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
              Enter your email and password to access your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
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
              Login
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
              Create a new account to save your learning progress.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
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
              Register
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
            <DialogDescription>
              View your account information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {displayInitial}
              </div>

              <div>
                <h3 className="text-xl font-bold">{displayName}</h3>
                <p className="text-gray-600 break-all">{user?.email}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                Your score and learning progress are saved in Firebase.
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

            <p className="text-sm text-gray-500">
              To change account information, use Firebase Authentication settings.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}