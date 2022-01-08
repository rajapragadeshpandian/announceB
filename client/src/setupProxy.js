const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ['/changelog', '/feedback', '/customer','/widget',
    '/auth', '/account'],
    createProxyMiddleware({
      target: "http://localhost:5000",
    })
  );
};



// app.use('/changelog',changeLogDetails);
// app.use('/feedback', feedbackDetails);
// app.use('/customer', customerDetails);
// app.use('/widget', widget);
// app.use('/auth', userDetails);
// app.use('/account', accountDetails);
