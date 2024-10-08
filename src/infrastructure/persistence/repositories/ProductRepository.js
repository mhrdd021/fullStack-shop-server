// src/infrastructure/repositories/ProductRepository.js
const IProductRepository = require('../../../domain/repositories/IProductRepository');
const db = require('../database/mySQL');

class ProductRepository extends IProductRepository {
  static async getAllProducts() {
    try {
      const [rows] = await db.execute('SELECT * FROM products');
      return rows;
    } catch (error) {
      console.error('Error in getProducts productRepository', error);
      throw error;
    }
  }

  static async getSingleProduct(id) {
    try {
      const [
        rows,
      ] = await db.execute(
        'SELECT *  FROM products WHERE product_id = ? LIMIT 1',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in getProduct product repository', error);
      throw error;
    }
  }

  static async addProduct(productItem) {
    try {
      const {
        name,
        unit_price,
        quantity_in_stock,
        discount_percentage,
        image_url,
        price_after_discount,
        description,
      } = productItem;

      if (!name || !unit_price) {
        throw new Error(' infrastructure error: Missing required product data');
      }

      const result = await db.execute(
        'INSERT INTO products (name, unit_price, quantity_in_stock, discount_percentage, image_url, price_after_discount, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          unit_price,
          quantity_in_stock || '',
          discount_percentage || '',
          image_url || '',
          price_after_discount || '',
          description || '',
        ]
      );
      return result;
    } catch (error) {
      console.error('Error in addProduct product repository', error);
      throw error;
    }
  }

  static async updateProduct(productId, updatedValue) {
    const {
      name,
      unitPrice,
      quantityInStock,
      discountPercentage,
      imageUrl,
      priceAfterDiscount,
      description,
    } = updatedValue;
    try {
      if (
        productId === undefined ||
        !name ||
        !quantityInStock ||
        !unitPrice ||
        discountPercentage
      ) {
        throw new Error('Missing required product data');
      } else {
        const updatedProduct = db.execute(
          'UPDATE products SET name = ?, unit_price = ?, quantity_in_stock = ?, discount_percentage = ?, image_url = ?, price_after_discount = ?, description = ? WHERE product_id = ?',
          [
            name,
            unitPrice,
            quantityInStock,
            discountPercentage,
            imageUrl,
            priceAfterDiscount,
            description,
            productId,
          ]
        );
        return updatedProduct;
      }
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteProduct(id) {
    try {
      const result = await db.execute(
        'DELETE FROM products WHERE product_id = ?;',
        [id]
      );
      return result.affectedRows > 0;;
    } catch (error) {
      console.error('Error in deleteProduct product repository', error);
      throw error;
    }
  }
}

module.exports = { ProductRepository };
