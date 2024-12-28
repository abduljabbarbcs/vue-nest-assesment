// src/middleware/auth.ts

import Cookies from 'js-cookie';
import type { RouteLocationNormalized } from 'vue-router';

export default function authMiddleware(to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) {
    const isAuthenticated = Cookies.get('auth_token'); // Replace with your actual cookie name
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'signIn' }); // Redirect to the login page
    } else {
        next(); // Allow the navigation
    }
}
