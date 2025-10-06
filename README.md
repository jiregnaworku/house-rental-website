House Rental System

A modern, responsive, and user-friendly House Rental System web application built with React. This system allows users to browse, search, and manage rental properties efficiently, while providing landlords with the ability to list and manage their properties.

Features

User Features:

Browse available houses for rent

Search and filter properties by location, price, and type

View detailed property information

Favorite or bookmark properties for quick access

Responsive UI for desktop and mobile devices

Admin/Landlord Features:

Add, edit, and delete property listings

Manage bookings and inquiries

Dashboard analytics for monitoring property activity

Technical Features:

Built with React.js using modern hooks and functional components

State management with React Context API

Responsive layout with CSS Flexbox and Grid

Form validation and interactive UI elements

Optimized production build for fast loading

Getting Started

This project was bootstrapped with Create React App
.

Prerequisites

Node.js >= 16.x

npm >= 8.x

Optional: yarn package manager

Installation

Clone the repository:

git clone https://github.com/yourusername/house-rental-system.git
cd house-rental-system

Install dependencies:

npm install

# or

yarn install

Available Scripts

In the project directory, you can run:

npm start

Runs the app in development mode.
Open http://localhost:3000
to view it in your browser.

The page reloads automatically when you make edits.

You will see any lint errors in the console.

npm test

Launches the test runner in interactive watch mode.
For more information, see running tests
.

npm run build

Builds the app for production to the build folder.

Bundles React in production mode

Optimizes the build for best performance

Filenames include content hashes for caching

Your app is ready to be deployed!
See deployment
for options.

npm run eject

Warning: this is a one-way operation. Once you eject, you cannot go back.

Use only if you need full control over the build configuration

Copies all config files (Webpack, Babel, ESLint, etc.) into your project

After ejecting, all scripts will still work, but you can fully customize the build

Deployment

The app can be deployed on any static hosting service:

Vercel: Continuous deployment with GitHub integration

Netlify: Drag & drop build/ folder or use Git integration

GitHub Pages: Deploy using gh-pages package

Custom server: Serve build/ folder with Nginx, Apache, or Node.js

Example for Netlify:

npm run build
netlify deploy --dir=build

Folder Structure
house-rental-system/
├── public/ # Static files
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # React pages
│ ├── context/ # React Context for state management
│ ├── hooks/ # Custom React hooks
│ ├── services/ # API calls and utilities
│ ├── styles/ # Global styles and theme
│ └── App.js # Main application entry
├── package.json
├── README.md
└── .gitignore

Learn More

Create React App Documentation

React Official Documentation

React Router

CSS Tricks for Responsive Design

Contributing

Contributions are welcome! Please follow these steps:

Fork the repository

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m "Add new feature")

Push to your branch (git push origin feature/your-feature)

Open a Pull Request

License

This project is licensed under the MIT License — see the LICENSE
file for details.

Author

Jiregna Worku

GitHub

LinkedPS C:\Users\hp\Desktop\Webs\hrms\backend> npm run dev

> house-rental-backend@1.0.0 dev
> ts-node-dev --respawn --transpile-only src/server.ts

[INFO] 18:23:06 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.2,
typescript ver. 5.9.3)
Missing Cloudinary configuration
Failed to initialize Cloudinary: Error: Missing Cloudinary configuration
at cloudinaryConfig (C:\Users\hp\Desktop\Webs\hrms\backend\src\controllers\propertyImage.controller.ts:16:11)
at Object.<anonymous> (C:\Users\hp\Desktop\Webs\hrms\backend\src\controllers\propertyImage.controller.ts:28:3)
at Module.<anonymous> (node:internal/modules/cjs/loader:1760:14)
at Module.\_compile (C:\Users\hp\AppData\Roaming\npm\node_modules\ts-node-dev\node_modules\source-map-support\source-map-support.js:568:25)
at Module.m.\_compile (C:\Users\hp\AppData\Local\Temp\ts-node-dev-hook-5098883707704546.js:69:33)
at node:internal/modules/cjs/loader:1893:10
at require.extensions..jsx.require.extensions..js (C:\Users\hp\AppData\Local\Temp\ts-node-dev-hook-5098883707704546.js:114:20)  
 at require.extensions.<computed> (C:\Users\hp\AppData\Local\Temp\ts-node-dev-hook-5098883707704546.js:71:20)
at Object.nodeDevHook [as .ts] (C:\Users\hp\AppData\Roaming\npm\node_modules\ts-node-dev\lib\hook.js:63:13)
at Module.load (node:internal/modules/cjs/loader:1480:32)  
In
