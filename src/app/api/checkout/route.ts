import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    const bookingRequests = items.map(async (item: any) => {
      const payload = {
        experienceId: item.experienceId,
        selectedDate: item.date,
        selectedTime: item.time,
        duration: parseInt(item.duration, 10),
        quantity: item.quantity,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phoneNumber: customer.phone,
        specialRequests: customer.specialRequests,
        status: "CONFIRMED",
      };

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
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
