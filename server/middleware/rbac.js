// Require Admin role
exports.requireAdmin = (req, res, next) => {
  const userRole = req.user && req.user.role ? String(req.user.role).toUpperCase().trim() : null;
  
  if (userRole === 'ADMIN') {
    next();
  } else {
    console.log(`[RBAC] Admin access denied for user: ${req.user?.email || req.user?.phone} | Role: ${req.user?.role}`);
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// Require Staff or Admin role
exports.requireStaffOrAdmin = (req, res, next) => {
  const userRole = req.user && req.user.role ? String(req.user.role).toUpperCase().trim() : null;
  
  if (userRole === 'ADMIN' || userRole === 'STAFF') {
    next();
  } else {
    console.log(`[RBAC] Access denied for user: ${req.user?.email || req.user?.phone} | Role: ${req.user?.role}`);
    res.status(403).json({
      success: false,
      message: 'Access denied. Staff or Admin privileges required.'
    });
  }
};

// Check if user belongs to the business
exports.checkBusinessAccess = (req, res, next) => {
  if (req.user && req.user.businessId) {
    req.businessId = req.user.businessId;
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Business access denied'
    });
  }
};
