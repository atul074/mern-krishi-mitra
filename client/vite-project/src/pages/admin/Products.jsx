import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "../../store/admin/products-slice";

const categoryList = [
  {
      name: 'PLANT GROWTH REGULATOR'
  },
  {
      name: 'BIO STIMULATES'
  },
  {
      name: 'FUNGICIDES'
  },
  {
      name: 'SPREADER & ACTIVATOR'
  },
  {
      name: 'INSECTICIDES'
  },
  {
      name: 'FERTILIZER'
  },
  {
      name: 'PLANT NUTRITION'
  },
  {
      name: 'GROWTH NUTRIENT'
  },
  {
      name: 'BIOPESTICIDES'
  },
  {
      name: 'AGI EQUIPMENTS'
    
  },
  {
      name: 'HERBECIDES'
      
  },
  {
      name: 'RODENTICIDE'
  },
  {
      name: 'PLANT CARE'
     
  },
  {
      name: 'SEEDS '
     
  },
  {
      name: 'GARDENING'
     
  }
]
const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : 
      dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            alert("Product added successfully");
          }
        });
  }

  // function handleDelete(productId) {
  //   dispatch(deleteProduct(productId)).then((data) => {
  //     if (data?.payload?.success) {
  //       dispatch(fetchAllProducts());
  //     }
  //   });
  // }

  // function isFormValid() {
  //   return Object.keys(formData)
  //     .filter((key) => key !== "averageReview")
  //     .map((key) => formData[key] !== "")
  //     .every((item) => item);
  // }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    console.log(imageFile);
    
    data.append("file", imageFile);
    data.append("upload_preset", "myCloud");
    data.append("cloud_name", "de7imsn1h");
    //console.log(data);
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/de7imsn1h/image/upload',{
        method : "POST",
        body : data
      })
      const cloudData = await res.json();
      setUploadedImageUrl(cloudData.url);
      setImageLoadingState(false);
      console.log(uploadedImageUrl);
     // console.log(cloudData);
      
      
    } catch (error) {
      console.log(error);
    }
    
    // const response = await axios.post(
    //   "http://localhost:8000/api/admin/products/upload-image",
    //   data
    // );
    //console.log(response, "response");

    // if (response?.data?.success) {
    //   setUploadedImageUrl(response.data.result.url);
    //   setImageLoadingState(false);
    // }
  }
  useEffect(() => {
     dispatch(fetchAllProducts());
  }, [dispatch]);
  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);
  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* {productList && productList.length > 0
          ? productList.map((product) => (
              <div
                key={product.id}
                className="p-4 border rounded-md shadow-md flex flex-col items-start"
              >
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.title}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-bold mb-1">{product.title}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-gray-800 font-bold mb-2">${product.price}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(product);
                      setOpenCreateProductsDialog(true);
                      setCurrentEditedId(product.id);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          : <p className="text-gray-700">No products found.</p>} */}
      </div>
      {openCreateProductsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div className="mb-3">
                 <label className="block text-gray-700">Image</label>
                        <input
                            type="file"
                            name="productImage"
                           // value={product.productImageUrl}
                            onChange={(e) => setImageFile(e.target.files[0])}
                               
                            
                            placeholder='Product Image '
                            className='bg-gray-200 border text-gray-900 border-[#182628] px-2 py-2 w-full rounded-md outline-none placeholder-gray-700'
                        />
                        {imageLoadingState && <div> Image Uploading...</div>}
              </div>

              <div className="mb-3">
                  <label className="block text-gray-700">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    category: e.target.value
                                })
                            }}
                            className="w-full px-1 py-2 text-gray-900 bg-gray-200 border border-[#182628] rounded-md outline-none  ">
                            <option disabled>Select Product Category</option>
                            {categoryList.map((value, index) => {
                                const { name } = value
                                return (
                                    <option className=" first-letter:uppercase bg-gray-300" key={index} value={name}>{name}</option>
                                )
                            })}
                        </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Sale Price</label>
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Total Stock</label>
                <input
                  type="number"
                  value={formData.totalStock}
                  onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                />
              </div>
              <button
                type="submit"
                // disabled={!isFormValid()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {currentEditedId !== null ? "Edit" : "Add"}
              </button>
            </form>
            <button
              onClick={() => {
                setOpenCreateProductsDialog(false);
                setFormData(initialFormData);
                setCurrentEditedId(null);
              }}
              className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default AdminProducts;
