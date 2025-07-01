// chatbot.js - Chatbot com IA para MakerMusic
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const chatMensagens = document.getElementById('chat-mensagens');
    const inputMensagem = document.getElementById('mensagem-chat');
    const btnEnviar = document.getElementById('enviar-chat');
    const toggleChatInfo = document.getElementById('toggle-chat-info');
    const chatInfo = document.getElementById('chat-info');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Base de conhecimento do chatbot
    const knowledgeBase = {
        "saudacao": {
            patterns: ["olá", "oi", "e aí", "tudo bem"],
            responses: [
                "Olá! Bem-vindo à MakerMusic. Meu nome é MakerBot e estou aqui para te ajudar com informações sobre nossos cursos, matrículas e tudo mais. Como posso te ajudar?",
                "Oi! Tudo bem com você? Sou o assistente virtual da MakerMusic. No que posso te ajudar hoje?",
                "Bom te ver por aqui! Sou o MakerBot e vou te auxiliar com todas as informações sobre nossa escola de música. Qual sua dúvida?"
            ]
        },
        "saudacao1": {
            patterns: ["bom dia", "boa tarde", "boa noite"],
            responses: [
                "Bom Dia!  Como posso te ajudar?",
                "Boa Tarde!  Como posso te ajudar?",
                "Bom Noite!  Como posso te ajudar?"
            ]
        },
        "cursos": {
            patterns: ["quais cursos", "o que oferecem", "tipos de aula", "opções de curso"],
            responses: [
                "Na MakerMusic oferecemos cursos completos de: \n- Violão (popular e clássico)\n- Guitarra (elétrica e acústica)\n- Piano e teclado\n- Bateria e percussão\n- Canto (popular, lírico e técnica vocal)\n- Teoria musical e harmonia\n- Produção musical e DJ\n\nQual desses mais te interessa? Posso detalhar qualquer um deles!",
                "Temos uma grade completa de cursos musicais para todos os níveis, desde iniciantes até avançados. Nossas principais opções são:\n\n• Instrumentos: violão, guitarra, piano, bateria, baixo, ukulele\n• Canto: técnica vocal, preparação para coral\n• Teoria: musicalização infantil, solfejo, harmonia\n• Produção: home studio, mixagem, mastering\n\nGostaria de saber mais sobre algum específico?"
            ]
        },
        "cursos1": {
            patterns: ["Bateria","bateria"],
            responses: [
                "Na MakerMusic oferecemos cursos completos de: \n-  Bateria e percussão\n- Acesse Cursos no Menu para mais detalhes sobre este curso"
            ]
        },
        "cursos2": {
            patterns: ["cantar","canto","voz"],
            responses: [
                "Na MakerMusic oferecemos cursos completos de: \n-  Canto (popular, lírico e técnica vocal)\n- Acesse Cursos no Menu para mais detalhes sobre este curso"
            ]
        },
        "cursos3": {
            patterns: ["Guitarra","guitarra"],
            responses: [
                "Na MakerMusic oferecemos cursos completos de: \n- Guitarra (elétrica e acústica)\n- Acesse Cursos no Menu para mais detalhes sobre este curso"
            ]
        },
        "cursos4": {
            patterns: ["Piano","piano","teclado"],
            responses: [
                "Na MakerMusic oferecemos cursos completos de: \n- Piano e teclado (elétrica e acústica)\n- Acesse Cursos no Menu para mais detalhes sobre este curso"
            ]
        },
        "cursos5": {
            patterns: ["Violao","violao","Violão"],
            responses: [
                "Na MakerMusic oferecemos cursos completos de: \n- Violão (popular e clássico)\n- Acesse Cursos no Menu para mais detalhes sobre este curso"
            ]
        },
        "cursos6": {
            patterns: ["Teoria musical","Musical"],
            responses: [
                "Na MakerMusic oferecemos cursos completos de: \n- Teoria musical e harmonia\n- Acesse Cursos no Menu para mais detalhes sobre este curso"
            ]
        },
        "cursos7": {
            patterns: ["Produçao musical","DJ"],
            responses: [
                "Na MakerMusic oferecemos cursos completos de: \n-  Produção musical e DJ\n- Acesse Cursos no Menu para mais detalhes sobre este curso"
            ]
        },
        "aula_experimental": {
            patterns: ["experimental", "aula experimental", "teste", "aula grátis", "aula teste"],
            responses: [
                "Oferecemos uma aula experimental gratuita para você conhecer nossa metodologia e professores! O agendamento é simples:\n\n1. Escolha o instrumento ou área de interesse\n2. Selecionamos um horário disponível\n3. Você vem conhecer nossa estrutura\n4. Após a aula, decidimos juntos os próximos passos.\n\nQuer que eu verifique os horários disponíveis?",
                "A aula experimental é perfeita para você sentir nossa didática e ambiente. Ela dura 30 minutos e você pode:\n✓ Conhecer o professor\n✓ Experimentar o instrumento\n✓ Tirar todas suas dúvidas\n✓ Entender nossa metodologia\n\nPosso te ajudar a agendar? Qual dia e horário prefere?"
            ]
        },
        "precos": {
            patterns: ["quanto custa", "qual o preço", "valor", "mensalidade", "preços"],
            responses: [
                "Nossos valores variam conforme o curso e modalidade:\n\n• Aulas individuais: R$ 250/mês (1 aula semanal)\n• Aulas em grupo: R$ 180/mês (2 aulas semanais)\n• Pacote família: 15% de desconto para 2+ matriculados\n• Pacotes trimestrais com 10% de desconto\n\nAtualmente temos uma promoção de matrícula gratuita para novos alunos! Quer saber mais detalhes?",
                "Temos opções para todos os bolsos:\n\n🔹 Modalidades:\n- Individual (R$ 250/mês)\n- Em dupla (R$ 200/mês por aluno)\n- Em grupo (R$ 180/mês)\n\n🔹 Planos especiais:\n- 2 cursos: 20% de desconto\n- Horários comerciais: 15% mais barato\n- Pagamento anual: 12% de desconto\n\nPosso te enviar nossa tabela completa por e-mail?"
            ]
        },
        "matricula": {
            patterns: ["como me matricular", "quero me matricular", "processo de matrícula", "documentos necessários", "requisitos"],
            responses: [
                "O processo de matrícula é simples e rápido:\n\n1. Agendamos sua aula experimental\n2. Após a aula, escolhemos o melhor plano\n3. Preenchemos o cadastro (RG, CPF e comprovante)\n4. Efetuamos o pagamento da matrícula\n5. Marcamos suas aulas regulares\n\nPrecisa de ajuda com algum desses passos?",
                "Para se matricular você precisará:\n✓ Documentos: RG, CPF e comprovante de residência\n✓ Idade mínima: 6 anos (para crianças, acompanhamento dos pais)\n✓ Nenhum conhecimento prévio é necessário\n\nOferecemos duas formas de matrícula:\n• Presencial: Venha conhecer nossa estrutura\n• Online: Pelo site com documentos digitalizados\n\nQual forma prefere?"
            ]
        },
        "pagamento": {
            patterns: ["formas de pagamento", "cartão", "boleto", "parcelamento", "pix"],
            responses: [
                "Aceitamos diversas formas de pagamento:\n\n💳 Cartões: crédito (até 12x) e débito\n📄 Boleto bancário (com 5% de desconto)\n💰 PIX (com 7% de desconto à vista)\n🏦 Transferência bancária\n\nPara pacotes semestrais/anuais oferecemos condições especiais! Posso te explicar melhor?",
                "Nossas opções de pagamento incluem:\n\n• À vista: 10% de desconto (PIX ou dinheiro)\n• Parcelado: em até 12x no cartão\n• Mensalidade: débito automático ou boleto\n\nTemos também programas de bolsas para alunos talentosos! Quer saber mais?"
            ]
        },
        "horarios": {
            patterns: ["horário de funcionamento", "quando estão abertos", "horário de aula", "turnos"],
            responses: [
                "Funcionamos com flexibilidade para atender você:\n\n⏰ Horário de atendimento:\n- Segunda a sexta: 8h às 20h\n- Sábados: 9h às 14h\n\n🎵 Horários de aula:\n- Manhã: 8h às 12h\n- Tarde: 14h às 18h\n- Noite: 19h às 21h\n\nTemos aulas aos sábados pela manhã também! Qual turno te interessa?",
                "Nossos horários são adaptáveis:\n\n• Para crianças: manhã e tarde\n• Para adultos: tarde e noite\n• Aulas em grupo: horários fixos\n• Aulas individuais: horários flexíveis\n\nEstamos abertos de segunda a sábado! Posso te ajudar a encontrar o melhor horário?"
            ]
        },
        "material": {
            patterns: ["preciso comprar instrumento", "material necessário", "o que trazer", "equipamento"],
            responses: [
                "Para começar nas aulas você precisará:\n\n• Instrumentos: Disponibilizamos para uso durante as aulas\n• Material didático: Fornecemos apostilas e partituras\n• Acessórios: Recomendamos adquirir conforme progresso\n\nNão é necessário comprar instrumento imediatamente! Temos parcerias com lojas para descontos quando você for adquirir.",
                "Na primeira aula você só precisa trazer:\n✓ Caderno para anotações\n✓ Água\n✓ Roupas confortáveis\n\nInstrumentos e equipamentos nós fornecemos para uso durante as aulas. Quando você estiver pronto para comprar seu próprio instrumento, nossos professores podem te orientar sobre os melhores modelos!"
            ]
        },
        "duvidas": {
            patterns: ["não sei tocar nada", "iniciante", "nunca estudei música", "idade para começar"],
            responses: [
                "Fique tranquilo(a)! Na MakerMusic:\n\n✅ Aceitamos alunos de todos os níveis\n✅ Método adaptado para iniciantes\n✅ Não precisa saber nada de música\n✅ Idade mínima: 6 anos (sem idade máxima)\n\nNossos professores são especializados em ensinar desde o zero. Vamos começar pelo básico no seu ritmo!",
                "Ótima notícia: você está no lugar certo para começar! Aqui na MakerMusic:\n\n• 70% dos nossos alunos começaram sem nenhum conhecimento\n• Temos método especial para iniciantes\n• Aulas personalizadas conforme seu ritmo\n• Nunca é tarde para começar - temos alunos de todas as idades\n\nQuer agendar sua aula experimental para ver como é?"
            ]
        },
        "professores": {
            patterns: ["quem são os professores", "professores", "instrutores", "qualificação"],
            responses: [
                "Nossa equipe é composta por:\n\n🎓 Professores formados em música\n🎤 Músicos atuantes no mercado\n👨‍🏫 Pedagogos musicais especializados\n\nTodos passam por:\n✓ Processo seletivo rigoroso\n✓ Treinamento contínuo\n✓ Avaliação periódica\n\nPosso te enviar os currículos completos dos professores do curso que te interessar?",
                "Orgulhamo-nos de nosso corpo docente:\n\n• 100% com formação superior em música\n• Média de 10 anos de experiência\n• Especializados em diferentes estilos\n• Constantemente atualizados\n\nTemos professores para todos os perfis: desde crianças até adultos, iniciantes até avançados! Quer saber sobre o professor de algum instrumento específico?"
            ]
        },
        "localizacao": {
            patterns: ["onde ficam", "endereço", "localização", "como chegar"],
            responses: [
                "Estamos localizados no coração de Guarulhos:\n\n📍 R. Força Pública, 89 - Centro, Guarulhos - SP\n\nFacilidades:\n✓ Próximo à estação do metrô\n✓ Estacionamento próprio gratuito\n✓ Acessibilidade para cadeirantes\n\nPosso te enviar um link com a rota exata a partir de sua localização?",
                "Nosso endereço completo é:\n\nMakerMusic Escola de Música\nR. Força Pública, 89 - Centro\nGuarulhos - SP, 07010-030\n\nHorário de atendimento presencial:\nSegunda a sexta: 9h-18h\nSábados: 9h-13h\n\nEstamos no 2º andar do Edifício Musical, com elevador. Temos sala de espera confortável para pais e acompanhantes!"
            ]
        },
        "contato": {
            patterns: ["telefone", "whatsapp", "contato", "falar com alguém", "email"],
            responses: [
                "Você pode nos contatar por:\n\n📞 Telefone fixo: (11) 2345-6789\n📱 WhatsApp: (11) 98765-4321 (clique para chamar)\n📧 Email: contato@makermusic.com.br\n\nAtendemos:\n• Segunda a sexta: 9h-18h\n• Sábados: 9h-13h\n\nPrecisa falar com algum setor específico?",
                "Nossos canais de atendimento:\n\n• WhatsApp: (11) 98765-4321 (resposta rápida)\n• Telefone: (11) 2345-6789\n• Email: contato@makermusic.com.br\n• Instagram: @MakerMusicOficial\n\nTambém temos atendimento presencial sem agendamento! Quer que eu te transfira para algum atendente específico?"
            ]
        },
        "default": {
            responses: [
                "Desculpe, não entendi completamente. Poderia reformular sua pergunta? Estou aqui para ajudar com informações sobre matrículas, cursos, preços e tudo mais sobre a MakerMusic!",
                "Interessante sua pergunta! Sobre qual aspecto específico você gostaria de saber mais? Cursos, matrículas, preços ou outra coisa?",
                "Posso te ajudar com:\n- Informações sobre cursos\n- Valores e formas de pagamento\n- Processo de matrícula\n- Horários disponíveis\n\nQual desses tópicos te interessa?"
            ]
        }
    };

    // Funções auxiliares
    function getHoraAtual() {
        const agora = new Date();
        return agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function adicionarMensagem(texto, isRecebida, remetente = 'Você') {
        const divMensagem = document.createElement('div');
        divMensagem.classList.add('mensagem');
        
        if (isRecebida) {
            divMensagem.classList.add('recebida');
            remetente = 'MakerBot';
        } else {
            divMensagem.classList.add('enviada');
        }
        
        divMensagem.innerHTML = `
            <div class="mensagem-conteudo">
                <div class="mensagem-cabecalho">
                    <span class="mensagem-remetente">${remetente}</span>
                    <span class="mensagem-horario">${getHoraAtual()}</span>
                </div>
                <p>${texto}</p>
            </div>
        `;
        
        chatMensagens.appendChild(divMensagem);
        chatMensagens.scrollTop = chatMensagens.scrollHeight;
    }

    function simularDigitacao(texto, callback) {
        let i = 0;
        const elementoTemp = document.createElement('div');
        elementoTemp.classList.add('mensagem', 'recebida', 'digitando');
        elementoTemp.innerHTML = `
            <div class="mensagem-conteudo">
                <div class="mensagem-cabecalho">
                    <span class="mensagem-remetente">MakerBot</span>
                    <span class="mensagem-horario">${getHoraAtual()}</span>
                </div>
                <p>Digitando...</p>
            </div>
        `;
        chatMensagens.appendChild(elementoTemp);
        chatMensagens.scrollTop = chatMensagens.scrollHeight;
        
        const intervalo = setInterval(() => {
            if (i < texto.length) {
                elementoTemp.querySelector('p').textContent = texto.substring(0, i+1);
                i++;
            } else {
                clearInterval(intervalo);
                setTimeout(() => {
                    chatMensagens.removeChild(elementoTemp);
                    callback();
                }, 300);
            }
        }, 30);
    }

    function processarMensagem(mensagem) {
        mensagem = mensagem.toLowerCase().trim();
        
        // Verifica se a mensagem corresponde a algum padrão conhecido
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (key !== 'default') {
                for (const pattern of value.patterns) {
                    if (mensagem.includes(pattern)) {
                        const respostaAleatoria = value.responses[Math.floor(Math.random() * value.responses.length)];
                        return respostaAleatoria;
                    }
                }
            }
        }
        
        // Se não encontrou correspondência, retorna uma resposta padrão
        const respostaPadrao = knowledgeBase.default.responses[
            Math.floor(Math.random() * knowledgeBase.default.responses.length)
        ];
        return respostaPadrao;
    }

    function enviarMensagem() {
        const texto = inputMensagem.value.trim();
        
        if (texto) {
            adicionarMensagem(texto, false);
            inputMensagem.value = '';
            
            setTimeout(() => {
                const resposta = processarMensagem(texto);
                
                simularDigitacao(resposta, () => {
                    adicionarMensagem(resposta, true, 'MakerBot');
                });
            }, 800);
        }
    }

    // Event Listeners
    btnEnviar.addEventListener('click', enviarMensagem);
    
    inputMensagem.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enviarMensagem();
        }
    });

    toggleChatInfo.addEventListener('click', () => {
        chatInfo.classList.toggle('active');
    });

    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            inputMensagem.value = question;
            enviarMensagem();
        });
    });

    // Mensagem inicial
    setTimeout(() => {
        simularDigitacao("Olá! Eu sou o MakerBot, assistente virtual da MakerMusic. Como posso te ajudar hoje?", () => {
            adicionarMensagem("Olá! Eu sou o MakerBot, assistente virtual da MakerMusic. Estou aqui para te ajudar com:\n\n• Informações sobre nossos cursos\n• Valores e formas de pagamento\n• Processo de matrícula\n• Agendamento de aulas experimentais\n• Dúvidas frequentes\n\nComo posso te ajudar hoje?", true, 'MakerBot');
        });
    }, 1500);
});