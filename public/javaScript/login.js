// public/javaScript/login.js - VERSÃO COM MELHOR TRATAMENTO DE ERROS

// Elementos do DOM
const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const authContainer = document.querySelector(".auth-container");
const formLogin = document.getElementById("formLogin");
const formRegister = document.getElementById("formRegister");

// Alternar entre Login e Cadastro
signInBtn?.addEventListener("click", () => {
    authContainer?.classList.remove("right-panel-active");
});

signUpBtn?.addEventListener("click", () => {
    authContainer?.classList.add("right-panel-active");
});

// Função para mostrar mensagens melhorada
function showMessage(message, type = 'info', duration = 5000) {
    // Remove mensagem anterior se existir
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message auth-message-${type}`;
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: inherit; margin-left: 10px;">&times;</button>
        </div>
    `;
    
    // Adiciona estilos
    messageDiv.style.cssText = `
        padding: 15px;
        margin: 15px 0;
        border-radius: 8px;
        text-align: left;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.4;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
        ${type === 'error' ? 'background-color: #fee; color: #c33; border: 1px solid #fcc;' : ''}
        ${type === 'success' ? 'background-color: #efe; color: #363; border: 1px solid #cfc;' : ''}
        ${type === 'info' ? 'background-color: #eef; color: #336; border: 1px solid #ccf;' : ''}
        ${type === 'warning' ? 'background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7;' : ''}
    `;

    // Adiciona animação CSS
    if (!document.querySelector('#message-animations')) {
        const style = document.createElement('style');
        style.id = 'message-animations';
        style.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Insere a mensagem no container apropriado
    const activeContainer = authContainer?.classList.contains("right-panel-active") ? 
        document.querySelector('.inscrever-se-container') : 
        document.querySelector('.entrar-container');
    
    if (activeContainer) {
        const form = activeContainer.querySelector('form');
        if (form) {
            activeContainer.insertBefore(messageDiv, form);
        } else {
            activeContainer.appendChild(messageDiv);
        }
    }

    // Remove a mensagem automaticamente após o tempo especificado
    if (duration > 0) {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, duration);
    }
}

// Função para mostrar erros detalhados
function showDetailedError(error, context = '') {
    console.error(`Erro ${context}:`, error);
    
    let userMessage = '';
    
    // Tratar diferentes tipos de erro
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        userMessage = '❌ Erro de conexão: Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
    } else if (error.name === 'SyntaxError') {
        userMessage = '❌ Erro de comunicação: Resposta inválida do servidor.';
    } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        userMessage = '❌ Erro de rede: Servidor indisponível. Tente novamente em alguns instantes.';
    } else if (error.message.includes('timeout')) {
        userMessage = '❌ Timeout: O servidor demorou muito para responder. Tente novamente.';
    } else if (error.message) {
        // Usar a mensagem de erro personalizada se disponível
        userMessage = `❌ ${error.message}`;
    } else {
        userMessage = `❌ Erro inesperado ${context}. Tente novamente ou entre em contato com o suporte.`;
    }
    
    // Adicionar informações técnicas em modo de desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        userMessage += `<br><small style="opacity: 0.7; font-size: 12px;">Detalhes técnicos: ${error.name}: ${error.message}</small>`;
    }
    
    showMessage(userMessage, 'error', 8000); // Mostra por 8 segundos para erros
}

