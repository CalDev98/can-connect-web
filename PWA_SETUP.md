# Configuration PWA - CANConnect

L'application CANConnect est maintenant une Progressive Web App (PWA) complète.

## Fonctionnalités PWA

✅ **Installable** - Les utilisateurs peuvent installer l'app sur leur appareil
✅ **Hors ligne** - Fonctionne sans connexion Internet (avec cache)
✅ **Service Worker** - Cache les ressources pour une meilleure performance
✅ **Manifest** - Configuration complète pour l'installation
✅ **Raccourcis** - Accès rapide aux fonctionnalités principales

## Génération des icônes

Pour que la PWA fonctionne complètement, vous devez créer les icônes suivantes dans `/public/icons/`:

- `icon-72x72.png` (72x72px)
- `icon-96x96.png` (96x96px)
- `icon-128x128.png` (128x128px)
- `icon-144x144.png` (144x144px)
- `icon-152x152.png` (152x152px)
- `icon-192x192.png` (192x192px) - **Requis**
- `icon-384x384.png` (384x384px)
- `icon-512x512.png` (512x512px) - **Requis**

### Méthodes pour générer les icônes

#### Option 1: Outils en ligne (Recommandé)
1. **RealFaviconGenerator**: https://realfavicongenerator.net/
   - Uploadez une image 512x512px
   - Téléchargez tous les formats
   - Placez-les dans `/public/icons/`

2. **PWA Builder**: https://www.pwabuilder.com/imageGenerator
   - Génère automatiquement tous les formats nécessaires

#### Option 2: Création manuelle
1. Créez une icône 512x512px avec votre logo
2. Utilisez un outil de redimensionnement (Photoshop, GIMP, ImageMagick)
3. Redimensionnez aux tailles requises
4. Placez tous les fichiers dans `/public/icons/`

#### Option 3: Script automatique (à venir)
```bash
# Installer pwa-asset-generator
npm install -g pwa-asset-generator

# Générer les icônes depuis une image source
pwa-asset-generator source-icon.png public/icons --icon-only
```

## Test de la PWA

### Chrome DevTools
1. Ouvrez Chrome DevTools (F12)
2. Allez dans l'onglet "Application"
3. Vérifiez:
   - **Manifest** - Doit afficher les informations de l'app
   - **Service Workers** - Doit être actif
   - **Cache Storage** - Doit contenir les ressources mises en cache

### Test d'installation
1. Sur mobile: Le navigateur proposera automatiquement l'installation
2. Sur desktop: Cliquez sur l'icône d'installation dans la barre d'adresse
3. Le prompt d'installation apparaîtra après quelques secondes d'utilisation

### Test hors ligne
1. Ouvrez l'application
2. Ouvrez Chrome DevTools > Network
3. Activez "Offline"
4. Rechargez la page - l'app doit fonctionner depuis le cache

## Structure des fichiers PWA

```
public/
├── manifest.json          # Configuration PWA
├── sw.js                  # Service Worker
├── offline.html           # Page hors ligne
└── icons/                 # Icônes PWA (à créer)
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png  # Requis
    ├── icon-384x384.png
    └── icon-512x512.png   # Requis
```

## Configuration

### Manifest (`/public/manifest.json`)
- Nom de l'application
- Couleurs du thème
- Mode d'affichage (standalone)
- Raccourcis vers les fonctionnalités principales

### Service Worker (`/public/sw.js`)
- Cache des pages principales
- Stratégie: Cache First, Network Fallback
- Mise à jour automatique
- Support des notifications push

### Meta Tags (dans `app/layout.tsx`)
- Theme color
- Apple touch icon
- Viewport configuration
- Manifest link

## Déploiement

Lors du déploiement sur Vercel ou autre plateforme:
1. Assurez-vous que tous les fichiers dans `/public/` sont déployés
2. Vérifiez que le service worker est accessible à `/sw.js`
3. Testez l'installation sur différents appareils
4. Vérifiez les performances avec Lighthouse

## Notes importantes

- ⚠️ Les icônes sont **requises** pour que la PWA fonctionne correctement
- Le service worker ne cache pas les appels API (OpenRouter)
- Les limites freemium sont toujours appliquées même hors ligne
- Le cache est automatiquement mis à jour lors des nouvelles versions

## Support

Pour plus d'informations sur les PWA:
- https://web.dev/progressive-web-apps/
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

