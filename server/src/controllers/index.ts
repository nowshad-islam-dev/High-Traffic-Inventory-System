import { RequestHandler } from 'express';
import { Product } from '../models';

export const getProducts: RequestHandler = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

export const createProduct: RequestHandler = async (req, res) => {
  const { name, price, stock } = req.body;
  try {
    const product = await Product.create({
      name,
      price,
      stock,
    });
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Product creation failed' });
  }
};
