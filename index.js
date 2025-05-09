const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Connection = require('./Config/connection');
const userRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const productRoutes = require('./Routes/productsRoutes');
const orderRoutes = require('./Routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(Connection.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('Welcome to E-commerce API');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

app.listen(Connection.PORT, () => {
  console.log(`Server running on port ${Connection.PORT}`);
});

