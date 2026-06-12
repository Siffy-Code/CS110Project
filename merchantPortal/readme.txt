# CS110 Marketplace Project – Merchant Portal

## Overview

The Merchant Portal is the merchant-facing component of the CS110 Marketplace application. It allows service providers and merchants to manage their storefronts, listings, orders, finances, and customer communications through a dedicated dashboard.

This portal was developed using React, React Router, and a Node.js/Express backend connected to MongoDB.

---

## Features Implemented

### Authentication

* Merchant registration
* Merchant login
* JWT-based authentication
* Protected routes
* Session persistence using local storage
* Automatic user restoration on page refresh

Files:

* AuthContext.jsx
* ProtectedRoute.jsx
* api.js

---

## Merchant Dashboard

The dashboard serves as the central hub for merchant activity.

Features:

* Overview of merchant account
* Navigation to all merchant tools
* Quick access to listings, orders, finances, and messaging

Files:

* MerchantDashboard.jsx
* MerchantLayout.jsx

---

## Merchant Profile Management

Merchants can manage their public storefront information.

Features:

* Store name editing
* Store description editing
* Contact information management
* Public merchant profile support

Files:

* MerchantEditProfile.jsx

---

## Service and Listing Management

Merchants can create and manage marketplace listings.

Features:

* Create listings
* Edit listings
* Delete listings
* View active listings
* Category support
* Pricing support
* Public listing display integration

Files:

* MerchantEditServices.jsx
* MerchantListingDisplay.jsx

API Endpoints Used:

* GET /merchant/listings
* POST /merchant/listings
* PATCH /merchant/listings/:id
* DELETE /merchant/listings/:id

---

## Order Management

Merchants can manage customer orders directly.

Features:

* View open orders
* View completed orders
* Manually create orders
* Update order status
* Order history support

Files:

* MerchantOrders.jsx

API Endpoints Used:

* GET /merchant/orders
* POST /merchant/orders
* PATCH /merchant/orders/:id/status

---

## Financial Dashboard

Merchant financial reporting interface.

Features:

* Revenue tracking framework
* Financial summary display
* Merchant earnings overview

Files:

* MerchantFinances.jsx

---

## Messaging System

Full merchant-side customer messaging implementation.

Features:

* Conversation list view
* Individual conversation view
* Send messages
* Create new conversations
* Archive conversations
* Customer communication history

Files:

* MerchantMessageBoard.jsx
* MerchantMessageDetails.jsx

API Endpoints Used:

* GET /merchant/messages
* GET /merchant/messages/:id
* POST /merchant/messages
* POST /merchant/messages/:id
* PATCH /merchant/messages/:id/archive

---

## Backend Integration

Implemented frontend integration for:

### Authentication

* POST /auth/register
* POST /auth/login
* GET /auth/me

### Merchant Profile

* GET /merchant/me
* PATCH /merchant/me

### Listings

* Full CRUD operations

### Orders

* Merchant order management
* Manual order creation
* Status updates

### Messaging

* Conversation management
* Message delivery
* Archive functionality

---

## Technical Stack

Frontend:

* React
* React Router
* JavaScript (ES6+)
* CSS

Backend:

* Node.js
* Express

Database:

* MongoDB Atlas
* Mongoose

Authentication:

* JWT (JSON Web Tokens)

---

## Major Contributions

Primary responsibility for the Merchant Portal subsystem, including:

* Merchant authentication flow
* Dashboard architecture
* Merchant profile management
* Listing management interface
* Order management tools
* Merchant financial interface
* Merchant messaging system
* Frontend API integration
* Protected route implementation
* Merchant navigation and layout system

The merchant portal was designed as a complete merchant-facing workflow allowing merchants to create listings, manage orders, communicate with customers, and maintain their storefronts within the marketplace ecosystem.


-------------------------------------

USE OF GENERATIVE AI
This portion of the project used parts of generative AI in order to help create the connections for the server side from other group members,
and to create templates for styles widgets (ex. "i need a button that I can put into a flex box for...").  Generative AI is wholly incapable of producing
works on this scale, nor can it even keep the code base and function names straight after a few prompts.  The actual heavier use of AI is the troubleshooting aspect,
working with error codes and verifying mismatches between front and back end design.  In essence, generative AI has only been used to create content that is "procedural"
and able to be built from/as templates - all arrangement, flow, design, fields, capabilities, and overall concept are entirely human.  The best likeness of AI is a "B- employee" - 
it will get you half way there, but can only work on really small tasks and lacks vision of the greater whole of the project (or incorrectly interprets it)