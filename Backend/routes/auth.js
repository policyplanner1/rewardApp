const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/* ============================================================
   REGISTER (SEPARATE FOR EACH ROLE)
   ============================================================ */

router.post('/vendor/register', (req, res) => 
  authController.register(req, res, 'vendor')
);

router.post('/manager/register', (req, res) => 
  authController.register(req, res, 'vendor_manager')
);

router.post('/admin/register', (req, res) => 
  authController.register(req, res, 'admin')
);


/* ============================================================
   LOGIN (SEPARATE FOR EACH ROLE)
   ============================================================ */

router.post('/vendor/login', (req, res) =>
  authController.login(req, res, 'vendor')
);

router.post('/manager/login', (req, res) =>
  authController.login(req, res, 'vendor_manager')
);

router.post('/admin/login', (req, res) =>
  authController.login(req, res, 'admin')
);


/* ============================================================
   USER PROFILE + LOGOUT (PROTECTED)
   ============================================================ */

router.get('/me', authenticateToken, authController.getProfile);

router.post('/logout', authenticateToken, authController.logout);


module.exports = router;
