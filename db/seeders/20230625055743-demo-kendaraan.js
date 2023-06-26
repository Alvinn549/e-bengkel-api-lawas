'use strict';

const { faker } = require('@faker-js/faker/locale/id_ID');
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll();

    const fakeKendaraan = Array.from({ length: 50 }).map(() => ({
      id: faker.string.uuid(),
      user_id: faker.helpers.arrayElement(users).id,
      no_plat: faker.vehicle.vrm(),
      merek: faker.vehicle.vehicle(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Kendaraans', fakeKendaraan, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Kendaraans', null, {});
  },
};
