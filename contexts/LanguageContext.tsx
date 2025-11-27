"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "fr" | "en" | "es" | "pt" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number | boolean | null | undefined>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.stadiums": "Stades",
    "nav.settings": "Paramètres",
    "nav.matches": "Matchs",
    "nav.emergency": "Urgence",
    "nav.translation": "Traduction",

    // Home
    "home.welcome": "Bienvenue au Maroc !",
    "home.matches": "Matchs & Infos",
    "home.matches.desc": "Calendrier, résultats et mises à jour en direct.",
    "home.viewSchedule": "Voir le calendrier...",
    "home.aiAssistant": "Assistant IA",
    "home.aiAssistant.desc": "Votre guide personnel",
    "home.translation": "Traducteur Darija",
    "home.translation.desc": "Communiquer avec les locaux",
    "home.stadiums": "Localiser les Stades",
    "home.stadiums.desc": "Trouver le chemin vers le match",
    "home.emergency": "Urgence & Aide",
    "home.emergency.desc": "Obtenir de l'aide rapidement",
    "home.nextMatch": "Prochain match",

    // Assistant
    "assistant.title": "CAN 2025 Guide",
    "assistant.welcome": "Bienvenue au Maroc ! Je suis votre assistant officiel CAN 2025. Comment puis-je vous aider aujourd'hui ?",
    "assistant.placeholder": "Posez votre question ici..",
    "assistant.quick.eat": "Où manger près de moi ?",
    "assistant.quick.visit": "Que visiter aujourd'hui",
    "assistant.limit.title": "Limite quotidienne atteinte",
    "assistant.limit.message": "Vous avez utilisé vos {limit} messages gratuits aujourd'hui.",
    "assistant.limit.upgrade": "Passer Premium",
    "assistant.remaining": "{count} msg",

    // Translation
    "translate.title": "Traducteur Darija",
    "translate.from": "Traduire depuis:",
    "translate.input.placeholder": "Entrez votre texte ici...",
    "translate.button": "Traduire",
    "translate.loading": "Traduction en cours...",
    "translate.arabic": "Darija (Arabe)",
    "translate.phonetic": "Darija (Phonétique)",
    "translate.limit.title": "Limite quotidienne atteinte",
    "translate.limit.message": "Vous avez utilisé vos {limit} traductions gratuites aujourd'hui.",
    "translate.limit.upgrade": "Passer Premium",
    "translate.remaining": "{count} trad",

    // Stadiums
    "stadiums.title": "Les Stades de la CAN 2025",
    "stadiums.distance": "À {distance} km",
    "stadiums.openMaps": "Ouvrir dans Maps",
    "stadiums.yourLocation": "Votre position actuelle",
    "stadiums.location.unavailable": "Localisation non disponible",
    "stadiums.location.desc": "Partagez ces coordonnées avec les services d'urgence si nécessaire.",
    "stadiums.search.placeholder": "Rechercher un stade ou une ville...",
    "stadiums.search.noResults": "Aucun stade trouvé pour votre recherche.",
    "stadiums.capacity": "Capacité : {capacity} places",

    // Matches
    "matches.title": "Calendrier des Matchs",
    "matches.filter.city": "Ville",
    "matches.filter.stadium": "Stade",
    "matches.filter.date": "Date",
    "matches.group": "Phase de Groupes - Groupe {group}",
    "matches.tabs.upcoming": "À venir",
    "matches.tabs.live": "En direct",
    "matches.tabs.finished": "Terminés",
    "matches.empty.title": "Aucun match pour le moment",
    "matches.empty.desc": "Il n'y a aucun match {tab} actuellement.",
    "matches.live": "En direct",

    // Emergency
    "emergency.title": "Urgence & Assistance",
    "emergency.numbers": "Numéros d'urgence",
    "emergency.call": "Appeler",
    "emergency.hospitals": "Hôpitaux proches",
    "emergency.phrases": "Phrases d'urgence",

    // Settings
    "settings.title": "Paramètres",
    "settings.account": "Compte",
    "settings.account.premium": "Plan Premium",
    "settings.account.free": "Plan Gratuit",
    "settings.account.premium.desc": "Accès illimité à toutes les fonctionnalités",
    "settings.account.free.desc": "10 messages/jour • 15 traductions/jour",
    "settings.account.upgrade": "Upgrade",
    "settings.account.logout": "Se deconnecter",
    "settings.preferences": "Préférences",
    "settings.preferences.language": "Langue",
    "settings.preferences.language.desc": "Choisir la langue de l'interface",
    "settings.preferences.notifications": "Notifications",
    "settings.preferences.notifications.desc": "Recevoir des notifications push",
    "settings.data": "Gestion des données",
    "settings.data.clearCache": "Vider le cache",
    "settings.data.clearCache.desc": "Supprimer les données mises en cache",
    "settings.data.clearAll": "Supprimer toutes les données",
    "settings.data.clearAll.desc": "Action irréversible - supprime tout",
    "settings.privacy": "Confidentialité & Sécurité",
    "settings.privacy.policy": "Politique de confidentialité",
    "settings.privacy.policy.desc": "Comment nous protégeons vos données",
    "settings.about": "À propos",
    "settings.about.version": "Version 1.0.0",
    "settings.about.desc": "Votre guide complet pour la Coupe d'Afrique des Nations 2025 au Maroc. Assistant IA, traduction, localisation de stades et services d'urgence.",
    "settings.about.help": "Aide & Support",
    "settings.about.help.desc": "FAQ et assistance",
    "settings.footer": "© 2025 CANConnect. Tous droits réservés.",
    "settings.footer.dev": "Développé avec ❤️ pour les fans de football",
    "settings.confirm.clearCache": "Êtes-vous sûr de vouloir vider le cache ? Cela peut améliorer les performances mais nécessitera de recharger les ressources.",
    "settings.success.clearCache": "Cache vidé avec succès !",
    "settings.confirm.clearAll": "⚠️ ATTENTION: Cela supprimera toutes vos données locales (messages, traductions, préférences). Cette action est irréversible. Continuer ?",
    "settings.success.clearAll": "Toutes les données ont été supprimées. L'application va se recharger.",

    // Premium
    "premium.title": "Pack CAN 2025",
    "premium.free.title": "Plan Gratuit",
    "premium.free.messages": "10 messages/jour avec l'assistant",
    "premium.free.translations": "15 traductions/jour",
    "premium.free.ads": "Publicités",
    "premium.premium.title": "Pack CAN 2025",
    "premium.premium.price": "{price}€",
    "premium.premium.lifetime": "Expire automatiquement le 20 Janvier 2026 (fin de la CAN).",
    "premium.premium.unlimited.messages": "Messages illimités",
    "premium.premium.unlimited.translations": "Traductions illimitées",
    "premium.premium.noAds": "Aucune publicité",
    "premium.premium.support": "Support prioritaire",
    "premium.button": "Passer Premium - {price}MAD",
    "premium.processing": "Traitement...",
    "premium.success.title": "Vous êtes Premium !",
    "premium.success.desc": "Profitez de toutes les fonctionnalités sans limites.",
    "premium.success.back": "Retour à l'accueil",
    "premium.disclaimer": "Paiement sécurisé • Accès immédiat • Expire automatiquement après la CAN (15 février 2025)",
    "premium.email.label": "Adresse e-mail",
    "premium.email.placeholder": "Entrez votre e-mail pour recevoir la confirmation",
    "premium.email.required": "Veuillez saisir une adresse e-mail valide.",
    "premium.email.error": "Impossible d'enregistrer votre e-mail. Veuillez réessayer.",
    "premium.email.success": "Merci ! Votre accès Premium est activé.",
    "premium.email.supabaseMissing": "Configuration Supabase manquante. Ajoutez vos clés d'API.",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.stadiums": "Stadiums",
    "nav.settings": "Settings",
    "nav.matches": "Matches",
    "nav.emergency": "Emergency",
    "nav.translation": "Translation",
    // Home
    "home.welcome": "Welcome to Morocco!",
    "home.matches": "Matches & Info",
    "home.matches.desc": "Fixtures, results, and live updates.",
    "home.viewSchedule": "View Sch...",
    "home.aiAssistant": "AI Assistant",
    "home.aiAssistant.desc": "Your personal guide",
    "home.translation": "Darija Translation",
    "home.translation.desc": "Communicate with locals",
    "home.stadiums": "Locate Stadiums",
    "home.stadiums.desc": "Find your way to the match",
    "home.emergency": "Emergency & Help",
    "home.emergency.desc": "Get help quickly",
    "home.nextMatch": "Next Match",

    // Assistant
    "assistant.title": "CAN 2025 Guide",
    "assistant.welcome": "Welcome to Morocco! I'm your official CAN 2025 assistant. How can I help you today?",
    "assistant.placeholder": "Ask your question here..",
    "assistant.quick.eat": "Where to eat near me?",
    "assistant.quick.visit": "What to visit today",
    "assistant.limit.title": "Daily limit reached",
    "assistant.limit.message": "You have used your {limit} free messages today.",
    "assistant.limit.upgrade": "Upgrade to Premium",
    "assistant.remaining": "{count} msg",

    // Translation
    "translate.title": "Darija Translator",
    "translate.from": "Translate from:",
    "translate.input.placeholder": "Enter your text here...",
    "translate.button": "Translate",
    "translate.loading": "Translating...",
    "translate.arabic": "Darija (Arabic)",
    "translate.phonetic": "Darija (Phonetic)",
    "translate.limit.title": "Daily limit reached",
    "translate.limit.message": "You have used your {limit} free translations today.",
    "translate.limit.upgrade": "Upgrade to Premium",
    "translate.remaining": "{count} trad",

    // Stadiums
    "stadiums.title": "CAN 2025 Stadiums",
    "stadiums.distance": "At {distance} km",
    "stadiums.openMaps": "Open in Maps",
    "stadiums.yourLocation": "Your current location",
    "stadiums.location.unavailable": "Location unavailable",
    "stadiums.location.desc": "Share these coordinates with emergency services if needed.",
    "stadiums.search.placeholder": "Search for a stadium or city...",
    "stadiums.search.noResults": "No stadiums found for your search.",
    "stadiums.capacity": "Capacity: {capacity} seats",

    // Matches
    "matches.title": "Match Calendar",
    "matches.filter.city": "City",
    "matches.filter.stadium": "Stadium",
    "matches.filter.date": "Date",
    "matches.group": "Group Phase - Group {group}",
    "matches.tabs.upcoming": "Upcoming",
    "matches.tabs.live": "Live",
    "matches.tabs.finished": "Finished",
    "matches.empty.title": "No matches right now",
    "matches.empty.desc": "There are no {tab} matches currently.",
    "matches.live": "Live",

    // Emergency
    "emergency.title": "Emergency & Assistance",
    "emergency.numbers": "Emergency numbers",
    "emergency.call": "Call",
    "emergency.hospitals": "Nearby hospitals",
    "emergency.phrases": "Emergency phrases",

    // Settings
    "settings.title": "Settings",
    "settings.account": "Account",
    "settings.account.premium": "Premium Plan",
    "settings.account.free": "Free Plan",
    "settings.account.premium.desc": "Unlimited access to all features",
    "settings.account.free.desc": "10 messages/day • 15 translations/day",
    "settings.account.upgrade": "Upgrade",
    "settings.account.logout": "Logout",
    "settings.preferences": "Preferences",
    "settings.preferences.language": "Language",
    "settings.preferences.language.desc": "Choose interface language",
    "settings.preferences.notifications": "Notifications",
    "settings.preferences.notifications.desc": "Receive push notifications",
    "settings.data": "Data Management",
    "settings.data.clearCache": "Clear cache",
    "settings.data.clearCache.desc": "Delete cached data",
    "settings.data.clearAll": "Delete all data",
    "settings.data.clearAll.desc": "Irreversible action - deletes everything",
    "settings.privacy": "Privacy & Security",
    "settings.privacy.policy": "Privacy Policy",
    "settings.privacy.policy.desc": "How we protect your data",
    "settings.about": "About",
    "settings.about.version": "Version 1.0.0",
    "settings.about.desc": "Your complete guide to the 2025 Africa Cup of Nations in Morocco. AI assistant, translation, stadium locator and emergency services.",
    "settings.about.help": "Help & Support",
    "settings.about.help.desc": "FAQ and assistance",
    "settings.footer": "© 2025 CANConnect. All rights reserved.",
    "settings.footer.dev": "Developed with ❤️ for football fans",
    "settings.confirm.clearCache": "Are you sure you want to clear the cache? This may improve performance but will require reloading resources.",
    "settings.success.clearCache": "Cache cleared successfully!",
    "settings.confirm.clearAll": "⚠️ WARNING: This will delete all your local data (messages, translations, preferences). This action is irreversible. Continue?",
    "settings.success.clearAll": "All data has been deleted. The application will reload.",

    // Premium
    "premium.title": "Pack CAN 2025",
    "premium.free.title": "Free Plan",
    "premium.free.messages": "10 messages/day with assistant",
    "premium.free.translations": "15 translations/day",
    "premium.free.ads": "Ads",
    "premium.premium.title": "Pack CAN 2025",
    "premium.premium.price": "€{price}",
    "premium.premium.lifetime": "Automatically expires on January 20, 2026 (end of AFCON)",
    "premium.premium.unlimited.messages": "Unlimited messages",
    "premium.premium.unlimited.translations": "Unlimited translations",
    "premium.premium.noAds": "No ads",
    "premium.premium.support": "Priority support",
    "premium.button": "Upgrade to Premium - €{price}",
    "premium.processing": "Processing...",
    "premium.success.title": "You are Premium!",
    "premium.success.desc": "Enjoy all features without limits.",
    "premium.success.back": "Back to home",
    "premium.disclaimer": "Secure payment • Immediate access • Automatically expires after AFCON (Jan 20, 2026)",
    "premium.email.label": "Email address",
    "premium.email.placeholder": "Enter your email to receive confirmation",
    "premium.email.required": "Please enter a valid email address.",
    "premium.email.error": "Couldn't save your email. Please try again.",
    "premium.email.success": "Thank you! Your Premium access is active.",
    "premium.email.supabaseMissing": "Supabase configuration missing. Please add your API keys.",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.stadiums": "Estadios",
    "nav.settings": "Configuración",
    "nav.matches": "Partidos",
    "nav.emergency": "Emergencia",
    "nav.translation": "Traducción",
    // Home
    "home.welcome": "¡Bienvenido a Marruecos!",
    "home.matches": "Partidos e Información",
    "home.matches.desc": "Calendario, resultados y actualizaciones en vivo.",
    "home.viewSchedule": "Ver calendario...",
    "home.aiAssistant": "Asistente IA",
    "home.aiAssistant.desc": "Tu guía personal",
    "home.translation": "Traductor Darija",
    "home.translation.desc": "Comunicarse con los locales",
    "home.stadiums": "Localizar Estadios",
    "home.stadiums.desc": "Encuentra el camino al partido",
    "home.emergency": "Emergencia y Ayuda",
    "home.emergency.desc": "Obtener ayuda rápidamente",
    "home.nextMatch": "Próximo partido",

    // Assistant
    "assistant.title": "Guía CAN 2025",
    "assistant.welcome": "¡Bienvenido a Marruecos! Soy tu asistente oficial de CAN 2025. ¿Cómo puedo ayudarte hoy?",
    "assistant.placeholder": "Haz tu pregunta aquí..",
    "assistant.quick.eat": "¿Dónde comer cerca de mí?",
    "assistant.quick.visit": "Qué visitar hoy",
    "assistant.limit.title": "Límite diario alcanzado",
    "assistant.limit.message": "Has usado tus {limit} mensajes gratuitos hoy.",
    "assistant.limit.upgrade": "Actualizar a Premium",
    "assistant.remaining": "{count} msg",

    // Translation
    "translate.title": "Traductor Darija",
    "translate.from": "Traducir desde:",
    "translate.input.placeholder": "Ingresa tu texto aquí...",
    "translate.button": "Traducir",
    "translate.loading": "Traduciendo...",
    "translate.arabic": "Darija (Árabe)",
    "translate.phonetic": "Darija (Fonético)",
    "translate.limit.title": "Límite diario alcanzado",
    "translate.limit.message": "Has usado tus {limit} traducciones gratuitas hoy.",
    "translate.limit.upgrade": "Actualizar a Premium",
    "translate.remaining": "{count} trad",

    // Stadiums
    "stadiums.title": "Estadios de CAN 2025",
    "stadiums.distance": "A {distance} km",
    "stadiums.openMaps": "Abrir en Maps",
    "stadiums.yourLocation": "Tu ubicación actual",
    "stadiums.location.unavailable": "Ubicación no disponible",
    "stadiums.location.desc": "Comparte estas coordenadas con los servicios de emergencia si es necesario.",
    "stadiums.search.placeholder": "Buscar un estadio o ciudad...",
    "stadiums.search.noResults": "No se encontraron estadios para tu búsqueda.",
    "stadiums.capacity": "Capacidad: {capacity} asientos",

    // Matches
    "matches.title": "Calendario de Partidos",
    "matches.filter.city": "Ciudad",
    "matches.filter.stadium": "Estadio",
    "matches.group": "Fase de Grupos - Grupo {group}",
    "matches.tabs.upcoming": "Próximos",
    "matches.tabs.live": "En vivo",
    "matches.tabs.finished": "Terminados",
    "matches.empty.title": "No hay partidos por ahora",
    "matches.empty.desc": "Actualmente no hay partidos {tab}.",
    "matches.live": "En vivo",

    // Emergency
    "emergency.title": "Emergencia y Asistencia",
    "emergency.numbers": "Números de emergencia",
    "emergency.call": "Llamar",
    "emergency.hospitals": "Hospitales cercanos",
    "emergency.phrases": "Frases de emergencia",

    // Settings
    "settings.title": "Configuración",
    "settings.account": "Cuenta",
    "settings.account.premium": "Plan Premium",
    "settings.account.free": "Plan Gratuito",
    "settings.account.premium.desc": "Acceso ilimitado a todas las funciones",
    "settings.account.free.desc": "10 mensajes/día • 15 traducciones/día",
    "settings.account.upgrade": "Actualizar",
    "settings.account.logout": "Cerrar sesión",
    "settings.preferences": "Preferencias",
    "settings.preferences.language": "Idioma",
    "settings.preferences.language.desc": "Elegir idioma de la interfaz",
    "settings.preferences.notifications": "Notificaciones",
    "settings.preferences.notifications.desc": "Recibir notificaciones push",
    "settings.data": "Gestión de datos",
    "settings.data.clearCache": "Limpiar caché",
    "settings.data.clearCache.desc": "Eliminar datos en caché",
    "settings.data.clearAll": "Eliminar todos los datos",
    "settings.data.clearAll.desc": "Acción irreversible - elimina todo",
    "settings.privacy": "Privacidad y Seguridad",
    "settings.privacy.policy": "Política de privacidad",
    "settings.privacy.policy.desc": "Cómo protegemos tus datos",
    "settings.about": "Acerca de",
    "settings.about.version": "Versión 1.0.0",
    "settings.about.desc": "Tu guía completa para la Copa Africana de Naciones 2025 en Marruecos. Asistente IA, traducción, localizador de estadios y servicios de emergencia.",
    "settings.about.help": "Ayuda y Soporte",
    "settings.about.help.desc": "FAQ y asistencia",
    "settings.footer": "© 2025 CANConnect. Todos los derechos reservados.",
    "settings.footer.dev": "Desarrollado con ❤️ para los fanáticos del fútbol",
    "settings.confirm.clearCache": "¿Estás seguro de que quieres limpiar la caché? Esto puede mejorar el rendimiento pero requerirá recargar los recursos.",
    "settings.success.clearCache": "¡Caché limpiada con éxito!",
    "settings.confirm.clearAll": "⚠️ ADVERTENCIA: Esto eliminará todos sus datos locales (mensajes, traducciones, preferencias). Esta acción es irreversible. ¿Continuar?",
    "settings.success.clearAll": "Todos los datos han sido eliminados. La aplicación se recargará.",

    // Premium
    "premium.title": "Pack CAN 2025",
    "premium.free.title": "Plan Gratuito",
    "premium.free.messages": "10 mensajes/día con asistente",
    "premium.free.translations": "15 traducciones/día",
    "premium.free.ads": "Anuncios",
    "premium.premium.title": "Pack CAN 2025",
    "premium.premium.price": "{price}€",
    "premium.premium.lifetime": "Expira automáticamente el 20 de enero de 2026 (fin de la CAN)",
    "premium.premium.unlimited.messages": "Mensajes ilimitados",
    "premium.premium.unlimited.translations": "Traducciones ilimitadas",
    "premium.premium.noAds": "Sin anuncios",
    "premium.premium.support": "Soporte prioritario",
    "premium.button": "Actualizar a Premium - {price}€",
    "premium.processing": "Procesando...",
    "premium.success.title": "¡Eres Premium!",
    "premium.success.desc": "Disfruta de todas las funciones sin límites.",
    "premium.success.back": "Volver al inicio",
    "premium.disclaimer": "Pago seguro • Acceso inmediato • Expira automáticamente tras la CAN (20 enero 2026)",
    "premium.email.label": "Correo electrónico",
    "premium.email.placeholder": "Introduce tu correo para recibir la confirmación",
    "premium.email.required": "Por favor, introduce un correo válido.",
    "premium.email.error": "No se pudo guardar tu correo. Inténtalo nuevamente.",
    "premium.email.success": "¡Gracias! Tu acceso Premium está activo.",
    "premium.email.supabaseMissing": "Falta la configuración de Supabase. Agrega tus claves de API.",
  },
  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.stadiums": "Estádios",
    "nav.settings": "Configurações",
    "nav.matches": "Jogos",
    "nav.emergency": "Emergência",
    "nav.translation": "Tradução",
    // Home
    "home.welcome": "Bem-vindo ao Marrocos!",
    "home.matches": "Jogos e Informações",
    "home.matches.desc": "Calendário, resultados e atualizações ao vivo.",
    "home.viewSchedule": "Ver calendário...",
    "home.aiAssistant": "Assistente IA",
    "home.aiAssistant.desc": "Seu guia pessoal",
    "home.translation": "Tradutor Darija",
    "home.translation.desc": "Comunicar com os locais",
    "home.stadiums": "Localizar Estádios",
    "home.stadiums.desc": "Encontre o caminho para o jogo",
    "home.emergency": "Emergência e Ajuda",
    "home.emergency.desc": "Obter ajuda rapidamente",
    "home.nextMatch": "Próximo Jogo",

    // Assistant
    "assistant.title": "Guia CAN 2025",
    "assistant.welcome": "Bem-vindo ao Marrocos! Sou seu assistente oficial da CAN 2025. Como posso ajudá-lo hoje?",
    "assistant.placeholder": "Faça sua pergunta aqui..",
    "assistant.quick.eat": "Onde comer perto de mim?",
    "assistant.quick.visit": "O que visitar hoje",
    "assistant.limit.title": "Limite diário atingido",
    "assistant.limit.message": "Você usou suas {limit} mensagens gratuitas hoje.",
    "assistant.limit.upgrade": "Atualizar para Premium",
    "assistant.remaining": "{count} msg",

    // Translation
    "translate.title": "Tradutor Darija",
    "translate.from": "Traduzir de:",
    "translate.input.placeholder": "Digite seu texto aqui...",
    "translate.button": "Traduzir",
    "translate.loading": "Traduzindo...",
    "translate.arabic": "Darija (Árabe)",
    "translate.phonetic": "Darija (Fonético)",
    "translate.limit.title": "Limite diário atingido",
    "translate.limit.message": "Você usou suas {limit} traduções gratuitas hoje.",
    "translate.limit.upgrade": "Atualizar para Premium",
    "translate.remaining": "{count} trad",

    // Stadiums
    "stadiums.title": "Estádios da CAN 2025",
    "stadiums.distance": "A {distance} km",
    "stadiums.openMaps": "Abrir no Maps",
    "stadiums.yourLocation": "Sua localização atual",
    "stadiums.location.unavailable": "Localização indisponível",
    "stadiums.location.desc": "Compartilhe estas coordenadas com os serviços de emergência se necessário.",
    "stadiums.search.placeholder": "Pesquisar um estádio ou cidade...",
    "stadiums.search.noResults": "Nenhum estádio encontrado para sua pesquisa.",
    "stadiums.capacity": "Capacidade: {capacity} lugares",

    // Matches
    "matches.title": "Calendário de Jogos",
    "matches.filter.city": "Cidade",
    "matches.filter.stadium": "Estádio",
    "matches.filter.date": "Data",
    "matches.group": "Fase de Grupos - Grupo {group}",
    "matches.tabs.upcoming": "Próximos",
    "matches.tabs.live": "Ao vivo",
    "matches.tabs.finished": "Terminados",
    "matches.empty.title": "Nenhum jogo no momento",
    "matches.empty.desc": "Não há jogos {tab} no momento.",
    "matches.live": "Ao vivo",

    // Emergency
    "emergency.title": "Emergência e Assistência",
    "emergency.numbers": "Números de emergência",
    "emergency.call": "Ligar",
    "emergency.hospitals": "Hospitais próximos",
    "emergency.phrases": "Frases de emergência",

    // Settings
    "settings.title": "Configurações",
    "settings.account": "Conta",
    "settings.account.premium": "Plano Premium",
    "settings.account.free": "Plano Gratuito",
    "settings.account.premium.desc": "Acesso ilimitado a todos os recursos",
    "settings.account.free.desc": "10 mensagens/dia • 15 traduções/dia",
    "settings.account.upgrade": "Atualizar",
    "settings.account.logout": "Sair",
    "settings.preferences": "Preferências",
    "settings.preferences.language": "Idioma",
    "settings.preferences.language.desc": "Escolher idioma da interface",
    "settings.preferences.notifications": "Notificações",
    "settings.preferences.notifications.desc": "Receber notificações push",
    "settings.data": "Gerenciamento de dados",
    "settings.data.clearCache": "Limpar cache",
    "settings.data.clearCache.desc": "Excluir dados em cache",
    "settings.data.clearAll": "Excluir todos os dados",
    "settings.data.clearAll.desc": "Ação irreversível - exclui tudo",
    "settings.privacy": "Privacidade e Segurança",
    "settings.privacy.policy": "Política de privacidade",
    "settings.privacy.policy.desc": "Como protegemos seus dados",
    "settings.about": "Sobre",
    "settings.about.version": "Versão 1.0.0",
    "settings.about.desc": "Seu guia completo para a Copa das Nações Africanas 2025 no Marrocos. Assistente IA, tradução, localizador de estádios e serviços de emergência.",
    "settings.about.help": "Ajuda e Suporte",
    "settings.about.help.desc": "FAQ e assistência",
    "settings.footer": "© 2025 CANConnect. Todos os direitos reservados.",
    "settings.footer.dev": "Desenvolvido com ❤️ para fãs de futebol",
    "settings.confirm.clearCache": "Tem certeza de que deseja limpar o cache? Isso pode melhorar o desempenho, mas exigirá recarregar os recursos.",
    "settings.success.clearCache": "Cache limpo com sucesso!",
    "settings.confirm.clearAll": "⚠️ ATENÇÃO: Isso excluirá todos os seus dados locais (mensagens, traduções, preferências). Esta ação é irreversível. Continuar?",
    "settings.success.clearAll": "Todos os dados foram excluídos. O aplicativo será recarregado.",

    // Premium
    "premium.title": "Pack CAN 2025",
    "premium.free.title": "Plano Gratuito",
    "premium.free.messages": "10 mensagens/dia com assistente",
    "premium.free.translations": "15 traduções/dia",
    "premium.free.ads": "Anúncios",
    "premium.premium.title": "Pack CAN 2025",
    "premium.premium.price": "{price}€",
    "premium.premium.lifetime": "Expira automaticamente em 20 de janeiro de 2026 (fim da CAN)",
    "premium.premium.unlimited.messages": "Mensagens ilimitadas",
    "premium.premium.unlimited.translations": "Traduções ilimitadas",
    "premium.premium.noAds": "Sem anúncios",
    "premium.premium.support": "Suporte prioritário",
    "premium.button": "Atualizar para Premium - {price}€",
    "premium.processing": "Processando...",
    "premium.success.title": "Você é Premium!",
    "premium.success.desc": "Desfrute de todos os recursos sem limites.",
    "premium.success.back": "Voltar ao início",
    "premium.disclaimer": "Pagamento seguro • Acesso imediato • Expira automaticamente após a CAN (20 de janeiro de 2026)",
    "premium.email.label": "Endereço de e-mail",
    "premium.email.placeholder": "Digite seu e-mail para receber a confirmação",
    "premium.email.required": "Por favor, insira um e-mail válido.",
    "premium.email.error": "Não foi possível salvar seu e-mail. Tente novamente.",
    "premium.email.success": "Obrigado! Seu acesso Premium está ativo.",
    "premium.email.supabaseMissing": "Configuração do Supabase ausente. Adicione suas chaves de API.",
  },
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.stadiums": "الملاعب",
    "nav.settings": "الإعدادات",
    "nav.matches": "المباريات",
    "nav.emergency": "الطوارئ",
    "nav.translation": "الترجمة",
    // Home
    "home.welcome": "مرحباً بك في المغرب!",
    "home.matches": "المباريات والمعلومات",
    "home.matches.desc": "الجدول والنتائج والتحديثات المباشرة.",
    "home.viewSchedule": "عرض الجدول...",
    "home.aiAssistant": "المساعد الذكي",
    "home.aiAssistant.desc": "دليلك الشخصي",
    "home.translation": "مترجم الدارجة",
    "home.translation.desc": "التواصل مع السكان المحليين",
    "home.stadiums": "تحديد الملاعب",
    "home.stadiums.desc": "العثور على الطريق إلى المباراة",
    "home.emergency": "الطوارئ والمساعدة",
    "home.emergency.desc": "الحصول على المساعدة بسرعة",
    "home.nextMatch": "المباراة القادمة",

    // Assistant
    "assistant.title": "دليل كان 2025",
    "assistant.welcome": "مرحباً بك في المغرب! أنا مساعدك الرسمي لكان 2025. كيف يمكنني مساعدتك اليوم؟",
    "assistant.placeholder": "اطرح سؤالك هنا..",
    "assistant.quick.eat": "أين يمكنني الأكل بالقرب مني؟",
    "assistant.quick.visit": "ماذا أزور اليوم",
    "assistant.limit.title": "تم الوصول إلى الحد اليومي",
    "assistant.limit.message": "لقد استخدمت {limit} رسائل مجانية اليوم.",
    "assistant.limit.upgrade": "الترقية إلى المميز",
    "assistant.remaining": "{count} رسالة",

    // Translation
    "translate.title": "مترجم الدارجة",
    "translate.from": "الترجمة من:",
    "translate.input.placeholder": "أدخل النص هنا...",
    "translate.button": "ترجم",
    "translate.loading": "جاري الترجمة...",
    "translate.arabic": "الدارجة (عربي)",
    "translate.phonetic": "الدارجة (صوتي)",
    "translate.limit.title": "تم الوصول إلى الحد اليومي",
    "translate.limit.message": "لقد استخدمت {limit} ترجمات مجانية اليوم.",
    "translate.limit.upgrade": "الترقية إلى المميز",
    "translate.remaining": "{count} ترجمة",

    // Stadiums
    "stadiums.title": "ملاعب كان 2025",
    "stadiums.distance": "على بعد {distance} كم",
    "stadiums.openMaps": "فتح في الخرائط",
    "stadiums.yourLocation": "موقعك الحالي",
    "stadiums.location.unavailable": "الموقع غير متاح",
    "stadiums.location.desc": "شارك هذه الإحداثيات مع خدمات الطوارئ إذا لزم الأمر.",
    "stadiums.search.placeholder": "البحث عن ملعب أو مدينة...",
    "stadiums.search.noResults": "لم يتم العثور على ملاعب لبحثك.",
    "stadiums.capacity": "السعة: {capacity} مقعد",

    // Matches
    "matches.title": "تقويم المباريات",
    "matches.filter.city": "المدينة",
    "matches.filter.stadium": "الملعب",
    "matches.filter.date": "التاريخ",
    "matches.group": "مرحلة المجموعات - المجموعة {group}",
    "matches.tabs.upcoming": "القادمة",
    "matches.tabs.live": "حالية",
    "matches.tabs.finished": "منتهية",
    "matches.empty.title": "لا يوجد مباريات الآن",
    "matches.empty.desc": "لا يوجد مباريات {tab} الآن.",
    "matches.live": "حالية",
    // Emergency
    "emergency.title": "الطوارئ والمساعدة",
    "emergency.numbers": "أرقام الطوارئ",
    "emergency.call": "اتصل",
    "emergency.hospitals": "المستشفيات القريبة",
    "emergency.phrases": "عبارات الطوارئ",

    // Settings
    "settings.title": "الإعدادات",
    "settings.account": "الحساب",
    "settings.account.premium": "الخطة المميزة",
    "settings.account.free": "الخطة المجانية",
    "settings.account.premium.desc": "وصول غير محدود لجميع الميزات",
    "settings.account.free.desc": "10 رسائل/يوم • 15 ترجمة/يوم",
    "settings.account.upgrade": "ترقية",
    "settings.account.logout": "تسجيل الخروج",
    "settings.preferences": "التفضيلات",
    "settings.preferences.language": "اللغة",
    "settings.preferences.language.desc": "اختر لغة الواجهة",
    "settings.preferences.notifications": "الإشعارات",
    "settings.preferences.notifications.desc": "تلقي الإشعارات الفورية",
    "settings.data": "إدارة البيانات",
    "settings.data.clearCache": "مسح الذاكرة المؤقتة",
    "settings.data.clearCache.desc": "حذف البيانات المخزنة مؤقتاً",
    "settings.data.clearAll": "حذف جميع البيانات",
    "settings.data.clearAll.desc": "إجراء لا رجعة فيه - يحذف كل شيء",
    "settings.privacy": "الخصوصية والأمان",
    "settings.privacy.policy": "سياسة الخصوصية",
    "settings.privacy.policy.desc": "كيف نحمي بياناتك",
    "settings.about": "حول",
    "settings.about.version": "الإصدار 1.0.0",
    "settings.about.desc": "دليلك الكامل لكأس الأمم الأفريقية 2025 في المغرب. مساعد ذكي، ترجمة، تحديد الملاعب وخدمات الطوارئ.",
    "settings.about.help": "المساعدة والدعم",
    "settings.about.help.desc": "الأسئلة الشائعة والمساعدة",
    "settings.footer": "© 2025 CANConnect. جميع الحقوق محفوظة.",
    "settings.footer.dev": "تم التطوير بـ ❤️ لعشاق كرة القدم",
    "settings.confirm.clearCache": "هل أنت متأكد من أنك تريد مسح الذاكرة المؤقتة؟ قد يحسن هذا الأداء ولكن سيتطلب إعادة تحميل الموارد.",
    "settings.success.clearCache": "تم مسح الذاكرة المؤقتة بنجاح!",
    "settings.confirm.clearAll": "⚠️ تحذير: سيؤدي هذا إلى حذف جميع بياناتك المحلية (الرسائل والترجمات والتفضيلات). هذا الإجراء لا رجعة فيه. متابعة؟",
    "settings.success.clearAll": "تم حذف جميع البيانات. سيتم إعادة تحميل التطبيق.",

    // Premium
    "premium.title": "Pack CAN 2025",
    "premium.free.title": "الخطة المجانية",
    "premium.free.messages": "10 رسائل/يوم مع المساعد",
    "premium.free.translations": "15 ترجمة/يوم",
    "premium.free.ads": "إعلانات",
    "premium.premium.title": "Pack CAN 2025",
    "premium.premium.price": "{price}€",
    "premium.premium.lifetime": "تنتهي صلاحيتها تلقائياً في 20 يناير 2026 (نهاية كأس الأمم)",
    "premium.premium.unlimited.messages": "رسائل غير محدودة",
    "premium.premium.unlimited.translations": "ترجمات غير محدودة",
    "premium.premium.noAds": "بدون إعلانات",
    "premium.premium.support": "دعم ذو أولوية",
    "premium.button": "الترقية إلى المميز - {price}€",
    "premium.processing": "جاري المعالجة...",
    "premium.success.title": "أنت مميز!",
    "premium.success.desc": "استمتع بجميع الميزات بدون حدود.",
    "premium.success.back": "العودة إلى الرئيسية",
    "premium.disclaimer": "دفع آمن • وصول فوري • تنتهي صلاحية الاشتراك تلقائياً بعد بطولة كأس الأمم (20 يناير 2026)",
    "premium.email.label": "البريد الإلكتروني",
    "premium.email.placeholder": "أدخل بريدك الإلكتروني لتلقي التأكيد",
    "premium.email.required": "يرجى إدخال بريد إلكتروني صالح.",
    "premium.email.error": "تعذر حفظ بريدك الإلكتروني. يرجى المحاولة مرة أخرى.",
    "premium.email.success": "شكراً لك! تم تفعيل وصولك المميز.",
    "premium.email.supabaseMissing": "إعداد Supabase مفقود. يرجى إضافة مفاتيح واجهة برمجة التطبيقات الخاصة بك.",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    // Load from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Update HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      // Trigger a re-render by dispatching a custom event
      window.dispatchEvent(new Event("languagechange"));
    }
  };

  useEffect(() => {
    // Set initial HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, params?: Record<string, string | number | boolean | null | undefined>): string => {
    const translation = translations[language]?.[key] || translations.fr[key] || key;

    if (params) {
      return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

