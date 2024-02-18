import './Navbar.css';

function Navbar() {
  return (
    <nav class="navbar">
        <div class="navbar-content">
            <div class="store-name">Your E-commerce Store Name</div>
            <div class="categories-dropdown">
                <select>
                    <option value="" disabled selected hidden>Categories</option>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                    <option value="category3">Category 3</option>
                    <option value="category4">Category 4</option>
                    <option value="category5">Category 5</option>
                </select>
            </div>
            <div class="search-bar">
                <input type="text" placeholder="Search..." />
                <button type="submit">Search</button>
            </div>
            <div class="user-options">
                <a href="./login">Log In</a>
                <a href="./basket">Basket</a>
                <a href="./checkout">Checkout</a>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;