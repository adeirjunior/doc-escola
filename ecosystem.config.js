module.exports = {
    apps: [
        {
            name: 'Nova Doc Escola',
            script: 'node_modules/next/dist/bin/next',
            args: 'start -p 3000',
            cwd: './',
            instances: 1,
            watch: false,
            env: {
                NODE_ENV: 'production',
                DATABASE_URL: process.env.DATABASE_URL,
                NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
                BASE_URL: process.env.BASE_URL,
                AUTH_SECRET: process.env.AUTH_SECRET,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            },
            env_development: {
                NODE_ENV: 'development',
                DATABASE_URL: process.env.DATABASE_URL,
                NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
                BASE_URL: process.env.BASE_URL,
                AUTH_SECRET: process.env.AUTH_SECRET,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
            },
        },
    ],
};
