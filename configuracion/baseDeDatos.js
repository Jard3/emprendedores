const mongoose = require("mongoose");
require("dotenv").config();

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.BASE_DE_DATOS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Conectado a MongoDB");
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB:", error);
        process.exit(1);
    }
};

module.exports = conectarDB;