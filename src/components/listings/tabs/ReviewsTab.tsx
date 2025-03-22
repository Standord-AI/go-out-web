"use client";

import { useState } from "react";
import { Star, User, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  title?: string;
  content: string;
  isVerified?: boolean;
  helpful: number;
  unhelpful: number;
}

interface ReviewStat {
  average: number;
  total: number;
  recommendations?: number;
  recommendPercent?: number;
  distribution: { stars: number; percent: number }[];
  pros: { name: string; rating?: number }[];
  cons: { name: string }[];
}

interface ReviewsTabProps {
  reviews: Review[];
  stats: ReviewStat;
  onAddReview?: () => void;
  onHelpful?: (reviewId: string) => void;
  onUnhelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

export function ReviewsTab({
  reviews,
  stats,
  onAddReview,
  onHelpful,
  onUnhelpful,
  onReport,
}: ReviewsTabProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortOption, setSortOption] = useState("most-helpful");

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "most-helpful":
      default:
        return b.helpful - a.helpful;
    }
  });

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
                {stats.average.toFixed(1)}
              </div>
              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(stats.average)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {stats.total} Reviews
              </div>
              {stats.recommendations && (
                <div className="text-sm text-gray-500 mt-1">
                  {stats.recommendations} Recommendations
                </div>
              )}
              {stats.recommendPercent && (
                <div className="text-sm text-gray-500 mt-1">
                  {stats.recommendPercent}% Recommend
                </div>
              )}
            </div>

            {/* Rating Distribution */}
            <div className="space-y-4">
              {stats.distribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="text-sm w-fit">{item.stars} Stars</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-8 text-right">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>

            {/* Pros and Cons */}
            <div className="space-y-4 flex flex-col md:flex-row gap-4 justify-evenly items-start border-l-2 border-orange-400">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Pros</h3>
                <ul className="space-y-1 text-sm">
                  {stats.pros.map((pro, idx) => (
                    <li key={idx} className="text-gray-600">
                      - {pro.name} {pro.rating && `(${pro.rating})`}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Cons</h3>
                <ul className="space-y-1 text-sm">
                  {stats.cons.map((con, idx) => (
                    <li key={idx} className="text-gray-600">
                      - {con.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b-2 border-gray-200">
            <div className="flex items-center justify-center gap-6 mb-6">
              <h3 className="text-lg font-medium">Customer Reviews</h3>
              <Button variant="default" onClick={onAddReview}>
                Add a Review
              </Button>
            </div>
            <Select onValueChange={setSortOption} defaultValue={sortOption}>
              <SelectTrigger className="min-w-52">
                <SelectValue placeholder="Sort by: Most Helpful" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most-helpful">Most Helpful</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {sortedReviews
              .slice(0, showAllReviews ? sortedReviews.length : 5)
              .map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold">
                      {review.title || `Review by ${review.author}`}
                    </h4>
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

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <User className="h-4 w-4 mr-1" />
                    <span>{review.author}</span>
                    <span className="mx-2">•</span>
                    <span>{review.date}</span>
                    {review.isVerified && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-green-600">
                          Verified purchaser
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{review.content}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onHelpful && onHelpful(review.id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onUnhelpful && onUnhelpful(review.id)}
                    >
                      Not Helpful ({review.unhelpful})
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onReport && onReport(review.id)}
                    >
                      Report
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          {/* Load More Button */}
          {!showAllReviews && sortedReviews.length > 5 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAllReviews(true)}
                className="flex items-center gap-1"
              >
                Load more reviews
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
