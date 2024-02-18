import React from 'react';

function CheckoutForm() {
  return (
    <div>
      <h2>Checkout</h2>
      <form>
        <div>
          <label htmlFor="billingAddress">Billing Address:</label>
          <input type="text" id="billingAddress" name="billingAddress" />
        </div>
        <div>
          <label htmlFor="creditCard">Credit Card:</label>
          <input type="text" id="creditCard" name="creditCard" />
        </div>
        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
}

export default CheckoutForm;