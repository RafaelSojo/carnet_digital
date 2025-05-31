const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger config
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Carnet Digital',
    version: '1.0.0',
    description: 'Documentación del API usando Swagger',
  },
  servers: [{ url: 'http://localhost:' + process.env.PORT }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
const loginRoutes = require('./routes/login.routes');
app.use('/login', loginRoutes);

// Arranque
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/api-docs/`);
});

//Para probar la conexion a la base de datos
const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => console.log('🔌 Conexión a la base de datos exitosa'))
  .catch(err => console.error('❌ Error al conectar DB:', err));

