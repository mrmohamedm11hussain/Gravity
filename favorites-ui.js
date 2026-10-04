// ============================================
// GRAVITY × M11 — FAVORITES UI
// Space Edition
// ============================================

(function () {

    function createFavoriteButton(book) {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "gravity-favorite-button";
        button.setAttribute(
            "aria-label",
            "إضافة إلى المفضلة"
        );

        button.innerHTML = "♡";

        button.style.cssText = `
            position: absolute;
            top: 14px;
            left: 14px;
            width: 42px;
            height: 42px;
            border: 1px solid rgba(255,255,255,.14);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #e2e8f0;
            background: rgba(3,7,18,.72);
            backdrop-filter: blur(10px);
            font-size: 23px;
            cursor: pointer;
            z-index: 20;
            transition:
                transform .25s ease,
                background .25s ease,
                color .25s ease,
                box-shadow .25s ease;
        `;

        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.08)";
            button.style.boxShadow =
                "0 0 25px rgba(139,92,246,.35)";
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
            button.style.boxShadow = "none";
        });

        button.addEventListener("click", async (event) => {

            event.preventDefault();
            event.stopPropagation();

            try {

                const user =
                    await window.gravityAuth
                        .getCurrentUser();

                if (!user) {

                    const goLogin =
                        confirm(
                            "⭐ سجّل دخولك أولًا لإضافة الكتب إلى المفضلة.\n\nهل تريد الذهاب لتسجيل الدخول؟"
                        );

                    if (goLogin) {
                        window.location.href =
                            "login.html";
                    }

                    return;
                }

                button.disabled = true;

                const result =
                    await window.gravityFavorites
                        .toggle(book);

                if (!result.success) {
                    throw new Error(
                        "تعذر تحديث المفضلة."
                    );
                }

                const nowFavorite =
                    await window.gravityFavorites
                        .isFavorite(book.url);

                if (nowFavorite) {

                    button.innerHTML = "♥";

                    button.style.color = "#f0abfc";

                    button.style.background =
                        "rgba(126,34,206,.35)";

                    button.style.boxShadow =
                        "0 0 25px rgba(192,132,252,.35)";

                    button.setAttribute(
                        "aria-label",
                        "إزالة من المفضلة"
                    );

                } else {

                    button.innerHTML = "♡";

                    button.style.color = "#e2e8f0";

                    button.style.background =
                        "rgba(3,7,18,.72)";

                    button.style.boxShadow = "none";

                    button.setAttribute(
                        "aria-label",
                        "إضافة إلى المفضلة"
                    );
                }

            } catch (error) {

                console.error(
                    "Gravity Favorites UI:",
                    error
                );

                alert(
                    "حدث خطأ أثناء تحديث المفضلة."
                );

            } finally {

                button.disabled = false;
            }
        });

        return button;
    }


    async function setupFavoriteButtons() {

        if (!window.gravityFavorites) {
            return;
        }

        const cards =
            document.querySelectorAll(
                "[data-gravity-book]"
            );

        for (const card of cards) {

            if (
                card.querySelector(
                    ".gravity-favorite-button"
                )
            ) {
                continue;
            }

            const bookData =
                card.getAttribute(
                    "data-gravity-book"
                );

            if (!bookData) {
                continue;
            }

            try {

                const book =
                    JSON.parse(bookData);

                if (!book.url) {
                    continue;
                }

                if (
                    getComputedStyle(card).position ===
                    "static"
                ) {
                    card.style.position =
                        "relative";
                }

                const button =
                    createFavoriteButton(book);

                card.appendChild(button);

                const favorite =
                    await window.gravityFavorites
                        .isFavorite(book.url);

                if (favorite) {

                    button.innerHTML = "♥";

                    button.style.color =
                        "#f0abfc";

                    button.style.background =
                        "rgba(126,34,206,.35)";

                    button.style.boxShadow =
                        "0 0 25px rgba(192,132,252,.35)";
                }

            } catch (error) {

                console.error(
                    "Favorite card error:",
                    error
                );
            }
        }
    }


    window.gravityFavoritesUI = {
        setup: setupFavoriteButtons
    };

})();
