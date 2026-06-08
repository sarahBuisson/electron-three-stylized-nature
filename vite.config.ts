import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

export default defineConfig({
    plugins: [react(), glsl()],
    base: './',
    resolve: {
        alias: {
            '@components': resolve(__dirname, 'src/components'),
            '@assets': resolve(__dirname, 'src/components'),
            '@services': resolve(__dirname, 'src/services'),
            '@config': resolve(__dirname, 'src/config'),
            '@models': resolve(__dirname, 'src/types'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@shaders': resolve(__dirname, 'src/shaders'),
            '@pages':   resolve(__dirname, 'src/pages'),
        },
    },
    assetsInclude: [
        '**/*.stl',   // STereoLithography
        '**/*.mp3',   // STereoLithography
        '**/*.svg',   // STereoLithography
        '**/*.glb',   // GL Binary (GLTF)
        '**/*.gltf',  // GL Transmission Format
        '**/*.fbx',   // Filmbox
        '**/*.obj',   // Wavefront OBJ
        '**/*.dae',   // COLLADA
        '**/*.ply',   // Polygon File Format
        '**/*.png',   // Polygon File Format
    ],
    minify: false,
})
