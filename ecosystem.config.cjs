module.exports = {
  apps: [
    {
      name: "rewiki-frontend-server",
      script: "7-fullstack-ethan-realestatewiki-frontend-main/app.js",
      watch: true,
      env_development: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

// pm2 start ecosystem.config.js // NODE_ENV: "development"
// pm2 start ecosystem.config.js env-production // NODE_ENV: "production"
