// ============================================
// GRAVITY × M11 — SUPABASE
// ============================================

const SUPABASE_URL = "https://dqjoohudajylurgjxpng.supabase.co";

// ضع Publishable Key الخاص بك هنا
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jBU2dQA6LXjXlpEFYR6WFA_698_AZkl";

function gravityLoadSupabase() {
    return new Promise((resolve, reject) => {

        if (
            window.supabase &&
            typeof window.supabase.createClient === "function"
        ) {
            resolve(window.supabase);
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = () => {
            if (
                window.supabase &&
                typeof window.supabase.createClient === "function"
            ) {
                resolve(window.supabase);
            } else {
                reject(new Error("Supabase library loaded but was not found."));
            }
        };

        script.onerror = () => {
            reject(new Error("Could not load Supabase library."));
        };

        document.head.appendChild(script);
    });
}

window.gravitySupabaseReady = gravityLoadSupabase()
    .then((supabaseLibrary) => {

        const client = supabaseLibrary.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

        window.gravitySupabase = client;

        return client;
    })
    .catch((error) => {

        console.error("Gravity Supabase Error:", error);

        throw error;
    }); 
