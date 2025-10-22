"use client";

import { useState, useEffect } from "react";
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
  onDateChange: (date: Date) => void; // Callback to fetch availability
  isDateFullyBooked: boolean;
}

export interface BookingData {
  quantity: number;
  date: Date | undefined;
  time?: ApiTime;
  duration: number;
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
  onDateChange,
  isDateFullyBooked,
}: BookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<ApiTime>();
  const [selectedRate, setSelectedRate] = useState<ApiRate | undefined>(
    rates.find(
      (r) => r.duration === Math.min(...rates.map((rate) => rate.duration))
    )
  );
  const { addItem, isInCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Reset time when date changes
    setTime(undefined);
    if (date) {
      onDateChange(date);
    }
  }, [date]);

  const handleRateSelect = (rateString: string) => {
    const rate = rates.find((r) => r.duration === parseInt(rateString));
    setSelectedRate(rate);
  };

  // Check if a date is disabled (not in the available list)
  const isDateUnavailable = (d: Date) => {
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return !availableDates.some(
      (availableDate) =>
        new Date(availableDate).toDateString() === dateOnly.toDateString()
    );
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedRate) return "N/A";
    return (selectedRate.price.amount * quantity).toLocaleString("en-US", {
      style: "currency",
      currency: selectedRate.price.currency,
    });
  };

  // Handle booking submission
  const handleBooking = () => {
    if (onBooking && date && selectedRate) {
      onBooking({
        quantity,
        date,
        time: showTimeSelector ? time : undefined,
        duration: selectedRate.duration,
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!date || !selectedRate) return;

    const cartItem: CartItem = {
      id: `${experienceId}-${date.toISOString()}-${time?.hour}:${time?.minute}${
        time?.period
      }`,
      experienceId,
      title,
      image,
      price: selectedRate.price.amount,
      currency: selectedRate.price.currency,
      quantity,
      date,
      time,
      location,
      duration: selectedRate.duration.toString(),
      maxParticipants,
    };

    addItem(cartItem);
  };

  const isAlreadyInCart = isInCart(experienceId);

  return (
    <Card className="p-6 shadow-lg rounded-lg sticky top-24">
      <CardContent className="p-0 space-y-4">
        <div className="text-2xl font-bold">
          {selectedRate?.price.amount}&nbsp;{selectedRate?.price.currency}
        </div>

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
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0)) ||
                    isDateUnavailable(d)
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
                onValueChange={(val) => setTime(JSON.parse(val))}
                value={time ? JSON.stringify(time) : undefined}
                disabled={isDateFullyBooked}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      isDateFullyBooked ? "No times available" : "Select a time"
                    }
                  >
                    {time ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{`${time.hour}:${time.minute} ${time.period}`}</span>
                      </div>
                    ) : isDateFullyBooked ? (
                      "No times available"
                    ) : (
                      "Select a time"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((timeSlot, index) => (
                    <SelectItem key={index} value={JSON.stringify(timeSlot)}>
                      {`${timeSlot.hour}:${timeSlot.minute} ${timeSlot.period}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {rates.length > 0 && (
            <div>
              <label
                htmlFor="interval"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration
              </label>
              <Select
                onValueChange={handleRateSelect}
                defaultValue={selectedRate?.duration.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {rates.map((rate) => (
                    <SelectItem
                      key={rate.duration}
                      value={rate.duration.toString()}
                    >
                      {rate.duration >= 60
                        ? `${rate.duration / 60} hour${
                            rate.duration === 60 ? "" : "s"
                          }`
                        : `${rate.duration} minutes`}
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
            disabled={!date || (showTimeSelector && !time) || isDateFullyBooked}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAlreadyInCart ? "Already in Cart" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
