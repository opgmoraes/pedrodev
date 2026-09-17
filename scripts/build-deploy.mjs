import fs from 'fs'
import path from 'path'

const root = process.cwd()
const deployDir = path.join(root, 'deploy')
const distDir = path.join(root, 'dist')
const siteDir = path.join(root, 'public-site')

fs.rmSync(deployDir, { recursive: true, force: true })
fs.mkdirSync(deployDir, { recursive: true })

// 1. Portfólio estático real vai pra raiz do deploy (é o "/")
fs.cpSync(siteDir, deployDir, { recursive: true })

// 2. Build do React (login/admin/área do cliente) vai pra /app dentro do deploy
fs.cpSync(distDir, path.join(deployDir, 'app'), { recursive: true })

console.log('✔ Pasta "deploy" pronta: "/" = portfólio real, "/app" = sistema React.')
