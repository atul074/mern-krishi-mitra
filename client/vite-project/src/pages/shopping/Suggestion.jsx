import ProductDetailsDialog from "../../components/shopping/product-details";
import ShoppingProductTile from "../../components/shopping/product-tile";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";
import { fetchProductDetails, fetchSuggestedProducts } from "../../store/shop/products-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function SuggestionProducts() {
    const STATES = ["Maharashtra", "Punjab", "Uttar Pradesh", "Bihar"];
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const CROPS = ["Wheat", "Rice", "Corn", "Sugarcane", "Cotton"];

    const [state, setState] = useState("");
    const [month, setMonth] = useState("");
    const [crop, setCrop] = useState("");
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);

    const dispatch = useDispatch();
    const { productDetails, productList, isLoading } = useSelector((state) => state.shopProducts);
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);

    useEffect(() => {
        setIsFormComplete(state && month && crop);
    }, [state, month, crop]);

    const handleGetSuggestions = () => {
        if (isFormComplete) {
            dispatch(fetchSuggestedProducts({ state, month, crop }));
        }
    };

    function handleAddtoCart(getCurrentProductId, getTotalStock) {
        let getCartItems = cartItems.items || [];
        const index = getCartItems.findIndex(
            (item) => item.productId === getCurrentProductId
        );
        if (index > -1) {
            const qty = getCartItems[index].quantity;
            if (qty + 1 > getTotalStock) {
                alert(`Only ${qty} quantity can be added for this item`);
                return;
            }
        }

        dispatch(
            addToCart({
                userId: user?.id,
                productId: getCurrentProductId,
                quantity: 1,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                alert("Product is added to cart");
            }
        });
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f7fdf5] to-[#e6f4e6] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">                       Crop Input Recommendations 🌾
                    </h1>
                    <p className="text-gray-700 text-sm">
                        Select your details to get personalized product suggestions 
                    </p>
                </div>

                {/* Dropdowns + Button */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-8 border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full border-2 border-green-200 rounded px-3 py-2 focus:outline-none focus:border-green-500"
                        >
                            <option value="">Select State</option>
                            {STATES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-full border-2 border-green-200 rounded px-3 py-2 focus:outline-none focus:border-green-500"
                        >
                            <option value="">Select Month</option>
                            {MONTHS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select
                            value={crop}
                            onChange={(e) => setCrop(e.target.value)}
                            className="w-full border-2 border-green-200 rounded px-3 py-2 focus:outline-none focus:border-green-500"
                        >
                            <option value="">Select Crop</option>
                            {CROPS.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleGetSuggestions}
                            disabled={!isFormComplete}
                            className={`px-6 py-2 rounded font-semibold shadow-sm text-white transition-transform duration-300 ${
                                isFormComplete 
                                ? "bg-green-700 hover:bg-green-800 hover:scale-105" 
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            Get Suggestions
                        </button>
                    </div>
                </div>

                {/* Products List */}
                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="loader mb-4"></div>
                        <p className="text-green-800">Finding best matches for your crop...</p>
                    </div>
                ) : productList.length ? (
                    <div>
                   <h2 className="flex items-center text-xl font-semibold text-gray-800 mb-6 gap-2">
  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Best results for</span>
  <span className="text-green-700 font-bold">{crop}</span>
  <span>in</span>
  <span className="text-green-600">{state}</span>
  <span>during</span>
  <span className="text-amber-700 font-medium">{month}</span>
</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {productList.map((item) => (
                                <ShoppingProductTile
                                    key={item._id}
                                    handleAddtoCart={handleAddtoCart}
                                    product={item}
                                    handleGetProductDetails={handleGetProductDetails}
                                />
                            ))}
                        </div>
                    </div>
                ) : productList.length === 0 && !isLoading ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm animate-fadeIn">
                        <div className="text-6xl text-green-200 mb-4">🌱</div>
                        <h3 className="text-2xl font-semibold text-green-800 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            We couldn't find recommendations for your selection. Try different parameters.
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-16 animate-fadeIn">
                        <div className="text-6xl text-green-100 mb-4">🚜</div>
                        <h3 className="text-2xl font-semibold text-green-800 mb-2">
                            Ready to get recommendations?
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Please select your state, season and crop to see input suggestions
                        </p>
                    </div>
                )}
            </div>

            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
        </div>
    );
}

export default SuggestionProducts;
