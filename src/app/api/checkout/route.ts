import { NextResponse } from "next/server";
import type { ApiTime } from "@/types";

export interface payloadProps {
  experienceId: string;
  selectedDate: string;
  selectedTime: string;
  duration: number;
  quantity: number;
  name: string;
  email: string;
  phoneNumber: string;
  specialRequests: string;
  status?: string;
  isGift?: boolean;
  receiverEmail?: string;
  giftMessage?: string;
}

interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

interface CheckoutGiftDetails {
  itemId: string;
  recipientEmail: string;
  message?: string;
}

interface CheckoutItem {
  id: string;
  experienceId: string;
  date: string;
  time?: string | ApiTime;
  duration: string | number;
  quantity: number;
  isGift?: boolean;
  redeemedBookingId?: string;
}

interface CheckoutRequestBody {
  items: CheckoutItem[];
  customer: CheckoutCustomer;
  gifts?: CheckoutGiftDetails[];
}

const isApiErrorResponse = (value: unknown): value is { message?: string } =>
  typeof value === "object" && value !== null && "message" in value;

const normaliseTimeValue = (time?: string | ApiTime): string => {
  if (!time) return "";
  if (typeof time === "string") {
    return time;
  }
  const { hour, minute, period } = time;
  return `${hour}:${minute} ${period}`;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const { items, customer, gifts } = body;

    const bookingRequests = items.map(async (item) => {
      const durationValue =
        typeof item.duration === "number"
          ? item.duration
          : parseInt(item.duration, 10);

      const payload: payloadProps = {
        experienceId: item.experienceId,
        selectedDate: item.date,
        selectedTime: normaliseTimeValue(item.time),
        duration: Number.isFinite(durationValue) ? durationValue : 0,
        quantity: item.quantity,
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        phoneNumber: customer.phone,
        specialRequests: customer.specialRequests ?? "",
      };

      if (!item.isGift) {
        payload.status = "CONFIRMED";
      } else {
        const gift = gifts?.find((giftItem) => giftItem.itemId === item.id);
        if (!gift) {
          throw new Error(`Gift details missing for cart item ${item.id}`);
        }
        payload.isGift = true;
        payload.receiverEmail = gift.recipientEmail;
        payload.giftMessage = gift.message;
      }

      if (!item.redeemedBookingId) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookings`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const message = isApiErrorResponse(errorData)
            ? errorData.message
            : response.statusText;
          throw new Error(`Failed to create booking: ${message}`);
        }
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookings/gift/redeem/${item.redeemedBookingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...(req.headers.get("cookie")
                ? { cookie: req.headers.get("cookie") as string }
                : {}),
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const message = isApiErrorResponse(errorData)
            ? errorData.message
            : response.statusText;
          throw new Error(`Failed to redeem booking: ${message}`);
        }
      }
    });

    await Promise.all(bookingRequests);

    return NextResponse.json(
      { message: "All bookings created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API booking error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "An error occurred while creating bookings";

    return NextResponse.json({ message }, { status: 500 });
  }
}
