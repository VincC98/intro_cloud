# Scalable Shopping-cart Application - School project


## Overview

This project focuses on building a scalable backend for a shopping-cart application (*SCApp*) hosted on [Azure](https://azure.microsoft.com/en-us/global-infrastructure/). The project consists of two parts:
1. Building scalable backend services for many users.
2. Implementing efficient data processing for logs and enabling features such as a recommender system.

## Key Concepts

### Functional Requirements
- **User Roles**:
  - **Non-authenticated users**: Can browse items but cannot add to the cart.
  - **Authenticated users**: Can add items to the cart, checkout, and view purchase history.
  - **Administrators**: Can update item characteristics, add new items to the catalog, and manage inventory.

- **Key Features**:
  - Browse items with detailed pages for each.
  - Add or remove items from the shopping cart.
  - Checkout and preserve shopping cart history across sessions.

- **Administrator Features**:
  - Modify item information (price, description).
  - Add new items with descriptions and photos.

### Technical Requirements
- **Microservices**:
  - Backend services implemented as **RESTful APIs** over HTTP.
  - Each microservice has its own database (preferably [CouchDB](http://couchdb.apache.org)) and must scale for large numbers of users.
  - Microservices are containerized using Docker and connected via Docker networking.
  
- **External Storage**:
  - Product images are stored in [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/).

- **Logging Microservice**:
  - Logs user actions (e.g., viewing items, adding to cart, purchases).
  - Logs performance metrics (e.g., response times, API calls).
  - Stored in a CouchDB database for later data processing and analysis.

- **Elastic Scaling**:
  - Microservices and their databases must scale independently based on user load.
  - Both the node.js service and its database (e.g., CouchDB) must support scaling dynamically.
