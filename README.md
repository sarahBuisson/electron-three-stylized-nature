# Electron Three Boilerplate

Boilerplate React + Three.js en TypeScript pour demarrer rapidement un prototype gameplay.

## Stack

- React + Vite + TypeScript
- Three.js + `@react-three/fiber` + `@react-three/drei`
- Post-processing: `@react-three/postprocessing` + `postprocessing`
- Desktop packaging: Electron + electron-builder

## Structure

```text
src/
  App.tsx
  components/
    gameplay/
    menu/
    ui/
  services/
    game/
    storage/
    utils/
  config/
  types/
  utils/
```

## Flux UI par defaut

1. Ecran titre
2. Menu 3D avec hover (souris + clavier)
3. Surcouche 2D "Regles"

## Commandes

```bash
npm install
npm run dev
npm run build:web
npm run dist:win
```

## CI/CD

Workflow: `.github/workflows/ci.yml`

- Trigger auto: `push` sur `main`
- Trigger manuel: `workflow_dispatch`
- Job web: build + deploy GitHub Pages
- Job Windows: build `.exe` portable et upload artifact
- Retention: les 3 derniers artifacts `win-portable-main-*` sont conserves
- Exclusion retention: artifacts `release-win-*`

## Alias imports

- `@components/*`
- `@services/*`
- `@config/*`
- `@models/*` (types de données)
- `@utils/*`

## Notes

- Le portable `.exe` n'est pas signe (MVP), Windows peut afficher SmartScreen.
- `ElectronFileAdapter` est un stub pour future persistance desktop par IPC.
