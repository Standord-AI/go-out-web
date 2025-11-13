import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, gifts } = body;

    const bookingRequests = items.map(async (item: any) => {
      const payload: payloadProps = {
        experienceId: item.experienceId,
        selectedDate: item.date,
        selectedTime: item.time,
        duration: parseInt(item.duration, 10),
        quantity: item.quantity,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phoneNumber: customer.phone,
        specialRequests: customer.specialRequests,
      };
      if (item.isGift === undefined || item.isGift === false) {
        payload.status = "CONFIRMED";
      } else {
        const gift = gifts?.find((gift: any) => gift.id === item.id);
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
          throw new Error(
            `Failed to create booking: ${response.status} - ${response.body}`
          );
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
          const errorData = await response.json();
          throw new Error(
            `Failed to redeem booking: ${
              errorData.message || response.statusText
            }`
          );
        }
      }
    });

    await Promise.all(bookingRequests);

    return NextResponse.json(
      { message: "All bookings created successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("API booking error:", err);

    return NextResponse.json(
      {
        message: err?.message || "An error occurred while creating bookings",
      },
      { status: 500 }
    );
  }
}
