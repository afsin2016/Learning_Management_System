import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, max = 5, size = 'w-4 h-4', showScore = true, reviewsCount }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[...Array(max)].map((_, i) => {
          const fillPercentage = Math.max(0, Math.min(1, rating - i));
          return (
            <div key={i} className="relative">
              <Star className={`${size} text-slate-200 fill-slate-200`} />
              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${fillPercentage * 100}%` }}
                >
                  <Star className={`${size} text-amber-400 fill-amber-400`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-bold text-amber-600 ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-slate-400">({reviewsCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
