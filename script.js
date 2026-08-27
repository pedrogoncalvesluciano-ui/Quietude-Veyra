(() => {

"use strict";


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const SAVE_KEY = "veyra_save_v4";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const miniCanvas = document.getElementById("miniCanvas");
const miniCtx = miniCanvas.getContext("2d");

const mapCanvas = document.getElementById("worldMapCanvas");
const mapCtx = mapCanvas.getContext("2d");


/* =========================================================
   TELAS
========================================================= */

const screens = {

    menu: document.getElementById("menuScreen"),

    how: document.getElementById("howScreen"),

    credits: document.getElementById("creditsScreen"),

    character: document.getElementById("characterScreen"),

    game: document.getElementById("gameScreen")

};


/* =========================================================
   PERSONAGENS
========================================================= */

const characters = [

    {
        id: "kaelion",
        name: "KAELION",
        className: "Mago",
        icon: "🧙",
        role: "Magia • Longo alcance",

        description:
            "Especialista em magia ofensiva. Grande energia e dano, porém pouca resistência.",

        hp: 85,
        energy: 140,
        speed: 175,
        damage: 22,

        color: "#9d83e7",
        bg: "rgba(122,91,202,.18)",
        glow: "rgba(157,131,231,.3)"
    },

    {
        id: "theron",
        name: "THERON",
        className: "Cavaleiro",
        icon: "🛡️",
        role: "Espada • Defesa",

        description:
            "Guerreiro resistente. Seus ataques são fortes e sua defesa é excelente.",

        hp: 140,
        energy: 90,
        speed: 145,
        damage: 20,

        color: "#bfc5ce",
        bg: "rgba(150,160,175,.15)",
        glow: "rgba(190,200,210,.25)"
    },

    {
        id: "grumgar",
        name: "GRUMGAR",
        className: "Troll",
        icon: "👹",
        role: "Força • Vida",

        description:
            "Uma criatura brutal com enorme quantidade de vida e dano físico.",

        hp: 175,
        energy: 70,
        speed: 110,
        damage: 28,

        color: "#72a566",
        bg: "rgba(70,120,70,.18)",
        glow: "rgba(100,160,90,.3)"
    },

    {
        id: "lirael",
        name: "LIRAEL",
        className: "Fada",
        icon: "🧚",
        role: "Velocidade • Cura",

        description:
            "Extremamente rápida. Consegue recuperar parte de sua vida durante a aventura.",

        hp: 95,
        energy: 130,
        speed: 210,
        damage: 17,

        color: "#e19bd9",
        bg: "rgba(200,100,190,.18)",
        glow: "rgba(225,155,217,.3)"
    },

    {
        id: "zephyr",
        name: "ZEPHYR",
        className: "Transmorfo",
        icon: "🦊",
        role: "Adaptação • Equilíbrio",

        description:
            "Equilibrado e imprevisível. Consegue se adaptar a diferentes situações.",

        hp: 115,
        energy: 110,
        speed: 170,
        damage: 21,

        color: "#d89c61",
        bg: "rgba(200,130,70,.18)",
        glow: "rgba(216,156,97,.3)"
    }

];


/* =========================================================
   ÁREAS
========================================================= */

const areas = {

    village: {
        name: "VILA PRINCIPAL",
        width: 3200,
        height: 2200,
        sky: false
    },

    sky: {
        name: "REINO DOS CÉUS",
        width: 3600,
        height: 2400,
        sky: true
    },

    cave: {
        name: "CAVERNA",
        width: 2800,
        height: 1900,
        cave: true
    },

    ruby: {
        name: "CAVERNA DE RUBI",
        width: 3000,
        height: 2100,
        ruby: true
    },

    hell: {
        name: "INFERNO",
        width: 3600,
        height: 2300,
        hell: true
    }

};


/* =========================================================
   ESTADO
========================================================= */

const state = {

    selectedCharacter: characters[0],

    player: null,

    keys: new Set(),

    lastTime: 0,

    running: false,

    area: "village",

    camera: {
        x: 0,
        y: 0
    },

    world: {

        width: 3200,
        height: 2200,

        obstacles: [],

        buildings: [],

        decorations: [],

        trees: [],

        npcs: [],

        enemies: [],

        drops: [],

        portals: []

    },

    inventory: {

        madeira: 0,

        pedra: 0,

        erva: 0,

        cristal: 0,

        rubi: 0,

        essencia: 0,

        pocao: 0

    },

    progression: {

        guardianDefeated: false,

        skyDefeated: false,

        caveDefeated: false,

        rubyDefeated: false,

        hellDefeated: false

    },

    dialogue: {

        active: false,

        speaker: "",

        lines: [],

        index: 0,

        typing: false,

        charIndex: 0,

        timer: null

    },

    travel: null,

    specialBattle: null,

    toastTimer: null

};


/* =========================================================
   UTILIDADES
========================================================= */

function distance(a, b) {

    return Math.hypot(
        a.x - b.x,
        a.y - b.y
    );

}


function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


function random(min, max) {

    return Math.random() * (max - min) + min;

}


function randomInt(min, max) {

    return Math.floor(
        random(min, max + 1)
    );

}


/* =========================================================
   TELAS
========================================================= */

function showScreen(name) {

    Object.values(screens).forEach(screen => {

        screen.classList.remove("active");

    });

    screens[name].classList.add("active");

}


/* =========================================================
   PERSONAGENS
========================================================= */

function createCharacterCards() {

    const container =
        document.getElementById("characterCards");

    container.innerHTML = "";

    characters.forEach((character, index) => {

        const card =
            document.createElement("button");

        card.type = "button";

        card.className =
            "character-card" +
            (index === 0 ? " selected" : "");

        card.style.setProperty(
            "--char-color",
            character.color
        );

        card.style.setProperty(
            "--char-bg",
            character.bg
        );

        card.style.setProperty(
            "--char-glow",
            character.glow
        );

        card.innerHTML = `

            <div class="char-art">
                ${character.icon}
            </div>

            <h3>
                ${character.name}
            </h3>

            <p class="role">
                ${character.className}
                —
                ${character.role}
            </p>

            <p>
                ${character.description}
            </p>

            <p>
                ❤️ ${character.hp}
                •
                ⚡ ${character.energy}
            </p>

            <p>
                ⚔ ${character.damage}
                •
                🏃 ${character.speed}
            </p>

        `;

        card.addEventListener(
            "click",
            () => {

                state.selectedCharacter =
                    character;

                document
                    .querySelectorAll(".character-card")
                    .forEach(c => {

                        c.classList.remove(
                            "selected"
                        );

                    });

                card.classList.add("selected");

            }
        );

        container.appendChild(card);

    });

}


/* =========================================================
   CANVAS
========================================================= */

function resizeCanvas() {

    const ratio =
        window.devicePixelRatio || 1;

    canvas.width =
        Math.floor(
            window.innerWidth * ratio
        );

    canvas.height =
        Math.floor(
            window.innerHeight * ratio
        );

    canvas.style.width =
        window.innerWidth + "px";

    canvas.style.height =
        window.innerHeight + "px";

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

}


/* =========================================================
   NOVO JOGO
========================================================= */

function startNewGame() {

    document.getElementById(
        "playerName"
    ).value = "";

    document.getElementById(
        "nameError"
    ).textContent = "";

    state.selectedCharacter =
        characters[0];

    document
        .querySelectorAll(".character-card")
        .forEach((card, index) => {

            card.classList.toggle(
                "selected",
                index === 0
            );

        });

    showScreen("character");

    setTimeout(() => {

        document
            .getElementById("playerName")
            .focus();

    }, 100);

}


/* =========================================================
   CRIAR JOGADOR
========================================================= */

function createNewPlayer(
    name,
    character
) {

    state.player = {

        name,

        characterId:
            character.id,

        className:
            character.className,

        icon:
            character.icon,

        x: 1600,

        y: 1250,

        radius: 18,

        hp: character.hp,

        maxHp: character.hp,

        energy: character.energy,

        maxEnergy: character.energy,

        speed: character.speed,

        damage: character.damage,

        level: 1,

        xp: 0,

        xpToNext: 100,

        money: 0,

        color: character.color,

        attackCooldown: 0,

        invincible: 0

    };

}


/* =========================================================
   COMEÇAR
========================================================= */

function beginGame() {

    const input =
        document.getElementById(
            "playerName"
        );

    const name =
        input.value.trim();

    if (name.length < 2) {

        document.getElementById(
            "nameError"
        ).textContent =
            "Digite um nome com pelo menos 2 caracteres.";

        input.focus();

        return;

    }

    createNewPlayer(
        name,
        state.selectedCharacter
    );

    state.area = "village";

    state.progression = {

        guardianDefeated: false,
        skyDefeated: false,
        caveDefeated: false,
        rubyDefeated: false,
        hellDefeated: false

    };

    state.inventory = {

        madeira: 0,
        pedra: 0,
        erva: 0,
        cristal: 0,
        rubi: 0,
        essencia: 0,
        pocao: 0

    };

    buildWorld();

    updateHUD();

    showScreen("game");

    state.running = true;

    state.lastTime =
        performance.now();

    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   CONSTRUIR MUNDO
========================================================= */

function buildWorld() {

    const world =
        state.world;

    const area =
        areas[state.area];

    world.width =
        area.width;

    world.height =
        area.height;

    world.obstacles = [];
    world.buildings = [];
    world.decorations = [];
    world.trees = [];
    world.npcs = [];
    world.enemies = [];
    world.drops = [];
    world.portals = [];


    /* =====================================================
       LIMITES
    ====================================================== */

    world.obstacles.push(

        {
            x: 0,
            y: 0,
            w: world.width,
            h: 80,
            type: "wall"
        },

        {
            x: 0,
            y: world.height - 80,
            w: world.width,
            h: 80,
            type: "wall"
        },

        {
            x: 0,
            y: 0,
            w: 80,
            h: world.height,
            type: "wall"
        },

        {
            x: world.width - 80,
            y: 0,
            w: 80,
            h: world.height,
            type: "wall"
        }

    );


    /* =====================================================
       ÁREAS ESPECIAIS
    ====================================================== */

    if (state.area === "village") {

        buildVillage();

    }

    if (state.area === "sky") {

        buildSky();

    }

    if (state.area === "cave") {

        buildCave(false);

    }

    if (state.area === "ruby") {

        buildCave(true);

    }

    if (state.area === "hell") {

        buildHell();

    }


    updateAreaName();

}


/* =========================================================
   VILA
========================================================= */

function buildVillage() {

    const buildings = [

        {
            x: 260,
            y: 270,
            w: 430,
            h: 270,
            name: "CASA DO AVENTUREIRO",
            roof: "#70483a",
            color: "#ad835e",
            interior: "casa"
        },

        {
            x: 850,
            y: 250,
            w: 350,
            h: 260,
            name: "CASA DE ELIAN",
            roof: "#59463a",
            color: "#b48a61",
            interior: "elian"
        },

        {
            x: 2070,
            y: 270,
            w: 500,
            h: 310,
            name: "FORJA DO FERREIRO",
            roof: "#44413e",
            color: "#867b6e",
            interior: "forge"
        },

        {
            x: 2500,
            y: 1260,
            w: 430,
            h: 300,
            name: "LOJA DE DORAN",
            roof: "#654434",
            color: "#b1875e",
            interior: "shop"
        },

        {
            x: 390,
            y: 1570,
            w: 460,
            h: 300,
            name: "CARPINTARIA",
            roof: "#735638",
            color: "#a77b4e",
            interior: "wood"
        }

    ];


    buildings.forEach(
        building => {

            state.world.buildings
                .push(building);

            state.world.obstacles.push({

                x: building.x,

                y: building.y,

                w: building.w,

                h: building.h,

                type: "building",

                building

            });

        }
    );


    /* =====================================================
       FONTE
    ====================================================== */

    state.world.obstacles.push({

        x: 1470,

        y: 870,

        w: 260,

        h: 210,

        type: "fountain"

    });


    /* =====================================================
       PEDRAS
    ====================================================== */

    const rocks = [

        [950, 760],
        [1100, 730],
        [1220, 1780],
        [1850, 1650],
        [2200, 940],
        [2750, 850],
        [650, 1150],
        [2380, 1830]

    ];

    rocks.forEach(
        ([x, y]) => {

            state.world.obstacles.push({

                x: x - 30,
                y: y - 23,
                w: 60,
                h: 46,
                type: "rock"

            });

        }
    );


    /* =====================================================
       ÁRVORES
    ====================================================== */

    const trees = [

        [180, 180],
        [390, 170],
        [650, 170],
        [940, 150],
        [1320, 170],
        [1750, 160],
        [2150, 160],
        [2600, 170],
        [2950, 180],

        [160, 700],
        [170, 1050],
        [200, 1450],

        [260, 1950],
        [1050, 2000],
        [1500, 1980],
        [1950, 2010],
        [2400, 2020],
        [2850, 1950],

        [3050, 1700],
        [3030, 1200],
        [3010, 650],

        [2850, 1050],
        [2150, 750],
        [1900, 750],
        [1150, 1000]

    ];

    trees.forEach(
        ([x, y], index) => {

            addTree(
                x,
                y,
                index
            );

        }
    );


    /* =====================================================
       NPCS
    ====================================================== */

    state.world.npcs.push(

        {
            x: 1030,
            y: 620,
            name: "ELIAN",
            role: "Morador",
            color: "#d4b27c",

            quietude: [
                "Você sente isso? A floresta ficou silenciosa demais.",
                "A Quietude chegou primeiro pelos campos. As plantas pararam de cantar.",
                "Meu avô dizia que a Quietude não é ausência de som. É ausência de vida.",
                "Há algo observando a vila. Eu sinto isso todas as noites."
            ]

        },

        {
            x: 1940,
            y: 1060,
            name: "MARA",
            role: "Moradora",
            color: "#b98bc4",

            quietude: [
                "Quando a Quietude chegou, os sinos da praça pararam.",
                "Eu vi uma sombra caminhando contra o vento.",
                "Não confie nas regiões onde nem os animais fazem barulho.",
                "A Quietude parece aprender com quem tenta enfrentá-la."
            ]

        },

        {
            x: 2700,
            y: 1130,
            name: "DORAN",
            role: "Comerciante",
            color: "#c58a54",

            quietude: [
                "Mercadoria desapareceu. Pessoas desapareceram. E ninguém sabe explicar.",
                "Tenho viajado muito. Cada região tem uma versão diferente da história.",
                "Alguns dizem que a Quietude nasceu no céu.",
                "Se quiser sobreviver, carregue recursos. Nunca se sabe quando uma estrada vai fechar."
            ]

        },

        {
            x: 1050,
            y: 1420,
            name: "BRAN",
            role: "Carpinteiro",
            color: "#8d7053",

            quietude: [
                "As árvores estão diferentes. Algumas crescem mesmo sem receber luz.",
                "Madeira de árvores tocadas pela Quietude não se comporta normalmente.",
                "Ouvi algo enorme perto da estrada leste.",
                "Se encontrar o Guardião, pense antes de lutar."
            ]

        }

    );


    /* =====================================================
       GUARDIÃO
    ====================================================== */

    addEnemy({

        id: "village_guardian",

        x: 2860,

        y: 1090,

        name: "GUARDIÃO DO PORTAL",

        type: "guardian",

        hp: 260,

        maxHp: 260,

        damage: 18,

        speed: 75,

        vision: 260,

        radius: 27,

        color: "#8e5960",

        drop: "cristal"

    });


    /* =====================================================
       INIMIGOS NORMAIS
    ====================================================== */

    addEnemy({

        id: "slime1",

        x: 1250,

        y: 700,

        name: "LIMO SOMBRIO",

        type: "beast",

        hp: 55,

        maxHp: 55,

        damage: 8,

        speed: 65,

        vision: 190,

        radius: 18,

        color: "#739d68",

        drop: "erva"

    });

    addEnemy({

        id: "wolf1",

        x: 2200,

        y: 1450,

        name: "LOBO DA QUIETUDE",

        type: "beast",

        hp: 75,

        maxHp: 75,

        damage: 12,

        speed: 105,

        vision: 240,

        radius: 21,

        color: "#777887",

        drop: "pedra"

    });


    /* =====================================================
       PORTAL LESTE
    ====================================================== */

    state.world.portals.push({

        x: 3120,

        y: 1050,

        w: 80,

        h: 220,

        target: "sky",

        requirement: "guardianDefeated",

        title: "REINO DOS CÉUS"

    });

}


/* =========================================================
   CÉU
========================================================= */

function buildSky() {

    state.player.x = 180;
    state.player.y = 1200;

    addEnemy({

        id: "sky_guardian",

        x: 3000,

        y: 1150,

        name: "SERAFIM DA QUIETUDE",

        type: "guardian",

        hp: 420,

        maxHp: 420,

        damage: 25,

        speed: 80,

        vision: 300,

        radius: 30,

        color: "#c7b4d7",

        drop: "essencia"

    });


    addEnemy({

        id: "cloud_beast",

        x: 1400,

        y: 850,

        name: "FERA CELESTIAL",

        type: "beast",

        hp: 110,

        maxHp: 110,

        damage: 15,

        speed: 95,

        vision: 220,

        radius: 23,

        color: "#a9bacb",

        drop: "cristal"

    });


    addEnemy({

        id: "cloud_beast2",

        x: 2200,

        y: 1550,

        name: "ESPÍRITO DO VENTO",

        type: "beast",

        hp: 100,

        maxHp: 100,

        damage: 14,

        speed: 115,

        vision: 230,

        radius: 20,

        color: "#9cc4d2",

        drop: "essencia"

    });


    state.world.portals.push({

        x: 3400,

        y: 1050,

        w: 100,

        h: 250,

        target: "cave",

        requirement: "skyDefeated",

        title: "CAVERNA"

    });

}


/* =========================================================
   CAVERNA
========================================================= */

function buildCave(ruby) {

    state.player.x = 180;
    state.player.y = 950;

    addEnemy({

        id: ruby
            ? "ruby_guardian"
            : "cave_guardian",

        x: 2400,

        y: 950,

        name: ruby
            ? "GUARDIÃO RUBI"
            : "GUARDIÃO DA CAVERNA",

        type: "guardian",

        hp: ruby ? 620 : 500,

        maxHp: ruby ? 620 : 500,

        damage: ruby ? 30 : 27,

        speed: 65,

        vision: 330,

        radius: 32,

        color: ruby
            ? "#b84955"
            : "#5d626c",

        drop: ruby
            ? "rubi"
            : "cristal"

    });


    for (let i = 0; i < 7; i++) {

        addEnemy({

            id: "cave_beast_" + i,

            x: randomInt(500, 2100),

            y: randomInt(300, 1600),

            name: ruby
                ? "CRIATURA RUBI"
                : "CRIATURA DA CAVERNA",

            type: "beast",

            hp: ruby ? 150 : 125,

            maxHp: ruby ? 150 : 125,

            damage: ruby ? 18 : 15,

            speed: 80,

            vision: 210,

            radius: 23,

            color: ruby
                ? "#9d424c"
                : "#5d685f",

            drop: ruby
                ? "rubi"
                : "pedra"

        });

    }


    state.world.portals.push({

        x: ruby ? 2900 : 2700,

        y: 800,

        w: 100,

        h: 300,

        target: ruby
            ? "hell"
            : "ruby",

        requirement: ruby
            ? "rubyDefeated"
            : "caveDefeated",

        title: ruby
            ? "INFERNO"
            : "CAVERNA DE RUBI"

    });

}


/* =========================================================
   INFERNO
========================================================= */

function buildHell() {

    state.player.x = 180;
    state.player.y = 1150;

    addEnemy({

        id: "hell_guardian",

        x: 3000,

        y: 1100,

        name: "SENHOR DA QUIETUDE",

        type: "guardian",

        hp: 900,

        maxHp: 900,

        damage: 38,

        speed: 75,

        vision: 380,

        radius: 38,

        color: "#a63d38",

        drop: "essencia"

    });


    for (let i = 0; i < 10; i++) {

        addEnemy({

            id: "demon_" + i,

            x: randomInt(500, 2600),

            y: randomInt(300, 1900),

            name: "CRIATURA DO VAZIO",

            type: "beast",

            hp: 180,

            maxHp: 180,

            damage: 23,

            speed: 90,

            vision: 260,

            radius: 25,

            color: "#713e47",

            drop: "essencia"

        });

    }


    state.world.portals = [];

}


/* =========================================================
   ÁRVORES
========================================================= */

function addTree(x, y, id) {

    const tree = {

        id,

        x,

        y,

        alive: true,

        respawn: 0

    };

    state.world.trees.push(tree);

    state.world.obstacles.push({

        x: x - 28,

        y: y - 35,

        w: 56,

        h: 70,

        type: "tree",

        tree

    });

}


/* =========================================================
   INIMIGOS
========================================================= */

function addEnemy(enemy) {

    enemy.state = "idle";

    enemy.target = null;

    enemy.attackCooldown = 0;

    enemy.hitFlash = 0;

    enemy.dead = false;

    state.world.enemies.push(enemy);

}


/* =========================================================
   COLISÃO
========================================================= */

function circleRectCollision(
    cx,
    cy,
    radius,
    rect
) {

    const closestX =
        clamp(
            cx,
            rect.x,
            rect.x + rect.w
        );

    const closestY =
        clamp(
            cy,
            rect.y,
            rect.y + rect.h
        );

    const dx =
        cx - closestX;

    const dy =
        cy - closestY;

    return (
        dx * dx +
        dy * dy
    ) < radius * radius;

}


function isBlocked(
    x,
    y,
    radius,
    ignoreNPC = false
) {

    return state.world.obstacles.some(
        obstacle => {

            if (
                obstacle.type === "tree" &&
                obstacle.tree &&
                !obstacle.tree.alive
            ) {
                return false;
            }

            return circleRectCollision(
                x,
                y,
                radius,
                obstacle
            );

        }
    );

}


/* =========================================================
   MOVIMENTO COM COLISÃO
========================================================= */

function movePlayer(dx, dy, distanceToMove) {

    const player =
        state.player;

    if (!player) return;

    if (
        dx === 0 &&
        dy === 0
    ) {
        return;
    }

    const length =
        Math.hypot(dx, dy);

    dx /= length;
    dy /= length;

    const step =
        distanceToMove;

    const nextX =
        player.x +
        dx * step;

    if (
        !isBlocked(
            nextX,
            player.y,
            player.radius
        )
    ) {

        player.x =
            nextX;

    }

    const nextY =
        player.y +
        dy * step;

    if (
        !isBlocked(
            player.x,
            nextY,
            player.radius
        )
    ) {

        player.y =
            nextY;

    }

    player.x =
        clamp(
            player.x,
            100,
            state.world.width - 100
        );

    player.y =
        clamp(
            player.y,
            100,
            state.world.height - 100
        );

}


/* =========================================================
   ATUALIZAR JOGADOR
========================================================= */

function updatePlayer(dt) {

    const player =
        state.player;

    if (!player) return;

    let dx = 0;
    let dy = 0;

    if (
        state.keys.has("w") ||
        state.keys.has("arrowup")
    ) {
        dy--;
    }

    if (
        state.keys.has("s") ||
        state.keys.has("arrowdown")
    ) {
        dy++;
    }

    if (
        state.keys.has("a") ||
        state.keys.has("arrowleft")
    ) {
        dx--;
    }

    if (
        state.keys.has("d") ||
        state.keys.has("arrowright")
    ) {
        dx++;
    }

    movePlayer(
        dx,
        dy,
        player.speed * dt
    );


    player.energy =
        Math.min(
            player.maxEnergy,
            player.energy +
            4 * dt
        );


    player.attackCooldown =
        Math.max(
            0,
            player.attackCooldown - dt
        );


    player.invincible =
        Math.max(
            0,
            player.invincible - dt
        );


    /* =====================================================
       CURA DA LIRAEL
    ====================================================== */

    if (
        player.characterId === "lirael" &&
        player.hp > 0
    ) {

        player.hp =
            Math.min(
                player.maxHp,
                player.hp + .8 * dt
            );

    }

}


/* =========================================================
   IA DOS INIMIGOS
========================================================= */

function updateEnemies(dt) {

    const player =
        state.player;

    state.world.enemies
        .forEach(enemy => {

            if (enemy.dead) {
                return;
            }

            enemy.attackCooldown =
                Math.max(
                    0,
                    enemy.attackCooldown - dt
                );

            enemy.hitFlash =
                Math.max(
                    0,
                    enemy.hitFlash - dt
                );

            const dist =
                distance(
                    enemy,
                    player
                );


            /* =================================================
               INIMIGO ESPECIAL
            ================================================= */

            if (
                enemy.type === "guardian" &&
                !enemy.accepted
            ) {

                if (
                    dist <
                    enemy.radius + 55
                ) {

                    enemy.state =
                        "waiting";

                }

                return;

            }


            /* =================================================
               RAIO DE VISÃO
            ================================================= */

            if (
                enemy.state === "idle" &&
                dist <= enemy.vision
            ) {

                enemy.state =
                    "chasing";

                enemy.target =
                    player;

                showToast(
                    enemy.name +
                    " percebeu você!"
                );

            }


            /* =================================================
               PERSEGUIÇÃO
            ================================================= */

            if (
                enemy.state === "chasing"
            ) {

                if (
                    dist >
                    enemy.vision * 1.8
                ) {

                    enemy.state =
                        "idle";

                    enemy.target =
                        null;

                    return;

                }

                let dx =
                    player.x -
                    enemy.x;

                let dy =
                    player.y -
                    enemy.y;

                const len =
                    Math.hypot(
                        dx,
                        dy
                    );

                if (len > enemy.radius + player.radius + 5) {

                    dx /= len;
                    dy /= len;

                    const nx =
                        enemy.x +
                        dx *
                        enemy.speed *
                        dt;

                    const ny =
                        enemy.y +
                        dy *
                        enemy.speed *
                        dt;

                    if (
                        !isBlocked(
                            nx,
                            enemy.y,
                            enemy.radius
                        )
                    ) {

                        enemy.x =
                            nx;

                    }

                    if (
                        !isBlocked(
                            enemy.x,
                            ny,
                            enemy.radius
                        )
                    ) {

                        enemy.y =
                            ny;

                    }

                } else {

                    enemyAttack(
                        enemy
                    );

                }

            }

        });

}


/* =========================================================
   ATAQUE DO INIMIGO
========================================================= */

function enemyAttack(enemy) {

    const player =
        state.player;

    if (
        enemy.attackCooldown > 0
    ) {
        return;
    }

    if (
        player.invincible > 0
    ) {
        return;
    }

    player.hp =
        Math.max(
            0,
            player.hp -
            enemy.damage
        );

    player.invincible =
        .7;

    enemy.attackCooldown =
        1.2;

    showToast(
        `${enemy.name} atacou você!`
    );

    if (
        player.hp <= 0
    ) {

        player.hp =
            player.maxHp;

        player.x = 1600;
        player.y = 1250;

        showToast(
            "Você desmaiou e voltou para a vila."
        );

        if (
            state.area !== "village"
        ) {

            changeArea(
                "village"
            );

        }

    }

}


/* =========================================================
   ATAQUE DO JOGADOR
========================================================= */

function playerAttack() {

    const player =
        state.player;

    if (!player) return;

    if (
        player.attackCooldown > 0
    ) {
        return;
    }

    if (
        player.energy < 8
    ) {

        showToast(
            "Energia insuficiente."
        );

        return;

    }


    player.energy -= 8;

    player.attackCooldown =
        .45;


    let target = null;

    let bestDistance =
        Infinity;


    state.world.enemies
        .forEach(enemy => {

            if (enemy.dead) {
                return;
            }

            const d =
                distance(
                    player,
                    enemy
                );

            if (
                d < 100 &&
                d < bestDistance
            ) {

                bestDistance =
                    d;

                target =
                    enemy;

            }

        });


    if (!target) {

        /* =================================================
           HABILIDADE SEM ALVO
        ================================================= */

        if (
            player.characterId === "lirael"
        ) {

            player.hp =
                Math.min(
                    player.maxHp,
                    player.hp + 15
                );

            showToast(
                "Lirael canalizou energia de cura."
            );

        } else {

            showToast(
                "Você usou sua habilidade."
            );

        }

        return;

    }


    target.hp -=
        player.damage;

    target.hitFlash =
        .2;

    target.state =
        "chasing";

    target.accepted =
        true;

    showToast(
        `Você atacou ${target.name}!`
    );


    if (
        target.hp <= 0
    ) {

        killEnemy(
            target
        );

    }

}


/* =========================================================
   MORTE DO INIMIGO
========================================================= */

function killEnemy(enemy) {

    if (enemy.dead) {
        return;
    }

    enemy.dead = true;

    enemy.state =
        "dead";


    const player =
        state.player;


    /* =====================================================
       XP
    ====================================================== */

    const xp =
        enemy.type === "guardian"
            ? 100
            : 30;

    player.xp +=
        xp;

    player.money +=
        enemy.type === "guardian"
            ? 50
            : 8;


    /* =====================================================
       DROP
    ====================================================== */

    state.world.drops.push({

        x: enemy.x,

        y: enemy.y,

        type: enemy.drop,

        amount:
            enemy.type === "guardian"
                ? 3
                : 1,

        life: 30

    });


    showToast(
        `${enemy.name} derrotado! +${xp} XP`
    );


    /* =====================================================
       PROGRESSÃO
    ====================================================== */

    if (
        enemy.type === "guardian"
    ) {

        if (
            enemy.id ===
            "village_guardian"
        ) {

            state.progression
                .guardianDefeated =
                true;

            showToast(
                "O caminho para o Reino dos Céus foi aberto."
            );

        }

        if (
            enemy.id ===
            "sky_guardian"
        ) {

            state.progression
                .skyDefeated =
                true;

        }

        if (
            enemy.id ===
            "cave_guardian"
        ) {

            state.progression
                .caveDefeated =
                true;

        }

        if (
            enemy.id ===
            "ruby_guardian"
        ) {

            state.progression
                .rubyDefeated =
                true;

        }

        if (
            enemy.id ===
            "hell_guardian"
        ) {

            state.progression
                .hellDefeated =
                true;

            showToast(
                "A Quietude foi finalmente confrontada."
            );

        }

    }


    checkLevelUp();

}


/* =========================================================
   LEVEL UP
========================================================= */

function checkLevelUp() {

    const player =
        state.player;

    while (
        player.xp >=
        player.xpToNext
    ) {

        player.xp -=
            player.xpToNext;

        player.level++;

        player.xpToNext =
            Math.floor(
                player.xpToNext * 1.45
            );

        player.maxHp +=
            15;

        player.maxEnergy +=
            10;

        player.damage +=
            3;

        player.hp =
            player.maxHp;

        player.energy =
            player.maxEnergy;

        showToast(
            `Você alcançou o nível ${player.level}!`
        );

    }

}


/* =========================================================
   COLETAR DROPS
========================================================= */

function updateDrops(dt) {

    state.world.drops
        .forEach(drop => {

            drop.life -=
                dt;

            if (
                drop.life <= 0
            ) {
                return;
            }

            if (
                distance(
                    drop,
                    state.player
                ) < 35
            ) {

                state.inventory[
                    drop.type
                ] =
                    (
                        state.inventory[
                            drop.type
                        ] || 0
                    ) +
                    drop.amount;

                drop.life = 0;

                showToast(
                    `Você encontrou ${drop.amount} ${itemName(drop.type)}.`
                );

            }

        });

}


/* =========================================================
   ÁRVORES
========================================================= */

function updateTrees(dt) {

    state.world.trees
        .forEach(tree => {

            if (
                !tree.alive
            ) {

                tree.respawn -=
                    dt;

                if (
                    tree.respawn <= 0
                ) {

                    respawnTree(
                        tree
                    );

                }

            }

        });

}


function harvestTree(tree) {

    if (
        !tree.alive
    ) {
        return;
    }

    tree.alive =
        false;

    tree.respawn =
        random(
            12,
            25
        );

    state.inventory.madeira +=
        randomInt(2, 5);

    showToast(
        "Você derrubou a árvore e conseguiu madeira."
    );

}


/* =========================================================
   RESSURGIMENTO DA ÁRVORE
========================================================= */

function respawnTree(tree) {

    let tries = 0;

    let x;
    let y;

    do {

        x =
            randomInt(
                130,
                state.world.width - 130
            );

        y =
            randomInt(
                130,
                state.world.height - 130
            );

        tries++;

    } while (
        isBlocked(
            x,
            y,
            40
        ) &&
        tries < 100
    );


    tree.x = x;
    tree.y = y;
    tree.alive = true;


    const obstacle =
        state.world.obstacles
            .find(
                o =>
                    o.tree === tree
            );

    if (obstacle) {

        obstacle.x =
            x - 28;

        obstacle.y =
            y - 35;

    }

}


/* =========================================================
   INTERAÇÃO
========================================================= */

function getInteraction() {

    const player =
        state.player;

    let best = null;

    let bestDistance =
        Infinity;


    /* NPC */

    state.world.npcs
        .forEach(npc => {

            const d =
                distance(
                    player,
                    npc
                );

            if (
                d < 65 &&
                d < bestDistance
            ) {

                best = {
                    type: "npc",
                    object: npc
                };

                bestDistance =
                    d;

            }

        });


    /* Árvore */

    state.world.trees
        .forEach(tree => {

            if (!tree.alive) {
                return;
            }

            const d =
                distance(
                    player,
                    tree
                );

            if (
                d < 70 &&
                d < bestDistance
            ) {

                best = {

                    type: "tree",

                    object: tree

                };

                bestDistance =
                    d;

            }

        });


    /* Inimigo */

    state.world.enemies
        .forEach(enemy => {

            if (enemy.dead) {
                return;
            }

            const d =
                distance(
                    player,
                    enemy
                );

            if (
                d <
                100 &&
                d <
                bestDistance
            ) {

                best = {

                    type: "enemy",

                    object: enemy

                };

                bestDistance =
                    d;

            }

        });


    /* Casa */

    state.world.buildings
        .forEach(building => {

            const cx =
                building.x +
                building.w / 2;

            const cy =
                building.y +
                building.h;

            const d =
                Math.hypot(
                    player.x - cx,
                    player.y - cy
                );

            if (
                d < 90 &&
                d < bestDistance
            ) {

                best = {

                    type: "house",

                    object: building

                };

                bestDistance =
                    d;

            }

        });


    return best;

}


/* =========================================================
   EXECUTAR INTERAÇÃO
========================================================= */

function interact() {

    if (
        state.dialogue.active
    ) {

        advanceDialogue();

        return;

    }


    if (
        state.travel
    ) {

        return;

    }


    if (
        state.specialBattle
    ) {

        return;

    }


    const interaction =
        getInteraction();


    if (!interaction) {

        playerAttack();

        return;

    }


    if (
        interaction.type ===
        "npc"
    ) {

        startNPCDialogue(
            interaction.object
        );

        return;

    }


    if (
        interaction.type ===
        "tree"
    ) {

        harvestTree(
            interaction.object
        );

        return;

    }


    if (
        interaction.type ===
        "enemy"
    ) {

        const enemy =
            interaction.object;

        if (
            enemy.type ===
            "guardian" &&
            !enemy.accepted
        ) {

            openBattlePrompt(
                enemy
            );

        } else {

            playerAttack();

        }

        return;

    }


    if (
        interaction.type ===
        "house"
    ) {

        enterHouse(
            interaction.object
        );

    }

}


/* =========================================================
   ENTRAR NA CASA
========================================================= */

function enterHouse(building) {

    showToast(
        `Entrando em ${building.name}...`
    );

    setTimeout(() => {

        state.player.x =
            building.x +
            building.w / 2;

        state.player.y =
            building.y +
            building.h -
            40;

        showToast(
            "Você entrou no interior."
        );

    }, 350);

}


/*
   Z também permite entrar quando estiver perto
   da casa.
*/

function useZ() {

    if (
        state.dialogue.active
    ) {

        advanceDialogue();

        return;

    }


    const interaction =
        getInteraction();

    if (
        interaction &&
        interaction.type ===
        "house"
    ) {

        enterHouse(
            interaction.object
        );

    }

}


/* =========================================================
   NPCS
========================================================= */

function startNPCDialogue(npc) {

    state.dialogue.active =
        true;

    state.dialogue.speaker =
        npc.name;

    state.dialogue.lines = [

        `Olá, ${state.player.name}.`,

        npc.quietude[
            state.player.level %
            npc.quietude.length
        ],

        getNPCProgressLine(npc),

        getNPCFinalLine(npc)

    ];

    state.dialogue.index = 0;

    showDialogueLine();

}


function getNPCProgressLine(npc) {

    if (
        state.area === "village"
    ) {

        if (
            !state.progression.guardianDefeated
        ) {

            return `${npc.name === "BRAN"
                ? "O Guardião ainda está bloqueando a estrada leste."
                : "Você precisa descobrir o que existe além da estrada leste."
            }`;

        }

        return "Ouvi dizer que o céu guarda respostas que a vila nunca encontrou.";

    }

    if (
        state.area === "sky"
    ) {

        return "As criaturas daqui não são como as da superfície. Algo as está corrompendo.";

    }

    if (
        state.area === "cave"
    ) {

        return "As paredes da caverna parecem respirar quando a Quietude se aproxima.";

    }

    if (
        state.area === "ruby"
    ) {

        return "Os rubis desta região parecem guardar memórias antigas.";

    }

    return "Talvez o verdadeiro inimigo nunca tenha sido uma criatura.";

}


function getNPCFinalLine(npc) {

    const lines = {

        ELIAN:
            "Volte quando tiver descoberto algo novo.",

        MARA:
            "Não deixe a Quietude decidir quem você será.",

        DORAN:
            "Se encontrar cristais, traga alguns. Eles valem mais do que parecem.",

        BRAN:
            "E cuidado com as coisas que parecem estar dormindo."

    };

    return (
        lines[npc.name] ||
        "Boa sorte, aventureiro."
    );

}


function showDialogueLine() {

    const box =
        document.getElementById(
            "dialogueBox"
        );

    const speaker =
        document.getElementById(
            "dialogueSpeaker"
        );

    const text =
        document.getElementById(
            "dialogueText"
        );

    box.classList.remove(
        "hidden"
    );

    speaker.textContent =
        state.dialogue.speaker;

    text.textContent = "";

    state.dialogue.typing =
        true;

    state.dialogue.charIndex =
        0;

    const line =
        state.dialogue.lines[
            state.dialogue.index
        ];

    clearInterval(
        state.dialogue.timer
    );

    state.dialogue.timer =
        setInterval(() => {

            if (
                state.dialogue.charIndex >=
                line.length
            ) {

                clearInterval(
                    state.dialogue.timer
                );

                state.dialogue.typing =
                    false;

                return;

            }

            state.dialogue.charIndex++;

            text.textContent =
                line.substring(
                    0,
                    state.dialogue.charIndex
                );

        }, 18);

}


function advanceDialogue() {

    if (
        state.dialogue.typing
    ) {

        const line =
            state.dialogue.lines[
                state.dialogue.index
            ];

        clearInterval(
            state.dialogue.timer
        );

        document.getElementById(
            "dialogueText"
        ).textContent =
            line;

        state.dialogue.typing =
            false;

        return;

    }


    state.dialogue.index++;

    if (
        state.dialogue.index >=
        state.dialogue.lines.length
    ) {

        closeDialogue();

        return;

    }

    showDialogueLine();

}


function closeDialogue() {

    clearInterval(
        state.dialogue.timer
    );

    state.dialogue.active =
        false;

    document
        .getElementById(
            "dialogueBox"
        )
        .classList.add(
            "hidden"
        );

}


/* =========================================================
   BATALHA ESPECIAL
========================================================= */

function openBattlePrompt(enemy) {

    state.specialBattle =
        enemy;

    document.getElementById(
        "battleTitle"
    ).textContent =
        enemy.name;

    document.getElementById(
        "battleText"
    ).textContent =
        `${enemy.name} bloqueia seu caminho. Você aceita enfrentar esta criatura para continuar sua jornada?`;

    document
        .getElementById(
            "battlePanel"
        )
        .classList.remove(
            "hidden"
        );

}


function acceptBattle() {

    const enemy =
        state.specialBattle;

    if (!enemy) {
        return;
    }

    enemy.accepted =
        true;

    enemy.state =
        "chasing";

    enemy.target =
        state.player;

    state.specialBattle =
        null;

    document
        .getElementById(
            "battlePanel"
        )
        .classList.add(
            "hidden"
        );

    showToast(
        "A batalha começou!"
    );

}


function declineBattle() {

    state.specialBattle =
        null;

    document
        .getElementById(
            "battlePanel"
        )
        .classList.add(
            "hidden"
        );

}


/* =========================================================
   PORTAIS
========================================================= */

function checkPortals() {

    if (
        state.travel ||
        state.specialBattle ||
        state.dialogue.active
    ) {
        return;
    }

    const player =
        state.player;

    state.world.portals
        .forEach(portal => {

            if (
                player.x >= portal.x &&
                player.x <=
                    portal.x +
                    portal.w &&
                player.y >= portal.y &&
                player.y <=
                    portal.y +
                    portal.h
            ) {

                const unlocked =
                    checkRequirement(
                        portal.requirement
                    );

                if (
                    !unlocked
                ) {

                    showToast(
                        "Você ainda não pode seguir por este caminho."
                    );

                    player.x =
                        portal.x - 40;

                    return;

                }

                openTravel(
                    portal
                );

            }

        });

}


function checkRequirement(requirement) {

    return Boolean(
        state.progression[
            requirement
        ]
    );

}


function openTravel(portal) {

    if (
        state.travel
    ) {
        return;
    }

    state.travel =
        portal;

    document.getElementById(
        "travelTitle"
    ).textContent =
        "DESEJA CONTINUAR?";

    document.getElementById(
        "travelText"
    ).textContent =
        `A estrada leva para ${portal.title}. Deseja abandonar esta região e continuar a aventura?`;

    document
        .getElementById(
            "travelPanel"
        )
        .classList.remove(
            "hidden"
        );

}


function confirmTravel() {

    const portal =
        state.travel;

    if (!portal) {
        return;
    }

    state.travel =
        null;

    document
        .getElementById(
            "travelPanel"
        )
        .classList.add(
            "hidden"
        );

    changeArea(
        portal.target
    );

}


function cancelTravel() {

    state.travel =
        null;

    document
        .getElementById(
            "travelPanel"
        )
        .classList.add(
            "hidden"
        );

}


/* =========================================================
   MUDAR ÁREA
========================================================= */

function changeArea(area) {

    if (!areas[area]) {
        return;
    }

    state.area =
        area;

    buildWorld();

    showAreaTransition();

    updateHUD();

}


/* =========================================================
   TRANSIÇÃO
========================================================= */

function showAreaTransition() {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        areas[state.area].name;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        state.toastTimer
    );

    state.toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2500);

}


/* =========================================================
   DESENHO DO CHÃO
========================================================= */

function drawGround() {

    const area =
        areas[state.area];


    if (area.sky) {

        ctx.fillStyle =
            "#7e9bb0";

    } else if (area.cave) {

        ctx.fillStyle =
            "#292d2d";

    } else if (area.ruby) {

        ctx.fillStyle =
            "#3b2026";

    } else if (area.hell) {

        ctx.fillStyle =
            "#351b1c";

    } else {

        ctx.fillStyle =
            "#536b4b";

    }


    ctx.fillRect(
        0,
        0,
        state.world.width,
        state.world.height
    );


    const tile =
        64;


    for (
        let y = 80;
        y < state.world.height - 80;
        y += tile
    ) {

        for (
            let x = 80;
            x < state.world.width - 80;
            x += tile
        ) {

            if (
                area.cave ||
                area.ruby ||
                area.hell
            ) {

                ctx.fillStyle =
                    (
                        (
                            x / tile +
                            y / tile
                        ) % 2 === 0
                    )
                        ? "rgba(255,255,255,.015)"
                        : "rgba(0,0,0,.04)";

            } else {

                ctx.fillStyle =
                    (
                        (
                            x / tile +
                            y / tile
                        ) % 2 === 0
                    )
                        ? "rgba(255,255,255,.018)"
                        : "rgba(0,0,0,.018)";

            }

            ctx.fillRect(
                x,
                y,
                tile,
                tile
            );

        }

    }

}


/* =========================================================
   CAMINHOS
========================================================= */

function drawPaths() {

    if (
        state.area !== "village"
    ) {
        return;
    }

    ctx.fillStyle =
        "#b79a68";

    ctx.globalAlpha =
        .7;

    ctx.fillRect(
        80,
        1080,
        state.world.width - 160,
        120
    );

    ctx.fillRect(
        1540,
        80,
        120,
        state.world.height - 160
    );

    ctx.fillRect(
        1700,
        1110,
        1000,
        70
    );

    ctx.fillRect(
        600,
        1110,
        100,
        600
    );

    ctx.globalAlpha =
        1;

}


/* =========================================================
   CONSTRUÇÕES
========================================================= */

function drawBuildings() {

    state.world.buildings
        .forEach(building => {

            ctx.fillStyle =
                "rgba(0,0,0,.35)";

            ctx.fillRect(
                building.x + 15,
                building.y + 18,
                building.w,
                building.h
            );


            /* parede */

            ctx.fillStyle =
                building.color ||
                "#b98b61";

            ctx.fillRect(
                building.x,
                building.y,
                building.w,
                building.h
            );


            /* detalhes */

            ctx.strokeStyle =
                "rgba(40,30,25,.45)";

            ctx.lineWidth =
                5;

            ctx.strokeRect(
                building.x + 4,
                building.y + 4,
                building.w - 8,
                building.h - 8
            );


            /* telhado */

            ctx.fillStyle =
                building.roof;

            ctx.beginPath();

            ctx.moveTo(
                building.x - 25,
                building.y
            );

            ctx.lineTo(
                building.x +
                building.w / 2,
                building.y - 100
            );

            ctx.lineTo(
                building.x +
                building.w + 25,
                building.y
            );

            ctx.closePath();

            ctx.fill();


            /* porta */

            ctx.fillStyle =
                "#422b23";

            ctx.fillRect(
                building.x +
                building.w / 2 -
                25,
                building.y +
                building.h -
                70,
                50,
                70
            );


            /* janelas */

            ctx.fillStyle =
                "#dbc777";

            ctx.fillRect(
                building.x + 35,
                building.y + 65,
                55,
                45
            );

            ctx.fillRect(
                building.x +
                building.w -
                90,
                building.y + 65,
                55,
                45
            );


            /* nome */

            ctx.textAlign =
                "center";

            ctx.font =
                "bold 15px Georgia";

            ctx.fillStyle =
                "#f0dfb7";

            ctx.fillText(
                building.name,
                building.x +
                building.w / 2,
                building.y +
                building.h +
                30
            );

        });

}


/* =========================================================
   ÁRVORES
========================================================= */

function drawTrees() {

    state.world.trees
        .forEach(tree => {

            if (
                !tree.alive
            ) {
                return;
            }


            ctx.fillStyle =
                "rgba(0,0,0,.25)";

            ctx.beginPath();

            ctx.ellipse(
                tree.x,
                tree.y + 30,
                35,
                13,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#67492f";

            ctx.fillRect(
                tree.x - 9,
                tree.y,
                18,
                40
            );


            ctx.fillStyle =
                "#315d36";

            ctx.beginPath();

            ctx.arc(
                tree.x,
                tree.y - 15,
                35,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#467844";

            ctx.beginPath();

            ctx.arc(
                tree.x - 15,
                tree.y - 29,
                25,
                0,
                Math.PI * 2
            );

            ctx.arc(
                tree.x + 15,
                tree.y - 28,
                26,
                0,
                Math.PI * 2
            );

            ctx.fill();

        });

}


/* =========================================================
   OBSTÁCULOS
========================================================= */

function drawObstacles() {

    state.world.obstacles
        .forEach(obstacle => {

            if (
                obstacle.type ===
                "building" ||
                obstacle.type ===
                "tree"
            ) {
                return;
            }


            if (
                obstacle.type ===
                "wall"
            ) {

                ctx.fillStyle =
                    "#3b423e";

                ctx.fillRect(
                    obstacle.x,
                    obstacle.y,
                    obstacle.w,
                    obstacle.h
                );

                return;

            }


            if (
                obstacle.type ===
                "rock"
            ) {

                ctx.fillStyle =
                    "#686d68";

                ctx.beginPath();

                ctx.ellipse(
                    obstacle.x +
                    obstacle.w / 2,
                    obstacle.y +
                    obstacle.h / 2,
                    obstacle.w / 2,
                    obstacle.h / 2,
                    -.15,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                return;

            }


            if (
                obstacle.type ===
                "fountain"
            ) {

                ctx.fillStyle =
                    "#8d8a79";

                ctx.beginPath();

                ctx.ellipse(
                    obstacle.x +
                    obstacle.w / 2,
                    obstacle.y +
                    obstacle.h / 2,
                    obstacle.w / 2,
                    obstacle.h / 2,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.fillStyle =
                    "#4e91a5";

                ctx.beginPath();

                ctx.ellipse(
                    obstacle.x +
                    obstacle.w / 2,
                    obstacle.y +
                    obstacle.h / 2,
                    obstacle.w / 2 - 22,
                    obstacle.h / 2 - 22,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }

        });

}


/* =========================================================
   DECORAÇÕES
========================================================= */

function drawDecorations() {

    if (
        state.area === "village"
    ) {

        for (
            let y = 100;
            y < state.world.height - 100;
            y += 90
        ) {

            for (
                let x = 100;
                x < state.world.width - 100;
                x += 90
            ) {

                if (
                    (x * 7 + y * 3) % 11 < 4
                ) {

                    ctx.strokeStyle =
                        "rgba(25,70,35,.45)";

                    ctx.lineWidth =
                        2;

                    ctx.beginPath();

                    ctx.moveTo(
                        x,
                        y + 5
                    );

                    ctx.lineTo(
                        x - 4,
                        y - 4
                    );

                    ctx.moveTo(
                        x,
                        y + 5
                    );

                    ctx.lineTo(
                        x + 5,
                        y - 5
                    );

                    ctx.stroke();

                }

            }

        }

    }


    if (
        areas[state.area].cave ||
        areas[state.area].ruby
    ) {

        for (
            let i = 0;
            i < 70;
            i++
        ) {

            const x =
                (i * 347) %
                state.world.width;

            const y =
                (i * 193) %
                state.world.height;

            ctx.fillStyle =
                areas[state.area].ruby
                    ? "rgba(200,55,75,.25)"
                    : "rgba(100,120,130,.18)";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                3 + (i % 4),
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }


    if (
        areas[state.area].hell
    ) {

        for (
            let i = 0;
            i < 50;
            i++
        ) {

            const x =
                (i * 431) %
                state.world.width;

            const y =
                (i * 271) %
                state.world.height;

            ctx.fillStyle =
                "rgba(190,45,35,.25)";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

}


/* =========================================================
   NPCS
========================================================= */

function drawNPCs() {

    state.world.npcs
        .forEach(npc => {

            ctx.fillStyle =
                "rgba(0,0,0,.25)";

            ctx.beginPath();

            ctx.ellipse(
                npc.x,
                npc.y + 19,
                18,
                7,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                npc.color;

            ctx.beginPath();

            ctx.arc(
                npc.x,
                npc.y,
                16,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#27262a";

            ctx.beginPath();

            ctx.arc(
                npc.x,
                npc.y - 8,
                9,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.textAlign =
                "center";

            ctx.font =
                "bold 12px Arial";

            ctx.fillStyle =
                "#fff0c9";

            ctx.fillText(
                npc.name,
                npc.x,
                npc.y - 30
            );

            ctx.font =
                "10px Arial";

            ctx.fillStyle =
                "#cbc2ae";

            ctx.fillText(
                npc.role,
                npc.x,
                npc.y + 36
            );

        });

}


/* =========================================================
   INIMIGOS
========================================================= */

function drawEnemies() {

    state.world.enemies
        .forEach(enemy => {

            if (
                enemy.dead
            ) {
                return;
            }


            /* raio de visão */

            if (
                enemy.state ===
                "chasing"
            ) {

                ctx.fillStyle =
                    "rgba(180,60,55,.08)";

                ctx.beginPath();

                ctx.arc(
                    enemy.x,
                    enemy.y,
                    enemy.vision,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

            }


            /* sombra */

            ctx.fillStyle =
                "rgba(0,0,0,.3)";

            ctx.beginPath();

            ctx.ellipse(
                enemy.x,
                enemy.y + enemy.radius,
                enemy.radius * 1.1,
                enemy.radius * .4,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* corpo */

            ctx.fillStyle =
                enemy.hitFlash > 0
                    ? "#ffffff"
                    : enemy.color;

            ctx.beginPath();

            if (
                enemy.type ===
                "guardian"
            ) {

                ctx.moveTo(
                    enemy.x,
                    enemy.y - enemy.radius
                );

                ctx.lineTo(
                    enemy.x +
                    enemy.radius,
                    enemy.y
                );

                ctx.lineTo(
                    enemy.x,
                    enemy.y +
                    enemy.radius
                );

                ctx.lineTo(
                    enemy.x -
                    enemy.radius,
                    enemy.y
                );

                ctx.closePath();

            } else {

                ctx.arc(
                    enemy.x,
                    enemy.y,
                    enemy.radius,
                    0,
                    Math.PI * 2
                );

            }

            ctx.fill();


            /* destaque */

            ctx.strokeStyle =
                enemy.state === "chasing"
                    ? "#ff665e"
                    : "#d7c16e";

            ctx.lineWidth =
                enemy.type === "guardian"
                    ? 3
                    : 2;

            ctx.stroke();


            /* barra de vida */

            const barWidth =
                enemy.radius * 2.5;

            const hpPercent =
                enemy.hp /
                enemy.maxHp;

            ctx.fillStyle =
                "#241e1d";

            ctx.fillRect(
                enemy.x -
                barWidth / 2,
                enemy.y -
                enemy.radius -
                15,
                barWidth,
                5
            );

            ctx.fillStyle =
                enemy.type === "guardian"
                    ? "#bb514e"
                    : "#8b6950";

            ctx.fillRect(
                enemy.x -
                barWidth / 2,
                enemy.y -
                enemy.radius -
                15,
                barWidth *
                clamp(
                    hpPercent,
                    0,
                    1
                ),
                5
            );


            /* nome */

            ctx.textAlign =
                "center";

            ctx.font =
                enemy.type === "guardian"
                    ? "bold 13px Arial"
                    : "bold 11px Arial";

            ctx.fillStyle =
                enemy.type === "guardian"
                    ? "#ffcfaa"
                    : "#eee3c6";

            ctx.fillText(
                enemy.name,
                enemy.x,
                enemy.y +
                enemy.radius +
                18
            );

        });

}


/* =========================================================
   DROPS
========================================================= */

function drawDrops() {

    state.world.drops
        .forEach(drop => {

            if (
                drop.life <= 0
            ) {
                return;
            }

            const icons = {

                madeira: "🪵",

                pedra: "🪨",

                erva: "🌿",

                cristal: "💎",

                rubi: "♦",

                essencia: "✦"

            };

            ctx.font =
                "20px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                icons[drop.type] ||
                "✦",
                drop.x,
                drop.y
            );

        });

}


/* =========================================================
   JOGADOR
========================================================= */

function drawPlayer() {

    const player =
        state.player;

    if (!player) {
        return;
    }


    if (
        player.invincible > 0 &&
        Math.floor(
            player.invincible * 12
        ) % 2 === 0
    ) {
        return;
    }


    ctx.fillStyle =
        "rgba(0,0,0,.3)";

    ctx.beginPath();

    ctx.ellipse(
        player.x,
        player.y + 20,
        22,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        player.color;

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#e6c2a1";

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y - 12,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#30251f";

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y - 16,
        10,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    ctx.textAlign =
        "center";

    ctx.font =
        "bold 13px Arial";

    ctx.fillStyle =
        "#fff1c9";

    ctx.fillText(
        player.name,
        player.x,
        player.y - 40
    );

}


/* =========================================================
   PORTAIS
========================================================= */

function drawPortals() {

    state.world.portals
        .forEach(portal => {

            const unlocked =
                checkRequirement(
                    portal.requirement
                );

            ctx.fillStyle =
                unlocked
                    ? "rgba(190,155,85,.18)"
                    : "rgba(90,90,90,.15)";

            ctx.fillRect(
                portal.x,
                portal.y,
                portal.w,
                portal.h
            );


            ctx.strokeStyle =
                unlocked
                    ? "#d9bb73"
                    : "#66665d";

            ctx.lineWidth =
                3;

            ctx.strokeRect(
                portal.x,
                portal.y,
                portal.w,
                portal.h
            );


            ctx.textAlign =
                "center";

            ctx.font =
                "bold 13px Georgia";

            ctx.fillStyle =
                unlocked
                    ? "#ebd9a9"
                    : "#88877d";

            ctx.fillText(
                unlocked
                    ? portal.title
                    : "BLOQUEADO",
                portal.x +
                portal.w / 2,
                portal.y - 12
            );

        });

}


/* =========================================================
   TÍTULOS
========================================================= */

function drawWorldLabels() {

    if (
        state.area === "village"
    ) {

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 22px Georgia";

        ctx.fillStyle =
            "rgba(255,229,172,.75)";

        ctx.fillText(
            "PRAÇA DA VILA",
            1600,
            840
        );

        ctx.font =
            "14px Georgia";

        ctx.fillStyle =
            "rgba(255,255,255,.55)";

        ctx.fillText(
            "A Quietude ainda não alcançou este lugar...",
            1600,
            865
        );

    }


    if (
        areas[state.area].sky
    ) {

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 30px Georgia";

        ctx.fillStyle =
            "rgba(255,245,220,.55)";

        ctx.fillText(
            "ONDE O CÉU ESCONDE MEMÓRIAS",
            state.world.width / 2,
            500
        );

    }


    if (
        areas[state.area].hell
    ) {

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 34px Georgia";

        ctx.fillStyle =
            "rgba(220,80,70,.35)";

        ctx.fillText(
            "AQUIETUDE TOMOU FORMA",
            state.world.width / 2,
            500
        );

    }

}


/* =========================================================
   DESENHAR TUDO
========================================================= */

function draw() {

    const w =
        window.innerWidth;

    const h =
        window.innerHeight;

    ctx.clearRect(
        0,
        0,
        w,
        h
    );


    ctx.save();

    ctx.translate(
        -state.camera.x,
        -state.camera.y
    );


    drawGround();

    drawPaths();

    drawDecorations();

    drawBuildings();

    drawTrees();

    drawObstacles();

    drawPortals();

    drawDrops();

    drawNPCs();

    drawEnemies();

    drawPlayer();

    drawWorldLabels();


    ctx.restore();


    drawMinimap();

}


/* =========================================================
   CÂMERA
========================================================= */

function updateCamera() {

    const viewW =
        window.innerWidth;

    const viewH =
        window.innerHeight;


    state.camera.x =
        clamp(
            state.player.x -
            viewW / 2,
            0,
            Math.max(
                0,
                state.world.width -
                viewW
            )
        );


    state.camera.y =
        clamp(
            state.player.y -
            viewH / 2,
            0,
            Math.max(
                0,
                state.world.height -
                viewH
            )
        );

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    const player =
        state.player;

    if (!player) {
        return;
    }


    document.getElementById(
        "hudName"
    ).textContent =
        player.name;

    document.getElementById(
        "hudClass"
    ).textContent =
        player.className;

    document.getElementById(
        "hudAvatar"
    ).textContent =
        player.icon;


    document.getElementById(
        "hpBar"
    ).style.width =
        `${player.hp / player.maxHp * 100}%`;

    document.getElementById(
        "energyBar"
    ).style.width =
        `${player.energy / player.maxEnergy * 100}%`;


    document.getElementById(
        "hpText"
    ).textContent =
        `${Math.ceil(player.hp)}/${player.maxHp}`;

    document.getElementById(
        "energyText"
    ).textContent =
        `${Math.ceil(player.energy)}/${player.maxEnergy}`;


    document.getElementById(
        "levelText"
    ).textContent =
        player.level;

    document.getElementById(
        "xpText"
    ).textContent =
        `${player.xp} / ${player.xpToNext}`;

    document.getElementById(
        "moneyText"
    ).textContent =
        player.money;


    updateAreaName();

}


function updateAreaName() {

    document.getElementById(
        "areaName"
    ).textContent =
        areas[state.area].name;

}


/* =========================================================
   PROMPT
========================================================= */

function updateInteractionPrompt() {

    if (
        state.dialogue.active ||
        state.travel ||
        state.specialBattle
    ) {

        document
            .getElementById(
                "interactionPrompt"
            )
            .classList.add(
                "hidden"
            );

        return;

    }


    const interaction =
        getInteraction();


    if (!interaction) {

        document
            .getElementById(
                "interactionPrompt"
            )
            .classList.add(
                "hidden"
            );

        return;

    }


    const prompt =
        document.getElementById(
            "interactionPrompt"
        );

    const text =
        document.getElementById(
            "interactionText"
        );

    const key =
        document.getElementById(
            "interactionKey"
        );


    prompt.classList.remove(
        "hidden"
    );


    if (
        interaction.type ===
        "npc"
    ) {

        key.textContent =
            "E";

        text.textContent =
            "Conversar";

    }

    else if (
        interaction.type ===
        "tree"
    ) {

        key.textContent =
            "E";

        text.textContent =
            "Cortar árvore";

    }

    else if (
        interaction.type ===
        "enemy"
    ) {

        key.textContent =
            "E";

        text.textContent =
            interaction.object.type ===
            "guardian" &&
            !interaction.object.accepted
                ? "Aceitar batalha"
                : "Atacar";

    }

    else if (
        interaction.type ===
        "house"
    ) {

        key.textContent =
            "Z";

        text.textContent =
            "Entrar";

    }

}


/* =========================================================
   INVENTÁRIO
========================================================= */

function itemName(item) {

    const names = {

        madeira: "madeira",

        pedra: "pedra",

        erva: "erva",

        cristal: "cristal",

        rubi: "rubi",

        essencia: "essência",

        pocao: "poção"

    };

    return (
        names[item] ||
        item
    );

}


function updateInventory() {

    const grid =
        document.getElementById(
            "inventoryGrid"
        );

    grid.innerHTML = "";


    const icons = {

        madeira: "🪵",

        pedra: "🪨",

        erva: "🌿",

        cristal: "💎",

        rubi: "♦",

        essencia: "✦",

        pocao: "🧪"

    };


    Object.keys(
        state.inventory
    ).forEach(item => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "inventory-item";

        div.innerHTML = `

            <div class="inventory-icon">
                ${icons[item] || "?"}
            </div>

            <div class="inventory-name">
                ${itemName(item)}
            </div>

            <div class="inventory-count">
                ${state.inventory[item]}
            </div>

        `;

        grid.appendChild(div);

    });

}


function toggleInventory() {

    if (
        state.dialogue.active ||
        state.travel ||
        state.specialBattle
    ) {
        return;
    }

    const panel =
        document.getElementById(
            "inventoryPanel"
        );

    panel.classList.toggle(
        "hidden"
    );

    if (
        !panel.classList.contains(
            "hidden"
        )
    ) {

        updateInventory();

    }

}


/* =========================================================
   MAPA
========================================================= */

function drawMinimap() {

    const w =
        miniCanvas.width;

    const h =
        miniCanvas.height;


    miniCtx.clearRect(
        0,
        0,
        w,
        h
    );


    miniCtx.fillStyle =
        "#182219";

    miniCtx.fillRect(
        0,
        0,
        w,
        h
    );


    const sx =
        w /
        state.world.width;

    const sy =
        h /
        state.world.height;


    /* casas */

    miniCtx.fillStyle =
        "#83644c";

    state.world.buildings
        .forEach(building => {

            miniCtx.fillRect(

                building.x * sx,

                building.y * sy,

                building.w * sx,

                building.h * sy

            );

        });


    /* inimigos */

    state.world.enemies
        .forEach(enemy => {

            if (
                enemy.dead
            ) {
                return;
            }

            miniCtx.fillStyle =
                enemy.type ===
                "guardian"
                    ? "#ff4e48"
                    : "#d58b61";

            miniCtx.beginPath();

            miniCtx.arc(

                enemy.x * sx,

                enemy.y * sy,

                enemy.type ===
                "guardian"
                    ? 4
                    : 2.5,

                0,

                Math.PI * 2

            );

            miniCtx.fill();

        });


    /* NPCs */

    miniCtx.fillStyle =
        "#e0c57d";

    state.world.npcs
        .forEach(npc => {

            miniCtx.fillRect(

                npc.x * sx - 2,

                npc.y * sy - 2,

                4,

                4

            );

        });


    /* jogador */

    miniCtx.fillStyle =
        "#ffffff";

    miniCtx.beginPath();

    miniCtx.arc(

        state.player.x * sx,

        state.player.y * sy,

        4,

        0,

        Math.PI * 2

    );

    miniCtx.fill();

}


function drawLargeMap() {

    const w =
        mapCanvas.width;

    const h =
        mapCanvas.height;


    mapCtx.clearRect(
        0,
        0,
        w,
        h
    );


    mapCtx.fillStyle =
        "#172119";

    mapCtx.fillRect(
        0,
        0,
        w,
        h
    );


    const sx =
        w /
        state.world.width;

    const sy =
        h /
        state.world.height;


    mapCtx.fillStyle =
        "#89684d";

    state.world.buildings
        .forEach(building => {

            mapCtx.fillRect(

                building.x * sx,

                building.y * sy,

                building.w * sx,

                building.h * sy

            );

        });


    mapCtx.fillStyle =
        "#df4e49";

    state.world.enemies
        .forEach(enemy => {

            if (
                enemy.dead
            ) {
                return;
            }

            mapCtx.beginPath();

            mapCtx.arc(

                enemy.x * sx,

                enemy.y * sy,

                enemy.type ===
                "guardian"
                    ? 7
                    : 4,

                0,

                Math.PI * 2

            );

            mapCtx.fill();

        });


    mapCtx.fillStyle =
        "#e5cf8e";

    state.world.npcs
        .forEach(npc => {

            mapCtx.beginPath();

            mapCtx.arc(

                npc.x * sx,

                npc.y * sy,

                5,

                0,

                Math.PI * 2

            );

            mapCtx.fill();

        });


    mapCtx.fillStyle =
        "#ffffff";

    mapCtx.beginPath();

    mapCtx.arc(

        state.player.x * sx,

        state.player.y * sy,

        7,

        0,

        Math.PI * 2

    );

    mapCtx.fill();

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        state.toastTimer
    );

    state.toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2300);

}


/* =========================================================
   SALVAR
========================================================= */

function saveGame(showMessage = true) {

    if (!state.player) {
        return;
    }


    const save = {

        version: 4,

        area:
            state.area,

        player:
            {
                ...state.player
            },

        inventory:
            {
                ...state.inventory
            },

        progression:
            {
                ...state.progression
            },

        savedAt:
            new Date().toISOString()

    };


    try {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(save)
        );

        if (
            showMessage
        ) {

            showToast(
                "Jogo salvo com sucesso."
            );

        }

        updateContinueButton();

    }

    catch (error) {

        console.error(
            error
        );

        showToast(
            "Não foi possível salvar."
        );

    }

}


/* =========================================================
   CARREGAR
========================================================= */

function loadGame() {

    try {

        const raw =
            localStorage.getItem(
                SAVE_KEY
            );

        if (!raw) {
            return false;
        }

        const save =
            JSON.parse(raw);


        if (
            !save.player
        ) {

            return false;

        }


        const character =
            characters.find(
                c =>
                    c.id ===
                    save.player.characterId
            );


        if (!character) {
            return false;
        }


        state.area =
            areas[save.area]
                ? save.area
                : "village";


        state.player = {

            ...save.player,

            radius: 18,

            maxHp:
                Number(
                    save.player.maxHp
                ) ||
                character.hp,

            maxEnergy:
                Number(
                    save.player.maxEnergy
                ) ||
                character.energy

        };


        state.inventory = {

            ...state.inventory,

            ...(save.inventory || {})

        };


        state.progression = {

            ...state.progression,

            ...(save.progression || {})

        };


        buildWorld();

        updateHUD();

        showScreen("game");

        state.running = true;

        state.lastTime =
            performance.now();

        requestAnimationFrame(
            gameLoop
        );

        return true;

    }

    catch (error) {

        console.error(
            error
        );

        localStorage.removeItem(
            SAVE_KEY
        );

        return false;

    }

}


/* =========================================================
   SAVE EXISTENTE
========================================================= */

function hasSave() {

    try {

        return Boolean(
            localStorage.getItem(
                SAVE_KEY
            )
        );

    }

    catch {

        return false;

    }

}


function updateContinueButton() {

    const button =
        document.getElementById(
            "continueBtn"
        );

    const hint =
        document.getElementById(
            "continueHint"
        );


    const available =
        hasSave();


    button.disabled =
        !available;


    hint.textContent =
        available
            ? "Existe um jogo salvo neste navegador."
            : "Nenhum jogo salvo encontrado.";

}


/* =========================================================
   VOLTAR AO MENU
========================================================= */

function returnToMenu() {

    saveGame(false);

    state.running =
        false;

    state.keys.clear();

    showScreen("menu");

    updateContinueButton();

}


/* =========================================================
   LOOP
========================================================= */

function update(dt) {

    if (
        !state.player
    ) {
        return;
    }


    if (
        state.dialogue.active ||
        state.travel ||
        state.specialBattle
    ) {

        updateCamera();

        updateHUD();

        return;

    }


    updatePlayer(dt);

    updateEnemies(dt);

    updateDrops(dt);

    updateTrees(dt);

    checkPortals();

    updateCamera();

    updateInteractionPrompt();

    updateHUD();

}


function gameLoop(timestamp) {

    if (
        !state.running
    ) {
        return;
    }


    const dt =
        Math.min(
            (timestamp -
                state.lastTime) /
            1000,

            .05
        );


    state.lastTime =
        timestamp;


    update(dt);

    draw();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   TECLADO
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        /* ENTER */

        if (
            event.key === "Enter"
        ) {

            if (
                state.dialogue.active
            ) {

                event.preventDefault();

                advanceDialogue();

                return;

            }

        }


        /* MOVIMENTO */

        const movementKeys = [

            "w",
            "a",
            "s",
            "d",

            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright"

        ];


        if (
            movementKeys.includes(
                key
            )
        ) {

            event.preventDefault();

            state.keys.add(
                key
            );

        }


        /* E */

        if (
            key === "e" &&
            !event.repeat
        ) {

            event.preventDefault();

            interact();

        }


        /* Z */

        if (
            key === "z" &&
            !event.repeat
        ) {

            event.preventDefault();

            useZ();

        }


        /* I */

        if (
            key === "i" &&
            !event.repeat
        ) {

            event.preventDefault();

            toggleInventory();

        }


        /* M */

        if (
            key === "m" &&
            !event.repeat
        ) {

            event.preventDefault();

            if (
                state.dialogue.active
            ) {
                return;
            }

            const panel =
                document.getElementById(
                    "mapPanel"
                );

            panel.classList.toggle(
                "hidden"
            );

            if (
                !panel.classList.contains(
                    "hidden"
                )
            ) {

                drawLargeMap();

            }

        }


        /* ESC */

        if (
            key === "escape"
        ) {

            if (
                state.dialogue.active
            ) {

                closeDialogue();

                return;

            }

            if (
                state.travel
            ) {

                cancelTravel();

                return;

            }

            if (
                state.specialBattle
            ) {

                declineBattle();

                return;

            }

            document
                .getElementById(
                    "inventoryPanel"
                )
                .classList.add(
                    "hidden"
                );

            document
                .getElementById(
                    "mapPanel"
                )
                .classList.add(
                    "hidden"
                );

            if (
                screens.game.classList.contains(
                    "active"
                )
            ) {

                returnToMenu();

            }

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        state.keys.delete(
            event.key.toLowerCase()
        );

    }
);


window.addEventListener(
    "blur",
    () => {

        state.keys.clear();

    }
);


/* =========================================================
   BOTÕES DO MENU
========================================================= */

document
    .getElementById(
        "newGameBtn"
    )
    .addEventListener(
        "click",
        startNewGame
    );


document
    .getElementById(
        "continueBtn"
    )
    .addEventListener(
        "click",
        () => {

            if (
                !loadGame()
            ) {

                showToast(
                    "O salvamento não pôde ser carregado."
                );

                updateContinueButton();

            }

        }
    );


document
    .getElementById(
        "howToBtn"
    )
    .addEventListener(
        "click",
        () => {

            showScreen("how");

        }
    );


document
    .getElementById(
        "creditsBtn"
    )
    .addEventListener(
        "click",
        () => {

            showScreen("credits");

        }
    );


document
    .getElementById(
        "backHowBtn"
    )
    .addEventListener(
        "click",
        () => {

            showScreen("menu");

        }
    );


document
    .getElementById(
        "backCreditsBtn"
    )
    .addEventListener(
        "click",
        () => {

            showScreen("menu");

        }
    );


document
    .getElementById(
        "startGameBtn"
    )
    .addEventListener(
        "click",
        beginGame
    );


document
    .getElementById(
        "backMenuBtn"
    )
    .addEventListener(
        "click",
        () => {

            showScreen("menu");

        }
    );


document
    .getElementById(
        "playerName"
    )
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                beginGame();

            }

        }
    );


/* =========================================================
   BOTÕES DO JOGO
========================================================= */

document
    .getElementById(
        "saveBtn"
    )
    .addEventListener(
        "click",
        () => {

            saveGame(true);

        }
    );


document
    .getElementById(
        "menuBtn"
    )
    .addEventListener(
        "click",
        returnToMenu
    );


document
    .getElementById(
        "closeInventory"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "inventoryPanel"
                )
                .classList.add(
                    "hidden"
                );

        }
    );


document
    .getElementById(
        "closeMap"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "mapPanel"
                )
                .classList.add(
                    "hidden"
                );

        }
    );


/* =========================================================
   BOTÕES DE VIAGEM
========================================================= */

document
    .getElementById(
        "travelYes"
    )
    .addEventListener(
        "click",
        confirmTravel
    );


document
    .getElementById(
        "travelNo"
    )
    .addEventListener(
        "click",
        cancelTravel
    );


/* =========================================================
   BOTÕES DE BATALHA
========================================================= */

document
    .getElementById(
        "battleAccept"
    )
    .addEventListener(
        "click",
        acceptBattle
    );


document
    .getElementById(
        "battleDecline"
    )
    .addEventListener(
        "click",
        declineBattle
    );


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

createCharacterCards();

resizeCanvas();

updateContinueButton();


})();
