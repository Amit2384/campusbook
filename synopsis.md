# MCA Mini Project Synopsis: Old Book Resell & Rental Application

Names: Amit Pramod Chandajkar (R.NO: 25107), Rushikesh Santosh Shivale (R.NO: 25155)

1. Introduction
The proliferation of digital technology has significantly altered methods of commerce, particularly in the realm of online transactions. Within academic environments, students frequently require textbooks for their coursework, yet acquiring new books each semester can be financially burdensome. Concurrently, many students possess textbooks that are no longer needed after course completion.

The CampusBook (Old Book Resell & Rental Application) is conceptualized as a web-based platform to address this challenge by offering an online system where students can sell their used books or rent them to peers. This platform aims to facilitate effortless searching for available books, price comparisons, and the procurement of study materials at economical rates. The system is designed to foster a community-based marketplace for students, thereby promoting the reuse of books and mitigating educational expenses. Additionally, the application incorporates functionalities such as book listing, search capabilities, order management, and user feedback mechanisms to enhance the overall user experience.

1.1 Abstract
The Old Book Resell & Rental Application is a web-based system engineered to streamline the buying, selling, and renting of pre-owned books among students. Its primary objective is to furnish an accessible and cost-effective platform for students to exchange academic literature. The application enables users to list books for either sale or rental, search for specific titles based on criteria such as title, subject, or price, and execute orders for purchase or rental. The system further encompasses modules for wishlist management, order tracking, and a rating and review functionality to cultivate trust among its users. This project endeavors to diminish the expenditure on educational resources while concurrently advocating for the reuse of books within academic communities. The system's development leverages contemporary web technologies, specifically Next.js for the frontend, Node.js (Express.js) for backend services, and MySQL for database management.

1.2 System and Need for System
Students in numerous educational institutions frequently encounter difficulties in securing affordable academic books. The recurring expense of purchasing new textbooks each semester, coupled with the time-consuming nature of locating second-hand books through informal channels, underscores the necessity for a structured solution. The impetus for this system arises from the following challenges:
- The substantial cost associated with purchasing new textbooks.
- The absence of a dedicated platform specifically for the buying and selling of used academic books.
- The complexities involved in renting books for short-term academic requirements.
- The inefficient management of unused books accumulated by students.

The proposed system establishes an organized platform where students can readily list their books for resale or rental, and others can conveniently locate and acquire them.

1.3 Scope of System
The scope of this system encompasses the development of a web-based application that empowers students to buy, sell, and rent books exclusively within an academic community. The system provides key functionalities including:
- Book listing for both resale and rental purposes.
- Advanced searching and filtering options for books.
- Management of rental durations and associated costs.
- Tracking of orders and financial transactions.
- Provision for ratings and reviews.
- AI-powered metadata extraction: Integration of Gemini AI for automated text extraction from uploaded PDF books to ensure high-quality listings.

In subsequent development phases, the system could be expanded to integrate online payment gateways and mobile application support.

1.4 Operating Environment – Hardware and Software

Hardware Requirements
- Processor: Intel Core i3 or a more advanced model.
- RAM: A minimum of 4 GB.
- Hard Disk: 20 GB of available space.

Software Requirements
- Operating System: Windows 10 or a newer version.
- Web Server: Node.js (Express.js Runtime).
- Database: MySQL.
- Browser: Google Chrome, Mozilla Firefox, or Microsoft Edge.

1.5 Brief Description of Technology Used
The system's development employs contemporary full-stack web technologies. Frontend technologies are utilized for crafting a dynamic user interface, while backend technologies manage server-side processing, database interactions, and the application's core logic.

- Next.js / React.js: Instrumental in constructing a dynamic, responsive, and SEO-friendly user interface.
- Node.js & Express.js: Facilitates the development of robust REST APIs, enabling seamless communication between the frontend and backend.
- MySQL: Serves as the relational database, responsible for storing all system data, including user profiles, book listings, and transaction records.
- Gemini AI: Utilized for OCR and intelligent text parsing to automate the book indexing process.

1.6 Operating Systems Used
The system undergoes development and rigorous testing primarily on the Windows Operating System. However, the system is designed to be cross-platform and compatible with other operating systems, such as Linux or macOS, provided the Node.js environment is configured.

1.7 Front End Technology
The frontend of the system is developed using the following technologies:
- HTML5 / CSS3
- Tailwind CSS (for modern, responsive styling)
- Next.js (App Router)
- JavaScript (ES6+)

1.8 Database Used
The system utilizes MySQL, a widely recognized relational database management system (RDBMS). MySQL is responsible for securely storing all critical data, which includes:
- User information and Role-Based Access Control (RBAC).
- Comprehensive book listings.
- Rental records and duration tracking.
- Order transactions and wishlists.
- Reviews and ratings.

2. Proposed System
The proposed system is a web-based platform engineered to enable students to efficiently buy, sell, and rent used books. It offers a centralized framework where users can list their books, search for available titles, and manage transactions seamlessly.

This system is anticipated to enhance access to academic books while simultaneously alleviating the financial burden on students. It also champions the reuse of books, contributing to a more affordable and sustainable educational environment.

2.1 Study of Similar Systems
While various online platforms currently offer book resale and rental services, such as Amazon Used Books Marketplace, OLX, and Quikr, these platforms are general marketplaces. They are not specifically tailored to the unique requirements of academic institutions. The proposed system distinctively focuses on students and academic literature, providing features specifically designed to meet their needs.

2.2 Feasibility Study

Technical Feasibility
The project is technically viable, as it is implemented using established technologies such as Next.js, Node.js, and MySQL. These technologies are broadly accessible and well-suited for the development of high-performance web applications.

Economic Feasibility
The system necessitates minimal development costs, primarily due to its reliance on open-source technologies and community-driven tools.

Operational Feasibility
The system is designed for ease of use with a modern UI, requiring minimal training for students, which makes it highly practical for the target campus audience.

2.3 Objectives of Proposed System
- To establish an online platform for the sale and rental of used books.
- To reduce the financial outlay for academic books for students.
- To facilitate effortless searching and filtering of books.
- To accurately maintain records of all transactions and rentals.
- To provide users with the ability to review and rate sellers.

2.4 Module Specifications
The system comprises the following distinct modules:
- Book Listing Module: Allows users to add books for sale or rent with details like title, author, category, price, and condition.
- Search and Filter Module: Enables deep searching based on criteria including title, subject, or a specified price range.
- Rental Management Module: Oversees rental durations, calculates costs, and tracks active rentals.
- Order and Transaction Module: Manages all book purchases and transaction history.
- Wishlist Module: Allows users to save resources for potential future purchase.
- Rating and Review Module: Empowers users to rate sellers and provide feedback on book conditions.
- Admin Management Module: Grants administrators the ability to monitor listings, manage user accounts, and ensure platform integrity.

2.5 Users of System
The system caters to three primary user types:
- Buyer (Student/User): Search, Purchase, Rent books, and submit reviews.
- Seller (Student/User): List books for resale or rental, manage private inventory.
- Administrator: Approve/remove listings, manage users, and monitor overall platform activity.

CampusBook – Making academic resources accessible, affordable, and sustainable.
