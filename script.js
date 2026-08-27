(() => {
    "use strict";

    /* =====================================================
       VEYRA — A QUIETUDE
       VERSÃO 7.0
    ====================================================== */

    const SAVE_KEY = "veyra_save_v7";

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const screens = {
        menu: document.getElementById("menuScreen"),
        howTo: document.getElementById("howToScreen"),
        credits: document.getElementById("creditsScreen"),
        character: document.getElementById("characterScreen"),
        game: document.getElementById("gameScreen")
    };

    const WORLD = {
        width: 3600,
        height: 2600
    };

    const state = {
        selectedCharacter: null,
        player: null,

        running: false,
        paused: false,

        keys: new Set(),

        lastTime: 0,

        camera: {
            x: 0,
            y: 0
        },

        world: {
            obstacles: [],
            decorations: [],
            buildings: [],
            npcs: [],
            enemies: [],
            resources: [],
            bosses: [],
            exits: [],
            explored: new Set()
        },

        currentInteraction: null,

        damageNumbers: [],

        particles: [],

        toastTimer: null,

        transitionBusy: false,

        shopMode: "buy",

        inventoryCategory: "all",

        audioStarted: false
    };


    /* =====================================================
       PERSONAGENS
    ====================================================== */

    const characters = [

        {
            id: "kaelion",
            name: "KAELION",
            className: "Mago",
            icon: "🧙",
            color: "#e69a42",
            glow: "rgba(230,154,66,.35)",

            role: "Magia • Controle • Longo alcance",

            description:
                "Mago especializado em magia ofensiva e controle de inimigos. Possui menor resistência física.",

            story:
                "Kaelion passou anos estudando memórias antigas que desapareceram da história de Veyra.",

            hp: 85,
            magic: 150,
            energy: 100,
            hunger: 100,
            fatigue: 100,
            damage: 22,
            defense: 5,
            speed: 190,

            skill: {
                name: "Bola de Memória",
                icon: "🔮",
                damage: 42,
                cost: 15,
                cooldown: 2000,
                range: 420
            },

            secondary: {
                name: "Correntes da Quietude",
                damage: 20,
                cost: 25,
                cooldown: 5000,
                range: 300
            }
        },

        {
            id: "theron",
            name: "THERON",
            className: "Cavaleiro",
            icon: "🛡️",
            color: "#b9bec8",
            glow: "rgba(185,190,200,.3)",

            role: "Espada • Defesa • Corpo a corpo",

            description:
                "Guerreiro resistente que transforma defesa em força ofensiva.",

            story:
                "Theron jurou proteger a Vila do Crepúsculo depois que seu antigo reino foi esquecido.",

            hp: 140,
            magic: 75,
            energy: 120,
            hunger: 100,
            fatigue: 100,
            damage: 32,
            defense: 18,
            speed: 155,

            skill: {
                name: "Golpe Pesado",
                icon: "⚔️",
                damage: 55,
                cost: 10,
                cooldown: 3000,
                range: 100
            },

            secondary: {
                name: "Muralha",
                damage: 0,
                cost: 20,
                cooldown: 7000,
                range: 0
            }
        },

        {
            id: "grumgar",
            name: "GRUMGAR",
            className: "Troll",
            icon: "👹",
            color: "#718f52",
            glow: "rgba(113,143,82,.35)",

            role: "Força • Vida • Dano físico",

            description:
                "Uma criatura de força brutal. Extremamente resistente, porém lenta.",

            story:
                "Grumgar lembra de uma floresta que ninguém mais consegue lembrar que existiu.",

            hp: 180,
            magic: 60,
            energy: 90,
            hunger: 100,
            fatigue: 100,
            damage: 40,
            defense: 22,
            speed: 115,

            skill: {
                name: "Esmagamento",
                icon: "💥",
                damage: 68,
                cost: 0,
                cooldown: 4000,
                range: 120
            },

            secondary: {
                name: "Rugido",
                damage: 30,
                cost: 15,
                cooldown: 6000,
                range: 230
            }
        },

        {
            id: "lirael",
            name: "LIRAEL",
            className: "Fada",
            icon: "🧚",
            color: "#db83c6",
            glow: "rgba(219,131,198,.35)",

            role: "Velocidade • Cura • Magia",

            description:
                "Rápida e mágica. Pode atacar à distância e recuperar a própria vida.",

            story:
                "Lirael nasceu no Reino das Fadas, mas deixou seu povo após perceber que algumas memórias estavam sumindo.",

            hp: 95,
            magic: 135,
            energy: 130,
            hunger: 100,
            fatigue: 100,
            damage: 24,
            defense: 7,
            speed: 220,

            skill: {
                name: "Flecha Feérica",
                icon: "🏹",
                damage: 38,
                cost: 12,
                cooldown: 1500,
                range: 470
            },

            secondary: {
                name: "Luz Vital",
                damage: -45,
                cost: 25,
                cooldown: 5000,
                range: 0
            }
        },

        {
            id: "zephyr",
            name: "ZEPHYR",
            className: "Transmorfo",
            icon: "🦊",
            color: "#9c72d5",
            glow: "rgba(156,114,213,.35)",

            role: "Adaptação • Transformação • Equilíbrio",

            description:
                "Um transmorfo equilibrado que adapta suas características durante o combate.",

            story:
                "Zephyr não sabe qual foi sua primeira forma. Talvez essa seja justamente a sua maior força.",

            hp: 115,
            magic: 110,
            energy: 110,
            hunger: 100,
            fatigue: 100,
            damage: 28,
            defense: 12,
            speed: 175,

            skill: {
                name: "Forma Adaptativa",
                icon: "🌀",
                damage: 45,
                cost: 20,
                cooldown: 4000,
                range: 180
            },

            secondary: {
                name: "Mutação",
                damage: 0,
                cost: 18,
                cooldown: 8000,
                range: 0
            }
        }

    ];


    /* =====================================================
       ITENS
    ====================================================== */

    const ITEMS = {

        wood: {
            id: "wood",
            name: "Madeira",
            icon: "🪵",
            category: "materials",
            value: 2,
            weight: 1
        },

        coal: {
            id: "coal",
            name: "Carvão",
            icon: "⬛",
            category: "materials",
            value: 5,
            weight: 1
        },

        iron: {
            id: "iron",
            name: "Ferro",
            icon: "⛓️",
            category: "materials",
            value: 12,
            weight: 2
        },

        gold: {
            id: "gold",
            name: "Ouro",
            icon: "🪙",
            category: "materials",
            value: 30,
            weight: 2
        },

        ruby: {
            id: "ruby",
            name: "Rubi",
            icon: "💎",
            category: "materials",
            value: 70,
            weight: 2
        },

        potionHealth: {
            id: "potionHealth",
            name: "Poção de Cura",
            icon: "🧪",
            category: "potions",
            value: 30,
            weight: 1,
            heal: 40
        },

        potionStrength: {
            id: "potionStrength",
            name: "Poção de Força",
            icon: "🔥",
            category: "potions",
            value: 50,
            weight: 1
        },

        potionDefense: {
            id: "potionDefense",
            name: "Poção de Resistência",
            icon: "🛡️",
            category: "potions",
            value: 50,
            weight: 1
        },

        minimap: {
            id: "minimap",
            name: "Minimapa",
            icon: "🗺️",
            category: "special",
            value: 350,
            weight: 1
        },

        memoryFlute: {
            id: "memoryFlute",
            name: "Flauta da Memória",
            icon: "🎵",
            category: "special",
            value: 0,
            weight: 1
        },

        simpleSword: {
            id: "simpleSword",
            name: "Espada simples",
            icon: "🗡️",
            category: "weapons",
            value: 0,
            weight: 3,
            damage: 5
        },

        ironSword: {
            id: "ironSword",
            name: "Espada de Ferro",
            icon: "⚔️",
            category: "weapons",
            value: 120,
            weight: 4,
            damage: 15
        },

        leatherArmor: {
            id: "leatherArmor",
            name: "Armadura de Couro",
            icon: "🥋",
            category: "armor",
            value: 100,
            weight: 5,
            defense: 8
        }

    };


    /* =====================================================
       UTILITÁRIOS
    ====================================================== */

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function showScreen(name) {

        Object.values(screens).forEach(screen => {
            screen.classList.remove("active");
        });

        screens[name].classList.add("active");
    }


    /* =====================================================
       CANVAS
    ====================================================== */

    function resizeCanvas() {

        const ratio = window.devicePixelRatio || 1;

        canvas.width =
            Math.floor(window.innerWidth * ratio);

        canvas.height =
            Math.floor(window.innerHeight * ratio);

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


    /* =====================================================
       PERSONAGENS — INTERFACE
    ====================================================== */

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
                "--character-color",
                character.color
            );

            card.style.setProperty(
                "--character-glow",
                character.glow
            );

            card.innerHTML = `

                <div class="char-art">
                    ${character.icon}
                </div>

                <h3>${character.name}</h3>

                <p class="role">
                    ${character.className}
                    —
                    ${character.role}
                </p>

                <p>
                    ${character.description}
                </p>

                <div class="character-stats">

                    ${makeStat(
                        "Vida",
                        character.hp,
                        200,
                        character.color
                    )}

                    ${makeStat(
                        "Magia",
                        character.magic,
                        160,
                        character.color
                    )}

                    ${makeStat(
                        "Energia",
                        character.energy,
                        140,
                        character.color
                    )}

                    ${makeStat(
                        "Dano",
                        character.damage,
                        70,
                        character.color
                    )}

                    ${makeStat(
                        "Velocidade",
                        character.speed,
                        230,
                        character.color
                    )}

                </div>

                <p class="story-small">
                    ${character.story}
                </p>

                <p class="role">
                    ✦ ${character.skill.name}
                </p>
            `;

            card.addEventListener("click", () => {

                state.selectedCharacter = character;

                document
                    .querySelectorAll(".character-card")
                    .forEach(c => {
                        c.classList.remove("selected");
                    });

                card.classList.add("selected");
            });

            container.appendChild(card);
        });

        state.selectedCharacter = characters[0];
    }


    function makeStat(name, value, max, color) {

        const percentage =
            clamp((value / max) * 100, 5, 100);

        return `
            <div class="character-stat">

                <div class="character-stat-label">
                    <span>${name}</span>
                    <span>${value}</span>
                </div>

                <div class="character-stat-track">
                    <div
                        class="character-stat-fill"
                        style="
                            width:${percentage}%;
                            background:${color};
                        "
                    ></div>
                </div>

            </div>
        `;
    }


    /* =====================================================
       NOVO JOGO
    ====================================================== */

    function startNewGame() {

        document.getElementById("playerName").value = "";

        document.getElementById("nameError").textContent = "";

        state.selectedCharacter = characters[0];

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


    /* =====================================================
       CRIAR PLAYER
    ====================================================== */

    function createNewPlayer(name, character) {

        state.player = {

            name,

            characterId: character.id,

            className: character.className,

            x: 1100,
            y: 1050,

            radius: 19,

            hp: character.hp,
            maxHp: character.hp,

            magic: character.magic,
            maxMagic: character.magic,

            energy: character.energy,
            maxEnergy: character.energy,

            hunger: 100,
            maxHunger: 100,

            fatigue: 100,
            maxFatigue: 100,

            damage: character.damage,
            defense: character.defense,

            baseSpeed: character.speed,

            level: 1,

            xp: 0,
            xpToNext: 100,

            money: 40,

            statPoints: 0,

            inventory: {
                wood: 5,
                potionHealth: 2,
                simpleSword: 1
            },

            equipment: {
                weapon: "simpleSword",
                armor: null,
                accessory: null
            },

            skills: [
                character.skill.name
            ],

            bossesDefeated: [],
            bossesDiscovered: [],

            quests: {},

            regionsUnlocked: [
                "village"
            ],

            exploredRegions: [
                "village"
            ],

            minimapOwned: false,

            checkpoint: {
                x: 1100,
                y: 1050,
                region: "village"
            },

            explored: {},

            effects: [],

            cooldowns: {
                basic: 0,
                primary: 0,
                secondary: 0,
                potion: 0
            },

            gatheringMemory: {},

            storyFlags: {},

            dead: false
        };
    }


    /* =====================================================
       COMEÇAR JOGO
    ====================================================== */

    function beginGame() {

        const input =
            document.getElementById("playerName");

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

        buildWorld();

        updateHUD();

        showScreen("game");

        state.running = true;

        state.lastTime =
            performance.now();

        transitionIn();

        requestAnimationFrame(gameLoop);

        showToast(
            "Bem-vindo à Vila do Crepúsculo."
        );
    }


    /* =====================================================
       CONSTRUIR MUNDO
    ====================================================== */

    function buildWorld() {

        const world = state.world;

        world.obstacles = [];
        world.decorations = [];
        world.buildings = [];
        world.npcs = [];
        world.enemies = [];
        world.resources = [];
        world.bosses = [];
        world.exits = [];
        world.explored = new Set();


        /* =================================================
           LIMITES DO MAPA
        ================================================== */

        addObstacle(
            0,
            0,
            WORLD.width,
            60,
            "wall"
        );

        addObstacle(
            0,
            WORLD.height - 60,
            WORLD.width,
            60,
            "wall"
        );

        addObstacle(
            0,
            0,
            60,
            WORLD.height,
            "wall"
        );

        addObstacle(
            WORLD.width - 60,
            0,
            60,
            WORLD.height,
            "wall"
        );


        /* =================================================
           CASA DO JOGADOR
        ================================================== */

        addBuilding({
            x: 800,
            y: 650,
            w: 420,
            h: 270,
            name: "CASA DO JOGADOR",
            roof: "#784838",
            type: "playerHouse"
        });


        /* =================================================
           CASA ELIAN
        ================================================== */

        addBuilding({
            x: 1450,
            y: 520,
            w: 360,
            h: 240,
            name: "CASA DE ELIAN",
            roof: "#70523d"
        });


        /* =================================================
           FERREIRO
        ================================================== */

        addBuilding({
            x: 2350,
            y: 470,
            w: 450,
            h: 290,
            name: "FERREIRO",
            roof: "#4b4540"
        });


        /* =================================================
           LOJA
        ================================================== */

        addBuilding({
            x: 2520,
            y: 1280,
            w: 430,
            h: 300,
            name: "LOJA",
            roof: "#754a35"
        });


        /* =================================================
           CARPINTEIRO
        ================================================== */

        addBuilding({
            x: 650,
            y: 1600,
            w: 450,
            h: 300,
            name: "CARPINTEIRO",
            roof: "#76583d"
        });


        /* =================================================
           PRAÇA / POÇO
        ================================================== */

        addObstacle(
            1640,
            930,
            260,
            210,
            "well"
        );


        /* =================================================
           PEDRAS
        ================================================== */

        const rocks = [
            [580, 1040],
            [650, 1080],
            [1400, 1200],
            [2070, 1030],
            [2210, 1120],
            [3100, 880],
            [3250, 1800],
            [1750, 1800],
            [1320, 2050],
            [500, 2200]
        ];

        rocks.forEach(([x, y]) => {

            addObstacle(
                x - 32,
                y - 25,
                64,
                50,
                "rock"
            );

        });


        /* =================================================
           ÁRVORES
        ================================================== */

        const trees = [

            [180, 170],
            [400, 180],
            [650, 180],
            [920, 150],
            [1250, 180],
            [1500, 170],
            [1800, 180],
            [2100, 160],
            [2500, 180],
            [2900, 170],
            [3300, 180],

            [180, 600],
            [220, 950],
            [180, 1400],
            [220, 1850],
            [250, 2300],

            [1200, 2300],
            [1650, 2380],
            [2200, 2350],
            [2750, 2280],
            [3300, 2250],

            [3350, 1350],
            [3300, 600],

            [1200, 1300],
            [2100, 800],
            [2200, 1550],
            [1200, 1900]
        ];

        trees.forEach(([x, y]) => {

            addObstacle(
                x - 29,
                y - 42,
                58,
                82,
                "tree"
            );

            world.decorations.push({
                x,
                y,
                type: "tree",
                sway: random(0, Math.PI * 2)
            });
        });


        /* =================================================
           NPCS
        ================================================== */

        addNPC({
            id: "elian",
            x: 1350,
            y: 810,
            name: "ELIAN",
            role: "Morador / Missão",
            color: "#d5ae77",
            icon: "🧔",
            dialogue:
                "Você também sente? Algumas pessoas da vila estão começando a esquecer coisas que aconteceram ontem.",
            quest: "woodQuest"
        });

        addNPC({
            id: "mara",
            x: 2020,
            y: 1040,
            name: "MARA",
            role: "Historiadora",
            color: "#b98bc4",
            icon: "👩",
            dialogue:
                "A Quietude não começou aqui. Há histórias antigas sobre lugares que simplesmente deixaram de existir."
        });

        addNPC({
            id: "doran",
            x: 2410,
            y: 1200,
            name: "DORAN",
            role: "Comerciante",
            color: "#c58a54",
            icon: "🧑‍💼",
            dialogue:
                "Tenho mapas, poções e alguns equipamentos. Se tiver dinheiro, podemos negociar.",
            merchant: true
        });

        addNPC({
            id: "bran",
            x: 1190,
            y: 1510,
            name: "BRAN",
            role: "Carpinteiro",
            color: "#8d7053",
            icon: "👷",
            dialogue:
                "Madeira boa está ficando difícil de encontrar. Se trouxer materiais, posso melhorar seu equipamento."
        });

        addNPC({
            id: "forge",
            x: 2280,
            y: 830,
            name: "BORIN",
            role: "Ferreiro",
            color: "#8b8b8b",
            icon: "🔨",
            dialogue:
                "Uma espada precisa de três coisas: metal, fogo e alguém disposto a enfrentar o que está lá fora."
        });


        /* =================================================
           RECURSOS
        ================================================== */

        addResource(400, 1100, "wood", 10);
        addResource(500, 1250, "wood", 8);
        addResource(750, 1300, "wood", 7);

        addResource(2150, 1350, "coal", 5);
        addResource(2200, 1430, "coal", 6);

        addResource(2900, 1000, "iron", 4);
        addResource(3000, 1080, "iron", 5);

        addResource(3100, 1900, "gold", 2);

        addResource(1500, 2050, "ruby", 1);


        /* =================================================
           INIMIGOS
        ================================================== */

        spawnEnemy({
            id: "slime",
            type: "slime",
            x: 600,
            y: 1350,
            name: "Limo da Quietude",
            hp: 45,
            damage: 8,
            speed: 55,
            detection: 250,
            attackRange: 35,
            attackCooldown: 1400,
            xp: 20,
            money: 5,
            color: "#668d67"
        });

        spawnEnemy({
            id: "wolf",
            type: "wolf",
            x: 3100,
            y: 1450,
            name: "Lobo Esquecido",
            hp: 80,
            damage: 15,
            speed: 90,
            detection: 320,
            attackRange: 42,
            attackCooldown: 1000,
            xp: 35,
            money: 10,
            color: "#77757c"
        });

        spawnEnemy({
            id: "shade",
            type: "shade",
            x: 1900,
            y: 2000,
            name: "Sombra Perdida",
            hp: 110,
            damage: 20,
            speed: 70,
            detection: 350,
            attackRange: 50,
            attackCooldown: 1500,
            xp: 50,
            money: 18,
            color: "#493c68"
        });


        /* =================================================
           BOSS DE RECURSO
        ================================================== */

        state.world.bosses.push({
            id: "villageGuardian",
            name: "Guardião Esquecido",
            x: 3250,
            y: 500,
            hp: 500,
            maxHp: 500,
            damage: 30,
            speed: 65,
            detection: 500,
            attackRange: 90,
            attackCooldown: 1600,
            respawn: 30000,
            alive: true,
            respawnAt: 0,
            type: "resource",
            discovered: false,
            color: "#85558d"
        });


        /* =================================================
           SAÍDAS
        ================================================== */

        state.world.exits.push({

            id: "forestExit",

            x: 3440,
            y: 1050,

            w: 100,
            h: 260,

            target: "forest",

            label: "Floresta",

            unlocked: false

        });

        state.world.exits.push({

            id: "mountainExit",

            x: 1700,
            y: 70,

            w: 180,
            h: 80,

            target: "mountains",

            label: "Montanhas",

            unlocked: false

        });

    }


    /* =====================================================
       OBJETOS DO MUNDO
    ====================================================== */

    function addObstacle(x, y, w, h, type) {

        state.world.obstacles.push({
            x,
            y,
            w,
            h,
            type
        });
    }


    function addBuilding(building) {

        state.world.buildings.push(building);

        /*
         * A colisão ocupa a CASA INTEIRA.
         * Não apenas as laterais.
         */
        addObstacle(
            building.x,
            building.y,
            building.w,
            building.h,
            "building"
        );
    }


    function addNPC(npc) {

        state.world.npcs.push({
            ...npc,
            radius: 18,
            targetX: npc.x,
            targetY: npc.y,
            moveTimer: random(1, 5),
            questProgress: 0
        });
    }


    function addResource(x, y, type, amount) {

        state.world.resources.push({

            x,
            y,

            type,

            amount,

            collected: 0,

            radius: 20,

            cooldownUntil: 0
        });
    }


    function spawnEnemy(enemy) {

        state.world.enemies.push({
            ...enemy,
            maxHp: enemy.hp,
            alive: true,
            attackTimer: 0,
            hitFlash: 0
        });
    }


    /* =====================================================
       COLISÃO
    ====================================================== */

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
        ) <= radius * radius;
    }


    function collidesAt(
        x,
        y,
        radius,
        includeNPC = true
    ) {

        /* bordas */
        if (
            x - radius < 60 ||
            x + radius > WORLD.width - 60 ||
            y - radius < 60 ||
            y + radius > WORLD.height - 60
        ) {
            return true;
        }


        /* objetos */
        for (const obstacle of state.world.obstacles) {

            if (
                circleRectCollision(
                    x,
                    y,
                    radius,
                    obstacle
                )
            ) {
                return true;
            }
        }


        /* NPC */
        if (includeNPC) {

            for (const npc of state.world.npcs) {

                if (
                    Math.hypot(
                        x - npc.x,
                        y - npc.y
                    ) <
                    radius + npc.radius
                ) {
                    return true;
                }
            }
        }


        /* inimigos */
        for (const enemy of state.world.enemies) {

            if (!enemy.alive) continue;

            if (
                Math.hypot(
                    x - enemy.x,
                    y - enemy.y
                ) <
                radius + 17
            ) {
                return true;
            }
        }

        return false;
    }


    function movePlayer(dx, dy, dt) {

        if (!state.player) return;

        const player = state.player;

        let speed =
            player.baseSpeed;

        if (player.hunger <= 0) {
            speed *= .65;
        }

        if (player.fatigue <= 0) {
            speed *= .7;
        }

        if (
            player.effects.some(
                effect =>
                    effect.id === "speed"
            )
        ) {
            speed *= 1.25;
        }


        if (
            dx !== 0 ||
            dy !== 0
        ) {

            const length =
                Math.hypot(dx, dy);

            dx /= length;
            dy /= length;

            const distance =
                speed * dt;


            /*
             * Movimento X separado do Y.
             *
             * Isso impede que o jogador
             * atravesse quinas.
             */

            const nextX =
                player.x +
                dx * distance;

            if (
                !collidesAt(
                    nextX,
                    player.y,
                    player.radius
                )
            ) {
                player.x = nextX;
            }


            const nextY =
                player.y +
                dy * distance;

            if (
                !collidesAt(
                    player.x,
                    nextY,
                    player.radius
                )
            ) {
                player.y = nextY;
            }
        }
    }


    /* =====================================================
       NPC IA
    ====================================================== */

    function updateNPCs(dt) {

        state.world.npcs.forEach(npc => {

            npc.moveTimer -= dt;

            if (npc.moveTimer <= 0) {

                npc.moveTimer =
                    random(2, 6);

                npc.targetX =
                    clamp(
                        npc.x + random(-100, 100),
                        100,
                        WORLD.width - 100
                    );

                npc.targetY =
                    clamp(
                        npc.y + random(-100, 100),
                        100,
                        WORLD.height - 100
                    );
            }


            const dx =
                npc.targetX - npc.x;

            const dy =
                npc.targetY - npc.y;

            const d =
                Math.hypot(dx, dy);

            if (d > 5) {

                const step =
                    25 * dt;

                const nx =
                    npc.x +
                    dx / d * step;

                const ny =
                    npc.y +
                    dy / d * step;

                if (
                    !collidesAt(
                        nx,
                        ny,
                        npc.radius,
                        false
                    )
                ) {

                    npc.x = nx;
                    npc.y = ny;
                }
            }
        });
    }


    /* =====================================================
       INIMIGOS
    ====================================================== */

    function updateEnemies(dt) {

        state.world.enemies.forEach(enemy => {

            if (!enemy.alive) return;

            enemy.attackTimer =
                Math.max(
                    0,
                    enemy.attackTimer - dt * 1000
                );

            const d =
                distance(
                    enemy,
                    state.player
                );

            if (
                d <
                enemy.detection
            ) {

                const dx =
                    state.player.x - enemy.x;

                const dy =
                    state.player.y - enemy.y;

                const len =
                    Math.hypot(dx, dy);


                if (
                    d >
                    enemy.attackRange
                ) {

                    const step =
                        enemy.speed * dt;

                    const nx =
                        enemy.x +
                        dx / len *
                        step;

                    const ny =
                        enemy.y +
                        dy / len *
                        step;


                    if (
                        !collidesAt(
                            nx,
                            enemy.y,
                            15,
                            false
                        )
                    ) {
                        enemy.x = nx;
                    }

                    if (
                        !collidesAt(
                            enemy.x,
                            ny,
                            15,
                            false
                        )
                    ) {
                        enemy.y = ny;
                    }

                } else if (
                    enemy.attackTimer <= 0
                ) {

                    damagePlayer(
                        enemy.damage
                    );

                    enemy.attackTimer =
                        enemy.attackCooldown;
                }
            }

            if (enemy.hitFlash > 0) {
                enemy.hitFlash -= dt;
            }
        });


        updateBosses(dt);
    }


    /* =====================================================
       BOSS
    ====================================================== */

    function updateBosses(dt) {

        state.world.bosses.forEach(boss => {

            if (
                !boss.alive &&
                boss.type === "resource" &&
                Date.now() >= boss.respawnAt
            ) {

                boss.alive = true;
                boss.hp = boss.maxHp;

                showToast(
                    "BOSS DA VILA INICIAL NASCEU!"
                );
            }


            if (!boss.alive) return;

            const d =
                distance(
                    boss,
                    state.player
                );

            if (
                d <
                boss.detection
            ) {

                boss.discovered = true;

                if (
                    !state.player.bossesDiscovered.includes(
                        boss.id
                    )
                ) {

                    state.player.bossesDiscovered.push(
                        boss.id
                    );

                    showToast(
                        "Boss descoberto!"
                    );
                }


                if (
                    d >
                    boss.attackRange
                ) {

                    const dx =
                        state.player.x - boss.x;

                    const dy =
                        state.player.y - boss.y;

                    const len =
                        Math.hypot(dx, dy);

                    const step =
                        boss.speed * dt;

                    const nx =
                        boss.x +
                        dx / len *
                        step;

                    const ny =
                        boss.y +
                        dy / len *
                        step;

                    if (
                        !collidesAt(
                            nx,
                            boss.y,
                            30,
                            false
                        )
                    ) {
                        boss.x = nx;
                    }

                    if (
                        !collidesAt(
                            boss.x,
                            ny,
                            30,
                            false
                        )
                    ) {
                        boss.y = ny;
                    }

                } else if (
                    Date.now() >
                    (boss.attackTimer || 0)
                ) {

                    damagePlayer(
                        boss.damage
                    );

                    boss.attackTimer =
                        Date.now() +
                        boss.attackCooldown;
                }
            }
        });
    }


    /* =====================================================
       ATAQUE BÁSICO
    ====================================================== */

    function basicAttack() {

        const player = state.player;

        if (!player) return;

        if (
            Date.now() <
            player.cooldowns.basic
        ) {
            return;
        }

        player.cooldowns.basic =
            Date.now() + 300;


        let target = null;

        let nearest =
            105;


        [
            ...state.world.enemies.filter(
                e => e.alive
            ),
            ...state.world.bosses.filter(
                b => b.alive
            )
        ].forEach(enemy => {

            const d =
                distance(
                    player,
                    enemy
                );

            if (
                d <
                nearest
            ) {

                nearest = d;
                target = enemy;
            }
        });


        if (!target) {

            createAttackEffect(
                player.x + 20,
                player.y
            );

            return;
        }


        let damage =
            player.damage;


        const weapon =
            ITEMS[
                player.equipment.weapon
            ];

        if (weapon) {
            damage +=
                weapon.damage || 0;
        }


        const strength =
            player.effects.find(
                e => e.id === "strength"
            );

        if (strength) {
            damage *= 1.2;
        }


        dealDamage(
            target,
            Math.round(damage)
        );
    }


    /* =====================================================
       HABILIDADE PRINCIPAL
    ====================================================== */

    function primarySkill() {

        const player = state.player;

        const character =
            getCharacter();

        if (!player || !character) return;

        if (
            Date.now() <
            player.cooldowns.primary
        ) {

            return;
        }


        const skill =
            character.skill;


        if (
            player.magic <
            skill.cost
        ) {

            showToast(
                "Magia insuficiente."
            );

            return;
        }


        player.magic -=
            skill.cost;

        player.cooldowns.primary =
            Date.now() +
            skill.cooldown;


        let target = findNearestTarget(
            skill.range
        );


        if (
            character.id === "lirael" &&
            !target
        ) {

            target = null;
        }


        if (target) {

            if (
                character.id === "theron"
            ) {

                dealDamage(
                    target,
                    skill.damage
                );

            } else {

                dealDamage(
                    target,
                    skill.damage
                );
            }

        } else if (
            character.id === "lirael"
        ) {

            showToast(
                "Flecha Feérica lançada."
            );

        }


        createMagicEffect(
            player.x,
            player.y,
            character.color
        );
    }


    /* =====================================================
       HABILIDADE SECUNDÁRIA
    ====================================================== */

    function secondarySkill() {

        const player = state.player;

        const character =
            getCharacter();

        if (!player || !character) return;

        if (
            Date.now() <
            player.cooldowns.secondary
        ) {
            return;
        }


        const skill =
            character.secondary;


        if (
            player.magic <
            skill.cost
        ) {

            showToast(
                "Recursos insuficientes."
            );

            return;
        }


        player.magic -=
            skill.cost;

        player.cooldowns.secondary =
            Date.now() +
            skill.cooldown;


        if (
            character.id === "lirael"
        ) {

            player.hp =
                clamp(
                    player.hp + 45,
                    0,
                    player.maxHp
                );

            showToast(
                "Luz Vital recuperou sua vida."
            );

            return;
        }


        if (
            character.id === "theron"
        ) {

            addEffect(
                "defense",
                8000
            );

            showToast(
                "Muralha ativada."
            );

            return;
        }


        if (
            character.id === "zephyr"
        ) {

            addEffect(
                "speed",
                8000
            );

            player.damage += 8;

            setTimeout(() => {
                if (player) {
                    player.damage -= 8;
                }
            }, 8000);

            showToast(
                "Zephyr assumiu uma forma adaptativa."
            );

            return;
        }


        const target =
            findNearestTarget(
                skill.range || 250
            );

        if (target) {

            dealDamage(
                target,
                skill.damage
            );
        }

        createMagicEffect(
            player.x,
            player.y,
            character.color
        );
    }


    function findNearestTarget(range) {

        let closest = null;

        let closestDistance =
            range;

        [
            ...state.world.enemies.filter(
                e => e.alive
            ),
            ...state.world.bosses.filter(
                b => b.alive
            )
        ].forEach(enemy => {

            const d =
                distance(
                    state.player,
                    enemy
                );

            if (
                d <= closestDistance
            ) {

                closestDistance = d;
                closest = enemy;
            }
        });

        return closest;
    }


    function dealDamage(target, damage) {

        if (!target) return;

        const finalDamage =
            Math.max(
                1,
                Math.round(damage)
            );

        target.hp -=
            finalDamage;

        showDamageNumber(
            target.x,
            target.y,
            finalDamage
        );

        createHitParticles(
            target.x,
            target.y
        );


        if (
            target.hp <= 0
        ) {

            killTarget(target);
        }
    }


    function killTarget(target) {

        if (
            target.id &&
            state.world.enemies.includes(target)
        ) {

            target.alive = false;

            grantXP(
                target.xp
            );

            state.player.money +=
                target.money;

            if (
                Math.random() < .3
            ) {

                addItem(
                    "coal",
                    1
                );
            }

            showToast(
                `${target.name} derrotado! +${target.xp} XP`
            );

            return;
        }


        const boss =
            state.world.bosses.find(
                b => b === target
            );

        if (boss) {

            boss.alive = false;

            grantXP(250);

            state.player.money += 150;

            state.player.bossesDefeated.push(
                boss.id
            );

            state.player.bossesDiscovered.push(
                boss.id
            );


            addItem(
                "iron",
                3
            );

            addItem(
                "ruby",
                1
            );


            if (
                boss.type === "resource"
            ) {

                boss.respawnAt =
                    Date.now() +
                    boss.respawn;

            }


            showToast(
                "Boss derrotado! Recompensas recebidas."
            );
        }
    }


    /* =====================================================
       DANO AO PLAYER
    ====================================================== */

    function damagePlayer(amount) {

        const player = state.player;

        if (!player || player.dead) return;


        let reduction =
            player.defense;


        if (
            player.effects.some(
                e => e.id === "defense"
            )
        ) {
            reduction += 15;
        }


        const damage =
            Math.max(
                1,
                Math.round(
                    amount -
                    reduction * .35
                )
            );


        player.hp -= damage;

        showDamageNumber(
            player.x,
            player.y - 25,
            damage,
            true
        );


        if (
            player.hp <= 0
        ) {

            player.hp = 0;

            die();
        }
    }


    /* =====================================================
       MORTE
    ====================================================== */

    function die() {

        if (state.player.dead) return;

        state.player.dead = true;

        state.paused = true;

        document
            .getElementById("deathModal")
            .classList.remove("hidden");
    }


    function respawn() {

        const player = state.player;

        player.dead = false;

        player.hp =
            Math.round(
                player.maxHp * .65
            );

        player.magic =
            Math.round(
                player.maxMagic * .65
            );

        player.hunger =
            Math.max(
                50,
                player.hunger
            );

        player.fatigue =
            Math.max(
                50,
                player.fatigue
            );

        player.x =
            player.checkpoint.x;

        player.y =
            player.checkpoint.y;

        player.money =
            Math.max(
                0,
                Math.floor(
                    player.money * .9
                )
            );

        state.paused = false;

        document
            .getElementById("deathModal")
            .classList.add("hidden");

        showToast(
            "Você retornou ao checkpoint."
        );

        updateHUD();
    }


    /* =====================================================
       COLETA
    ====================================================== */

    function collectNearestResource() {

        const player =
            state.player;

        let resource = null;

        let nearest = 75;

        state.world.resources.forEach(r => {

            if (
                Date.now() <
                r.cooldownUntil
            ) {
                return;
            }

            const d =
                distance(
                    player,
                    r
                );

            if (
                d < nearest
            ) {

                nearest = d;
                resource = r;
            }
        });


        if (!resource) {

            showToast(
                "Nenhum recurso próximo."
            );

            return;
        }


        const magicCost =
            resource.type === "wood"
                ? 4
                : resource.type === "coal"
                    ? 7
                    : resource.type === "iron"
                        ? 14
                        : resource.type === "gold"
                            ? 25
                            : 40;


        if (
            player.magic <
            magicCost
        ) {

            showToast(
                "Você não possui magia suficiente."
            );

            return;
        }


        player.magic -=
            magicCost;

        player.hunger =
            Math.max(
                0,
                player.hunger - 2
            );

        player.fatigue =
            Math.max(
                0,
                player.fatigue - 3
            );


        const base =
            Math.max(
                1,
                resource.amount
            );

        const amount =
            Math.ceil(
                random(
                    1,
                    base
                )
            );


        addItem(
            resource.type,
            amount
        );


        grantXP(
            Math.max(
                2,
                Math.round(
                    magicCost / 2
                )
            )
        );


        resource.collected +=
            amount;

        resource.cooldownUntil =
            Date.now() + 5000;


        showToast(
            `${ITEMS[resource.type].name} coletado: x${amount}`
        );
    }


    /* =====================================================
       INVENTÁRIO
    ====================================================== */

    function addItem(id, amount = 1) {

        if (!ITEMS[id]) return;

        const current =
            state.player.inventory[id] || 0;

        state.player.inventory[id] =
            Math.max(
                0,
                current + amount
            );
    }


    function removeItem(id, amount = 1) {

        const current =
            state.player.inventory[id] || 0;

        if (
            current < amount
        ) {
            return false;
        }

        state.player.inventory[id] =
            current - amount;

        return true;
    }


    function inventoryWeight() {

        let weight = 0;

        Object.entries(
            state.player.inventory
        ).forEach(([id, amount]) => {

            const item =
                ITEMS[id];

            if (!item) return;

            weight +=
                item.weight *
                amount;
        });

        return weight;
    }


    function renderInventory() {

        const grid =
            document.getElementById(
                "inventoryGrid"
            );

        grid.innerHTML = "";


        const category =
            state.inventoryCategory;


        Object.entries(
            state.player.inventory
        ).forEach(([id, amount]) => {

            if (amount <= 0) return;

            const item =
                ITEMS[id];

            if (!item) return;


            if (
                category !== "all" &&
                item.category !== category
            ) {
                return;
            }


            const div =
                document.createElement("button");

            div.className =
                "inventory-item";

            div.innerHTML = `

                <span class="item-icon">
                    ${item.icon}
                </span>

                <b>${item.name}</b>

                <small>
                    x<span class="item-count">
                        ${amount}
                    </span>
                </small>

            `;


            div.addEventListener(
                "click",
                () => {
                    useInventoryItem(id);
                }
            );


            grid.appendChild(div);
        });


        if (
            !grid.children.length
        ) {

            grid.innerHTML =
                `<p style="
                    grid-column:1/-1;
                    color:#777;
                    text-align:center;
                    padding:30px;
                ">
                    Nenhum item nesta categoria.
                </p>`;
        }


        document.getElementById(
            "weightText"
        ).textContent =
            `${inventoryWeight()} / 100`;


        document.getElementById(
            "inventoryMoney"
        ).textContent =
            state.player.money;


        const weapon =
            ITEMS[
                state.player.equipment.weapon
            ];

        document.getElementById(
            "weaponEquip"
        ).textContent =
            weapon
                ? weapon.name
                : "Nenhuma";


        document.getElementById(
            "armorEquip"
        ).textContent =
            state.player.equipment.armor
                ? ITEMS[
                    state.player.equipment.armor
                ].name
                : "Nenhuma";
    }


    function useInventoryItem(id) {

        const item =
            ITEMS[id];

        if (!item) return;


        if (
            item.category === "potions"
        ) {

            usePotion(id);

            renderInventory();

            return;
        }


        if (
            item.category === "weapons"
        ) {

            state.player.equipment.weapon =
                id;

            showToast(
                `${item.name} equipada.`
            );

            renderInventory();

            updateHUD();

            return;
        }


        if (
            item.category === "armor"
        ) {

            state.player.equipment.armor =
                id;

            state.player.defense +=
                item.defense || 0;

            showToast(
                `${item.name} equipada.`
            );

            renderInventory();

            return;
        }


        if (
            id === "minimap"
        ) {

            state.player.minimapOwned =
                true;

            showToast(
                "Minimapa adquirido."
            );

            updateMiniMap();

            return;
        }


        showToast(
            `${item.name}: ${item.value} moedas`
        );
    }


    /* =====================================================
       POÇÕES
    ====================================================== */

    function usePotion(id) {

        const player =
            state.player;

        if (
            Date.now() <
            player.cooldowns.potion
        ) {

            showToast(
                "Aguarde o cooldown da poção."
            );

            return;
        }


        if (
            !removeItem(id, 1)
        ) {
            return;
        }


        player.cooldowns.potion =
            Date.now() + 1200;


        if (
            id === "potionHealth"
        ) {

            player.hp =
                clamp(
                    player.hp + 40,
                    0,
                    player.maxHp
                );

            showToast(
                "Poção de Cura utilizada."
            );
        }


        if (
            id === "potionStrength"
        ) {

            addEffect(
                "strength",
                15000
            );

            showToast(
                "Força aumentada por 15 segundos."
            );
        }


        if (
            id === "potionDefense"
        ) {

            addEffect(
                "defense",
                15000
            );

            showToast(
                "Resistência aumentada por 15 segundos."
            );
        }

        updateHUD();
    }


    function addEffect(id, duration) {

        const existing =
            state.player.effects.find(
                effect => effect.id === id
            );

        if (existing) {

            existing.until =
                Date.now() + duration;

            return;
        }


        if (
            state.player.effects.length >= 2
        ) {

            showToast(
                "Você já possui dois efeitos ativos."
            );

            return;
        }


        state.player.effects.push({
            id,
            until: Date.now() + duration
        });
    }


    function updateEffects() {

        state.player.effects =
            state.player.effects.filter(
                effect =>
                    effect.until >
                    Date.now()
            );
    }


    /* =====================================================
       XP / NÍVEL
    ====================================================== */

    function grantXP(amount) {

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return;
        }


        const player =
            state.player;

        player.xp +=
            Math.floor(amount);


        while (
            player.xp >=
            player.xpToNext
        ) {

            player.xp -=
                player.xpToNext;

            player.level++;

            player.xpToNext =
                Math.floor(
                    player.xpToNext * 1.35
                );

            player.statPoints += 3;

            player.maxHp += 5;
            player.maxMagic += 4;
            player.maxEnergy += 3;

            player.hp =
                player.maxHp;

            player.magic =
                player.maxMagic;

            player.energy =
                player.maxEnergy;


            document.getElementById(
                "statPointsText"
            ).textContent =
                player.statPoints;


            document.getElementById(
                "levelModal"
            ).classList.remove(
                "hidden"
            );
        }

        updateHUD();
    }


    /* =====================================================
       ATRIBUTOS
    ====================================================== */

    function spendStat(stat) {

        const player =
            state.player;

        if (
            player.statPoints <= 0
        ) {

            showToast(
                "Você não possui pontos."
            );

            return;
        }


        player.statPoints--;


        if (stat === "hp") {

            player.maxHp += 12;
            player.hp += 12;
        }


        if (stat === "magic") {

            player.maxMagic += 10;
            player.magic += 10;
        }


        if (stat === "energy") {

            player.maxEnergy += 10;
            player.energy += 10;
        }


        document.getElementById(
            "statPointsText"
        ).textContent =
            player.statPoints;


        updateHUD();
    }


    /* =====================================================
       FOME / CANSAÇO / REGEN
    ====================================================== */

    function updateSurvival(dt) {

        const player =
            state.player;


        player.hunger =
            clamp(
                player.hunger -
                .65 * dt,
                0,
                player.maxHunger
            );


        player.fatigue =
            clamp(
                player.fatigue -
                .45 * dt,
                0,
                player.maxFatigue
            );


        player.magic =
            clamp(
                player.magic +
                3.2 * dt,
                0,
                player.maxMagic
            );


        player.energy =
            clamp(
                player.energy +
                2.2 * dt,
                0,
                player.maxEnergy
            );


        if (
            player.hunger <= 0 ||
            player.fatigue <= 0
        ) {

            player.hp =
                Math.max(
                    1,
                    player.hp -
                    .7 * dt
                );
        }
    }


    /* =====================================================
       INTERAÇÃO
    ====================================================== */

    function findInteraction() {

        const player =
            state.player;

        let nearest = null;

        let nearestDistance =
            80;


        state.world.npcs.forEach(npc => {

            const d =
                distance(
                    player,
                    npc
                );

            if (
                d <
                nearestDistance
            ) {

                nearestDistance = d;

                nearest = {
                    type: "npc",
                    target: npc
                };
            }
        });


        state.world.resources.forEach(resource => {

            if (
                Date.now() <
                resource.cooldownUntil
            ) {
                return;
            }

            const d =
                distance(
                    player,
                    resource
                );

            if (
                d <
                nearestDistance
            ) {

                nearestDistance = d;

                nearest = {
                    type: "resource",
                    target: resource
                };
            }
        });


        return nearest;
    }


    function interact() {

        const interaction =
            findInteraction();

        if (!interaction) {

            showToast(
                "Nada para interagir aqui."
            );

            return;
        }


        if (
            interaction.type === "npc"
        ) {

            talkToNPC(
                interaction.target
            );

            return;
        }


        if (
            interaction.type === "resource"
        ) {

            collectNearestResource();

            return;
        }
    }


    /* =====================================================
       NPC / DIÁLOGO
    ====================================================== */

    function talkToNPC(npc) {

        document.getElementById(
            "dialogName"
        ).textContent =
            npc.name;

        document.getElementById(
            "dialogRole"
        ).textContent =
            npc.role;

        document.getElementById(
            "dialogPortrait"
        ).textContent =
            npc.icon || "👤";

        document.getElementById(
            "dialogText"
        ).textContent =
            npc.dialogue;


        const choices =
            document.getElementById(
                "dialogChoices"
            );

        choices.innerHTML = "";


        if (npc.quest === "woodQuest") {

            const questButton =
                document.createElement("button");

            questButton.textContent =
                "Aceitar missão: coletar madeira";

            questButton.onclick =
                () => acceptWoodQuest(npc);

            choices.appendChild(
                questButton
            );
        }


        if (npc.merchant) {

            const shopButton =
                document.createElement("button");

            shopButton.textContent =
                "Abrir loja";

            shopButton.onclick =
                () => {

                    closeDialog();

                    openShop();
                };

            choices.appendChild(
                shopButton
            );
        }


        const loreButton =
            document.createElement("button");

        loreButton.textContent =
            "Perguntar sobre a Quietude";

        loreButton.onclick =
            () => {

                document.getElementById(
                    "dialogText"
                ).textContent =
                    "A Quietude não destrói como uma tempestade. Ela apaga. Primeiro um nome. Depois uma história. Depois ninguém lembra que aquilo existiu.";

            };

        choices.appendChild(
            loreButton
        );


        document
            .getElementById("dialogModal")
            .classList.remove("hidden");
    }


    function closeDialog() {

        document
            .getElementById("dialogModal")
            .classList.add("hidden");
    }


    /* =====================================================
       MISSÃO
    ====================================================== */

    function acceptWoodQuest(npc) {

        const player =
            state.player;


        if (
            player.quests.woodQuest?.completed
        ) {

            showToast(
                "Você já completou essa missão."
            );

            return;
        }


        player.quests.woodQuest = {
            accepted: true,
            completed: false,
            required: 10
        };


        document.getElementById(
            "dialogText"
        ).textContent =
            "Traga 10 madeiras. A vila precisa delas antes que outra memória desapareça.";


        showToast(
            "Missão aceita: Madeira para a Vila."
        );
    }


    function checkQuests() {

        const quest =
            state.player.quests.woodQuest;

        if (
            !quest ||
            quest.completed ||
            !quest.accepted
        ) {
            return;
        }


        const wood =
            state.player.inventory.wood || 0;


        if (
            wood >= quest.required
        ) {

            quest.completed = true;

            removeItem(
                "wood",
                quest.required
            );

            state.player.money += 80;

            grantXP(120);

            showToast(
                "Missão concluída! +80 moedas +120 XP."
            );
        }
    }


    /* =====================================================
       LOJA
    ====================================================== */

    const SHOP_ITEMS = [
        {
            id: "potionHealth",
            price: 30
        },

        {
            id: "potionStrength",
            price: 55
        },

        {
            id: "potionDefense",
            price: 55
        },

        {
            id: "ironSword",
            price: 140
        },

        {
            id: "leatherArmor",
            price: 110
        },

        {
            id: "minimap",
            price: 350
        }
    ];


    function openShop() {

        document
            .getElementById("shopModal")
            .classList.remove("hidden");

        renderShop();
    }


    function renderShop() {

        const content =
            document.getElementById(
                "shopContent"
            );

        content.innerHTML = "";


        if (
            state.shopMode === "buy"
        ) {

            SHOP_ITEMS.forEach(shopItem => {

                const item =
                    ITEMS[shopItem.id];

                if (!item) return;


                const div =
                    document.createElement("div");

                div.className =
                    "shop-item";

                div.innerHTML = `

                    <div class="shop-item-icon">
                        ${item.icon}
                    </div>

                    <div class="shop-item-info">
                        <strong>${item.name}</strong>
                        <small>
                            ${describeItem(item)}
                        </small>
                    </div>

                    <div class="shop-price">
                        💰 ${shopItem.price}
                    </div>

                    <button class="shop-action">
                        Comprar
                    </button>
                `;


                div.querySelector(
                    ".shop-action"
                ).onclick =
                    () => buyItem(
                        shopItem.id,
                        shopItem.price
                    );


                content.appendChild(div);
            });

            return;
        }


        Object.entries(
            state.player.inventory
        ).forEach(([id, amount]) => {

            if (amount <= 0) return;

            const item =
                ITEMS[id];

            if (!item) return;


            const value =
                Math.max(
                    1,
                    Math.floor(
                        item.value * .7
                    )
                );


            const div =
                document.createElement("div");

            div.className =
                "shop-item";

            div.innerHTML = `

                <div class="shop-item-icon">
                    ${item.icon}
                </div>

                <div class="shop-item-info">
                    <strong>${item.name}</strong>
                    <small>
                        Quantidade: ${amount}
                    </small>
                </div>

                <div class="shop-price">
                    💰 ${value}
                </div>

                <button class="shop-action">
                    Vender
                </button>
            `;


            div.querySelector(
                ".shop-action"
            ).onclick =
                () => sellItem(
                    id,
                    value
                );


            content.appendChild(div);
        });
    }


    function describeItem(item) {

        if (
            item.heal
        ) {
            return `Recupera ${item.heal} HP.`;
        }

        if (
            item.damage
        ) {
            return `+${item.damage} dano.`;
        }

        if (
            item.defense
        ) {
            return `+${item.defense} defesa.`;
        }

        if (
            item.id === "minimap"
        ) {
            return "Revela o minimapa das regiões exploradas.";
        }

        return "Item útil para sua jornada.";
    }


    function buyItem(id, price) {

        if (
            state.player.money < price
        ) {

            showToast(
                "Dinheiro insuficiente."
            );

            return;
        }


        if (
            id === "minimap" &&
            state.player.minimapOwned
        ) {

            showToast(
                "Você já possui um minimapa."
            );

            return;
        }


        state.player.money -= price;

        addItem(
            id,
            1
        );


        if (
            id === "minimap"
        ) {

            state.player.minimapOwned =
                true;

            updateMiniMap();
        }


        showToast(
            `${ITEMS[id].name} comprado.`
        );

        renderShop();

        updateHUD();
    }


    function sellItem(id, price) {

        if (
            !removeItem(
                id,
                1
            )
        ) {
            return;
        }


        state.player.money +=
            price;

        showToast(
            `${ITEMS[id].name} vendido por ${price} moedas.`
        );

        renderShop();

        updateHUD();
    }


    /* =====================================================
       MAPA
    ====================================================== */

    function openMap() {

        document
            .getElementById("mapModal")
            .classList.remove("hidden");

        renderWorldMap();
    }


    function renderWorldMap() {

        const map =
            document.getElementById(
                "worldMapCanvas"
            );

        const width =
            map.clientWidth || 800;

        const height =
            Math.min(
                550,
                width *
                WORLD.height /
                WORLD.width
            );


        map.width =
            width;

        map.height =
            height;


        const mctx =
            map.getContext("2d");


        mctx.fillStyle =
            "#253128";

        mctx.fillRect(
            0,
            0,
            width,
            height
        );


        const sx =
            width / WORLD.width;

        const sy =
            height / WORLD.height;


        const regions = [
            {
                name: "Vila do Crepúsculo",
                x: 500,
                y: 400,
                w: 1800,
                h: 1300,
                color: "#6e6650",
                id: "village"
            },

            {
                name: "Floresta",
                x: 2600,
                y: 600,
                w: 900,
                h: 1300,
                color: "#315b39",
                id: "forest"
            },

            {
                name: "Montanhas",
                x: 1200,
                y: 100,
                w: 1300,
                h: 500,
                color: "#73777a",
                id: "mountains"
            },

            {
                name: "Inferno",
                x: 2400,
                y: 1950,
                w: 1000,
                h: 500,
                color: "#713329",
                id: "hell"
            }
        ];


        regions.forEach(region => {

            const unlocked =
                state.player.regionsUnlocked.includes(
                    region.id
                );


            mctx.fillStyle =
                unlocked
                    ? region.color
                    : "#16171a";


            mctx.fillRect(
                region.x * sx,
                region.y * sy,
                region.w * sx,
                region.h * sy
            );


            mctx.strokeStyle =
                "#a99a78";

            mctx.strokeRect(
                region.x * sx,
                region.y * sy,
                region.w * sx,
                region.h * sy
            );


            if (unlocked) {

                mctx.fillStyle =
                    "#ddd";

                mctx.font =
                    "11px Arial";

                mctx.textAlign =
                    "center";

                mctx.fillText(
                    region.name,
                    (
                        region.x +
                        region.w / 2
                    ) * sx,
                    (
                        region.y +
                        region.h / 2
                    ) * sy
                );
            }
        });


        /* player */

        mctx.fillStyle =
            "#fff";

        mctx.beginPath();

        mctx.arc(
            state.player.x * sx,
            state.player.y * sy,
            5,
            0,
            Math.PI * 2
        );

        mctx.fill();


        /* bosses descobertos */

        state.world.bosses.forEach(boss => {

            if (
                !state.player.bossesDiscovered.includes(
                    boss.id
                )
            ) {
                return;
            }

            mctx.fillStyle =
                "#d56d76";

            mctx.beginPath();

            mctx.arc(
                boss.x * sx,
                boss.y * sy,
                5,
                0,
                Math.PI * 2
            );

            mctx.fill();
        });


        document.getElementById(
            "mapLockedMessage"
        ).classList.toggle(
            "hidden",
            state.player.minimapOwned
        );
    }


    function updateMiniMap() {

        const mini =
            document.getElementById(
                "miniMap"
            );

        if (
            state.player &&
            state.player.minimapOwned
        ) {

            mini.classList.remove(
                "hidden"
            );

            drawMiniMap();
        } else {

            mini.classList.add(
                "hidden"
            );
        }
    }


    function drawMiniMap() {

        if (
            !state.player?.minimapOwned
        ) return;


        const map =
            document.getElementById(
                "miniMapCanvas"
            );

        const width =
            map.clientWidth || 160;

        const height =
            map.clientHeight || 160;


        map.width =
            width;

        map.height =
            height;


        const mctx =
            map.getContext("2d");


        mctx.fillStyle =
            "#27332a";

        mctx.fillRect(
            0,
            0,
            width,
            height
        );


        const sx =
            width / WORLD.width;

        const sy =
            height / WORLD.height;


        state.world.buildings.forEach(
            building => {

                mctx.fillStyle =
                    "#73533c";

                mctx.fillRect(
                    building.x * sx,
                    building.y * sy,
                    building.w * sx,
                    building.h * sy
                );
            }
        );


        state.world.npcs.forEach(
            npc => {

                mctx.fillStyle =
                    "#e2c47c";

                mctx.fillRect(
                    npc.x * sx - 2,
                    npc.y * sy - 2,
                    4,
                    4
                );
            }
        );


        mctx.fillStyle =
            "#fff";

        mctx.beginPath();

        mctx.arc(
            state.player.x * sx,
            state.player.y * sy,
            4,
            0,
            Math.PI * 2
        );

        mctx.fill();
    }


    /* =====================================================
       LIVRO
    ====================================================== */

    function openBook() {

        document
            .getElementById("bookModal")
            .classList.remove("hidden");

        renderBook();
    }


    function renderBook() {

        const grid =
            document.getElementById(
                "bossBookGrid"
            );

        grid.innerHTML = "";


        state.world.bosses.forEach(
            boss => {

                const known =
                    state.player.bossesDiscovered.includes(
                        boss.id
                    );

                const defeated =
                    state.player.bossesDefeated.includes(
                        boss.id
                    );


                const div =
                    document.createElement("div");

                div.className =
                    "boss-entry" +
                    (known ? " known" : "");


                if (!known) {

                    div.innerHTML = `
                        <div class="boss-icon">?</div>
                        <h3>DESCONHECIDO</h3>
                        <p>
                            Uma memória ainda não descoberta.
                        </p>
                    `;

                } else {

                    div.innerHTML = `
                        <div class="boss-icon">
                            👹
                        </div>

                        <h3>
                            ${boss.name}
                        </h3>

                        <p>
                            ${defeated
                                ? "Derrotado."
                                : "Ainda está à espreita."}
                        </p>

                        <p>
                            "Algumas memórias
                            não querem ser lembradas."
                        </p>
                    `;
                }


                grid.appendChild(div);
            }
        );
    }


    /* =====================================================
       CHECKPOINT
    ====================================================== */

    function updateCheckpoint() {

        const player =
            state.player;

        player.checkpoint = {

            x: player.x,

            y: player.y,

            region:
                getCurrentRegion()
        };

        showToast(
            "Checkpoint atualizado."
        );
    }


    function getCurrentRegion() {

        if (
            state.player.x > 2550 &&
            state.player.y > 550
        ) {
            return "forest";
        }

        if (
            state.player.y < 650
        ) {
            return "mountains";
        }

        if (
            state.player.y > 1900 &&
            state.player.x > 2300
        ) {
            return "hell";
        }

        return "village";
    }


    /* =====================================================
       SAÍDAS / ÁREAS
    ====================================================== */

    function checkExits() {

        const player =
            state.player;

        state.world.exits.forEach(
            exit => {

                const inside =
                    player.x >
                    exit.x &&
                    player.x <
                    exit.x + exit.w &&
                    player.y >
                    exit.y &&
                    player.y <
                    exit.y + exit.h;


                if (!inside) return;


                if (
                    exit.unlocked
                ) {

                    enterRegion(
                        exit.target
                    );

                    return;
                }


                showToast(
                    "Você ainda não pode seguir por aqui."
                );
            }
        );
    }


    function enterRegion(region) {

        if (
            state.transitionBusy
        ) return;


        transitionOut(
            () => {

                if (
                    region === "forest"
                ) {

                    unlockRegion(
                        "forest"
                    );

                    state.player.x =
                        2850;

                    state.player.y =
                        900;

                    state.player.checkpoint = {
                        x: 2850,
                        y: 900,
                        region
                    };
                }


                if (
                    region === "mountains"
                ) {

                    unlockRegion(
                        "mountains"
                    );

                    state.player.x =
                        1800;

                    state.player.y =
                        500;
                }

                transitionIn();

                showToast(
                    `Você entrou em: ${region}`
                );
            }
        );
    }


    function unlockRegion(region) {

        if (
            !state.player.regionsUnlocked.includes(
                region
            )
        ) {

            state.player.regionsUnlocked.push(
                region
            );

            state.player.exploredRegions.push(
                region
            );

            grantXP(100);

            showToast(
                `Nova região descoberta: ${region}`
            );
        }
    }


    /* =====================================================
       SAVE
    ====================================================== */

    function saveGame(showMessage = true) {

        if (!state.player) return;


        const save = {

            version: 7,

            player: {
                ...state.player
            },

            savedAt:
                new Date().toISOString()
        };


        try {

            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify(save)
            );


            if (showMessage) {

                showToast(
                    "Jogo salvo com sucesso."
                );
            }


            updateContinueButton();

        } catch (error) {

            console.error(error);

            showToast(
                "Não foi possível salvar o jogo."
            );
        }
    }


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
                !save ||
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


            state.player =
                save.player;


            /* proteção contra saves antigos */

            state.player.radius =
                19;

            state.player.effects =
                Array.isArray(
                    state.player.effects
                )
                    ? state.player.effects
                    : [];

            state.player.inventory =
                state.player.inventory || {};

            state.player.equipment =
                state.player.equipment || {
                    weapon: "simpleSword",
                    armor: null,
                    accessory: null
                };

            state.player.cooldowns =
                state.player.cooldowns || {
                    basic: 0,
                    primary: 0,
                    secondary: 0,
                    potion: 0
                };

            state.player.bossesDefeated =
                state.player.bossesDefeated || [];

            state.player.bossesDiscovered =
                state.player.bossesDiscovered || [];

            state.player.regionsUnlocked =
                state.player.regionsUnlocked || [
                    "village"
                ];


            buildWorld();

            updateHUD();

            showScreen("game");

            state.running = true;

            state.paused = false;

            state.lastTime =
                performance.now();

            updateMiniMap();

            requestAnimationFrame(
                gameLoop
            );

            showToast(
                "Jogo carregado."
            );

            return true;

        } catch (error) {

            console.error(
                "Save inválido:",
                error
            );

            localStorage.removeItem(
                SAVE_KEY
            );

            return false;
        }
    }


    function hasSave() {

        try {

            return Boolean(
                localStorage.getItem(
                    SAVE_KEY
                )
            );

        } catch {

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


    /* =====================================================
       TOAST
    ====================================================== */

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


    /* =====================================================
       HUD
    ====================================================== */

    function updateHUD() {

        const player =
            state.player;

        if (!player) return;


        const character =
            getCharacter();


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
            character
                ? character.icon
                : "✦";


        setBar(
            "hpBar",
            player.hp,
            player.maxHp
        );

        setBar(
            "magicBar",
            player.magic,
            player.maxMagic
        );

        setBar(
            "energyBar",
            player.energy,
            player.maxEnergy
        );

        setBar(
            "hungerBar",
            player.hunger,
            player.maxHunger
        );

        setBar(
            "fatigueBar",
            player.fatigue,
            player.maxFatigue
        );


        document.getElementById(
            "hpText"
        ).textContent =
            `${Math.ceil(player.hp)}/${player.maxHp}`;


        document.getElementById(
            "magicText"
        ).textContent =
            `${Math.ceil(player.magic)}/${player.maxMagic}`;


        document.getElementById(
            "energyText"
        ).textContent =
            `${Math.ceil(player.energy)}/${player.maxEnergy}`;


        document.getElementById(
            "hungerText"
        ).textContent =
            `${Math.ceil(player.hunger)}/${player.maxHunger}`;


        document.getElementById(
            "fatigueText"
        ).textContent =
            `${Math.ceil(player.fatigue)}/${player.maxFatigue}`;


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


        updateCooldownUI();

        updateMiniMap();
    }


    function setBar(id, value, max) {

        const element =
            document.getElementById(id);

        element.style.width =
            `${clamp(
                value / max * 100,
                0,
                100
            )}%`;
    }


    function updateCooldownUI() {

        const player =
            state.player;

        if (!player) return;


        updateCooldown(
            "primaryCooldown",
            player.cooldowns.primary
        );

        updateCooldown(
            "secondaryCooldown",
            player.cooldowns.secondary
        );
    }


    function updateCooldown(id, until) {

        const element =
            document.getElementById(id);

        if (!element) return;


        const remaining =
            Math.max(
                0,
                until - Date.now()
            );


        if (remaining <= 0) {

            element.textContent = "";

        } else {

            element.textContent =
                `${Math.ceil(
                    remaining / 1000
                )}`;
        }
    }


    function getCharacter() {

        return characters.find(
            character =>
                character.id ===
                state.player?.characterId
        );
    }


    /* =====================================================
       CÂMERA
    ====================================================== */

    function updateCamera() {

        const player =
            state.player;

        const viewW =
            window.innerWidth;

        const viewH =
            window.innerHeight;


        state.camera.x =
            clamp(
                player.x -
                viewW / 2,

                0,

                WORLD.width -
                viewW
            );


        state.camera.y =
            clamp(
                player.y -
                viewH / 2,

                0,

                WORLD.height -
                viewH
            );
    }


    /* =====================================================
       DESENHO
    ====================================================== */

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

        drawRegions();

        drawBuildings();

        drawResources();

        drawDecorations();

        drawNPCs();

        drawEnemies();

        drawBosses();

        drawExits();

        drawPlayer();

        drawParticles();


        ctx.restore();


        drawDamageNumbers();
    }


    /* =====================================================
       CHÃO
    ====================================================== */

    function drawGround() {

        ctx.fillStyle =
            "#526b4b";

        ctx.fillRect(
            0,
            0,
            WORLD.width,
            WORLD.height
        );


        const tile = 64;


        for (
            let y = 60;
            y < WORLD.height - 60;
            y += tile
        ) {

            for (
                let x = 60;
                x < WORLD.width - 60;
                x += tile
            ) {

                const odd =
                    (
                        x / tile +
                        y / tile
                    ) % 2;


                ctx.fillStyle =
                    odd === 0
                        ? "rgba(255,255,255,.018)"
                        : "rgba(0,0,0,.018)";


                ctx.fillRect(
                    x,
                    y,
                    tile,
                    tile
                );
            }
        }
    }


    function drawRegions() {

        /* Floresta */

        ctx.fillStyle =
            "rgba(31,75,39,.22)";

        ctx.fillRect(
            2600,
            600,
            900,
            1300
        );


        /* montanhas */

        ctx.fillStyle =
            "rgba(150,150,150,.16)";

        ctx.fillRect(
            1200,
            60,
            1300,
            540
        );


        /* inferno */

        ctx.fillStyle =
            "rgba(110,35,28,.24)";

        ctx.fillRect(
            2400,
            1950,
            1000,
            500
        );
    }


    function drawPaths() {

        ctx.fillStyle =
            "#b79a68";

        ctx.globalAlpha =
            .72;


        ctx.fillRect(
            60,
            1070,
            WORLD.width - 120,
            120
        );


        ctx.fillRect(
            1590,
            60,
            130,
            WORLD.height - 120
        );


        ctx.fillRect(
            1850,
            1100,
            900,
            75
        );


        ctx.fillRect(
            700,
            1100,
            100,
            600
        );


        ctx.globalAlpha =
            1;
    }


    /* =====================================================
       CONSTRUÇÕES
    ====================================================== */

    function drawBuildings() {

        state.world.buildings.forEach(
            building => {

                /* sombra */

                ctx.fillStyle =
                    "rgba(0,0,0,.25)";

                ctx.fillRect(
                    building.x + 15,
                    building.y + 18,
                    building.w,
                    building.h
                );


                /* parede */

                ctx.fillStyle =
                    "#b88b61";

                ctx.fillRect(
                    building.x,
                    building.y,
                    building.w,
                    building.h
                );


                /* linhas */

                ctx.strokeStyle =
                    "rgba(60,35,20,.25)";

                ctx.strokeRect(
                    building.x,
                    building.y,
                    building.w,
                    building.h
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
                    "#4a3026";

                ctx.fillRect(
                    building.x +
                    building.w / 2 - 25,

                    building.y +
                    building.h - 70,

                    50,
                    70
                );


                /* janelas */

                ctx.fillStyle =
                    "#e0c879";

                ctx.fillRect(
                    building.x + 35,
                    building.y + 65,
                    50,
                    45
                );

                ctx.fillRect(
                    building.x +
                    building.w - 85,

                    building.y + 65,

                    50,
                    45
                );


                /* placa */

                ctx.fillStyle =
                    "rgba(15,12,10,.72)";

                ctx.font =
                    "bold 14px Georgia";

                ctx.textAlign =
                    "center";

                ctx.fillText(
                    building.name,
                    building.x +
                    building.w / 2,
                    building.y +
                    building.h +
                    28
                );
            }
        );
    }


    /* =====================================================
       ÁRVORES
    ====================================================== */

    function drawDecorations() {

        const time =
            performance.now() / 1000;


        state.world.decorations.forEach(
            tree => {

                const sway =
                    Math.sin(
                        time * 2 +
                        tree.sway
                    ) * 2;


                /* sombra */

                ctx.fillStyle =
                    "rgba(0,0,0,.2)";

                ctx.beginPath();

                ctx.ellipse(
                    tree.x,
                    tree.y + 31,
                    36,
                    12,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                /* tronco */

                ctx.fillStyle =
                    "#674a32";

                ctx.fillRect(
                    tree.x - 9,
                    tree.y - 3,
                    18,
                    40
                );


                /* copa */

                ctx.fillStyle =
                    "#315b36";

                ctx.beginPath();

                ctx.arc(
                    tree.x + sway,
                    tree.y - 25,
                    36,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.fillStyle =
                    "#4a7b45";

                ctx.beginPath();

                ctx.arc(
                    tree.x - 14 + sway,
                    tree.y - 37,
                    24,
                    0,
                    Math.PI * 2
                );

                ctx.arc(
                    tree.x + 15 + sway,
                    tree.y - 37,
                    25,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        );
    }


    /* =====================================================
       RECURSOS
    ====================================================== */

    function drawResources() {

        state.world.resources.forEach(
            resource => {

                if (
                    Date.now() <
                    resource.cooldownUntil
                ) {

                    ctx.globalAlpha =
                        .3;
                }


                const item =
                    ITEMS[resource.type];


                ctx.fillStyle =
                    "#222";

                ctx.beginPath();

                ctx.arc(
                    resource.x,
                    resource.y,
                    18,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.font =
                    "22px Arial";

                ctx.textAlign =
                    "center";

                ctx.fillText(
                    item.icon,
                    resource.x,
                    resource.y + 7
                );


                ctx.globalAlpha =
                    1;
            }
        );
    }


    /* =====================================================
       NPCS
    ====================================================== */

    function drawNPCs() {

        state.world.npcs.forEach(
            npc => {

                ctx.fillStyle =
                    "rgba(0,0,0,.25)";

                ctx.beginPath();

                ctx.ellipse(
                    npc.x,
                    npc.y + 18,
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
                    17,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.fillStyle =
                    "#28242b";

                ctx.beginPath();

                ctx.arc(
                    npc.x,
                    npc.y - 8,
                    9,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.font =
                    "bold 12px Arial";

                ctx.fillStyle =
                    "#fff2ce";

                ctx.textAlign =
                    "center";

                ctx.fillText(
                    npc.name,
                    npc.x,
                    npc.y - 30
                );


                if (
                    distance(
                        npc,
                        state.player
                    ) < 80
                ) {

                    ctx.fillStyle =
                        "#e8c878";

                    ctx.font =
                        "bold 16px Arial";

                    ctx.fillText(
                        "!",
                        npc.x,
                        npc.y - 48
                    );
                }
            }
        );
    }


    /* =====================================================
       INIMIGOS
    ====================================================== */

    function drawEnemies() {

        state.world.enemies.forEach(
            enemy => {

                if (!enemy.alive) return;


                ctx.fillStyle =
                    "rgba(0,0,0,.25)";

                ctx.beginPath();

                ctx.ellipse(
                    enemy.x,
                    enemy.y + 17,
                    17,
                    6,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.fillStyle =
                    enemy.hitFlash > 0
                        ? "#fff"
                        : enemy.color;


                ctx.beginPath();

                ctx.arc(
                    enemy.x,
                    enemy.y,
                    16,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                drawEnemyHealth(
                    enemy
                );
            }
        );
    }


    function drawEnemyHealth(enemy) {

        const width = 42;

        const ratio =
            clamp(
                enemy.hp /
                enemy.maxHp,
                0,
                1
            );


        ctx.fillStyle =
            "#221c20";

        ctx.fillRect(
            enemy.x - width / 2,
            enemy.y - 27,
            width,
            5
        );


        ctx.fillStyle =
            "#c94e5b";

        ctx.fillRect(
            enemy.x - width / 2,
            enemy.y - 27,
            width * ratio,
            5
        );
    }


    /* =====================================================
       BOSS
    ====================================================== */

    function drawBosses() {

        state.world.bosses.forEach(
            boss => {

                if (!boss.alive) return;


                ctx.fillStyle =
                    "rgba(0,0,0,.3)";

                ctx.beginPath();

                ctx.ellipse(
                    boss.x,
                    boss.y + 30,
                    35,
                    12,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.fillStyle =
                    boss.color;

                ctx.beginPath();

                ctx.arc(
                    boss.x,
                    boss.y,
                    30,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.font =
                    "28px Arial";

                ctx.textAlign =
                    "center";

                ctx.fillText(
                    "👹",
                    boss.x,
                    boss.y + 10
                );


                drawBossHealth(
                    boss
                );


                ctx.fillStyle =
                    "#ffdf8b";

                ctx.font =
                    "bold 13px Arial";

                ctx.fillText(
                    boss.name,
                    boss.x,
                    boss.y - 45
                );
            }
        );
    }


    function drawBossHealth(boss) {

        const width = 90;

        const ratio =
            clamp(
                boss.hp /
                boss.maxHp,
                0,
                1
            );


        ctx.fillStyle =
            "#24191b";

        ctx.fillRect(
            boss.x - width / 2,
            boss.y - 35,
            width,
            7
        );


        ctx.fillStyle =
            "#c74655";

        ctx.fillRect(
            boss.x - width / 2,
            boss.y - 35,
            width * ratio,
            7
        );
    }


    /* =====================================================
       SAÍDAS
    ====================================================== */

    function drawExits() {

        state.world.exits.forEach(
            exit => {

                ctx.fillStyle =
                    exit.unlocked
                        ? "rgba(112,190,110,.3)"
                        : "rgba(100,80,80,.35)";

                ctx.fillRect(
                    exit.x,
                    exit.y,
                    exit.w,
                    exit.h
                );


                ctx.strokeStyle =
                    exit.unlocked
                        ? "#82d07c"
                        : "#9a7777";

                ctx.strokeRect(
                    exit.x,
                    exit.y,
                    exit.w,
                    exit.h
                );


                ctx.fillStyle =
                    "#eee";

                ctx.font =
                    "bold 13px Arial";

                ctx.textAlign =
                    "center";

                ctx.fillText(
                    exit.unlocked
                        ? `→ ${exit.label}`
                        : "🔒 Bloqueado",
                    exit.x +
                    exit.w / 2,
                    exit.y +
                    exit.h / 2
                );
            }
        );
    }


    /* =====================================================
       PLAYER
    ====================================================== */

    function drawPlayer() {

        const player =
            state.player;

        if (!player) return;


        const character =
            getCharacter();


        ctx.fillStyle =
            "rgba(0,0,0,.3)";

        ctx.beginPath();

        ctx.ellipse(
            player.x,
            player.y + 19,
            21,
            8,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            character.color;

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
            "#e4c19e";

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


        ctx.font =
            "bold 13px Arial";

        ctx.fillStyle =
            "#fff0c8";

        ctx.textAlign =
            "center";

        ctx.fillText(
            player.name,
            player.x,
            player.y - 38
        );
    }


    /* =====================================================
       PARTÍCULAS
    ====================================================== */

    function createHitParticles(x, y) {

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            state.particles.push({

                x,
                y,

                vx:
                    random(-70, 70),

                vy:
                    random(-90, 20),

                life:
                    .45
            });
        }
    }


    function createMagicEffect(
        x,
        y,
        color
    ) {

        for (
            let i = 0;
            i < 16;
            i++
        ) {

            state.particles.push({

                x,
                y,

                vx:
                    random(-120, 120),

                vy:
                    random(-120, 120),

                life:
                    .65,

                color
            });
        }
    }


    function createAttackEffect(x, y) {

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            state.particles.push({

                x,
                y,

                vx:
                    random(-50, 50),

                vy:
                    random(-50, 50),

                life:
                    .25,

                color:
                    "#fff0bc"
            });
        }
    }


    function updateParticles(dt) {

        state.particles.forEach(
            particle => {

                particle.x +=
                    particle.vx * dt;

                particle.y +=
                    particle.vy * dt;

                particle.vy +=
                    80 * dt;

                particle.life -=
                    dt;
            }
        );


        state.particles =
            state.particles.filter(
                particle =>
                    particle.life > 0
            );
    }


    function drawParticles() {

        state.particles.forEach(
            particle => {

                ctx.globalAlpha =
                    clamp(
                        particle.life,
                        0,
                        1
                    );

                ctx.fillStyle =
                    particle.color ||
                    "#e9c86d";

                ctx.fillRect(
                    particle.x,
                    particle.y,
                    4,
                    4
                );
            }
        );

        ctx.globalAlpha =
            1;
    }


    /* =====================================================
       NÚMEROS DE DANO
    ====================================================== */

    function showDamageNumber(
        x,
        y,
        value,
        playerDamage = false
    ) {

        state.damageNumbers.push({

            x,

            y,

            value,

            playerDamage,

            life: 1
        });
    }


    function drawDamageNumbers() {

        state.damageNumbers.forEach(
            number => {

                const alpha =
                    clamp(
                        number.life,
                        0,
                        1
                    );


                ctx.save();

                ctx.globalAlpha =
                    alpha;

                ctx.fillStyle =
                    number.playerDamage
                        ? "#ff7777"
                        : "#ffe48a";

                ctx.font =
                    "bold 20px Arial";

                ctx.textAlign =
                    "center";


                ctx.fillText(
                    `-${number.value}`,
                    number.x -
                    state.camera.x,
                    number.y -
                    state.camera.y
                );


                ctx.restore();

                number.y -=
                    .7;

                number.life -=
                    .025;
            }
        );


        state.damageNumbers =
            state.damageNumbers.filter(
                number =>
                    number.life > 0
            );
    }


    /* =====================================================
       TRANSIÇÃO
    ====================================================== */

    function transitionOut(callback) {

        const overlay =
            document.getElementById(
                "transitionOverlay"
            );


        state.transitionBusy =
            true;


        overlay.classList.add(
            "active"
        );


        setTimeout(() => {

            callback();

        }, 550);
    }


    function transitionIn() {

        const overlay =
            document.getElementById(
                "transitionOverlay"
            );


        setTimeout(() => {

            overlay.classList.remove(
                "active"
            );

            state.transitionBusy =
                false;

        }, 100);
    }


    /* =====================================================
       LOOP
    ====================================================== */

    function update(dt) {

        if (
            !state.player ||
            state.paused ||
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
            dt
        );


        updateNPCs(dt);

        updateEnemies(dt);

        updateSurvival(dt);

        updateEffects();

        updateParticles(dt);

        checkQuests();

        checkExits();

        updateCamera();

        updateInteractionHint();

        updateHUD();

        drawMiniMap();
    }


    function gameLoop(timestamp) {

        if (!state.running) {
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


    /* =====================================================
       INDICADOR DE INTERAÇÃO
    ====================================================== */

    function updateInteractionHint() {

        const hint =
            document.getElementById(
                "interactionHint"
            );


        const interaction =
            findInteraction();


        if (!interaction) {

            hint.classList.add(
                "hidden"
            );

            return;
        }


        hint.classList.remove(
            "hidden"
        );


        const text =
            hint.querySelector("span");


        if (
            interaction.type === "npc"
        ) {

            text.textContent =
                `F — Conversar com ${interaction.target.name}`;

        } else {

            text.textContent =
                `F — Coletar ${ITEMS[
                    interaction.target.type
                ].name}`;
        }
    }


    /* =====================================================
       MENU
    ====================================================== */

    function returnToMenu() {

        if (state.player) {

            saveGame(false);
        }


        state.running =
            false;

        state.paused =
            false;

        state.keys.clear();

        showScreen("menu");

        updateContinueButton();
    }


    /* =====================================================
       EVENTOS — MENU
    ====================================================== */

    document
        .getElementById("newGameBtn")
        .addEventListener(
            "click",
            startNewGame
        );


    document
        .getElementById("continueBtn")
        .addEventListener(
            "click",
            () => {

                if (!loadGame()) {

                    showToast(
                        "Não foi possível carregar o jogo."
                    );

                    updateContinueButton();
                }
            }
        );


    document
        .getElementById("howToBtn")
        .addEventListener(
            "click",
            () => {
                showScreen("howTo");
            }
        );


    document
        .getElementById("creditsBtn")
        .addEventListener(
            "click",
            () => {
                showScreen("credits");
            }
        );


    document
        .querySelectorAll(".back-menu-generic")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showScreen("menu");

                    updateContinueButton();
                }
            );
        });


    document
        .getElementById("startGameBtn")
        .addEventListener(
            "click",
            beginGame
        );


    document
        .getElementById("backMenuBtn")
        .addEventListener(
            "click",
            () => {

                showScreen("menu");

                updateContinueButton();
            }
        );


    document
        .getElementById("playerName")
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


    /* =====================================================
       SAVE / MENU
    ====================================================== */

    document
        .getElementById("saveBtn")
        .addEventListener(
            "click",
            () => {

                saveGame(true);
            }
        );


    document
        .getElementById("menuBtn")
        .addEventListener(
            "click",
            returnToMenu
        );


    /* =====================================================
       QUICK BUTTONS
    ====================================================== */

    document
        .getElementById(
            "inventoryQuickBtn"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "inventoryModal"
                    )
                    .classList.remove(
                        "hidden"
                    );

                renderInventory();
            }
        );


    document
        .getElementById(
            "mapQuickBtn"
        )
        .addEventListener(
            "click",
            openMap
        );


    /* =====================================================
       FECHAR MODAIS
    ====================================================== */

    document
        .querySelectorAll(".modal-close")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    button
                        .closest(".modal")
                        .classList.add(
                            "hidden"
                        );
                }
            );
        });


    document
        .getElementById(
            "dialogClose"
        )
        .addEventListener(
            "click",
            closeDialog
        );


    document
        .getElementById(
            "levelCloseBtn"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "levelModal"
                    )
                    .classList.add(
                        "hidden"
                    );
            }
        );


    document
        .getElementById(
            "respawnBtn"
        )
        .addEventListener(
            "click",
            respawn
        );


    /* =====================================================
       INVENTÁRIO CATEGORIAS
    ====================================================== */

    document
        .querySelectorAll(".inventory-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".inventory-tab"
                        )
                        .forEach(t =>
                            t.classList.remove(
                                "active"
                            )
                        );

                    tab.classList.add(
                        "active"
                    );

                    state.inventoryCategory =
                        tab.dataset.category;

                    renderInventory();
                }
            );
        });


    /* =====================================================
       LOJA
    ====================================================== */

    document
        .querySelectorAll(".shop-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".shop-tab"
                        )
                        .forEach(t =>
                            t.classList.remove(
                                "active"
                            )
                        );

                    tab.classList.add(
                        "active"
                    );

                    state.shopMode =
                        tab.dataset.shop;

                    renderShop();
                }
            );
        });


    /* =====================================================
       ATRIBUTOS
    ====================================================== */

    document
        .querySelectorAll(
            ".stat-upgrades button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    spendStat(
                        button.dataset.stat
                    );
                }
            );
        });


    /* =====================================================
       TECLADO
    ====================================================== */

    window.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


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
                movementKeys.includes(key)
            ) {

                event.preventDefault();

                state.keys.add(
                    key
                );
            }


            if (
                event.code ===
                "Space"
            ) {

                event.preventDefault();

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    basicAttack();
                }
            }


            if (
                key === "q"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    primarySkill();
                }
            }


            if (
                key === "e"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    secondarySkill();
                }
            }


            if (
                key === "f"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    interact();
                }
            }


            if (
                key === "i"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    document
                        .getElementById(
                            "inventoryModal"
                        )
                        .classList.toggle(
                            "hidden"
                        );

                    renderInventory();
                }
            }


            if (
                key === "m"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    openMap();
                }
            }


            if (
                key === "l"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    openBook();
                }
            }


            if (
                key === "1"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    usePotion(
                        "potionHealth"
                    );
                }
            }


            if (
                key === "2"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    usePotion(
                        "potionStrength"
                    );
                }
            }


            if (
                key === "3"
            ) {

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    usePotion(
                        "potionDefense"
                    );
                }
            }


            if (
                event.key === "Escape"
            ) {

                closeAllInterfaces();
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


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /* =====================================================
       FECHAR INTERFACES
    ====================================================== */

    function closeAllInterfaces() {

        document
            .querySelectorAll(
                ".modal"
            )
            .forEach(modal => {

                modal.classList.add(
                    "hidden"
                );
            });


        closeDialog();
    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    createCharacterCards();

    resizeCanvas();

    updateContinueButton();

})();
