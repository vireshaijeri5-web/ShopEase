# ShopEase — Modern E-Commerce Storefront

A modern, responsive e-commerce storefront designed to deliver a clean and intuitive online shopping experience. Built with HTML, CSS, and JavaScript, ShopEase focuses on responsive UI design, interactive product browsing, and client-side shopping functionality.

## Overview

ShopEase is a front-end e-commerce project that demonstrates the implementation of essential online shopping features through a responsive and user-friendly interface.

The project is designed to strengthen front-end development skills, JavaScript fundamentals, DOM manipulation, browser storage, and interactive UI development.

## Features

- **Responsive Design** — Layout adapts to desktop, tablet, and mobile screens.
- **Product Catalog** — Browse products across different categories.
- **Product Search** — Find products using search functionality.
- **Category Filtering** — Filter products by category.
- **Shopping Cart** — Add, remove, and update cart items.
- **Wishlist** — Save and manage favorite products.
- **Product Details** — View additional information about products.
- **Demo Checkout** — Experience a client-side checkout flow.
- **Local Storage** — Persist supported cart, wishlist, and order data in the browser.
- **Order Management** — View and manage demo orders, including cancellation where implemented.

> **Note:** ShopEase is a front-end demonstration project. It does not process real payments or provide production-grade authentication, server-side order management, or a backend database.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, layouts, and responsive design |
| JavaScript (ES6+) | Interactivity and application logic |
| Web Storage API | Client-side persistence using localStorage |
| Google Fonts | Typography |

## Project Structure

```text
ShopEase/
├── index.html       # Main storefront
├── style.css        # Styling and responsive layouts
├── script.js        # Product and shopping interactions
├── orders.html      # Order history, if included
├── profile.html     # Customer profile, if included
└── README.md        # Project documentation
```

*The structure above describes the intended files. Keep only the files that actually exist in your repository.*

## Getting Started

### Prerequisites

- A modern web browser
- Visual Studio Code (recommended)
- The Live Server extension for VS Code (recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vireshaijeri5-web/ShopEase.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ShopEase
   ```

3. Open the folder in Visual Studio Code:

   ```bash
   code .
   ```

4. Launch `index.html` using the Live Server extension.

   Alternatively, open `index.html` directly in your browser. Running all pages through the same local server is recommended when testing shared browser storage.

## Usage

1. Browse the available products.
2. Search for products or apply category filters.
3. Add products to the shopping cart.
4. Manage quantities and remove unwanted items.
5. Save products to your wishlist.
6. Try the demo checkout flow.
7. View your saved demo orders if the order-history page is included.

Available features depend on the current implementation in the repository.

## Data Storage

ShopEase uses the browser's `localStorage` for supported client-side data.

- Data is stored locally in the current browser origin.
- Clearing browser storage may remove saved project data.
- Data is not automatically synchronized across devices or browsers.
- This storage is intended for demonstration purposes, not sensitive customer information.

## Testing Checklist

Before considering a feature complete, verify:

- [ ] The storefront loads without console errors.
- [ ] Product search returns the expected results.
- [ ] Category filters work correctly.
- [ ] Cart
