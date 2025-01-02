function StarRatingComponent({ rating, handleRatingChange }) {
    const starSVG = (isFilled) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFilled ? "yellow" : "none"}
        stroke={isFilled ? "yellow" : "black"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M12 .587l3.668 7.429L24 9.742l-6 5.844 1.417 8.274L12 19.623 4.583 23.86 6 15.585l-6-5.843 8.332-1.726L12 .587z" />
      </svg>
    );
  
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              star <= rating
                ? "bg-black text-yellow-500"
                : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={handleRatingChange ? () => handleRatingChange(star) : null}
          >
            {starSVG(star <= rating)}
          </div>
        ))}
      </div>
    );
  }
  
  export default StarRatingComponent;
  