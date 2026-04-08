"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Map as MapIcon, 
  Compass, 
  Network,
  Menu,
  X,
  Send,
  Search,
  BookOpen,
  LogOut,
  Shield,
  LifeBuoy,
  Languages,
  Bot,
  Globe
} from "lucide-react";

const RealMap = dynamic(() => import("./components/Map"), { 
  ssr: false,
  loading: () => <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e5e3df" }}>Loading Map...</div>
});

const CITY_COORDINATES: Record<string, [number, number]> = {
  "Paris": [48.8566, 2.3522],
  "Madrid": [40.4168, -3.7038],
  "Berlin": [52.5200, 13.4050],
  "Rome": [41.9028, 12.4964],
  "Warsaw": [52.2297, 21.0122],
  "Lisbon": [38.7223, -9.1393],
  "Amsterdam": [52.3676, 4.9041],
  "Vienna": [48.2082, 16.3738],
  "Prague": [50.0755, 14.4378],
  "Barcelona": [41.3851, 2.1734],
  "Munich": [48.1351, 11.5820],
  "Milan": [45.4642, 9.1900],
  "Athens": [37.9838, 23.7275],
  "Istanbul": [41.0082, 28.9784],
  "Dublin": [53.3498, -6.2603],
  "Stockholm": [59.3293, 18.0686],
  "Helsinki": [60.1699, 24.9384],
  "Oslo": [59.9139, 10.7522],
  "Copenhagen": [55.6761, 12.5683],
};

const ERASMUS_DATA: Record<string, { lang: string, phrases: { original: string, translation: string }[], cities: string[] }> = {
  "Austria": { lang: "German", phrases: [{ original: "Wo ist die Uni?", translation: "Where is the uni?" }], cities: ["Vienna", "Graz"] },
  "Belgium": { lang: "French/Dutch", phrases: [{ original: "Dank u wel!", translation: "Thank you!" }], cities: ["Brussels", "Ghent"] },
  "France": { lang: "French", phrases: [{ original: "Où est la bibliothèque?", translation: "Where is the library?" }], cities: ["Paris", "Lyon", "Marseille"] },
  "Germany": { lang: "German", phrases: [{ original: "Wo ist die Bibliothek?", translation: "Where is the library?" }, { original: "Ein Kaffee, bitte.", translation: "A coffee, please." }], cities: ["Berlin", "Munich", "Hamburg"] },
  "Italy": { lang: "Italian", phrases: [{ original: "Dov'è la biblioteca?", translation: "Where is the library?" }, { original: "Un caffè, per favore.", translation: "A coffee, please." }], cities: ["Rome", "Milan", "Florence"] },
  "Spain": { lang: "Spanish", phrases: [{ original: "¿Dónde está la biblioteca?", translation: "Where is the library?" }], cities: ["Madrid", "Barcelona", "Valencia"] },
  "Poland": { lang: "Polish", phrases: [{ original: "Dziękuję!", translation: "Thank you!" }], cities: ["Warsaw", "Krakow"] },
  "Portugal": { lang: "Portuguese", phrases: [{ original: "Obrigado!", translation: "Thank you!" }], cities: ["Lisbon", "Porto"] },
  "Netherlands": { lang: "Dutch", phrases: [{ original: "Waar is de universiteit?", translation: "Where is the university?" }, { original: "Bedankt!", translation: "Thank you!" }], cities: ["Amsterdam", "Rotterdam"] },
};

const COMMON_SCHOOLS: Record<string, string[]> = {
  "Paris": ["Sorbonne University", "Sciences Po", "HEC Paris"],
  "Madrid": ["Complutense University", "Carlos III University"],
  "Berlin": ["Humboldt University", "Technical University Berlin"],
  "Rome": ["Sapienza University", "Roma Tre University"],
  "Warsaw": ["University of Warsaw", "Warsaw School of Economics"],
  "Lisbon": ["University of Lisbon", "NOVA University Lisbon"],
  "Amsterdam": ["University of Amsterdam"],
};

