let cardContainer = document.querySelector(".card-container");
let campoBusca = document.getElementById("barra-busca");
let audioAtual = null;
let dados = [];


/* Para iniciar a página com todas as palavras */
buscar()


async function buscar() {

    if (dados.length === 0) {

        try {

            let resposta = await fetch("./storage/data.json");

            dados = await resposta.json();

        } catch (error) {

            console.error("Falha ao buscar dados:", error);
            
            return;
        }
    }

    const termo_busca = campoBusca.value.toLowerCase();

    const dados_filtrados = dados.filter(dado => dado.palavra.toLowerCase().includes(termo_busca));

    cards(dados_filtrados);
}


function cards(dados) {

    cardContainer.innerHTML = "";
    
    for (let dado of dados) {

        let traducao = {
            "palavra": [dado.en, dado.es, dado.ru],
            "flag": ["en", "es", "ru"],
            "alt-flag": ["do Reino Unido", "da Espanha", "da Rússia"]
        }

        cardCorpoHTML = `
            <img src="./assets/img/words/${dado.palavra}.jpg" alt="${capitalize(dado.palavra)}" class="main-image">
            <h2 class="main-title">${capitalize(dado.palavra)}</h2>
        `

        for (let i = 0; i < traducao["palavra"].length; i++) {

            cardConteudoHTML = `
                <div class="div-text">
                <img src="./assets/img/flags/${traducao["flag"][i]}.png" alt="Bandeira ${traducao["alt-flag"][i]}" class="flag">
                <span class="text">${capitalize(traducao["palavra"][i])}</span>
                <button class="audio-button" onclick="audio('${traducao["flag"][i]}', '${dado.palavra}')">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#5abae7">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
                </div>
            `

            cardCorpoHTML += cardConteudoHTML

        }

        let card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = cardCorpoHTML

        cardContainer.appendChild(card);
    }
}


function audio(idioma, palavra) {

    const caminho = `./assets/audio/${idioma}/${palavra}.ogg`;

    // 2. Verificação: Se já existe um áudio carregado na memória...
    if (audioAtual !== null) {
        audioAtual.pause();       // Para o som anterior
        audioAtual.currentTime = 0; // Rebobina para o início
    }

    // 3. Cria o novo áudio e atualiza a variável global
    audioAtual = new Audio(caminho);

    // 4. Toca o novo som
    audioAtual.play().catch(error => {
        console.error("Erro ao tocar áudio:", error);
        // Se der erro, limpamos a variável para não travar o próximo
        audioAtual = null; 
    });
}


function capitalize(string) {

  if (!string) return "";

  return string.charAt(0).toUpperCase() + string.slice(1);
}