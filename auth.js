// ============================================================
// GRAVITY × M11
// AUTH SYSTEM — CLEAN VERSION
// ============================================================

window.gravityAuth = {

    async getClient() {

        if (window.gravitySupabaseReady) {
            return await window.gravitySupabaseReady;
        }

        if (window.gravitySupabase) {
            return window.gravitySupabase;
        }

        throw new Error("Supabase is not ready.");

    },


    async getSession() {

        const supabase =
            await this.getClient();

        const {
            data,
            error
        } =
            await supabase.auth.getSession();

        if (error) {

            console.error(
                "Gravity getSession:",
                error
            );

            return null;
        }

        return data?.session || null;

    },


    async getCurrentUser() {

        const session =
            await this.getSession();

        return session?.user || null;

    },


    async getProfile() {

        const supabase =
            await this.getClient();

        const user =
            await this.getCurrentUser();

        if (!user) {
            return null;
        }


        const {
            data,
            error
        } =
            await supabase
                .from("profiles")
                .select(
                    "user_id, role, full_name"
                )
                .eq(
                    "user_id",
                    user.id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Gravity getProfile:",
                error
            );

            return null;
        }


        return data || null;

    },


    async isAdmin() {

        const profile =
            await this.getProfile();

        return (
            profile &&
            profile.role === "admin"
        );

    },


    async signUp(
        email,
        password,
        fullName
    ) {

        const supabase =
            await this.getClient();


        const cleanEmail =
            String(email || "")
                .trim()
                .toLowerCase();


        const cleanName =
            String(fullName || "")
                .trim();


        if (!cleanName) {
            throw new Error(
                "اكتب اسمك أولًا."
            );
        }


        if (!cleanEmail) {
            throw new Error(
                "اكتب البريد الإلكتروني."
            );
        }


        if (
            !cleanEmail.includes("@") ||
            !cleanEmail.includes(".")
        ) {
            throw new Error(
                "اكتب بريدًا إلكترونيًا صحيحًا."
            );
        }


        if (
            String(password || "").length < 6
        ) {
            throw new Error(
                "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
            );
        }


        const {
            data,
            error
        } =
            await supabase.auth.signUp({

                email:
                    cleanEmail,

                password:
                    password,

                options: {

                    data: {

                        full_name:
                            cleanName

                    },

                    emailRedirectTo:
                        window.location.origin +
                        window.location.pathname
                }

            });


        if (error) {
            throw error;
        }


        /*
         * Supabase ممكن يرجع user بدون session
         * عندما يكون تأكيد البريد مفعّلًا.
         */

        return {

            ...data,

            needsEmailConfirmation:
                !!data?.user &&
                !data?.session

        };

    },


    async signIn(
        email,
        password
    ) {

        const supabase =
            await this.getClient();


        const cleanEmail =
            String(email || "")
                .trim()
                .toLowerCase();


        if (!cleanEmail) {
            throw new Error(
                "اكتب البريد الإلكتروني."
            );
        }


        if (!password) {
            throw new Error(
                "اكتب كلمة المرور."
            );
        }


        const {
            data,
            error
        } =
            await supabase.auth
                .signInWithPassword({

                    email:
                        cleanEmail,

                    password:
                        password

                });


        if (error) {
            throw error;
        }


        if (!data?.session) {

            throw new Error(
                "لم يتم فتح جلسة تسجيل الدخول."
            );

        }


        await this.createProfileIfNeeded();


        return data;

    },


    async signOut() {

        const supabase =
            await this.getClient();


        const {
            error
        } =
            await supabase.auth.signOut();


        if (error) {
            throw error;
        }


        window.location.href =
            "index.html";

    },


    async createProfileIfNeeded() {

        const supabase =
            await this.getClient();


        const user =
            await this.getCurrentUser();


        if (!user) {
            return null;
        }


        const existing =
            await this.getProfile();


        if (existing) {
            return existing;
        }


        const fullName =
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Gravity User";


        const {
            data,
            error
        } =
            await supabase
                .from("profiles")
                .insert({

                    user_id:
                        user.id,

                    role:
                        "user",

                    full_name:
                        fullName

                })
                .select()
                .single();


        if (error) {

            /*
             * ممكن يكون Profile اتعمل
             * بين الطلبين.
             */

            console.error(
                "Gravity profile creation:",
                error
            );

            return await this.getProfile();

        }


        return data;

    },


    async resendConfirmation(
        email
    ) {

        const supabase =
            await this.getClient();


        const cleanEmail =
            String(email || "")
                .trim()
                .toLowerCase();


        if (!cleanEmail) {
            throw new Error(
                "اكتب البريد الإلكتروني."
            );
        }


        const {
            error
        } =
            await supabase.auth.resend({

                type:
                    "signup",

                email:
                    cleanEmail,

                options: {

                    emailRedirectTo:
                        window.location.origin +
                        "/index.html"

                }

            });


        if (error) {
            throw error;
        }


        return true;

    },


    async updateName(
        fullName
    ) {

        const supabase =
            await this.getClient();

        const user =
            await this.getCurrentUser();


        if (!user) {
            throw new Error(
                "يجب تسجيل الدخول أولًا."
            );
        }


        const name =
            String(fullName || "")
                .trim();


        if (!name) {
            throw new Error(
                "اكتب اسمك."
            );
        }


        const {
            error
        } =
            await supabase.auth.updateUser({

                data: {

                    full_name:
                        name

                }

            });


        if (error) {
            throw error;
        }


        await supabase
            .from("profiles")
            .update({

                full_name:
                    name

            })
            .eq(
                "user_id",
                user.id
            );


        return true;

    }

};


console.log(
    "Gravity Auth — Ready"
);
