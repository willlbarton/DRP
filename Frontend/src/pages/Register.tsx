import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContexts"
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";

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

export function Register() {
  const navigate = useNavigate()

  const { userLoggedIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!isRegistering) {
      setIsRegistering(true)
      try {
        await doCreateUserWithEmailAndPassword(email, password)
      } catch (error) {
        console.error("Error creating user:", error)
      } finally {
        setIsRegistering(false)
        console.log("User created successfully")
      }
    }
  }

  useEffect(() => {
    if(userLoggedIn) {
      navigate("/")
    }
  }, [userLoggedIn])

  return (
    <div>
      <Card className="mx-auto max-w-sm p-8 mt-16 self-center w-[90%] max-w-[600px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter your email below to create your account
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
            <Button type="submit" className="w-full" disabled={isRegistering}>
              Sign up
            </Button>
          </div>
        </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register;