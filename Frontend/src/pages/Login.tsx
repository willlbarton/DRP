import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContexts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Login() {
  const navigate = useNavigate();

  const { userLoggedIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!isSigningIn) {
      setIsSigningIn(true)
      await doSignInWithEmailAndPassword(email, password)
    }
  }

  const onGoogleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSigningIn) {
      setIsSigningIn(true)
      doSignInWithGoogle().catch((err: Error) => {
        setIsSigningIn(false)
      })
    }
  }

  useEffect(() => {
    if(userLoggedIn) {
      navigate("/")
    }
  }, [])
  return (
    <div>
      <Card className="mx-auto max-w-sm p-8 mt-16 self-center w-[90%] max-w-[600px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required />
              </div>
              <Button type="submit" className="w-full" disabled={isSigningIn}>
                Login
              </Button>
              <Button variant="outline" className="w-full" onClick={onGoogleSignIn}>
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login;