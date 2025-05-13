# 🛍️ E-Commerce App

A full-featured **E-Commerce web application** built with complete **stock**, **order**, **user**, and **admin management systems**.

⚙️ Developed with focus on real-world requirements like **automated stock control**, **order invoices**, and **Razorpay integration**.

---

## 🔧 Features

### 🛒 Admin Section

- **Stock Management (CRUD)**: Add, update, delete products  
- **Automated Stock Control**: Stock auto-updates based on sales (online/offline)  
- **Product Details**: Max 4 images, title, price, description, rating  
- **Category Management**: Categorize products  
- **Admin Login**: Secure access for admin panel  

### 👤 User Section

- **User Registration/Login**: Normal + Google Authentication  
- **Ratings**: Users can rate products  
- **Customer Dashboard**: View personal details (Name, Email, Unique ID)  

### 📦 Order Management

- **Order Details**: Displayed in admin panel  
- **Invoice Generation**: Admin can generate invoices for orders  
- **Offline + Online Selling**: Offline order form updates product stock accordingly  

### 💰 Payment Integration

- **Razorpay**: Integrated for online transactions  

---

## 🧰 Tech Stack

**Backend**:
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Multer (for image upload)  
- Validator  

---

## 🛠 Installation & Setup

### 📁 Clone Repository

```sh
git clone https://github.com/elvinjoy/E-Commerce-App-design.git

npm install

node index.js / nodemon
