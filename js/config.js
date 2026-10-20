export const CONFIG = {
    // --- Profile Info ---
    name: "Fusion",
    bio: "Premium wallpapers & digital art. Elevate your screen.",
    avatar: "", // Paste your Imgur URL or ./assets/avatar.jpg here
    
    // --- Appearance ---
    theme: "midnight", 
    mode: "dark",
    
    // --- Spotify Playlist (Use the EMBED link) ---
    // Example: https://open.spotify.com/embed/playlist/YOUR_ID
    spotifyPlaylist: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M", 
    
    // --- Links ---
    links: [
        { id: "gallery", platform: "website", label: "Wallpaper Gallery", subtitle: "Browse all my art", url: "#", featured: true, enabled: true },
        { id: "instagram", platform: "instagram", label: "Instagram", subtitle: "@fusion.walls", url: "https://instagram.com", featured: false, enabled: true },
        { id: "twitter", platform: "x", label: "X (Twitter)", subtitle: "Updates & previews", url: "https://x.com", featured: false, enabled: true },
        { id: "download", platform: "custom", label: "Free Wallpaper Pack", subtitle: "Download .zip", url: "#", featured: true, enabled: true },
        { id: "support", platform: "custom", label: "Buy me a coffee", subtitle: "Support my work", url: "https://ko-fi.com", featured: false, enabled: true },
        { id: "youtube", platform: "youtube", label: "YouTube", subtitle: "Speed art & process", url: "https://youtube.com", featured: false, enabled: true }
    ]
};
