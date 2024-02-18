import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../views/Home';
import ProductList from '../components/Product/ProductList';
import ProductDetails from '../components/Product/ProductDetails';
import Basket from '../components/Basket/Basket';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import NotFound from '../views/NotFound';
import Navbar from '../components/Navbar/Navbar';
import './App.css';

function App() {
  return (<>
            <Navbar />
    <div className='main'>
      <section className='main-content'>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/basket" element={<Basket />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </section>
    </div>
  </>
  );
}

export default App;