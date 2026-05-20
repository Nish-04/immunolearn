import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    try {
      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      if (isRegister) {
        if (!name.trim()) {
          alert("Please enter your name.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: name,
        });

        await setDoc(doc(db, "students", userCredential.user.uid), {
          name: name,
          email: email,
          dragDropScore: 0,
          dragDropTotal: 10,
          quizScore: 0,
          quizTotal: 0,
          lastActivity: "New user",
          createdAt: serverTimestamp(),
        });

        alert("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      alert(error.message);
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
            Welcome to ImmunoLearn. Please login or register.
          </p>

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
            {isRegister ? "Register" : "Login"}
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