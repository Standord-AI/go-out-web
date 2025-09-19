import { z } from "zod";

// Basic reusable schemas
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");
const urlSchema = z.string().url("Invalid URL format");
const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");
const emailSchema = z.string().email("Invalid email format");
const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");
const priceSchema = z
  .number()
  .positive("Price must be positive")
  .finite("Price must be finite");
const dateSchema = z.coerce.date();
const percentageSchema = z.number().min(0).max(100);

// Social Media Schema
export const socialMediaSchema = z.object({
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
});

// Business Profile Schema
export const businessProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: urlSchema.optional(),
  socialMedia: socialMediaSchema.optional(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]),
  verificationDocuments: z.array(z.string()),
  commissionRate: percentageSchema,
});

// Stripe Details Schema
export const stripeDetailsSchema = z.object({
  customerId: z.string(),
});

// Notification Preferences Schema
export const notificationPreferencesSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  push: z.boolean(),
});

// User Schema
export const userSchema = z.object({
  _id: objectIdSchema,
  email: emailSchema,
  passwordHash: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["customer", "business"]),
  phone: phoneSchema.optional(),
  profileImage: urlSchema.optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  lastLogin: dateSchema,
  isVerified: z.boolean(),
  stripe: stripeDetailsSchema.optional(),
  businessProfile: businessProfileSchema.optional(),
  savedExperiences: z.array(objectIdSchema),
  notificationPreferences: notificationPreferencesSchema,
  clerkId: z.string().optional(),
});

// Location Schema
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const locationSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  coordinates: coordinatesSchema,
});

// Duration Schema
export const durationSchema = z.object({
  length: z.number().positive(),
  unit: z.enum(["minutes", "hours", "days"]),
});

// Time Slot Config Schema
export const timeSlotConfigSchema = z.object({
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  capacity: z.number().int().positive().optional(),
});

// Slots Schema
export const slotsSchema = z.object({
  defaultCapacity: z.number().int().positive(),
  availableDays: z.array(z.number().min(0).max(6)),
  availableTimeSlots: z.array(timeSlotConfigSchema),
  bookingLeadTime: z.number().int().nonnegative(),
  bookingWindow: z.number().int().positive(),
});

// Cancellation Policy Schema
export const cancellationPolicySchema = z.object({
  type: z.enum(["flexible", "moderate", "strict"]),
  description: z.string().min(1, "Description is required"),
});

// Rating Schema
export const ratingSchema = z.object({
  average: z.number().min(0).max(5),
  count: z.number().int().nonnegative(),
});

// Experience Schema
export const experienceSchema = z.object({
  _id: objectIdSchema,
  ownerId: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: slugSchema,
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string().min(1)),
  price: priceSchema,
  currency: z.string().length(3), // ISO 4217 currency code
  location: locationSchema,
  duration: durationSchema,
  slots: slotsSchema,
  minParticipants: z.number().int().positive(),
  maxParticipants: z.number().int().positive(),
  unavailableDates: z.array(dateSchema),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  occasion: z.array(z.string()),
  recipient: z.array(z.string()),
  activity: z.string(),
  highlights: z.array(z.string()),
  included: z.array(z.string()),
  excluded: z.array(z.string()),
  additionalInfo: z.string().optional(),
  cancellationPolicy: cancellationPolicySchema,
  rating: ratingSchema,
  status: z.enum(["draft", "published", "archived"]),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  publishedAt: dateSchema.optional(),
});

// Booking Time Slot Schema
export const bookingTimeSlotSchema = z.object({
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
});

// Booking Participant Schema
export const bookingParticipantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  specialRequirements: z.string().optional(),
});

// Booking Pricing Schema
export const bookingPricingSchema = z.object({
  basePrice: priceSchema,
  taxes: z.number().nonnegative(),
  fees: z.number().nonnegative(),
  discounts: z.number().nonnegative(),
  total: priceSchema,
  currency: z.string().length(3),
});

// Payment Details Schema
export const paymentDetailsSchema = z.object({
  paymentMethod: z.enum(["card", "paypal"]),
  transactionId: z.string(),
  receiptUrl: urlSchema,
});

// Cancellation Details Schema
export const cancellationDetailsSchema = z.object({
  cancelledBy: z.enum(["customer", "business", "system"]),
  cancellationReason: z.string(),
  cancellationDate: dateSchema,
  refundAmount: z.number().nonnegative(),
});

