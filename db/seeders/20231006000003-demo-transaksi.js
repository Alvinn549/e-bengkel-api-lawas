'use strict';

const { faker } = require('@faker-js/faker/locale/id_ID');
const { Perbaikan } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const perbaikans = await Perbaikan.findAll({
      attributes: ['id'],
    });

    const fakeTransaksi = perbaikans.map((perbaikan) => {
      return {
        id: faker.string.uuid(),
        perbaikan_id: perbaikan.id,
        order_id: faker.string.alpha(6),
        gross_amount: faker.commerce.price({ min: 500, dec: 0 }),
        tipe_bank: faker.helpers.arrayElement(['bni', 'bca', 'bri']),
        status: faker.helpers.arrayElement([
          'capture',
          'settlement',
          'deny',
          'cancel',
          'pending',
        ]),
        nama: faker.person.fullName(),
        no_telp: faker.phone.number(),
        email: faker.internet.email(),
        response_midtrans: faker.datatype.json(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert('Transaksis', fakeTransaksi, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transaksis', null, {});
  },
};
