const sequelize = require('sequelize');

const db = new sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/database.db'
});

// table for hospitals
const Hospital = db.define('hospital', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        // autoIncrement: true
    },

    name: {
        type: sequelize.STRING(50),
        allowNull: false,
        primaryKey: true
    },

    city: {
        type: sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
    },

    locality: {
        type: sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
    },

    phone: {
        type: sequelize.NUMBER,
        allowNull: false
    },

    contact_person: {
        type: sequelize.STRING(50),
    }
})

// table for hospital slots
const Hospital_Slots = db.define('hospital_slots', {
    hospital_id: {
        type: sequelize.INTEGER,
    },

    name: {
        type: sequelize.STRING(50),
        allowNull: false,
        primaryKey: true
    },

    city: {
        type: sequelize.STRING(30),
        primaryKey: true,
        allowNull: false
    },

    date: {
        type: sequelize.DATEONLY,
        allowNull: false,
        primaryKey: true
    },

    slots: {
        type: sequelize.STRING(12),
        defaultValue: "000000000000"
    }
})

// table for user appointments
const User_Appts = db.define('user_appts', {

    name: {
        type: sequelize.STRING(50),
        allowNull: false,
    },

    city: {
        type: sequelize.STRING(30),
        allowNull: false
    },

    dob: {
        type: sequelize.DATEONLY,
        allowNull: false
    },

    phone: {
        type: sequelize.NUMBER,
        allowNull: false
    },

    email: {
        type: sequelize.STRING(60),
        allowNull: false,
        primaryKey: true
    },

    aadhaar: {
        type: sequelize.STRING(13),
        allowNull: false,
        unique: true,
    },

    password: {
        type: sequelize.STRING(20),
        allowNull: false
    },

    hospital_name: {
        type: sequelize.STRING(50),
        allowNull: false,
    },

    hospital_id: {
        type: sequelize.INTEGER
    },

    hospital_city: {
        type: sequelize.STRING(30),
        allowNull: false
    },

    appt_date: {
        type: sequelize.DATEONLY,
        allowNull: false
    },

    appt_slot: {
        type: sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = {
    db, Hospital, Hospital_Slots, User_Appts
}