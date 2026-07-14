// Shared Supabase client (loaded after the supabase-js CDN script).
// The publishable key is safe to expose in the browser; Row-Level Security
// protects the data — the public can only read PUBLISHED properties, and only
// allow-listed admins can write.
window.SB_URL = "https://vzanpbohmbxchhbqginx.supabase.co";
window.SB_KEY = "sb_publishable_fbpp8zlQeDaPtL88gwCvmw_E--ucTv_";
window.sb = window.supabase.createClient(window.SB_URL, window.SB_KEY);
