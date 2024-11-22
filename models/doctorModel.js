const db = require('../config/db');
const bcrypt = require('bcrypt');

class Doctor {
  // Create a new doctor
  static async create(doctorData) {
    const { first_name, last_name, specialization, email, phone, schedule,password} = doctorData;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.execute(
        'INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule,password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [first_name, last_name, specialization, email, phone, schedule, password]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw new Error('Error creating doctor');
    }
  }

  // Find a doctor by ID
  static async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM doctors WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding doctor by ID:', error);
      throw new Error('Error finding doctor');
    }
  }

  // Find a doctor by email (for login, etc.)
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error('Error finding doctor by email:', error);
      throw new Error('Error finding doctor');
    }
  }

  // Update doctor profile
  static async update(id, updateData) {
    const { first_name, last_name, specialization, phone } = updateData;
    try {
      await db.execute(
        'UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, phone = ? WHERE id = ?',
        [first_name, last_name, specialization, phone, id]
      );
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw new Error('Error updating doctor profile');
    }
  }

  // Delete doctor by ID
  static async delete(id) {
    try {
      await db.execute('DELETE FROM doctors WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw new Error('Error deleting doctor profile');
    }
  }

  // Set doctor’s schedule
  static async setSchedule(doctorId, schedule) {
    try {
      await db.execute('UPDATE doctors SET schedule = ? WHERE id = ?', [JSON.stringify(schedule), doctorId]);
    } catch (error) {
      console.error('Error setting doctor schedule:', error);
      throw new Error('Error setting doctor schedule');
    }
  }

  // Get doctor’s schedule
  static async getSchedule(doctorId) {
    try {
      const [rows] = await db.execute('SELECT schedule FROM doctors WHERE id = ?', [doctorId]);
      return JSON.parse(rows[0].schedule);
    } catch (error) {
      console.error('Error getting doctor schedule:', error);
      throw new Error('Error getting doctor schedule');
    }
  }

  // Get all doctors
  static async findAll() {
    try {
      const [rows] = await db.execute('SELECT id, first_name, last_name, specialization, email, phone FROM doctors');
      return rows;
    } catch (error) {
      console.error('Error retrieving doctors:', error);
      throw new Error('Error retrieving doctors');
    }
  }
}



module.exports = Doctor;