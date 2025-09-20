/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuração de imagens otimizada
    images: {
        remotePatterns: [
            {
                hostname: "utfs.io",
            },
            {
                hostname: "lh3.googleusercontent.com", // Google OAuth avatars
            },
        ],
        // Formatos modernos para melhor performance
        formats: ['image/webp', 'image/avif'],
        // Cache de imagens otimizado
        minimumCacheTTL: 60 * 60 * 24 * 7, // 7 dias
    },

    // Compressão para produção
    compress: true,

    // Headers de segurança
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    }
                ]
            }
        ]
    },

    // Otimizações de bundle
    experimental: {
        // Reduz o tamanho do bundle removendo código não utilizado
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            'date-fns'
        ],
        // Melhora performance do servidor
        serverComponentsExternalPackages: ['@prisma/client'],
    },

    // Configurações de produção
    poweredByHeader: false, // Remove header "X-Powered-By: Next.js"

    // Configurações de build otimizadas
    typescript: {
        // Ignora erros de TypeScript durante o build em produção
        // (garante que o build não falhe por pequenos erros)
        ignoreBuildErrors: false,
    },

    eslint: {
        // Roda ESLint durante o build
        ignoreDuringBuilds: false,
    },

    // Configurações de output para deployment
    output: 'standalone', // Otimizado para containers/serverless

    // Configurações de redirecionamento
    async redirects() {
        return [
            {
                source: '/admin/login',
                destination: '/auth/admin',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
