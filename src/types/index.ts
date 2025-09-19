export interface Listing {
  id: string;
  slug: string;
  imageSrc: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  activity: string;
  recipient: string;
  occasion: string;
}

// blog
export interface Blog {
  _id?: string;
  title: string;
  content: string;
  author: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  tags?: string[];
  summary?: string;
  readTime?: string;
  featured?: boolean;
}

// users
export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface BusinessProfile {
  businessName: string;
  description: string;
  website?: string;
  socialMedia?: SocialMedia;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments: string[];
  commissionRate: number;
}

export interface StripeDetails {
  customerId: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface User {
  _id: string;  // MongoDB ObjectId
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'business';
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  stripe?: StripeDetails;
  businessProfile?: BusinessProfile;
  savedExperiences: string[];  // Array of Experience ObjectIds
  notificationPreferences: NotificationPreferences;
  clerkId?: string;
}

// Experiences
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: Coordinates;
}

export interface Duration {
  length: number;
  unit: 'minutes' | 'hours' | 'days';
}

export interface TimeSlotConfig {
  startTime: string;
  endTime: string;
  capacity?: number;
}

export interface Slots {
  defaultCapacity: number;
  availableDays: number[]; // 0-6 representing days of week
  availableTimeSlots: TimeSlotConfig[];
  bookingLeadTime: number;
  bookingWindow: number;
}

export interface CancellationPolicy {
  type: 'flexible' | 'moderate' | 'strict';
  description: string;
}

export interface Rating {
  average: number;
  count: number;
}

export interface Experience {
  _id: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  location: Location;
  duration: Duration;
  slots: Slots;
  minParticipants: number;
  maxParticipants: number;
  unavailableDates: Date[];
  categories: string[];
  tags: string[];
  occasion: string[];
  recipient: string[];
  activity: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  additionalInfo?: string;
  cancellationPolicy: CancellationPolicy;
  rating: Rating;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Bookings
export interface BookingTimeSlot {
  startTime: string;
  endTime: string;
}

export interface BookingParticipant {
  name: string;
  email: string;
  specialRequirements?: string;
}

export interface BookingPricing {
  basePrice: number;
  taxes: number;
  fees: number;
  discounts: number;
  total: number;
  currency: string;
}

export interface PaymentDetails {
  paymentMethod: 'card' | 'paypal';
  transactionId: string;
  receiptUrl: string;
}

export interface CancellationDetails {
  cancelledBy: 'customer' | 'business' | 'system';
  cancellationReason: string;
  cancellationDate: Date;
  refundAmount: number;
}

export interface Booking {
  _id: string;  // MongoDB ObjectId
  experienceId: string;  // Reference to experience
  customerId: string;  // Reference to customer user
  businessId: string;  // Reference to business owner
  bookingReference: string;
  date: Date;
  timeSlot: BookingTimeSlot;
  quantity: number;
  participants: BookingParticipant[];
  pricing: BookingPricing;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentDetails: PaymentDetails;
  cancellation?: CancellationDetails;
  cancellationDeadline: Date;
  specialRequests?: string;
  notesToBusiness?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Reviews
export interface ReviewResponse {
  content: string;
  createdAt: Date;
}

export interface Review {
  _id: string;  // MongoDB ObjectId
  experienceId: string;  // Reference to experience
  bookingId: string;  // Reference to booking
  authorId: string;  // Reference to user
  title: string;
  content: string;
  images?: string[];
  rating: number;  // 1-5
  isVerified: boolean;  // Confirmed purchase
  helpfulCount: number;
  unhelpfulCount: number;
  response?: ReviewResponse;  // Business owner response
  reportCount: number;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}


// availabilitues
export interface TimeSlot {
  startTime: string;      // Format: "HH:mm" e.g., "09:00"
  endTime: string;        // Format: "HH:mm" e.g., "11:00"
  totalCapacity: number;  // Maximum number of bookings allowed
  bookedCount: number;    // Current number of bookings
  isAvailable: boolean;   // Quick check for availability
}

export interface Availability {
  _id: string;           // MongoDB ObjectId
  experienceId: string;  // Reference to experience
  date: Date;            // The date this availability is for
  timeSlots: TimeSlot[];
  isBlocked: boolean;    // Owner manually blocked this date
  blockReason?: string;  // Optional reason for blocking
  updatedAt: Date;       // Last modification timestamp
}

// Categories
export interface Category {
  _id: string;            // MongoDB ObjectId
  name: string;           // e.g., "adventures", "day-outs"
  slug: string;           // URL-friendly name
  description: string;
  image: string;          // URL to category image
  active: boolean;        // Whether category is visible
  featuredOrder?: number; // Optional ordering for homepage
}


// Transactions
export interface TransactionMetadata {
  paymentIntentId?: string;
  chargeId?: string;
  transferId?: string;
  refundId?: string;
  refundReason?: string;
  payoutId?: string;
  errorCode?: string;
  errorMessage?: string;
  receiptUrl?: string;
  customerEmail?: string;
  last4?: string;
  cardBrand?: string;
}

export interface Transaction {
  _id: string;           // MongoDB ObjectId
  bookingId: string;     // Reference to booking
  customerId: string;    // Reference to customer user
  businessId: string;    // Reference to business owner
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'payout';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  paymentGateway: 'stripe' | 'paypal';
  transactionId: string;  // External payment provider ID
  fee: number;            // Platform fee
  businessPayout: number; // Amount paid to business
  description: string;
  metadata: TransactionMetadata;
  createdAt: Date;
}

// Notifications
export interface Notification {
  _id: string;          // MongoDB ObjectId
  userId: string;       // Recipient user
  type: NotificationType;
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  relatedId: string;    // ID of related entity (booking, review, etc.)
  actionUrl?: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'booking_confirmation'
  | 'booking_reminder'
  | 'booking_cancelled'
  | 'review_received'
  | 'review_response'
  | 'payment_successful'
  | 'payment_failed'
  | 'payout_processed'
  | 'experience_update';

// API Response Types
export interface ApiLocation {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  city: string;
  state: string;
  country: string;
  address: string;
}

export interface ApiPrice {
  amount: number;
  currency: string;
}

export interface ApiAgeRestrictions {
  minAge: number;
  maxAge: number | null;
}

export interface ApiCategory {
  _id: string;
  name: string;
  description: string;
  image: string;
}

export interface ApiExperience {
  _id: string;
  refNo: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  additionalInfo: string[];
  images: string[];
  maxParticipants: number;
  physicalRequirements: string[];
  languages: string[];
  status: string;
  expiresAt: string;
  isActive: boolean;
  archived: boolean;
  category: ApiCategory;
  tags: string[];
  occassions: string[];
  recipients: string[];
  activities: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  location: ApiLocation;
  price: ApiPrice;
  ageRestrictions: ApiAgeRestrictions;
}

export interface ApiPagination {
  currentPage: number;
  totalPages: number;
  totalExperiences: number;
  limit: number;
}

export interface CategoryExperiencesResponse {
  category: ApiCategory;
  experiences: ApiExperience[];
  pagination: ApiPagination;
}

// Cart Types
export interface CartItem {
  id: string;
  experienceId: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  quantity: number;
  date: Date;
  time?: string;
  location: {
    city: string;
    country: string;
  };
  duration: string;
  maxParticipants: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
}

// Checkout Types
export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
}
