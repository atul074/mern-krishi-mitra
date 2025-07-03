import ProductDetailsDialog from "../../components/shopping/product-details";
import ShoppingProductTile from "../../components/shopping/product-tile";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";
import { fetchProductDetails } from "../../store/shop/products-slice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function SuggestionProducts() {
    const STATES = ["Maharashtra", "Punjab", "Uttar Pradesh", "Bihar"];
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const CROPS = ["Wheat", "Rice", "Corn", "Sugarcane", "Cotton"];

    const [state, setState] = useState("");
    const [month, setMonth] = useState("");
    const [crop, setCrop] = useState("");
    const [products, setProducts] = useState([]);

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const { productDetails } = useSelector((state) => state.shopProducts);
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);

    const fetchSuggestedProducts = async () => {
        try {
            const res = await axios.post("http://localhost:8000/api/shop/products/suggested", {
                state,
                month,
                crop,
            });
            setProducts(res.data.products);
        } catch (error) {
            console.error("Failed to fetch suggested products", error);
            setProducts([]);
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Find Suggested Products</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">Select State</option>
                    {STATES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">Select Month</option>
                    {MONTHS.map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>

                <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">Select Crop</option>
                    {CROPS.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={fetchSuggestedProducts}
                className="bg-[#02353c] hover:bg-gray-200 hover:text-[#02353c] w-full text-white py-3 rounded-lg font-bold mb-5"
            >
                Get Suggestions
            </button>

            {!products.length ? (
                <h1 className="text-3xl">No suggestions found!</h1>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {products.map((item) => (
                        <ShoppingProductTile
                            key={item._id}
                            handleAddtoCart={handleAddtoCart}
                            product={item}
                            handleGetProductDetails={handleGetProductDetails}
                        />
                    ))}
                </div>
            )}

            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
        </div>
    );
}

export default SuggestionProducts;
