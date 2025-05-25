let gotas = [];
let numColunas = 180;
let tamanhoTexto = 18;
let corTexto = [255, 105, 180]; // Rosa choque para o texto (RGB)
let corCoracao = [255, 0, 100]; // Vermelho rosado para o coração

let coracaoPiscando = false;
let tempoPiscando = 0;
let duracaoPiscar = 200; // ms

// --- Novas variáveis para a explosão ---
let particulasExplosao = [];
let maxParticulasExplosao = 100; // Quantidade de "TE AMO" na explosão
let velocidadeExplosaoMin = 5;
let velocidadeExplosaoMax = 15;
let tempoVidaParticula = 120; // Tempo em frames que a partícula vive (aprox. 2 segundos a 60fps)

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    frameRate(60);

    for (let i = 0; i < numColunas; i++) {
        gotas.push(new Gota(i * (width / numColunas)));
    }
}

function draw() {
    background(0, 70); // Fundo semi-transparente para o rastro

    // Desenha e atualiza as gotas de chuva
    for (let gota of gotas) {
        gota.cair();
        gota.mostrar();
    }

    // Desenha o coração
    desenharCoracao();

    // Lógica para o coração piscar
    if (coracaoPiscando) {
        if (millis() - tempoPiscando > duracaoPiscar) {
            coracaoPiscando = false;
        }
    }

    // --- Atualiza e desenha as partículas de explosão ---
    for (let i = particulasExplosao.length - 1; i >= 0; i--) {
        let p = particulasExplosao[i];
        p.mover();
        p.mostrar();
        if (p.estaMorta()) {
            particulasExplosao.splice(i, 1); // Remove partículas mortas
        }
    }
}

// Classe para cada "gota" de texto (chuva)
class Gota {
    constructor(x) {
        this.x = x;
        this.y = random(-height * 8, 0);
        this.velocidade = random(8, 18);
        this.texto = "TE AMO";
    }

    cair() {
        this.y += this.velocidade;
        if (this.y > height) {
            this.y = random(-height * 8, 0);
            this.velocidade = random(8, 18);
        }
    }

    mostrar() {
        fill(corTexto[0], corTexto[1], corTexto[2]);
        noStroke();
        textSize(tamanhoTexto);
        text(this.texto, this.x, this.y);
    }
}

// --- NOVA CLASSE: Partícula para a explosão ---
class ParticulaExplosao {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocidadeX = random(-velocidadeExplosaoMax, velocidadeExplosaoMax);
        this.velocidadeY = random(-velocidadeExplosaoMax, velocidadeExplosaoMax);
        this.texto = "TE AMO";
        this.alpha = 255; // Transparência inicial
        this.tempoVida = tempoVidaParticula; // Contador de frames
        this.tamanho = random(tamanhoTexto * 0.8, tamanhoTexto * 1.5); // Tamanho variado
        this.cor = [255, random(50, 150), random(100, 200), this.alpha]; // Tons de rosa/roxo
    }

    mover() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
        // Diminui a velocidade ao longo do tempo (simula atrito/gravidade sutil)
        this.velocidadeX *= 0.98;
        this.velocidadeY *= 0.98;
        this.tempoVida--;
        this.alpha = map(this.tempoVida, 0, tempoVidaParticula, 0, 255); // Fade out
        this.cor[3] = this.alpha; // Atualiza a transparência da cor
    }

    mostrar() {
        fill(this.cor[0], this.cor[1], this.cor[2], this.cor[3]);
        noStroke();
        textSize(this.tamanho);
        text(this.texto, this.x, this.y);
    }

    estaMorta() {
        return this.tempoVida < 0;
    }
}


// FUNÇÃO DO CORAÇÃO MELHORADA: MAIOR PARA OS LADOS E MAIS REDONDO
function desenharCoracao() {
    // Aumentado para um coração maior e mais gordinho
    let tamanhoBase = width / 6; // Antes era width / 7

    let offset = sin(frameCount * 0.08) * 5;

    let corAtual = coracaoPiscando ? [255, 150, 200] : corCoracao;
    let escalaCoracao = coracaoPiscando ? 1.15 : 1.0;

    push();
    translate(width / 2, height / 2 + offset); // Move para o centro
    scale(escalaCoracao); // Aplica escala

    fill(corAtual[0], corAtual[1], corAtual[2]);
    noStroke();

    // Desenha o coração com novos pontos de controle para ser mais redondo e largo
    beginShape();
    vertex(0, tamanhoBase * 0.7); // Ponto inferior do coração, ligeiramente mais baixo para ser mais "gordinho"

    // Lado esquerdo do coração
    bezierVertex(
        -tamanhoBase * 1.0, -tamanhoBase * 0.3, // Ponto de controle 1 (mais largo para a esquerda)
        -tamanhoBase * 0.8, -tamanhoBase * 1.0, // Ponto de controle 2 (mais para cima e largo)
        0, -tamanhoBase * 0.5 // Ponto superior esquerdo (topo do arco esquerdo, mais arredondado)
    );

    // Lado direito do coração
    bezierVertex(
        tamanhoBase * 0.8, -tamanhoBase * 1.0, // Ponto de controle 3 (mais para cima e largo)
        tamanhoBase * 1.0, -tamanhoBase * 0.3, // Ponto de controle 4 (mais largo para a direita)
        0, tamanhoBase * 0.7 // Volta para o ponto inferior
    );
    endShape(CLOSE);

    pop();
}

function mousePressed() {
    coracaoPiscando = true;
    tempoPiscando = millis();

    // Dispara a explosão de "TE AMO" no centro do coração
    for (let i = 0; i < maxParticulasExplosao; i++) {
        particulasExplosao.push(new ParticulaExplosao(width / 2, height / 2));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    gotas = [];
    for (let i = 0; i < numColunas; i++) {
        gotas.push(new Gota(i * (width / numColunas)));
    }
    // As partículas de explosão não precisam ser recalculadas, pois são efêmeras.
}