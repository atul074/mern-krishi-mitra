function AdminProductTile({
    product,
    setFormData,
    setOpenCreateProductsDialog,
    setCurrentEditedId,
    handleDelete,
  }) {
    return (
      <div className="w-full max-w-sm mx-auto h-full border bg-[#4cb08a] hover:bg-[#098354] hover:scale-105 duration-300  border-gray-400  rounded-xl overflow-hid shadow-xl shadow-black cursor-pointer m-">
        <div>
          <div className="relative">
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-[300px] object-cover rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span
                className={`${
                  product?.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-red-700`}
              >
                ${product?.price}
              </span>
              {product?.salePrice > 0 ? (
                <span className="text-lg font-bold text-red-600">
                  ${product?.salePrice}
                </span>
              ) : null}
            </div>
          </div>
          <div className="p-4 flex justify-between items-center border-t border-gray-200">
            <button
              onClick={() => {
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setFormData(product);
              }}
              className="px-4 py-2 text-sm font-medium bg-[#02353c] hover:bg-gray-200 hover:text-[#02353c] border-[#02353c] border-2 rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product?._id)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default AdminProductTile;
  