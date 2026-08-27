(() => {
    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ====================================================== */

    const SAVE_KEY = "veyra_save_stable_v13";

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const miniCanvas =
        document.getElementById("miniCanvas");

    const miniCtx =
        miniCanvas.getContext("2d");

    const mapCanvas =
        document.getElementById("worldMapCanvas");

    const mapCtx =
        mapCanvas.getContext("2d");


    const $ = id =>
        document.getElementById(id);


    /* =====================================================
       PERSONAGENS
    ====================================================== */

    const CHARACTERS = [

        {
            id: "kaelion",
            name: "KAELION",
            className: "Mago",
            icon: "🧙",
            role: "Magia • Longo alcance",
            description:
                "Grande poder mágico, mas menor resistência física.",
            hp: 85,
            magic: 140,
            energy: 120,
            speed: 175,
            damage: 24,
            defense: 5,
            color: "#e49345",
            bg: "rgba(228,147,69,.16)",
            glow: "rgba(228,147,69,.28)"
        },

        {
            id: "theron",
            name: "THERON",
            className: "Cavaleiro",
            icon: "🛡️",
            role: "Espada • Defesa",
            description:
                "Resistente e preparado para o combate corpo a corpo.",
            hp: 140,
            magic: 75,
            energy: 105,
            speed: 145,
            damage: 30,
            defense: 20,
            color: "#bfc5ce",
            bg: "rgba(191,197,206,.14)",
            glow: "rgba(191,197,206,.23)"
        },

        {
            id: "grumgar",
            name: "GRUMGAR",
            className: "Troll",
            icon: "👹",
            role: "Força • Vida",
            description:
                "Muita vida e dano físico, mas baixa velocidade.",
            hp: 175,
            magic: 55,
            energy: 85,
            speed: 110,
            damage: 38,
            defense: 18,
            color: "#718f51",
            bg: "rgba(113,143,81,.16)",
            glow: "rgba(113,143,81,.24)"
        },

        {
            id: "lirael",
            name: "LIRAEL",
            className: "Fada",
            icon: "🧚",
            role: "Velocidade • Cura",
            description:
                "Rápida, mágica e capaz de usar poderes de suporte.",
            hp: 95,
            magic: 130,
            energy: 135,
            speed: 210,
            damage: 19,
            defense: 7,
            color: "#dd8bd0",
            bg: "rgba(221,139,208,.16)",
            glow: "rgba(221,139,208,.25)"
        },

        {
            id: "zephyr",
            name: "ZEPHYR",
            className: "Transmorfo",
            icon: "🦊",
            role: "Adaptação • Equilíbrio",
            description:
                "Características equilibradas e grande capacidade de adaptação.",
            hp: 115,
            magic: 105,
            energy: 110,
            speed: 170,
            damage: 25,
            defense: 13,
            color: "#cb9058",
            bg: "rgba(203,144,88,.15)",
            glow: "rgba(203,144,88,.23)"
        }

    ];


    /* =====================================================
       ITENS
    ====================================================== */

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
            name: "Ferro",
            icon: "⛓️",
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
            name: "Essência",
            icon: "✦",
            category: "special",
            weight: 1,
            value: 100
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


    /* =====================================================
       REGIÕES
    ====================================================== */

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
            visual: "forest"
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
            visual: "cave"
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
        }

    };


    /* =====================================================
       ESTADO
    ====================================================== */

    const state = {

        selectedCharacter:
            CHARACTERS[0],

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

        world: {
            width: 3200,
            height: 2200,

            obstacles: [],
            buildings: [],
            trees: [],
            resources: [],
            npcs: [],
            enemies: [],
            drops: [],
            portals: [],
            particles: []
        },

        houseMode: false,

        currentHouse: null,

        dialogue: null,

        travel: null,

        battle: null,

        questNPC: null,

        shopNPC: null,

        shopMode: "buy",

        inventoryCategory: "all",

        toastTimer: null,

        portalCooldown: 0

    };


    /* =====================================================
       UTILIDADES
    ====================================================== */

    function clamp(
        value,
        min,
        max
    ) {
        return Math.max(
            min,
            Math.min(max, value)
        );
    }


    function distance(a, b) {
        return Math.hypot(
            a.x - b.x,
            a.y - b.y
        );
    }


    function random(min, max) {
        return Math.random() *
            (max - min) +
            min;
    }


    function randomInt(min, max) {
        return Math.floor(
            random(min, max + 1)
        );
    }


    function uid(prefix) {
        return (
            prefix +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 8)
        );
    }


    function currentCharacter() {
        return (
            CHARACTERS.find(
                c =>
                    c.id ===
                    state.player?.characterId
            ) ||
            CHARACTERS[0]
        );
    }


    function showScreen(name) {

        const screens = {

            menu:
                $("menuScreen"),

            how:
                $("howScreen"),

            credits:
                $("creditsScreen"),

            character:
                $("characterScreen"),

            game:
                $("gameScreen")

        };


        Object.values(screens)
            .forEach(
                screen =>
                    screen.classList
                        .remove("active")
            );


        screens[name]
            .classList
            .add("active");
    }


    function showToast(message) {

        const toast =
            $("saveMessage");


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
                    toast.classList
                        .remove("show");
                },
                2200
            );
    }


    /* =====================================================
       RESIZE
    ====================================================== */

    function resizeCanvas() {

        const dpr =
            window.devicePixelRatio ||
            1;


        canvas.width =
            Math.floor(
                window.innerWidth *
                dpr
            );


        canvas.height =
            Math.floor(
                window.innerHeight *
                dpr
            );


        canvas.style.width =
            window.innerWidth +
            "px";


        canvas.style.height =
            window.innerHeight +
            "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    /* =====================================================
       PERSONAGEM
    ====================================================== */

    function createCharacterCards() {

        const container =
            $("characterCards");


        container.innerHTML =
            "";


        CHARACTERS.forEach(
            (character, index) => {

                const card =
                    document.createElement(
                        "button"
                    );


                card.type = "button";

                card.className =
                    "character-card" +
                    (
                        index === 0
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
                        ✨ ${character.magic}
                        •
                        ⚡ ${character.energy}
                    </p>

                    <p>
                        ⚔ ${character.damage}
                        •
                        🛡 ${character.defense}
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
                            .querySelectorAll(
                                ".character-card"
                            )
                            .forEach(
                                other =>
                                    other.classList
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


    function startNewGame() {

        $("playerName").value =
            "";

        $("nameError").textContent =
            "";


        state.selectedCharacter =
            CHARACTERS[0];


        document
            .querySelectorAll(
                ".character-card"
            )
            .forEach(
                (card, index) =>
                    card.classList.toggle(
                        "selected",
                        index === 0
                    )
            );


        showScreen(
            "character"
        );


        setTimeout(
            () =>
                $("playerName").focus(),
            100
        );
    }


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

            x: 480,

            y: 610,

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

            treesCut: 0,

            enemiesDefeated: 0,

            discoveredBosses: [],

            defeatedBosses: [],

            unlockedAreas: [
                "village"
            ],

            checkpoints: {

                village: {
                    x: 480,
                    y: 610
                },

                forest: {
                    x: 150,
                    y: 1100
                },

                grove: {
                    x: 150,
                    y: 1100
                },

                mountains: {
                    x: 150,
                    y: 1100
                },

                iron: {
                    x: 150,
                    y: 950
                },

                ruby: {
                    x: 150,
                    y: 1050
                },

                shadow: {
                    x: 150,
                    y: 1000
                },

                fairy: {
                    x: 150,
                    y: 1100
                },

                sky: {
                    x: 150,
                    y: 1100
                },

                hell: {
                    x: 150,
                    y: 1200
                }

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

            collected: {},

            mapOwned: false,

            dead: false,

            invincible: 0,

            attackCooldown: 0

        };
    }


    function startGame() {

        const name =
            $("playerName")
                .value
                .trim();


        if (
            name.length <
            2
        ) {

            $("nameError")
                .textContent =
                "Digite pelo menos 2 caracteres.";

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


        buildWorld();


        state.player.x =
            480;


        state.player.y =
            610;


        updateHUD();


        showScreen(
            "game"
        );


        state.running =
            true;


        state.paused =
            false;


        state.time =
            0;


        state.lastTime =
            performance.now();


        $("transitionScreen")
            .classList
            .remove(
                "hidden"
            );


        $("transitionMessage")
            .textContent =
            "VEYRA";


        state.paused =
            true;


        setTimeout(
            () => {

                $("transitionScreen")
                    .classList
                    .add(
                        "hidden"
                    );

                state.paused =
                    false;

                showToast(
                    "Você despertou na Vila do Crepúsculo."
                );

            },
            700
        );


        requestAnimationFrame(
            gameLoop
        );
    }


    /* =====================================================
       MUNDO
    ====================================================== */

    function resetWorld() {

        const region =
            REGIONS[state.area];


        state.world = {

            width:
                region.width,

            height:
                region.height,

            obstacles: [],

            buildings: [],

            trees: [],

            resources: [],

            npcs: [],

            enemies: [],

            drops: [],

            portals: [],

            particles: []

        };
    }


    function addObstacle(
        x,
        y,
        w,
        h,
        type,
        extra = {}
    ) {

        state.world.obstacles.push({

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


        state.world.buildings
            .push(
                building
            );


        addObstacle(
            x,
            y,
            w,
            h,
            "building",
            {
                buildingId:
                    id
            }
        );
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

            alive:
                true,

            amount:
                randomInt(2, 5),

            respawn:
                0

        };


        state.world.trees
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
    }


    function addResource(
        x,
        y,
        type
    ) {

        state.world.resources.push({

            id:
                uid("resource"),

            x,

            y,

            type,

            alive:
                true,

            amount:
                randomInt(1, 3),

            respawn:
                0
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

        state.world.npcs.push({

            id:
                uid("npc"),

            x,

            y,

            radius:
                17,

            name,

            role,

            color,

            lines,

            ...extra

        });
    }


    function addEnemy(
        enemy
    ) {

        state.world.enemies.push({

            state:
                "idle",

            aggressive:
                false,

            accepted:
                false,

            attackTimer:
                0,

            hitFlash:
                0,

            dead:
                false,

            respawnTimer:
                0,

            phase:
                1,

            ...enemy

        });
    }


    function addPortal(
        x,
        y,
        w,
        h,
        target,
        requirement,
        title
    ) {

        state.world.portals.push({

            x,

            y,

            w,

            h,

            target,

            requirement,

            title

        });
    }


    function buildWorld() {

        resetWorld();


        addWorldBounds();


        switch (
            state.area
        ) {

            case "village":
                buildVillage();
                break;

            case "forest":
                buildForest();
                break;

            case "grove":
                buildGrove();
                break;

            case "mountains":
                buildMountains();
                break;

            case "iron":
                buildIron();
                break;

            case "ruby":
                buildRuby();
                break;

            case "shadow":
                buildShadow();
                break;

            case "fairy":
                buildFairy();
                break;

            case "sky":
                buildSky();
                break;

            case "hell":
                buildHell();
                break;
        }


        updateLocation();
    }


    function addWorldBounds() {

        const gap = 70;


        addObstacle(
            0,
            0,
            state.world.width,
            gap,
            "wall"
        );


        addObstacle(
            0,
            state.world.height -
                gap,
            state.world.width,
            gap,
            "wall"
        );


        addObstacle(
            0,
            0,
            gap,
            state.world.height,
            "wall"
        );


        addObstacle(
            state.world.width -
                gap,
            0,
            gap,
            state.world.height,
            "wall"
        );
    }


    /* =====================================================
       VILA
    ====================================================== */

    function buildVillage() {

        addBuilding(
            "home",
            270,
            280,
            430,
            270,
            "CASA DO AVENTUREIRO",
            "#70483a",
            "#ae835e"
        );


        addBuilding(
            "elian",
            830,
            260,
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
            2500,
            1260,
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


        addObstacle(
            1465,
            870,
            270,
            215,
            "fountain"
        );


        const rocks = [
            [970, 760],
            [1100, 720],
            [1210, 1800],
            [1850, 1630],
            [2200, 940],
            [2740, 860],
            [650, 1160],
            [2370, 1830]
        ];


        rocks.forEach(
            ([x, y]) =>
                addObstacle(
                    x - 30,
                    y - 23,
                    60,
                    46,
                    "rock"
                )
        );


        const trees = [
            [180,180],
            [390,180],
            [650,170],
            [940,150],
            [1320,160],
            [1750,160],
            [2150,160],
            [2600,170],
            [2950,180],
            [150,700],
            [180,1050],
            [190,1440],
            [250,1960],
            [1050,2010],
            [1500,1980],
            [1950,2020],
            [2400,2030],
            [2850,1960],
            [3040,1710],
            [3020,1200],
            [3010,650],
            [2850,1050],
            [2150,750],
            [1900,750],
            [1150,1000]
        ];


        trees.forEach(
            ([x, y], index) =>
                addTree(
                    x,
                    y,
                    "village_tree_" +
                    index
                )
        );


        addNPC(
            1030,
            610,
            "ELIAN",
            "Morador",
            "#d4b27c",
            [
                "A Quietude parece estar chegando mais perto.",
                "Algumas pessoas já começaram a esquecer pequenas coisas.",
                "Quando uma vila perde suas histórias, ela começa a desaparecer.",
                "Há caminhos fora da vila que talvez escondam respostas."
            ],
            {
                questId:
                    "wood"
            }
        );


        addNPC(
            1940,
            1055,
            "MARA",
            "Historiadora",
            "#b98bc4",
            [
                "O silêncio de hoje não é o mesmo silêncio de ontem.",
                "A Quietude não destrói tudo de uma vez.",
                "Algumas histórias foram apagadas antes mesmo de serem contadas.",
                "Tenho a sensação de que alguém está procurando nossas memórias."
            ]
        );


        addNPC(
            2700,
            1125,
            "DORAN",
            "Comerciante",
            "#c58a54",
            [
                "Material raro sempre encontra comprador.",
                "Uma boa aventura começa com bons preparativos.",
                "Se encontrar algo valioso, passe na loja.",
                "Não confie em uma estrada só porque ela parece tranquila."
            ],
            {
                merchant:
                    true
            }
        );


        addNPC(
            1050,
            1420,
            "BRAN",
            "Carpinteiro",
            "#8d7053",
            [
                "Madeira ainda é uma das coisas mais importantes da vila.",
                "Cuidado ao cortar árvores tocadas pela Quietude.",
                "Algumas árvores parecem voltar a nascer longe do lugar onde caíram.",
                "Se puder me ajudar com madeira, eu posso recompensá-lo."
            ],
            {
                questId:
                    "wood"
            }
        );


        addNPC(
            2280,
            820,
            "BORIN",
            "Ferreiro",
            "#8e8d89",
            [
                "Ferro é o começo de todo bom equipamento.",
                "Armas melhores aumentam suas chances de sobreviver.",
                "Não desperdice materiais raros.",
                "Se precisar de ajuda com equipamento, procure Doran ou volte aqui."
            ],
            {
                forge:
                    true
            }
        );


        addEnemy({
            id:
                "forest_guardian",

            name:
                "GUARDIÃO DA ESTRADA",

            icon:
                "👺",

            type:
                "progression",

            hp:
                280,

            maxHp:
                280,

            damage:
                20,

            speed:
                55,

            vision:
                270,

            attackRange:
                72,

            radius:
                29,

            color:
                "#945149",

            drop:
                "cristal",

            dropAmount:
                2,

            unlock:
                "forest"
        });


        addEnemy({
            id:
                "wolf_village",

            name:
                "LOBO ESQUECIDO",

            icon:
                "🐺",

            type:
                "normal",

            hp:
                80,

            maxHp:
                80,

            damage:
                12,

            speed:
                90,

            vision:
                250,

            attackRange:
                65,

            radius:
                21,

            color:
                "#686d78",

            drop:
                "carvao",

            dropAmount:
                1
        });


        addEnemy({
            id:
                "slime_village",

            name:
                "LIMO DA QUIETUDE",

            icon:
                "🟢",

            type:
                "normal",

            hp:
                55,

            maxHp:
                55,

            damage:
                8,

            speed:
                55,

            vision:
                190,

            attackRange:
                55,

            radius:
                18,

            color:
                "#6c9862",

            drop:
                "erva",

            dropAmount:
                1
        });


        addPortal(
            3090,
            1000,
            70,
            220,
            "forest",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "forest_guardian"
                    ),
            "FLORESTA"
        );
    }


    /* =====================================================
       FLORESTA
    ====================================================== */

    function buildForest() {

        for (
            let i = 0;
            i < 35;
            i++
        ) {

            addTree(
                randomInt(
                    140,
                    3200
                ),
                randomInt(
                    140,
                    2250
                ),
                `forest_tree_${i}`
            );
        }


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            addEnemy({

                id:
                    `forest_wolf_${i}`,

                name:
                    "LOBO FLORESTAL",

                icon:
                    "🐺",

                type:
                    "normal",

                hp:
                    100,

                maxHp:
                    100,

                damage:
                    15,

                speed:
                    100,

                vision:
                    260,

                attackRange:
                    65,

                radius:
                    22,

                color:
                    "#68707b",

                drop:
                    i % 2
                        ? "erva"
                        : "carvao",

                dropAmount:
                    1
            });
        }


        addEnemy({

            id:
                "grove_guardian",

            name:
                "GUARDIÃO DA FLORESTA",

            icon:
                "🌳",

            type:
                "progression",

            hp:
                420,

            maxHp:
                420,

            damage:
                24,

            speed:
                60,

            vision:
                300,

            attackRange:
                80,

            radius:
                31,

            color:
                "#4d754b",

            drop:
                "ferro",

            dropAmount:
                2,

            unlock:
                "grove"
        });


        addNPC(
            700,
            850,
            "NARA",
            "Guardião da Floresta",
            "#7ea56b",
            [
                "A floresta percebe quando alguém pisa nela.",
                "A Quietude começou a alterar algumas árvores.",
                "Há lugares aqui onde o silêncio parece antigo.",
                "Observe as criaturas antes de decidir se vale a pena enfrentá-las."
            ]
        );


        addPortal(
            3260,
            1000,
            70,
            220,
            "grove",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "grove_guardian"
                    ),
            "BOSQUE"
        );
    }


    /* =====================================================
       BOSQUE
    ====================================================== */

    function buildGrove() {

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            addTree(
                randomInt(
                    120,
                    3050
                ),
                randomInt(
                    120,
                    2150
                ),
                `grove_tree_${i}`
            );
        }


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            addEnemy({

                id:
                    `grove_beast_${i}`,

                name:
                    "FERA DO BOSQUE",

                icon:
                    "🦌",

                type:
                    "normal",

                hp:
                    130,

                maxHp:
                    130,

                damage:
                    17,

                speed:
                    86,

                vision:
                    250,

                attackRange:
                    65,

                radius:
                    23,

                color:
                    "#60745e",

                drop:
                    "ferro",

                dropAmount:
                    1
            });
        }


        addEnemy({

            id:
                "mountain_guardian",

            name:
                "GUARDIÃO DAS MONTANHAS",

            icon:
                "🗿",

            type:
                "progression",

            hp:
                500,

            maxHp:
                500,

            damage:
                28,

            speed:
                57,

            vision:
                320,

            attackRange:
                82,

            radius:
                32,

            color:
                "#848a8c",

            drop:
                "ouro",

            dropAmount:
                2,

            unlock:
                "mountains"
        });


        addPortal(
            3060,
            990,
            70,
            220,
            "mountains",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "mountain_guardian"
                    ),
            "MONTANHAS"
        );
    }


    /* =====================================================
       MONTANHAS
    ====================================================== */

    function buildMountains() {

        for (
            let i = 0;
            i < 20;
            i++
        ) {

            addObstacle(
                randomInt(
                    200,
                    3200
                ),
                randomInt(
                    160,
                    2100
                ),
                70,
                52,
                "snowrock"
            );
        }


        addEnemy({

            id:
                "iron_guardian",

            name:
                "SENTINELA DAS MONTANHAS",

            icon:
                "⚙️",

            type:
                "progression",

            hp:
                620,

            maxHp:
                620,

            damage:
                31,

            speed:
                54,

            vision:
                330,

            attackRange:
                85,

            radius:
                34,

            color:
                "#72797e",

            drop:
                "ferro",

            dropAmount:
                3,

            unlock:
                "iron"
        });


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            addEnemy({

                id:
                    `mountain_beast_${i}`,

                name:
                    "BESTA DA MONTANHA",

                icon:
                    "🐐",

                type:
                    "normal",

                hp:
                    155,

                maxHp:
                    155,

                damage:
                    20,

                speed:
                    70,

                vision:
                    250,

                attackRange:
                    65,

                radius:
                    24,

                color:
                    "#c7ccca",

                drop:
                    "ferro",

                dropAmount:
                    1
            });
        }


        addPortal(
            3150,
            980,
            70,
            220,
            "iron",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "iron_guardian"
                    ),
            "CAVERNA DE FERRO"
        );
    }


    /* =====================================================
       CAVERNA DE FERRO
    ====================================================== */

    function buildIron() {

        for (
            let i = 0;
            i < 28;
            i++
        ) {

            addObstacle(
                randomInt(
                    160,
                    2700
                ),
                randomInt(
                    160,
                    1750
                ),
                65,
                48,
                "ironrock"
            );
        }


        for (
            let i = 0;
            i < 18;
            i++
        ) {

            addResource(
                randomInt(
                    180,
                    2700
                ),
                randomInt(
                    180,
                    1750
                ),
                "ferro"
            );
        }


        addEnemy({

            id:
                "ruby_guardian",

            name:
                "GUARDIÃO DE FERRO",

            icon:
                "⛓️",

            type:
                "progression",

            hp:
                700,

            maxHp:
                700,

            damage:
                34,

            speed:
                53,

            vision:
                340,

            attackRange:
                85,

            radius:
                34,

            color:
                "#72797e",

            drop:
                "ferro",

            dropAmount:
                4,

            unlock:
                "ruby"
        });


        addPortal(
            2750,
            820,
            80,
            240,
            "ruby",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "ruby_guardian"
                    ),
            "CAVERNA DE RUBI"
        );
    }


    /* =====================================================
       CAVERNA DE RUBI
    ====================================================== */

    function buildRuby() {

        for (
            let i = 0;
            i < 25;
            i++
        ) {

            addObstacle(
                randomInt(
                    180,
                    2850
                ),
                randomInt(
                    180,
                    1900
                ),
                68,
                48,
                "rubyrock"
            );
        }


        for (
            let i = 0;
            i < 24;
            i++
        ) {

            addResource(
                randomInt(
                    220,
                    2850
                ),
                randomInt(
                    180,
                    1900
                ),
                "rubi"
            );
        }


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            addEnemy({

                id:
                    `ruby_beast_${i}`,

                name:
                    "CRIATURA RUBI",

                icon:
                    "♦",

                type:
                    "normal",

                hp:
                    220,

                maxHp:
                    220,

                damage:
                    25,

                speed:
                    70,

                vision:
                    260,

                attackRange:
                    70,

                radius:
                    25,

                color:
                    "#a04551",

                drop:
                    "rubi",

                dropAmount:
                    1
            });
        }


        addEnemy({

            id:
                "shadow_guardian",

            name:
                "GUARDIÃO RUBI",

            icon:
                "🔴",

            type:
                "progression",

            hp:
                800,

            maxHp:
                800,

            damage:
                38,

            speed:
                58,

            vision:
                350,

            attackRange:
                90,

            radius:
                35,

            color:
                "#a53e51",

            drop:
                "rubi",

            dropAmount:
                3,

            unlock:
                "shadow"
        });


        addPortal(
            2790,
            850,
            80,
            250,
            "shadow",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "shadow_guardian"
                    ),
            "CAVERNA SOMBRIA"
        );
    }


    /* =====================================================
       CAVERNA SOMBRIA
    ====================================================== */

    function buildShadow() {

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            addEnemy({

                id:
                    `shadow_enemy_${i}`,

                name:
                    "SOMBRA ESQUECIDA",

                icon:
                    "👤",

                type:
                    "normal",

                hp:
                    260,

                maxHp:
                    260,

                damage:
                    30,

                speed:
                    78,

                vision:
                    290,

                attackRange:
                    70,

                radius:
                    25,

                color:
                    "#49425f",

                drop:
                    "essencia",

                dropAmount:
                    1
            });
        }


        addEnemy({

            id:
                "fairy_guardian",

            name:
                "GUARDIÃO SOMBRIO",

            icon:
                "🌑",

            type:
                "progression",

            hp:
                900,

            maxHp:
                900,

            damage:
                41,

            speed:
                62,

            vision:
                350,

            attackRange:
                90,

            radius:
                35,

            color:
                "#42364f",

            drop:
                "essencia",

            dropAmount:
                3,

            unlock:
                "fairy"
        });


        addPortal(
            2760,
            820,
            90,
            250,
            "fairy",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "fairy_guardian"
                    ),
            "REINO DAS FADAS"
        );
    }


    /* =====================================================
       REINO DAS FADAS
    ====================================================== */

    function buildFairy() {

        for (
            let i = 0;
            i < 22;
            i++
        ) {

            addResource(
                randomInt(
                    170,
                    3000
                ),
                randomInt(
                    180,
                    2000
                ),
                "cristal"
            );
        }


        addEnemy({

            id:
                "sky_guardian",

            name:
                "GUARDIÃO FEÉRICO",

            icon:
                "🧚",

            type:
                "progression",

            hp:
                1050,

            maxHp:
                1050,

            damage:
                43,

            speed:
                69,

            vision:
                370,

            attackRange:
                95,

            radius:
                37,

            color:
                "#cb8dd0",

            drop:
                "cristal",

            dropAmount:
                4,

            unlock:
                "sky"
        });


        addPortal(
            3000,
            900,
            80,
            300,
            "sky",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "sky_guardian"
                    ),
            "CÉU"
        );
    }


    /* =====================================================
       CÉU
    ====================================================== */

    function buildSky() {

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            addEnemy({

                id:
                    `sky_enemy_${i}`,

                name:
                    "SERAFIM CAÍDO",

                icon:
                    "🪽",

                type:
                    "normal",

                hp:
                    340,

                maxHp:
                    340,

                damage:
                    35,

                speed:
                    100,

                vision:
                    320,

                attackRange:
                    75,

                radius:
                    27,

                color:
                    "#cbd7df",

                drop:
                    "cristal",

                dropAmount:
                    1
            });
        }


        addEnemy({

            id:
                "hell_guardian",

            name:
                "SERAFIM DA QUIETUDE",

            icon:
                "☀️",

            type:
                "progression",

            hp:
                1200,

            maxHp:
                1200,

            damage:
                49,

            speed:
                70,

            vision:
                390,

            attackRange:
                100,

            radius:
                39,

            color:
                "#d1b377",

            drop:
                "essencia",

            dropAmount:
                4,

            unlock:
                "hell"
        });


        addPortal(
            3220,
            980,
            80,
            260,
            "hell",
            () =>
                state.player
                    .defeatedBosses
                    .includes(
                        "hell_guardian"
                    ),
            "INFERNO"
        );
    }


    /* =====================================================
       INFERNO
    ====================================================== */

    function buildHell() {

        const types = [

            {
                name:
                    "DEMÔNIO DE CINZA",
                icon:
                    "🔥",
                color:
                    "#8c4d3f",
                drop:
                    "essencia"
            },

            {
                name:
                    "CÃO DE LAVA",
                icon:
                    "🐕",
                color:
                    "#984b31",
                drop:
                    "ouro"
            },

            {
                name:
                    "ESPECTRO CARMESIM",
                icon:
                    "👻",
                color:
                    "#724056",
                drop:
                    "essencia"
            },

            {
                name:
                    "GÁRGULA QUEBRADA",
                icon:
                    "🗿",
                color:
                    "#70554a",
                drop:
                    "ouro"
            },

            {
                name:
                    "PARASITA DO VAZIO",
                icon:
                    "🕷️",
                color:
                    "#4b3551",
                drop:
                    "essencia"
            }

        ];


        types.forEach(
            (type, index) => {

                for (
                    let i = 0;
                    i < 2;
                    i++
                ) {

                    addEnemy({

                        id:
                            `hell_${index}_${i}`,

                        name:
                            type.name,

                        icon:
                            type.icon,

                        type:
                            "hell",

                        hellType:
                            index,

                        hp:
                            370 +
                            index * 25,

                        maxHp:
                            370 +
                            index * 25,

                        damage:
                            35 +
                            index * 3,

                        speed:
                            78 +
                            index * 4,

                        vision:
                            330,

                        attackRange:
                            75,

                        radius:
                            26,

                        color:
                            type.color,

                        drop:
                            type.drop,

                        dropAmount:
                            1
                    });
                }

            }
        );
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
            dx * dx +
            dy * dy
        ) <
        radius * radius;
    }


    function canMoveTo(
        x,
        y,
        radius
    ) {

        if (
            state.houseMode
        ) {

            const room = {

                x: 180,

                y: 140,

                w:
                    state.currentHouse
                        ? Math.max(
                            300,
                            state.currentHouse.w -
                                80
                        )
                        : 420,

                h:
                    state.currentHouse
                        ? Math.max(
                            190,
                            state.currentHouse.h -
                                100
                        )
                        : 190

            };


            return (
                x - radius >= room.x &&
                y - radius >= room.y &&
                x + radius <=
                    room.x + room.w &&
                y + radius <=
                    room.y + room.h
            );
        }


        if (
            x - radius <
                75 ||
            y - radius <
                75 ||
            x + radius >
                state.world.width -
                75 ||
            y + radius >
                state.world.height -
                75
        ) {

            return false;
        }


        for (
            const obstacle of
                state.world.obstacles
        ) {

            if (
                obstacle.disabled
            ) {

                continue;
            }


            if (
                obstacle.treeId
            ) {

                const tree =
                    state.world.trees
                        .find(
                            item =>
                                item.id ===
                                obstacle.treeId
                        );


                if (
                    !tree ||
                    !tree.alive
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


        for (
            const npc of
                state.world.npcs
        ) {

            if (
                distance(
                    {
                        x,
                        y
                    },
                    npc
                ) <
                radius +
                npc.radius
            ) {

                return false;
            }
        }


        return true;
    }


    /* =====================================================
       MOVIMENTO
    ====================================================== */

    function updateMovement(
        dt
    ) {

        if (
            state.paused
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


        if (
            !dx &&
            !dy
        ) {

            return;
        }


        const length =
            Math.hypot(
                dx,
                dy
            );


        dx /= length;
        dy /= length;


        const p =
            state.player;


        let speed =
            state.houseMode
                ? 120
                : p.speed;


        if (
            !state.houseMode &&
            p.hunger <
                20
        ) {

            speed *=
                .75;
        }


        if (
            !state.houseMode &&
            p.fatigue <
                20
        ) {

            speed *=
                .75;
        }


        const step =
            speed *
            dt;


        const nextX =
            p.x +
            dx *
            step;


        if (
            canMoveTo(
                nextX,
                p.y,
                p.radius
            )
        ) {

            p.x =
                nextX;
        }


        const nextY =
            p.y +
            dy *
            step;


        if (
            canMoveTo(
                p.x,
                nextY,
                p.radius
            )
        ) {

            p.y =
                nextY;
        }
    }


    /* =====================================================
       SOBREVIVÊNCIA
    ====================================================== */

    function updateSurvival(
        dt
    ) {

        if (
            state.houseMode
        ) {

            return;
        }


        const p =
            state.player;


        p.hunger =
            clamp(
                p.hunger -
                .28 *
                dt,
                0,
                100
            );


        p.fatigue =
            clamp(
                p.fatigue -
                .22 *
                dt,
                0,
                100
            );


        p.magic =
            clamp(
                p.magic +
                2 *
                dt,
                0,
                p.maxMagic
            );


        p.energy =
            clamp(
                p.energy +
                3 *
                dt,
                0,
                p.maxEnergy
            );


        if (
            p.hunger <= 0 ||
            p.fatigue <= 0
        ) {

            p.hp =
                clamp(
                    p.hp -
                    .15 *
                    dt,
                    1,
                    p.maxHp
                );
        }


        if (
            p.hunger < 18
        ) {

            showLowNeedMessage(
                "fome"
            );
        }


        if (
            p.fatigue < 18
        ) {

            showLowNeedMessage(
                "cansaço"
            );
        }
    }


    let lastNeedWarning = 0;


    function showLowNeedMessage(
        type
    ) {

        if (
            performance.now() -
            lastNeedWarning <
            6000
        ) {

            return;
        }


        lastNeedWarning =
            performance.now();


        showToast(
            type ===
                "fome"
                ? "Você está ficando com fome."
                : "Você está cansado."
        );
    }


    /* =====================================================
       IA
    ====================================================== */

    function updateEnemies(
        dt
    ) {

        const player =
            state.player;


        state.world.enemies
            .forEach(
                enemy => {

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
                            }
                        }


                        return;
                    }


                    enemy.attackTimer =
                        Math.max(
                            0,
                            enemy.attackTimer -
                            dt
                        );


                    enemy.hitFlash =
                        Math.max(
                            0,
                            enemy.hitFlash -
                            dt
                        );


                    const d =
                        distance(
                            enemy,
                            player
                        );


                    if (
                        enemy.type ===
                            "progression" &&
                        !enemy.accepted
                    ) {

                        continue;
                    }


                    if (
                        !enemy.aggressive &&
                        d <=
                            enemy.vision
                    ) {

                        enemy.aggressive =
                            true;

                        enemy.state =
                            "chasing";

                        showToast(
                            `${enemy.name} percebeu você!`
                        );

                        continue;
                    }


                    if (
                        !enemy.aggressive
                    ) {

                        continue;
                    }


                    if (
                        d >
                        enemy.vision *
                            1.9 &&
                        enemy.type !==
                            "hell"
                    ) {

                        enemy.aggressive =
                            false;

                        enemy.state =
                            "idle";

                        continue;
                    }


                    if (
                        d >
                        enemy.attackRange
                    ) {

                        const dx =
                            player.x -
                            enemy.x;


                        const dy =
                            player.y -
                            enemy.y;


                        const length =
                            Math.hypot(
                                dx,
                                dy
                            ) ||
                            1;


                        const vx =
                            dx /
                            length *
                            enemy.speed *
                            dt;


                        const vy =
                            dy /
                            length *
                            enemy.speed *
                            dt;


                        if (
                            canEnemyMoveTo(
                                enemy.x +
                                vx,
                                enemy.y,
                                enemy.radius
                            )
                        ) {

                            enemy.x +=
                                vx;
                        }


                        if (
                            canEnemyMoveTo(
                                enemy.x,
                                enemy.y +
                                vy,
                                enemy.radius
                            )
                        ) {

                            enemy.y +=
                                vy;
                        }

                    }

                    else if (
                        enemy.attackTimer <=
                            0
                    ) {

                        damagePlayer(
                            enemy.damage
                        );

                        enemy.attackTimer =
                            1.1;
                    }
                }
            );
    }


    function canEnemyMoveTo(
        x,
        y,
        radius
    ) {

        if (
            x - radius < 80 ||
            y - radius < 80 ||
            x + radius >
                state.world.width -
                80 ||
            y + radius >
                state.world.height -
                80
        ) {

            return false;
        }


        for (
            const obstacle of
                state.world.obstacles
        ) {

            if (
                obstacle.disabled
            ) {

                continue;
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


    /* =====================================================
       COMBATE
    ====================================================== */

    function damagePlayer(
        amount
    ) {

        const p =
            state.player;


        if (
            !p ||
            p.invincible >
                0
        ) {

            return;
        }


        const armor =
            ITEMS[
                p.equipment.armor
            ]?.defense || 0;


        const damage =
            Math.max(
                1,
                Math.round(
                    amount -
                    (
                        p.defense +
                        armor
                    ) *
                    .35
                )
            );


        p.hp -=
            damage;


        p.invincible =
            .65;


        showToast(
            `Você sofreu ${damage} de dano.`
        );


        if (
            p.hp <=
            0
        ) {

            playerDeath();
        }
    }


    function performAttack() {

        if (
            state.paused ||
            state.dialogue ||
            state.travel ||
            state.battle
        ) {

            return;
        }


        const p =
            state.player;


        if (
            p.attackCooldown >
            0
        ) {

            return;
        }


        const c =
            currentCharacter();


        if (
            p.energy <
            8
        ) {

            showToast(
                "Energia insuficiente."
            );

            return;
        }


        p.energy -=
            8;


        p.attackCooldown =
            .45;


        const target =
            findNearestEnemy(
                c.id ===
                    "kaelion"
                    ? 240
                    : 115
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

                return;
            }


            let damage =
                p.damage;


            if (
                p.equipment.weapon
            ) {

                damage +=
                    ITEMS[
                        p.equipment.weapon
                    ]?.damage ||
                    0;
            }


            if (
                c.id ===
                "grumgar"
            ) {

                damage +=
                    10;
            }


            if (
                c.id ===
                "kaelion"
            ) {

                damage +=
                    5;
            }


            attackEnemy(
                target,
                damage
            );


            return;
        }


        useClassAbility();
    }


    function findNearestEnemy(
        range
    ) {

        let nearest =
            null;

        let nearestDistance =
            Infinity;


        state.world.enemies
            .forEach(
                enemy => {

                    if (
                        enemy.dead
                    ) {

                        return;
                    }


                    const d =
                        distance(
                            enemy,
                            state.player
                        );


                    if (
                        d <
                            range &&
                        d <
                            nearestDistance
                    ) {

                        nearest =
                            enemy;

                        nearestDistance =
                            d;
                    }
                }
            );


        return nearest;
    }


    function attackEnemy(
        enemy,
        damage
    ) {

        enemy.accepted =
            true;

        enemy.aggressive =
            true;

        enemy.state =
            "chasing";


        enemy.hp =
            Math.max(
                0,
                enemy.hp -
                damage
            );


        enemy.hitFlash =
            .18;


        if (
            enemy.hp <=
            0
        ) {

            defeatEnemy(
                enemy
            );
        }
    }


    function useClassAbility() {

        const p =
            state.player;

        const c =
            currentCharacter();


        if (
            c.id ===
            "lirael"
        ) {

            p.hp =
                Math.min(
                    p.maxHp,
                    p.hp + 50
                );

            showToast(
                "Lirael usou Luz Vital."
            );
        }

        else if (
            c.id ===
            "zephyr"
        ) {

            p.speed +=
                20;

            p.damage +=
                5;


            setTimeout(
                () => {

                    if (
                        state.player
                    ) {

                        p.speed -=
                            20;

                        p.damage -=
                            5;
                    }

                },
                6000
            );


            showToast(
                "Zephyr assumiu uma forma adaptativa."
            );
        }

        else {

            showToast(
                `${c.name}: ${getSkillName(c.id)}`
            );
        }
    }


    function getSkillName(
        id
    ) {

        const skills = {

            kaelion:
                "Raio de Memória",

            theron:
                "Golpe do Guardião",

            grumgar:
                "Esmagamento",

            lirael:
                "Luz Vital",

            zephyr:
                "Forma Adaptativa"

        };


        return (
            skills[id] ||
            "Habilidade"
        );
    }


    function defeatEnemy(
        enemy
    ) {

        if (
            enemy.dead
        ) {

            return;
        }


        enemy.dead =
            true;


        enemy.state =
            "dead";


        const xp =
            enemy.type ===
                "progression"
                ? 180
                : enemy.type ===
                    "hell"
                    ? 55
                    : 30;


        state.player.xp +=
            xp;


        state.player.money +=
            enemy.type ===
                "progression"
                ? 80
                : 12;


        state.player.enemiesDefeated++;


        if (
            enemy.hellType !==
            undefined
        ) {

            state.player[
                "hellType_" +
                enemy.hellType
            ] =
                true;
        }


        if (
            enemy.drop
        ) {

            addItem(
                enemy.drop,
                enemy.dropAmount ||
                    1
            );


            state.world.drops.push({

                x:
                    enemy.x,

                y:
                    enemy.y,

                type:
                    enemy.drop,

                amount:
                    enemy.dropAmount ||
                        1,

                life:
                    18
            });
        }


        if (
            enemy.type ===
            "resourceBoss"
        ) {

            enemy.respawnTimer =
                60;
        }


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


                showToast(
                    `Novo caminho descoberto.`
                );
            }
        }


        checkLevelUp();


        saveGame(
            false
        );


        showToast(
            `${enemy.name} derrotado! +${xp} XP`
        );
    }


    function checkLevelUp() {

        const p =
            state.player;


        while (
            p.xp >=
            p.xpToNext
        ) {

            p.xp -=
                p.xpToNext;


            p.level++;


            p.xpToNext =
                Math.floor(
                    p.xpToNext *
                    1.42
                );


            p.maxHp +=
                12;

            p.maxMagic +=
                8;

            p.maxEnergy +=
                8;

            p.hp =
                p.maxHp;

            p.magic =
                p.maxMagic;

            p.energy =
                p.maxEnergy;


            showToast(
                `Você chegou ao nível ${p.level}!`
            );
        }
    }


    /* =====================================================
       COLETA
    ====================================================== */

    function harvestTree(
        tree
    ) {

        if (
            !tree ||
            !tree.alive
        ) {

            return;
        }


        if (
            state.player.magic <
            4
        ) {

            showToast(
                "Magia insuficiente."
            );

            return;
        }


        state.player.magic -=
            4;


        state.player.hunger =
            Math.max(
                0,
                state.player.hunger -
                1
            );


        state.player.fatigue =
            Math.max(
                0,
                state.player.fatigue -
                2
            );


        tree.alive =
            false;


        tree.respawn =
            random(
                12,
                24
            );


        addItem(
            "madeira",
            tree.amount
        );


        state.player.treesCut++;


        state.player.xp +=
            6;


        checkLevelUp();


        showToast(
            `Madeira coletada: x${tree.amount}`
        );
    }


    function collectResource(
        resource
    ) {

        if (
            !resource ||
            !resource.alive
        ) {

            return;
        }


        const costs = {

            ferro: 13,

            rubi: 35,

            cristal: 18,

            carvao: 7,

            ouro: 24

        };


        const cost =
            costs[
                resource.type
            ] || 7;


        if (
            state.player.magic <
            cost
        ) {

            showToast(
                "Magia insuficiente."
            );

            return;
        }


        state.player.magic -=
            cost;


        state.player.hunger =
            Math.max(
                0,
                state.player.hunger -
                1
            );


        state.player.fatigue =
            Math.max(
                0,
                state.player.fatigue -
                2
            );


        resource.alive =
            false;


        resource.respawn =
            random(
                15,
                30
            );


        addItem(
            resource.type,
            resource.amount
        );


        state.player.xp +=
            7;


        state.player.memory =
            Math.min(
                100,
                state.player.memory +
                1
            );


        checkLevelUp();


        showToast(
            `${ITEMS[
                resource.type
            ]?.name || resource.type} coletado: x${resource.amount}`
        );
    }


    function updateResources(
        dt
    ) {

        state.world.trees
            .forEach(
                tree => {

                    if (
                        tree.alive
                    ) {

                        return;
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
            );


        state.world.resources
            .forEach(
                resource => {

                    if (
                        resource.alive
                    ) {

                        return;
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
            );


        state.world.drops
            .forEach(
                drop =>
                    drop.life -=
                    dt
            );


        state.world.drops =
            state.world.drops
                .filter(
                    drop =>
                        drop.life >
                        0
                );
    }


    function respawnTree(
        tree
    ) {

        let tries =
            0;


        let x = tree.x;
        let y = tree.y;


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
            tries < 60 &&
            !canMoveTo(
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


        const obstacle =
            state.world.obstacles
                .find(
                    o =>
                        o.treeId ===
                        tree.id
                );


        if (
            obstacle
        ) {

            obstacle.x =
                x - 30;

            obstacle.y =
                y - 38;
        }
    }


    /* =====================================================
       INVENTÁRIO
    ====================================================== */

    function addItem(
        id,
        amount
    ) {

        if (
            !ITEMS[id]
        ) {

            return;
        }


        if (
            state.player.inventory[
                id
            ] ===
            undefined
        ) {

            state.player.inventory[
                id
            ] = 0;
        }


        state.player.inventory[
            id
        ] +=
            Math.max(
                0,
                amount
            );
    }


    function removeItem(
        id,
        amount
    ) {

        const current =
            state.player.inventory[
                id
            ] || 0;


        if (
            current <
            amount
        ) {

            return false;
        }


        state.player.inventory[
            id
        ] =
            current -
            amount;


        return true;
    }


    function openInventory() {

        updateInventory();


        $("inventoryPanel")
            .classList
            .remove(
                "hidden"
            );
    }


    function updateInventory() {

        const grid =
            $("inventoryGrid");


        grid.innerHTML =
            "";


        Object.entries(
            state.player.inventory
        )
            .forEach(
                ([id, amount]) => {

                    if (
                        amount <= 0
                    ) {

                        return;
                    }


                    const item =
                        ITEMS[id];


                    if (
                        !item
                    ) {

                        return;
                    }


                    if (
                        state.inventoryCategory !==
                            "all" &&
                        item.category !==
                            state.inventoryCategory
                    ) {

                        return;
                    }


                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "inventory-item";


                    div.innerHTML = `

                        <div class="icon">
                            ${item.icon}
                        </div>

                        <div class="name">
                            ${item.name}
                        </div>

                        <div class="count">
                            x${amount}
                        </div>

                    `;


                    div.addEventListener(
                        "click",
                        () =>
                            useItem(
                                id
                            )
                    );


                    grid.appendChild(
                        div
                    );
                }
            );


        if (
            !grid.children.length
        ) {

            grid.innerHTML = `

                <div
                    class="muted"
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:30px
                    "
                >
                    Nenhum item nesta categoria.
                </div>
            `;
        }


        let weight =
            0;


        Object.entries(
            state.player.inventory
        )
            .forEach(
                ([id, amount]) => {

                    weight +=
                        (
                            ITEMS[id]
                                ?.weight ||
                            0
                        ) *
                        amount;
                }
            );


        $("weightText")
            .textContent =
            `${weight}/100`;


        updateEquipment();
    }


    function useItem(
        id
    ) {

        const item =
            ITEMS[id];


        if (
            !item
        ) {

            return;
        }


        if (
            item.heal &&
            removeItem(
                id,
                1
            )
        ) {

            state.player.hp =
                Math.min(
                    state.player.maxHp,
                    state.player.hp +
                    item.heal
                );


            showToast(
                "Poção usada."
            );
        }


        else if (
            item.energy &&
            removeItem(
                id,
                1
            )
        ) {

            state.player.energy =
                Math.min(
                    state.player.maxEnergy,
                    state.player.energy +
                    item.energy
                );


            showToast(
                "Elixir usado."
            );
        }


        else if (
            item.damage
        ) {

            state.player
                .equipment
                .weapon =
                id;


            showToast(
                `${item.name} equipada.`
            );
        }


        else if (
            item.defense
        ) {

            state.player
                .equipment
                .armor =
                id;


            showToast(
                `${item.name} equipada.`
            );
        }


        updateInventory();
        updateHUD();
    }


    function updateEquipment() {

        const grid =
            $("equipmentGrid");


        const weapon =
            ITEMS[
                state.player
                    .equipment
                    .weapon
            ]?.name ||
            "Nenhuma";


        const armor =
            ITEMS[
                state.player
                    .equipment
                    .armor
            ]?.name ||
            "Nenhuma";


        const tool =
            ITEMS[
                state.player
                    .equipment
                    .tool
            ]?.name ||
            "Nenhuma";


        grid.innerHTML = `

            <div class="equipment-slot">

                Arma

                <strong>
                    ${weapon}
                </strong>

            </div>

            <div class="equipment-slot">

                Armadura

                <strong>
                    ${armor}
                </strong>

            </div>

            <div class="equipment-slot">

                Ferramenta

                <strong>
                    ${tool}
                </strong>

            </div>
        `;
    }


    /* =====================================================
       INTERAÇÃO
    ====================================================== */

    function getInteraction() {

        if (
            state.houseMode
        ) {

            return {
                type:
                    "exitHouse"
            };
        }


        const p =
            state.player;


        let best =
            null;

        let bestDistance =
            Infinity;


        state.world.npcs
            .forEach(
                npc => {

                    const d =
                        distance(
                            p,
                            npc
                        );


                    if (
                        d < 70 &&
                        d <
                            bestDistance
                    ) {

                        best = {
                            type:
                                "npc",

                            object:
                                npc
                        };

                        bestDistance =
                            d;
                    }
                }
            );


        state.world.trees
            .forEach(
                tree => {

                    if (
                        !tree.alive
                    ) {

                        return;
                    }


                    const d =
                        distance(
                            p,
                            tree
                        );


                    if (
                        d < 72 &&
                        d <
                            bestDistance
                    ) {

                        best = {
                            type:
                                "tree",

                            object:
                                tree
                        };

                        bestDistance =
                            d;
                    }
                }
            );


        state.world.resources
            .forEach(
                resource => {

                    if (
                        !resource.alive
                    ) {

                        return;
                    }


                    const d =
                        distance(
                            p,
                            resource
                        );


                    if (
                        d < 72 &&
                        d <
                            bestDistance
                    ) {

                        best = {
                            type:
                                "resource",

                            object:
                                resource
                        };

                        bestDistance =
                            d;
                    }
                }
            );


        state.world.enemies
            .forEach(
                enemy => {

                    if (
                        enemy.dead
                    ) {

                        return;
                    }


                    const d =
                        distance(
                            p,
                            enemy
                        );


                    if (
                        d < 105 &&
                        d <
                            bestDistance
                    ) {

                        best = {
                            type:
                                enemy.type ===
                                    "progression"
                                    ? "boss"
                                    : "enemy",

                            object:
                                enemy
                        };

                        bestDistance =
                            d;
                    }
                }
            );


        state.world.buildings
            .forEach(
                building => {

                    const doorX =
                        building.x +
                        building.w /
                            2;


                    const doorY =
                        building.y +
                        building.h +
                        20;


                    const d =
                        Math.hypot(
                            p.x -
                                doorX,
                            p.y -
                                doorY
                        );


                    if (
                        d < 88 &&
                        d <
                            bestDistance
                    ) {

                        best = {
                            type:
                                "house",

                            object:
                                building
                        };

                        bestDistance =
                            d;
                    }
                }
            );


        return best;
    }


    function playerAction() {

        if (
            state.dialogue
        ) {

            advanceDialogue();

            return;
        }


        if (
            state.paused
        ) {

            return;
        }


        const action =
            getInteraction();


        if (
            action
        ) {

            if (
                action.type ===
                "npc"
            ) {

                if (
                    action.object
                        .merchant
                ) {

                    openShop(
                        action.object
                    );

                    return;
                }


                if (
                    action.object
                        .questId
                ) {

                    openQuest(
                        action.object
                    );

                    return;
                }


                startDialogue(
                    action.object
                );

                return;
            }


            if (
                action.type ===
                "tree"
            ) {

                harvestTree(
                    action.object
                );

                return;
            }


            if (
                action.type ===
                "resource"
            ) {

                collectResource(
                    action.object
                );

                return;
            }


            if (
                action.type ===
                "boss"
            ) {

                if (
                    !action.object.accepted
                ) {

                    openBattle(
                        action.object
                    );

                    return;
                }
            }


            if (
                action.type ===
                "enemy" ||
                action.type ===
                "boss"
            ) {

                performAttack();

                return;
            }


            return;
        }


        performAttack();
    }


    function handleZ() {

        if (
            state.dialogue
        ) {

            advanceDialogue();

            return;
        }


        if (
            state.paused
        ) {

            return;
        }


        if (
            state.houseMode
        ) {

            exitHouse();

            return;
        }


        enterHouse();
    }


    /* =====================================================
       CASAS
    ====================================================== */

    function enterHouse() {

        if (
            state.area !==
            "village"
        ) {

            return;
        }


        let closest =
            null;

        let best =
            Infinity;


        state.world.buildings
            .forEach(
                building => {

                    const doorX =
                        building.x +
                        building.w /
                            2;


                    const doorY =
                        building.y +
                        building.h +
                        20;


                    const d =
                        Math.hypot(
                            state.player.x -
                                doorX,
                            state.player.y -
                                doorY
                        );


                    if (
                        d < 90 &&
                        d <
                            best
                    ) {

                        best =
                            d;

                        closest =
                            building;
                    }
                }
            );


        if (
            !closest
        ) {

            showToast(
                "Aproxime-se da porta."
            );

            return;
        }


        state.currentHouse =
            closest;


        state.houseMode =
            true;


        state.player.x =
            380;


        state.player.y =
            270;


        showToast(
            `Você entrou em ${closest.name}.`
        );
    }


    function exitHouse() {

        const building =
            state.currentHouse;


        if (
            !building
        ) {

            state.houseMode =
                false;

            return;
        }


        state.houseMode =
            false;


        state.player.x =
            building.x +
            building.w /
                2;


        state.player.y =
            building.y +
            building.h +
            60;


        state.currentHouse =
            null;


        showToast(
            "Você saiu da casa."
        );
    }


    /* =====================================================
       DIÁLOGOS
    ====================================================== */

    function startDialogue(
        npc
    ) {

        state.dialogue = {

            npc,

            lines:
                npc.lines.slice(),

            index:
                0,

            typing:
                false,

            charIndex:
                0,

            timer:
                null

        };


        $("dialogueBox")
            .classList
            .remove(
                "hidden"
            );


        typeDialogue();
    }


    function typeDialogue() {

        const dialogue =
            state.dialogue;


        if (
            !dialogue
        ) {

            return;
        }


        clearInterval(
            dialogue.timer
        );


        const line =
            dialogue.lines[
                dialogue.index
            ];


        dialogue.charIndex =
            0;


        dialogue.typing =
            true;


        $("dialogueSpeaker")
            .textContent =
            dialogue.npc.name;


        $("dialogueText")
            .textContent =
            "";


        dialogue.timer =
            setInterval(
                () => {

                    dialogue.charIndex++;


                    $("dialogueText")
                        .textContent =
                        line.slice(
                            0,
                            dialogue.charIndex
                        );


                    if (
                        dialogue.charIndex >=
                        line.length
                    ) {

                        clearInterval(
                            dialogue.timer
                        );


                        dialogue.typing =
                            false;
                    }

                },
                16
            );
    }


    function advanceDialogue() {

        const dialogue =
            state.dialogue;


        if (
            !dialogue
        ) {

            return;
        }


        if (
            dialogue.typing
        ) {

            clearInterval(
                dialogue.timer
            );


            $("dialogueText")
                .textContent =
                dialogue.lines[
                    dialogue.index
                ];


            dialogue.typing =
                false;


            return;
        }


        dialogue.index++;


        if (
            dialogue.index >=
            dialogue.lines.length
        ) {

            closeDialogue();

            return;
        }


        typeDialogue();
    }


    function closeDialogue() {

        if (
            state.dialogue?.timer
        ) {

            clearInterval(
                state.dialogue.timer
            );
        }


        state.dialogue =
            null;


        $("dialogueBox")
            .classList
            .add(
                "hidden"
            );
    }


    /* =====================================================
       MISSÕES
    ====================================================== */

    function openQuest(
        npc
    ) {

        state.questNPC =
            npc;


        const quest =
            state.player.quest[
                npc.questId
            ];


        const wood =
            npc.questId ===
            "wood";


        const item =
            wood
                ? "madeira"
                : "carvao";


        const current =
            state.player.inventory[
                item
            ] || 0;


        $("questTitle")
            .textContent =
            wood
                ? "Madeira para a vila"
                : "Carvão para a forja";


        $("questText")
            .textContent =
            wood
                ? "Ajude a vila coletando madeira."
                : "Ajude o ferreiro coletando carvão.";


        $("questStatus")
            .textContent =
            `Progresso: ${Math.min(
                current,
                quest.need
            )}/${quest.need}`;


        $("questAction")
            .textContent =
            quest.state ===
                "none"
                ? "ACEITAR"
                : quest.state ===
                    "accepted"
                    ? "ENTREGAR"
                    : "CONCLUÍDA";


        $("questAction")
            .disabled =
            quest.state ===
            "completed";


        $("questPanel")
            .classList
            .remove(
                "hidden"
            );
    }


    function questAction() {

        const npc =
            state.questNPC;


        if (
            !npc
        ) {

            return;
        }


        const quest =
            state.player.quest[
                npc.questId
            ];


        const item =
            npc.questId ===
                "wood"
                ? "madeira"
                : "carvao";


        if (
            quest.state ===
            "none"
        ) {

            quest.state =
                "accepted";


            showToast(
                "Missão aceita."
            );


            openQuest(
                npc
            );


            return;
        }


        if (
            quest.state ===
                "accepted" &&
            (
                state.player.inventory[
                    item
                ] || 0
            ) >=
                quest.need
        ) {

            removeItem(
                item,
                quest.need
            );


            quest.state =
                "completed";


            state.player.xp +=
                quest.rewardXP;


            state.player.money +=
                quest.rewardMoney;


            checkLevelUp();


            showToast(
                "Missão concluída!"
            );


            openQuest(
                npc
            );
        }
    }


    /* =====================================================
       BATALHA ESPECIAL
    ====================================================== */

    function openBattle(
        enemy
    ) {

        state.battle =
            enemy;


        state.paused =
            true;


        $("battleIcon")
            .textContent =
            enemy.icon;


        $("battleTitle")
            .textContent =
            enemy.name;


        $("battleText")
            .textContent =
            "Essa criatura guarda o caminho. Você aceita enfrentá-la?";


        $("battlePanel")
            .classList
            .remove(
                "hidden"
            );
    }


    function acceptBattle() {

        if (
            !state.battle
        ) {

            return;
        }


        state.battle.accepted =
            true;


        state.battle.aggressive =
            true;


        state.battle.state =
            "chasing";


        state.battle =
            null;


        state.paused =
            false;


        $("battlePanel")
            .classList
            .add(
                "hidden"
            );


        showToast(
            "A batalha começou."
        );
    }


    function declineBattle() {

        state.battle =
            null;


        state.paused =
            false;


        $("battlePanel")
            .classList
            .add(
                "hidden"
            );
    }


    /* =====================================================
       PORTAIS
    ====================================================== */

    function checkPortals() {

        if (
            state.paused ||
            state.houseMode ||
            state.portalCooldown >
                0
        ) {

            return;
        }


        for (
            const portal of
                state.world.portals
        ) {

            const inside =

                state.player.x >
                    portal.x &&

                state.player.x <
                    portal.x +
                    portal.w &&

                state.player.y >
                    portal.y &&

                state.player.y <
                    portal.y +
                    portal.h;


            if (
                !inside
            ) {

                continue;
            }


            const unlocked =
                portal.requirement
                    ? portal.requirement()
                    : true;


            if (
                !unlocked
            ) {

                showToast(
                    "Esse caminho ainda está bloqueado."
                );


                state.portalCooldown =
                    1.2;


                return;
            }


            openTravel(
                portal
            );


            return;
        }
    }


    function openTravel(
        portal
    ) {

        state.travel =
            portal;


        state.paused =
            true;


        $("travelText")
            .textContent =
            `Você encontrou um caminho para ${portal.title}.`;


        $("travelPanel")
            .classList
            .remove(
                "hidden"
            );
    }


    function confirmTravel() {

        const portal =
            state.travel;


        if (
            !portal
        ) {

            return;
        }


        state.travel =
            null;


        $("travelPanel")
            .classList
            .add(
                "hidden"
            );


        transitionTo(
            portal.target
        );
    }


    function cancelTravel() {

        state.travel =
            null;


        state.paused =
            false;


        state.portalCooldown =
            1.2;


        $("travelPanel")
            .classList
            .add(
                "hidden"
            );
    }


    function transitionTo(
        target
    ) {

        $("transitionScreen")
            .classList
            .remove(
                "hidden"
            );


        $("transitionMessage")
            .textContent =
            REGIONS[
                target
            ].name;


        state.paused =
            true;


        setTimeout(
            () => {

                state.area =
                    target;


                buildWorld();


                const checkpoint =
                    state.player
                        .checkpoints[
                            target
                        ];


                state.player.x =
                    checkpoint
                        ?.x ||
                    120;


                state.player.y =
                    checkpoint
                        ?.y ||
                    state.world.height /
                        2;


                if (
                    !state.player
                        .unlockedAreas
                        .includes(
                            target
                        )
                ) {

                    state.player
                        .unlockedAreas
                        .push(
                            target
                        );
                }


                state.player.checkpoint =
                    target;


                state.paused =
                    false;


                $("transitionScreen")
                    .classList
                    .add(
                        "hidden"
                    );


                showToast(
                    `Você chegou a ${REGIONS[target].name}.`
                );


                saveGame(
                    false
                );

            },
            650
        );
    }


    /* =====================================================
       MAPA
    ====================================================== */

    function openMap() {

        if (
            !state.player.mapOwned
        ) {

            showToast(
                "Você ainda não possui um mapa."
            );


            return;
        }


        drawMap();


        $("mapPanel")
            .classList
            .remove(
                "hidden"
            );
    }


    function drawMap() {

        mapCtx.clearRect(
            0,
            0,
            mapCanvas.width,
            mapCanvas.height
        );


        mapCtx.fillStyle =
            "#18221a";


        mapCtx.fillRect(
            0,
            0,
            mapCanvas.width,
            mapCanvas.height
        );


        const sx =
            mapCanvas.width /
            state.world.width;


        const sy =
            mapCanvas.height /
            state.world.height;


        mapCtx.fillStyle =
            "#89694e";


        state.world.buildings
            .forEach(
                building => {

                    mapCtx.fillRect(
                        building.x *
                            sx,
                        building.y *
                            sy,
                        building.w *
                            sx,
                        building.h *
                            sy
                    );
                }
            );


        mapCtx.fillStyle =
            "#4d91b4";


        state.world.portals
            .forEach(
                portal => {

                    mapCtx.fillRect(
                        portal.x *
                            sx,
                        portal.y *
                            sy,
                        portal.w *
                            sx,
                        portal.h *
                            sy
                    );
                }
            );


        state.world.enemies
            .forEach(
                enemy => {

                    if (
                        enemy.dead
                    ) {

                        return;
                    }


                    mapCtx.fillStyle =
                        enemy.type ===
                            "progression"
                            ? "#e84f4c"
                            : "#d18562";


                    mapCtx.beginPath();


                    mapCtx.arc(
                        enemy.x *
                            sx,
                        enemy.y *
                            sy,
                        enemy.type ===
                            "progression"
                            ? 7
                            : 4,
                        0,
                        Math.PI *
                            2
                    );


                    mapCtx.fill();
                }
            );


        mapCtx.fillStyle =
            "#e1c37d";


        state.world.npcs
            .forEach(
                npc => {

                    mapCtx.fillRect(
                        npc.x *
                            sx -
                            2,
                        npc.y *
                            sy -
                            2,
                        4,
                        4
                    );
                }
            );


        mapCtx.fillStyle =
            "#ffffff";


        mapCtx.beginPath();


        mapCtx.arc(
            state.player.x *
                sx,
            state.player.y *
                sy,
            7,
            0,
            Math.PI *
                2
        );


        mapCtx.fill();
    }


    function drawMinimap() {

        miniCtx.clearRect(
            0,
            0,
            miniCanvas.width,
            miniCanvas.height
        );


        miniCtx.fillStyle =
            "#1a241b";


        miniCtx.fillRect(
            0,
            0,
            190,
            135
        );


        const sx =
            190 /
            state.world.width;


        const sy =
            135 /
            state.world.height;


        miniCtx.fillStyle =
            "#85664d";


        state.world.buildings
            .forEach(
                building => {

                    miniCtx.fillRect(
                        building.x *
                            sx,
                        building.y *
                            sy,
                        building.w *
                            sx,
                        building.h *
                            sy
                    );
                }
            );


        state.world.enemies
            .forEach(
                enemy => {

                    if (
                        enemy.dead
                    ) {

                        return;
                    }


                    miniCtx.fillStyle =
                        enemy.type ===
                            "progression"
                            ? "#ee504c"
                            : "#d48765";


                    miniCtx.beginPath();


                    miniCtx.arc(
                        enemy.x *
                            sx,
                        enemy.y *
                            sy,
                        enemy.type ===
                            "progression"
                            ? 4
                            : 2.5,
                        0,
                        Math.PI *
                            2
                    );


                    miniCtx.fill();
                }
            );


        miniCtx.fillStyle =
            "#dfc37d";


        state.world.npcs
            .forEach(
                npc => {

                    miniCtx.fillRect(
                        npc.x *
                            sx -
                            2,
                        npc.y *
                            sy -
                            2,
                        4,
                        4
                    );
                }
            );


        miniCtx.fillStyle =
            "#fff";


        miniCtx.beginPath();


        miniCtx.arc(
            state.player.x *
                sx,
            state.player.y *
                sy,
            4,
            0,
            Math.PI *
                2
        );


        miniCtx.fill();
    }


    /* =====================================================
       LIVRO
    ====================================================== */

    function openBook() {

        renderBook();


        $("bookPanel")
            .classList
            .remove(
                "hidden"
            );
    }


    function renderBook() {

        const grid =
            $("bossBook");


        grid.innerHTML =
            "";


        const known =
            state.player
                .defeatedBosses;


        state.world.enemies
            .filter(
                enemy =>
                    enemy.type ===
                    "progression"
            )
            .forEach(
                enemy => {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "boss-entry";


                    const defeated =
                        known.includes(
                            enemy.id
                        );


                    div.innerHTML = `

                        <div class="symbol">
                            ${
                                defeated
                                    ? enemy.icon
                                    : "?"
                            }
                        </div>

                        <strong>
                            ${
                                defeated
                                    ? enemy.name
                                    : "DESCONHECIDO"
                            }
                        </strong>

                        <p>
                            ${
                                defeated
                                    ? "Registro desbloqueado."
                                    : "Descubra mais para atualizar o Livro."
                            }
                        </p>
                    `;


                    grid.appendChild(
                        div
                    );
                }
            );
    }


    /* =====================================================
       LOJA
    ====================================================== */

    function openShop(
        npc
    ) {

        state.shopNPC =
            npc;


        renderShop();


        $("shopPanel")
            .classList
            .remove(
                "hidden"
            );
    }


    function renderShop() {

        const grid =
            $("shopGrid");


        grid.innerHTML =
            "";


        if (
            state.shopMode ===
            "buy"
        ) {

            [
                "pocao",
                "elixir",
                "espadaFerro",
                "armaduraCouro"
            ]
                .forEach(
                    id => {

                        const item =
                            ITEMS[id];


                        const row =
                            document.createElement(
                                "div"
                            );


                        row.className =
                            "shop-row";


                        row.innerHTML = `

                            <div class="shop-icon">
                                ${item.icon}
                            </div>

                            <div class="shop-info">
                                <strong>
                                    ${item.name}
                                </strong>

                                <small>
                                    Item útil para sua jornada.
                                </small>
                            </div>

                            <div class="shop-price">
                                💰 ${item.value}
                            </div>

                            <button class="small-btn">
                                Comprar
                            </button>
                        `;


                        row
                            .querySelector(
                                "button"
                            )
                            .addEventListener(
                                "click",
                                () => {

                                    if (
                                        state.player.money <
                                        item.value
                                    ) {

                                        showToast(
                                            "Dinheiro insuficiente."
                                        );

                                        return;
                                    }


                                    state.player
                                        .money -=
                                        item.value;


                                    addItem(
                                        id,
                                        1
                                    );


                                    showToast(
                                        `${item.name} comprado.`
                                    );


                                    renderShop();

                                    updateHUD();
                                }
                            );


                        grid.appendChild(
                            row
                        );
                    }
                );

        }

        else {

            Object.entries(
                state.player.inventory
            )
                .forEach(
                    ([id, amount]) => {

                        if (
                            amount <=
                            0
                        ) {

                            return;
                        }


                        const item =
                            ITEMS[id];


                        if (
                            !item
                        ) {

                            return;
                        }


                        const price =
                            Math.max(
                                1,
                                Math.floor(
                                    item.value *
                                    .7
                                )
                            );


                        const row =
                            document.createElement(
                                "div"
                            );


                        row.className =
                            "shop-row";


                        row.innerHTML = `

                            <div class="shop-icon">
                                ${item.icon}
                            </div>

                            <div class="shop-info">
                                <strong>
                                    ${item.name}
                                </strong>

                                <small>
                                    x${amount}
                                </small>
                            </div>

                            <div class="shop-price">
                                💰 ${price}
                            </div>

                            <button class="small-btn">
                                Vender
                            </button>
                        `;


                        row
                            .querySelector(
                                "button"
                            )
                            .addEventListener(
                                "click",
                                () => {

                                    if (
                                        removeItem(
                                            id,
                                            1
                                        )
                                    ) {

                                        state.player
                                            .money +=
                                            price;

                                        showToast(
                                            `${item.name} vendido.`
                                        );


                                        renderShop();
                                        updateHUD();
                                    }
                                }
                            );


                        grid.appendChild(
                            row
                        );
                    }
                );
        }
    }


    /* =====================================================
       HUD
    ====================================================== */

    function updateHUD() {

        const p =
            state.player;


        if (
            !p
        ) {

            return;
        }


        $("hudAvatar")
            .textContent =
            p.icon;


        $("hudName")
            .textContent =
            p.name;


        $("hudClass")
            .textContent =
            p.className;


        setBar(
            "hpBar",
            p.hp,
            p.maxHp
        );


        setBar(
            "magicBar",
            p.magic,
            p.maxMagic
        );


        setBar(
            "energyBar",
            p.energy,
            p.maxEnergy
        );


        setBar(
            "hungerBar",
            p.hunger,
            100
        );


        setBar(
            "fatigueBar",
            p.fatigue,
            100
        );


        $("hpText")
            .textContent =
            `${Math.ceil(
                p.hp
            )}/${p.maxHp}`;


        $("magicText")
            .textContent =
            `${Math.ceil(
                p.magic
            )}/${Math.ceil(
                p.maxMagic
            )}`;


        $("energyText")
            .textContent =
            `${Math.ceil(
                p.energy
            )}/${p.maxEnergy}`;


        $("hungerText")
            .textContent =
            `${Math.ceil(
                p.hunger
            )}/100`;


        $("fatigueText")
            .textContent =
            `${Math.ceil(
                p.fatigue
            )}/100`;


        $("levelText")
            .textContent =
            p.level;


        $("xpText")
            .textContent =
            `${p.xp}/${p.xpToNext}`;


        $("moneyText")
            .textContent =
            p.money;


        updateInteractionHint();
    }


    function setBar(
        id,
        value,
        max
    ) {

        $(id)
            .style
            .width =
            `${clamp(
                value / max *
                100,
                0,
                100
            )}%`;
    }


    function updateLocation() {

        $("locationLabel")
            .textContent =
            REGIONS[
                state.area
            ].name;
    }


    function updateInteractionHint() {

        const hint =
            $("interactionHint");


        if (
            state.paused ||
            state.dialogue
        ) {

            hint.classList.add(
                "hidden"
            );

            return;
        }


        const interaction =
            getInteraction();


        if (
            !interaction
        ) {

            hint.classList.add(
                "hidden"
            );

            return;
        }


        hint.classList.remove(
            "hidden"
        );


        if (
            interaction.type ===
                "house"
        ) {

            $("interactionKey")
                .textContent =
                "Z";


            $("interactionText")
                .textContent =
                "Entrar";


            return;
        }


        if (
            interaction.type ===
                "exitHouse"
        ) {

            $("interactionKey")
                .textContent =
                "Z";


            $("interactionText")
                .textContent =
                "Sair";


            return;
        }


        $("interactionKey")
            .textContent =
            "E";


        const labels = {

            npc:
                interaction.object
                    .merchant
                    ? "Abrir loja"
                    : interaction.object
                        .questId
                        ? "Ver missão"
                        : "Conversar",

            tree:
                "Cortar árvore",

            resource:
                "Coletar",

            boss:
                "Aceitar batalha",

            enemy:
                "Atacar"

        };


        $("interactionText")
            .textContent =
            labels[
                interaction.type
            ] ||
            "Interagir";
    }


    /* =====================================================
       MORTE / CHECKPOINT
    ====================================================== */

    function playerDeath() {

        state.player.dead =
            true;


        state.paused =
            true;


        $("deathPanel")
            .classList
            .remove(
                "hidden"
            );
    }


    function respawnPlayer() {

        const p =
            state.player;


        const checkpoint =
            p.checkpoints[
                state.area
            ] ||
            p.checkpoints.village;


        p.x =
            checkpoint.x;


        p.y =
            checkpoint.y;


        p.hp =
            Math.max(
                1,
                Math.floor(
                    p.maxHp *
                    .7
                )
            );


        p.magic =
            Math.max(
                1,
                Math.floor(
                    p.maxMagic *
                    .7
                )
            );


        p.energy =
            Math.max(
                1,
                Math.floor(
                    p.maxEnergy *
                    .7
                )
            );


        p.money =
            Math.floor(
                p.money *
                .9
            );


        p.dead =
            false;


        p.invincible =
            1;


        state.paused =
            false;


        $("deathPanel")
            .classList
            .add(
                "hidden"
            );


        showToast(
            "Você retornou ao checkpoint."
        );
    }


    /* =====================================================
       DESENHO
    ====================================================== */

    function drawGround() {

        const visual =
            REGIONS[
                state.area
            ].visual;


        const colors = {

            village:
                "#566c4d",

            forest:
                "#3d6140",

            mountains:
                "#919799",

            cave:
                "#292e31",

            ruby:
                "#48252b",

            shadow:
                "#171d2e",

            fairy:
                "#56436b",

            sky:
                "#92b0c7",

            hell:
                "#45201f"
        };


        ctx.fillStyle =
            colors[
                visual
            ] ||
            "#566c4d";


        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );


        const tile =
            64;


        for (
            let y = 70;
            y <
            state.world.height -
                70;
            y += tile
        ) {

            for (
                let x = 70;
                x <
                state.world.width -
                    70;
                x += tile
            ) {

                ctx.fillStyle =
                    (
                        (
                            x / tile +
                            y / tile
                        ) %
                        2 === 0
                    )
                        ? "rgba(255,255,255,.015)"
                        : "rgba(0,0,0,.018)";


                ctx.fillRect(
                    x,
                    y,
                    tile,
                    tile
                );
            }
        }


        if (
            state.area ===
            "village"
        ) {

            ctx.fillStyle =
                "#b69c6d";


            ctx.globalAlpha =
                .65;


            ctx.fillRect(
                70,
                1080,
                state.world.width -
                    140,
                115
            );


            ctx.fillRect(
                1540,
                70,
                110,
                state.world.height -
                    140
            );


            ctx.globalAlpha =
                1;
        }
    }


    function drawBuildings() {

        if (
            state.houseMode &&
            state.currentHouse
        ) {

            drawHouseInterior();

            return;
        }


        state.world.buildings
            .forEach(
                building => {

                    ctx.fillStyle =
                        "rgba(0,0,0,.28)";


                    ctx.fillRect(
                        building.x + 13,
                        building.y + 16,
                        building.w,
                        building.h
                    );


                    ctx.fillStyle =
                        building.color;


                    ctx.fillRect(
                        building.x,
                        building.y,
                        building.w,
                        building.h
                    );


                    ctx.strokeStyle =
                        "rgba(30,25,20,.45)";


                    ctx.lineWidth =
                        4;


                    ctx.strokeRect(
                        building.x + 3,
                        building.y + 3,
                        building.w - 6,
                        building.h - 6
                    );


                    ctx.fillStyle =
                        building.roof;


                    ctx.beginPath();


                    ctx.moveTo(
                        building.x - 24,
                        building.y
                    );


                    ctx.lineTo(
                        building.x +
                            building.w /
                                2,
                        building.y - 95
                    );


                    ctx.lineTo(
                        building.x +
                            building.w +
                            24,
                        building.y
                    );


                    ctx.closePath();


                    ctx.fill();


                    ctx.fillStyle =
                        "#452d25";


                    ctx.fillRect(
                        building.x +
                            building.w /
                                2 -
                            25,
                        building.y +
                            building.h -
                            70,
                        50,
                        70
                    );


                    ctx.fillStyle =
                        "#dbc77d";


                    ctx.fillRect(
                        building.x + 35,
                        building.y + 60,
                        50,
                        42
                    );


                    ctx.fillRect(
                        building.x +
                            building.w -
                            85,
                        building.y + 60,
                        50,
                        42
                    );


                    ctx.font =
                        "bold 12px Georgia";


                    ctx.textAlign =
                        "center";


                    ctx.fillStyle =
                        "#f1e0ba";


                    ctx.fillText(
                        building.name,
                        building.x +
                            building.w /
                                2,
                        building.y +
                            building.h +
                            27
                    );
                }
            );
    }


    function drawHouseInterior() {

        const building =
            state.currentHouse;


        ctx.fillStyle =
            "#6f503b";


        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );


        const roomW =
            Math.max(
                300,
                building.w -
                    80
            );


        const roomH =
            Math.max(
                190,
                building.h -
                    100
            );


        ctx.fillStyle =
            "#9b7855";


        ctx.fillRect(
            180,
            140,
            roomW,
            roomH
        );


        ctx.strokeStyle =
            "#d2b477";


        ctx.lineWidth =
            5;


        ctx.strokeRect(
            180,
            140,
            roomW,
            roomH
        );


        ctx.fillStyle =
            "#4e3024";


        ctx.fillRect(
            320,
            270,
            180,
            75
        );


        ctx.fillStyle =
            "#8c6d4f";


        ctx.fillRect(
            650,
            245,
            85,
            110
        );


        ctx.fillStyle =
            "#edddb9";


        ctx.font =
            "bold 18px Georgia";


        ctx.textAlign =
            "center";


        ctx.fillText(
            building.name,
            180 +
                roomW /
                    2,
            115
        );
    }


    function drawTrees() {

        state.world.trees
            .forEach(
                tree => {

                    if (
                        !tree.alive
                    ) {

                        return;
                    }


                    const sway =
                        Math.sin(
                            state.time *
                                1.7 +
                            tree.x
                        ) *
                        2;


                    ctx.fillStyle =
                        "rgba(0,0,0,.22)";


                    ctx.beginPath();


                    ctx.ellipse(
                        tree.x,
                        tree.y + 28,
                        34,
                        11,
                        0,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();


                    ctx.fillStyle =
                        "#684a30";


                    ctx.fillRect(
                        tree.x - 9,
                        tree.y,
                        18,
                        42
                    );


                    ctx.fillStyle =
                        "#305c36";


                    ctx.beginPath();


                    ctx.arc(
                        tree.x +
                            sway,
                        tree.y - 14,
                        34,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();


                    ctx.fillStyle =
                        "#447a45";


                    ctx.beginPath();


                    ctx.arc(
                        tree.x -
                            14 +
                            sway,
                        tree.y - 27,
                        24,
                        0,
                        Math.PI * 2
                    );


                    ctx.arc(
                        tree.x +
                            14 +
                            sway,
                        tree.y - 27,
                        25,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();


                    if (
                        distance(
                            tree,
                            state.player
                        ) <
                        85
                    ) {

                        ctx.strokeStyle =
                            "#d8bc73";


                        ctx.lineWidth =
                            2;


                        ctx.beginPath();


                        ctx.arc(
                            tree.x,
                            tree.y - 10,
                            40,
                            0,
                            Math.PI * 2
                        );


                        ctx.stroke();
                    }
                }
            );
    }


    function drawResources() {

        const icons = {

            ferro: "⛓️",

            rubi: "♦",

            cristal: "💎",

            ouro: "🪙",

            carvao: "⬛"

        };


        state.world.resources
            .forEach(
                resource => {

                    if (
                        !resource.alive
                    ) {

                        return;
                    }


                    ctx.font =
                        "20px Arial";


                    ctx.textAlign =
                        "center";


                    ctx.fillText(
                        icons[
                            resource.type
                        ] ||
                        "✦",
                        resource.x,
                        resource.y
                    );
                }
            );
    }


    function drawObstacles() {

        state.world.obstacles
            .forEach(
                obstacle => {

                    if (
                        obstacle.disabled ||
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
                            "#444b47";


                        ctx.fillRect(
                            obstacle.x,
                            obstacle.y,
                            obstacle.w,
                            obstacle.h
                        );


                        return;
                    }


                    const colors = {

                        rock:
                            "#737771",

                        snowrock:
                            "#bec5c7",

                        ironrock:
                            "#666c6f",

                        rubyrock:
                            "#73384b",

                        fountain:
                            "#88867b"
                    };


                    if (
                        obstacle.type ===
                        "fountain"
                    ) {

                        ctx.fillStyle =
                            "#89877c";


                        ctx.beginPath();


                        ctx.ellipse(
                            obstacle.x +
                                obstacle.w /
                                    2,
                            obstacle.y +
                                obstacle.h /
                                    2,
                            obstacle.w /
                                2,
                            obstacle.h /
                                2,
                            0,
                            0,
                            Math.PI * 2
                        );


                        ctx.fill();


                        ctx.fillStyle =
                            "#5b98aa";


                        ctx.beginPath();


                        ctx.ellipse(
                            obstacle.x +
                                obstacle.w /
                                    2,
                            obstacle.y +
                                obstacle.h /
                                    2,
                            obstacle.w /
                                2 -
                                22,
                            obstacle.h /
                                2 -
                                22,
                            0,
                            0,
                            Math.PI * 2
                        );


                        ctx.fill();


                        return;
                    }


                    ctx.fillStyle =
                        colors[
                            obstacle.type
                        ] ||
                        "#737771";


                    ctx.beginPath();


                    ctx.ellipse(
                        obstacle.x +
                            obstacle.w /
                                2,
                        obstacle.y +
                            obstacle.h /
                                2,
                        obstacle.w /
                            2,
                        obstacle.h /
                            2,
                        -.12,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();
                }
            );
    }


    function drawNPCs() {

        state.world.npcs
            .forEach(
                npc => {

                    ctx.fillStyle =
                        "rgba(0,0,0,.23)";


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
                        17,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();


                    ctx.fillStyle =
                        "#28272b";


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
                        "#f0dfb8";


                    ctx.fillText(
                        npc.name,
                        npc.x,
                        npc.y - 30
                    );


                    ctx.font =
                        "10px Arial";


                    ctx.fillStyle =
                        "#cac3b0";


                    ctx.fillText(
                        npc.role,
                        npc.x,
                        npc.y + 36
                    );
                }
            );
    }


    function drawEnemies() {

        state.world.enemies
            .forEach(
                enemy => {

                    if (
                        enemy.dead
                    ) {

                        return;
                    }


                    if (
                        enemy.aggressive
                    ) {

                        ctx.strokeStyle =
                            "rgba(220,60,55,.11)";


                        ctx.lineWidth =
                            2;


                        ctx.beginPath();


                        ctx.arc(
                            enemy.x,
                            enemy.y,
                            enemy.vision,
                            0,
                            Math.PI * 2
                        );


                        ctx.stroke();
                    }


                    ctx.fillStyle =
                        "rgba(0,0,0,.3)";


                    ctx.beginPath();


                    ctx.ellipse(
                        enemy.x,
                        enemy.y +
                            enemy.radius,
                        enemy.radius *
                            1.1,
                        enemy.radius *
                            .42,
                        0,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();


                    ctx.fillStyle =
                        enemy.hitFlash >
                            0
                            ? "#fff"
                            : enemy.color;


                    ctx.beginPath();


                    if (
                        enemy.type ===
                            "progression"
                    ) {

                        ctx.moveTo(
                            enemy.x,
                            enemy.y -
                                enemy.radius
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

                    }

                    else {

                        ctx.arc(
                            enemy.x,
                            enemy.y,
                            enemy.radius,
                            0,
                            Math.PI * 2
                        );
                    }


                    ctx.fill();


                    ctx.strokeStyle =
                        enemy.type ===
                            "progression"
                            ? "#e0ae63"
                            : "#d0bd78";


                    ctx.lineWidth =
                        enemy.type ===
                            "progression"
                            ? 3
                            : 1.5;


                    ctx.stroke();


                    ctx.font =
                        enemy.type ===
                            "progression"
                            ? "24px Arial"
                            : "19px Arial";


                    ctx.textAlign =
                        "center";


                    ctx.fillText(
                        enemy.icon,
                        enemy.x,
                        enemy.y + 7
                    );


                    ctx.font =
                        "bold 11px Arial";


                    ctx.fillStyle =
                        enemy.type ===
                            "progression"
                            ? "#ffcc8a"
                            : "#ede2c2";


                    ctx.fillText(
                        enemy.name,
                        enemy.x,
                        enemy.y +
                            enemy.radius +
                            17
                    );


                    const barWidth =
                        enemy.radius *
                        2.5;


                    ctx.fillStyle =
                        "#211f1d";


                    ctx.fillRect(
                        enemy.x -
                            barWidth /
                                2,
                        enemy.y -
                            enemy.radius -
                            13,
                        barWidth,
                        5
                    );


                    ctx.fillStyle =
                        "#b84e48";


                    ctx.fillRect(
                        enemy.x -
                            barWidth /
                                2,
                        enemy.y -
                            enemy.radius -
                            13,
                        barWidth *
                            clamp(
                                enemy.hp /
                                    enemy.maxHp,
                                0,
                                1
                            ),
                        5
                    );
                }
            );
    }


    function drawPortals() {

        state.world.portals
            .forEach(
                portal => {

                    const unlocked =
                        portal.requirement
                            ? portal.requirement()
                            : true;


                    ctx.fillStyle =
                        unlocked
                            ? "rgba(76,150,198,.20)"
                            : "rgba(80,80,80,.15)";


                    ctx.fillRect(
                        portal.x,
                        portal.y,
                        portal.w,
                        portal.h
                    );


                    ctx.strokeStyle =
                        unlocked
                            ? "#8fbcd0"
                            : "#686963";


                    ctx.lineWidth =
                        2;


                    ctx.strokeRect(
                        portal.x,
                        portal.y,
                        portal.w,
                        portal.h
                    );


                    ctx.textAlign =
                        "center";


                    ctx.font =
                        "bold 12px Georgia";


                    ctx.fillStyle =
                        unlocked
                            ? "#e3d19f"
                            : "#94948b";


                    ctx.fillText(
                        unlocked
                            ? "CONTINUAR"
                            : "BLOQUEADO",
                        portal.x +
                            portal.w /
                                2,
                        portal.y -
                            10
                    );
                }
            );
    }


    function drawDrops() {

        const icons = {

            madeira:
                "🪵",

            carvao:
                "⬛",

            ferro:
                "⛓️",

            ouro:
                "🪙",

            rubi:
                "♦",

            cristal:
                "💎",

            essencia:
                "✦"

        };


        state.world.drops
            .forEach(
                drop => {

                    ctx.font =
                        "19px Arial";


                    ctx.textAlign =
                        "center";


                    ctx.fillText(
                        icons[
                            drop.type
                        ] ||
                        "✦",
                        drop.x,
                        drop.y
                    );
                }
            );
    }


    function drawPlayer() {

        const p =
            state.player;


        if (
            !p
        ) {

            return;
        }


        if (
            p.invincible >
                0 &&
            Math.floor(
                p.invincible *
                10
            ) %
                2 ===
                0
        ) {

            return;
        }


        ctx.fillStyle =
            "rgba(0,0,0,.28)";


        ctx.beginPath();


        ctx.ellipse(
            p.x,
            p.y + 20,
            21,
            8,
            0,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            p.color;


        ctx.beginPath();


        ctx.arc(
            p.x,
            p.y,
            p.radius,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#e5c3a2";


        ctx.beginPath();


        ctx.arc(
            p.x,
            p.y - 12,
            10,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#2d241f";


        ctx.beginPath();


        ctx.arc(
            p.x,
            p.y - 16,
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
            "#fff0c8";


        ctx.fillText(
            p.name,
            p.x,
            p.y - 40
        );
    }


    function draw() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        ctx.save();


        ctx.translate(
            -state.camera.x,
            -state.camera.y
        );


        drawGround();

        drawBuildings();

        if (
            !state.houseMode
        ) {

            drawTrees();

            drawResources();

            drawObstacles();

            drawPortals();

            drawDrops();

            drawNPCs();

            drawEnemies();

        }

        drawPlayer();


        ctx.restore();


        drawMinimap();
    }


    /* =====================================================
       CÂMERA
    ====================================================== */

    function updateCamera() {

        const width =
            window.innerWidth;


        const height =
            window.innerHeight;


        state.camera.x =
            clamp(
                state.player.x -
                    width / 2,
                0,
                Math.max(
                    0,
                    state.world.width -
                        width
                )
            );


        state.camera.y =
            clamp(
                state.player.y -
                    height / 2,
                0,
                Math.max(
                    0,
                    state.world.height -
                        height
                )
            );
    }


    /* =====================================================
       LOOP
    ====================================================== */

    function update(
        dt
    ) {

        if (
            !state.player
        ) {

            return;
        }


        state.portalCooldown =
            Math.max(
                0,
                state.portalCooldown -
                dt
            );


        state.player.invincible =
            Math.max(
                0,
                state.player.invincible -
                dt
            );


        state.player.attackCooldown =
            Math.max(
                0,
                state.player.attackCooldown -
                dt
            );


        if (
            !state.paused
        ) {

            updateMovement(
                dt
            );


            updateSurvival(
                dt
            );


            updateEnemies(
                dt
            );


            updateResources(
                dt
            );


            checkPortals();
        }


        updateCamera();


        updateHUD();


        draw();
    }


    function gameLoop(
        timestamp
    ) {

        if (
            !state.running
        ) {

            return;
        }


        const dt =
            Math.min(
                (
                    timestamp -
                    state.lastTime
                ) /
                    1000,
                0.05
            );


        state.lastTime =
            timestamp;


        state.time +=
            dt;


        update(
            dt
        );


        requestAnimationFrame(
            gameLoop
        );
    }


    /* =====================================================
       SALVAR / CARREGAR
    ====================================================== */

    function saveGame(
        showMessage = true
    ) {

        if (
            !state.player
        ) {

            return;
        }


        try {

            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify({
                    version:
                        13,

                    area:
                        state.area,

                    player:
                        state.player,

                    savedAt:
                        Date.now()
                })
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

        catch (
            error
        ) {

            console.error(
                error
            );


            showToast(
                "Não foi possível salvar."
            );
        }
    }


    function loadGame() {

        try {

            const raw =
                localStorage.getItem(
                    SAVE_KEY
                );


            if (
                !raw
            ) {

                return false;
            }


            const save =
                JSON.parse(
                    raw
                );


            if (
                !save ||
                !save.player
            ) {

                return false;
            }


            const character =
                CHARACTERS.find(
                    c =>
                        c.id ===
                        save.player
                            .characterId
                );


            if (
                !character
            ) {

                return false;
            }


            state.player =
                save.player;


            state.area =
                REGIONS[
                    save.area
                ]
                    ? save.area
                    : "village";


            fixLoadedPlayer(
                character
            );


            buildWorld();


            updateHUD();


            showScreen(
                "game"
            );


            state.running =
                true;


            state.paused =
                false;


            state.lastTime =
                performance.now();


            requestAnimationFrame(
                gameLoop
            );


            return true;

        }

        catch (
            error
        ) {

            console.error(
                error
            );


            localStorage.removeItem(
                SAVE_KEY
            );


            return false;
        }
    }


    function fixLoadedPlayer(
        character
    ) {

        const p =
            state.player;


        p.inventory =
            p.inventory ||
            {};


        Object.keys(
            ITEMS
        )
            .forEach(
                id => {

                    if (
                        p.inventory[id] ===
                        undefined
                    ) {

                        p.inventory[id] =
                            0;
                    }
                }
            );


        p.equipment =
            p.equipment ||
            {
                weapon: null,
                armor: null,
                tool: "machado"
            };


        p.quest =
            p.quest ||
            {
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
            };


        p.defeatedBosses =
            p.defeatedBosses ||
            [];


        p.unlockedAreas =
            p.unlockedAreas ||
            ["village"];


        p.discoveredBosses =
            p.discoveredBosses ||
            [];


        p.checkpoints =
            p.checkpoints ||
            {};


        p.checkpoints.village =
            p.checkpoints.village ||
            {
                x: 480,
                y: 610
            };


        p.hp =
            clamp(
                Number(
                    p.hp
                ) || character.hp,
                0,
                Number(
                    p.maxHp
                ) || character.hp
            );


        p.maxHp =
            Number(
                p.maxHp
            ) ||
            character.hp;


        p.magic =
            Number(
                p.magic
            ) || character.magic;


        p.maxMagic =
            Number(
                p.maxMagic
            ) ||
            character.magic;


        p.energy =
            Number(
                p.energy
            ) || character.energy;


        p.maxEnergy =
            Number(
                p.maxEnergy
            ) ||
            character.energy;


        p.hunger =
            Number(
                p.hunger
            ) || 100;


        p.fatigue =
            Number(
                p.fatigue
            ) || 100;


        p.radius =
            18;


        p.dead =
            false;
    }


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

        const exists =
            hasSave();


        $("continueBtn")
            .disabled =
            !exists;


        $("continueHint")
            .textContent =
            exists
                ? "Existe um jogo salvo neste navegador."
                : "Nenhum jogo salvo encontrado.";
    }


    function returnToMenu() {

        saveGame(
            false
        );


        state.running =
            false;


        state.paused =
            false;


        state.keys.clear();


        closeAllPanels();


        showScreen(
            "menu"
        );


        updateContinueButton();
    }


    function closeAllPanels() {

        document
            .querySelectorAll(
                ".modal"
            )
            .forEach(
                modal =>
                    modal.classList
                        .add(
                            "hidden"
                        )
            );


        closeDialogue();


        state.travel =
            null;


        state.battle =
            null;


        state.questNPC =
            null;


        state.shopNPC =
            null;
    }


    /* =====================================================
       EVENTOS
    ====================================================== */

    function handleKeyDown(
        event
    ) {

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
            movementKeys.includes(
                key
            )
        ) {

            event.preventDefault();

            state.keys.add(
                key
            );

            return;
        }


        if (
            event.repeat
        ) {

            return;
        }


        if (
            key === "e"
        ) {

            event.preventDefault();

            playerAction();

            return;
        }


        if (
            key === "z"
        ) {

            event.preventDefault();

            handleZ();

            return;
        }


        if (
            key === "i"
        ) {

            event.preventDefault();


            if (
                $("inventoryPanel")
                    .classList.contains(
                        "hidden"
                    )
            ) {

                openInventory();

            }

            else {

                $("inventoryPanel")
                    .classList.add(
                        "hidden"
                    );
            }


            return;
        }


        if (
            key === "m"
        ) {

            event.preventDefault();


            if (
                $("mapPanel")
                    .classList.contains(
                        "hidden"
                    )
            ) {

                openMap();

            }

            else {

                $("mapPanel")
                    .classList.add(
                        "hidden"
                    );
            }


            return;
        }


        if (
            key === "l"
        ) {

            event.preventDefault();


            if (
                $("bookPanel")
                    .classList.contains(
                        "hidden"
                    )
            ) {

                openBook();

            }

            else {

                $("bookPanel")
                    .classList.add(
                        "hidden"
                    );
            }


            return;
        }


        if (
            key === "1"
        ) {

            event.preventDefault();


            useItem(
                "pocao"
            );


            return;
        }


        if (
            key === "2"
        ) {

            event.preventDefault();


            useItem(
                "elixir"
            );


            return;
        }


        if (
            key === "escape"
        ) {

            if (
                state.dialogue
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
                state.battle
            ) {

                declineBattle();

                return;
            }


            closeAllPanels();


            if (
                $("gameScreen")
                    .classList
                    .contains(
                        "active"
                    )
            ) {

                returnToMenu();
            }
        }
    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    $("newGameBtn")
        .addEventListener(
            "click",
            startNewGame
        );


    $("continueBtn")
        .addEventListener(
            "click",
            () => {

                if (
                    !loadGame()
                ) {

                    showToast(
                        "Não foi possível carregar."
                    );

                    updateContinueButton();
                }
            }
        );


    $("howToBtn")
        .addEventListener(
            "click",
            () =>
                showScreen(
                    "how"
                )
        );


    $("closeHowBtn")
        .addEventListener(
            "click",
            () =>
                showScreen(
                    "menu"
                )
        );


    $("creditsBtn")
        .addEventListener(
            "click",
            () =>
                showScreen(
                    "credits"
                )
        );


    $("closeCreditsBtn")
        .addEventListener(
            "click",
            () =>
                showScreen(
                    "menu"
                )
        );


    $("backMenuBtn")
        .addEventListener(
            "click",
            () =>
                showScreen(
                    "menu"
                )
        );


    $("startGameBtn")
        .addEventListener(
            "click",
            startGame
        );


    $("playerName")
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    startGame();
                }
            }
        );


    $("saveBtn")
        .addEventListener(
            "click",
            () =>
                saveGame(
                    true
                )
        );


    $("menuBtn")
        .addEventListener(
            "click",
            returnToMenu
        );


    $("inventoryBtn")
        .addEventListener(
            "click",
            openInventory
        );


    $("mapBtn")
        .addEventListener(
            "click",
            openMap
        );


    $("bookBtn")
        .addEventListener(
            "click",
            openBook
        );


    $("travelYes")
        .addEventListener(
            "click",
            confirmTravel
        );


    $("travelNo")
        .addEventListener(
            "click",
            cancelTravel
        );


    $("battleAccept")
        .addEventListener(
            "click",
            acceptBattle
        );


    $("battleDecline")
        .addEventListener(
            "click",
            declineBattle
        );


    $("respawnBtn")
        .addEventListener(
            "click",
            respawnPlayer
        );


    $("questAction")
        .addEventListener(
            "click",
            questAction
        );


    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            button.dataset
                                .close;

                        $(target)
                            .classList
                            .add(
                                "hidden"
                            );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "#inventoryTabs .tab"
        )
        .forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                "#inventoryTabs .tab"
                            )
                            .forEach(
                                item =>
                                    item.classList
                                        .remove(
                                            "active"
                                        )
                            );


                        tab.classList.add(
                            "active"
                        );


                        state.inventoryCategory =
                            tab.dataset
                                .cat;


                        updateInventory();
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "#shopPanel .tab"
        )
        .forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                "#shopPanel .tab"
                            )
                            .forEach(
                                item =>
                                    item.classList
                                        .remove(
                                            "active"
                                        )
                            );


                        tab.classList.add(
                            "active"
                        );


                        state.shopMode =
                            tab.dataset
                                .shop;


                        renderShop();
                    }
                );
            }
        );


    window.addEventListener(
        "keydown",
        handleKeyDown
    );


    window.addEventListener(
        "keyup",
        event =>
            state.keys.delete(
                event.key.toLowerCase()
            )
    );


    window.addEventListener(
        "blur",
        () =>
            state.keys.clear()
    );


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    createCharacterCards();

    resizeCanvas();

    updateContinueButton();

})();