// Função de login melhorada
async function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Desabilita o botão e mostra loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';

        const username = document.getElementById("loginUsuario").value.trim();
        const password = document.getElementById("loginSenha").value;

        // Validações do frontend
        if (!username || !password) {
            throw new Error("Por favor, preencha todos os campos obrigatórios.");
        }

        if (username.length < 3) {
            throw new Error("O nome de usuário deve ter pelo menos 3 caracteres.");
        }

        if (password.length < 6) {
            throw new Error("A senha deve ter pelo menos 6 caracteres.");
        }

        showMessage("🔄 Verificando credenciais...", 'info', 2000);

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Importante para cookies
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Tratar diferentes códigos de status HTTP
            if (response.status === 401) {
                throw new Error(data.message || "Credenciais inválidas. Verifique seu usuário e senha.");
            } else if (response.status === 500) {
                throw new Error("Erro interno do servidor. Tente novamente em alguns instantes.");
            } else if (response.status === 429) {
                throw new Error("Muitas tentativas de login. Aguarde alguns minutos antes de tentar novamente.");
            } else {
                throw new Error(data.message || `Erro HTTP ${response.status}: ${response.statusText}`);
            }
        }

        if (!data.success) {
            throw new Error(data.message || "Falha no login");
        }

        // Login bem-sucedido
        showMessage(`✅ Login realizado com sucesso! Bem-vindo, ${data.user.username}!`, 'success', 3000);
        
        // Aguarda um pouco para mostrar a mensagem antes de redirecionar
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);

    } catch (error) {
        showDetailedError(error, 'no login');
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Função de registro melhorada
async function handleRegister(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Desabilita o botão e mostra loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Cadastrando...';

        const username = document.getElementById("cadastroUsuario").value.trim();
        const email = document.getElementById("cadastroEmail").value.trim();
        const password = document.getElementById("cadastroSenha").value;

        // Validações do frontend
        if (!username || !password) {
            throw new Error("Nome de usuário e senha são obrigatórios.");
        }

        if (username.length < 3) {
            throw new Error("O nome de usuário deve ter pelo menos 3 caracteres.");
        }

        if (password.length < 6) {
            throw new Error("A senha deve ter pelo menos 6 caracteres.");
        }

        // Validação de email se fornecido
        if (email && !isValidEmail(email)) {
            throw new Error("Por favor, insira um email válido.");
        }

        // Validação de força da senha
        if (!isStrongPassword(password)) {
            throw new Error("A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número.");
        }

        showMessage("🔄 Criando sua conta...", 'info', 2000);

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Tratar diferentes códigos de status HTTP
            if (response.status === 409) {
                throw new Error(data.message || "Este nome de usuário já está em uso. Escolha outro.");
            } else if (response.status === 400) {
                throw new Error(data.message || "Dados inválidos. Verifique as informações fornecidas.");
            } else if (response.status === 500) {
                throw new Error("Erro interno do servidor. Tente novamente em alguns instantes.");
            } else {
                throw new Error(data.message || `Erro HTTP ${response.status}: ${response.statusText}`);
            }
        }

        if (!data.success) {
            throw new Error(data.message || "Falha no cadastro");
        }

        // Cadastro bem-sucedido
        showMessage("✅ Cadastro realizado com sucesso! Redirecionando para a página inicial...", 'success', 3000);
        
        // Aguarda um pouco antes de redirecionar
        setTimeout(() => {
            window.location.href = "/";
        }, 1500);

    } catch (error) {
        showDetailedError(error, 'no cadastro');
    } finally {
        // Reabilita o botão
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Funções auxiliares de validação
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isStrongPassword(password) {
    // Pelo menos 6 caracteres, uma maiúscula, uma minúscula e um número
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return strongPasswordRegex.test(password);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar event listeners aos formulários
    if (formLogin) {
        formLogin.addEventListener("submit", handleLogin);
    }

    if (formRegister) {
        formRegister.addEventListener("submit", handleRegister);
    }

    // Verificar se usuário já está logado
    checkAuthStatus();
});

// Função para verificar status de autenticação
async function checkAuthStatus() {
    try {
        const response = await fetch("/api/auth/status", {
            credentials: "include"
        });

        const data = await response.json();

        if (data.success && data.authenticated) {
            // Usuário já está logado, redirecionar para home
            showMessage(`ℹ️ Você já está logado como ${data.user.username}. Redirecionando...`, 'info', 3000);
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        }
    } catch (error) {
        // Ignora erros de verificação de status
        console.log("Não foi possível verificar status de autenticação:", error.message);
    }
}

// Função para logout (pode ser usada em outras páginas)
async function logout() {
    try {
        showMessage("🔄 Fazendo logout...", 'info', 2000);
        
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        const data = await response.json();

        if (data.success) {
            showMessage("✅ Logout realizado com sucesso!", 'success', 2000);
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } else {
            throw new Error(data.message || "Erro no logout");
        }
    } catch (error) {
        console.error("Erro no logout:", error);
        showMessage("⚠️ Erro no logout, mas você será redirecionado.", 'warning', 3000);
        // Mesmo com erro, redireciona para login
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
    }
}

// Exportar função de logout para uso global
window.logout = logout;

// Adicionar tratamento global de erros não capturados
window.addEventListener('error', function(event) {
    console.error('Erro JavaScript não capturado:', event.error);
    showMessage('❌ Ocorreu um erro inesperado na página. Recarregue a página e tente novamente.', 'error', 6000);
});

// Adicionar tratamento para promises rejeitadas não capturadas
window.addEventListener('unhandledrejection', function(event) {
    console.error('Promise rejeitada não capturada:', event.reason);
    showMessage('❌ Erro de comunicação não tratado. Verifique sua conexão e tente novamente.', 'error', 6000);
});

