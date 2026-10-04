// ============================================================
// GRAVITY × M11
// FAVORITES + READ LATER
// ============================================================

window.gravityFavorites = {

    async client() {

        if (!window.gravitySupabaseReady) {
            throw new Error(
                "Supabase is not ready."
            );
        }

        await window.gravitySupabaseReady;

        return window.gravitySupabase;

    },


    async user() {

        if (!window.gravityAuth) {
            return null;
        }

        return await window.gravityAuth
            .getCurrentUser();

    },


    async requireUser() {

        const user =
            await this.user();

        if (!user) {

            return {

                success:
                    false,

                reason:
                    "login_required"

            };

        }


        return {

            success:
                true,

            user:
                user

        };

    },


    async isFavorite(
        bookUrl
    ) {

        const auth =
            await this.requireUser();


        if (!auth.success) {
            return false;
        }


        const supabase =
            await this.client();


        const {
            data,
            error
        } =
            await supabase
                .from("favorites")
                .select("id")
                .eq(
                    "user_id",
                    auth.user.id
                )
                .eq(
                    "book_url",
                    bookUrl
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Favorite check:",
                error
            );

            return false;
        }


        return !!data;

    },


    async add(
        book
    ) {

        const auth =
            await this.requireUser();


        if (!auth.success) {
            return auth;
        }


        if (
            !book ||
            !book.url
        ) {

            return {

                success:
                    false,

                reason:
                    "invalid_book"

            };

        }


        const supabase =
            await this.client();


        const {
            error
        } =
            await supabase
                .from("favorites")
                .insert({

                    user_id:
                        auth.user.id,

                    book_url:
                        book.url,

                    book_title:
                        book.title || "",

                    book_author:
                        book.author || ""

                });


        if (error) {

            if (
                error.code ===
                "23505"
            ) {

                return {

                    success:
                        true,

                    alreadyExists:
                        true

                };

            }


            console.error(
                "Favorite add:",
                error
            );


            return {

                success:
                    false,

                reason:
                    "database_error",

                error:
                    error

            };

        }


        return {

            success:
                true,

            alreadyExists:
                false

        };

    },


    async remove(
        bookUrl
    ) {

        const auth =
            await this.requireUser();


        if (!auth.success) {
            return auth;
        }


        const supabase =
            await this.client();


        const {
            error
        } =
            await supabase
                .from("favorites")
                .delete()
                .eq(
                    "user_id",
                    auth.user.id
                )
                .eq(
                    "book_url",
                    bookUrl
                );


        if (error) {

            console.error(
                "Favorite remove:",
                error
            );

            return {

                success:
                    false,

                reason:
                    "database_error"

            };

        }


        return {

            success:
                true

        };

    },


    async toggle(
        book
    ) {

        const favorite =
            await this.isFavorite(
                book.url
            );


        if (favorite) {

            return await this.remove(
                book.url
            );

        }


        return await this.add(
            book
        );

    },


    async getAll() {

        const auth =
            await this.requireUser();


        if (!auth.success) {
            return [];
        }


        const supabase =
            await this.client();


        const {
            data,
            error
        } =
            await supabase
                .from("favorites")
                .select("*")
                .eq(
                    "user_id",
                    auth.user.id
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        if (error) {

            console.error(
                "Get favorites:",
                error
            );

            return [];

        }


        return data || [];

    }

};


// ============================================================
// READ LATER
// ============================================================

window.gravityReadLater = {

    keyPrefix:
        "gravity_read_later_",


    async getUserKey() {

        const user =
            await window.gravityAuth
                ?.getCurrentUser();


        if (!user) {
            return null;
        }


        return this.keyPrefix +
            user.id;

    },


    async getAll() {

        const key =
            await this.getUserKey();


        if (!key) {
            return [];
        }


        try {

            return JSON.parse(
                localStorage.getItem(
                    key
                )
            ) || [];

        } catch {

            return [];

        }

    },


    async has(
        bookUrl
    ) {

        const books =
            await this.getAll();


        return books.some(
            book =>
                book.url ===
                bookUrl
        );

    },


    async add(
        book
    ) {

        const user =
            await window.gravityAuth
                ?.getCurrentUser();


        if (!user) {

            return {

                success:
                    false,

                reason:
                    "login_required"

            };

        }


        const key =
            this.keyPrefix +
            user.id;


        const books =
            await this.getAll();


        const exists =
            books.some(
                item =>
                    item.url ===
                    book.url
            );


        if (!exists) {

            books.unshift({

                title:
                    book.title || "",

                author:
                    book.author || "",

                category:
                    book.category || "",

                language:
                    book.language || "",

                description:
                    book.description || "",

                url:
                    book.url || "",

                addedAt:
                    new Date()
                        .toISOString()

            });

        }


        localStorage.setItem(
            key,
            JSON.stringify(
                books
            )
        );


        return {

            success:
                true,

            alreadyExists:
                exists

        };

    },


    async remove(
        bookUrl
    ) {

        const key =
            await this.getUserKey();


        if (!key) {

            return {

                success:
                    false,

                reason:
                    "login_required"

            };

        }


        const books =
            await this.getAll();


        const filtered =
            books.filter(
                book =>
                    book.url !==
                    bookUrl
            );


        localStorage.setItem(
            key,
            JSON.stringify(
                filtered
            )
        );


        return {

            success:
                true

        };

    },


    async toggle(
        book
    ) {

        const exists =
            await this.has(
                book.url
            );


        if (exists) {

            return await this.remove(
                book.url
            );

        }


        return await this.add(
            book
        );

    }

};


console.log(
    "Gravity Favorites + Read Later — Ready"
);
