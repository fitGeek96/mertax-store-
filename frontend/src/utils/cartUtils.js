export const addDecimals = (num, decimalPlaces = 2) => {
  // Convert the number to a string with fixed decimal places
  const fixedNum = num.toFixed(decimalPlaces);
  return parseFloat(fixedNum); // Convert the string back to a number and return
};

export const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state?.cartItems?.reduce((acc, item) => acc + item.price * item.qty, 0),
  );
  // Calculate shipping price based on Wilayas
  // state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
  // Calculate tax price
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice));
  // Calculate total price
  state.totalPrice = addDecimals(Number(state.itemsPrice));

  localStorage.setItem("cart", JSON.stringify(state));
};

// the below code fragment can be found in: cartSlice.js
