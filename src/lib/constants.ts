/**
 * Konstanta bersama yang aman dipakai di middleware (Edge Runtime).
 * File ini TIDAK boleh mengimport 'next/headers' atau modul Node.js lainnya.
 */
export const SESSION_COOKIE_NAME = 'rw14_session' as const;