// ============================================
// GRAVITY × M11 — FEATURES LOADER
// ============================================

(async function () {

    try {

        // تحميل نظام المفضلة
        if (!window.gravityFavorites) {

            const favoritesScript =
                document.createElement("script");

            favoritesScript.src =
                "favorites.js";

            await new Promise((resolve, reject) => {

                favoritesScript.onload = resolve;
                favoritesScript.onerror = reject;

                document.head.appendChild(
                    favoritesScript
                );
            });
        }


        // تحميل واجهة المفضلة
        if (!window.gravityFavoritesUI) {

            const favoritesUIScript =
                document.createElement("script");

            favoritesUIScript.src =
                "favorites-ui.js";

            await new Promise((resolve, reject) => {

                favoritesUIScript.onload = resolve;
                favoritesUIScript.onerror = reject;

                document.head.appendChild(
                    favoritesUIScript
                );
            });
        }


        // التأكد أن أنظمة الحسابات جاهزة
        if (window.gravitySupabaseReady) {
            await window.gravitySupabaseReady;
        }


        console.log(
            "Gravity features are ready."
        );


        // تجهيز أزرار المفضلة
        if (window.gravityFavoritesUI) {

            await window.gravityFavoritesUI.setup();

        }

    } catch (error) {

        console.error(
            "Gravity Features Loader Error:",
            error
        );

    }

})();
