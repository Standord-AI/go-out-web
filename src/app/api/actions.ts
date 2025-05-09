import { User } from "@/types";
import { validateData } from "@/validations/utils";
import { userSchema } from "@/validations/schemas";
import {
  validators,
  partialValidators,
  formatValidationErrors,
} from "@/validations/utils";
import { ObjectId } from "mongodb";

const createUser = async (user: User) => {
  const [isValid, validatedUser, errors] = validateData(userSchema, user);
  if (!isValid) {
    throw new Error(errors?.message);
  }
  return validatedUser;
};

export { createUser };

/**
 * Test utility to validate experience data
 */
export async function testExperienceValidation() {
  // Test valid experience data
  const validExperience = {
    _id: new ObjectId().toString(),
    ownerId: "user_2uh52rUj4SJVBUyFvYFZb88B947",
    title: "Mountain Hiking Adventure",
    slug: "mountain-hiking-adventure",
    description:
      "Experience the thrill of mountain hiking with experienced guides.",
    images: ["/images/hiking1.jpg", "/images/hiking2.jpg"],
    price: 149.99,
    currency: "USD",
    location: {
      address: "123 Mountain Trail",
      city: "Boulder",
      state: "CO",
      country: "USA",
      postalCode: "80302",
      coordinates: {
        latitude: 40.015,
        longitude: -105.2705,
      },
    },
    duration: {
      length: 4,
      unit: "hours",
    },
    slots: {
      defaultCapacity: 8,
      availableDays: [1, 2, 3, 4, 5], // Monday to Friday
      availableTimeSlots: [
        { startTime: "09:00", endTime: "13:00", capacity: 8 },
        { startTime: "14:00", endTime: "18:00", capacity: 8 },
      ],
      bookingLeadTime: 24,
      bookingWindow: 30,
    },
    minParticipants: 2,
    maxParticipants: 8,
    unavailableDates: [new Date("2024-12-25"), new Date("2025-01-01")],
    categories: ["outdoor", "adventure"],
    tags: ["hiking", "nature", "exercise"],
    occasion: ["group-activity", "team-building"],
    recipient: ["adults", "groups"],
    activity: "hiking",
    highlights: [
      "Professional hiking guides",
      "Scenic mountain views",
      "All safety equipment included",
    ],
    included: ["Guide", "Safety equipment", "Water"],
    excluded: ["Transportation", "Food"],
    additionalInfo: "Please wear appropriate hiking shoes and clothing",
    cancellationPolicy: {
      type: "moderate",
      description: "50% refund up to 3 days before the experience",
    },
    rating: {
      average: 4.8,
      count: 25,
    },
    status: "published",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  };

  // Test invalid experience data
  const invalidExperience = {
    _id: "invalid-id", // Invalid ObjectId format
    title: "", // Empty title
    price: -100, // Negative price
    location: {
      // Missing required fields
      address: "123 Street",
    },
  };

  // Test partial update data
  const partialUpdate = {
    title: "Updated Mountain Hiking Adventure",
    price: 159.99,
  };

  console.log("\n=== Testing Experience Validation ===\n");

  // Test valid experience
  const [isValid, validData, validationErrors] =
    validators.experience(validExperience);
  console.log("Valid Experience Test:");
  console.log("Is Valid:", isValid);
  console.log(
    "Validation Errors:",
    validationErrors ? formatValidationErrors(validationErrors) : "None"
  );

  // Test invalid experience
  const [isInvalidValid, invalidData, invalidValidationErrors] =
    validators.experience(invalidExperience);
  console.log("\nInvalid Experience Test:");
  console.log("Is Valid:", isInvalidValid);
  console.log(
    "Validation Errors:",
    invalidValidationErrors
      ? formatValidationErrors(invalidValidationErrors)
      : "None"
  );

  // Test partial update
  const [isPartialValid, partialData, partialValidationErrors] =
    partialValidators.experience(partialUpdate);
  console.log("\nPartial Update Test:");
  console.log("Is Valid:", isPartialValid);
  console.log(
    "Validation Errors:",
    partialValidationErrors
      ? formatValidationErrors(partialValidationErrors)
      : "None"
  );
}

/**
 * Test utility to validate booking data
 */
export async function testBookingValidation() {
  // Test valid booking data
  const validBooking = {
    _id: new ObjectId().toString(),
    experienceId: new ObjectId().toString(),
    customerId: new ObjectId().toString(),
    businessId: new ObjectId().toString(),
    bookingReference: "BOOK-2024-001",
    date: new Date("2024-05-15"),
    timeSlot: {
      startTime: "09:00",
      endTime: "13:00",
    },
    quantity: 2,
    participants: [
      {
        name: "John Doe",
        email: "john@example.com",
        specialRequirements: "Vegetarian meal",
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
      },
    ],
    pricing: {
      basePrice: 299.98,
      taxes: 30.0,
      fees: 15.0,
      discounts: 0,
      total: 344.98,
      currency: "USD",
    },
    status: "confirmed",
    paymentStatus: "paid",
    paymentDetails: {
      paymentMethod: "card",
      transactionId: "txn_123456",
      receiptUrl: "https://example.com/receipt/123",
    },
    cancellationDeadline: new Date("2024-05-12"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Test invalid booking data
  const invalidBooking = {
    _id: "invalid-id",
    quantity: 0, // Invalid quantity
    participants: [], // Empty participants
    pricing: {
      basePrice: -100, // Negative price
    },
  };

  console.log("\n=== Testing Booking Validation ===\n");

  // Test valid booking
  const [isValid, validData, validationErrors] =
    validators.booking(validBooking);
  console.log("Valid Booking Test:");
  console.log("Is Valid:", isValid);
  console.log(
    "Validation Errors:",
    validationErrors ? formatValidationErrors(validationErrors) : "None"
  );

  // Test invalid booking
  const [isInvalidValid, invalidData, invalidValidationErrors] =
    validators.booking(invalidBooking);
  console.log("\nInvalid Booking Test:");
  console.log("Is Valid:", isInvalidValid);
  console.log(
    "Validation Errors:",
    invalidValidationErrors
      ? formatValidationErrors(invalidValidationErrors)
      : "None"
  );
}

/**
 * Main test function to run all validation tests
 */
export async function testValidations() {
  try {
    console.log("Starting validation tests...\n");

    await testExperienceValidation();
    await testBookingValidation();

    console.log("\nValidation tests completed.");
  } catch (error) {
    console.error("Error running validation tests:", error);
  }
}

// Example usage in development:
if (process.env.NODE_ENV === "development") {
  // Uncomment the line below to run tests
  // testValidations();
}
