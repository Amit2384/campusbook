# CampusBook - Old Book Resell & Rental Application

## CERTIFICATE
This is to certify that the mini project entitled **"CampusBook - Old Book Resell & Rental Application"** has been successfully completed by Amit Pramod Chandajkar (R.NO: 25107) and Rushikesh Santosh Shivale (R.NO: 25155).

---

## INDEX
1. **Chapter 1: Introduction**
   - 1.1 Abstract
   - 1.2 Existing System and Need for System
   - 1.3 Scope of System
   - 1.4 Operating Environment - Hardware and Software & Brief Description of Technology Used
   - 1.5 Operating systems used, RDBMS/No SQL used
2. **Chapter 2: Proposed System**
   - 2.1 Feasibility Study
   - 2.2 Objectives of Proposed System
   - 2.3 Users of System
3. **Chapter 3: Analysis and Design**
   - 3.1 System Requirements
   - 3.2 Entity Relationship Diagram (ERD)
   - 3.3 Table Structure
   - 3.4 Use Case Diagrams
   - 3.5 Class Diagram
   - 3.6 Activity Diagram
   - 3.7 Sequence Diagram
   - 3.8 Deployment Diagram & Module Hierarchy Diagram
   - 3.9 Sample Input and Output Screens
4. **Coding**
   - 4.1 Algorithms
   - 4.2 Code snippets
5. **Testing**
   - 5.1 Test Strategy
   - 5.2 Unit Test Plan
   - 5.3 Acceptance Test Plan
   - 5.4 Test Case / Test Script
   - 5.5 Defect report/Test Log
6. **Limitations of Proposed System**
7. **Proposed Enhancements**
8. **Conclusion**
9. **Bibliography**

---

# PART A: Project Report Content

## Chapter 1: Introduction

### 1.1 Abstract
The Old Book Resell & Rental Application is a web-based system engineered to streamline the buying, selling, and renting of pre-owned books among students. Its primary objective is to furnish an accessible and cost-effective platform for students to exchange academic literature. The application enables users to list books for either sale or rental, search for specific titles based on criteria such as title, subject, or price, and execute orders for purchase or rental. The system further encompasses modules for wishlist management, order tracking, and a rating and review functionality to cultivate trust among its users. This project endeavors to diminish the expenditure on educational resources while concurrently advocating for the reuse of books within academic communities. The system's development leverages contemporary web technologies, specifically Next.js for the frontend, Node.js (Express.js) for backend services, and MySQL for database management.

### 1.2 Existing System and Need for System
Students in numerous educational institutions frequently encounter difficulties in securing affordable academic books. The recurring expense of purchasing new textbooks each semester, coupled with the time-consuming nature of locating second-hand books through informal channels, underscores the necessity for a structured solution. The impetus for this system arises from the substantial cost associated with purchasing new textbooks, the absence of a dedicated platform specifically for the buying and selling of used academic books, the complexities involved in renting books for short-term academic requirements, and the inefficient management of unused books accumulated by students. The proposed system establishes an organized platform where students can readily list their books for resale or rental, and others can conveniently locate and acquire them.

### 1.3 Scope of System
The scope of this system encompasses the development of a web-based application that empowers students to buy, sell, and rent books exclusively within an academic community. The system provides key functionalities including book listing for both resale and rental purposes, advanced searching and filtering options for books, management of rental durations and associated costs, tracking of orders and financial transactions, provision for ratings and reviews, and AI-powered metadata extraction.

### 1.4 Operating Environment - Hardware and Software
- **Hardware Requirements:** Processor: Intel Core i3 or a more advanced model. RAM: A minimum of 4 GB. Hard Disk: 20 GB of available space.
- **Software Requirements:** Operating System: Windows 10 or a newer version. Web Server: Node.js (Express.js Runtime). Database: MySQL. Browser: Google Chrome, Mozilla Firefox, or Microsoft Edge.
- **Technology Used:** Next.js / React.js for crafting a dynamic, responsive, and SEO-friendly user interface. Node.js & Express.js for robust REST APIs. MySQL serves as the relational database. Gemini AI is utilized for OCR and intelligent text parsing to automate the book indexing process.

