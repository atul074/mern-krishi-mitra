function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddtoCart,
  }) {
    return (
      <div className="w-full max-w-sm mx-auto border rounded-lg shadow-sm">
        <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
          <div className="relative">
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
            {product?.totalStock === 0 ? (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Out Of Stock
              </span>
            ) : product?.totalStock < 10 ? (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                {`Only ${product?.totalStock} items left`}
              </span>
            ) : product?.salePrice > 0 ? (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Sale
              </span>
            ) : null}
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[16px] text-gray-500">
                {product?.category}
              </span>
              
            </div>
            <div className="flex justify-between items-center mb-2">
              <span
                className={`${
                  product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-blue-600`}
              >
                ${product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="text-lg font-semibold text-blue-600">
                  ${product?.salePrice}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          {product?.totalStock === 0 ? (
            <button
              className="w-full bg-gray-200 text-gray-500 py-2 rounded cursor-not-allowed"
              disabled
            >
              Out Of Stock
            </button>
          ) : (
            <button
              onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    );
  }
  
  export default ShoppingProductTile;
  