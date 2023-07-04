const { Perbaikan, Kendaraan } = require('../db/models');
const {
  kendaraanValidationSchema,
} = require('../validator/kendaraanValidator');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Get all perbaikan
async function getAllPerbaikan(req, res) {
  return res.status(200).json({ messaage: 'getAllPerbaikan' });
}

// Get perbaikan by ID
async function getPerbaikanById(req, res) {
  return res.status(200).json({ messaage: 'getPerbaikanById' });
}

// Create new perbaikan
async function storePerbaikan(req, res) {
  return res.status(200).json({ messaage: 'storePerbaikan' });
}

// Update perbaikan
async function updatePerbaikan(req, res) {
  return res.status(200).json({ messaage: 'updatePerbaikan' });
}

// Delete perbaikan
async function destroyPerbaikan(req, res) {
  return res.status(200).json({ messaage: 'destroyPerbaikan' });
}

module.exports = {
  getAllPerbaikan,
  getPerbaikanById,
  storePerbaikan,
  updatePerbaikan,
  destroyPerbaikan,
};
