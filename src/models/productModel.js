const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async ({ name, price, category_id }) => {
  const [result] = await db.execute(
    'INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)',
    [name, price, category_id || null]
  );
  return result.insertId;
};

exports.update = async (id, { name, price, category_id }) => {
  const [result] = await db.execute(
    'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?',
    [name, price, category_id || null, id]
  );
  return result.affectedRows;
};

exports.remove = async (id) => {
  const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows;
};