const TRANSLATIONS: Record<string, any> = {
  en: {
    legal: "Legal Section",
    survival: "Survival Guides",
    language: "Language Center",
    cityChat: "City Chatbot",
    community: "Community",
    welcome: "Welcome to",
    reset: "Reset Profile",
    enter: "Enter Platform",
    identify: "Identify & Enter",
    notYou: "Not you? Identify again",
    currentIdentity: "Current Identity",
    journey: "Your journey at",
    begins: "begins.",
    select: "Select",
    other: "Other...",
    identification: "Welcome to P.E.N.G.U.I.N.S.",
    slogan1: "Peer Engaging Network Guide:",
    slogan2: "Unite In New Surroundings",
    passport: 'Set up your "Penguin Passport" to join the huddle.',
    name: "Your Name",
    country: "Country",
    city: "City",
    school: "Your New School",
    accessDirectory: "Access Directory",
    visitResource: "Visit Resource",
    goToCommunity: "Go to Community",
    readMore: "Read More",
    findGems: "Find gems in",
    viewOnGoogle: "View on Google Maps",
    tripAdvisor: "TripAdvisor Reviews",
    askAboutCity: "Ask about the city...",
    hi: "Hi",
    chatInit: "I'm your guide for",
    chatHelp: "How can I help you today?",
    intlStudents: "Fellow Penguins at",
    connectWith: "Connect with other penguins who just landed in the colony at",
    connect: "Join Huddle",
    legalItems: [
      { title: "Visa Requirements", description: "Essential migration papers for your stay." },
      { title: "Health Insurance", description: "Stay waterproof and healthy in your new habitat." },
      { title: "Housing Contracts", description: "Secure your nest before the winter." },
      { title: "Work Permits", description: "Fishing rights: Can you work while studying?" },
      { title: "Lawyers' Contact", description: "Legal guardians for your colony rights." },
    ],

    survivalGuides: [
      { title: "Find Your Nest", type: "Essential Guide", image: "🏠", category: "Essentials" },
      { title: "Migration Routes", type: "Essential Guide", image: "🚌", category: "Essentials" },
      { title: "Pre-Migration", type: "Checklist", image: "📋", category: "Essentials" },
      { title: "Pack Your Feathers", type: "Packing List", image: "🎒", category: "Essentials" },
      { title: "Vintage & Thrift", type: "Curated List", image: "👕", category: "Lifestyle" },
      { title: "Feeding Grounds", type: "Curated List", image: "🍕", category: "Food" },
      { title: "Scenic Icebergs", type: "Curated List", image: "🏛️", category: "Travel" },
      { title: "Fish Markets", type: "Curated List", image: "🍎", category: "Lifestyle" },
      { title: "Warming Stations", type: "Curated List", image: "☕", category: "Food" },
      { title: "Expedition Ideas", type: "Curated List", image: "⛰️", category: "Travel" }
    ],
    languageItems: [
      { title: "Tandem", description: "Find a local partner to practice with.", link: "https://www.tandem.net/", icon: "🗣️" },
      { title: "Online Coffee", description: "Virtual coffee dates to speak the language.", link: "https://www.conversationexchange.com/", icon: "☕" },
      { title: "Duolingo", description: "Gamified language learning on the go.", link: "https://www.duolingo.com/", icon: "🦉" },
      { title: "Planet Language", description: "Join our community language exchange groups.", action: "community", icon: "🌍" },
    ]
  },
  fr: {
    legal: "Section Légale",
    survival: "Guides de Survie",
    language: "Centre de Langues",
    cityChat: "Chatbot de la Ville",
    community: "Communauté",
    welcome: "Bienvenue à",
    reset: "Réinitialiser le Profil",
    enter: "Entrer dans la Plateforme",
    identify: "S'identifier et Entrer",
    notYou: "Pas vous ? S'identifier à nouveau",
    currentIdentity: "Identité Actuelle",
    journey: "Votre voyage à",
    begins: "commence.",
    select: "Sélectionner",
    other: "Autre...",
    identification: "Bienvenue sur P.E.N.G.U.I.N.S.",
    slogan1: "Peer Engaging Network Guide:",
    slogan2: "Unite In New Surroundings",
    passport: 'Configurez votre "Passeport" pour commencer.',
    name: "Votre Nom",
    country: "Pays",
    city: "Ville",
    school: "Votre Nouvelle École",
    accessDirectory: "Accéder à l'annuaire",
    visitResource: "Visiter la ressource",
    goToCommunity: "Aller à la Communauté",
    readMore: "Lire plus",
    findGems: "Trouvez des pépites à",
    viewOnGoogle: "Voir sur Google Maps",
    tripAdvisor: "Avis TripAdvisor",
    askAboutCity: "Posez une question sur la ville...",
    hi: "Salut",
    chatInit: "Je suis votre guide pour",
    chatHelp: "Comment puis-je vous aider aujourd'hui ?",
    intlStudents: "Étudiants internationaux à",
    connectWith: "Connectez-vous avec d'autres étudiants internationaux qui viennent d'arriver à",
    connect: "Connecter",
    legalItems: [
      { title: "Exigences de Visa", description: "Informations essentielles pour votre séjour." },
      { title: "Assurance Santé", description: "Comment rester couvert dans votre nouvelle ville." },
      { title: "Contrats de Logement", description: "Ce qu'il faut vérifier avant de signer." },
      { title: "Permis de Travail", description: "Pouvez-vous travailler pendant vos études ?" },
      { title: "Contact Avocats", description: "Professionnels du droit spécialisés pour les étudiants." },
    ],
    survivalGuides: [
      { title: "Logement Étudiant", type: "Guide Essentiel", image: "🏠", category: "Essentiels" },
      { title: "Transports Publics", type: "Guide Essentiel", image: "🚌", category: "Essentiels" },
      { title: "Avant votre Arrivée", type: "Check-list", image: "📋", category: "Essentiels" },
      { title: "Quoi Apporter ?", type: "Liste de Bagages", image: "🎒", category: "Essentiels" },
      { title: "Fripes & Vintage", type: "Liste Curatée", image: "👕", category: "Style de Vie" },
      { title: "Meilleurs Restos", type: "Liste Curatée", image: "🍕", category: "Nourriture" },
      { title: "Architecture Incontournable", type: "Liste Curatée", image: "🏛️", category: "Voyage" },
      { title: "Marchés Hebdomadaires", type: "Liste Curatée", image: "🍎", category: "Style de Vie" },
      { title: "Cafés pour Étudier", type: "Liste Curatée", image: "☕", category: "Nourriture" },
      { title: "Idées de Weekend", type: "Liste Curatée", image: "⛰️", category: "Voyage" }
    ],
    languageItems: [
      { title: "Tandem", description: "Trouvez un partenaire local pour pratiquer.", link: "https://www.tandem.net/", icon: "🗣️" },
      { title: "Café en Ligne", description: "Rendez-vous virtuels pour parler la langue.", link: "https://www.conversationexchange.com/", icon: "☕" },
      { title: "Duolingo", description: "Apprentissage ludique des langues.", link: "https://www.duolingo.com/", icon: "🦉" },
      { title: "Planète Langue", description: "Rejoignez nos groupes d'échange linguistique.", action: "community", icon: "🌍" },
    ]
  },
  es: {
    legal: "Sección Legal",
    survival: "Guías de Supervivencia",
    language: "Centro de Idiomas",
    cityChat: "Chatbot de la Ciudad",
    community: "Comunidad",
    welcome: "Bienvenido a",
    reset: "Reiniciar Perfil",
    enter: "Entrar en la Plataforma",
    identify: "Identificarse y Entrar",
    notYou: "¿No eres tú? Identifícate de nuevo",
    currentIdentity: "Identidad Actual",
    journey: "Tu viaje en",
    begins: "comienza.",
    select: "Seleccionar",
    other: "Otro...",
    identification: "Bienvenido a P.E.N.G.U.I.N.S.",
    slogan1: "Peer Engaging Network Guide:",
    slogan2: "Unite In New Surroundings",
    passport: 'Configura tu "Pasaporte" para comenzar.',
    name: "Tu Nombre",
    country: "País",
    city: "Ciudad",
    school: "Tu Nueva Escuela",
    accessDirectory: "Acceder al Directorio",
    visitResource: "Visitar Recurso",
    goToCommunity: "Ir a la Comunidad",
    readMore: "Leer más",
    findGems: "Encuentra joyas en",
    viewOnGoogle: "Ver en Google Maps",
    tripAdvisor: "Reseñas de TripAdvisor",
    askAboutCity: "Pregunta sobre la ciudad...",
    hi: "Hola",
    chatInit: "Soy tu guía para",
    chatHelp: "¿Cómo puedo ayudarte hoy?",
    intlStudents: "Estudiantes Internacionales en",
    connectWith: "Conéctate con otros estudiantes internacionales que acaban de llegar a",
    connect: "Conectar",
    legalItems: [
      { title: "Requisitos de Visa", description: "Información esencial para tu estancia." },
      { title: "Seguro de Salud", description: "Cómo estar cubierto en tu nueva ciudad." },
      { title: "Contratos de Vivienda", description: "Qué buscar antes de firmar." },
      { title: "Permisos de Trabajo", description: "¿Puedes trabajar mientras estudias?" },
      { title: "Contacto de Abogados", description: "Profesionales legales especializados en estudiantes." },
    ],
    survivalGuides: [
      { title: "Alojamiento Estudiantil", type: "Guía Esencial", image: "🏠", category: "Esenciales" },
      { title: "Transporte Público", type: "Guía Esencial", image: "🚌", category: "Esenciales" },
      { title: "Antes de Llegar", type: "Lista de Verificación", image: "📋", category: "Esenciales" },
      { title: "¿Qué Traer?", type: "Lista de Equipaje", image: "🎒", category: "Esenciales" },
      { title: "Tiendas Vintage", type: "Lista Curada", image: "👕", category: "Estilo de Vida" },
      { title: "Mejores Sitios de Comida", type: "Lista Curada", image: "🍕", category: "Comida" },
      { title: "Arquitectura Imperdible", type: "Lista Curada", image: "🏛️", category: "Viajes" },
      { title: "Mercados Semanales", type: "Lista Curada", image: "🍎", category: "Estilo de Vida" },
      { title: "Cafés para Estudiar", type: "Lista Curada", image: "☕", category: "Comida" },
      { title: "Ideas de Fin de Semana", type: "Lista Curada", image: "⛰️", category: "Viajes" }
    ],
    languageItems: [
      { title: "Tandem", description: "Encuentra un compañero local para practicar.", link: "https://www.tandem.net/", icon: "🗣️" },
      { title: "Café Online", description: "Citas virtuales para hablar el idioma.", link: "https://www.conversationexchange.com/", icon: "☕" },
      { title: "Duolingo", description: "Aprendizaje de idiomas gamificado.", link: "https://www.duolingo.com/", icon: "🦉" },
      { title: "Planeta Idioma", description: "Únete a nuestros grupos de intercambio.", action: "community", icon: "🌍" },
    ]
  },
  de: {
    legal: "Rechtliche Sektion",
    survival: "Überlebensleitfaden",
    language: "Sprachenzentrum",
    cityChat: "Stadt-Chatbot",
    community: "Gemeinschaft",
    welcome: "Willkommen bei",
    reset: "Profil Zurücksetzen",
    enter: "Plattform Betreten",
    identify: "Identifizieren & Eintreten",
    notYou: "Nicht du? Erneut identifizieren",
    currentIdentity: "Aktuelle Identität",
    journey: "Deine Reise an der",
    begins: "beginnt.",
    select: "Auswählen",
    other: "Andere...",
    identification: "Willkommen bei P.E.N.G.U.I.N.S.",
    slogan1: "Peer Engaging Network Guide:",
    slogan2: "Unite In New Surroundings",
    passport: 'Richte deinen "Reisepass" ein, um zu beginnen.',
    name: "Dein Name",
    country: "Land",
    city: "Stadt",
    school: "Deine neue Schule",
    accessDirectory: "Verzeichnis aufrufen",
    visitResource: "Ressource besuchen",
    goToCommunity: "Zur Gemeinschaft",
    readMore: "Weiterlesen",
    findGems: "Finde Schätze in",
    viewOnGoogle: "Auf Google Maps ansehen",
    tripAdvisor: "TripAdvisor Bewertungen",
    askAboutCity: "Frage etwas über die Stadt...",
    hi: "Hallo",
    chatInit: "Ich bin dein Guide für",
    chatHelp: "Wie kann ich dir heute helfen?",
    intlStudents: "Internationale Studierende an der",
    connectWith: "Vernetze dich mit anderen internationalen Studierenden an der",
    connect: "Verbinden",
    legalItems: [
      { title: "Visabestimmungen", description: "Wichtige Informationen für deinen Aufenthalt." },
      { title: "Krankenversicherung", description: "Wie du in deiner neuen Stadt versichert bleibst." },
      { title: "Mietverträge", description: "Worauf du vor der Unterschrift achten solltest." },
      { title: "Arbeitserlaubnis", description: "Darfst du während des Studiums arbeiten?" },
      { title: "Anwaltskontakt", description: "Rechtsexperten für Studenten- und Ausländerrecht." },
    ],
    survivalGuides: [
      { title: "Studentenunterkunft", type: "Wichtiger Guide", image: "🏠", category: "Wichtiges" },
      { title: "Öffentlicher Verkehr", type: "Wichtiger Guide", image: "🚌", category: "Wichtiges" },
      { title: "Vor der Anreise", type: "Checkliste", image: "📋", category: "Wichtiges" },
      { title: "Was mitbringen?", type: "Packliste", image: "🎒", category: "Wichtiges" },
      { title: "Vintage & Second Hand", type: "Kuratierte Liste", image: "👕", category: "Lifestyle" },
      { title: "Beste Essensorte", type: "Kuratierte Liste", image: "🍕", category: "Essen" },
      { title: "Sehenswerte Architektur", type: "Kuratierte Liste", image: "🏛️", category: "Reisen" },
      { title: "Wochenmärkte", type: "Kuratierte Liste", image: "🍎", category: "Lifestyle" },
      { title: "Cafés zum Lernen", type: "Kuratierte Liste", image: "☕", category: "Essen" },
      { title: "Wochenendausflüge", type: "Kuratierte Liste", image: "⛰️", category: "Reisen" }
    ],
    languageItems: [
      { title: "Tandem", description: "Finde einen lokalen Partner zum Üben.", link: "https://www.tandem.net/", icon: "🗣️" },
      { title: "Online-Kaffee", description: "Virtuelle Kaffeetermine zum Sprechen.", link: "https://www.conversationexchange.com/", icon: "☕" },
      { title: "Duolingo", description: "Spielerisches Sprachenlernen für unterwegs.", link: "https://www.duolingo.com/", icon: "🦉" },
      { title: "Planet Sprache", description: "Tritt unseren Sprachaustauschgruppen bei.", action: "community", icon: "🌍" },
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState("legal");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{name: string, country: string, city: string, school: string, coords: [number, number]} | null>(null);
  const [buddy, setBuddy] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [language, setLanguage] = useState("en");

  const t = TRANSLATIONS[language];

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem("globalStudentUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name && parsed.country && parsed.city && parsed.school && parsed.coords) {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem("globalStudentUser");
      }
    }
    const savedBuddy = localStorage.getItem("globalStudentBuddy");
    if (savedBuddy) {
      try {
        setBuddy(JSON.parse(savedBuddy));
      } catch (e) {
        localStorage.removeItem("globalStudentBuddy");
      }
    }
  }, []);

  if (!mounted) return null;

  const handleOnboarding = (userData: any) => {
    // Reset buddy and other platform state when identifying as a new/different user
    setBuddy(null);
    localStorage.removeItem("globalStudentBuddy");
    
    setUser(userData);
    localStorage.setItem("globalStudentUser", JSON.stringify(userData));
    setHasEntered(true);
  };

  const handleMatchBuddy = (buddyData: any) => {
    setBuddy(buddyData);
    localStorage.setItem("globalStudentBuddy", JSON.stringify(buddyData));
    setActiveTab("community");
  };

  const handleReset = () => {
    localStorage.removeItem("globalStudentUser");
    localStorage.removeItem("globalStudentBuddy");
    setUser(null);
    setBuddy(null);
    setHasEntered(false);
    setActiveTab("legal");
  };

  if (!hasEntered) {
    return <Gateway user={user} t={t} onEnter={() => setHasEntered(true)} onComplete={handleOnboarding} />;
  }

  const tabs = [
    { id: "legal", label: t.legal, icon: Shield },
    { id: "survival", label: t.survival, icon: LifeBuoy },
    { id: "language", label: t.language, icon: Languages },
    { id: "city-chat", label: t.cityChat, icon: Bot },
    { id: "community", label: t.community, icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "legal": return <LegalSection t={t} />;
      case "survival": return <SurvivalGuides city={user!.city} t={t} />;
      case "language": return <LanguageExchange user={user} t={t} onNavigate={() => setActiveTab("community")} />;
      case "city-chat": return <CityChat user={user} t={t} />;
      case "community": return <Community school={user!.school} t={t} />;
      default: return <LegalSection t={t} />;
    }
  };

  return (
    <div className={styles.layout}>
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.logo} style={{ flexDirection: "column", alignItems: "flex-start", gap: "4px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/Gemini_Generated_Image_fdlff8fdlff8fdlf.png" alt="P.E.N.G.U.I.N.S. Logo" width="40" height="40" style={{ borderRadius: "10px", objectFit: "cover" }} />
            <span style={{ fontSize: "22px" }}>P.E.N.G.U.I.N.S.</span>
          </div>
          <div style={{ paddingLeft: "52px", marginTop: "-8px" }}>
            <div style={{ fontSize: "9px", fontWeight: "700", color: "var(--primary)", lineHeight: "1.1", whiteSpace: "nowrap" }}>{t.slogan1}</div>
            <div style={{ fontSize: "9px", fontWeight: "700", color: "var(--primary)", lineHeight: "1.1", whiteSpace: "nowrap" }}>{t.slogan2}</div>
          </div>
          <button className={styles.mobileMenuBtn} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className={styles.nav}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ""}`}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className={styles.navItem} style={{ color: "var(--text-secondary)", cursor: "default" }}>
            <Globe size={20} />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: "transparent", border: "none", color: "inherit", fontSize: "inherit", outline: "none", cursor: "pointer", width: "100%" }}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <button className={styles.navItem} style={{ width: "100%", color: "var(--danger)" }} onClick={handleReset}>
            <LogOut size={20} />
            {t.reset}
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <button className={styles.mobileMenuBtn} style={{ marginBottom: "16px" }} onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className={styles.title}>{tabs.find(t_ => t_.id === activeTab)?.label}</h1>
          <p className={styles.subtitle}>{t.welcome} {user!.city}, {user!.name}! {t.journey} {user!.school} {t.begins}</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
  }

  // --- Components ---

  function Gateway({ user, t, onEnter, onComplete }: { user: any, t: any, onEnter: () => void, onComplete: (data: any) => void }) {
  const [showIdentification, setShowIdentification] = useState(false);

  if (user && !showIdentification) {
    return (
      <div className={styles.page} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)" }}>
        <div className={styles.card} style={{ maxWidth: "450px", width: "100%", padding: "40px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
          <div style={{ marginBottom: "24px" }}>
            <div className={styles.avatar} style={{ margin: "0 auto 16px", width: "80px", height: "80px", fontSize: "32px", border: "4px solid white", overflow: "hidden" }}>
              <img src="/Gemini_Generated_Image_fdlff8fdlff8fdlf.png" alt="" width="80" height="80" style={{ objectFit: "cover" }} />
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: "700" }}>{t.welcome} Back, {user.name}!</h1>
            <div style={{ margin: "12px 0" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)" }}>{t.slogan1}</div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)" }}>{t.slogan2}</div>
            </div>
            <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>Your journey in the {user.city} colony continues.</p>
          </div>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", marginBottom: "24px", textAlign: "left" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>{t.currentIdentity}</div>
            <div style={{ fontSize: "16px", fontWeight: "600", marginTop: "4px" }}>{user.school}</div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{user.city}, {user.country}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button className={styles.button} style={{ height: "50px", fontSize: "16px" }} onClick={onEnter}>{t.enter}</button>
            <button style={{ color: "var(--text-secondary)", background: "transparent", border: "none", cursor: "pointer", fontSize: "14px" }} onClick={() => setShowIdentification(true)}>{t.notYou}</button>
          </div>
        </div>
      </div>
    );
  }

  return <Identification t={t} onComplete={onComplete} />;
  }

  function Identification({ t, onComplete }: { t: any, onComplete: (data: any) => void }) {

  const [formData, setFormData] = useState({ name: "", country: "", city: "", school: "" });
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [customCountry, setCustomCountry] = useState(false);
  const [customCity, setCustomCity] = useState(false);
  const [customSchool, setCustomSchool] = useState(false);

  const countries = Object.keys(ERASMUS_DATA).sort();
  const cities = formData.country && ERASMUS_DATA[formData.country] ? ERASMUS_DATA[formData.country].cities : [];
  const schools = COMMON_SCHOOLS[formData.city] || [];

  // Update coordinates when city changes
  useEffect(() => {
    const fetchCityCoords = async () => {
      if (!formData.city) return;
      
      if (CITY_COORDINATES[formData.city]) {
        setCoords(CITY_COORDINATES[formData.city] as [number, number]);
        return;
      }

      setIsLocating(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.city + ", " + formData.country)}&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (err) {
        console.error("Error fetching city coords:", err);
      } finally {
        setIsLocating(false);
      }
    };

    fetchCityCoords();
  }, [formData.city, formData.country]);

  return (
    <div className={styles.page} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", padding: "20px" }}>
      <div className={styles.card} style={{ maxWidth: "500px", width: "100%", padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img src="/Gemini_Generated_Image_fdlff8fdlff8fdlf.png" alt="P.E.N.G.U.I.N.S. Logo" width="100" height="100" style={{ borderRadius: "20px", objectFit: "cover", marginBottom: "16px", boxShadow: "0 8px 16px rgba(0,0,0,0.15)" }} />
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>{t.identification}</h1>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--primary)", letterSpacing: "0.5px" }}>{t.slogan1}</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--primary)", letterSpacing: "0.5px" }}>{t.slogan2}</div>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>{t.passport}</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onComplete({ ...formData, coords: coords || [48.8566, 2.3522] }); }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{t.name}</label>
            <input type="text" className={styles.input} placeholder="e.g. Alex" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t.country}</label>
              {!customCountry ? (
                <select className={styles.select} required value={formData.country} onChange={(e) => { if (e.target.value === "OTHER") { setCustomCountry(true); setFormData({...formData, country: "", city: "", school: ""}); } else { setFormData({...formData, country: e.target.value, city: "", school: ""}); setCustomCity(false); setCustomSchool(false); } }}>
                  <option value="" disabled>{t.select}</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="OTHER">{t.other}</option>
                </select>
              ) : (
                <input type="text" className={styles.input} placeholder={t.country} required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value, city: "", school: ""})} />
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t.city}</label>
              {!customCity && cities.length > 0 ? (
                <select className={styles.select} required value={formData.city} onChange={(e) => { if (e.target.value === "OTHER") { setCustomCity(true); setFormData({...formData, city: "", school: ""}); } else { setFormData({...formData, city: e.target.value, school: ""}); setCustomSchool(false); } }}>
                  <option value="" disabled>{t.select}</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="OTHER">{t.other}</option>
                </select>
              ) : (
                <input type="text" className={styles.input} placeholder={t.city} required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value, school: ""})} />
              )}
            </div>
          </div>
          
          {formData.city && (
            <div style={{ height: "120px", borderRadius: "8px", overflow: "hidden", marginBottom: "20px", border: "1px solid var(--border)", position: "relative" }}>
              {isLocating ? (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontSize: "12px", color: "var(--text-secondary)" }}>Locating {formData.city}...</div>
              ) : coords ? (
                <RealMap center={coords} pins={[{ lat: coords[0], lng: coords[1], label: formData.city }]} />
              ) : null}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>{t.school}</label>
            {!customSchool && schools.length > 0 ? (
              <select className={styles.select} required value={formData.school} onChange={(e) => { if (e.target.value === "OTHER") { setCustomSchool(true); setFormData({...formData, school: ""}); } else { setFormData({...formData, school: e.target.value}); } }}>
                <option value="" disabled>{t.select} your school</option>
                {schools.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="OTHER">{t.other} School...</option>
              </select>
            ) : (
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" className={styles.input} placeholder="Enter school" required value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} />
                {schools.length > 0 && <button type="button" onClick={() => setCustomSchool(false)} style={{ color: "var(--primary)" }}>List</button>}
              </div>
            )}
          </div>
          <button type="submit" className={styles.button} style={{ marginTop: "8px" }}>{t.identify}</button>
        </form>
      </div>
    </div>
  );
}

function LegalSection({ t }: { t: any }) {
  return (
    <div className={styles.dashboardGrid}>
      {t.legalItems.map((item: any, idx: number) => (
        <div key={idx} className={styles.card}>
          <h2 className={styles.cardTitle}><Shield size={20} /> {item.title}</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px" }}>{item.description}</p>
          <button className={styles.button} style={{ marginTop: "20px" }}>{t.accessDirectory}</button>
        </div>
      ))}
    </div>
  );
}

function SurvivalGuides({ city, t }: { city: string, t: any }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const places = t.survivalGuides.map((guide: any) => ({
    ...guide,
    queries: { 
      tripadvisor: `${city} ${guide.title}`, 
      google: `${city} ${guide.title}` 
    }
  }));
  const filteredPlaces = activeFilter === "All" ? places : places.filter((p: any) => p.category === activeFilter);
  const filters = ["All", ...new Set(places.map((p: any) => p.category)) as any];

  const getTripAdvisorLink = (query: string) => `https://www.tripadvisor.com/Search?q=${encodeURIComponent(query)}`;
  const getGoogleMapsLink = (query: string) => `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div className={styles.mapTabs} style={{ marginBottom: 0 }}>
          {filters.map((f: any) => (
            <button key={f} className={`${styles.mapTab} ${activeFilter === f ? styles.mapTabActive : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className={styles.exploreGrid}>
        {filteredPlaces.map((place: any, idx: number) => (
          <div key={idx} className={`${styles.card} ${styles.exploreCard}`}>
            <div className={styles.exploreImage} style={{ fontSize: "64px" }}>{place.image}</div>
            <div className={styles.exploreContent}>
              <div className={styles.exploreType}>{place.type}</div>
              <div className={styles.exploreTitle}>{place.title}</div>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px", marginBottom: "16px" }}>
                {t.findGems} {city}.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a 
                  href={getGoogleMapsLink(place.queries.google)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.button}
                  style={{ background: "#4285F4", fontSize: "13px", padding: "8px" }}
                >
                  <MapIcon size={14} /> {t.viewOnGoogle}
                </a>
                <a 
                  href={getTripAdvisorLink(place.queries.tripadvisor)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.button}
                  style={{ background: "#34E0A1", color: "#000", fontSize: "13px", padding: "8px" }}
                >
                  <Compass size={14} /> {t.tripAdvisor}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguageExchange({ user, t, onNavigate }: { user: any, t: any, onNavigate: () => void }) {
  const items = t.languageItems.map((item: any) => ({
    ...item,
    action: item.action === "community" ? onNavigate : undefined
  }));

  return (
    <div className={styles.dashboardGrid}>
      {items.map((item: any, idx: number) => (
        <div key={idx} className={styles.card}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>{item.icon}</div>
          <h2 className={styles.cardTitle}>{item.title}</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "12px", marginBottom: "20px" }}>{item.description}</p>
          {item.link ? (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.button}>{t.visitResource}</a>
          ) : (
            <button onClick={item.action} className={styles.button}>{t.goToCommunity}</button>
          )}
        </div>
      ))}
    </div>
  );
}

function CityChat({ user, t }: { user: any, t: any }) {
  const [messages, setMessages] = useState([{ text: `${t.hi} ${user.name}! ${t.chatInit} ${user.city}. ${t.chatHelp}`, sender: "bot" }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update initial message when language changes
  useEffect(() => {
    setMessages([{ text: `${t.hi} ${user.name}! ${t.chatInit} ${user.city}. ${t.chatHelp}`, sender: "bot" }]);
  }, [t, user.name, user.city]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setMessages(prev => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages.map(m => ({ role: m.sender === "bot" ? "assistant" : "user", content: m.text })).concat({ role: "user", content: input }), city: user.city, school: user.school }),
      });
      const data = await response.json();
      if (data.text) setMessages(prev => [...prev, { text: data.text, sender: "bot" }]);
      else throw new Error(data.error || "Error");
    } catch (err: any) {
      setMessages(prev => [...prev, { text: `Error: ${err.message}`, sender: "bot" }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className={styles.card} style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHistory}>
          {messages.map((msg, idx) => (<div key={idx} className={`${styles.message} ${msg.sender === "bot" ? styles.messageBot : styles.messageUser}`}>{msg.text}</div>))}
          {isLoading && <div className={styles.messageBot}>...</div>}
        </div>
        <form className={styles.chatInput} onSubmit={handleSend}>
          <input className={styles.input} value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} placeholder={t.askAboutCity} />
          <button type="submit" className={styles.button} disabled={isLoading}><Send size={18} /></button>
        </form>
      </div>
    </div>
  );
}

function Community({ school, t }: { school: string, t: any }) {
  const students = [
    { name: "Maria Garcia", origin: "Spain", major: "Architecture", email: "maria.garcia@edu.es", phone: "+34 612 345 678" },
    { name: "Kenji Sato", origin: "Japan", major: "Engineering", email: "kenji.sato@univ.jp", phone: "+81 90 1234 5678" },
    { name: "Chloe Smith", origin: "UK", major: "Literature", email: "chloe.smith@college.uk", phone: "+44 7700 900123" },
    { name: "Ahmed Hassan", origin: "Egypt", major: "Medicine", email: "ahmed.hassan@med.eg", phone: "+20 100 123 4567" },
    { name: "Li Wei", origin: "China", major: "Computer Science", email: "li.wei@tech.cn", phone: "+86 138 1234 5678" }
  ];
  return (
    <div className={styles.card} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 className={styles.cardTitle}>
        <img src="/Gemini_Generated_Image_fdlff8fdlff8fdlf.png" alt="" width="24" height="24" style={{ borderRadius: "4px" }} />
        {t.intlStudents} {school}
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>{t.connectWith} {school}.</p>
      <div className={styles.connectList}>
        {students.map((student, idx) => (
          <div key={idx} className={styles.connectItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%" }}>
              <div className={styles.avatar} style={{ margin: 0, width: "48px", height: "48px", fontSize: "20px" }}>{student.name.charAt(0)}</div>
              <div className={styles.connectInfo}>
                <div className={styles.connectName}>{student.name}</div>
                <div className={styles.connectOrigin}>{student.origin} • {student.major}</div>
              </div>
              <a href={`mailto:${student.email}`} className={styles.button} style={{ width: "auto", padding: "8px 16px" }}>{t.connect}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
