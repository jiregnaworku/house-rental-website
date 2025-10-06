House Rental System

A modern, responsive, and user-friendly House Rental System web application built with React.
This system allows users to browse, search, and manage rental properties efficiently, while providing landlords with tools to list and manage their properties.

Features
User Features

Browse available houses for rent

Search and filter properties by location, price, and type

View detailed property information

Favorite or bookmark properties for quick access

Responsive UI for desktop and mobile devices

Admin / Landlord Features

Add, edit, and delete property listings

Manage bookings and inquiries

Dashboard analytics for monitoring property activity

Technical Features

Built with React.js using modern hooks and functional components

State management with React Context API

Responsive layout with CSS Flexbox and Grid

Form validation and interactive UI elements

Optimized production build for fast loading

Getting Started

This project was bootstrapped with Create React App
.

Prerequisites

Node.js >= 16.x (Download Node.js
)

npm >= 8.x (or Yarn
 as alternative)

Installation

Clone the repository:

git clone https://github.com/jiregnaworku/house-rental-website.git
cd house-rental-website


Install dependencies:

npm install
# or
yarn install

Available Scripts
npm start

Runs the app in development mode. Open http://localhost:3000
.

npm test

Launches the test runner in interactive watch mode. See Running Tests
.

npm run build

Builds the app for production to the build/ folder.

Bundles React in production mode

Optimizes the build for best performance

Filenames include content hashes for caching

npm run eject

⚠️ Warning: One-way operation. Only use if you need full control over build configuration.

Deployment

You can deploy this app on any static hosting service:

Vercel: https://vercel.com

Netlify: https://www.netlify.com

GitHub Pages: https://pages.github.com

Example for Netlify:

npm run build
netlify deploy --dir=build

Folder Structure
house-rental-website/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # React pages
│   ├── context/      # React Context for state management
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API calls and utilities
│   ├── styles/       # Global styles and themes
│   └── App.js        # Main application entry
├── package.json
├── README.md
└── .gitignore

Learn More

Create React App Documentation

React Official Documentation

React Router

CSS Tricks for Responsive Design

Contributing

Contributions are welcome!

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

<<<<<<< HEAD
GitHub

LinkedPS C:\Users\hp\Desktop\Webs\hrms\backend> npm run dev

> house-rental-backend@1.0.0 dev
> ts-node-dev --respawn --transpile-only src/server.ts

