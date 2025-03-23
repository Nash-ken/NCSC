"use client"
import { BellRing, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"

export function ConsentPopup({ className }: { className?: string }) {
  const [gdprAccepted, setGdprAccepted] = useState(false)
  const [cookiesAccepted, setCookiesAccepted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Check if the user has already accepted the GDPR and cookies consent
  useEffect(() => {
    const gdprConsent = localStorage.getItem("gdprConsent")
    const cookiesConsent = localStorage.getItem("cookiesConsent")
    if (!gdprConsent || !cookiesConsent) {
      setIsOpen(true) // Show the dialog if consent is not stored
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("gdprConsent", String(gdprAccepted)) // Store GDPR consent
    localStorage.setItem("cookiesConsent", String(cookiesAccepted)) // Store cookies consent
    setIsOpen(false) // Close the dialog
  }

  const handleReject = () => {
    setIsOpen(false) // Close the dialog if user rejects
  }

  if (!isOpen) return null // Don't render anything if the popup is not open

  return (
    <div className="fixed bottom-3 right-3 md:bottom-6 md:right-6 z-50"> {/* Position at bottom right with a margin of 6 */}
      <Card className={cn("w-[380px]", className)}>
        <CardHeader>
          <CardTitle>GDPR and Cookies Consent</CardTitle>
          <CardDescription>Please review and accept our consent policies.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* GDPR Consent */}
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <BellRing />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">GDPR Consent</p>
              <p className="text-sm text-muted-foreground">
                We need your consent to collect and store your personal data as per GDPR.
              </p>
            </div>
            <Switch
              checked={gdprAccepted}
              onCheckedChange={(checked) => setGdprAccepted(checked)}
            />
          </div>

          {/* Cookies Consent */}
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <BellRing />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Cookies Consent</p>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your experience. Please accept to continue using our site.
              </p>
            </div>
            <Switch
              checked={cookiesAccepted}
              onCheckedChange={(checked) => setCookiesAccepted(checked)}
            />
          </div>
        </CardContent>

        <CardFooter className="grid gap-3">
          <Button className="w-full" onClick={handleReject} variant="outline">
            Reject
          </Button>
          <Button className="w-full" onClick={handleAccept}>
            Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
