// ============================================
// GRAVITY × M11 — SUPABASE CONNECTION
// ============================================

const SUPABASE_URL = "https://dqjoohudajylurgjxpng.supabase.co";

// الصق Publishable Key هنا
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jBU2dQA6LXjXlpEFYR6WFA_698_AZkl";

function loadSupabaseLibrary() {
    return new Promise((resolve, reject) => {
        if (
            window.supabase &&
            typeof window.supabase.createClient === "function"
        ) {
            resolve();
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = () => resolve();
        script.onerror = () =>
            reject(new Error("تعذر تحميل مكتبة Supabase"));

        document.head.appendChild(script);
    });
}

window.gravitySupabaseReady = loadSupabaseLibrary().then(() => {
    const client = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

    window.gravitySupabase = client;

    console.log("Gravity Supabase connected.");

    return client;
}); 
