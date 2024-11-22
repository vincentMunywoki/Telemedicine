const db = require('../config/db');

class Appointment {
  static async getAllByPatient(patient_name) {
    const [rows] = await db.execute('SELECT * FROM appointments WHERE patient_name = ?', [patient_name]);
    return rows;
  }

  static async getAllByDoctor(doctor_id) {
    const [rows] = await db.execute('SELECT * FROM appointments WHERE doctor_id = ?', [doctor_id]);
    return rows;
  }

  static async create(patient_name, doctor_id, appointment_date, appointment_time, status = 'scheduled') {
    if (!patient_name || !doctor_id || !appointment_date || !appointment_time || !status) {
      throw new Error('All fields are required');
    }

    const query = 'INSERT INTO appointments (patient_name, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)';
    await db.execute(query, [patient_name, doctor_id, appointment_date, appointment_time, status]);
  }

  static async update(appointment_id, newDate, newTime) {
    const [existingAppointment] = await db.execute('SELECT * FROM appointments WHERE id = ?', [appointment_id]);
    if (existingAppointment.length === 0) {
      throw new Error('Appointment not found');
    }
    await db.execute('UPDATE appointments SET appointment_date = ?, appointment_time = ? WHERE id = ?', [newDate, newTime, appointment_id]);
  }

  static async cancel(appointment_id) {
    const [existingAppointment] = await db.execute('SELECT * FROM appointments WHERE id = ?', [appointment_id]);
    if (existingAppointment.length === 0) {
      throw new Error('Appointment not found');
    }
    await db.execute('UPDATE appointments SET status = "canceled" WHERE id = ?', [appointment_id]);
  }
}

module.exports = Appointment;