// Booking Schema
export const bookingSchema = z.object({
  _id: objectIdSchema,
  experienceId: objectIdSchema,
  customerId: objectIdSchema,
  businessId: objectIdSchema,
  bookingReference: z.string(),
  date: dateSchema,
  timeSlot: bookingTimeSlotSchema,
  quantity: z.number().int().positive(),
  participants: z.array(bookingParticipantSchema),
  pricing: bookingPricingSchema,
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  paymentStatus: z.enum(["pending", "paid", "refunded", "failed"]),
  paymentDetails: paymentDetailsSchema,
  cancellation: cancellationDetailsSchema.optional(),
  cancellationDeadline: dateSchema,
  specialRequests: z.string().optional(),
  notesToBusiness: z.string().optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// Review Response Schema
export const reviewResponseSchema = z.object({
  content: z.string().min(1, "Content is required"),
  createdAt: dateSchema,
});

// Review Schema
export const reviewSchema = z.object({
  _id: objectIdSchema,
  experienceId: objectIdSchema,
  bookingId: objectIdSchema,
  authorId: objectIdSchema,
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  images: z.array(z.string()).optional(),
  rating: z.number().min(1).max(5),
  isVerified: z.boolean(),
  helpfulCount: z.number().int().nonnegative(),
  unhelpfulCount: z.number().int().nonnegative(),
  response: reviewResponseSchema.optional(),
  reportCount: z.number().int().nonnegative(),
  isHidden: z.boolean(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// Time Slot Schema
export const timeSlotSchema = z.object({
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  totalCapacity: z.number().int().positive(),
  bookedCount: z.number().int().nonnegative(),
  isAvailable: z.boolean(),
});

// Availability Schema
export const availabilitySchema = z.object({
  _id: objectIdSchema,
  experienceId: objectIdSchema,
  date: dateSchema,
  timeSlots: z.array(timeSlotSchema),
  isBlocked: z.boolean(),
  blockReason: z.string().optional(),
  updatedAt: dateSchema,
});

// Category Schema
export const categorySchema = z.object({
  _id: objectIdSchema,
  name: z.string().min(1, "Name is required"),
  slug: slugSchema,
  description: z.string(),
  image: z.string(),
  active: z.boolean(),
  featuredOrder: z.number().int().optional(),
});

// Transaction Metadata Schema
export const transactionMetadataSchema = z.object({
  paymentIntentId: z.string().optional(),
  chargeId: z.string().optional(),
  transferId: z.string().optional(),
  refundId: z.string().optional(),
  refundReason: z.string().optional(),
  payoutId: z.string().optional(),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
  receiptUrl: urlSchema.optional(),
  customerEmail: emailSchema.optional(),
  last4: z.string().length(4).optional(),
  cardBrand: z.string().optional(),
});

// Transaction Schema
export const transactionSchema = z.object({
  _id: objectIdSchema,
  bookingId: objectIdSchema,
  customerId: objectIdSchema,
  businessId: objectIdSchema,
  amount: priceSchema,
  currency: z.string().length(3),
  type: z.enum(["payment", "refund", "payout"]),
  status: z.enum(["pending", "completed", "failed"]),
  paymentMethod: z.enum(["card", "paypal", "bank_transfer"]),
  paymentGateway: z.enum(["stripe", "paypal"]),
  transactionId: z.string(),
  fee: z.number().nonnegative(),
  businessPayout: z.number().nonnegative(),
  description: z.string(),
  metadata: transactionMetadataSchema,
  createdAt: dateSchema,
});

// Notification Type Schema
export const notificationTypeSchema = z.enum([
  "booking_confirmation",
  "booking_reminder",
  "booking_cancelled",
  "review_received",
  "review_response",
  "payment_successful",
  "payment_failed",
  "payout_processed",
  "experience_update",
]);

// Notification Schema
export const notificationSchema = z.object({
  _id: objectIdSchema,
  userId: objectIdSchema,
  type: notificationTypeSchema,
  priority: z.enum(["high", "medium", "low"]),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  relatedId: z.string(),
  actionUrl: urlSchema.optional(),
  read: z.boolean(),
  delivered: z.boolean(),
  createdAt: dateSchema,
});

// Blog Schema
export const blogSchema = z.object({
  _id: objectIdSchema.optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string(),
  slug: slugSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
  imageUrl: urlSchema.optional(),
  tags: z.array(z.string()).optional(),
  summary: z.string().optional(),
  readTime: z.string().optional(),
  featured: z.boolean().optional(),
});
