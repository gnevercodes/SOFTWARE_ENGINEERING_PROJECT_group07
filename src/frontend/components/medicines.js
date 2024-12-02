import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Pagination } from "@mui/material";
import debounce from "lodash.debounce";
import "../styling/medicines.css";
import output100 from "../assets/output100.json";

const MedicinePage = () => {
  const [medicines] = useState(output100); // Loaded once from data source
  const [filteredMedicines, setFilteredMedicines] = useState(output100);
  const [cart, setCart] = useState(new Map());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const { cartSaved, userData } = location.state || {};

  useEffect(() => {
    if (cartSaved) {
      const savedCartMap = new Map(cartSaved.map((item) => [item.id, item]));
      setCart(savedCartMap);
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCart(new Map(JSON.parse(savedCart)));
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
  const handleViewOrders = () => {
    navigate(`/userOrders`, { state: { userData } });
  };
  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleCheckout = () => {
    const cartArray = Array.from(cart.values());
    navigate("/cart", { state: { cart: cartArray, userData } });
  };

  // Improved search function with debouncing
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilteredMedicines(
        medicines.filter((medicine) =>
          medicine.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setCurrentPage(1);
    }, 300),
    [medicines]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const currentMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="medicine-container">
      <h1>Available Medicines</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search for a medicine..."
          value={searchTerm}
          onChange={handleSearch}
          className="search"
        />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            transform: "translateY(-10px)",
            height: "40px",
            width: "150px",
            marginLeft: "50px",
            fontSize: "14px",
          }}
          onClick={handleViewOrders}
        >
          view orders
        </button>
      </div>

      <div className="medicine-list">
        {currentMedicines.map((medicine) => {
          const quantity = cart.get(medicine.id)?.quantity || 0;

          return (
            <div key={medicine.id} className="medicine-item">
              <h2>{medicine.name}</h2>
              <p>Price: Rs {medicine.price}</p>
              <div className="quantity-controls">
                {quantity > 0 ? (
                  <>
                    <button onClick={() => handleRemoveFromCart(medicine)}>
                      -
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => handleAddToCart(medicine)}>+</button>
                  </>
                ) : (
                  <button onClick={() => handleAddToCart(medicine)}>
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        count={Math.ceil(filteredMedicines.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
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
          mt: 2,
          display: "flex",
          justifyContent: "center",
        }}
      />

      <button onClick={handleCheckout} className="checkout-button">
        Go to Cart (
        {Array.from(cart.values()).reduce((a, b) => a + b.quantity, 0)} items)
      </button>
    </div>
  );
};

export default MedicinePage;
