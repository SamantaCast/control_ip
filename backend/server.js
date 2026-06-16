const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// APP
const app = express();
app.use(cors());
app.use(express.json());

// MODELOS / RUTAS / MIDDLEWARE
const User = require('./models/user');
const impresorasRoutes = require('./routes/impresoras.routes');
const usersRoutes = require('./routes/users.routes');
const { verificarToken, soloAdmin } = require('./middleware/auth');

// CONEXIÓN A MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log("Error al conectar a MongoDB:", err));

// RUTA DE PRUEBA
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const user = await User.findOne({ usuario });
    if (!user) {
      return res.status(401).json({ mensaje: 'Datos incorrectos' });
    }

    const coincide = user.password.startsWith('$2')
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!coincide) {
      return res.status(401).json({ mensaje: 'Datos incorrectos' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        rol: user.rol,
        usuario: user.usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      mensaje: 'Login correcto',
      token,
      rol: user.rol
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


// RUTAS DE IMPRESORAS

app.use('/api/impresoras', impresorasRoutes);

// RUTAS DE ADMINISTRADORES

app.use('/api/users', verificarToken, soloAdmin, usersRoutes);

// PUERTO
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});