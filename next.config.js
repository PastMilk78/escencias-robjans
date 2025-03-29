/** @type {import('next').NextConfig} */
const nextConfig = {
  // Excluye el directorio de scripts de la compilación
  webpack: (config, { isServer }) => {
    // Excluir scripts del proceso de construcción
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('src/scripts/**/*');
    }
    return config;
  }
};

module.exports = nextConfig; 