"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckoutFormData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

type CheckoutStep = "details" | "payment" | "review" | "confirmation";

interface GiftDetails {
  recipientEmail?: string;
  message?: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("details");
  const [formData, setFormData] = useState<CheckoutFormData>(() => ({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: "",
    specialRequests: "",
  }));

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const [giftDetails, setGiftDetails] = useState<Record<string, GiftDetails>>(
    {}
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const steps = [
    { id: "details", title: "Contact Details" },
    { id: "payment", title: "Payment" },
    { id: "review", title: "Review" },
    { id: "confirmation", title: "Confirmation" },
  ];

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGiftInputChange = (
    itemId: string,
    field: keyof GiftDetails,
    value: string
  ) => {
    setGiftDetails((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as CheckoutStep);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as CheckoutStep);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
          customer: formData,
          gifts: state.items
            .filter((item) => item.isGift)
            .map((item) => ({
              itemId: item.id,
              recipientEmail: giftDetails[item.id]?.recipientEmail ?? "",
              message: giftDetails[item.id]?.message || undefined,
              senderName: [formData.firstName, formData.lastName]
                .filter(Boolean)
                .join(" "),
            })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setIsProcessing(false);
      setCurrentStep("confirmation");
      clearCart();
    } catch (err: any) {
      setError(err.message || "One or more bookings failed.");
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep === step.id
                ? "bg-orange-500 border-orange-500 text-white"
                : index < steps.findIndex((s) => s.id === currentStep)
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {index < steps.findIndex((s) => s.id === currentStep) ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-2 ${
                index < steps.findIndex((s) => s.id === currentStep)
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderContactDetails = () => (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="mb-2">
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="mb-2">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" className="mb-2">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="specialRequests" className="mb-2">
            Special Requests (Optional)
          </Label>
          <Textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange("specialRequests", e.target.value)
            }
            placeholder="Any special requirements or requests..."
            rows={3}
          />
        </div>
      </CardContent>
      {state.items.some((item) => item.isGift && !item.redeemedBookingId) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Gift Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {state.items
              .filter((item) => item.isGift)
              .map((item) => (
                <div key={item.id} className="p-4 border rounded-lg space-y-4">
                  <div className="font-medium">
                    <h4>For: {item.title}</h4>
                    <p className="text-muted-foreground text-sm">
                      Duration: {item.duration}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div>
                    <Label
                      htmlFor={`recipientEmail-${item.id}`}
                      className="mb-2"
                    >
                      Recipient's Email (Optional)
                    </Label>
                    <Input
                      id={`recipientEmail-${item.id}`}
                      type="email"
                      value={giftDetails[item.id]?.recipientEmail || ""}
                      onChange={(e) =>
                        handleGiftInputChange(
                          item.id,
                          "recipientEmail",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`message-${item.id}`} className="mb-2">
                      Message (Optional)
                    </Label>
                    <Textarea
                      id={`message-${item.id}`}
                      value={giftDetails[item.id]?.message || ""}
                      onChange={(e) =>
                        handleGiftInputChange(
                          item.id,
                          "message",
                          e.target.value
                        )
                      }
                      placeholder="Message to the recipient..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </Card>
  );

  const renderPayment = () => (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      {state.total > 0 ? (
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              Secure payment powered by Stripe
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                disabled
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" disabled />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" disabled />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="w-4 h-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </CardContent>
      ) : (
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-lg font-medium text-muted-foreground flex gap-2">
            <Info />
            Payment info is not required for this purchase
          </div>
        </CardContent>
      )}
    </Card>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  {item.isGift && !item.redeemedBookingId ? (
                    <p className="text-sm font-semibold text-orange-500">
                      Gift Voucher
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {item.date && format(new Date(item.date), "PPP")}
                      {item.time &&
                        ` at ${item.time.hour}:${item.time.minute} ${item.time.period}`}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {formData.firstName} {formData.lastName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phone}
            </p>
            {formData.specialRequests && (
              <p>
                <strong>Special Requests:</strong> {formData.specialRequests}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {state.items.some((item) => item.isGift && !item.redeemedBookingId) && (
        <Card>
          <CardHeader>
            <CardTitle>Gift Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.items
              .filter((item) => item.isGift)
              .map((item) => (
                <div key={item.id} className="border-b pb-2">
                  <p className="font-semibold">{item.title}</p>
                  <p>Recipient: {giftDetails[item.id]?.recipientEmail}</p>
                  <p>Message: {giftDetails[item.id]?.message}</p>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${state.subtotal.toFixed(2)}</span>
            </div>
            {state.giftTotal != 0 && (
              <div className="flex justify-between text-destructive">
                <span>Gifted Items Price Reduction</span>
                <span>${(state.giftTotal ?? 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxes</span>
              <span>${state.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Service Fee</span>
              <span>${state.fees.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Thank you for your booking. You will receive a confirmation email
        shortly with all the details.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          onClick={() => router.push("/experiences")}
          className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
        >
          Browse More Experiences
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="w-full sm:w-auto"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );

  if (state.items.length === 0 && currentStep !== "confirmation") {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {currentStep !== "confirmation" && (
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
        )}

        {currentStep !== "confirmation" && renderStepIndicator()}

        <div className="space-y-6">
          {currentStep === "details" && renderContactDetails()}
          {currentStep === "payment" && renderPayment()}
          {currentStep === "review" && renderReview()}
          {currentStep === "confirmation" && renderConfirmation()}
        </div>

        {currentStep === "review" && error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {currentStep !== "confirmation" && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === "details" || isProcessing}
            >
              Back
            </Button>

            <Button
              onClick={currentStep === "review" ? handleSubmit : handleNext}
              disabled={
                (currentStep === "details" &&
                  (!formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    !formData.phone)) ||
                isProcessing
              }
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isProcessing
                ? "Processing..."
                : currentStep === "review"
                ? "Confirm Booking"
                : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
