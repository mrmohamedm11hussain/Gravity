// ============================================
// GRAVITY × M11 — FAVORITES SYSTEM
// ============================================

window.gravityFavorites = {

    async getClient() {
        await window.gravitySupabaseReady;
        return window.gravitySupabase;
    },

    async getUser() {
        if (!window.gravityAuth) {
            return null;
        }

        return await window.gravityAuth.getCurrentUser();
    },

    async isFavorite(bookUrl) {
        const supabase = await this.getClient();
        const user = await this.getUser();

        if (!user || !bookUrl) {
            return false;
        }

        const { data, error } = await supabase
            .from("favorites")
            .select("id")
            .eq("user_id", user.id)
            .eq("book_url", bookUrl)
            .maybeSingle();

        if (error) {
            console.error("Favorite check:", error);
            return false;
        }

        return !!data;
    },

    async add(book) {
        const supabase = await this.getClient();
        const user = await this.getUser();

        if (!user) {
            return {
                success: false,
                reason: "login_required"
            };
        }

        const { error } = await supabase
            .from("favorites")
            .insert({
                user_id: user.id,
                book_url: book.url,
                book_title: book.title || "",
                book_author: book.author || ""
            });

        if (error) {

            // الكتاب موجود بالفعل
            if (error.code === "23505") {
                return {
                    success: true,
                    alreadyExists: true
                };
            }

            console.error("Add favorite:", error);

            return {
                success: false,
                reason: "database_error"
            };
        }

        return {
            success: true,
            alreadyExists: false
        };
    },

    async remove(bookUrl) {
        const supabase = await this.getClient();
        const user = await this.getUser();

        if (!user) {
            return {
                success: false,
                reason: "login_required"
            };
        }

        const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("book_url", bookUrl);

        if (error) {
            console.error("Remove favorite:", error);

            return {
                success: false,
                reason: "database_error"
            };
        }

        return {
            success: true
        };
    },

    async toggle(book) {

        const favorite =
            await this.isFavorite(book.url);

        if (favorite) {
            return await this.remove(book.url);
        }

        return await this.add(book);
    },

    async getAll() {
        const supabase = await this.getClient();
        const user = await this.getUser();

        if (!user) {
            return [];
        }

        const { data, error } = await supabase
            .from("favorites")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error("Get favorites:", error);
            return [];
        }

        return data || [];
    }
};

console.log("Gravity Favorites loaded.");
