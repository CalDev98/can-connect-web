# CANConnect - Guide pour la CAN 2025

Application web Next.js 14 pour les visiteurs de la Coupe d'Afrique des Nations 2025 au Maroc.

## 🚀 Fonctionnalités

1. **Assistant IA pour les Touristes** - Chat interface avec recommandations sur la nourriture, les lieux à visiter, les transports et conseils culturels
2. **Traducteur Multilingue vers Darija** - Traduction depuis le français, anglais, espagnol ou portugais vers le Darija marocain (avec script arabe et phonétique)
3. **Localisateur de Stades** - Trouvez tous les stades de la CAN 2025 avec calcul de distance basé sur la géolocalisation
4. **Urgence & Assistance** - Numéros d'urgence, hôpitaux, ambassades et phrases utiles en Darija
5. **Calendrier des Matchs** - Calendrier complet des matchs avec filtres par ville, date et stade

## 🛠️ Technologies

- **Next.js 14** avec App Router
- **TypeScript**
- **Tailwind CSS** pour le styling
- **React Query** (@tanstack/react-query) pour la gestion des données
- **OpenRouter API** pour l'IA et la traduction
- **Lucide React** pour les icônes

## 📦 Installation

1. Clonez le repository ou naviguez vers le dossier du projet

2. Installez les dépendances:
```bash
npm install
```

### Variables d'environnement

Ajoutez les clés dans `.env.local` :

```
NEXT_PUBLIC_OPENROUTER_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

> Supabase est utilisé pour stocker les e-mails des utilisateurs Premium dans la table `premium_users`.

3. Configurez les variables d'environnement:
```bash
cp .env.local.example .env.local
```

Puis éditez `.env.local` et ajoutez votre clé API OpenRouter:
```
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Lancez le serveur de développement:
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🏗️ Structure du Projet

```
/app
  /assistant        # Page Assistant IA
  /translate        # Page Traducteur
  /stadiums         # Page Localisateur de Stades
  /emergency        # Page Urgence & Assistance
  /matches          # Page Calendrier des Matchs
  layout.tsx        # Layout principal
  page.tsx          # Page d'accueil
  providers.tsx     # Providers React Query

/components
  ButtonCard.tsx    # Carte de navigation
  ChatBubble.tsx   # Bulle de chat
  InputBar.tsx     # Barre de saisie
  StadiumCard.tsx  # Carte de stade

/hooks
  useAI.ts         # Hook pour l'Assistant IA
  useTranslation.ts # Hook pour la traduction
  useLocation.ts   # Hook pour la géolocalisation

/data
  stadiums.json    # Données des stades
  matches.json     # Données des matchs
  emergency.json   # Données d'urgence
```

## 🎨 Design

L'application utilise une palette de couleurs inspirée du Maroc:
- **Bleu** (#0066CC) - Couleur principale
- **Or** (#D4AF37) - Accents
- **Blanc** - Arrière-plans

## 📱 Responsive

L'application est entièrement responsive et optimisée pour mobile, tablette et desktop.

## 🚀 Déploiement sur Vercel

1. Poussez votre code sur GitHub
2. Importez le projet dans Vercel
3. Ajoutez la variable d'environnement `NEXT_PUBLIC_OPENROUTER_API_KEY`
4. Déployez!

## 📝 Notes

- L'application nécessite une clé API OpenRouter pour fonctionner
- La géolocalisation nécessite la permission du navigateur
- Les images des stades utilisent des URLs Unsplash (peuvent être remplacées)

## 📄 Licence

MIT

