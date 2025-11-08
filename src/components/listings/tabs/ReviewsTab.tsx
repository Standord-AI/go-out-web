"use client";

import { useState } from "react";
import {
  Star,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Review, ReviewStat } from "@/types";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

interface ReviewsTabProps {
  reviews: Review[];
  stats: ReviewStat;
  onAddReview?: (reviewData: { rating: number; description: string }) => void;
  onHelpful?: (reviewId: string) => void;
  onUnhelpful?: (reviewId: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  reviewsLoading: boolean;
}

export function ReviewsTab({
  reviews,
  stats,
  onAddReview,
  onHelpful,
  onUnhelpful,
  sortOption,
  onSortChange,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  reviewsLoading,
}: ReviewsTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");

  const handleDialogOpen = () => {
    !user ? router.push("/auth/login") : setIsDialogOpen(true);
  };

  const [errors, setErrors] = useState<{
    rating?: string;
    description?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (rating === 0) newErrors.rating = "Please select a rating.";
    if (!description.trim()) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAddReview?.({
      rating,
      description: description.trim(),
    });

    // Reset dialog and form
    setRating(0);
    setDescription("");
    setErrors({});
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>

        {/* Review Stats Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-orange-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Overall Rating */}
            <div className="flex flex-col items-center justify-center border-r-2 border-orange-400">
              <div className="text-5xl font-bold mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(stats.averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {stats.totalReviews} Reviews
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-4">
              {stats.distribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-sm w-fit">{item.rating} Stars</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-8 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-gray-200 pb-4 gap-4">
            <div className="flex items-center w-full sm:w-fit justify-between sm:justify-center sm:gap-6">
              <h3 className="text-lg font-medium">Customer Reviews</h3>
              <Button variant="default" onClick={handleDialogOpen} className="w-fit">
                Add a Review
              </Button>
            </div>
            <Select onValueChange={onSortChange} value={sortOption}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue placeholder="Sort by: Most Helpful" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-helpful">Most Helpful</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Individual Reviews */}
          {reviewsLoading ? (
            <div className="flex h-[500px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) =>
                (() => {
                  const isHelpful =
                    user && review.helpfulUsers?.includes(user._id);
                  const isUnhelpful =
                    user && review.unhelpfulUsers?.includes(user._id);
                  return (
                    <div
                      key={review._id}
                      className="border-b border-gray-200 pb-6 flex flex-col gap-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center text-zinc-600">
                          <UserCircle />
                          <span className="font-medium text-lg">
                            {review.userId.firstName}&nbsp;
                            {review.userId.lastName}
                          </span>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold">
                        {review.description ||
                          `Rated by ${review.userId.firstName} ${review.userId.lastName}`}
                      </h4>
                      <span className="text-sm text-muted-foreground font-medium">
                        {new Date(review.updatedAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center gap-1 ${
                            isHelpful ? "text-primary" : ""
                          }`}
                          onClick={() =>
                            !user
                              ? router.push("/auth/login")
                              : onHelpful?.(review._id)
                          }
                          disabled={isHelpful != null ? isHelpful : false}
                        >
                          <ThumbsUp className="size-4" />
                          Helpful ({review.helpfulCount})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center gap-1 ${
                            isUnhelpful ? "text-destructive" : ""
                          }`}
                          onClick={() =>
                            !user
                              ? router.push("/auth/login")
                              : onUnhelpful?.(review._id)
                          }
                          disabled={isUnhelpful != null ? isUnhelpful : false}
                        >
                          <ThumbsDown className="size-4" />
                          Not Helpful ({review.unhelpfulCount})
                        </Button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={onLoadMore}
                className="flex items-center gap-1"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <span className="flex gap-2 items-center">
                    <p>Loading</p>
                    <Spinner size="sm" />
                  </span>
                ) : (
                  "Load more reviews"
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ADD REVIEW DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Your Review</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Section */}
            <div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors duration-150 ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
              {errors.rating && (
                <p className="text-sm font-medium text-red-500 text-center">
                  {errors.rating}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2">Description</Label>
              <Textarea
                placeholder="Write your review..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
              {errors.description && !description.trim() && (
                <p className="text-sm font-medium text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
