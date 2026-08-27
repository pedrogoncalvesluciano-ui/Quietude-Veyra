(() => {
"use strict";

/* =========================================================
   VEYRA — A QUIETUDE
   SCRIPT PRINCIPAL
   Versão pós-playtest
========================================================= */

const SAVE_KEY = "veyra_save_v16_playtest";

const $ = (id) => {
    return document.getElementById(id);
};

const must = (id) => {
    const element = $(id);

    if (!element) {
        throw new Error(
            `Elemento obrigatório não encontrado: #${id}`
        );
    }

    return element;
};

/* =========================================================
   CANVAS
========================================================= */

const canvas = must("gameCanvas");
const ctx = canvas.getContext("2d");

const miniCanvas = must("miniCanvas");
const miniCtx = miniCanvas.getContext("2d");

const mapCanvas = must("worldMapCanvas");
const mapCtx = mapCanvas.getContext("2d");

/* =========================================================
   TELAS
========================================================= */

const screens = {
    menu: must("menuScreen"),
    how: must("howScreen"),
    credits: must("creditsScreen"),
    character: must("characterScreen"),
    game: must("gameScreen")
};

/* =========================================================
   PERSONAGENS
========================================================= */

const CHARACTERS = [
    {
        id: "kaelion",
        name: "KAELION",
        className: "Mago",
        icon: "🧙",
        role: "Magia • Longo alcance",

        description:
            "Grande poder mágico, ataques à distância e controle de área.",

        story:
            "Estudioso de memórias antigas, Kaelion sente a magia desaparecer junto com as lembranças do mundo.",

        hp: 85,
        magic: 145,
        energy: 115,
        speed: 178,
        damage: 25,
        defense: 5,

        color: "#e49345",
        secondaryColor: "#ffd070",

        bg: "rgba(228,147,69,.16)",
        glow: "rgba(228,147,69,.30)",

        skill: "Bola de Memória"
    },

    {
        id: "theron",
        name: "THERON",
        className: "Cavaleiro",
        icon: "🛡️",
        role: "Espada • Defesa",

        description:
            "Muita defesa, excelente resistência e forte combate corpo a corpo.",

        story:
            "Theron jurou proteger a Vila do Crepúsculo enquanto ainda houver alguém capaz de lembrar seu nome.",

        hp: 145,
        magic: 75,
        energy: 120,
        speed: 145,
        damage: 30,
        defense: 21,

        color: "#bfc5ce",
        secondaryColor: "#eef3ff",

        bg: "rgba(191,197,206,.14)",
        glow: "rgba(191,197,206,.28)",

        skill: "Golpe Pesado"
    },

    {
        id: "grumgar",
        name: "GRUMGAR",
        className: "Troll",
        icon: "👹",
        role: "Força • Vida",

        description:
            "Vida extremamente alta, ataques pesados e grande força física.",

        story:
            "Grumgar deixou as cavernas para descobrir por que criaturas de sua espécie começaram a esquecer suas próprias tribos.",

        hp: 180,
        magic: 55,
        energy: 95,
        speed: 112,
        damage: 39,
        defense: 18,

        color: "#718f51",
        secondaryColor: "#bbd47d",

        bg: "rgba(113,143,81,.16)",
        glow: "rgba(113,143,81,.28)",

        skill: "Esmagamento"
    },

    {
        id: "lirael",
        name: "LIRAEL",
        className: "Fada",
        icon: "🧚",
        role: "Velocidade • Cura",

        description:
            "Muito rápida, poderosa com magia e capaz de restaurar a própria vida.",

        story:
            "Lirael percebeu que flores mágicas paravam de brilhar sempre que uma memória desaparecia.",

        hp: 95,
        magic: 135,
        energy: 135,
        speed: 210,
        damage: 20,
        defense: 7,

        color: "#dd8bd0",
        secondaryColor: "#ffd0f1",

        bg: "rgba(221,139,208,.16)",
        glow: "rgba(221,139,208,.30)",

        skill: "Flecha Feérica"
    },

    {
        id: "zephyr",
        name: "ZEPHYR",
        className: "Transmorfo",
        icon: "🦊",
        role: "Adaptação • Equilíbrio",

        description:
            "Equilibrado e capaz de mudar temporariamente seus atributos.",

        story:
            "Zephyr muda de forma para sobreviver, mas teme o dia em que esquecerá qual delas era sua verdadeira forma.",

        hp: 115,
        magic: 108,
        energy: 112,
        speed: 170,
        damage: 26,
        defense: 13,

        color: "#8f6bd8",
        secondaryColor: "#c7a8ff",

        bg: "rgba(143,107,216,.16)",
        glow: "rgba(143,107,216,.30)",

        skill: "Forma Adaptativa"
    }
];

/* =========================================================
   ITENS
========================================================= */

const ITEMS = {
    madeira: {
        name: "Madeira",
        icon: "🪵",
        category: "materials",
        weight: 1,
        value: 2
    },

    carvao: {
        name: "Carvão",
        icon: "⬛",
        category: "materials",
        weight: 1,
        value: 6
    },

    ferro: {
        name: "Minério de Ferro",
        icon: "⛏️",
        category: "materials",
        weight: 2,
        value: 14
    },

    ouro: {
        name: "Ouro",
        icon: "🪙",
        category: "materials",
        weight: 2,
        value: 30
    },

    rubi: {
        name: "Rubi",
        icon: "♦",
        category: "materials",
        weight: 2,
        value: 75
    },

    cristal: {
        name: "Cristal",
        icon: "💎",
        category: "special",
        weight: 2,
        value: 45
    },

    essencia: {
        name: "Essência da Quietude",
        icon: "✦",
        category: "special",
        weight: 1,
        value: 100
    },

    couro: {
        name: "Couro",
        icon: "🟫",
        category: "materials",
        weight: 1,
        value: 18
    },

    fragmentoMemoria: {
        name: "Fragmento de Memória",
        icon: "🔹",
        category: "special",
        weight: 1,
        value: 55
    },

    flautaMemoria: {
        name: "Flauta da Memória",
        icon: "🎶",
        category: "special",
        weight: 1,
        value: 0,
        unique: true
    },

    pao: {
        name: "Pão Rústico",
        icon: "🥖",
        category: "food",
        weight: 1,
        value: 12,
        hunger: 30,
        heal: 4
    },

    carneCaca: {
        name: "Carne de Caça",
        icon: "🍖",
        category: "food",
        weight: 1,
        value: 24,
        hunger: 44,
        heal: 8
    },

    pocao: {
        name: "Poção de Cura",
        icon: "🧪",
        category: "potions",
        weight: 1,
        value: 30,
        heal: 45
    },

    elixir: {
        name: "Elixir de Energia",
        icon: "💙",
        category: "potions",
        weight: 1,
        value: 35,
        energy: 50
    },

    espadaFerro: {
        name: "Espada de Ferro",
        icon: "⚔️",
        category: "weapons",
        weight: 4,
        value: 140,
        damage: 12
    },

    armaduraCouro: {
        name: "Armadura de Couro",
        icon: "🥋",
        category: "armor",
        weight: 5,
        value: 110,
        defense: 8
    },

    machado: {
        name: "Machado",
        icon: "🪓",
        category: "tools",
        weight: 3,
        value: 50
    }
};

/* =========================================================
   REGIÕES
========================================================= */

const REGIONS = {
    village: {
        name: "VILA DO CREPÚSCULO",
        width: 3200,
        height: 2200,
        visual: "village"
    },

    forest: {
        name: "FLORESTA",
        width: 3400,
        height: 2400,
        visual: "forest"
    },

    grove: {
        name: "BOSQUE",
        width: 3200,
        height: 2300,
        visual: "grove"
    },

    mountains: {
        name: "MONTANHAS",
        width: 3500,
        height: 2300,
        visual: "mountains"
    },

    iron: {
        name: "CAVERNA DE FERRO",
        width: 2900,
        height: 1900,
        visual: "iron"
    },

    ruby: {
        name: "CAVERNA DE RUBI",
        width: 3100,
        height: 2100,
        visual: "ruby"
    },

    shadow: {
        name: "CAVERNA SOMBRIA",
        width: 3000,
        height: 2000,
        visual: "shadow"
    },

    fairy: {
        name: "REINO DAS FADAS",
        width: 3200,
        height: 2200,
        visual: "fairy"
    },

    sky: {
        name: "CÉU",
        width: 3400,
        height: 2200,
        visual: "sky"
    },

    hell: {
        name: "INFERNO",
        width: 3600,
        height: 2400,
        visual: "hell"
    },

    final: {
        name: "CÂMARA FINAL",
        width: 2200,
        height: 1500,
        visual: "final"
    }
};

/* =========================================================
   ORDEM DAS REGIÕES
========================================================= */

const REGION_ORDER = [
    "village",
    "forest",
    "grove",
    "mountains",
    "iron",
    "ruby",
    "shadow",
    "fairy",
    "sky",
    "hell",
    "final"
];

/* =========================================================
   ESTADO GLOBAL
========================================================= */

const state = {
    selectedCharacter: CHARACTERS[0],

    player: null,

    running: false,
    paused: false,

    time: 0,
    lastTime: 0,

    keys: new Set(),

    area: "village",

    camera: {
        x: 0,
        y: 0
    },

    world: createEmptyWorld(
        REGIONS.village
    ),

    houseMode: false,
    currentHouse: null,
    houseReturn: null,

    dialogue: null,
    travel: null,
    battle: null,

    questNPC: null,

    shopNPC: null,
    shopMode: "buy",

    inventoryCategory: "all",

    toastTimer: null,

    portalCooldown: 0,

    warnedNeedAt: 0,

    finalChoiceShown: false,

    pointer: {
        x: 0,
        y: 0,
        worldX: 0,
        worldY: 0,
        down: false
    },

    holdAction: null,

    hordeNextAt: 0,

    screenFadeTimer: null,

    fountainDrops: [],

    ambientTimer: 0
};

/* =========================================================
   CRIAÇÃO DO MUNDO
========================================================= */

function createEmptyWorld(region) {
    return {
        width: region.width,
        height: region.height,

        obstacles: [],
        interiorObstacles: [],

        buildings: [],

        trees: [],
        resources: [],

        foods: [],
        secrets: [],

        decorations: [],
        trials: [],

        hazards: [],

        npcs: [],
        enemies: [],

        drops: [],

        portals: [],

        particles: [],
        effects: []
    };
}

/* =========================================================
   UTILIDADES
========================================================= */

function clamp(
    value,
    min,
    max
) {
    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}

function lerp(
    from,
    to,
    amount
) {
    return (
        from +
        (
            to -
            from
        ) *
        amount
    );
}

function random(
    min,
    max
) {
    return (
        Math.random() *
        (
            max -
            min
        ) +
        min
    );
}

function randomInt(
    min,
    max
) {
    return Math.floor(
        random(
            min,
            max + 1
        )
    );
}

function distance(
    a,
    b
) {
    return Math.hypot(
        a.x -
        b.x,
        a.y -
        b.y
    );
}

function uid(prefix) {
    return (
        `${prefix}_` +
        Math.random()
            .toString(36)
            .slice(
                2,
                10
            )
    );
}

function normalizeVector(
    x,
    y
) {
    const length =
        Math.hypot(
            x,
            y
        ) || 1;

    return {
        x:
            x /
            length,

        y:
            y /
            length
    };
}

function currentCharacter() {
    return (
        CHARACTERS.find(
            character =>
                character.id ===
                state.player
                    ?.characterId
        ) ||
        CHARACTERS[0]
    );
}

function getRegionIndex(
    regionId = state.area
) {
    return Math.max(
        0,
        REGION_ORDER.indexOf(
            regionId
        )
    );
}

function getPreviousRegion(
    regionId = state.area
) {
    const index =
        REGION_ORDER.indexOf(
            regionId
        );

    if (
        index <=
        0
    ) {
        return null;
    }

    return REGION_ORDER[
        index -
        1
    ];
}

function getNextRegion(
    regionId = state.area
) {
    const index =
        REGION_ORDER.indexOf(
            regionId
        );

    if (
        index <
        0 ||
        index >=
        REGION_ORDER.length -
        1
    ) {
        return null;
    }

    return REGION_ORDER[
        index +
        1
    ];
}

/* =========================================================
   TELAS
========================================================= */

function showScreen(name) {
    Object
        .values(
            screens
        )
        .forEach(
            screen =>
                screen
                    .classList
                    .remove(
                        "active"
                    )
        );

    screens[
        name
    ].classList.add(
        "active"
    );
}

function fadeToScreen(
    name,
    afterSwitch = null
) {
    const fade =
        must(
            "uiFade"
        );

    clearTimeout(
        state.screenFadeTimer
    );

    fade.classList.add(
        "active"
    );

    state.screenFadeTimer =
        setTimeout(
            () => {
                showScreen(
                    name
                );

                if (
                    typeof afterSwitch ===
                    "function"
                ) {
                    afterSwitch();
                }

                requestAnimationFrame(
                    () => {
                        requestAnimationFrame(
                            () => {
                                fade.classList.remove(
                                    "active"
                                );
                            }
                        );
                    }
                );
            },
            320
        );
}

/* =========================================================
   MENSAGENS
========================================================= */

function showToast(message) {
    const toast =
        must(
            "saveMessage"
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
        setTimeout(
            () => {
                toast.classList.remove(
                    "show"
                );
            },
            2200
        );
}

/* =========================================================
   CANVAS
========================================================= */

function resizeCanvas() {
    const ratio =
        window.devicePixelRatio ||
        1;

    canvas.width =
        Math.floor(
            window.innerWidth *
            ratio
        );

    canvas.height =
        Math.floor(
            window.innerHeight *
            ratio
        );

    canvas.style.width =
        `${window.innerWidth}px`;

    canvas.style.height =
        `${window.innerHeight}px`;

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
   SELEÇÃO DE PERSONAGEM
========================================================= */

function createCharacterCards() {
    const container =
        must(
            "characterCards"
        );

    container.innerHTML =
        "";

    const maximums = {
        hp: 180,
        magic: 145,
        energy: 135,
        damage: 39,
        defense: 21,
        speed: 210
    };

    const labels = {
        hp: "Vida",
        magic: "Magia",
        energy: "Energia",
        damage: "Dano",
        defense: "Defesa",
        speed: "Velocidade"
    };

    CHARACTERS.forEach(
        (
            character,
            index
        ) => {
            const card =
                document.createElement(
                    "button"
                );

            card.type =
                "button";

            card.className =
                "character-card" +
                (
                    index ===
                    0
                        ? " selected"
                        : ""
                );

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

            const stats = [
                "hp",
                "magic",
                "energy",
                "damage",
                "defense",
                "speed"
            ]
                .map(
                    key => {
                        const percent =
                            clamp(
                                (
                                    character[
                                        key
                                    ] /
                                    maximums[
                                        key
                                    ]
                                ) *
                                100,
                                8,
                                100
                            );

                        return `
                            <div class="char-stat">

                                <span>
                                    ${labels[key]}
                                </span>

                                <div class="char-stat-track">

                                    <div
                                        class="char-stat-fill"
                                        style="width:${percent}%"
                                    ></div>

                                </div>

                                <b>
                                    ${character[key]}
                                </b>

                            </div>
                        `;
                    }
                )
                .join(
                    ""
                );

            card.innerHTML = `
                <div class="char-art">
                    ${character.icon}
                </div>

                <h3>
                    ${character.name}
                </h3>

                <p class="char-classline">
                    ${character.className}
                    —
                    ${character.role}
                </p>

                <p>
                    ${character.description}
                </p>

                <div class="char-stats">
                    ${stats}
                </div>

                <p class="char-story">
                    ${character.story}
                </p>

                <p class="char-skill">
                    ✦ ${character.skill}
                </p>
            `;

            card.addEventListener(
                "click",
                () => {
                    state.selectedCharacter =
                        character;

                    document
                        .querySelectorAll(
                            ".character-card"
                        )
                        .forEach(
                            item =>
                                item
                                    .classList
                                    .remove(
                                        "selected"
                                    )
                        );

                    card.classList.add(
                        "selected"
                    );
                }
            );

            container.appendChild(
                card
            );
        }
    );
}

/* =========================================================
   NOVO JOGO
========================================================= */

function startNewGame() {
    must(
        "playerName"
    ).value =
        "";

    must(
        "nameError"
    ).textContent =
        "";

    state.selectedCharacter =
        CHARACTERS[0];

    document
        .querySelectorAll(
            ".character-card"
        )
        .forEach(
            (
                card,
                index
            ) => {
                card.classList.toggle(
                    "selected",
                    index ===
                    0
                );
            }
        );

    fadeToScreen(
        "character",
        () => {
            setTimeout(
                () => {
                    must(
                        "playerName"
                    ).focus();
                },
                80
            );
        }
    );
}

/* =========================================================
   CRIAÇÃO DO PLAYER
========================================================= */

function createPlayer(
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

        color:
            character.color,

        secondaryColor:
            character.secondaryColor,

        x: 380,
        y: 260,

        radius: 18,

        hp:
            character.hp,

        maxHp:
            character.hp,

        magic:
            character.magic,

        maxMagic:
            character.magic,

        energy:
            character.energy,

        maxEnergy:
            character.energy,

        speed:
            character.speed,

        damage:
            character.damage,

        defense:
            character.defense,

        level: 1,

        xp: 0,

        xpToNext: 100,

        money: 35,

        hunger: 100,

        fatigue: 100,

        memory: 0,

        inventory: {
            madeira: 0,
            carvao: 0,
            ferro: 0,
            ouro: 0,
            rubi: 0,
            cristal: 0,
            essencia: 0,
            couro: 0,
            fragmentoMemoria: 0,
            flautaMemoria: 0,

            pao: 2,
            carneCaca: 0,

            pocao: 2,
            elixir: 1,

            espadaFerro: 0,
            armaduraCouro: 0,
            machado: 1
        },

        equipment: {
            weapon: null,
            armor: null,
            tool: "machado"
        },

        quest: {
            wood: {
                state: "none",
                need: 10,
                rewardXP: 100,
                rewardMoney: 80
            },

            coal: {
                state: "none",
                need: 8,
                rewardXP: 130,
                rewardMoney: 110
            }
        },

        defeatedBosses: [],

        discoveredBosses: [],

        unlockedAreas: [
            "village"
        ],

        collected: {},

        hellTypesDefeated: {},

        secretsFound: [],

        skyTrial: {
            started: false,
            wave: 0,
            activeWave: 0,
            complete: false
        },

        flutePlayed: false,

        checkpoint: {
            area: "village",
            x: 480,
            y: 610
        },

        skillCooldowns: {
            q: 0,
            r: 0,
            f: 0
        },

        damageReduction: 0,

        shieldTimer: 0,

        stunTimer: 0,

        dead: false,

        invincible: 0,

        attackCooldown: 0,

        adaptiveBuff: false,

        finalChoice: null,

        finalDefeated: false,

        lastRegion:
            "village"
    };
}

/* =========================================================
   COMEÇAR O JOGO
========================================================= */

function startGame() {
    const input =
        must(
            "playerName"
        );

    const name =
        input
            .value
            .trim();

    if (
        name.length <
        2
    ) {
        must(
            "nameError"
        ).textContent =
            "Digite um nome com pelo menos 2 caracteres.";

        input.focus();

        return;
    }

    createPlayer(
        name,
        state.selectedCharacter
    );

    state.area =
        "village";

    state.houseMode =
        false;

    state.currentHouse =
        null;

    state.houseReturn =
        null;

    state.finalChoiceShown =
        false;

    buildWorld();

    const home =
        state.world
            .buildings
            .find(
                building =>
                    building.id ===
                    "home"
            );

    if (
        home
    ) {
        state.currentHouse =
            home;

        state.houseMode =
            true;

        state.houseReturn = {
            x:
                home.x +
                home.w /
                2,

            y:
                home.y +
                home.h +
                58
        };

        placePlayerInsideHouse();
    }

    updateHUD();

    showScreen(
        "game"
    );

    state.running =
        true;

    state.paused =
        true;

    state.time =
        0;

    state.lastTime =
        performance.now();

    must(
        "transitionMessage"
    ).textContent =
        "VEYRA";

    must(
        "transitionScreen"
    ).classList.remove(
        "hidden"
    );

    setTimeout(
        () => {
            must(
                "transitionScreen"
            ).classList.add(
                "hidden"
            );

            state.paused =
                false;

            showToast(
                "Você despertou em casa. A cama serve para descansar."
            );
        },
        700
    );

    requestAnimationFrame(
        gameLoop
    );
}

/* =========================================================
   RESET DO MUNDO
========================================================= */

function resetWorld() {
    state.world =
        createEmptyWorld(
            REGIONS[
                state.area
            ]
        );
}

/* =========================================================
   OBJETOS DO MUNDO
========================================================= */

function addObstacle(
    x,
    y,
    w,
    h,
    type,
    extra = {}
) {
    state.world
        .obstacles
        .push({
            x,
            y,
            w,
            h,
            type,
            ...extra
        });
}

function addInteriorObstacle(
    x,
    y,
    w,
    h,
    type,
    extra = {}
) {
    state.world
        .interiorObstacles
        .push({
            x,
            y,
            w,
            h,
            type,
            ...extra
        });
}

function addBuilding(
    id,
    x,
    y,
    w,
    h,
    name,
    roof,
    color
) {
    const building = {
        id,
        x,
        y,
        w,
        h,
        name,
        roof,
        color
    };

    state.world
        .buildings
        .push(
            building
        );

    addObstacle(
        x - 24,
        y - 95,
        w + 48,
        h + 95,
        "building",
        {
            buildingId:
                id
        }
    );

    return building;
}

function addTree(
    x,
    y,
    id
) {
    const tree = {
        id,
        x,
        y,

        alive: true,

        amount:
            randomInt(
                2,
                5
            ),

        respawn: 0
    };

    state.world
        .trees
        .push(
            tree
        );

    addObstacle(
        x - 30,
        y - 38,
        60,
        76,
        "tree",
        {
            treeId:
                id
        }
    );

    return tree;
}

function addResource(
    x,
    y,
    type
) {
    state.world
        .resources
        .push({
            id:
                uid(
                    "resource"
                ),

            x,
            y,
            type,

            alive:
                true,

            amount:
                randomInt(
                    1,
                    3
                ),

            respawn:
                0
        });
}

function addFood(
    x,
    y,
    type = "carrot",
    extra = {}
) {
    state.world
        .foods
        .push({
            id:
                uid(
                    "food"
                ),

            x,
            y,
            type,

            alive:
                true,

            respawn:
                0,

            ...extra
        });
}

function addSecret(
    x,
    y,
    title,
    message,
    icon = "✦"
) {
    const stableId =
        "secret_" +
        state.area +
        "_" +
        title
            .normalize(
                "NFD"
            )
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "_"
            )
            .replace(
                /^_|_$/g,
                ""
            );

    state.world
        .secrets
        .push({
            id:
                stableId,

            x,
            y,

            title,
            message,
            icon,

            found:
                Boolean(
                    state.player
                        ?.secretsFound
                        ?.includes(
                            stableId
                        )
                )
        });
}

function addDecoration(
    type,
    x,
    y,
    extra = {}
) {
    state.world
        .decorations
        .push({
            id:
                uid(
                    "decor"
                ),

            type,
            x,
            y,

            ...extra
        });
}

function addTrial(
    x,
    y,
    id,
    title,
    extra = {}
) {
    state.world
        .trials
        .push({
            id,
            x,
            y,

            radius: 38,

            title,

            ...extra
        });
}

function addHazard(
    x,
    y,
    radius,
    delay,
    damage,
    extra = {}
) {
    state.world
        .hazards
        .push({
            id:
                uid(
                    "hazard"
                ),

            x,
            y,
            radius,

            delay,

            maxDelay:
                delay,

            damage,

            life:
                delay +
                0.32,

            triggered:
                false,

            color:
                "rgba(220,52,45,.22)",

            ...extra
        });
}

function addNPC(
    x,
    y,
    name,
    role,
    color,
    lines,
    extra = {}
) {
    state.world
        .npcs
        .push({
            id:
                uid(
                    "npc"
                ),

            x,
            y,

            radius: 17,

            name,
            role,
            color,
            lines,

            ...extra
        });
}

/* =========================================================
   INIMIGOS
========================================================= */

function addEnemy(enemy) {
    if (
        enemy.type ===
        "progression" &&
        state.player
            ?.defeatedBosses
            ?.includes(
                enemy.id
            )
    ) {
        return null;
    }

    const regionIndex =
        getRegionIndex();

    const level =
        state.player
            ?.level ||
        1;

    const regionScale =
        1 +
        regionIndex *
        0.035;

    const levelScale =
        1 +
        Math.max(
            0,
            level -
            1
        ) *
        0.018;

    const baseHp =
        enemy.maxHp ||
        enemy.hp ||
        50;

    const scaledHp =
        Math.round(
            baseHp *
            regionScale *
            levelScale
        );

    const scaledDamage =
        Math.max(
            1,
            Math.round(
                (
                    enemy.damage ||
                    5
                ) *
                (
                    1 +
                    regionIndex *
                    0.025 +
                    Math.max(
                        0,
                        level -
                        1
                    ) *
                    0.009
                )
            )
        );

    const created = {
        state:
            "idle",

        aggressive:
            false,

        accepted:
            false,

        attackTimer:
            0,

        specialTimer:
            random(
                1.8,
                3.8
            ),

        hitFlash:
            0,

        stunTimer:
            0,

        dead:
            false,

        respawnTimer:
            0,

        phase:
            1,

        level:
            Math.max(
                1,
                level +
                Math.floor(
                    regionIndex /
                    2
                )
            ),

        dashState:
            null,

        telegraphing:
            false,

        ...enemy,

        hp:
            scaledHp,

        maxHp:
            scaledHp,

        damage:
            scaledDamage
    };

    state.world
        .enemies
        .push(
            created
        );

    return created;
}

/* =========================================================
   PORTAIS
========================================================= */

function addPortal(
    x,
    y,
    w,
    h,
    target,
    requirement,
    title,
    extra = {}
) {
    state.world
        .portals
        .push({
            id:
                uid(
                    "portal"
                ),

            x,
            y,
            w,
            h,

            target,

            requirement,

            title,

            ...extra
        });
}

function addReturnPortal(
    target,
    title = null
) {
    if (
        !target ||
        !REGIONS[
            target
        ]
    ) {
        return;
    }

    addPortal(
        80,
        state.world.height /
        2 -
        110,
        70,
        220,

        target,

        () => true,

        title ||
        `VOLTAR PARA ${REGIONS[target].name}`,

        {
            returnPortal:
                true,

            entrySide:
                "right"
        }
    );
}

/* =========================================================
   LIMITES DO MAPA
========================================================= */

function addWorldBounds() {
    const edge =
        70;

    addObstacle(
        0,
        0,
        state.world.width,
        edge,
        "wall"
    );

    addObstacle(
        0,
        state.world.height -
        edge,
        state.world.width,
        edge,
        "wall"
    );

    addObstacle(
        0,
        0,
        edge,
        state.world.height,
        "wall"
    );

    addObstacle(
        state.world.width -
        edge,
        0,
        edge,
        state.world.height,
        "wall"
    );
}

/* =========================================================
   CONSTRUIR REGIÃO
========================================================= */

function buildWorld() {
    resetWorld();

    addWorldBounds();

    const builders = {
        village:
            buildVillage,

        forest:
            buildForest,

        grove:
            buildGrove,

        mountains:
            buildMountains,

        iron:
            buildIron,

        ruby:
            buildRuby,

        shadow:
            buildShadow,

        fairy:
            buildFairy,

        sky:
            buildSky,

        hell:
            buildHell,

        final:
            buildFinal
    };

    const builder =
        builders[
            state.area
        ];

    if (
        typeof builder !==
        "function"
    ) {
        throw new Error(
            `Construtor da região não encontrado: ${state.area}`
        );
    }

    builder();

    must(
        "locationLabel"
    ).textContent =
        REGIONS[
            state.area
        ].name;
}

/* =========================================================
   VILA DO CREPÚSCULO
========================================================= */

function buildVillage() {
    addBuilding(
        "home",
        260,
        270,
        430,
        270,
        "CASA DO AVENTUREIRO",
        "#70483a",
        "#ae835e"
    );

    addBuilding(
        "elianHome",
        835,
        255,
        350,
        260,
        "CASA DE ELIAN",
        "#604a3d",
        "#b48961"
    );

    addBuilding(
        "forge",
        2070,
        300,
        500,
        300,
        "FORJA DO FERREIRO",
        "#484744",
        "#8f8172"
    );

    addBuilding(
        "shop",
        2490,
        1310,
        430,
        300,
        "LOJA DE DORAN",
        "#684638",
        "#b4865b"
    );

    addBuilding(
        "woodshop",
        400,
        1560,
        450,
        300,
        "CARPINTARIA",
        "#735638",
        "#a77c4f"
    );

    /*
        Fonte reposicionada para ficar
        realmente central na praça.
    */

    addObstacle(
        1460,
        900,
        280,
        210,
        "fountain"
    );

    addDecoration(
        "fountainPillar",
        1600,
        995
    );

    addDecoration(
        "fountainWater",
        1600,
        995
    );

    /*
        Pedras decorativas.
    */

    [
        [960, 770],
        [1100, 730],
        [1220, 1810],
        [1860, 1640],
        [2210, 930],
        [2740, 880],
        [650, 1170],
        [2380, 1840]
    ]
        .forEach(
            ([x, y]) => {
                addObstacle(
                    x - 30,
                    y - 23,
                    60,
                    46,
                    "rock"
                );
            }
        );

    /*
        Árvores.
    */

    [
        [180, 180],
        [390, 180],
        [650, 170],
        [940, 150],
        [1320, 160],
        [1750, 160],
        [2150, 160],
        [2600, 170],
        [2950, 180],

        [150, 700],
        [180, 1050],
        [190, 1440],

        [250, 1960],
        [1050, 2010],
        [1500, 1980],
        [1950, 2020],
        [2400, 2030],
        [2850, 1960],

        [3040, 1710],
        [3020, 1200],
        [3010, 650],

        [1150, 1000],
        [1860, 720],
        [2180, 720]
    ]
        .forEach(
            (
                [x, y],
                index
            ) => {
                addTree(
                    x,
                    y,
                    `village_tree_${index}`
                );
            }
        );

    /*
        Elian fica do lado de fora.
    */

    addNPC(
        1030,
        610,
        "ELIAN",
        "Morador",
        "#d4b27c",
        [
            "A Quietude parece estar chegando mais perto. Ontem eu esqueci o nome da rua onde cresci.",

            "Meu pai dizia que a primeira coisa que some não é um lugar. É a lembrança de que ele existia.",

            "A estrada leste está estranha. Um Guardião apareceu por lá e não deixa ninguém passar.",

            "Se você descobrir alguma coisa fora da vila, volte. Precisamos de histórias novas para não esquecer as antigas."
        ]
    );

    /*
        Historiadora.
    */

    addNPC(
        1930,
        1090,
        "MARA",
        "Historiadora",
        "#b98bc4",
        [
            "Os registros mais antigos falam da Quietude como se ela já tivesse acontecido antes.",

            "Cada pessoa descreve a Quietude de um jeito diferente. Isso é o que mais me assusta.",

            "Alguns livros têm páginas inteiras em branco, mas a numeração continua como se algo estivesse faltando.",

            "Quando você encontrar algo que não consegue explicar, tente lembrar de cada detalhe antes de voltar."
        ]
    );

    /*
        DORAN FOI REMOVIDO DA RUA.

        Ele será criado somente pelo
        getInteriorNPCs() quando o jogador
        estiver dentro da loja.
    */

    /*
        Bran continua perto da carpintaria.
    */

    addNPC(
        1060,
        1430,
        "BRAN",
        "Carpinteiro",
        "#8d7053",
        [
            "Preciso reforçar algumas casas. A madeira anda apodrecendo mais rápido desde que a Quietude chegou.",

            "As árvores daqui são estranhas. Algumas voltam a nascer longe do lugar onde caíram.",

            "Se puder trazer dez madeiras, eu pago pelo trabalho.",

            "Cortar madeira consome magia. Não se esgote por causa de uma árvore."
        ],
        {
            questId:
                "wood"
        }
    );

    /*
        Borin continua próximo da forja,
        mas não em cima de boss.
    */

    addNPC(
        2260,
        760,
        "BORIN",
        "Ferreiro",
        "#8e8d89",
        [
            "O fogo da forja ainda lembra como queimar. Por enquanto.",

            "Carvão bom está ficando difícil de encontrar.",

            "Se trouxer oito carvões, posso compensar seu esforço.",

            "Equipamento é investimento. Sobreviver costuma sair mais barato que morrer."
        ],
        {
            questId:
                "coal"
        }
    );

    /*
        Inimigos comuns.
    */

    addEnemy({
        id:
            "village_slime",

        x:
            1260,

        y:
            760,

        name:
            "LIMO DA QUIETUDE",

        icon:
            "🟢",

        type:
            "normal",

        hp:
            58,

        maxHp:
            58,

        damage:
            8,

        speed:
            56,

        vision:
            190,

        attackRange:
            55,

        radius:
            18,

        color:
            "#6c9862",

        drop:
            "carvao",

        dropAmount:
            1,

        dropChance:
            0.55
    });

    addEnemy({
        id:
            "village_wolf",

        x:
            2180,

        y:
            1470,

        name:
            "LOBO ESQUECIDO",

        icon:
            "🐺",

        type:
            "normal",

        hp:
            82,

        maxHp:
            82,

        damage:
            12,

        speed:
            92,

        vision:
            260,

        attackRange:
            65,

        radius:
            21,

        color:
            "#686d78",

        drop:
            "couro",

        dropAmount:
            1,

        dropChance:
            0.65
    });

    addEnemy({
        id:
            "village_resource_boss",

        x:
            2310,

        y:
            1820,

        name:
            "CERVO ANCESTRAL",

        icon:
            "🦌",

        type:
            "resourceBoss",

        hp:
            430,

        maxHp:
            430,

        damage:
            18,

        speed:
            64,

        vision:
            290,

        attackRange:
            75,

        radius:
            30,

        color:
            "#788762",

        drop:
            "carneCaca",

        dropAmount:
            3,

        dropChance:
            1,

        respawnTime:
            60,

        special:
            "natureBurst"
    });

    /*
        Boss principal da saída.
        Agora possui habilidade especial.
    */

    addEnemy({
        id:
            "forest_guardian",

        x:
            2830,

        y:
            1090,

        name:
            "GUARDIÃO DA ESTRADA",

        icon:
            "👺",

        type:
            "progression",

        hp:
            320,

        maxHp:
            320,

        damage:
            21,

        speed:
            63,

        vision:
            350,

        attackRange:
            82,

        radius:
            31,

        color:
            "#945149",

        drop:
            "cristal",

        dropAmount:
            2,

        dropChance:
            1,

        unlock:
            "forest",

        special:
            "memoryWave"
    });

    /*
        Portal para floresta.
    */

    addPortal(
        3060,
        1000,
        70,
        220,

        "forest",

        () =>
            hasDefeatedBoss(
                "forest_guardian"
            ),

        "FLORESTA",

        {
            entrySide:
                "left"
        }
    );

    /*
        Decoração da praça.
    */

    [
        [760, 1260],
        [840, 1315],
        [920, 1265],
        [1820, 1210],
        [1900, 1250],
        [2000, 1220]
    ]
        .forEach(
            (
                [x, y],
                index
            ) => {
                addDecoration(
                    index %
                    2
                        ? "flowerPot"
                        : "barrel",

                    x,
                    y
                );
            }
        );

    /*
        Comida rara na vila.

        A cenoura agora recupera menos fome.
    */

    addFood(
        1340,
        1450,
        "carrot",
        {
            hunger:
                12,

            respawnMin:
                110,

            respawnMax:
                170
        }
    );

    addFood(
        1425,
        1510,
        "carrot",
        {
            hunger:
                12,

            respawnMin:
                110,

            respawnMax:
                170
        }
    );
}

/* =========================================================
   FLORESTA
========================================================= */

function buildForest() {
    /*
        Portal de retorno.
    */

    addReturnPortal(
        "village",
        "VOLTAR PARA A VILA"
    );

    const pathY =
        x =>
            1220 +
            Math.sin(
                x /
                320
            ) *
            150;

    /*
        Caminho de pedra.
    */

    for (
        let x = 180;
        x <
        3280;
        x +=
        62
    ) {
        const y =
            pathY(
                x
            );

        addDecoration(
            "pathStone",
            x,
            y +
            random(
                -34,
                34
            ),
            {
                size:
                    random(
                        18,
                        33
                    ),

                angle:
                    random(
                        -0.65,
                        0.65
                    )
            }
        );

        if (
            Math.floor(
                x /
                62
            ) %
            4 ===
            0
        ) {
            addDecoration(
                "mushroom",
                x +
                random(
                    -70,
                    70
                ),
                y +
                random(
                    110,
                    180
                ),
                {
                    glow:
                        Math.random() <
                        0.28
                }
            );
        }
    }

    /*
        Árvores mais densas ao redor
        do caminho.
    */

    let planted =
        0;

    let tries =
        0;

    while (
        planted <
        88 &&
        tries <
        1000
    ) {
        tries++;

        const x =
            randomInt(
                155,
                3270
            );

        const y =
            randomInt(
                130,
                2260
            );

        if (
            Math.abs(
                y -
                pathY(
                    x
                )
            ) <
            165
        ) {
            continue;
        }

        addTree(
            x,
            y,
            `forest_tree_${planted}`
        );

        planted++;
    }

    /*
        Troncos, arbustos e decoração.
    */

    [
        [430, 680],
        [760, 1850],
        [1120, 520],
        [1510, 1930],
        [1900, 620],
        [2240, 1840],
        [2560, 720],
        [2860, 1650],
        [3070, 530],
        [1680, 430],
        [980, 1540],
        [2380, 1350]
    ]
        .forEach(
            (
                [x, y],
                index
            ) => {
                addDecoration(
                    index %
                    3 ===
                    0
                        ? "fallenLog"
                        : "bush",

                    x,
                    y
                );
            }
        );

    /*
        Cenouras mais raras.
    */

    [
        [620, 1120],
        [1040, 1335],
        [2050, 1350],
        [2920, 1260]
    ]
        .forEach(
            ([x, y]) => {
                addFood(
                    x,
                    y,
                    "carrot",
                    {
                        hunger:
                            12,

                        respawnMin:
                            130,

                        respawnMax:
                            190
                    }
                );
            }
        );

    /*
        Minérios.
    */

    [
        [650, 480, "carvao"],
        [1230, 1880, "carvao"],
        [1750, 540, "ferro"],
        [2170, 1830, "carvao"],
        [2710, 510, "ferro"],
        [3030, 1830, "carvao"],
        [1540, 1690, "ferro"],
        [2350, 440, "carvao"]
    ]
        .forEach(
            (
                [
                    x,
                    y,
                    type
                ]
            ) => {
                addResource(
                    x,
                    y,
                    type
                );
            }
        );

    /*
        Easter eggs.
    */

    addSecret(
        420,
        2020,

        "O Boneco que Lembra",

        "Você encontrou um espantalho antigo com o seu nome escrito antes mesmo de você chegar à floresta.",

        "🧸"
    );

    addSecret(
        2820,
        360,

        "Círculo das Raposas",

        "Pedras formam um círculo perfeito. No centro há marcas de pequenas patas que desaparecem no nada.",

        "🦊"
    );

    /*
        NPC.
    */

    addNPC(
        720,
        860,

        "NARA",

        "Guardião da Floresta",

        "#7ea56b",

        [
            "A floresta percebe quem passa por ela.",

            "Há árvores que se movem quando ninguém está olhando.",

            "A Quietude não mata todas as coisas. Algumas continuam andando sem lembrar por quê.",

            "Siga as pedras. Elas foram colocadas antes de os moradores esquecerem o caminho."
        ]
    );

    /*
        Javalis e lobos.
    */

    for (
        let i = 0;
        i <
        12;
        i++
    ) {
        const boar =
            i %
            2 ===
            0;

        addEnemy({
            id:
                `forest_enemy_${i}`,

            x:
                randomInt(
                    520,
                    2820
                ),

            y:
                randomInt(
                    310,
                    2060
                ),

            name:
                boar
                    ? "JAVALI DA MATA"
                    : "LOBO FLORESTAL",

            icon:
                boar
                    ? "🐗"
                    : "🐺",

            type:
                "normal",

            hp:
                boar
                    ? 116
                    : 102,

            maxHp:
                boar
                    ? 116
                    : 102,

            damage:
                boar
                    ? 16
                    : 14,

            speed:
                boar
                    ? 80
                    : 98,

            vision:
                275,

            attackRange:
                66,

            radius:
                boar
                    ? 24
                    : 22,

            color:
                boar
                    ? "#715b43"
                    : "#67726e",

            drop:
                boar
                    ? "carneCaca"
                    : "couro",

            dropAmount:
                1,

            dropChance:
                boar
                    ? 0.82
                    : 0.65,

            special:
                i >=
                7
                    ? "dash"
                    : null
        });
    }

    /*
        Cervo raro.
    */

    addEnemy({
        id:
            "forest_resource_boss",

        x:
            2460,

        y:
            1760,

        name:
            "CERVO DA LUA VERDE",

        icon:
            "🦌",

        type:
            "resourceBoss",

        hp:
            560,

        maxHp:
            560,

        damage:
            23,

        speed:
            64,

        vision:
            320,

        attackRange:
            78,

        radius:
            33,

        color:
            "#789066",

        drop:
            "carneCaca",

        dropAmount:
            3,

        dropChance:
            1,

        respawnTime:
            70,

        special:
            "natureBurst"
    });

    /*
        Guardião da Floresta.
    */

    addEnemy({
        id:
            "grove_guardian",

        x:
            2990,

        y:
            pathY(
                2990
            ),

        name:
            "GUARDIÃO DA FLORESTA",

        icon:
            "🌳",

        type:
            "progression",

        hp:
            520,

        maxHp:
            520,

        damage:
            28,

        speed:
            62,

        vision:
            370,

        attackRange:
            92,

        radius:
            38,

        color:
            "#416d43",

        drop:
            "fragmentoMemoria",

        dropAmount:
            2,

        dropChance:
            1,

        unlock:
            "grove",

        special:
            "rootCircle"
    });

    addPortal(
        3260,
        pathY(
            3260
        ) -
        105,

        70,
        220,

        "grove",

        () =>
            hasDefeatedBoss(
                "grove_guardian"
            ),

        "BOSQUE",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   BOSQUE
========================================================= */

function buildGrove() {
    addReturnPortal(
        "forest",
        "VOLTAR PARA A FLORESTA"
    );

    /*
        Caminho diferente da floresta:
        duas curvas que se encontram.
    */

    const pathY =
        x =>
            1110 +
            Math.sin(
                x /
                230
            ) *
            115 +
            Math.sin(
                x /
                83
            ) *
            22;

    for (
        let x = 170;
        x <
        3100;
        x +=
        58
    ) {
        addDecoration(
            "pathStone",
            x,
            pathY(
                x
            ) +
            random(
                -26,
                26
            ),
            {
                size:
                    random(
                        15,
                        29
                    ),

                moss:
                    true
            }
        );
    }

    /*
        Pequena bifurcação.
    */

    for (
        let i = 0;
        i <
        18;
        i++
    ) {
        addDecoration(
            "pathStone",

            1330 +
            i *
            42,

            1080 +
            i *
            29,

            {
                size:
                    random(
                        15,
                        24
                    ),

                moss:
                    true
            }
        );
    }

    let count =
        0;

    let guard =
        0;

    while (
        count <
        68 &&
        guard++ <
        900
    ) {
        const x =
            randomInt(
                140,
                3040
            );

        const y =
            randomInt(
                140,
                2160
            );

        if (
            Math.abs(
                y -
                pathY(
                    x
                )
            ) <
            145
        ) {
            continue;
        }

        addTree(
            x,
            y,
            `grove_tree_${count}`
        );

        count++;
    }

    for (
        let i = 0;
        i <
        36;
        i++
    ) {
        addDecoration(
            i %
            5 ===
            0
                ? "ancientRoot"
                : i %
                  3 ===
                  0
                ? "glowingFlower"
                : "flower",

            randomInt(
                190,
                3000
            ),

            randomInt(
                180,
                2100
            ),

            {
                phase:
                    random(
                        0,
                        Math.PI *
                        2
                    )
            }
        );
    }

    /*
        Pouca comida.
    */

    [
        [520, 920],
        [1380, 980],
        [2010, 1260]
    ]
        .forEach(
            ([x, y]) => {
                addFood(
                    x,
                    y,
                    "carrot",
                    {
                        hunger:
                            12,

                        respawnMin:
                            145,

                        respawnMax:
                            210
                    }
                );
            }
        );

    addSecret(
        650,
        1900,

        "Estátua Sem Rosto",

        "A estátua perdeu o rosto, mas alguém continua deixando flores frescas aos seus pés.",

        "🗿"
    );

    addSecret(
        2460,
        410,

        "Árvore dos Nomes",

        "Centenas de nomes foram entalhados na casca. Alguns desaparecem enquanto você observa.",

        "🌳"
    );

    addNPC(
        1340,
        780,

        "LYRA",

        "Druida",

        "#829f6f",

        [
            "Este bosque guarda memórias nas raízes.",

            "Quando uma árvore cai, às vezes outra nasce carregando lembranças que não são dela.",

            "As montanhas ficam além deste lugar.",

            "O Guardião do Bosque não odeia viajantes. Ele só esqueceu a diferença entre ameaça e visita."
        ]
    );

    for (
        let i = 0;
        i <
        10;
        i++
    ) {
        const deer =
            i %
            3 ===
            0;

        addEnemy({
            id:
                `grove_enemy_${i}`,

            x:
                randomInt(
                    430,
                    2700
                ),

            y:
                randomInt(
                    290,
                    1960
                ),

            name:
                deer
                    ? "CERVO DO BOSQUE"
                    : "FERA DO BOSQUE",

            icon:
                deer
                    ? "🦌"
                    : "🐗",

            type:
                "normal",

            hp:
                deer
                    ? 142
                    : 150,

            maxHp:
                deer
                    ? 142
                    : 150,

            damage:
                deer
                    ? 16
                    : 19,

            speed:
                deer
                    ? 92
                    : 84,

            vision:
                285,

            attackRange:
                68,

            radius:
                24,

            color:
                deer
                    ? "#8d7959"
                    : "#60745e",

            drop:
                deer
                    ? "carneCaca"
                    : "couro",

            dropAmount:
                1,

            dropChance:
                0.76,

            special:
                i >=
                6
                    ? "dash"
                    : null
        });
    }

    addEnemy({
        id:
            "mountain_guardian",

        x:
            2760,

        y:
            1120,

        name:
            "GUARDIÃO DO BOSQUE",

        icon:
            "🌲",

        type:
            "progression",

        hp:
            610,

        maxHp:
            610,

        damage:
            31,

        speed:
            61,

        vision:
            380,

        attackRange:
            94,

        radius:
            39,

        color:
            "#4f744f",

        drop:
            "fragmentoMemoria",

        dropAmount:
            2,

        dropChance:
            1,

        unlock:
            "mountains",

        special:
            "leafStorm"
    });

    addPortal(
        3060,
        1010,
        70,
        220,

        "mountains",

        () =>
            hasDefeatedBoss(
                "mountain_guardian"
            ),

        "MONTANHAS",

        {
            entrySide:
                "left"
        }
    );
}
