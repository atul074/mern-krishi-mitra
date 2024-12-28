import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";
import { setProductDetails } from "../../store/shop/products-slice";
//import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  //const { reviews } = useSelector((state) => state.shopReview);

//   useEffect(() => {
//     if (productDetails !== null) dispatch(getReviews(productDetails?._id));
//   }, [productDetails]);

//   const averageReview = reviews && reviews.length > 0 ?
//         reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length : 0;

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    const getCartItems = cartItems.items || [];
    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId
    );
    if (
      indexOfCurrentItem > -1 &&
      getCartItems[indexOfCurrentItem].quantity + 1 > getTotalStock
    ) {
      alert(`Only ${getCartItems[indexOfCurrentItem].quantity} can be added.`);
      return;
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then(() => dispatch(fetchCartItems(user?.id)));
    alert("Product is added to cart");
  };

//   const handleAddReview = () => {
//     dispatch(
//       addReview({
//         productId: productDetails?._id,
//         userId: user?.id,
//         userName: user?.userName,
//         reviewMessage: reviewMsg,
//         reviewValue: rating,
//       })
//     ).then(() => {
//       setRating(0);
//       setReviewMsg("");
//       dispatch(getReviews(productDetails?._id));
//       alert("Review added successfully!");
//     });
//   };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-lg max-h-full p-5 overflow-y-auto">
        <button
          className="absolut top-4 right-4 "
          onClick={handleDialogClose}
        >
          <svg class="w-8 h-8 text-gray-800 dark:text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
</svg>


        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-lg max-h-96">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full h-auto object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{productDetails?.title}</h1>
            <p className="text-gray-700 mt-4">{productDetails?.description}</p>
            <div className="flex justify-between items-center mt-4">
              <p
                className={`text-xl font-bold ${
                  productDetails?.salePrice > 0 ? "line-through text-red-600" : ""
                }`}
              >
                ${productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-lg font-bold text-green-600">
                  ${productDetails?.salePrice}
                </p>
              )}
            </div>
            <div className="mt-4">
              <p className="font-bold">Average Rating:</p>
              {/* <div className="flex items-center gap-2">
                <div className="text-yellow-400">
                  {"★".repeat(Math.round(averageReview))}
                  {"☆".repeat(5 - Math.round(averageReview))}
                </div>
                <span>({averageReview.toFixed(2)})</span>
              </div> */}
            </div>
            <button
              className={`w-full mt-6 py-2 px-4 rounded ${
                productDetails?.totalStock === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
              onClick={() =>
                handleAddToCart(
                  productDetails?._id,
                  productDetails?.totalStock
                )
              }
              disabled={productDetails?.totalStock === 0}
            >
              {productDetails?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-bold">Reviews</h2>
          <div className="mt-4 space-y-4 max-h-60 overflow-auto">
            {/* {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    {review.userName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{review.userName}</p>
                    <div className="text-yellow-400">
                      {"★".repeat(review.reviewValue)}
                      {"☆".repeat(5 - review.reviewValue)}
                    </div>
                    <p className="text-gray-600">{review.reviewMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )} */}
          </div>
          <div className="mt-4">
            <label className="block font-bold mb-2">Write a Review</label>
            <div className="flex gap-2">
              <div className="text-yellow-400">
                {"★".repeat(rating)}{" "}
                {"☆".repeat(5 - rating)}
              </div>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                max="5"
                min="1"
                className="w-12 border rounded px-1"
              />
            </div>
            <textarea
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              className="w-full mt-2 border rounded p-2"
              rows="3"
              placeholder="Write your review..."
            ></textarea>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded mt-2"
            //   onClick={handleAddReview}
              disabled={!reviewMsg.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsDialog;
