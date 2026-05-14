/* =========================================
   SISTEMA SMACC LANCHES
========================================= */


/* =========================================
   ELEMENTOS
========================================= */

const carrinho = document.querySelector(".carrinho");

const botoesAdicionar = document.querySelectorAll(".card button");

const botoesCategorias = document.querySelectorAll(".categorias button");

const cards = document.querySelectorAll(".card");


/* =========================================
   CARRINHO
========================================= */

let quantidadeItens = 0;

let valorTotal = 0;

let pedidos = [];


/* =========================================
   FUNÇÃO ADICIONAR PRODUTO
========================================= */

function adicionarProduto(card){

    const nome = card.querySelector("h2").innerText;

    const precoTexto = card.querySelector("p:last-of-type")
    .innerText
    .replace("R$", "")
    .replace(",", ".")
    .trim();

    const preco = parseFloat(precoTexto);

    quantidadeItens++;

    valorTotal += preco;

    pedidos.push({
        nome,
        preco
    });

    atualizarCarrinho();

}


/* =========================================
   ATUALIZA CARRINHO
========================================= */

function atualizarCarrinho(){

    carrinho.innerHTML = `
        🛒 ${quantidadeItens}
        <span style="margin-left:8px;">
            R$ ${valorTotal.toFixed(2).replace(".", ",")}
        </span>
    `;

}


/* =========================================
   BOTÕES ADICIONAR
========================================= */

botoesAdicionar.forEach(botao => {

    botao.addEventListener("click", () => {

        const card = botao.closest(".card");

        adicionarProduto(card);


        /* ANIMAÇÃO */

        botao.innerHTML = "✔ Adicionado";

        botao.style.background = "#1f1f1f";

        botao.disabled = true;

        card.style.transform = "scale(1.01)";

        setTimeout(() => {

            botao.innerHTML = "Adicionar";

            botao.style.background = "#ff2e2e";

            botao.disabled = false;

            card.style.transform = "scale(1)";

        }, 700);

    });

});


/* =========================================
   HORÁRIO DA LOJA
========================================= */

function verificarHorario(){

    const agora = new Date();

    const hora = agora.getHours();

    const minutos = agora.getMinutes();


    /*
        HORÁRIO:

        abre 18:00
        fecha 01:00
    */


    const aberto =
        (hora >= 18 && hora <= 23) ||
        (hora === 0);


    if(!aberto){

        carrinho.innerHTML = "🔒 Fechado";

        carrinho.style.background = "#1f1f1f";

        carrinho.style.color = "white";


        botoesAdicionar.forEach(botao => {

            botao.disabled = true;

            botao.innerHTML = "Fechado";

            botao.style.background = "#777";

            botao.style.cursor = "not-allowed";

        });

    }

}

verificarHorario();


/* =========================================
   SCROLL DAS CATEGORIAS
========================================= */

const mapaCategorias = {

    "xis": ".xis",

    "mini xis": ".mini-xis",

    "dogs prensados": ".dogs-prensados",

    "pasteis": ".pasteis",

    "pasteis doces": ".pasteis-doces",

    "baurus": ".baurus",

    "hamburguers": ".hamburguers",

    "prensados": ".prensados",

    "a la minutas": ".a-la-minutas",

    "porcoes": ".porcoes",

    "bebidas": ".bebidas"

};


/* =========================================
   REMOVER ACENTOS
========================================= */

function normalizarTexto(texto){

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/* =========================================
   CLICK CATEGORIAS
========================================= */

botoesCategorias.forEach(botao => {

    botao.addEventListener("click", () => {

        /* REMOVE BOTÃO ATIVO */

        botoesCategorias.forEach(btn => {

            btn.style.background = "white";

            btn.style.color = "#ff2e2e";

        });


        /* BOTÃO ATIVO */

        botao.style.background = "#1f1f1f";

        botao.style.color = "white";


        /* PEGA CATEGORIA */

        const texto = normalizarTexto(botao.innerText);

        const seletor = mapaCategorias[texto];

        const secao = document.querySelector(seletor);


        if(secao){

            secao.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    });

});


/* =========================================
   ANIMAÇÃO DOS CARDS
========================================= */

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.style.opacity = "1";

            entry.target.style.transform = "translateY(0px)";

        }

    });

}, {
    threshold: 0.1
});


cards.forEach(card => {

    card.style.opacity = "0";

    card.style.transform = "translateY(30px)";

    card.style.transition = "0.5s";

    observer.observe(card);

});


/* =========================================
   EFEITO NO TOPO AO ROLAR
========================================= */

window.addEventListener("scroll", () => {

    const topo = document.querySelector(".topo");

    if(window.scrollY > 50){

        topo.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";

    }

    else{

        topo.style.boxShadow = "none";

    }

});


/* =========================================
   FINALIZAR PEDIDO NO WHATSAPP
========================================= */

carrinho.addEventListener("click", () => {

    if(pedidos.length === 0){

        alert("Seu carrinho está vazio.");

        return;

    }

    let mensagem = "🍔 *NOVO PEDIDO* %0A%0A";

    pedidos.forEach((pedido, index) => {

        mensagem += `${index + 1}. ${pedido.nome} - R$ ${pedido.preco.toFixed(2).replace(".", ",")}%0A`;

    });

    mensagem += `%0A💰 *Total:* R$ ${valorTotal.toFixed(2).replace(".", ",")}`;


    /*
        TROCA PELO NÚMERO DA LANCHERIA
    */

    const telefone = "5551997967718"

    const url = `https://wa.me/${telefone}?text=${mensagem}`;

    window.open(url, "_blank");

});