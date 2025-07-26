import axios from "axios";
import AdminProductTile from "../../components/admin/product-tile";
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

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    console.log(imageFile);
    
    data.append("file", imageFile);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    //console.log(data);
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,{
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
    <div className="bg-gray-100">
      <div className="my-5 w-full flex justify-end ">
        <button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="px-4 py-2 bg-[#02353c] hover:bg-white hover:text-[#02353c] text-white mr-4 rounded-lg border-2 border-[#02353c]"
        >
          Add New Product
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 px-5 ">
         {productList && productList.length > 0
          ? productList.map((productItem) => (
            <AdminProductTile
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
          : <p className="text-gray-700">No products found.</p>
          }  
      </div>
      {openCreateProductsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-200 p-6 rounded-md w-96">
            <h2 className="text-xl font-extrabold mb-4 text-center">
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
                 disabled={!isFormValid()}
                className="w-full px-4 py-2 bg-[#02353c] hover:bg-[#f2f2f2] hover:text-[#02353c] text-white border-2 border-[#02353c] rounded-md disabled:bg-gray-400"
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
    </div>
  );
}

export default AdminProducts;
