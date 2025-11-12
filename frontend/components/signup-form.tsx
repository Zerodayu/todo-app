"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SignupAction } from "@/server/signup-action"
import { useState, useTransition } from "react"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [error, setError] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)
    
    // Check if passwords match
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    startTransition(async () => {
      const result = await SignupAction(formData)
      
      if (!result.success) {
        setError(result.message)
      }
      // If success, redirect happens in the server action
    })
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && (
              <div className="text-sm text-red-500 mb-4 p-3 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                disabled={isPending}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isPending}
              />
              <FieldDescription>
                You&apos;ll use this to login. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={isPending}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input 
                id="confirm-password" 
                name="confirm-password" 
                type="password" 
                required 
                disabled={isPending}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <Field>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <a href="/auth/login">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
