// ============================================
// GRAVITY × M11 — AUTH LOADER
// ============================================

(async function () {
    try {
        // تحميل اتصال Supabase
        if (!window.gravitySupabaseReady) {
            const supabaseScript = document.createElement("script");
            supabaseScript.src = "supabase.js";

            await new Promise((resolve, reject) => {
                supabaseScript.onload = resolve;
                supabaseScript.onerror = reject;
                document.head.appendChild(supabaseScript);
            });
        }

        // انتظار اتصال Supabase
        if (window.gravitySupabaseReady) {
            await window.gravitySupabaseReady;
        }

        // تحميل نظام تسجيل الدخول
        if (!window.gravityAuth) {
            const authScript = document.createElement("script");
            authScript.src = "auth.js";

            await new Promise((resolve, reject) => {
                authScript.onload = resolve;
                authScript.onerror = reject;
                document.head.appendChild(authScript);
            });
        }

        console.log("Gravity authentication system is ready.");

    } catch (error) {
        console.error("Gravity Auth Loader Error:", error);
    }
})();