### 1.5 Operating systems used, RDBMS/No SQL used
The system undergoes development and rigorous testing primarily on the Windows Operating System. However, the system is designed to be cross-platform and compatible with other operating systems, such as Linux or macOS, provided the Node.js environment is configured. The system utilizes MySQL, a widely recognized relational database management system (RDBMS), to securely store all critical data, which includes user information, book listings, rental records, order transactions, and reviews.

---

## Chapter 2: Proposed System

### 2.1 Feasibility Study
- **Technical Feasibility:** The project is technically viable, as it is implemented using established technologies such as Next.js, Node.js, and MySQL.
- **Economic Feasibility:** The system necessitates minimal development costs, primarily due to its reliance on open-source technologies and community-driven tools.
- **Operational Feasibility:** The system is designed for ease of use with a modern UI, requiring minimal training for students.

### 2.2 Objectives of Proposed System
- To establish an online platform for the sale and rental of used books.
- To reduce the financial outlay for academic books for students.
- To facilitate effortless searching and filtering of books.
- To accurately maintain records of all transactions and rentals.
- To provide users with the ability to review and rate sellers.

### 2.3 Users of System
- **Buyer (Student/User):** Search, Purchase, Rent books, and submit reviews.
- **Seller (Student/User):** List books for resale or rental, manage private inventory.
- **Administrator:** Approve/remove listings, manage users, and monitor overall platform activity.

---

## Chapter 3: Analysis and Design

### 3.1 System Requirements (Functional and Non-Functional)
- **Functional:** Book Listing Module, Search and Filter Module, Rental Management Module, Order and Transaction Module, Wishlist Module, Rating and Review Module, Admin Management Module.
- **Non-Functional:** Passwords hashed with bcrypt, JWT tokens validated, Role enforcement, Input validation, SQL injection protection, Server-side pagination, Parallel API fetching, Local storage for cart, and Error states.

### 3.2 ERD, Tables, and Diagrams
*(Diagrams and Visuals placeholders from Section 3.2 to 3.9 are intended for image insertion)*

- The database consists of 10 tables: `roles`, `users`, `categories`, `books`, `orders`, `order_items`, `rentals`, `wishlist`, `reviews`, `payments`.

---

## Chapter 4: Coding

### 4.1 Algorithms
1. **JWT Authentication:** Generate token on login, verify on protected routes.
2. **Overdue detection:** If rental end date < today, flag as overdue.
3. **Parallel Fetching:** Use `Promise.allSettled` to concurrently fetch dashboard summary data for performance.

### 4.2 Code snippets
**Backend Authentication (Express.js):**
```javascript
router.post('/login', validate, authController.login);
router.get('/profile', verifyToken, authController.getProfile);
```

---

## Chapter 5: Testing

### 5.1 Test Strategy
The application is tested end-to-end focusing on critical flows: Registration, Listing a book, Admin Approval, Purchasing, Renting, and Dashboard tracking. Both happy paths and error cases are covered.

### 5.2 Unit & Acceptance Testing
Validate individual components such as JWT generation, password hashing, and database queries. Ensure integrated system meets user requirements.

### 5.4 Test Cases
- TC01: Verify user can register and login.
- TC02: Verify seller can list a book and it shows pending.
- TC03: Verify admin can approve book.
- TC04: Verify buyer can place order for live book.
- TC05: Verify seller can confirm order.

### 5.5 Defect log
Defects discovered and addressed:
- 'ActivityIcon' not found in lucide-react (Fixed).
- 'toast' not imported in Cart component (Fixed).
- Hydration mismatch due to browser extensions (Ignored).

---

## Chapter 6 & 7: Limitations & Enhancements
- **Limitations:** Payment is simulated; Cart checkout for multi-item orders is a placeholder; Late fine auto-calculation is not fully implemented; Rental period is hardcoded to 30 days. No email notifications.
- **Enhancements:** Real payment integration (Razorpay/Stripe); Gemini AI metadata extraction from PDF covers; Email/SMS notifications via SendGrid/Twilio; Mobile application using React Native; Rental date picker for flexible durations.

