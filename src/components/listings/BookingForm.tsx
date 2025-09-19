"use client";

import { useState } from "react";
import { Gift, ShoppingCart } from "lucide-react";
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
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  experienceId: string;
  title: string;
  image: string;
  price: string;
  location: {
    city: string;
    country: string;
  };
  duration: string;
  maxParticipants: number;
  onBooking?: (data: BookingData) => void;
  showTimeSelector?: boolean;
  timeIntervals?: number[]; // Time intervals in minutes, e.g. [30, 60, 120]
  bookedDates?: Date[]; // Dates that are already booked
  bookedTimes?: { date: Date; times: string[] }[]; // Times that are already booked on specific dates
}

export interface BookingData {
  quantity: number;
  date: Date | undefined;
  time?: string;
  totalPrice: string;
}

export function BookingForm({
  experienceId,
  title,
  image,
  price,
  location,
  duration,
  maxParticipants,
  onBooking,
  showTimeSelector = false,
  timeIntervals = [60], // Default 1 hour
  bookedDates = [],
  bookedTimes = [],
}: BookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const { addItem, isInCart } = useCart();
  const router = useRouter();
  
  // Format price to number for calculations
  const priceValue = parseFloat(price.replace(/[^0-9.]/g, ''));
  
  // Generate available time slots based on time intervals
  const generateTimeSlots = (intervalMinutes: number) => {
    const slots = [];
    const totalMinutesInDay = 24 * 60;
    
    for (let minute = 0; minute < totalMinutesInDay; minute += intervalMinutes) {
      const hours = Math.floor(minute / 60);
      const mins = minute % 60;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMins = mins.toString().padStart(2, '0');
      slots.push(`${formattedHours}:${formattedMins} ${ampm}`);
    }
    
    return slots;
  };
  
  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!date) return [];
    
    // Generate all possible time slots based on the smallest interval
    const allTimeSlots = generateTimeSlots(Math.min(...timeIntervals));
    
    // Filter out booked times for the selected date
    const bookedTimesForDate = bookedTimes.find(
      (bookingDate) => bookingDate.date.toDateString() === date.toDateString()
    );
    
    if (bookedTimesForDate) {
      return allTimeSlots.filter(
        (slot) => !bookedTimesForDate.times.includes(slot)
      );
    }
    
    return allTimeSlots;
  };

  // Check if a date is disabled (fully booked)
  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) => bookedDate.toDateString() === date.toDateString()
    );
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    return (priceValue * quantity).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  // Handle booking submission
  const handleBooking = () => {
    if (onBooking && date) {
      onBooking({
        quantity,
        date,
        time: showTimeSelector ? time : undefined,
        totalPrice: calculateTotalPrice()
      });
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!date) return;

    const cartItem: CartItem = {
      id: `${experienceId}-${date.toISOString()}-${time || 'default'}`,
      experienceId,
      title,
      image,
      price: priceValue,
      currency: 'USD',
      quantity,
      date,
      time,
      location,
      duration,
      maxParticipants
    };

    addItem(cartItem);
  };

  const isAlreadyInCart = isInCart(experienceId);

  return (
    <Card className="p-6 shadow-lg rounded-lg sticky top-24">
      <CardContent className="p-0 space-y-4">
        <div className="text-2xl font-bold">{price}</div>
        
        {quantity > 1 && (
          <div className="text-sm text-gray-600">
            Total: {calculateTotalPrice()}
          </div>
        )}

        <div className="space-y-4">
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
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-16 mx-2 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Date
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
                    date < new Date() || isDateBooked(date)
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
                Select Time
              </label>
              <Select onValueChange={setTime} value={time}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time">
                    {time ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{time}</span>
                      </div>
                    ) : (
                      "Select a time"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlots().map((timeSlot) => (
                    <SelectItem key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {timeIntervals.length > 1 && showTimeSelector && (
            <div>
              <label
                htmlFor="interval"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duration
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {timeIntervals.map((interval) => (
                    <SelectItem key={interval} value={interval.toString()}>
                      {interval >= 60 
                        ? `${interval / 60} hour${interval === 60 ? '' : 's'}`
                        : `${interval} minutes`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
            onClick={handleAddToCart}
            disabled={!date || (showTimeSelector && !time)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAlreadyInCart ? 'Already in Cart' : 'Add to Cart'}
          </Button>

          <Button
            variant="outline"
            className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 py-3"
            onClick={() => router.push('/cart')}
          >
            <Gift className="mr-2 h-4 w-4" />
            View Cart ({quantity})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
