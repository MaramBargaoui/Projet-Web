// config-overrides.js
module.exports = function override(config, env) {
    // If you're using Webpack Dev Server, replace the deprecated option here
    if (config.devServer) {
      config.devServer.setupMiddlewares = (middlewares, devServer) => {
        // Add any custom middleware here if needed
        return middlewares;
      };
    }
  
    return config;
  };
  