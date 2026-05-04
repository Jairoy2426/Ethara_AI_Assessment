module.exports = {
  apps: [
    {
      name: "ethara-backend",
      cwd: "./backend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
