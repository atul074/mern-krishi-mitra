import { useEffect, useState } from "react";
import hero from "../../assets/hero.mp4"
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../store/shop/products-slice";
import ShoppingProductTile from "../../components/shopping/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";
import ProductDetailsDialog from "../../components/shopping/product-details";

const categories = [
  {
      name: 'PLANT GROWTH REGULATOR',
      image: 'https://cdn-icons-png.flaticon.com/128/2988/2988557.png'
  },
  {
      name: 'BIO STIMULATES',
      image: 'https://cdn-icons-png.flaticon.com/128/4284/4284772.png'
  },
  {
      name: 'FUNGICIDES',
      image: 'https://cdn-icons-png.flaticon.com/128/9972/9972408.png'
  },
  {
      name: 'SPREADER & ACTIVATOR',
      image: 'https://cdn-icons-png.flaticon.com/128/5863/5863526.png'
  },
  {
      name: 'INSECTICIDES',
      image: 'https://cdn-icons-png.flaticon.com/128/5093/5093656.png'
  },
  {
      name: 'FERTILIZER',
      image: 'https://cdn-icons-png.flaticon.com/128/4849/4849540.png'
  },
  {
      name: 'PLANT NUTRITION',
      image: 'https://cdn-icons-png.flaticon.com/128/10490/10490230.png'
  },
  {
      name: 'GROWTH NUTRIENT',
      image: 'https://cdn-icons-png.flaticon.com/128/12615/12615233.png'
  },
  {
      name: 'BIOPESTICIDES',
      image: 'https://cdn-icons-png.flaticon.com/128/3402/3402109.png'
  },
  {
      name: 'AGI EQUIPMENTS',
      image: 'https://cdn-icons-png.flaticon.com/128/2592/2592037.png'
  },
  {
      name: 'HERBECIDES',
      image: 'https://cdn-icons-png.flaticon.com/128/4284/4284949.png'
  },
  {
      name: 'RODENTICIDE',
      image: 'https://cdn-icons-png.flaticon.com/128/14236/14236429.png'
  },
  {
      name: 'PLANT CARE',
      image: 'https://cdn-icons-png.flaticon.com/128/3968/3968246.png'
  },
  {
      name: 'SEEDS ',
      image: 'https://cdn-icons-png.flaticon.com/128/2227/2227504.png'
  },
  {
      name: 'GARDENING',
      image: 'https://cdn-icons-png.flaticon.com/128/4284/4284795.png'
  },
]

function ShoppingHome() {
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.name],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);


  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);  
    return (
      <>
        <section className=" bg[#2eaf7d]">
        
        
       
        <section className=" relative h-screen  flex flex-col items-center justify-top pt-20 text-center text-white">
          <div className="video-docker absolute top-0 left-0 w-full h-96 overflow-hidde">
            <video
              className="min-w-full min-h-screen absolute object-cover"
               src={hero}
              type="video/mp4"
              autoPlay
              muted
              loop
            > </video>
          </div>
          <div 
         initial={{ opacity: 0, scale: 0.5 }}
         animate={{opacity: 1, scale: 1 }}
         transition={{ duration: 1 ,delay:1 }}
         
        className="video-content space-y-2 z-10 px-16">
       
        <h3 className="font-normal text-xl mt-40">कृषि मित्र समीक्षा में आपका स्वागत है, जो आपके खेत के लिए सर्वोत्तम कृषि रसायनों को खोजने का आपका प्रमुख मंच है। यहाँ, आप अपने सह-किसानों से विस्तृत रेटिंग्स देख सकते हैं, जो आपको अपनी विशिष्ट आवश्यकताओं के अनुसार उत्पाद चुनने में मदद करती हैं। हमारे समुदाय संचालित अंतर्दृष्टि सुनिश्चित करती हैं कि आप स्वस्थ फसलों और उच्च उपज के लिए सूचित निर्णय लें। हमारे साथ जुड़ें और साझा अनुभवों के माध्यम से स्मार्ट और प्रभावी कृषि प्रथाओं को बढ़ावा दें।</h3>
       <div className=""> 
        <button className="px-8 py-2 bg- bg-[#4cb08a]  duration-300 rounded-lg shadow-md  my-3 p-3 text-center hover:bg-[#098354] hover:scale-110   transition-all font-bold  mt-3" onClick={()=>navigate("/shop/listing")}> Shop Products</button>
       </div>
      </div>
        </section>
    
    
        </section>
        {/* category filter */}

        <div className="  bg-gray-200 pt-8 pb-1">
        <h2 className="text-3xl font-bold text-center mb-3">
            Shop by category
          </h2>
                <div 
                  // ref={containerRef}
                   className="flex overflow-x-scroll   ">
                    
                   
                        {/* category  */}
                        {categories.map((item, index) => {
                            return(
                                <div key={index} 
                                    
                                    className="px-1 lg:px-2 shadow-xl shadow-black">
                                    {/* Image  */}
                                    <div  onClick={() => handleNavigateToListingPage(item, "category")}
                                     
                                      whileTap={{ scale: 0.9 }}
                                      className="  lg:w-24 lg:h-24  min-w-[120px] min-h-[180px] bg-[#4cb08a]  duration-300 rounded-lg shadow-md  my-3 p-3 text-center hover:bg-[#098354] hover:scale-110   transition-all  cursor-pointer mb-1 " >
                                        <div className=" mb-1 ">
                                            
                                            <img src={item.image} alt="img" className="rounded-full object-cover "/>
                                        </div>
                                        <h5 className=' text-base lg:text-base text-center  title-font first-letter:uppercase '>{item.name.substring(0,10)}..</h5>
                                    </div>

                                    {/* Name Text  */}
                                    
                                </div>
                            )
                        })}
                   
                </div>
            </div>

        <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    
      </>
    );
  }
  
  export default ShoppingHome;