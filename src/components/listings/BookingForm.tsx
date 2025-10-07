"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ApiPrice, ApiRate, ApiTime, CartItem } from "@/types";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  experienceId: string;
  title: string;
  image: string;
  location: {
    city: string;
    country: string;
  };
  maxParticipants: number;
  onBooking?: (data: BookingData) => void;
  showTimeSelector?: boolean;
  rates?: ApiRate[];
  availableDates?: Date[];
  availableTimes?: ApiTime[];
  bookedDates?: Date[]; // Dates that are already booked
  bookedTimes?: { date: Date; times: ApiTime[] }[]; // Times that are already booked on specific dates
}

export interface BookingData {
  quantity: number;
  date: Date | undefined;
  time?: ApiTime;
  totalPrice: string;
}

export function BookingForm({
  experienceId,
  title,
  image,
  location,
  maxParticipants,
  onBooking,
  showTimeSelector = false,
  rates = [],
  availableDates = [],
  availableTimes = [],
  bookedDates = [],
  bookedTimes = [],
}: BookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<ApiTime>();
  const [priceValue, setPriceValue] = useState<ApiPrice>(
    rates.find(
      (i) => i.duration === Math.min(...rates.map((rate) => rate.duration))
    )!.price
  );
  const [duration, setDuration] = useState<string>("");
  const { addItem, isInCart } = useCart();
  const router = useRouter();

  const handleSelect = (duration: string) => {
    const [index, newDuration] = duration.split("-");
    setDuration(newDuration);
    setPriceValue(rates[parseInt(index)].price);
  };

  bookedDates = [new Date("2025-09-30")];

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!date) return [];

    // Filter out booked times for the selected date
    const bookedTimesForDate = bookedTimes.find(
      (bookingDate) => bookingDate.date.toDateString() === date.toDateString()
    );

    if (bookedTimesForDate) {
      return availableTimes.filter(
        (slot) =>
          !bookedTimesForDate.times.some(
            (t) =>
              t.hour === slot.hour &&
              t.minute === slot.minute &&
              t.period === slot.period
          )
      );
    }

    return availableTimes;
  };

  //Check if date is unavailable as marked by vendor
  const isDateUnavailable = (date: Date) => {
    return availableDates.some((d) => d.toDateString === date.toDateString);
  };

  // Check if a date is disabled (fully booked)
  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) => bookedDate.toDateString() === date.toDateString()
    );
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return (priceValue.amount * quantity).toLocaleString("en-US", {
      style: "currency",
      currency: priceValue.currency,
    });
  };

  // Handle booking submission
  const handleBooking = () => {
    if (onBooking && date) {
      onBooking({
        quantity,
        date,
        time: showTimeSelector ? time : undefined,
        totalPrice: calculateTotalPrice(),
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!date) return;

    const cartItem: CartItem = {
      id: `${experienceId}-${date.toISOString()}-${time || "default"}`,
      experienceId,
      title,
      image,
      price: priceValue.amount,
      currency: priceValue.currency,
      quantity,
      date,
      time,
      location,
      duration,
      maxParticipants,
    };

    addItem(cartItem);
  };

  const isAlreadyInCart = isInCart(experienceId);

  return (
    <Card className="p-6 shadow-lg rounded-lg sticky top-24">
      <CardContent className="p-0 space-y-4">
        <div className="text-2xl font-bold">{priceValue.amount}&nbsp;{priceValue.currency}</div>

        {quantity > 1 && (
          <div className="text-sm text-gray-600">
            Total: {calculateTotalPrice()}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Available Dates
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < new Date() ||
                    isDateBooked(date) ||
                    isDateUnavailable(date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {showTimeSelector && date && (
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Available Time
              </label>
              <Select
                onValueChange={(val) => setTime(availableTimes[parseInt(val)])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time">
                    {time ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{`${time.hour}:${time.minute} ${time.period}`}</span>
                      </div>
                    ) : (
                      "Select a time"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlots().map((timeSlot, index) => (
                    <SelectItem key={index} value={`${index}`}>
                      {`${timeSlot.hour}:${timeSlot.minute} ${timeSlot.period}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {rates.length > 1 && showTimeSelector && (
            <div>
              <label
                htmlFor="interval"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration
              </label>
              <Select onValueChange={(val) => handleSelect(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {rates.map((interval, index) => (
                    <SelectItem
                      key={index}
                      value={`${index}-${interval.duration}`}
                    >
                      {interval.duration >= 60
                        ? `${interval.duration / 60} hour${
                            interval.duration === 60 ? "" : "s"
                          }`
                        : `${interval.duration} minutes`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Quantity
            </label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={maxParticipants}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= maxParticipants) {
                    setQuantity(maxParticipants);
                  } else if (val <= 0) {
                    setQuantity(1);
                  } else setQuantity(val);
                }}
                className="w-16 mx-2 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= maxParticipants}
              >
                +
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              {" "}
              max participants: {maxParticipants}
            </p>
          </div>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
            onClick={handleAddToCart}
            disabled={!date || (showTimeSelector && !time)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAlreadyInCart ? "Already in Cart" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
