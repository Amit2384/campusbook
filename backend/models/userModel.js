const pool = require('../config/db');

exports.findUserByEmail = async (email) => {
    const [rows] = await pool.query(`
    SELECT users.*, roles.name as role 
    FROM users 
    JOIN roles ON users.role_id = roles.id 
    WHERE email = ?
  `, [email]);
    return rows[0];
};

exports.findUserById = async (id) => {
    const [rows] = await pool.query(`
    SELECT users.id, users.name, users.email, users.phone, users.profile_image, roles.name as role 
    FROM users 
    JOIN roles ON users.role_id = roles.id 
    WHERE users.id = ?
  `, [id]);
    return rows[0];
};

exports.updateUserProfile = async (id, { name, phone }) => {
    const [result] = await pool.query(`
    UPDATE users 
    SET name = ?, phone = ? 
    WHERE id = ?
  `, [name, phone, id]);
    return result.affectedRows > 0;
};

exports.updateProfileImage = async (id, imageUrl) => {
    const [result] = await pool.query(`
    UPDATE users 
    SET profile_image = ? 
    WHERE id = ?
  `, [imageUrl, id]);
    return result.affectedRows > 0;
};

exports.createUser = async (userData) => {
    const { role_id, name, email, password, phone } = userData;
    const [result] = await pool.query(`
    INSERT INTO users (role_id, name, email, password, phone) 
    VALUES (?, ?, ?, ?, ?)
  `, [role_id, name, email, password, phone]);
    return result.insertId;
};

exports.getRoleByName = async (roleName) => {
    const [rows] = await pool.query('SELECT id FROM roles WHERE name = ?', [roleName]);
    return rows[0];
};

exports.updatePasswordByEmail = async (email, hashedPassword) => {
    const [result] = await pool.query(`
    UPDATE users 
    SET password = ? 
    WHERE email = ?
  `, [hashedPassword, email]);
    return result.affectedRows > 0;
};
