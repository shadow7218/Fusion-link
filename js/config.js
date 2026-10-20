/**
 * ========================================================================
 * LINK IN BIO - CONFIGURATION
 * ========================================================================
 * 
 * HOW TO EDIT:
 * 1. Change your name, bio, and avatar URL below.
 * 2. Set your default theme ('aurora', 'midnight', 'sunset', 'ocean', 'mono', 'candy').
 * 3. Set your default mode ('auto', 'light', 'dark').
 * 4. Under 'links', enable/disable links by changing 'enabled' to true/false.
 * 5. Update the 'url' fields with your actual profile links.
 * 6. Set 'featured: true' to make a link stand out.
 * 
 * Note: If you edit this app via the built-in settings UI, those changes 
 * will be saved to your browser's local storage and override this file.
 */

export const CONFIG = {
    // --- Profile Info ---
    name: "Your Name",
    bio: "Digital creator, developer, and designer. Welcome to my personal hub.",
    avatar: "https://i.pravatar.cc/300", // Replace with your image URL
    
    // --- Appearance ---
    theme: "aurora", // aurora | midnight | sunset | ocean | mono | candy
    mode: "auto",    // auto | light | dark
    background: "mesh", 
    accent: "default",

    // --- Extra Blocks (Part 5) ---
    announcement: "🚀 Check out my latest project below!",
    music: "https://open.spotify.com/embed/track/placeholder",
    video: "https://www.youtube.com/embed/placeholder",
    gallery: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e",
        "https://images.unsplash.com/photo-1614850715649-1d0106293cb1"
    ],
    tipUrl: "https://ko-fi.com/placeholder",
    contactEmail: "hello@example.com",
    countdownDate: "2027-01-01T00:00:00Z",
    weatherCity: "London",

    // --- Links ---
    links: [
        { id: "instagram", platform: "Instagram", label: "Follow on Instagram", subtitle: "@username", url: "https://instagram.com", featured: true, enabled: true },
        { id: "x", platform: "X", label: "Follow on X", subtitle: "@username", url: "https://x.com", featured: false, enabled: true },
        { id: "tiktok", platform: "TikTok", label: "TikTok", subtitle: "@username", url: "https://tiktok.com", featured: false, enabled: true },
        { id: "youtube", platform: "YouTube", label: "Subscribe on YouTube", subtitle: "Latest videos", url: "https://youtube.com", featured: true, enabled: true },
        { id: "github", platform: "GitHub", label: "GitHub", subtitle: "Open source projects", url: "https://github.com", featured: false, enabled: true },
        { id: "linkedin", platform: "LinkedIn", label: "LinkedIn", subtitle: "Professional network", url: "https://linkedin.com", featured: false, enabled: true },
        { id: "threads", platform: "Threads", label: "Threads", subtitle: "Join the conversation", url: "https://threads.net", featured: false, enabled: true },
        { id: "website", platform: "Website", label: "Personal Portfolio", subtitle: "example.com", url: "https://example.com", featured: true, enabled: true },
        { id: "spotify", platform: "Spotify", label: "Spotify Playlist", subtitle: "What I'm listening to", url: "https://spotify.com", featured: false, enabled: true },
        { id: "discord", platform: "Discord", label: "Join the Discord", subtitle: "Community server", url: "https://discord.com", featured: false, enabled: false },
        { id: "telegram", platform: "Telegram", label: "Telegram", subtitle: "Chat with me", url: "https://t.me/placeholder", featured: false, enabled: false },
        { id: "whatsapp", platform: "WhatsApp", label: "WhatsApp", subtitle: "Message me directly", url: "https://wa.me/1234567890", featured: false, enabled: false },
        { id: "facebook", platform: "Facebook", label: "Facebook", subtitle: "", url: "https://facebook.com", featured: false, enabled: false },
        { id: "snapchat", platform: "Snapchat", label: "Snapchat", subtitle: "", url: "https://snapchat.com", featured: false, enabled: false },
        { id: "pinterest", platform: "Pinterest", label: "Pinterest", subtitle: "Moodboards", url: "https://pinterest.com", featured: false, enabled: false },
        { id: "reddit", platform: "Reddit", label: "Reddit", subtitle: "", url: "https://reddit.com", featured: false, enabled: false },
        { id: "twitch", platform: "Twitch", label: "Twitch", subtitle: "Live streams", url: "https://twitch.tv", featured: false, enabled: false },
        { id: "email", platform: "Email", label: "Email Me", subtitle: "hello@example.com", url: "mailto:hello@example.com", featured: false, enabled: true },
        { id: "phone", platform: "Phone", label: "Call Me", subtitle: "+1 234 567 8900", url: "tel:+12345678900", featured: false, enabled: false }
    ]
};
