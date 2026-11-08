# QuickBite — React Food Ordering Frontend

A responsive food ordering frontend built with React 18 and Vite. It runs entirely in the browser and persists demo data in `localStorage`.

## Features

### Customer
- Browse restaurant cards and filter by cuisine/category.
- Search restaurants, cuisines and menu item names.
- View restaurant menus and add dishes to the cart.
- Change quantities, clear the cart and see an itemized bill.
- Single-restaurant cart rule to avoid mixing orders from multiple restaurants.
- Checkout with name, 10-digit mobile number and delivery address validation.
- Place demo orders and view order history with status progress.

### Admin demo
- Add and delete restaurants.
- Add and delete menu items.
- View basic dashboard statistics.
- Update order statuses: Confirmed, Preparing, Out for delivery, Delivered or Cancelled.

## Requirements
- Node.js 18 or newer (Node.js 20 LTS recommended).
- npm (included with Node.js).
- Visual Studio Code.

## Run locally

1. Extract the ZIP file.
2. Open the extracted `quickbite-food-ordering` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Check Node and npm:
   ```bash
   node -v
   npm -v
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open the local URL printed by Vite, usually `http://localhost:5173`.

To test the production build:
```bash
npm run build
npm run preview
```

## Push to GitHub

Create an empty repository on GitHub, for example `quickbite-food-ordering`. Do not initialize it with a README if you plan to push this existing project.

Run these commands in the VS Code terminal from the project root:

```bash
git init
git add .
git commit -m "Build QuickBite React food ordering frontend"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/quickbite-food-ordering.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If Git asks you to sign in, complete the browser authentication flow.

For later changes:
```bash
git add .
git commit -m "Describe your changes"
git push
```

## Reset demo data

The app saves restaurants, cart and orders in browser `localStorage`. To reset to the starter data, open browser Developer Tools → Application → Local Storage → your localhost origin and delete:
- `qb-restaurants`
- `qb-cart`
- `qb-orders`

Then refresh the page.

## Important project notes

- This is a **frontend-only demo**. It does not connect to a real backend, payment gateway, maps, SMS service or delivery partner.
- The Admin page is a demonstration interface, not secure authentication. Anyone opening the app can use it.
- Order status updates are controlled manually in the Admin page; they are not live courier tracking.
- All data is stored in the current browser's local storage and is not shared between users or devices.
- The Google Fonts import is optional; the app falls back to system fonts if unavailable.

## Suggested next upgrade
Connect this UI to a Spring Boot REST API with MySQL, Spring Security/JWT, real customer/admin roles, order persistence and payment integration.
