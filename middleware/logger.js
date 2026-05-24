/**
 * Request logger middleware
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - startTime;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.userId || 'anonymous'
    };

    if (res.statusCode >= 500) {
      console.error('ERROR:', JSON.stringify(logData));
    } else if (res.statusCode >= 400) {
      console.warn('WARN:', JSON.stringify(logData));
    } else {
      console.info('INFO:', JSON.stringify(logData));
    }

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Request ID middleware
 */
export const requestIdMiddleware = (req, res, next) => {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};