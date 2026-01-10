/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix for RainbowKit/WalletConnect
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    
    // Ignore pino-pretty and react-native warnings
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Handle async-storage issue
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