---

## Chapter 8 & 9: Conclusion & Bibliography
The CampusBook application successfully addresses the need for a localized, peer-to-peer textbook marketplace. By integrating role-based access, comprehensive listing management, and dedicated rental tracking, the platform provides a sustainable and cost-effective alternative to purchasing new academic materials.

**Bibliography:**
1. Next.js Documentation: https://nextjs.org/docs
2. Express.js Documentation: https://expressjs.com/
3. MySQL Reference Manual: https://dev.mysql.com/doc/
4. React Icons (lucide-react): https://lucide.dev/

---
---

# PART B: Product Requirements Document (PRD)

## 1. Executive Summary
CampusBook is a web-based marketplace exclusively designed for academic communities that enables students to buy, sell, and rent used textbooks among peers. The platform eliminates the inefficiency of informal secondhand book trading by providing a structured, trusted, and role-driven digital marketplace. The core proposition is **affordability + sustainability**.

## 2. Problem Statement
Students face recurring pain points around textbooks:
- New textbooks are expensive, often used for a single semester.
- No dedicated campus platform for secondhand books.
- Renting options for short-term use don't exist locally.
- Unused books accumulate with no easy way to sell.
- No trust mechanism between student buyers and sellers.

## 3. Goals & Objectives
1. Build a trusted peer-to-peer marketplace for academic books.
2. Support both **buy/sell** and **rent/return** transaction models.
3. Reduce student textbook spending.
4. Promote book reuse and sustainable resource sharing.

## 4. Stakeholders & User Personas
1. **Buyer:** Browses catalogue, purchases/rents books, manages wishlist, tracks active orders.
2. **Seller:** Lists books, sets prices, confirms/cancels orders via fulfillment queue, tracks performance.
3. **Admin:** Reviews and approves/rejects all new book listings.

## 5. System Architecture & Tech Stack
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express.js (REST API)
- **Database:** MySQL (relational, normalized schema)
- **Auth:** JWT (JSON Web Tokens) stored as HTTP cookies

### Backend API Endpoints (Subset)
- `POST /api/auth/register` & `POST /api/auth/login`
- `GET /api/books` & `POST /api/books`
- `POST /api/orders` & `PATCH /api/orders/:id/status`
- `PATCH /api/rentals/:id/return`
- `PATCH /api/admin/books/:id/status`

## 6. Database Schema
10 tables: `roles`, `users`, `categories`, `books`, `orders`, `order_items`, `rentals`, `wishlist`, `reviews`, `payments`.
- A book listing starts in **Pending** status and must be approved by Admin to become **Live**.
- Book `available_quantity` is decremented on purchase/rent and incremented on return.

## 7. Feature Specifications
- **Authentication:** Registration, Login, JWT verification, Logout.
- **Book Browsing:** Grid layout, Full-text search, Category/Condition filters, Pagination.
- **Buyer Dashboard:** Welcome banner, quick-link cards, dynamic recent activity.
- **Order/Rental Management:** Full history, status tracking, overdue detection, return workflows.
- **Seller Dashboard:** Revenue stats, listings table, fulfillment queue for confirming orders.
- **Admin Approval:** Dashboard to approve or reject pending book listings.

## 8. Non-Functional Requirements
- **Security:** bcrypt password hashing, JWT authorization, SQL injection protection.
- **Performance:** Pagination, static image serving, `Promise.allSettled`.
- **Reliability:** LocalStorage state persistence, graceful error handling.

## 9. User Flows
- **Buy:** Browse -> Detail -> Buy Now -> Payment -> Placed -> Seller Confirms.
- **Rent:** Browse -> Detail -> Rent Book -> Placed -> Track via Dashboard -> Return Book.
- **Sell:** Add Book -> Pending -> Admin Approves -> Live -> Fulfill Incoming Order.

## 10. Deployment Architecture (Development)
- **Frontend:** `localhost:3000`
- **Backend:** `localhost:5000`
- **Database:** `localhost:3306` (MySQL)
