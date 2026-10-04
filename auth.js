// ============================================
// GRAVITY × M11 — AUTH SYSTEM
// ============================================

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
        const supabase = await this.getClient();

        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Gravity Auth:", error);
            return null;
        }

        return data.session;
    },

    async getCurrentUser() {
        const session = await this.getSession();
        return session ? session.user : null;
    },

    async getProfile() {
        const supabase = await this.getClient();
        const user = await this.getCurrentUser();

        if (!user) {
            return null;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("user_id, role, full_name")
            .eq("user_id", user.id)
            .maybeSingle();

        if (error) {
            console.error("Gravity Profile:", error);
            return null;
        }

        return data;
    },

    async isAdmin() {
        const profile = await this.getProfile();
        return profile?.role === "admin";
    },

    async signUp(email, password, fullName = "") {
        const supabase = await this.getClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (error) {
            throw error;
        }

        return data;
    },

    async signIn(email, password) {
        const supabase = await this.getClient();

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            throw error;
        }

        return data;
    },

    async signOut() {
        const supabase = await this.getClient();

        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        window.location.reload();
    },

    async createProfileIfNeeded() {
        const supabase = await this.getClient();
        const user = await this.getCurrentUser();

        if (!user) {
            return null;
        }

        const existingProfile = await this.getProfile();

        if (existingProfile) {
            return existingProfile;
        }

        const fullName =
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Gravity User";

        const { data, error } = await supabase
            .from("profiles")
            .insert({
                user_id: user.id,
                role: "user",
                full_name: fullName
            })
            .select()
            .single();

        if (error) {
            console.error("Gravity Profile Creation:", error);
            return null;
        }

        return data;
    }
};

console.log("Gravity Auth loaded.");
