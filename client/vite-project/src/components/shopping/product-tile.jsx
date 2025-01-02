function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddtoCart,
  }) {
    return (
      <div className="w-full max-w-sm mx-auto h-full border bg-[#4cb08a] hover:bg-[#098354] hover:scale-105 duration-300  border-gray-400  rounded-xl overflow-hid shadow-xl shadow-black cursor-pointer m-1 ">
        <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
          <div className="relative">
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
            {product?.totalStock === 0 ? (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                Out Of Stock
              </span>
            ) : product?.totalStock < 10 ? (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                {`Only ${product?.totalStock} items left`}
              </span>
            ) : product?.salePrice > 0 ? (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                Sale
              </span>
            ) : null}
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[16px] text-gray-800">
                {product?.category}
              </span>
              
            </div>
            <div className="flex justify-between items-center mb-1">
              <span
                className={`${
                  product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-red-600`}
              >
                ${product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="text-lg font-semibold text-red-600">
                  ${product?.salePrice}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="p-2 border-t">
          {product?.totalStock === 0 ? (
            <button
              className="bg-[#02353c]  w-full text-white py-3 rounded-lg font-bold cursor-not-allowed"
              disabled
            >
              Out Of Stock
            </button>
          ) : (
            <button
              onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
              className="bg-[#02353c] hover:bg-gray-200 hover:text-[#02353c] w-full text-white py-3 rounded-lg font-bold"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    );
  }
  
  export default ShoppingProductTile;
  