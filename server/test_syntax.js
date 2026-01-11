try {
  require('dotenv').config();
  const sendEmail = require('./utils/sendEmail');
  const authController = require('./controllers/authController');
  const authRoutes = require('./routes/auth');
  console.log('✅ Syntax Check PASSED');
} catch (e) {
  console.error('❌ Syntax Check FAILED');
  console.error(e);
}
