# Guide de Configuration - CANConnect

## Configuration de l'API OpenRouter

1. Créez un compte sur [OpenRouter](https://openrouter.ai/)
2. Obtenez votre clé API depuis le dashboard
3. Créez un fichier `.env.local` à la racine du projet
4. Ajoutez votre clé API:

```
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

## Installation des dépendances

```bash
npm install
```

## Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Build de production

```bash
npm run build
npm start
```

## Notes importantes

- **Géolocalisation**: L'application demande la permission de géolocalisation pour calculer les distances aux stades
- **API OpenRouter**: Nécessaire pour l'Assistant IA et le Traducteur. Sans cette clé, ces fonctionnalités ne fonctionneront pas.
- **Images**: Les images des stades utilisent Unsplash. Vous pouvez les remplacer par vos propres images.

## Fonctionnalités qui fonctionnent sans API

- Page d'accueil
- Localisateur de stades (sans calcul de distance si géolocalisation refusée)
- Page d'urgence et assistance
- Calendrier des matchs

## Fonctionnalités nécessitant l'API

- Assistant IA Voyage
- Traducteur Darija

