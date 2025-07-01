// public/javaScript/auth.js
// Script global para gerenciar autenticação em todas as páginas

class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.init();
    }

    async init() {
        await this.checkAuthStatus();
        this.updateUI();
        this.setupEventListeners();
    }

    // Verificar status de autenticação
    async checkAuthStatus() {
        try {
            const response = await fetch("/api/auth/status", {
                credentials: "include"
            });

            const data = await response.json();

            if (data.success && data.authenticated) {
                this.user = data.user;
                this.isAuthenticated = true;
            } else {
                this.user = null;
                this.isAuthenticated = false;
            }
        } catch (error) {
            console.error("Erro ao verificar autenticação:", error);
            this.user = null;
            this.isAuthenticated = false;
        }
    }

    // Atualizar interface do usuário
    updateUI() {
        const authContainer = document.getElementById("authContainer");
        const userGreeting = document.getElementById("userGreeting");
        const loginBtn = document.getElementById("loginBtn");
        const usernameSpan = document.getElementById("username");

        if (!authContainer) return;

        if (this.isAuthenticated && this.user) {
            // Usuário logado
            if (userGreeting) {
                userGreeting.style.display = "block";
            }
            if (loginBtn) {
                loginBtn.style.display = "none";
            }
            if (usernameSpan) {
                usernameSpan.textContent = this.user.username;
            }
        } else {
            // Usuário não logado
            if (userGreeting) {
                userGreeting.style.display = "none";
            }
            if (loginBtn) {
                loginBtn.style.display = "block";
            }
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // Fazer logout
    async logout() {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                this.user = null;
                this.isAuthenticated = false;
                this.updateUI();
                
                // Redirecionar para login se não estiver na página inicial
                if (window.location.pathname !== "/" && window.location.pathname !== "/index.html") {
                    window.location.href = "/";
                }
            }
        } catch (error) {
            console.error("Erro no logout:", error);
            // Mesmo com erro, limpa o estado local
            this.user = null;
            this.isAuthenticated = false;
            this.updateUI();
        }
    }

    // Fazer login programaticamente
    async login(username, password) {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                this.user = data.user;
                this.isAuthenticated = true;
                this.updateUI();
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Erro no login:", error);
            return { success: false, message: "Erro de conexão" };
        }
    }

    // Verificar se usuário tem permissão de admin
    isAdmin() {
        return this.isAuthenticated && this.user && this.user.role === 'admin';
    }

    // Proteger rota (redirecionar para login se não autenticado)
    requireAuth() {
        if (!this.isAuthenticated) {
            window.location.href = "/login";
            return false;
        }
        return true;
    }

    // Proteger rota admin
    requireAdmin() {
        if (!this.isAuthenticated) {
            window.location.href = "/login";
            return false;
        }
        if (!this.isAdmin()) {
            alert("Acesso negado. Privilégios de administrador necessários.");
            return false;
        }
        return true;
    }

    // Renovar token automaticamente
    async refreshToken() {
        try {
            const response = await fetch("/api/auth/refresh", {
                method: "POST",
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                this.user = data.user;
                this.isAuthenticated = true;
                return true;
            } else {
                this.user = null;
                this.isAuthenticated = false;
                return false;
            }
        } catch (error) {
            console.error("Erro ao renovar token:", error);
            this.user = null;
            this.isAuthenticated = false;
            return false;
        }
    }
}

// Criar instância global do gerenciador de autenticação
const authManager = new AuthManager();

// Configurar renovação automática de token
setInterval(async () => {
    if (authManager.isAuthenticated) {
        const renewed = await authManager.refreshToken();
        if (!renewed) {
            console.log("Token expirado, redirecionando para login");
            window.location.href = "/login";
        }
    }
}, 10 * 60 * 1000); // Renovar a cada 10 minutos

// Exportar para uso global
window.authManager = authManager;

