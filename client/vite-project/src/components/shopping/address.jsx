import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "../../store/shop/address-slice";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      alert("You can add a maximum of 3 addresses.");
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            alert("Address updated successfully.");
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            alert("Address added successfully.");
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        alert("Address deleted successfully.");
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address || "",
      city: getCurrentAddress?.city || "",
      phone: getCurrentAddress?.phone || "",
      pincode: getCurrentAddress?.pincode || "",
      notes: getCurrentAddress?.notes || "",
    });
  }

  function isFormValid() {
    return Object.values(formData).every((value) => value.trim() !== "");
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white">
      {/* Address List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {addressList && addressList.length > 0 ? (
          addressList.map((singleAddressItem) => (
            <div onClick={setCurrentSelectedAddress ?()=> setCurrentSelectedAddress(singleAddressItem):null}
              key={singleAddressItem?._id}
              className={`p-4 border rounded-lg border-gray-300 ${ selectedId?
                (selectedId?._id === singleAddressItem?._id
                  ? "bg-gray-400"
                  : ""): "border-green-400"
              }`}
            >
              <p>
                <strong>Address:</strong> {singleAddressItem?.address}
              </p>
              <p>
                <strong>City:</strong> {singleAddressItem?.city}
              </p>
              <p>
                <strong>Phone:</strong> {singleAddressItem?.phone}
              </p>
              <p>
                <strong>Pincode:</strong> {singleAddressItem?.pincode}
              </p>
              <p>
                <strong>Notes:</strong> {singleAddressItem?.notes}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditAddress(singleAddressItem)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(singleAddressItem)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No addresses found.</p>
        )}
      </div>

      {/* Form */}
      <div>
        <h3 className="text-xl font-bold mb-4">
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </h3>
        <form onSubmit={handleManageAddress} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) =>
                setFormData({ ...formData, pincode: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-2 rounded text-white ${
              isFormValid() ? "bg-green-500 hover:bg-green-600" : "bg-gray-300"
            }`}
          >
            {currentEditedId !== null ? "Update Address" : "Add Address"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Address;
