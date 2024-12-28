import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductFilter from "../../components/shopping/filter";
import { fetchAllFilteredProducts } from "../../store/shop/products-slice";
import ShoppingProductTile from "../../components/shopping/product-tile";
function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  //console.log(queryParams, "queryParams");

  return queryParams.join("&");
}
function ShoppingListing() {

  const [SortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sort, setSort] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const categorySearchParam = searchParams.get("category");
  const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
  ];

  function handleSort(value) {
    setSort(value);
  }
  function handleFilter(getSectionId, getCurrentOption) {
   // console.log(getSectionId,getCurrentOption);
    
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    console.log(filters);
    
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);


    return (
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length}Products 
            </span>
            <div className="relative ">
              <button
                className="flex items-center gap-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                onClick={() => setSortDropdownOpen(!SortDropdownOpen)}
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span>Sort by</span>
              </button>
              {SortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 z-30 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <ul className="py-1">
                    {sortOptions.map((sortItem) => (
                      <li
                        key={sortItem.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                          sort === sortItem.id ? 'font-bold text-blue-500' : ''
                        }`}
                        onClick={() => {
                          handleSort(sortItem.id);
                          setSortDropdownOpen(false);
                        }}
                      >
                        {sortItem.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  // handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  //handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      {/* <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      /> */}
    </div>
    
    );
  }
  
  export default ShoppingListing;