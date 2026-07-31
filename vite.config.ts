import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import svgr from 'vite-plugin-svgr';
import removeConsole from 'vite-plugin-remove-console';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const buildVersion = command === 'build' ? Date.now().toString() : 'dev';
    const env = loadEnv(command, process.cwd(), '');
    return {
        base: env.VITE_BASE_PATH || '/',
        plugins: [
            {
                name: 'html-build-version',
                transformIndexHtml(html) {
                    return html.replaceAll('__BUILD_VERSION__', buildVersion);
                },
            },
            svgr({ include: '**/*.svg?react' }),
            removeConsole(),
            react(),
            checker({
                typescript: true,
            }),
        ],
        resolve: {
            alias: [
                { find: '@', replacement: path.resolve(__dirname, 'public') },
                { find: '~', replacement: path.resolve(__dirname, 'src') },
                { find: '$', replacement: path.resolve(__dirname, '.') },
            ],
            dedupe: ['react', 'react-dom'],
        },
        build: {
            minify: 'esbuild',
            rolldownOptions: {
                output: {
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name?.endsWith('.css')) {
                            return 'styles/[name]-[hash][extname]';
                        }
                        if (assetInfo.name?.match(/\.(png|jpe?g|gif|svg|webp)$/)) {
                            return 'images/[name]-[hash][extname]';
                        }
                        if (assetInfo.name?.match(/\.(woff2?|eot|ttf|otf)$/)) {
                            return 'fonts/[name]-[hash][extname]';
                        }
                        return 'assets/[name]-[hash][extname]';
                    },
                    chunkFileNames: `js/[name]-[hash].js`,
                    entryFileNames: 'js/[name]-[hash].js',
                },
            },
        },
        server: {
            watch: {
                ignored: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', '**/logs/**'],
            },
        },
        define: {
            'process.env.DRAGGABLE_DEBUG': JSON.stringify(false),
        },
    };
});
