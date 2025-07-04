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
        <section className=" bg-[#2eaf7d]">
        
        
       
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
  {/* Video background with gradient overlay */}
  <div className="absolute inset-0 w-full h-full">
    <div className="absolute inset-0  z-10"></div>
    <video
      className="w-full h-full object-cover"
      src={hero}
      autoPlay
      muted
      loop
      playsInline
    ></video>
  </div>
  
  {/* Content */}
  <div className="relative z-20 px-6 md:px-8 max-w-5xl text-center">
    <div className="">
      <h3 className="text-3xl md:text-4xl font-bold text-green-200 mb-6">
        Your Digital Farming Partner
      </h3>
      
      <p className="text-lg md:text-xl text-white leading-relaxed mb-8">
        Welcome to Krishi Mitra - where farming meets smart technology! 
        Get personalized recommendations for seeds, tools, and supplies 
        perfectly suited to your local season and soil conditions. 
        Connect with agricultural experts, see trusted ratings from fellow farmers, 
        shop with confidence, and track your orders - all in one place. 
        Join thousands of farmers who are boosting their harvests while saving time and money!
      </p>
      
      <div className="mt-10">
        <button 
          onClick={() => navigate("/shop/listing")}
          className="px-10 py-4 bg-[#4cb08a] hover:bg-[#098354] text-white font-bold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center mx-auto group"
        >
          Shop Farming Essentials
          <svg 
            className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
    
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <div className="bg-green-500/20 px-4 py-2 rounded-full flex items-center">
        <svg className="h-5 w-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-green-100">Season-based recommendations</span>
      </div>
      
      <div className="bg-green-500/20 px-4 py-2 rounded-full flex items-center">
        <svg className="h-5 w-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-green-100">Expert farming advice</span>
      </div>
      
      <div className="bg-green-500/20 px-4 py-2 rounded-full flex items-center">
        <svg className="h-5 w-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-green-100">Secure online payments</span>
      </div>
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

        <section className="py-12 bg-[#2eaf7d]">
        <div className="container mx-auto px-4 ">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gray-400 py-3 rounded-3xl">
            Feature Products
          </h2>
          <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-gray-200 px-5">
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