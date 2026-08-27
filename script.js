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
   /* =========================================================
   MONTANHAS
========================================================= */

function buildMountains() {
    addReturnPortal(
        "grove",
        "VOLTAR PARA O BOSQUE"
    );

    /*
        Trilha principal das montanhas.
    */

    const mountainPathY =
        x =>
            1140 +
            Math.sin(
                x /
                360
            ) *
            105;

    for (
        let x = 180;
        x <
        3360;
        x +=
        72
    ) {
        addDecoration(
            "mountainPath",
            x,
            mountainPathY(
                x
            ) +
            random(
                -30,
                30
            ),
            {
                size:
                    random(
                        22,
                        38
                    ),

                angle:
                    random(
                        -0.5,
                        0.5
                    )
            }
        );
    }

    /*
        Rochas variadas.
    */

    for (
        let i = 0;
        i <
        54;
        i++
    ) {
        const type =
            i %
            8 ===
            0
                ? "iceRock"
                : i %
                  5 ===
                  0
                ? "oreRock"
                : i %
                  3 ===
                  0
                ? "darkMountainRock"
                : "snowrock";

        let x;
        let y;
        let attempts =
            0;

        do {
            x =
                randomInt(
                    170,
                    3320
                );

            y =
                randomInt(
                    150,
                    2130
                );

            attempts++;
        }
        while (
            Math.abs(
                y -
                mountainPathY(
                    x
                )
            ) <
                105 &&
            attempts <
                40
        );

        addObstacle(
            x,
            y,
            randomInt(
                48,
                108
            ),
            randomInt(
                36,
                78
            ),
            type
        );
    }

    /*
        Pequenas árvores resistentes
        das montanhas.
    */

    for (
        let i = 0;
        i <
        18;
        i++
    ) {
        addDecoration(
            "mountainPine",

            randomInt(
                250,
                3200
            ),

            randomInt(
                210,
                2040
            ),

            {
                scale:
                    random(
                        0.75,
                        1.2
                    )
            }
        );
    }

    /*
        Neve e vento.
    */

    for (
        let i = 0;
        i <
        42;
        i++
    ) {
        addDecoration(
            i %
            5 ===
            0
                ? "snowDrift"
                : "windMark",

            randomInt(
                150,
                3330
            ),

            randomInt(
                140,
                2150
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
        Minérios espalhados.
    */

    [
        [450, 430, "ferro"],
        [720, 1710, "ferro"],
        [1050, 650, "ouro"],
        [1450, 1780, "ferro"],
        [1860, 530, "ferro"],
        [2250, 1740, "ouro"],
        [2700, 610, "ferro"],
        [3060, 1640, "ferro"],
        [1600, 1110, "ouro"],
        [1180, 430, "ferro"],
        [2440, 420, "ouro"],
        [2890, 1940, "ferro"]
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
        3050,
        370,

        "Espada Congelada",

        "Uma espada sem dono está presa no gelo. O nome no cabo foi raspado muitas vezes.",

        "🗡️"
    );

    addSecret(
        460,
        1920,

        "Pegadas Impossíveis",

        "As pegadas começam no meio da neve, seguem por alguns metros e simplesmente terminam.",

        "👣"
    );

    /*
        NPC montanhista.
    */

    addNPC(
        760,
        930,

        "KAEL",

        "Montanhista",

        "#d2d6d2",

        [
            "O vento daqui apaga pegadas em minutos.",

            "Minérios abaixo da neve ainda reagem à magia.",

            "As bestas da montanha servem de alimento, mas caçá-las é arriscado.",

            "A Sentinela lança pedras antes de avançar. Quando o chão ficar vermelho, saia do círculo."
        ]
    );

    /*
        Bestas e cervos.
    */

    for (
        let i = 0;
        i <
        12;
        i++
    ) {
        const deer =
            i %
            3 ===
            0;

        addEnemy({
            id:
                `mountain_enemy_${i}`,

            x:
                randomInt(
                    460,
                    2950
                ),

            y:
                randomInt(
                    280,
                    1940
                ),

            name:
                deer
                    ? "CERVO DA NEVE"
                    : "BESTA DAS MONTANHAS",

            icon:
                deer
                    ? "🦌"
                    : "🐐",

            type:
                "normal",

            hp:
                deer
                    ? 168
                    : 190,

            maxHp:
                deer
                    ? 168
                    : 190,

            damage:
                deer
                    ? 20
                    : 24,

            speed:
                deer
                    ? 86
                    : 74,

            vision:
                310,

            attackRange:
                deer
                    ? 70
                    : 90,

            radius:
                25,

            color:
                deer
                    ? "#d7d4c9"
                    : "#bec5c7",

            drop:
                deer
                    ? "carneCaca"
                    : "couro",

            dropAmount:
                1,

            dropChance:
                0.8,

            special:
                deer
                    ? "dash"
                    : "rockThrow"
        });
    }

    /*
        Boss das montanhas.
    */

    addEnemy({
        id:
            "iron_guardian",

        x:
            3000,

        y:
            1110,

        name:
            "SENTINELA DAS MONTANHAS",

        icon:
            "🗿",

        type:
            "progression",

        hp:
            760,

        maxHp:
            760,

        damage:
            37,

        speed:
            59,

        vision:
            410,

        attackRange:
            105,

        radius:
            41,

        color:
            "#697176",

        drop:
            "fragmentoMemoria",

        dropAmount:
            3,

        dropChance:
            1,

        unlock:
            "iron",

        special:
            "rockStorm"
    });

    /*
        Próxima região.
    */

    addPortal(
        3300,
        1000,
        70,
        230,

        "iron",

        () =>
            hasDefeatedBoss(
                "iron_guardian"
            ),

        "CAVERNA DE FERRO",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CAVERNA DE FERRO
========================================================= */

function buildIron() {
    addReturnPortal(
        "mountains",
        "VOLTAR PARA AS MONTANHAS"
    );

    /*
        Estrada de mineração.
    */

    for (
        let x = 180;
        x <
        2760;
        x +=
        78
    ) {
        addDecoration(
            "rail",
            x,
            960 +
            Math.sin(
                x /
                280
            ) *
            90,
            {
                angle:
                    Math.sin(
                        x /
                        420
                    ) *
                    0.1
            }
        );
    }

    /*
        Rochas e paredes.
    */

    for (
        let i = 0;
        i <
        40;
        i++
    ) {
        addObstacle(
            randomInt(
                150,
                2700
            ),

            randomInt(
                150,
                1700
            ),

            randomInt(
                50,
                95
            ),

            randomInt(
                38,
                70
            ),

            i %
            5 ===
            0
                ? "oreRock"
                : "ironrock"
        );
    }

    /*
        Minério abundante.
    */

    for (
        let i = 0;
        i <
        34;
        i++
    ) {
        addResource(
            randomInt(
                210,
                2630
            ),

            randomInt(
                190,
                1650
            ),

            i %
            8 ===
            0
                ? "ouro"
                : "ferro"
        );
    }

    /*
        Decoração da mina.
    */

    for (
        let i = 0;
        i <
        34;
        i++
    ) {
        const type =
            i %
            7 ===
            0
                ? "mineCart"
                : i %
                  5 ===
                  0
                ? "mineLantern"
                : i %
                  3 ===
                  0
                ? "woodSupport"
                : "stalagmite";

        addDecoration(
            type,

            randomInt(
                190,
                2700
            ),

            randomInt(
                170,
                1700
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

    addSecret(
        520,
        1540,

        "Capacete Abandonado",

        "Há um capacete coberto de poeira. Dentro dele, uma anotação diz apenas: 'não siga a voz da parede'.",

        "⛑️"
    );

    addSecret(
        2290,
        340,

        "A Parede que Sussurra",

        "Por alguns segundos você ouve seu próprio nome vindo de dentro da pedra.",

        "👂"
    );

    /*
        Mineiros corrompidos.
    */

    for (
        let i = 0;
        i <
        11;
        i++
    ) {
        addEnemy({
            id:
                `iron_enemy_${i}`,

            x:
                randomInt(
                    420,
                    2300
                ),

            y:
                randomInt(
                    250,
                    1540
                ),

            name:
                "MINEIRO CORROMPIDO",

            icon:
                "⛏️",

            type:
                "normal",

            hp:
                205,

            maxHp:
                205,

            damage:
                25,

            speed:
                65,

            vision:
                290,

            attackRange:
                78,

            radius:
                25,

            color:
                "#626a6d",

            drop:
                i %
                4 ===
                0
                    ? "ouro"
                    : "ferro",

            dropAmount:
                1,

            dropChance:
                0.64,

            special:
                i >=
                5
                    ? "oreBurst"
                    : null
        });
    }

    /*
        Guardião de Ferro.
    */

    addEnemy({
        id:
            "ruby_guardian",

        x:
            2450,

        y:
            950,

        name:
            "GUARDIÃO DE FERRO",

        icon:
            "⚙️",

        type:
            "progression",

        hp:
            860,

        maxHp:
            860,

        damage:
            41,

        speed:
            58,

        vision:
            420,

        attackRange:
            106,

        radius:
            42,

        color:
            "#70787d",

        drop:
            "fragmentoMemoria",

        dropAmount:
            3,

        dropChance:
            1,

        unlock:
            "ruby",

        special:
            "oreBurst"
    });

    addPortal(
        2750,
        840,
        70,
        230,

        "ruby",

        () =>
            hasDefeatedBoss(
                "ruby_guardian"
            ),

        "CAVERNA DE RUBI",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CAVERNA DE RUBI
========================================================= */

function buildRuby() {
    addReturnPortal(
        "iron",
        "VOLTAR PARA A CAVERNA DE FERRO"
    );

    /*
        Cristais gigantes.
    */

    for (
        let i = 0;
        i <
        42;
        i++
    ) {
        addObstacle(
            randomInt(
                170,
                2880
            ),

            randomInt(
                170,
                1900
            ),

            randomInt(
                48,
                92
            ),

            randomInt(
                38,
                76
            ),

            i %
            4 ===
            0
                ? "rubyPillar"
                : "rubyrock"
        );
    }

    /*
        Recursos.
    */

    for (
        let i = 0;
        i <
        38;
        i++
    ) {
        addResource(
            randomInt(
                220,
                2860
            ),

            randomInt(
                190,
                1870
            ),

            i %
            8 ===
            0
                ? "ouro"
                : "rubi"
        );
    }

    /*
        Fragmentos luminosos.
    */

    for (
        let i = 0;
        i <
        46;
        i++
    ) {
        addDecoration(
            i %
            4 ===
            0
                ? "crystalPillar"
                : i %
                  3 ===
                  0
                ? "crystalCluster"
                : "crystalShard",

            randomInt(
                180,
                2920
            ),

            randomInt(
                170,
                1920
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

    addSecret(
        2700,
        420,

        "Coração Rubi",

        "Um cristal pulsa como um coração. Quando você se aproxima, ele repete uma lembrança que você ainda não viveu.",

        "❤️"
    );

    addSecret(
        580,
        1760,

        "Reflexo Incorreto",

        "Seu reflexo em um rubi se move um instante antes de você.",

        "♦"
    );

    /*
        Criaturas rubi.
    */

    for (
        let i = 0;
        i <
        12;
        i++
    ) {
        addEnemy({
            id:
                `ruby_enemy_${i}`,

            x:
                randomInt(
                    400,
                    2600
                ),

            y:
                randomInt(
                    260,
                    1780
                ),

            name:
                "CRIATURA RUBI",

            icon:
                "♦",

            type:
                "normal",

            hp:
                242,

            maxHp:
                242,

            damage:
                29,

            speed:
                73,

            vision:
                305,

            attackRange:
                84,

            radius:
                26,

            color:
                "#a34554",

            drop:
                "rubi",

            dropAmount:
                1,

            dropChance:
                0.7,

            special:
                i >=
                4
                    ? "crystalShot"
                    : null
        });
    }

    /*
        Guardião Rubi.
    */

    addEnemy({
        id:
            "shadow_guardian",

        x:
            2620,

        y:
            1010,

        name:
            "GUARDIÃO RUBI",

        icon:
            "🔴",

        type:
            "progression",

        hp:
            990,

        maxHp:
            990,

        damage:
            46,

        speed:
            62,

        vision:
            430,

        attackRange:
            110,

        radius:
            43,

        color:
            "#a33b4f",

        drop:
            "fragmentoMemoria",

        dropAmount:
            3,

        dropChance:
            1,

        unlock:
            "shadow",

        special:
            "crystalRain"
    });

    addPortal(
        2920,
        890,
        70,
        230,

        "shadow",

        () =>
            hasDefeatedBoss(
                "shadow_guardian"
            ),

        "CAVERNA SOMBRIA",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CAVERNA SOMBRIA
========================================================= */

function buildShadow() {
    addReturnPortal(
        "ruby",
        "VOLTAR PARA A CAVERNA DE RUBI"
    );

    /*
        Rochas escuras.
    */

    for (
        let i = 0;
        i <
        34;
        i++
    ) {
        addObstacle(
            randomInt(
                170,
                2720
            ),

            randomInt(
                170,
                1800
            ),

            randomInt(
                52,
                92
            ),

            randomInt(
                38,
                68
            ),

            "darkrock"
        );
    }

    /*
        Névoa e olhos distantes.
    */

    for (
        let i = 0;
        i <
        34;
        i++
    ) {
        addDecoration(
            i %
            7 ===
            0
                ? "shadowEye"
                : "shadowMist",

            randomInt(
                170,
                2830
            ),

            randomInt(
                150,
                1880
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

    addSecret(
        510,
        410,

        "A Voz sem Corpo",

        "Algo atrás de você sussurra uma frase que sua mãe diria, mas ao virar não existe ninguém.",

        "👁️"
    );

    addSecret(
        2500,
        1690,

        "Porta que Não Existe",

        "Há marcas de dobradiças na parede, embora nenhuma porta tenha sido construída ali.",

        "🚪"
    );

    for (
        let i = 0;
        i <
        11;
        i++
    ) {
        addEnemy({
            id:
                `shadow_enemy_${i}`,

            x:
                randomInt(
                    420,
                    2500
                ),

            y:
                randomInt(
                    260,
                    1700
                ),

            name:
                "SOMBRA ESQUECIDA",

            icon:
                "👤",

            type:
                "normal",

            hp:
                265,

            maxHp:
                265,

            damage:
                30,

            speed:
                79,

            vision:
                310,

            attackRange:
                75,

            radius:
                25,

            color:
                "#49425f",

            drop:
                "essencia",

            dropAmount:
                1,

            dropChance:
                0.68,

            special:
                i >=
                5
                    ? "shadowBurst"
                    : null
        });
    }

    addEnemy({
        id:
            "fairy_guardian",

        x:
            2500,

        y:
            980,

        name:
            "GUARDIÃO SOMBRIO",

        icon:
            "🌑",

        type:
            "progression",

        hp:
            1030,

        maxHp:
            1030,

        damage:
            44,

        speed:
            66,

        vision:
            420,

        attackRange:
            100,

        radius:
            38,

        color:
            "#42364f",

        drop:
            "essencia",

        dropAmount:
            3,

        dropChance:
            1,

        unlock:
            "fairy",

        special:
            "voidCircle"
    });

    addPortal(
        2790,
        860,
        70,
        230,

        "fairy",

        () =>
            hasDefeatedBoss(
                "fairy_guardian"
            ),

        "REINO DAS FADAS",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   REINO DAS FADAS
========================================================= */

function buildFairy() {
    addReturnPortal(
        "shadow",
        "VOLTAR PARA A CAVERNA SOMBRIA"
    );

    /*
        Caminhos luminosos.
    */

    for (
        let x = 170;
        x <
        3060;
        x +=
        68
    ) {
        addDecoration(
            "fairyPath",
            x,
            1120 +
            Math.sin(
                x /
                300
            ) *
            135,
            {
                phase:
                    x /
                    100
            }
        );
    }

    /*
        Flores e cristais.
    */

    for (
        let i = 0;
        i <
        36;
        i++
    ) {
        addResource(
            randomInt(
                200,
                3000
            ),

            randomInt(
                180,
                2000
            ),

            "cristal"
        );
    }

    for (
        let i = 0;
        i <
        52;
        i++
    ) {
        addDecoration(
            i %
            5 ===
            0
                ? "fairyTree"
                : i %
                  3 ===
                  0
                ? "glowingFlower"
                : "fairyFlower",

            randomInt(
                150,
                3050
            ),

            randomInt(
                150,
                2050
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
        Partículas ambientais.
    */

    for (
        let i = 0;
        i <
        30;
        i++
    ) {
        state.world
            .effects
            .push({
                type:
                    "flower",

                x:
                    randomInt(
                        150,
                        3050
                    ),

                y:
                    randomInt(
                        150,
                        2050
                    ),

                phase:
                    random(
                        0,
                        Math.PI *
                        2
                    )
            });
    }

    addSecret(
        420,
        1830,

        "Flor que Diz seu Nome",

        "Quando você toca as pétalas, a flor pronuncia seu nome com uma voz que parece ser a sua.",

        "🌸"
    );

    addSecret(
        2820,
        380,

        "Pequena Casa Vazia",

        "Uma casa minúscula possui uma cama arrumada e uma refeição ainda quente. Ninguém aparece.",

        "🏠"
    );

    addNPC(
        1000,
        1000,

        "AELIA",

        "Habitante das Fadas",

        "#d49ad4",

        [
            "As flores daqui brilham quando alguém lembra de algo importante.",

            "A Quietude não gosta de memórias compartilhadas.",

            "Há caminhos que só aparecem depois que alguém decide não esquecer.",

            "Você trouxe lembranças de lugares que eu nunca vi. Isso já muda este reino."
        ]
    );

    for (
        let i = 0;
        i <
        9;
        i++
    ) {
        addEnemy({
            id:
                `fairy_enemy_${i}`,

            x:
                randomInt(
                    450,
                    2700
                ),

            y:
                randomInt(
                    270,
                    1800
                ),

            name:
                "ESPÍRITO FEÉRICO",

            icon:
                "🦋",

            type:
                "normal",

            hp:
                285,

            maxHp:
                285,

            damage:
                32,

            speed:
                93,

            vision:
                320,

            attackRange:
                78,

            radius:
                24,

            color:
                "#b887be",

            drop:
                "cristal",

            dropAmount:
                1,

            dropChance:
                0.7,

            special:
                i >=
                4
                    ? "fairyBurst"
                    : null
        });
    }

    addEnemy({
        id:
            "sky_guardian",

        x:
            2700,

        y:
            1050,

        name:
            "GUARDIÃ DOS FIOS",

        icon:
            "🧚",

        type:
            "progression",

        hp:
            1160,

        maxHp:
            1160,

        damage:
            47,

        speed:
            73,

        vision:
            440,

        attackRange:
            102,

        radius:
            39,

        color:
            "#cb8dd0",

        drop:
            "essencia",

        dropAmount:
            4,

        dropChance:
            1,

        unlock:
            "sky",

        special:
            "fairyStorm"
    });

    addPortal(
        3000,
        930,
        70,
        230,

        "sky",

        () =>
            hasDefeatedBoss(
                "sky_guardian"
            ),

        "PASSAGEM CELESTE",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CÉU
========================================================= */

function buildSky() {
    addReturnPortal(
        "fairy",
        "VOLTAR PARA O REINO DAS FADAS"
    );

    /*
        Nuvens, ruínas e pilares.
    */

    for (
        let i = 0;
        i <
        44;
        i++
    ) {
        addDecoration(
            i %
            6 ===
            0
                ? "celestialPillar"
                : i %
                  4 ===
                  0
                ? "skyRuin"
                : "cloud",

            randomInt(
                160,
                3220
            ),

            randomInt(
                140,
                2050
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
        Caminho celestial até o altar.
    */

    for (
        let x = 180;
        x <
        3150;
        x +=
        82
    ) {
        addDecoration(
            "skyPath",

            x,

            1110 +
            Math.sin(
                x /
                340
            ) *
            80,

            {
                phase:
                    x /
                    180
            }
        );
    }

    for (
        let i = 0;
        i <
        20;
        i++
    ) {
        addResource(
            randomInt(
                220,
                3080
            ),

            randomInt(
                180,
                1940
            ),

            "cristal"
        );
    }

    addNPC(
        1050,
        830,

        "AERIS",

        "Guardião Celeste",

        "#c7d4df",

        [
            "O Céu é preparação, não o fim.",

            "Cinco hordas guardam o caminho para aquele que protege a passagem.",

            "Vença todas. Depois enfrente o Guardião do Caminho.",

            "A Flauta da Memória não abre uma porta. Ela faz o mundo lembrar que uma escada existia."
        ]
    );

    /*
        Patrulhas.
    */

    for (
        let i = 0;
        i <
        7;
        i++
    ) {
        addEnemy({
            id:
                `sky_patrol_${i}`,

            x:
                450 +
                i *
                390,

            y:
                i %
                2
                    ? 520
                    : 1730,

            name:
                "SERAFIM ERRANTE",

            icon:
                "🪽",

            type:
                "normal",

            hp:
                335,

            maxHp:
                335,

            damage:
                36,

            speed:
                98,

            vision:
                345,

            attackRange:
                84,

            radius:
                27,

            color:
                "#d3dde3",

            drop:
                "cristal",

            dropAmount:
                1,

            dropChance:
                0.63,

            special:
                i >=
                3
                    ? "crystalShot"
                    : null
        });
    }

    /*
        Altar das hordas.
    */

    addTrial(
        1710,
        1100,

        "sky_hordes",

        "ALTAR DAS CINCO HORDAS"
    );

    if (
        !state.player
            .skyTrial
            ?.complete
    ) {
        addDecoration(
            "trialAltar",
            1710,
            1100
        );
    }

    if (
        state.player
            .skyTrial
            ?.complete &&
        !hasDefeatedBoss(
            "path_guardian"
        )
    ) {
        spawnPathGuardian();
    }

    /*
        Escada do Inferno.

        Só aparece depois da Flauta.
    */

    addPortal(
        3260,
        960,
        72,
        250,

        "hell",

        () =>
            hasDefeatedBoss(
                "path_guardian"
            ) &&
            Boolean(
                state.player
                    .flutePlayed
            ),

        "ESCADA DO INFERNO",

        {
            stairs:
                true,

            entrySide:
                "left",

            visible:
                () =>
                    Boolean(
                        state.player
                            .flutePlayed
                    )
        }
    );

    addSecret(
        420,
        350,

        "Banco nas Nuvens",

        "Alguém deixou um banco olhando para o vazio. No encosto está gravado: 'eu esperaria você de novo'.",

        "☁️"
    );

    addSecret(
        2770,
        1840,

        "Sino sem Som",

        "O sino se move com o vento, mas não produz nenhum som. Mesmo assim, você tem certeza de ter ouvido algo.",

        "🔔"
    );
}

/* =========================================================
   INFERNO
========================================================= */

function buildHell() {
    addReturnPortal(
        "sky",
        "SUBIR DE VOLTA AO CÉU"
    );

    /*
        Rochas e formações infernais.
    */

    for (
        let i = 0;
        i <
        48;
        i++
    ) {
        addObstacle(
            randomInt(
                170,
                3380
            ),

            randomInt(
                160,
                2150
            ),

            randomInt(
                55,
                110
            ),

            randomInt(
                40,
                82
            ),

            i %
            5 ===
            0
                ? "obsidian"
                : "basalt"
        );
    }

    /*
        Lagos de lava, fumaça, caveiras etc.
    */

    for (
        let i = 0;
        i <
        50;
        i++
    ) {
        const type =
            i %
            8 ===
            0
                ? "hellBones"
                : i %
                  6 ===
                  0
                ? "lavaPool"
                : i %
                  4 ===
                  0
                ? "hellSmoke"
                : "emberVent";

        addDecoration(
            type,

            randomInt(
                160,
                3400
            ),

            randomInt(
                150,
                2200
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
        Caminho de pedra negra.
    */

    for (
        let x = 190;
        x <
        3420;
        x +=
        75
    ) {
        addDecoration(
            "hellPath",

            x,

            1190 +
            Math.sin(
                x /
                260
            ) *
            125,

            {
                size:
                    random(
                        22,
                        36
                    )
            }
        );
    }

    addSecret(
        450,
        2050,

        "Nome Gravado na Cinza",

        `Entre milhares de nomes está escrito "${state.player.name}". A inscrição parece muito mais antiga que você.`,

        "🔥"
    );

    addSecret(
        3030,
        390,

        "Trono Vazio",

        "Um trono destruído possui marcas de garras em ambos os braços. Alguma coisa esteve sentada aqui por muito tempo.",

        "👑"
    );

    /*
        Cinco tipos obrigatórios de criaturas.
    */

    const types = [
        {
            name:
                "DEMÔNIO DE CINZA",

            icon:
                "🔥",

            color:
                "#8c4d3f",

            drop:
                "essencia",

            special:
                "fireCircle"
        },

        {
            name:
                "CÃO DE LAVA",

            icon:
                "🐕",

            color:
                "#984b31",

            drop:
                "couro",

            special:
                "dash"
        },

        {
            name:
                "ESPECTRO CARMESIM",

            icon:
                "👻",

            color:
                "#724056",

            drop:
                "essencia",

            special:
                "shadowBurst"
        },

        {
            name:
                "GÁRGULA QUEBRADA",

            icon:
                "🗿",

            color:
                "#70554a",

            drop:
                "ouro",

            special:
                "rockThrow"
        },

        {
            name:
                "PARASITA DO VAZIO",

            icon:
                "🕷️",

            color:
                "#4b3551",

            drop:
                "essencia",

            special:
                "voidCircle"
        }
    ];

    types.forEach(
        (
            info,
            typeIndex
        ) => {
            for (
                let i = 0;
                i <
                4;
                i++
            ) {
                addEnemy({
                    id:
                        `hell_${typeIndex}_${i}`,

                    x:
                        randomInt(
                            430,
                            3020
                        ),

                    y:
                        randomInt(
                            270,
                            2060
                        ),

                    name:
                        info.name,

                    icon:
                        info.icon,

                    type:
                        "hell",

                    hellType:
                        typeIndex,

                    hp:
                        410 +
                        typeIndex *
                        42,

                    maxHp:
                        410 +
                        typeIndex *
                        42,

                    damage:
                        39 +
                        typeIndex *
                        4,

                    speed:
                        82 +
                        typeIndex *
                        4,

                    vision:
                        380,

                    attackRange:
                        88,

                    radius:
                        28,

                    color:
                        info.color,

                    drop:
                        info.drop,

                    dropAmount:
                        1,

                    dropChance:
                        0.73,

                    special:
                        info.special
                });
            }
        }
    );

    /*
        Guardião Supremo.
    */

    addEnemy({
        id:
            "final_gate_guardian",

        x:
            3060,

        y:
            1120,

        name:
            "GUARDIÃO SUPREMO DO INFERNO",

        icon:
            "👿",

        type:
            "progression",

        hp:
            1850,

        maxHp:
            1850,

        damage:
            64,

        speed:
            78,

        vision:
            500,

        attackRange:
            120,

        radius:
            46,

        color:
            "#a64139",

        drop:
            "fragmentoMemoria",

        dropAmount:
            6,

        dropChance:
            1,

        unlock:
            "final",

        special:
            "infernalStorm"
    });

    addPortal(
        3390,
        1010,
        70,
        230,

        "final",

        () =>
            hasDefeatedBoss(
                "final_gate_guardian"
            ) &&
            Object.keys(
                state.player
                    .hellTypesDefeated
            ).length >=
            5,

        "CÂMARA FINAL",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CÂMARA FINAL
========================================================= */

function buildFinal() {
    addReturnPortal(
        "hell",
        "VOLTAR PARA O INFERNO"
    );

    /*
        Arena.
    */

    for (
        let i = 0;
        i <
        12;
        i++
    ) {
        const angle =
            (
                Math.PI *
                2 *
                i
            ) /
            12;

        addDecoration(
            "finalPillar",

            1100 +
            Math.cos(
                angle
            ) *
            580,

            750 +
            Math.sin(
                angle
            ) *
            450,

            {
                phase:
                    angle
            }
        );
    }

    for (
        let i = 0;
        i <
        28;
        i++
    ) {
        addDecoration(
            "memoryShard",

            randomInt(
                220,
                2000
            ),

            randomInt(
                180,
                1320
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

    addEnemy({
        id:
            "other_self",

        x:
            1550,

        y:
            750,

        name:
            "O OUTRO EU",

        icon:
            "☯",

        type:
            "final",

        hp:
            2200,

        maxHp:
            2200,

        damage:
            62,

        speed:
            86,

        vision:
            650,

        attackRange:
            112,

        radius:
            42,

        color:
            "#b7aaa0",

        drop:
            "essencia",

        dropAmount:
            10,

        dropChance:
            1,

        special:
            "finalMemoryStorm"
    });
}

/* =========================================================
   BOSS DERROTADO
========================================================= */

function hasDefeatedBoss(id) {
    return Boolean(
        state.player
            ?.defeatedBosses
            ?.includes(
                id
            )
    );
}

/* =========================================================
   COLISÃO CÍRCULO / RETÂNGULO
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
            rect.x +
            rect.w
        );

    const closestY =
        clamp(
            cy,
            rect.y,
            rect.y +
            rect.h
        );

    const dx =
        cx -
        closestX;

    const dy =
        cy -
        closestY;

    return (
        dx *
        dx +
        dy *
        dy <
        radius *
        radius
    );
}

/* =========================================================
   TAMANHO DO INTERIOR
========================================================= */

function getHouseRoom() {
    const building =
        state.currentHouse;

    const w =
        clamp(
            (
                building
                    ?.w ||
                430
            ) +
            150,
            560,
            760
        );

    const h =
        clamp(
            (
                building
                    ?.h ||
                270
            ) +
            150,
            420,
            560
        );

    return {
        x:
            state.world.width /
            2 -
            w /
            2,

        y:
            state.world.height /
            2 -
            h /
            2,

        w,

        h
    };
}

/* =========================================================
   TEMAS DOS INTERIORES
========================================================= */

function getHouseTheme() {
    const themes = {
        home: {
            wall:
                "#4b342b",

            floor:
                "#9a7452",

            trim:
                "#d8b87a",

            accent:
                "#efb05b"
        },

        elianHome: {
            wall:
                "#3f3831",

            floor:
                "#856a50",

            trim:
                "#cab07e",

            accent:
                "#6d8790"
        },

        forge: {
            wall:
                "#292b2f",

            floor:
                "#55504a",

            trim:
                "#a39789",

            accent:
                "#ff8149"
        },

        shop: {
            wall:
                "#3e2e28",

            floor:
                "#8c6847",

            trim:
                "#e0bc75",

            accent:
                "#e8c56f"
        },

        woodshop: {
            wall:
                "#453225",

            floor:
                "#a0784f",

            trim:
                "#d9b276",

            accent:
                "#d89c55"
        }
    };

    return (
        themes[
            state.currentHouse
                ?.id
        ] ||
        themes.home
    );
}

/* =========================================================
   NPCS INTERNOS
========================================================= */

function getInteriorNPCs() {
    if (
        !state.houseMode ||
        !state.currentHouse
    ) {
        return [];
    }

    const room =
        getHouseRoom();

    const configs = {
        elianHome: {
            name:
                "ELIAN",

            role:
                "Morador",

            color:
                "#d4b27c",

            dx:
                0.72,

            dy:
                0.40,

            lines: [
                "Esta casa parece menor a cada semana. Talvez seja só impressão.",

                "Algumas coisas aqui pertenciam à minha família. O problema é que já não lembro a quem.",

                "Se a Quietude continuar avançando, até estas paredes podem esquecer que são uma casa."
            ]
        },

        forge: {
            name:
                "BORIN",

            role:
                "Ferreiro",

            color:
                "#8e8d89",

            questId:
                "coal",

            dx:
                0.72,

            dy:
                0.44,

            lines: [
                "Cuidado com a fornalha. Ela não perdoa distração.",

                "O ferro daqui reage de forma estranha aos fragmentos de memória.",

                "Se trouxer carvão, eu consigo manter isto funcionando por mais algum tempo."
            ]
        },

        shop: {
            name:
                "DORAN",

            role:
                "Comerciante",

            color:
                "#c58a54",

            merchant:
                true,

            dx:
                0.72,

            dy:
                0.34,

            lines: [
                "Bem-vindo. Aqui dentro pelo menos ninguém tenta te matar enquanto escolhe uma poção.",

                "Compro materiais e vendo o que consigo trazer de fora.",

                "Se encontrar itens valiosos, pode vender tudo de uma vez pelo balcão."
            ]
        },

        woodshop: {
            name:
                "BRAN",

            role:
                "Carpinteiro",

            color:
                "#8d7053",

            questId:
                "wood",

            dx:
                0.73,

            dy:
                0.43,

            lines: [
                "Madeira boa está ficando mais difícil de reconhecer.",

                "Já aconteceu de eu cortar uma tábua e esquecer de qual árvore ela veio.",

                "Se tiver madeira sobrando, sempre encontro alguma utilidade."
            ]
        }
    };

    const config =
        configs[
            state.currentHouse.id
        ];

    if (
        !config
    ) {
        return [];
    }

    /*
        Procura um NPC externo com o
        mesmo nome somente quando existe.

        Doran não existe mais fora,
        então utiliza as falas do config.
    */

    const original =
        state.world
            .npcs
            .find(
                npc =>
                    npc.name ===
                    config.name
            );

    return [
        {
            ...(
                original ||
                {}
            ),

            ...config,

            id:
                "inside_" +
                state.currentHouse.id +
                "_" +
                config.name,

            x:
                room.x +
                room.w *
                config.dx,

            y:
                room.y +
                room.h *
                config.dy,

            radius:
                17,

            lines:
                config.lines ||
                original
                    ?.lines ||
                [
                    "Bem-vindo."
                ],

            interior:
                true
        }
    ];
}

/* =========================================================
   COLISÕES DOS MÓVEIS
========================================================= */

function rebuildInteriorCollisions() {
    state.world
        .interiorObstacles =
        [];

    if (
        !state.houseMode ||
        !state.currentHouse
    ) {
        return;
    }

    const room =
        getHouseRoom();

    const id =
        state.currentHouse.id;

    /*
        CASA DO JOGADOR
    */

    if (
        id ===
        "home"
    ) {
        /*
            Cama.
        */

        addInteriorObstacle(
            room.x +
            48,

            room.y +
            55,

            150,
            92,

            "bed"
        );

        /*
            Mesa.
        */

        addInteriorObstacle(
            room.x +
            room.w /
            2 -
            70,

            room.y +
            room.h /
            2 -
            30,

            140,
            60,

            "table"
        );

        /*
            Lareira.
        */

        addInteriorObstacle(
            room.x +
            room.w -
            145,

            room.y +
            42,

            98,
            120,

            "fireplace"
        );
    }

    /*
        CASA DO ELIAN
    */

    else if (
        id ===
        "elianHome"
    ) {
        addInteriorObstacle(
            room.x +
            45,

            room.y +
            55,

            130,
            82,

            "bed"
        );

        addInteriorObstacle(
            room.x +
            room.w -
            165,

            room.y +
            45,

            120,
            160,

            "bookshelf"
        );

        addInteriorObstacle(
            room.x +
            room.w /
            2 -
            90,

            room.y +
            room.h /
            2 -
            38,

            180,
            76,

            "desk"
        );
    }

    /*
        FORJA
    */

    else if (
        id ===
        "forge"
    ) {
        /*
            Fornalha.
        */

        addInteriorObstacle(
            room.x +
            43,

            room.y +
            45,

            160,
            155,

            "furnace"
        );

        /*
            Bigorna.
        */

        addInteriorObstacle(
            room.x +
            room.w /
            2 -
            62,

            room.y +
            room.h /
            2 -
            22,

            124,
            90,

            "anvil"
        );

        /*
            Bancada.
        */

        addInteriorObstacle(
            room.x +
            room.w -
            205,

            room.y +
            room.h -
            145,

            155,
            70,

            "forgeBench"
        );
    }

    /*
        LOJA
    */

    else if (
        id ===
        "shop"
    ) {
        /*
            Estante esquerda.
        */

        addInteriorObstacle(
            room.x +
            42,

            room.y +
            42,

            150,
            155,

            "shopShelf"
        );

        /*
            Estante direita.
        */

        addInteriorObstacle(
            room.x +
            room.w -
            192,

            room.y +
            42,

            150,
            155,

            "shopShelf"
        );

        /*
            Balcão.
        */

        addInteriorObstacle(
            room.x +
            room.w *
            0.47,

            room.y +
            room.h *
            0.48,

            room.w *
            0.45,

            62,

            "counter"
        );
    }

    /*
        CARPINTARIA
    */

    else if (
        id ===
        "woodshop"
    ) {
        addInteriorObstacle(
            room.x +
            45,

            room.y +
            48,

            180,
            155,

            "woodPile"
        );

        addInteriorObstacle(
            room.x +
            room.w /
            2 -
            105,

            room.y +
            room.h /
            2 -
            40,

            210,
            80,

            "workbench"
        );

        addInteriorObstacle(
            room.x +
            room.w -
            195,

            room.y +
            58,

            150,
            160,

            "boards"
        );
    }
}

/* =========================================================
   PLAYER DENTRO DA CASA
========================================================= */

function placePlayerInsideHouse() {
    const room =
        getHouseRoom();

    state.player.x =
        room.x +
        room.w /
        2;

    state.player.y =
        room.y +
        room.h -
        64;

    state.keys.clear();

    rebuildInteriorCollisions();

    updateCamera();
}

/* =========================================================
   COLISÃO DO PLAYER
========================================================= */

function canPlayerMoveTo(
    x,
    y,
    radius
) {
    /*
        INTERIOR
    */

    if (
        state.houseMode
    ) {
        const room =
            getHouseRoom();

        const insideRoom =
            (
                x -
                radius >=
                room.x +
                18
            ) &&
            (
                y -
                radius >=
                room.y +
                18
            ) &&
            (
                x +
                radius <=
                room.x +
                room.w -
                18
            ) &&
            (
                y +
                radius <=
                room.y +
                room.h -
                18
            );

        if (
            !insideRoom
        ) {
            return false;
        }

        /*
            Colisão com móveis.
        */

        for (
            const obstacle of
            state.world
                .interiorObstacles
        ) {
            if (
                circleRectCollision(
                    x,
                    y,
                    radius,
                    obstacle
                )
            ) {
                return false;
            }
        }

        /*
            Colisão com NPC interno.
        */

        for (
            const npc of
            getInteriorNPCs()
        ) {
            if (
                Math.hypot(
                    x -
                    npc.x,
                    y -
                    npc.y
                ) <
                radius +
                npc.radius +
                4
            ) {
                return false;
            }
        }

        return true;
    }

    /*
        LIMITES EXTERNOS
    */

    if (
        x -
        radius <
        72 ||

        y -
        radius <
        72 ||

        x +
        radius >
        state.world.width -
        72 ||

        y +
        radius >
        state.world.height -
        72
    ) {
        return false;
    }

    /*
        Obstáculos externos.
    */

    for (
        const obstacle of
        state.world.obstacles
    ) {
        if (
            obstacle.treeId
        ) {
            const tree =
                state.world
                    .trees
                    .find(
                        item =>
                            item.id ===
                            obstacle.treeId
                    );

            if (
                !tree
                    ?.alive
            ) {
                continue;
            }
        }

        if (
            circleRectCollision(
                x,
                y,
                radius,
                obstacle
            )
        ) {
            return false;
        }
    }

    /*
        NPCs externos.
    */

    for (
        const npc of
        state.world.npcs
    ) {
        if (
            Math.hypot(
                x -
                npc.x,
                y -
                npc.y
            ) <
            radius +
            npc.radius
        ) {
            return false;
        }
    }

    return true;
}

/* =========================================================
   COLISÃO DOS INIMIGOS
========================================================= */

function canEnemyMoveTo(
    x,
    y,
    radius
) {
    if (
        x -
        radius <
        72 ||

        y -
        radius <
        72 ||

        x +
        radius >
        state.world.width -
        72 ||

        y +
        radius >
        state.world.height -
        72
    ) {
        return false;
    }

    for (
        const obstacle of
        state.world.obstacles
    ) {
        if (
            obstacle.treeId
        ) {
            const tree =
                state.world
                    .trees
                    .find(
                        item =>
                            item.id ===
                            obstacle.treeId
                    );

            if (
                !tree
                    ?.alive
            ) {
                continue;
            }
        }

        if (
            circleRectCollision(
                x,
                y,
                radius,
                obstacle
            )
        ) {
            return false;
        }
    }

    return true;
}
   /* =========================================================
   MOVIMENTO DO PLAYER
========================================================= */

function updateMovement(dt) {
    if (
        state.paused ||
        !state.player ||
        state.player.dead
    ) {
        return;
    }

    let dx = 0;
    let dy = 0;

    if (
        state.keys.has("w") ||
        state.keys.has("arrowup")
    ) {
        dy -= 1;
    }

    if (
        state.keys.has("s") ||
        state.keys.has("arrowdown")
    ) {
        dy += 1;
    }

    if (
        state.keys.has("a") ||
        state.keys.has("arrowleft")
    ) {
        dx -= 1;
    }

    if (
        state.keys.has("d") ||
        state.keys.has("arrowright")
    ) {
        dx += 1;
    }

    if (
        dx === 0 &&
        dy === 0
    ) {
        return;
    }

    const direction =
        normalizeVector(
            dx,
            dy
        );

    let speed =
        state.houseMode
            ? 132
            : state.player.speed;

    /*
        Fome e cansaço reduzem a velocidade,
        mas não deixam o personagem completamente
        inútil.
    */

    if (
        !state.houseMode &&
        state.player.hunger <= 20
    ) {
        speed *= 0.78;
    }

    if (
        !state.houseMode &&
        state.player.fatigue <= 20
    ) {
        speed *= 0.78;
    }

    const step =
        speed *
        dt;

    const nextX =
        state.player.x +
        direction.x *
        step;

    if (
        canPlayerMoveTo(
            nextX,
            state.player.y,
            state.player.radius
        )
    ) {
        state.player.x =
            nextX;
    }

    const nextY =
        state.player.y +
        direction.y *
        step;

    if (
        canPlayerMoveTo(
            state.player.x,
            nextY,
            state.player.radius
        )
    ) {
        state.player.y =
            nextY;
    }
}

/* =========================================================
   FOME / CANSAÇO / REGENERAÇÃO
========================================================= */

function updateSurvival(dt) {
    if (
        state.houseMode ||
        state.paused ||
        !state.player ||
        state.player.dead
    ) {
        return;
    }

    const player =
        state.player;

    /*
        A fome cai lentamente.
    */

    player.hunger =
        clamp(
            player.hunger -
            0.105 *
            dt,
            0,
            100
        );

    /*
        Cansaço cai um pouco mais devagar.
    */

    player.fatigue =
        clamp(
            player.fatigue -
            0.078 *
            dt,
            0,
            100
        );

    /*
        Regeneração natural.
    */

    const magicRecovery =
        player.hunger > 15
            ? 1.55
            : 0.72;

    const energyRecovery =
        player.fatigue > 15
            ? 2.7
            : 1.1;

    player.magic =
        clamp(
            player.magic +
            magicRecovery *
            dt,
            0,
            player.maxMagic
        );

    player.energy =
        clamp(
            player.energy +
            energyRecovery *
            dt,
            0,
            player.maxEnergy
        );

    /*
        Consequência de fome extrema.
    */

    if (
        player.hunger <= 0
    ) {
        player.hp =
            Math.max(
                1,
                player.hp -
                0.5 *
                dt
            );
    }

    /*
        Consequência de exaustão extrema.
    */

    if (
        player.fatigue <= 0
    ) {
        player.energy =
            Math.max(
                0,
                player.energy -
                0.7 *
                dt
            );
    }

    document.body.classList.toggle(
        "low-needs",
        player.hunger <= 16 ||
        player.fatigue <= 16
    );

    const now =
        performance.now();

    if (
        now -
        state.warnedNeedAt >
        7000
    ) {
        if (
            player.hunger <
            18
        ) {
            showToast(
                "Você está com fome. Cace, encontre comida ou volte à vila."
            );

            state.warnedNeedAt =
                now;
        }

        else if (
            player.fatigue <
            18
        ) {
            showToast(
                "Você está exausto. Volte para sua casa e durma na cama."
            );

            state.warnedNeedAt =
                now;
        }
    }
}

/* =========================================================
   DORMIR
========================================================= */

function sleepAtHome() {
    if (
        !state.houseMode ||
        state.currentHouse?.id !== "home"
    ) {
        showToast(
            "Você só pode dormir na sua própria cama."
        );

        return;
    }

    state.paused =
        true;

    state.keys.clear();

    state.pointer.down =
        false;

    cancelHoldInteraction();

    must(
        "transitionMessage"
    ).textContent =
        "VOCÊ DESCANSA...";

    must(
        "transitionScreen"
    ).classList.remove(
        "hidden"
    );

    setTimeout(
        () => {
            const player =
                state.player;

            player.fatigue =
                100;

            player.energy =
                player.maxEnergy;

            player.magic =
                player.maxMagic;

            player.hp =
                Math.min(
                    player.maxHp,
                    player.hp +
                    Math.round(
                        player.maxHp *
                        0.32
                    )
                );

            /*
                Dormir recupera energia,
                mas aumenta a fome.
            */

            player.hunger =
                Math.max(
                    0,
                    player.hunger -
                    10
                );

            must(
                "transitionScreen"
            ).classList.add(
                "hidden"
            );

            state.paused =
                false;

            showToast(
                "Você descansou. Energia, magia e cansaço foram recuperados."
            );

            saveGame(
                false
            );
        },
        1050
    );
}

/* =========================================================
   ATUALIZAÇÃO DOS COOLDOWNS
========================================================= */

function updateSkillCooldowns(dt) {
    if (
        !state.player
    ) {
        return;
    }

    for (
        const key of
        [
            "q",
            "r",
            "f"
        ]
    ) {
        state.player
            .skillCooldowns[
                key
            ] =
            Math.max(
                0,
                (
                    state.player
                        .skillCooldowns[
                            key
                        ] ||
                    0
                ) -
                dt
            );
    }

    state.player.attackCooldown =
        Math.max(
            0,
            state.player.attackCooldown -
            dt
        );

    state.player.invincible =
        Math.max(
            0,
            state.player.invincible -
            dt
        );

    state.player.shieldTimer =
        Math.max(
            0,
            (
                state.player
                    .shieldTimer ||
                0
            ) -
            dt
        );

    if (
        state.player.shieldTimer <= 0
    ) {
        state.player.damageReduction =
            0;
    }
}

/* =========================================================
   ENCONTRAR INIMIGO MAIS PRÓXIMO
========================================================= */

function findNearestEnemy(range) {
    let best =
        null;

    let bestDistance =
        Infinity;

    for (
        const enemy of
        state.world.enemies
    ) {
        if (
            enemy.dead
        ) {
            continue;
        }

        const d =
            distance(
                enemy,
                state.player
            );

        if (
            d <= range &&
            d < bestDistance
        ) {
            best =
                enemy;

            bestDistance =
                d;
        }
    }

    return best;
}

/* =========================================================
   INIMIGO NA DIREÇÃO DO MOUSE
========================================================= */

function findEnemyToward(
    point,
    range,
    cone = 0.72
) {
    if (
        !point
    ) {
        return findNearestEnemy(
            range
        );
    }

    const player =
        state.player;

    const aimX =
        point.x -
        player.x;

    const aimY =
        point.y -
        player.y;

    const aimLength =
        Math.hypot(
            aimX,
            aimY
        ) || 1;

    const normalizedAimX =
        aimX /
        aimLength;

    const normalizedAimY =
        aimY /
        aimLength;

    let best =
        null;

    let bestScore =
        Infinity;

    for (
        const enemy of
        state.world.enemies
    ) {
        if (
            enemy.dead
        ) {
            continue;
        }

        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;

        const d =
            Math.hypot(
                dx,
                dy
            );

        if (
            d >
            range
        ) {
            continue;
        }

        const dot =
            (
                dx /
                (
                    d ||
                    1
                )
            ) *
            normalizedAimX +
            (
                dy /
                (
                    d ||
                    1
                )
            ) *
            normalizedAimY;

        if (
            dot <
            cone
        ) {
            continue;
        }

        const score =
            d -
            dot *
            48;

        if (
            score <
            bestScore
        ) {
            bestScore =
                score;

            best =
                enemy;
        }
    }

    return best;
}

/* =========================================================
   EFEITO DO ATAQUE BÁSICO
========================================================= */

function createAttackEffect(
    point,
    range,
    color,
    ranged = false
) {
    const player =
        state.player;

    const character =
        currentCharacter();

    const dx =
        (
            point?.x ??
            player.x +
            1
        ) -
        player.x;

    const dy =
        (
            point?.y ??
            player.y
        ) -
        player.y;

    const direction =
        normalizeVector(
            dx,
            dy
        );

    const targetX =
        player.x +
        direction.x *
        Math.min(
            range,
            ranged
                ? 230
                : 110
        );

    const targetY =
        player.y +
        direction.y *
        Math.min(
            range,
            ranged
                ? 230
                : 110
        );

    /*
        Cada classe recebe um ataque
        visual diferente.
    */

    if (
        character.id ===
        "kaelion"
    ) {
        state.world.effects.push({
            type:
                "magicProjectile",

            x:
                player.x,

            y:
                player.y,

            startX:
                player.x,

            startY:
                player.y,

            tx:
                targetX,

            ty:
                targetY,

            progress:
                0,

            speed:
                8.5,

            life:
                0.42,

            maxLife:
                0.42,

            color:
                character.color,

            secondary:
                character.secondaryColor
        });

        spawnParticles(
            player.x,
            player.y,
            character.secondaryColor,
            5
        );
    }

    else if (
        character.id ===
        "theron"
    ) {
        state.world.effects.push({
            type:
                "swordArc",

            x:
                player.x,

            y:
                player.y,

            angle:
                Math.atan2(
                    direction.y,
                    direction.x
                ),

            radius:
                58,

            life:
                0.22,

            maxLife:
                0.22,

            color:
                character.secondaryColor
        });
    }

    else if (
        character.id ===
        "grumgar"
    ) {
        state.world.effects.push({
            type:
                "heavySmash",

            x:
                targetX,

            y:
                targetY,

            radius:
                50,

            life:
                0.30,

            maxLife:
                0.30,

            color:
                character.secondaryColor
        });

        spawnParticles(
            targetX,
            targetY,
            "#80643e",
            9
        );
    }

    else if (
        character.id ===
        "lirael"
    ) {
        state.world.effects.push({
            type:
                "fairyProjectile",

            x:
                player.x,

            y:
                player.y,

            startX:
                player.x,

            startY:
                player.y,

            tx:
                targetX,

            ty:
                targetY,

            progress:
                0,

            speed:
                10,

            life:
                0.38,

            maxLife:
                0.38,

            color:
                character.color,

            secondary:
                character.secondaryColor
        });

        spawnParticles(
            player.x,
            player.y,
            "#ffc7f0",
            6
        );
    }

    else {
        state.world.effects.push({
            type:
                "clawArc",

            x:
                player.x,

            y:
                player.y,

            angle:
                Math.atan2(
                    direction.y,
                    direction.x
                ),

            radius:
                62,

            life:
                0.24,

            maxLife:
                0.24,

            color:
                character.secondaryColor
        });

        spawnParticles(
            player.x +
            direction.x *
            35,
            player.y +
            direction.y *
            35,
            character.color,
            6
        );
    }
}

/* =========================================================
   ATAQUE BÁSICO DO PLAYER
========================================================= */

function performAttack(
    point = null
) {
    const player =
        state.player;

    if (
        !player ||
        state.paused ||
        state.dialogue ||
        state.travel ||
        state.battle ||
        player.dead ||
        state.houseMode
    ) {
        return;
    }

    if (
        player.attackCooldown >
        0
    ) {
        return;
    }

    if (
        player.energy <
        3
    ) {
        if (
            state.pointer.down
        ) {
            showToast(
                "Você está sem energia para atacar."
            );
        }

        return;
    }

    const character =
        currentCharacter();

    const ranged =
        character.id === "kaelion" ||
        character.id === "lirael";

    const attackRange =
        ranged
            ? 330
            : character.id === "grumgar"
            ? 150
            : 142;

    const worldPoint =
        point ||
        {
            x:
                state.pointer.worldX,

            y:
                state.pointer.worldY
        };

    const target =
        findEnemyToward(
            worldPoint,
            attackRange,
            ranged
                ? 0.50
                : 0.38
        );

    /*
        Ataque segurando mouse continua funcionando,
        mas respeita o cooldown.
    */

    player.energy =
        Math.max(
            0,
            player.energy -
            (
                character.id ===
                "grumgar"
                    ? 4
                    : 3
            )
        );

    const cooldownByClass = {
        kaelion:
            0.38,

        theron:
            0.34,

        grumgar:
            0.52,

        lirael:
            0.29,

        zephyr:
            0.32
    };

    player.attackCooldown =
        cooldownByClass[
            character.id
        ] ||
        0.35;

    player.hunger =
        Math.max(
            0,
            player.hunger -
            0.035
        );

    player.fatigue =
        Math.max(
            0,
            player.fatigue -
            0.055
        );

    createAttackEffect(
        worldPoint,
        attackRange,
        character.color,
        ranged
    );

    if (
        !target
    ) {
        return;
    }

    /*
        Boss de progressão ainda precisa
        ser aceito antes do primeiro dano.
    */

    if (
        target.type ===
        "progression" &&
        !target.accepted
    ) {
        openBattle(
            target
        );

        return;
    }

    let damage =
        player.damage +
        (
            ITEMS[
                player.equipment.weapon
            ]?.damage ||
            0
        );

    if (
        character.id ===
        "grumgar"
    ) {
        damage +=
            8;
    }

    else if (
        character.id ===
        "theron"
    ) {
        damage +=
            4;
    }

    else if (
        character.id ===
        "lirael"
    ) {
        damage -=
            2;
    }

    if (
        ranged &&
        distance(
            target,
            player
        ) >
        250
    ) {
        damage *=
            0.92;
    }

    attackEnemy(
        target,
        Math.round(
            damage
        )
    );
}

/* =========================================================
   SISTEMA DE HABILIDADES
========================================================= */

const CLASS_SKILLS = {
    kaelion: {
        q: {
            name:
                "Bola de Memória",

            level:
                1,

            cooldown:
                2.2,

            costMagic:
                15
        },

        r: {
            name:
                "Nova Arcana",

            level:
                5,

            cooldown:
                6,

            costMagic:
                30
        },

        f: {
            name:
                "Tempestade da Quietude",

            level:
                10,

            cooldown:
                12,

            costMagic:
                55
        }
    },

    theron: {
        q: {
            name:
                "Golpe Pesado",

            level:
                1,

            cooldown:
                3,

            costEnergy:
                10
        },

        r: {
            name:
                "Postura do Guardião",

            level:
                5,

            cooldown:
                9,

            costEnergy:
                18
        },

        f: {
            name:
                "Juramento de Aço",

            level:
                10,

            cooldown:
                15,

            costEnergy:
                30
        }
    },

    grumgar: {
        q: {
            name:
                "Esmagamento",

            level:
                1,

            cooldown:
                4,

            costEnergy:
                12
        },

        r: {
            name:
                "Rugido Ancestral",

            level:
                5,

            cooldown:
                8,

            costEnergy:
                20
        },

        f: {
            name:
                "Terremoto",

            level:
                10,

            cooldown:
                14,

            costEnergy:
                34
        }
    },

    lirael: {
        q: {
            name:
                "Flecha Feérica",

            level:
                1,

            cooldown:
                1.5,

            costMagic:
                12
        },

        r: {
            name:
                "Luz Vital",

            level:
                5,

            cooldown:
                7,

            costMagic:
                28
        },

        f: {
            name:
                "Chuva de Estrelas",

            level:
                10,

            cooldown:
                11,

            costMagic:
                48
        }
    },

    zephyr: {
        q: {
            name:
                "Forma Adaptativa",

            level:
                1,

            cooldown:
                7,

            costMagic:
                12
        },

        r: {
            name:
                "Investida Quimérica",

            level:
                5,

            cooldown:
                6,

            costEnergy:
                18
        },

        f: {
            name:
                "Forma Perfeita",

            level:
                10,

            cooldown:
                15,

            costMagic:
                42
        }
    }
};

/* =========================================================
   HABILIDADES DO PERSONAGEM ATUAL
========================================================= */

function getCharacterSkills() {
    return (
        CLASS_SKILLS[
            state.player
                ?.characterId
        ] ||
        CLASS_SKILLS.kaelion
    );
}

/* =========================================================
   USAR HABILIDADE
========================================================= */

function useSkill(key) {
    const player =
        state.player;

    if (
        !player ||
        state.paused ||
        state.houseMode ||
        player.dead
    ) {
        return;
    }

    const character =
        currentCharacter();

    const skills =
        getCharacterSkills();

    const skill =
        skills[
            key
        ];

    if (
        !skill
    ) {
        return;
    }

    if (
        player.level <
        skill.level
    ) {
        showToast(
            `${skill.name} é desbloqueada no nível ${skill.level}.`
        );

        return;
    }

    if (
        (
            player.skillCooldowns[
                key
            ] ||
            0
        ) >
        0
    ) {
        return;
    }

    if (
        skill.costMagic &&
        player.magic <
        skill.costMagic
    ) {
        showToast(
            "Magia insuficiente."
        );

        return;
    }

    if (
        skill.costEnergy &&
        player.energy <
        skill.costEnergy
    ) {
        showToast(
            "Energia insuficiente."
        );

        return;
    }

    player.magic =
        Math.max(
            0,
            player.magic -
            (
                skill.costMagic ||
                0
            )
        );

    player.energy =
        Math.max(
            0,
            player.energy -
            (
                skill.costEnergy ||
                0
            )
        );

    player.skillCooldowns[
        key
    ] =
        skill.cooldown;

    const point = {
        x:
            state.pointer.worldX ||
            player.x +
            1,

        y:
            state.pointer.worldY ||
            player.y
    };

    const weaponBonus =
        ITEMS[
            player.equipment.weapon
        ]?.damage ||
        0;

    const base =
        player.damage +
        weaponBonus;

    /*
        ============================================
        KAELION
        ============================================
    */

    if (
        character.id ===
        "kaelion"
    ) {
        if (
            key ===
            "q"
        ) {
            const target =
                findEnemyToward(
                    point,
                    420,
                    0.42
                );

            state.world.effects.push({
                type:
                    "bigMemoryOrb",

                x:
                    player.x,

                y:
                    player.y,

                tx:
                    point.x,

                ty:
                    point.y,

                life:
                    0.55,

                maxLife:
                    0.55,

                color:
                    "#f1a354",

                secondary:
                    "#ffd998"
            });

            spawnParticles(
                player.x,
                player.y,
                "#ffca79",
                14
            );

            if (
                target
            ) {
                if (
                    target.type ===
                    "progression" &&
                    !target.accepted
                ) {
                    openBattle(
                        target
                    );
                }

                else {
                    attackEnemy(
                        target,
                        Math.round(
                            base *
                            1.48 +
                            20
                        )
                    );

                    spawnParticles(
                        target.x,
                        target.y,
                        "#ffb85d",
                        16
                    );
                }
            }
        }

        else if (
            key ===
            "r"
        ) {
            for (
                let i = 0;
                i <
                3;
                i++
            ) {
                state.world.effects.push({
                    type:
                        "skillRing",

                    x:
                        player.x,

                    y:
                        player.y,

                    radius:
                        75 +
                        i *
                        45,

                    life:
                        0.60 +
                        i *
                        0.08,

                    maxLife:
                        0.60 +
                        i *
                        0.08,

                    color:
                        i %
                        2 ===
                        0
                            ? "#e49345"
                            : "#ffd070"
                });
            }

            damageEnemiesInRadius(
                player.x,
                player.y,
                185,
                Math.round(
                    base *
                    1.38 +
                    24
                ),
                {
                    stun:
                        1.1,

                    color:
                        "#f0a053"
                }
            );

            spawnParticles(
                player.x,
                player.y,
                "#ffd070",
                30
            );
        }

        else if (
            key ===
            "f"
        ) {
            for (
                let i = 0;
                i <
                10;
                i++
            ) {
                const angle =
                    random(
                        0,
                        Math.PI *
                        2
                    );

                const spread =
                    random(
                        60,
                        240
                    );

                const x =
                    player.x +
                    Math.cos(
                        angle
                    ) *
                    spread;

                const y =
                    player.y +
                    Math.sin(
                        angle
                    ) *
                    spread;

                state.world.effects.push({
                    type:
                        "memoryStrike",

                    x,
                    y,

                    life:
                        0.8,

                    maxLife:
                        0.8,

                    color:
                        i %
                        2
                            ? "#ffac5c"
                            : "#ffe2a1"
                });

                damageEnemiesInRadius(
                    x,
                    y,
                    76,
                    Math.round(
                        base *
                        1.12 +
                        26
                    )
                );
            }
        }
    }

    /*
        ============================================
        THERON
        ============================================
    */

    else if (
        character.id ===
        "theron"
    ) {
        if (
            key ===
            "q"
        ) {
            const target =
                findEnemyToward(
                    point,
                    175,
                    0.28
                );

            state.world.effects.push({
                type:
                    "swordArc",

                x:
                    player.x,

                y:
                    player.y,

                angle:
                    Math.atan2(
                        point.y -
                        player.y,
                        point.x -
                        player.x
                    ),

                radius:
                    90,

                life:
                    0.34,

                maxLife:
                    0.34,

                color:
                    "#f4f7ff",

                heavy:
                    true
            });

            if (
                target
            ) {
                if (
                    target.type ===
                    "progression" &&
                    !target.accepted
                ) {
                    openBattle(
                        target
                    );
                }

                else {
                    attackEnemy(
                        target,
                        Math.round(
                            base *
                            1.7 +
                            20
                        )
                    );

                    target.stunTimer =
                        Math.max(
                            target.stunTimer ||
                            0,
                            0.65
                        );
                }
            }
        }

        else if (
            key ===
            "r"
        ) {
            player.damageReduction =
                0.45;

            player.shieldTimer =
                5.5;

            state.world.effects.push({
                type:
                    "shieldAura",

                x:
                    player.x,

                y:
                    player.y,

                life:
                    5.5,

                maxLife:
                    5.5,

                color:
                    "#dbe8f4"
            });

            spawnParticles(
                player.x,
                player.y,
                "#ced8e2",
                28
            );
        }

        else if (
            key ===
            "f"
        ) {
            player.damageReduction =
                0.58;

            player.shieldTimer =
                7;

            for (
                let i = 0;
                i <
                4;
                i++
            ) {
                state.world.effects.push({
                    type:
                        "skillRing",

                    x:
                        player.x,

                    y:
                        player.y,

                    radius:
                        70 +
                        i *
                        40,

                    life:
                        0.7 +
                        i *
                        0.1,

                    maxLife:
                        0.7 +
                        i *
                        0.1,

                    color:
                        "#f4dd9b"
                });
            }

            damageEnemiesInRadius(
                player.x,
                player.y,
                155,
                Math.round(
                    base *
                    1.4 +
                    28
                ),
                {
                    stun:
                        0.95,

                    color:
                        "#f2d48a"
                }
            );
        }
    }

    /*
        ============================================
        GRUMGAR
        ============================================
    */

    else if (
        character.id ===
        "grumgar"
    ) {
        if (
            key ===
            "q"
        ) {
            state.world.effects.push({
                type:
                    "groundCrack",

                x:
                    player.x,

                y:
                    player.y,

                radius:
                    140,

                life:
                    0.55,

                maxLife:
                    0.55,

                color:
                    "#8b774e"
            });

            damageEnemiesInRadius(
                player.x,
                player.y,
                138,
                Math.round(
                    base *
                    1.75 +
                    26
                ),
                {
                    stun:
                        0.55,

                    color:
                        "#92a45f"
                }
            );

            spawnParticles(
                player.x,
                player.y,
                "#765739",
                24
            );
        }

        else if (
            key ===
            "r"
        ) {
            state.world.effects.push({
                type:
                    "roarWave",

                x:
                    player.x,

                y:
                    player.y,

                radius:
                    250,

                life:
                    0.75,

                maxLife:
                    0.75,

                color:
                    "#b5d072"
            });

            damageEnemiesInRadius(
                player.x,
                player.y,
                240,
                Math.round(
                    base *
                    0.78 +
                    14
                ),
                {
                    stun:
                        2,

                    color:
                        "#7f9454"
                }
            );
        }

        else if (
            key ===
            "f"
        ) {
            for (
                let i = 0;
                i <
                6;
                i++
            ) {
                state.world.effects.push({
                    type:
                        "shockRing",

                    x:
                        player.x,

                    y:
                        player.y,

                    radius:
                        55 +
                        i *
                        46,

                    life:
                        0.70 +
                        i *
                        0.08,

                    maxLife:
                        0.70 +
                        i *
                        0.08,

                    color:
                        "#a58d5e"
                });
            }

            damageEnemiesInRadius(
                player.x,
                player.y,
                310,
                Math.round(
                    base *
                    1.58 +
                    42
                ),
                {
                    stun:
                        1.35,

                    color:
                        "#9f8b61"
                }
            );

            spawnParticles(
                player.x,
                player.y,
                "#896740",
                38
            );
        }
    }

    /*
        ============================================
        LIRAEL
        ============================================
    */

    else if (
        character.id ===
        "lirael"
    ) {
        if (
            key ===
            "q"
        ) {
            const target =
                findEnemyToward(
                    point,
                    450,
                    0.38
                );

            state.world.effects.push({
                type:
                    "fairyArrow",

                x:
                    player.x,

                y:
                    player.y,

                tx:
                    point.x,

                ty:
                    point.y,

                life:
                    0.48,

                maxLife:
                    0.48,

                color:
                    "#f6a2df"
            });

            spawnParticles(
                player.x,
                player.y,
                "#ffc7ee",
                10
            );

            if (
                target
            ) {
                if (
                    target.type ===
                    "progression" &&
                    !target.accepted
                ) {
                    openBattle(
                        target
                    );
                }

                else {
                    attackEnemy(
                        target,
                        Math.round(
                            base *
                            1.3 +
                            19
                        )
                    );

                    spawnParticles(
                        target.x,
                        target.y,
                        "#ffabdf",
                        15
                    );
                }
            }
        }

        else if (
            key ===
            "r"
        ) {
            player.hp =
                Math.min(
                    player.maxHp,
                    player.hp +
                    Math.round(
                        player.maxHp *
                        0.38
                    )
                );

            player.energy =
                Math.min(
                    player.maxEnergy,
                    player.energy +
                    25
                );

            state.world.effects.push({
                type:
                    "healingAura",

                x:
                    player.x,

                y:
                    player.y,

                radius:
                    90,

                life:
                    1.1,

                maxLife:
                    1.1,

                color:
                    "#ffb7e8"
            });

            spawnParticles(
                player.x,
                player.y,
                "#ffb7e8",
                36
            );
        }

        else if (
            key ===
            "f"
        ) {
            for (
                let i = 0;
                i <
                11;
                i++
            ) {
                const x =
                    player.x +
                    random(
                        -230,
                        230
                    );

                const y =
                    player.y +
                    random(
                        -230,
                        230
                    );

                state.world.effects.push({
                    type:
                        "fairyStar",

                    x,
                    y,

                    life:
                        0.85,

                    maxLife:
                        0.85,

                    color:
                        i %
                        2
                            ? "#ffb6e6"
                            : "#d3bcff"
                });

                damageEnemiesInRadius(
                    x,
                    y,
                    68,
                    Math.round(
                        base +
                        24
                    )
                );
            }
        }
    }

    /*
        ============================================
        ZEPHYR
        ============================================
    */

    else if (
        character.id ===
        "zephyr"
    ) {
        if (
            key ===
            "q"
        ) {
            activateAdaptiveForm(
                6.5,
                24,
                6
            );

            state.world.effects.push({
                type:
                    "transformAura",

                x:
                    player.x,

                y:
                    player.y,

                life:
                    1.1,

                maxLife:
                    1.1,

                color:
                    "#a384e8"
            });
        }

        else if (
            key ===
            "r"
        ) {
            const direction =
                normalizeVector(
                    point.x -
                    player.x,
                    point.y -
                    player.y
                );

            /*
                Investida visualmente animada,
                evitando aparência de teleporte.
            */

            startPlayerDash(
                direction.x,
                direction.y,
                185,
                0.24,
                () => {
                    damageEnemiesInRadius(
                        player.x,
                        player.y,
                        100,
                        Math.round(
                            base *
                            1.48 +
                            20
                        ),
                        {
                            color:
                                "#a384e8"
                        }
                    );
                }
            );
        }

        else if (
            key ===
            "f"
        ) {
            activateAdaptiveForm(
                10,
                42,
                12
            );

            player.damageReduction =
                0.28;

            player.shieldTimer =
                10;

            player.hp =
                Math.min(
                    player.maxHp,
                    player.hp +
                    28
                );

            state.world.effects.push({
                type:
                    "transformAura",

                x:
                    player.x,

                y:
                    player.y,

                life:
                    1.7,

                maxLife:
                    1.7,

                color:
                    "#c7a8ff",

                ultimate:
                    true
            });

            spawnParticles(
                player.x,
                player.y,
                "#b993ff",
                40
            );
        }
    }

    player.hunger =
        Math.max(
            0,
            player.hunger -
            0.25
        );

    player.fatigue =
        Math.max(
            0,
            player.fatigue -
            0.38
        );

    showToast(
        skill.name
    );
}

/* =========================================================
   FORMA ADAPTATIVA
========================================================= */

function activateAdaptiveForm(
    duration,
    speedBonus,
    damageBonus
) {
    const player =
        state.player;

    if (
        player.adaptiveBuff
    ) {
        return;
    }

    player.adaptiveBuff =
        true;

    player.speed +=
        speedBonus;

    player.damage +=
        damageBonus;

    spawnParticles(
        player.x,
        player.y,
        "#9f7ae8",
        28
    );

    setTimeout(
        () => {
            if (
                state.player
                    ?.adaptiveBuff
            ) {
                state.player.speed -=
                    speedBonus;

                state.player.damage -=
                    damageBonus;

                state.player.adaptiveBuff =
                    false;
            }
        },
        duration *
        1000
    );
}

/* =========================================================
   INVESTIDA DO PLAYER
========================================================= */

function startPlayerDash(
    dirX,
    dirY,
    distanceAmount,
    duration,
    onComplete = null
) {
    if (
        state.player.playerDash
    ) {
        return;
    }

    state.player.playerDash = {
        dirX,
        dirY,

        remaining:
            distanceAmount,

        speed:
            distanceAmount /
            duration,

        onComplete
    };

    state.world.effects.push({
        type:
            "dashTrail",

        owner:
            "player",

        x:
            state.player.x,

        y:
            state.player.y,

        life:
            duration,

        maxLife:
            duration,

        color:
            currentCharacter()
                .secondaryColor
    });
}

/* =========================================================
   ATUALIZA INVESTIDA DO PLAYER
========================================================= */

function updatePlayerDash(dt) {
    const dash =
        state.player
            ?.playerDash;

    if (
        !dash
    ) {
        return;
    }

    const move =
        Math.min(
            dash.remaining,
            dash.speed *
            dt
        );

    const nextX =
        state.player.x +
        dash.dirX *
        move;

    const nextY =
        state.player.y +
        dash.dirY *
        move;

    let moved =
        false;

    if (
        canPlayerMoveTo(
            nextX,
            state.player.y,
            state.player.radius
        )
    ) {
        state.player.x =
            nextX;

        moved =
            true;
    }

    if (
        canPlayerMoveTo(
            state.player.x,
            nextY,
            state.player.radius
        )
    ) {
        state.player.y =
            nextY;

        moved =
            true;
    }

    dash.remaining -=
        move;

    if (
        Math.random() <
        0.65
    ) {
        spawnParticles(
            state.player.x,
            state.player.y,
            currentCharacter()
                .color,
            2
        );
    }

    if (
        dash.remaining <=
        0 ||
        !moved
    ) {
        const callback =
            dash.onComplete;

        state.player.playerDash =
            null;

        if (
            typeof callback ===
            "function"
        ) {
            callback();
        }
    }
}

/* =========================================================
   DANO EM ÁREA
========================================================= */

function damageEnemiesInRadius(
    x,
    y,
    radius,
    damage,
    options = {}
) {
    for (
        const enemy of
        state.world.enemies
    ) {
        if (
            enemy.dead
        ) {
            continue;
        }

        if (
            Math.hypot(
                enemy.x -
                x,
                enemy.y -
                y
            ) <=
            radius +
            enemy.radius
        ) {
            if (
                enemy.type ===
                "progression" &&
                !enemy.accepted
            ) {
                continue;
            }

            attackEnemy(
                enemy,
                damage
            );

            if (
                options.stun
            ) {
                enemy.stunTimer =
                    Math.max(
                        enemy.stunTimer ||
                        0,
                        options.stun
                    );
            }
        }
    }

    state.world.effects.push({
        type:
            "skillRing",

        x,
        y,

        radius,

        life:
            0.48,

        maxLife:
            0.48,

        color:
            options.color ||
            "#fff2b0"
    });
}

/* =========================================================
   DANO NO INIMIGO
========================================================= */

function attackEnemy(
    enemy,
    damage
) {
    if (
        !enemy ||
        enemy.dead
    ) {
        return;
    }

    enemy.accepted =
        true;

    enemy.aggressive =
        true;

    enemy.state =
        "chasing";

    const finalDamage =
        Math.max(
            1,
            Math.round(
                damage
            )
        );

    enemy.hp =
        Math.max(
            0,
            enemy.hp -
            finalDamage
        );

    enemy.hitFlash =
        0.18;

    spawnParticles(
        enemy.x,
        enemy.y,

        finalDamage >= 70
            ? "#ff8c70"
            : "#ffffff",

        finalDamage >= 70
            ? 14
            : 8
    );

    state.world.effects.push({
        type:
            "damageNumber",

        x:
            enemy.x,

        y:
            enemy.y -
            enemy.radius -
            12,

        text:
            `-${finalDamage}`,

        life:
            0.72,

        maxLife:
            0.72,

        color:
            finalDamage >= 100
                ? "#cf7bff"
                : finalDamage >= 70
                ? "#ff715e"
                : finalDamage >= 45
                ? "#ffad56"
                : finalDamage >= 28
                ? "#ffe16d"
                : "#ffffff"
    });

    if (
        enemy.hp <= 0
    ) {
        defeatEnemy(
            enemy
        );
    }
}

/* =========================================================
   IA DOS INIMIGOS
========================================================= */

function updateEnemies(dt) {
    if (
        state.houseMode ||
        state.paused ||
        !state.player
    ) {
        return;
    }

    for (
        const enemy of
        state.world.enemies
    ) {
        /*
            Respawn de boss de recurso.
        */

        if (
            enemy.dead
        ) {
            if (
                enemy.type ===
                "resourceBoss"
            ) {
                enemy.respawnTimer -=
                    dt;

                if (
                    enemy.respawnTimer <=
                    0
                ) {
                    enemy.dead =
                        false;

                    enemy.hp =
                        enemy.maxHp;

                    enemy.aggressive =
                        false;

                    enemy.accepted =
                        false;

                    enemy.state =
                        "idle";

                    enemy.specialTimer =
                        random(
                            1.5,
                            3
                        );

                    showToast(
                        `${enemy.name} retornou à região.`
                    );
                }
            }

            continue;
        }

        enemy.attackTimer =
            Math.max(
                0,
                enemy.attackTimer -
                dt
            );

        enemy.specialTimer =
            Math.max(
                0,
                (
                    enemy.specialTimer ||
                    0
                ) -
                dt
            );

        enemy.hitFlash =
            Math.max(
                0,
                enemy.hitFlash -
                dt
            );

        enemy.stunTimer =
            Math.max(
                0,
                (
                    enemy.stunTimer ||
                    0
                ) -
                dt
            );

        /*
            Atualiza investida em andamento.
        */

        if (
            enemy.dashState
        ) {
            updateEnemyDash(
                enemy,
                dt
            );

            continue;
        }

        const d =
            distance(
                enemy,
                state.player
            );

        /*
            Chefe final.
        */

        if (
            enemy.type ===
            "final" &&
            !state.player.finalChoice
        ) {
            if (
                d <
                145 &&
                !state.finalChoiceShown
            ) {
                openFinalChoice();
            }

            continue;
        }

        /*
            Boss de progressão não inicia batalha
            sozinho antes da confirmação,
            mas continua visível.
        */

        if (
            enemy.type ===
            "progression" &&
            !enemy.accepted
        ) {
            continue;
        }

        /*
            Detecção.
        */

        if (
            !enemy.aggressive &&
            d <=
            enemy.vision
        ) {
            enemy.aggressive =
                true;

            enemy.state =
                "chasing";

            if (
                enemy.type ===
                "resourceBoss" ||
                enemy.type ===
                "hell"
            ) {
                showToast(
                    `${enemy.name} percebeu você!`
                );
            }
        }

        if (
            !enemy.aggressive
        ) {
            continue;
        }

        /*
            Se jogador fugir muito longe,
            criatura comum desiste.
        */

        if (
            d >
            enemy.vision *
            2.05 &&
            enemy.type !== "hell" &&
            enemy.type !== "final" &&
            enemy.type !== "progression"
        ) {
            enemy.aggressive =
                false;

            enemy.state =
                "idle";

            enemy.hp =
                Math.min(
                    enemy.maxHp,
                    enemy.hp +
                    enemy.maxHp *
                    0.14
                );

            continue;
        }

        if (
            enemy.stunTimer >
            0
        ) {
            continue;
        }

        updateEnemyPhase(
            enemy
        );

        /*
            Habilidades agora realmente são
            verificadas enquanto o boss persegue.
        */

        updateEnemySpecial(
            enemy
        );

        /*
            Enquanto avisa um ataque,
            inimigo fica mais lento.
        */

        const speedMultiplier =
            enemy.telegraphing
                ? 0.20
                : 1;

        /*
            Aproximação normal.
        */

        if (
            d >
            enemy.attackRange
        ) {
            const direction =
                normalizeVector(
                    state.player.x -
                    enemy.x,
                    state.player.y -
                    enemy.y
                );

            const move =
                enemy.speed *
                speedMultiplier *
                dt;

            const nextX =
                enemy.x +
                direction.x *
                move;

            const nextY =
                enemy.y +
                direction.y *
                move;

            if (
                canEnemyMoveTo(
                    nextX,
                    enemy.y,
                    enemy.radius
                )
            ) {
                enemy.x =
                    nextX;
            }

            if (
                canEnemyMoveTo(
                    enemy.x,
                    nextY,
                    enemy.radius
                )
            ) {
                enemy.y =
                    nextY;
            }
        }

        /*
            Ataque corpo a corpo.
        */

        else if (
            enemy.attackTimer <=
            0 &&
            !enemy.telegraphing
        ) {
            damagePlayer(
                enemy.damage
            );

            enemy.attackTimer =
                Math.max(
                    0.68,
                    1.18 -
                    enemy.phase *
                    0.07
                );

            state.world.effects.push({
                type:
                    "enemyHit",

                x:
                    state.player.x,

                y:
                    state.player.y,

                life:
                    0.24,

                maxLife:
                    0.24,

                color:
                    enemy.color
            });
        }

        if (
            enemy.type ===
            "final"
        ) {
            updateFinalBoss(
                enemy,
                dt
            );
        }
    }
}

/* =========================================================
   FASES DOS BOSSES
========================================================= */

function updateEnemyPhase(enemy) {
    if (
        enemy.type !== "progression" &&
        enemy.type !== "resourceBoss" &&
        enemy.type !== "final"
    ) {
        enemy.phase =
            1;

        return;
    }

    const ratio =
        enemy.hp /
        enemy.maxHp;

    const newPhase =
        ratio >
        0.72
            ? 1
            : ratio >
              0.42
            ? 2
            : 3;

    if (
        newPhase !==
        enemy.phase
    ) {
        enemy.phase =
            newPhase;

        enemy.specialTimer =
            Math.min(
                enemy.specialTimer ||
                1,
                0.65
            );

        state.world.effects.push({
            type:
                "bossPhase",

            x:
                enemy.x,

            y:
                enemy.y,

            radius:
                enemy.radius *
                3.5,

            life:
                0.8,

            maxLife:
                0.8,

            color:
                enemy.color
        });

        spawnParticles(
            enemy.x,
            enemy.y,
            enemy.color,
            28
        );

        showToast(
            `${enemy.name}: FASE ${newPhase}`
        );
    }
}

/* =========================================================
   COMEÇAR INVESTIDA DE INIMIGO
========================================================= */

function startEnemyDash(
    enemy,
    targetX,
    targetY,
    distanceAmount = 170,
    duration = 0.30
) {
    if (
        enemy.dashState
    ) {
        return;
    }

    const direction =
        normalizeVector(
            targetX -
            enemy.x,
            targetY -
            enemy.y
        );

    enemy.dashState = {
        dirX:
            direction.x,

        dirY:
            direction.y,

        remaining:
            distanceAmount,

        speed:
            distanceAmount /
            duration,

        hit:
            false
    };

    state.world.effects.push({
        type:
            "enemyDashTrail",

        enemy,

        life:
            duration,

        maxLife:
            duration,

        color:
            enemy.color
    });
}

/* =========================================================
   INVESTIDA ANIMADA DO INIMIGO
========================================================= */

function updateEnemyDash(
    enemy,
    dt
) {
    const dash =
        enemy.dashState;

    if (
        !dash
    ) {
        return;
    }

    const move =
        Math.min(
            dash.remaining,
            dash.speed *
            dt
        );

    const nextX =
        enemy.x +
        dash.dirX *
        move;

    const nextY =
        enemy.y +
        dash.dirY *
        move;

    let moved =
        false;

    if (
        canEnemyMoveTo(
            nextX,
            enemy.y,
            enemy.radius
        )
    ) {
        enemy.x =
            nextX;

        moved =
            true;
    }

    if (
        canEnemyMoveTo(
            enemy.x,
            nextY,
            enemy.radius
        )
    ) {
        enemy.y =
            nextY;

        moved =
            true;
    }

    dash.remaining -=
        move;

    if (
        Math.random() <
        0.5
    ) {
        spawnParticles(
            enemy.x,
            enemy.y,
            enemy.color,
            2
        );
    }

    if (
        !dash.hit &&
        distance(
            enemy,
            state.player
        ) <=
        enemy.radius +
        state.player.radius +
        8
    ) {
        dash.hit =
            true;

        damagePlayer(
            Math.round(
                enemy.damage *
                1.15
            )
        );
    }

    if (
        dash.remaining <=
        0 ||
        !moved
    ) {
        enemy.dashState =
            null;
    }
}

/* =========================================================
   HABILIDADES DOS INIMIGOS
========================================================= */

function updateEnemySpecial(enemy) {
    if (
        !enemy.special ||
        enemy.specialTimer >
        0 ||
        enemy.telegraphing ||
        enemy.dashState
    ) {
        return;
    }

    const phase =
        Math.max(
            1,
            enemy.phase ||
            1
        );

    const playerX =
        state.player.x;

    const playerY =
        state.player.y;

    /*
        INVESTIDA
    */

    if (
        enemy.special ===
        "dash"
    ) {
        enemy.telegraphing =
            true;

        state.world.effects.push({
            type:
                "dashWarning",

            x:
                enemy.x,

            y:
                enemy.y,

            tx:
                playerX,

            ty:
                playerY,

            life:
                0.68,

            maxLife:
                0.68,

            color:
                "#ff5b50"
        });

        setTimeout(
            () => {
                if (
                    enemy.dead
                ) {
                    return;
                }

                enemy.telegraphing =
                    false;

                startEnemyDash(
                    enemy,
                    state.player.x,
                    state.player.y,
                    190,
                    0.34
                );
            },
            680
        );

        enemy.specialTimer =
            random(
                3.5,
                5
            );

        return;
    }

    /*
        PEDRA LANÇADA
    */

    if (
        enemy.special ===
        "rockThrow"
    ) {
        enemy.telegraphing =
            true;

        addHazard(
            playerX,
            playerY,
            60,
            0.92,
            Math.round(
                enemy.damage *
                0.95
            ),
            {
                sourceId:
                    enemy.id,

                kind:
                    "rockThrow"
            }
        );

        state.world.effects.push({
            type:
                "rockProjectile",

            x:
                enemy.x,

            y:
                enemy.y,

            tx:
                playerX,

            ty:
                playerY,

            life:
                0.92,

            maxLife:
                0.92,

            color:
                "#8d8275"
        });

        setTimeout(
            () => {
                if (
                    !enemy.dead
                ) {
                    enemy.telegraphing =
                        false;
                }
            },
            980
        );

        enemy.specialTimer =
            random(
                3.1,
                4.5
            );

        return;
    }

    /*
        TIRO DE CRISTAL
    */

    if (
        enemy.special ===
        "crystalShot"
    ) {
        enemy.telegraphing =
            true;

        addHazard(
            playerX,
            playerY,
            49,
            0.72,
            Math.round(
                enemy.damage *
                0.92
            ),
            {
                sourceId:
                    enemy.id,

                kind:
                    "crystalShot"
            }
        );

        state.world.effects.push({
            type:
                "crystalProjectile",

            x:
                enemy.x,

            y:
                enemy.y,

            tx:
                playerX,

            ty:
                playerY,

            life:
                0.72,

            maxLife:
                0.72,

            color:
                "#ff6685"
        });

        setTimeout(
            () => {
                if (
                    !enemy.dead
                ) {
                    enemy.telegraphing =
                        false;
                }
            },
            790
        );

        enemy.specialTimer =
            random(
                2.8,
                4.2
            );

        return;
    }

    /*
        CONFIGURAÇÕES DE ATAQUES EM ÁREA.
    */

    const configs = {
        memoryWave: {
            radius:
                76,

            delay:
                0.95,

            mult:
                1.05,

            count:
                2 +
                phase,

            spread:
                135,

            color:
                "#d86161"
        },

        natureBurst: {
            radius:
                105,

            delay:
                1,

            mult:
                1.05,

            count:
                1,

            spread:
                0,

            color:
                "#8eb566"
        },

        rootCircle: {
            radius:
                80,

            delay:
                1.02,

            mult:
                1.1,

            count:
                2 +
                phase,

            spread:
                150,

            color:
                "#5e8a54"
        },

        leafStorm: {
            radius:
                67,

            delay:
                0.88,

            mult:
                1.05,

            count:
                3 +
                phase,

            spread:
                180,

            color:
                "#759865"
        },

        rockStorm: {
            radius:
                73,

            delay:
                0.90,

            mult:
                1.15,

            count:
                3 +
                phase *
                2,

            spread:
                210,

            color:
                "#887f72"
        },

        oreBurst: {
            radius:
                72,

            delay:
                0.86,

            mult:
                1.1,

            count:
                3 +
                phase,

            spread:
                165,

            color:
                "#919b9f"
        },

        crystalRain: {
            radius:
                65,

            delay:
                0.74,

            mult:
                1.14,

            count:
                4 +
                phase *
                2,

            spread:
                220,

            color:
                "#ef5476"
        },

        shadowBurst: {
            radius:
                84,

            delay:
                0.86,

            mult:
                1.15,

            count:
                3 +
                phase,

            spread:
                180,

            color:
                "#76528e"
        },

        voidCircle: {
            radius:
                94,

            delay:
                1,

            mult:
                1.18,

            count:
                2 +
                phase,

            spread:
                170,

            color:
                "#51336e"
        },

        fairyBurst: {
            radius:
                68,

            delay:
                0.78,

            mult:
                1.05,

            count:
                2 +
                phase,

            spread:
                160,

            color:
                "#df95dd"
        },

        fairyStorm: {
            radius:
                62,

            delay:
                0.72,

            mult:
                1.15,

            count:
                4 +
                phase *
                2,

            spread:
                225,

            color:
                "#dda1e8"
        },

        fireCircle: {
            radius:
                78,

            delay:
                0.80,

            mult:
                1.12,

            count:
                2 +
                phase,

            spread:
                150,

            color:
                "#ff6e3c"
        },

        infernalStorm: {
            radius:
                80,

            delay:
                0.66,

            mult:
                1.22,

            count:
                5 +
                phase *
                2,

            spread:
                250,

            color:
                "#ff583c"
        },

        finalMemoryStorm: {
            radius:
                84,

            delay:
                0.62,

            mult:
                1.25,

            count:
                6 +
                phase *
                3,

            spread:
                270,

            color:
                "#bc8cff"
        }
    };

    const config =
        configs[
            enemy.special
        ];

    if (
        !config
    ) {
        enemy.specialTimer =
            3;

        return;
    }

    enemy.telegraphing =
        true;

    for (
        let i = 0;
        i <
        config.count;
        i++
    ) {
        const angle =
            random(
                0,
                Math.PI *
                2
            );

        const spread =
            i ===
            0
                ? 0
                : random(
                    55,
                    config.spread
                );

        const x =
            playerX +
            Math.cos(
                angle
            ) *
            spread;

        const y =
            playerY +
            Math.sin(
                angle
            ) *
            spread;

        addHazard(
            x,
            y,
            config.radius,
            config.delay +
            i *
            0.045,
            Math.round(
                enemy.damage *
                config.mult
            ),
            {
                sourceId:
                    enemy.id,

                kind:
                    enemy.special,

                color:
                    config.color
            }
        );
    }

    state.world.effects.push({
        type:
            "enemyCast",

        x:
            enemy.x,

        y:
            enemy.y,

        radius:
            enemy.radius *
            2.2,

        life:
            config.delay,

        maxLife:
            config.delay,

        color:
            config.color
    });

    setTimeout(
        () => {
            if (
                !enemy.dead
            ) {
                enemy.telegraphing =
                    false;
            }
        },
        config.delay *
        1000 +
        130
    );

    enemy.specialTimer =
        Math.max(
            1.7,
            random(
                3.7,
                5.1
            ) -
            phase *
            0.42
        );
}

/* =========================================================
   ATAQUES DO BOSS FINAL
========================================================= */

function updateFinalBoss(
    enemy,
    dt
) {
    const ratio =
        enemy.hp /
        enemy.maxHp;

    const newPhase =
        ratio >
        0.8
            ? 1
            : ratio >
              0.6
            ? 2
            : ratio >
              0.4
            ? 3
            : ratio >
              0.2
            ? 4
            : 5;

    if (
        newPhase !==
        enemy.finalPhase
    ) {
        enemy.finalPhase =
            newPhase;

        showToast(
            `O OUTRO EU — FASE ${newPhase}`
        );

        spawnParticles(
            enemy.x,
            enemy.y,
            "#c296ff",
            40
        );
    }

    enemy.finalSpecialTimer =
        Math.max(
            0,
            (
                enemy.finalSpecialTimer ||
                2.4
            ) -
            dt
        );

    if (
        enemy.finalSpecialTimer >
        0 ||
        enemy.telegraphing
    ) {
        return;
    }

    const count =
        3 +
        newPhase *
        2;

    const delay =
        Math.max(
            0.48,
            0.95 -
            newPhase *
            0.07
        );

    for (
        let i = 0;
        i <
        count;
        i++
    ) {
        const angle =
            random(
                0,
                Math.PI *
                2
            );

        const spread =
            i ===
            0
                ? 0
                : random(
                    60,
                    250
                );

        addHazard(
            state.player.x +
            Math.cos(
                angle
            ) *
            spread,

            state.player.y +
            Math.sin(
                angle
            ) *
            spread,

            68 +
            newPhase *
            4,

            delay +
            i *
            0.04,

            Math.round(
                enemy.damage *
                (
                    0.65 +
                    newPhase *
                    0.07
                )
            ),

            {
                sourceId:
                    enemy.id,

                kind:
                    "quietudeFinal",

                color:
                    "#a66aff"
            }
        );
    }

    enemy.finalSpecialTimer =
        Math.max(
            1.5,
            4 -
            newPhase *
            0.44
        );
}

/* =========================================================
   ATUALIZAR ÁREAS DE PERIGO
========================================================= */

function updateHazards(dt) {
    for (
        const hazard of
        state.world.hazards
    ) {
        hazard.delay -=
            dt;

        hazard.life -=
            dt;

        if (
            !hazard.triggered &&
            hazard.delay <= 0
        ) {
            hazard.triggered =
                true;

            if (
                Math.hypot(
                    state.player.x -
                    hazard.x,
                    state.player.y -
                    hazard.y
                ) <=
                hazard.radius +
                state.player.radius
            ) {
                damagePlayer(
                    hazard.damage
                );
            }

            const particleColor =
                hazard.kind
                    ?.includes(
                        "crystal"
                    )
                    ? "#ff6d8c"
                    : hazard.kind
                        ?.includes(
                            "fairy"
                        )
                    ? "#e8a6ff"
                    : hazard.kind
                        ?.includes(
                            "void"
                        )
                    ? "#8a55a8"
                    : hazard.kind
                        ?.includes(
                            "fire"
                        )
                    ? "#ff6e37"
                    : hazard.kind ===
                        "quietudeFinal"
                    ? "#c07cff"
                    : "#e85c45";

            spawnParticles(
                hazard.x,
                hazard.y,
                particleColor,
                18
            );

            state.world.effects.push({
                type:
                    "hazardImpact",

                x:
                    hazard.x,

                y:
                    hazard.y,

                radius:
                    hazard.radius,

                life:
                    0.28,

                maxLife:
                    0.28,

                color:
                    particleColor
            });
        }
    }

    state.world.hazards =
        state.world.hazards.filter(
            hazard =>
                hazard.life >
                0
        );
}

/* =========================================================
   DANO NO PLAYER
========================================================= */

function damagePlayer(amount) {
    const player =
        state.player;

    if (
        !player ||
        player.invincible >
        0 ||
        player.dead
    ) {
        return;
    }

    const armorDefense =
        ITEMS[
            player.equipment.armor
        ]?.defense ||
        0;

    const rawDamage =
        Math.max(
            1,
            amount -
            (
                player.defense +
                armorDefense
            ) *
            0.35
        );

    const reduction =
        clamp(
            player.damageReduction ||
            0,
            0,
            0.72
        );

    const finalDamage =
        Math.max(
            1,
            Math.round(
                rawDamage *
                (
                    1 -
                    reduction
                )
            )
        );

    player.hp =
        Math.max(
            0,
            player.hp -
            finalDamage
        );

    player.invincible =
        0.55;

    state.world.effects.push({
        type:
            "damageNumber",

        x:
            player.x,

        y:
            player.y -
            26,

        text:
            `-${finalDamage}`,

        life:
            0.72,

        maxLife:
            0.72,

        color:
            "#ff8178"
    });

    state.world.effects.push({
        type:
            "playerDamageFlash",

        x:
            player.x,

        y:
            player.y,

        life:
            0.22,

        maxLife:
            0.22,

        color:
            "#ff5a53"
    });

    if (
        player.hp <= 0
    ) {
        playerDeath();
    }
}

/* =========================================================
   MORTE
========================================================= */

function playerDeath() {
    if (
        state.player.dead
    ) {
        return;
    }

    state.player.dead =
        true;

    state.paused =
        true;

    state.pointer.down =
        false;

    state.keys.clear();

    cancelHoldInteraction();

    must(
        "deathPanel"
    ).classList.remove(
        "hidden"
    );
}

/* =========================================================
   RESPAWN
========================================================= */

function respawnPlayer() {
    const checkpoint =
        state.player.checkpoint ||
        {
            area:
                "village",

            x:
                480,

            y:
                610
        };

    state.area =
        REGIONS[
            checkpoint.area
        ]
            ? checkpoint.area
            : "village";

    state.houseMode =
        false;

    state.currentHouse =
        null;

    state.houseReturn =
        null;

    buildWorld();

    state.player.x =
        checkpoint.x;

    state.player.y =
        checkpoint.y;

    state.player.hp =
        Math.max(
            1,
            Math.floor(
                state.player.maxHp *
                0.7
            )
        );

    state.player.magic =
        Math.max(
            1,
            Math.floor(
                state.player.maxMagic *
                0.7
            )
        );

    state.player.energy =
        Math.max(
            1,
            Math.floor(
                state.player.maxEnergy *
                0.7
            )
        );

    state.player.hunger =
        Math.max(
            28,
            state.player.hunger
        );

    state.player.fatigue =
        Math.max(
            28,
            state.player.fatigue
        );

    state.player.money =
        Math.floor(
            state.player.money *
            0.9
        );

    state.player.dead =
        false;

    state.player.invincible =
        1;

    state.paused =
        false;

    must(
        "deathPanel"
    ).classList.add(
        "hidden"
    );

    updateCamera();

    showToast(
        "Você retornou ao último ponto seguro."
    );
}

/* =========================================================
   DERROTAR INIMIGO
========================================================= */

function defeatEnemy(enemy) {
    if (
        enemy.dead
    ) {
        return;
    }

    enemy.dead =
        true;

    enemy.state =
        "dead";

    enemy.aggressive =
        false;

    enemy.telegraphing =
        false;

    enemy.dashState =
        null;

    spawnParticles(
        enemy.x,
        enemy.y,
        enemy.color ||
        "#ffffff",
        enemy.type ===
        "progression"
            ? 38
            : 18
    );

    state.world.effects.push({
        type:
            "enemyDeath",

        x:
            enemy.x,

        y:
            enemy.y,

        radius:
            enemy.radius *
            2.6,

        life:
            0.65,

        maxLife:
            0.65,

        color:
            enemy.color ||
            "#ffffff"
    });

    const xp =
        enemy.type ===
        "progression"
            ? 180
            : enemy.type ===
              "resourceBoss"
            ? 120
            : enemy.type ===
              "hell"
            ? 60
            : enemy.type ===
              "final"
            ? 600
            : enemy.horde
            ? 42 +
              enemy.horde *
              6
            : 30;

    const money =
        enemy.type ===
        "progression"
            ? 80
            : enemy.type ===
              "resourceBoss"
            ? 45
            : enemy.type ===
              "final"
            ? 250
            : 12;

    state.player.xp +=
        xp;

    state.player.money +=
        money;

    /*
        DROP AGORA NÃO ENTRA AUTOMATICAMENTE.

        Ele aparece no chão e o jogador
        deve aproximar e apertar E.
    */

    const shouldDrop =
        enemy.drop &&
        ITEMS[
            enemy.drop
        ] &&
        Math.random() <=
        (
            enemy.dropChance ??
            1
        );

    if (
        shouldDrop
    ) {
        const amount =
            enemy.dropAmount ||
            1;

        createWorldDrop(
            enemy.x,
            enemy.y,
            enemy.drop,
            amount,
            {
                source:
                    enemy.name
            }
        );
    }

    /*
        Guardião do Caminho.
    */

    if (
        enemy.id ===
        "path_guardian"
    ) {
        createWorldDrop(
            enemy.x +
            24,
            enemy.y,
            "flautaMemoria",
            1,
            {
                permanent:
                    true,

                source:
                    enemy.name
            }
        );

        showToast(
            "A Flauta da Memória caiu no chão. Aproxime-se e pressione E."
        );
    }

    /*
        Boss de recurso volta depois.
    */

    if (
        enemy.type ===
        "resourceBoss"
    ) {
        enemy.respawnTimer =
            enemy.respawnTime ||
            60;
    }

    /*
        Tipos do Inferno.
    */

    if (
        enemy.type ===
        "hell" &&
        enemy.hellType !==
        undefined
    ) {
        state.player
            .hellTypesDefeated[
                String(
                    enemy.hellType
                )
            ] =
            true;
    }

    /*
        Bosses de progressão.
    */

    if (
        enemy.type ===
        "progression"
    ) {
        if (
            !state.player
                .defeatedBosses
                .includes(
                    enemy.id
                )
        ) {
            state.player
                .defeatedBosses
                .push(
                    enemy.id
                );
        }

        if (
            !state.player
                .discoveredBosses
                .includes(
                    enemy.id
                )
        ) {
            state.player
                .discoveredBosses
                .push(
                    enemy.id
                );
        }

        if (
            enemy.unlock &&
            !state.player
                .unlockedAreas
                .includes(
                    enemy.unlock
                )
        ) {
            state.player
                .unlockedAreas
                .push(
                    enemy.unlock
                );
        }

        showToast(
            `Boss derrotado: ${enemy.name}. Registro atualizado no Livro.`
        );
    }

    /*
        Boss final.
    */

    if (
        enemy.type ===
        "final"
    ) {
        state.player.finalDefeated =
            true;

        showEnding(
            "Você enfrentou a Quietude e preservou sua própria memória."
        );
    }

    checkLevelUp();

    saveGame(
        false
    );
}

/* =========================================================
   CRIAR DROP NO CHÃO
========================================================= */

function createWorldDrop(
    x,
    y,
    type,
    amount = 1,
    extra = {}
) {
    if (
        !ITEMS[
            type
        ]
    ) {
        return null;
    }

    const drop = {
        id:
            uid(
                "drop"
            ),

        x:
            x +
            random(
                -13,
                13
            ),

        y:
            y +
            random(
                -13,
                13
            ),

        type,

        amount:
            Math.max(
                1,
                Math.floor(
                    amount
                )
            ),

        life:
            extra.permanent
                ? Infinity
                : 60,

        bobOffset:
            random(
                0,
                Math.PI *
                2
            ),

        collected:
            false,

        permanent:
            Boolean(
                extra.permanent
            ),

        source:
            extra.source ||
            null
    };

    state.world.drops.push(
        drop
    );

    return drop;
}

/* =========================================================
   COLETAR DROP
========================================================= */

function collectWorldDrop(drop) {
    if (
        !drop ||
        drop.collected
    ) {
        return;
    }

    if (
        !ITEMS[
            drop.type
        ]
    ) {
        drop.collected =
            true;

        return;
    }

    if (
        ITEMS[
            drop.type
        ].unique &&
        (
            state.player.inventory[
                drop.type
            ] ||
            0
        ) >
        0
    ) {
        showToast(
            "Você já possui este item especial."
        );

        return;
    }

    addItem(
        drop.type,
        drop.amount
    );

    drop.collected =
        true;

    spawnParticles(
        drop.x,
        drop.y,
        "#ffe4a0",
        12
    );

    const item =
        ITEMS[
            drop.type
        ];

    showToast(
        `${item.name} coletado: x${drop.amount}`
    );

    if (
        drop.type ===
        "flautaMemoria"
    ) {
        showToast(
            "Flauta da Memória obtida. Ela parece reagir ao Céu."
        );
    }

    saveGame(
        false
    );
}

/* =========================================================
   ATUALIZAR DROPS
========================================================= */

function updateWorldDrops(dt) {
    for (
        const drop of
        state.world.drops
    ) {
        if (
            drop.collected
        ) {
            continue;
        }

        if (
            Number.isFinite(
                drop.life
            )
        ) {
            drop.life -=
                dt;
        }
    }

    state.world.drops =
        state.world.drops.filter(
            drop =>
                !drop.collected &&
                (
                    !Number.isFinite(
                        drop.life
                    ) ||
                    drop.life >
                    0
                )
        );
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
                player.xpToNext *
                1.42
            );

        player.maxHp +=
            12;

        player.maxMagic +=
            8;

        player.maxEnergy +=
            8;

        player.damage +=
            2;

        player.defense +=
            1;

        player.hp =
            player.maxHp;

        player.magic =
            player.maxMagic;

        player.energy =
            player.maxEnergy;

        player.memory =
            Math.min(
                100,
                player.memory +
                8
            );

        state.world.effects.push({
            type:
                "levelUp",

            x:
                player.x,

            y:
                player.y,

            radius:
                140,

            life:
                1.2,

            maxLife:
                1.2,

            color:
                "#ffe38f"
        });

        spawnParticles(
            player.x,
            player.y,
            "#ffe38f",
            36
        );

        if (
            player.level ===
            5
        ) {
            showToast(
                "NÍVEL 5! Sua habilidade R foi desbloqueada."
            );
        }

        else if (
            player.level ===
            10
        ) {
            showToast(
                "NÍVEL 10! Sua habilidade F foi desbloqueada."
            );
        }

        else {
            showToast(
                `Você chegou ao nível ${player.level}!`
            );
        }
    }
}

/* =========================================================
   INVENTÁRIO - ADICIONAR ITEM
========================================================= */

function addItem(
    id,
    amount
) {
    if (
        !ITEMS[id] ||
        !state.player
    ) {
        return false;
    }

    const safeAmount =
        Math.max(
            0,
            Math.floor(
                amount
            )
        );

    if (
        !safeAmount
    ) {
        return false;
    }

    if (
        state.player
            .inventory[
                id
            ] ===
        undefined
    ) {
        state.player
            .inventory[
                id
            ] =
            0;
    }

    if (
        ITEMS[id].unique &&
        state.player
            .inventory[
                id
            ] >
        0
    ) {
        return false;
    }

    state.player
        .inventory[
            id
        ] +=
        safeAmount;

    return true;
}

/* =========================================================
   INVENTÁRIO - REMOVER ITEM
========================================================= */

function removeItem(
    id,
    amount
) {
    const safeAmount =
        Math.max(
            0,
            Math.floor(
                amount
            )
        );

    if (
        !safeAmount
    ) {
        return false;
    }

    const current =
        state.player
            ?.inventory
            ?.[
                id
            ] ||
        0;

    if (
        current <
        safeAmount
    ) {
        return false;
    }

    state.player
        .inventory[
            id
        ] =
        current -
        safeAmount;

    return true;
}

/* =========================================================
   COLETA DE ÁRVORE
========================================================= */

function harvestTree(tree) {
    if (
        !tree
            ?.alive
    ) {
        return;
    }

    const cost =
        4;

    if (
        state.player.magic <
        cost
    ) {
        showToast(
            "Magia insuficiente para cortar a árvore."
        );

        return;
    }

    state.player.magic -=
        cost;

    state.player.hunger =
        Math.max(
            0,
            state.player.hunger -
            0.75
        );

    state.player.fatigue =
        Math.max(
            0,
            state.player.fatigue -
            1.5
        );

    tree.alive =
        false;

    tree.respawn =
        random(
            18,
            30
        );

    addItem(
        "madeira",
        tree.amount
    );

    const key =
        `tree:${state.area}`;

    const count =
        state.player
            .collected[
                key
            ] ||
        0;

    state.player
        .collected[
            key
        ] =
        count +
        1;

    state.player.xp +=
        Math.max(
            2,
            7 -
            Math.floor(
                count /
                4
            )
        );

    /*
        Mais efeito de madeira.
    */

    for (
        let i = 0;
        i <
        3;
        i++
    ) {
        state.world.effects.push({
            type:
                "woodChunk",

            x:
                tree.x +
                random(
                    -15,
                    15
                ),

            y:
                tree.y +
                random(
                    -10,
                    10
                ),

            vx:
                random(
                    -55,
                    55
                ),

            vy:
                random(
                    -85,
                    -30
                ),

            life:
                random(
                    0.6,
                    0.9
                ),

            maxLife:
                0.9,

            color:
                "#9b7345"
        });
    }

    spawnParticles(
        tree.x,
        tree.y,
        "#9b7345",
        18
    );

    checkLevelUp();

    showToast(
        `Madeira coletada: x${tree.amount}`
    );
}

/* =========================================================
   COLETA DE MINÉRIO
========================================================= */

function collectResource(
    resource
) {
    if (
        !resource
            ?.alive
    ) {
        return;
    }

    const costs = {
        carvao:
            7,

        ferro:
            13,

        ouro:
            24,

        rubi:
            35,

        cristal:
            18
    };

    const cost =
        costs[
            resource.type
        ] ||
        7;

    if (
        state.player.magic <
        cost
    ) {
        showToast(
            "Magia insuficiente para coletar este recurso."
        );

        return;
    }

    state.player.magic -=
        cost;

    state.player.hunger =
        Math.max(
            0,
            state.player.hunger -
            0.8
        );

    state.player.fatigue =
        Math.max(
            0,
            state.player.fatigue -
            1.7
        );

    resource.alive =
        false;

    resource.respawn =
        random(
            24,
            40
        );

    addItem(
        resource.type,
        resource.amount
    );

    const key =
        `resource:${state.area}:${resource.type}`;

    const count =
        state.player
            .collected[
                key
            ] ||
        0;

    state.player
        .collected[
            key
        ] =
        count +
        1;

    state.player.xp +=
        Math.max(
            2,
            8 -
            Math.floor(
                count /
                4
            )
        );

    state.player.memory =
        Math.min(
            100,
            state.player.memory +
            1
        );

    state.world.effects.push({
        type:
            "resourceBreak",

        x:
            resource.x,

        y:
            resource.y,

        life:
            0.55,

        maxLife:
            0.55,

        color:
            resource.type ===
            "rubi"
                ? "#ff5677"
                : resource.type ===
                  "ouro"
                ? "#f6cd57"
                : resource.type ===
                  "cristal"
                ? "#b995ff"
                : "#aeb8bd"
    });

    spawnParticles(
        resource.x,
        resource.y,
        resource.type ===
        "rubi"
            ? "#ff6685"
            : resource.type ===
              "ouro"
            ? "#ffd86a"
            : resource.type ===
              "cristal"
            ? "#bea3ff"
            : "#a9b4b9",
        18
    );

    checkLevelUp();

    showToast(
        `${ITEMS[resource.type].name} coletado: x${resource.amount}`
    );
}

/* =========================================================
   COLETA SEGURANDO E
========================================================= */

function beginHoldInteraction(
    interaction
) {
    if (
        !interaction ||
        ![
            "tree",
            "resource"
        ].includes(
            interaction.type
        )
    ) {
        return false;
    }

    const duration =
        interaction.type ===
        "tree"
            ? 2.2
            : interaction.object.type ===
              "rubi"
            ? 2.9
            : interaction.object.type ===
              "ouro"
            ? 2.35
            : 1.8;

    state.holdAction = {
        type:
            interaction.type,

        object:
            interaction.object,

        elapsed:
            0,

        duration
    };

    must(
        "holdProgressTitle"
    ).textContent =
        interaction.type ===
        "tree"
            ? "Cortando madeira..."
            : `Coletando ${
                ITEMS[
                    interaction.object.type
                ]?.name ||
                "recurso"
            }...`;

    must(
        "holdProgressFill"
    ).style.width =
        "0%";

    must(
        "holdProgress"
    ).classList.remove(
        "hidden"
    );

    return true;
}

/* =========================================================
   CANCELAR COLETA
========================================================= */

function cancelHoldInteraction() {
    state.holdAction =
        null;

    const panel =
        $(
            "holdProgress"
        );

    if (
        panel
    ) {
        panel.classList.add(
            "hidden"
        );
    }

    const fill =
        $(
            "holdProgressFill"
        );

    if (
        fill
    ) {
        fill.style.width =
            "0%";
    }
}

/* =========================================================
   ATUALIZAR COLETA SEGURANDO E
========================================================= */

function updateHoldInteraction(dt) {
    const hold =
        state.holdAction;

    if (
        !hold
    ) {
        return;
    }

    if (
        !state.keys.has(
            "e"
        ) ||
        state.paused ||
        !hold.object
            ?.alive
    ) {
        cancelHoldInteraction();

        return;
    }

    const maxDistance =
        hold.type ===
        "tree"
            ? 78
            : 76;

    if (
        distance(
            state.player,
            hold.object
        ) >
        maxDistance
    ) {
        cancelHoldInteraction();

        return;
    }

    hold.elapsed +=
        dt;

    const percent =
        clamp(
            (
                hold.elapsed /
                hold.duration
            ) *
            100,
            0,
            100
        );

    must(
        "holdProgressFill"
    ).style.width =
        `${percent}%`;

    /*
        Pequenas partículas enquanto coleta.
    */

    if (
        Math.random() <
        0.08
    ) {
        spawnParticles(
            hold.object.x,
            hold.object.y,
            hold.type ===
            "tree"
                ? "#b48555"
                : "#c7ced0",
            2
        );
    }

    if (
        hold.elapsed >=
        hold.duration
    ) {
        const interaction = {
            type:
                hold.type,

            object:
                hold.object
        };

        cancelHoldInteraction();

        if (
            interaction.type ===
            "tree"
        ) {
            harvestTree(
                interaction.object
            );
        }

        else {
            collectResource(
                interaction.object
            );
        }
    }
}

/* =========================================================
   COMER CENOURA DO CHÃO
========================================================= */

function eatWorldFood(food) {
    if (
        !food ||
        !food.alive
    ) {
        return;
    }

    food.alive =
        false;

    food.respawn =
        random(
            food.respawnMin ||
            120,
            food.respawnMax ||
            180
        );

    if (
        food.type ===
        "carrot"
    ) {
        const hungerGain =
            food.hunger ||
            12;

        state.player.hunger =
            Math.min(
                100,
                state.player.hunger +
                hungerGain
            );

        state.player.hp =
            Math.min(
                state.player.maxHp,
                state.player.hp +
                2
            );

        showToast(
            `Você comeu uma cenoura. +${hungerGain} fome.`
        );

        spawnParticles(
            food.x,
            food.y,
            "#f3a34e",
            11
        );
    }
}

/* =========================================================
   ATUALIZAR RECURSOS / COMIDA
========================================================= */

function updateResources(dt) {
    for (
        const tree of
        state.world.trees
    ) {
        if (
            tree.alive
        ) {
            continue;
        }

        tree.respawn -=
            dt;

        if (
            tree.respawn <=
            0
        ) {
            respawnTree(
                tree
            );
        }
    }

    for (
        const resource of
        state.world.resources
    ) {
        if (
            resource.alive
        ) {
            continue;
        }

        resource.respawn -=
            dt;

        if (
            resource.respawn <=
            0
        ) {
            resource.alive =
                true;
        }
    }

    for (
        const food of
        state.world.foods
    ) {
        if (
            food.alive
        ) {
            continue;
        }

        food.respawn -=
            dt;

        if (
            food.respawn <=
            0
        ) {
            food.alive =
                true;
        }
    }

    updateWorldDrops(
        dt
    );
}

/* =========================================================
   RESPAWN DE ÁRVORE
========================================================= */

function respawnTree(tree) {
    let tries =
        0;

    let x =
        tree.x;

    let y =
        tree.y;

    do {
        x =
            randomInt(
                120,
                state.world.width -
                120
            );

        y =
            randomInt(
                120,
                state.world.height -
                120
            );

        tries++;
    }

    while (
        tries <
        60 &&
        !canPlayerMoveTo(
            x,
            y,
            35
        )
    );

    tree.x =
        x;

    tree.y =
        y;

    tree.alive =
        true;

    tree.amount =
        randomInt(
            2,
            5
        );

    const obstacle =
        state.world
            .obstacles
            .find(
                item =>
                    item.treeId ===
                    tree.id
            );

    if (
        obstacle
    ) {
        obstacle.x =
            x -
            30;

        obstacle.y =
            y -
            38;
    }
}

/* =========================================================
   EASTER EGG / SEGREDO
========================================================= */

function discoverSecret(secret) {
    if (
        !secret ||
        secret.found ||
        state.player
            .secretsFound
            .includes(
                secret.id
            )
    ) {
        return;
    }

    secret.found =
        true;

    state.player
        .secretsFound
        .push(
            secret.id
        );

    state.player.memory =
        Math.min(
            100,
            state.player.memory +
            3
        );

    state.player.xp +=
        22;

    state.world.effects.push({
        type:
            "secretReveal",

        x:
            secret.x,

        y:
            secret.y,

        radius:
            100,

        life:
            1.15,

        maxLife:
            1.15,

        color:
            "#e7ca83"
    });

    spawnParticles(
        secret.x,
        secret.y,
        "#e7ca83",
        25
    );

    checkLevelUp();

    showToast(
        `${secret.title}: ${secret.message}`
    );

    saveGame(
        false
    );
}

/* =========================================================
   PARTÍCULAS
========================================================= */

function spawnParticles(
    x,
    y,
    color,
    amount
) {
    for (
        let i = 0;
        i <
        amount;
        i++
    ) {
        const angle =
            random(
                0,
                Math.PI *
                2
            );

        const speed =
            random(
                25,
                95
            );

        state.world
            .particles
            .push({
                x,
                y,

                vx:
                    Math.cos(
                        angle
                    ) *
                    speed,

                vy:
                    Math.sin(
                        angle
                    ) *
                    speed,

                life:
                    random(
                        0.35,
                        0.85
                    ),

                maxLife:
                    0.85,

                size:
                    random(
                        2,
                        5
                    ),

                color
            });
    }
}

/* =========================================================
   ATUALIZAR PARTÍCULAS E EFEITOS
========================================================= */

function updateVisualEffects(dt) {
    state.world.particles =
        state.world.particles.filter(
            particle => {
                particle.x +=
                    particle.vx *
                    dt;

                particle.y +=
                    particle.vy *
                    dt;

                particle.vy +=
                    32 *
                    dt;

                particle.life -=
                    dt;

                return (
                    particle.life >
                    0
                );
            }
        );

    state.world.effects =
        state.world.effects.filter(
            effect => {
                /*
                    Alguns efeitos ambientais
                    não possuem life.
                */

                if (
                    !Number.isFinite(
                        effect.life
                    )
                ) {
                    return true;
                }

                effect.life -=
                    dt;

                /*
                    Movimento de pedaço de madeira.
                */

                if (
                    effect.type ===
                    "woodChunk"
                ) {
                    effect.x +=
                        effect.vx *
                        dt;

                    effect.y +=
                        effect.vy *
                        dt;

                    effect.vy +=
                        120 *
                        dt;
                }

                return (
                    effect.life >
                    0
                );
            }
        );
}
