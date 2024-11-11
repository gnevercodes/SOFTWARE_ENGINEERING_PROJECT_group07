import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pagination } from "@mui/material";
import "../styling/medicines.css";
import output100 from "../assets/output100.json";

const MedicinePage = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [cart, setCart] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const { cartSaved } = location.state || {};
  const { userData } = location.state || {};

  console.log("user data in medicines", userData);
  useEffect(() => {
    setMedicines(output100);
    setFilteredMedicines(output100);

    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(new Map(JSON.parse(savedCart)));

    if (cartSaved) {
      const savedCartMap = new Map(cartSaved.map((item) => [item.id, item]));
      setCart(savedCartMap);
    }
  }, [cartSaved]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(Array.from(cart.entries())));
  }, [cart]);

  const handleAddToCart = (medicine) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const currentQty = newCart.get(medicine.id)?.quantity || 0;
      newCart.set(medicine.id, { ...medicine, quantity: currentQty + 1 });
      return newCart;
    });
  };

  const handleRemoveFromCart = (medicine) => {
    setCart((prevCart) => {
      const newCart = new Map(prevCart);
      const currentQty = newCart.get(medicine.id)?.quantity || 0;

      if (currentQty > 1) {
        newCart.set(medicine.id, { ...medicine, quantity: currentQty - 1 });
      } else {
        newCart.delete(medicine.id);
      }
      return newCart;
    });
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleCheckout = () => {
    const cartArray = Array.from(cart.values());
    navigate("/cart", { state: { cart: cartArray, userData } });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(value)
    );
    setFilteredMedicines(filtered);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = filteredMedicines.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="medicine-container">
      <h1>Available Medicines</h1>
      <input
        type="text"
        placeholder="Search for a medicine..."
        value={searchTerm}
        onChange={handleSearch}
        // style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
        className="search"
      />
      <div className="medicine-list">
        {currentMedicines.map((medicine) => {
          const cartItem = cart.get(medicine.id) || {};
          const quantity = cartItem.quantity || 0;

          return (
            <div key={medicine.id} className="medicine-item">
              <h2>{medicine.name}</h2>
              <p>Price: Rs {medicine.price}</p>
              {quantity > 0 ? (
                <div className="quantity-controls">
                  <button onClick={() => handleRemoveFromCart(medicine)}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => handleAddToCart(medicine)}>+</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(medicine)}>
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Pagination
        count={Math.ceil(filteredMedicines.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "black",
            backgroundColor: "#f0f0f0",
            margin: "0 5px",
          },
          "& .Mui-selected": {
            backgroundColor: "#1976d2",
            color: "white",
          },
          "& .MuiPaginationItem-ellipsis": {
            color: "#888",
          },
        }}
      />

      <button
        onClick={handleCheckout}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Go to Cart (
        {Array.from(cart.values()).reduce((a, b) => a + b.quantity, 0)})
      </button>
    </div>
  );
};

export default MedicinePage;
