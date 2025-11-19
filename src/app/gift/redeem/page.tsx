"use client";

import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApiExperience, ApiTime, CartItem } from "@/types";
import Image from "next/image";
import { BookingForm, BookingData } from "@/components/listings/BookingForm";
import { useCart } from "@/contexts/CartContext";
import { useRouter, useSearchParams } from "next/navigation";

interface redeemGiftProps {
  _id: string;
  refNo: string;
  experienceId: ApiExperience;
  selectedDate?: Date;
  selectedTime?: ApiTime;
  duration: number;
  quantity: number;
  totalPayable: {
    amount: number;
    currency: string;
  };
  name: string;
  email: string;
  phoneNumber: string;
  specialRequests?: string;
  cancellationReason?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "GIFT_PENDING" | "REDEEMED";
  isGift: boolean;
  giftToken?: string;
  giftTokenExpiresAt?: Date;
  giftMessage?: string;
  giftOldPrice?: {
    amount: number;
    currency: string;
  };
  receiverEmail?: string;
  redeemedBy?: {
    email: string;
  };
}

function GiftRedeemContent() {
  const [gift, setGift] = useState<redeemGiftProps | null>(null);
  const [availableTimes, setAvailableTimes] = useState<ApiTime[]>([]);
  const [isDateFullyBooked, setIsDateFullyBooked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    const fetchGiftDetails = async () => {
      if (!token) {
        setError("No gift token provided.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookings/gift/verify/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData && typeof errorData === "object" && "message" in errorData
              ? (errorData as { message?: string }).message
              : undefined;
          throw new Error(errorMessage || "Something went wrong");
        }

        const data: redeemGiftProps = await response.json();
        setGift(data);
        setAvailableTimes(data.experienceId.availableTimes?.times ?? []);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch gift details.";
        setError(message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGiftDetails();
  }, [searchParams]);

  const fetchAvailabilityForDate = async (date: Date) => {
    if (!gift) return;
    try {
      const dateString = date.toISOString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookings/availability/${gift.experienceId._id}?date=${dateString}`
      );
      const data = (await response.json().catch(() => null)) as
        | { availableTimes?: ApiTime[]; fullyBooked?: boolean }
        | null;
      setAvailableTimes(
        data?.availableTimes ?? gift.experienceId.availableTimes?.times ?? []
      );
      setIsDateFullyBooked(Boolean(data?.fullyBooked));
    } catch (error: unknown) {
      console.error("Error fetching availability:", error);
      if (gift) {
        setAvailableTimes(gift.experienceId.availableTimes?.times ?? []);
      }
      setIsDateFullyBooked(false);
    }
  };

  const handleRedeem = (bookingData: BookingData) => {
    if (!gift || !bookingData.date || !bookingData.time) {
      alert("Please select a date and time to redeem your gift.");
      return;
    }

    const cartItem: CartItem = {
      id: `redeemed-${gift.refNo}`,
      experienceId: gift.experienceId._id,
      title: gift.experienceId.title,
      image: gift.experienceId.images[0],
      price: bookingData.price,
      currency: gift.totalPayable.currency,
      quantity: bookingData.quantity,
      date: bookingData.date,
      time: bookingData.time,
      location: gift.experienceId.location,
      duration: bookingData.duration.toString(),
      maxParticipants: gift.experienceId.maxParticipants,
      redeemedBookingId: gift._id,
      oldPrice: gift.totalPayable.amount,
    };

    addItem(cartItem);
    router.push("/cart");
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl w-full items-center justify-center mx-auto my-24">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <p className="text-center text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            {loading ? (
              <p className="text-center text-muted-foreground">
                Loading gift details...
              </p>
            ) : gift ? (
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-4 px-4 py-8 border rounded-lg">
                  <div className="relative size-36 flex-shrink-0">
                    {gift.experienceId?.images[0] && (
                      <Image
                        src={gift.experienceId.images[0]}
                        alt={gift.experienceId.title || ""}
                        fill
                        className="object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <h4 className="font-semibold text-lg">
                      {gift.experienceId?.title}
                    </h4>
                    <div className="flex flex-col gap-1">
                      <p className="text-md font-medium text-gray-600">
                        Quantity: {gift.quantity}
                      </p>
                      <p className="text-md font-medium text-gray-600">
                        Duration: {gift.duration} minutes
                      </p>
                      <p className="text-md font-medium text-gray-600">
                        Gifted By: {gift.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <p className="text-4xl font-semibold font-mono">GIFT</p>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Redeem Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            Redeem: {gift.experienceId.title}
                          </DialogTitle>
                          <CardDescription>
                            Select your preferred date and time to book your
                            experience.
                          </CardDescription>
                        </DialogHeader>
                        <BookingForm
                          experienceId={gift.experienceId._id}
                          title={gift.experienceId.title}
                          image={gift.experienceId.images[0]}
                          location={gift.experienceId.location}
                          maxParticipants={gift.experienceId.maxParticipants}
                          rates={gift.experienceId.rates}
                          availableDates={
                            gift.experienceId.availableDates.dates
                          }
                          availableTimes={availableTimes}
                          onDateChange={fetchAvailabilityForDate}
                          isDateFullyBooked={isDateFullyBooked}
                          showTimeSelector={true}
                          onAddToCart={handleRedeem}
                          selectedDuration={gift.duration}
                          selectedQuantity={gift.quantity}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <h4 className="font-semibold text-lg">
                    Message from the gifter
                  </h4>
                  <p className="text-sm">{gift.giftMessage}</p>
                </div>
              </div>
            ) : (
              <p className="text-center font-medium text-destructive">
                This gift is expired or is already claimed.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Loading gift details...</div>}>
      <GiftRedeemContent />
    </Suspense>
  );
}
