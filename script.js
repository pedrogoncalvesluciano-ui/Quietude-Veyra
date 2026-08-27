(() => {
    "use strict";

    const SAVE_KEY = "veyra_save_v14_stable";

    const $ = (id) =>
        document.getElementById(id);

    const must = (id) => {
        const element = $(id);

        if (!element) {
            throw new Error(
                `Elemento obrigatório não encontrado: #${id}`
            );
        }

        return element;
    };


    /* =====================================================
       CANVAS
    ===================================================== */

    const canvas =
        must("gameCanvas");

    const ctx =
        canvas.getContext("2d");


    const miniCanvas =
        must("miniCanvas");

    const miniCtx =
        miniCanvas.getContext("2d");


    const mapCanvas =
        must("worldMapCanvas");

    const mapCtx =
        mapCanvas.getContext("2d");


    /* =====================================================
       TELAS
    ===================================================== */

    const screens = {

        menu:
            must("menuScreen"),

        how:
            must("howScreen"),

        credits:
            must("creditsScreen"),

        character:
            must("characterScreen"),

        game:
            must("gameScreen")
    };


    /* =====================================================
       PERSONAGENS
    ===================================================== */

    const CHARACTERS = [

        {
            id:
                "kaelion",

            name:
                "KAELION",

            className:
                "Mago",

            icon:
                "🧙",

            role:
                "Magia • Longo alcance",

            description:
                "Grande poder mágico, controle à distância e menor resistência física.",

            story:
                "Estudioso de memórias antigas, Kaelion sente a magia desaparecer junto com as lembranças do mundo.",

            hp:
                85,

            magic:
                145,

            energy:
                115,

            speed:
                178,

            damage:
                25,

            defense:
                5,

            color:
                "#e49345",

            bg:
                "rgba(228,147,69,.16)",

            glow:
                "rgba(228,147,69,.28)",

            skill:
                "Raio de Memória"
        },


        {
            id:
                "theron",

            name:
                "THERON",

            className:
                "Cavaleiro",

            icon:
                "🛡️",

            role:
                "Espada • Defesa",

            description:
                "Muita defesa, boa vida e combate corpo a corpo.",

            story:
                "Theron jurou proteger a Vila do Crepúsculo enquanto ainda houver alguém capaz de lembrar seu nome.",

            hp:
                145,

            magic:
                75,

            energy:
                120,

            speed:
                145,

            damage:
                30,

            defense:
                21,

            color:
                "#bfc5ce",

            bg:
                "rgba(191,197,206,.14)",

            glow:
                "rgba(191,197,206,.23)",

            skill:
                "Golpe do Guardião"
        },


        {
            id:
                "grumgar",

            name:
                "GRUMGAR",

            className:
                "Troll",

            icon:
                "👹",

            role:
                "Força • Vida",

            description:
                "Enorme vida e dano físico, porém pouca velocidade.",

            story:
                "Grumgar deixou as cavernas para descobrir por que criaturas de sua espécie começaram a esquecer suas próprias tribos.",

            hp:
                180,

            magic:
                55,

            energy:
                95,

            speed:
                112,

            damage:
                39,

            defense:
                18,

            color:
                "#718f51",

            bg:
                "rgba(113,143,81,.16)",

            glow:
                "rgba(113,143,81,.24)",

            skill:
                "Esmagamento"
        },


        {
            id:
                "lirael",

            name:
                "LIRAEL",

            className:
                "Fada",

            icon:
                "🧚",

            role:
                "Velocidade • Cura",

            description:
                "Muito rápida, mágica e capaz de restaurar vida.",

            story:
                "Lirael percebeu que flores mágicas paravam de brilhar sempre que uma memória desaparecia.",

            hp:
                95,

            magic:
                135,

            energy:
                135,

            speed:
                210,

            damage:
                20,

            defense:
                7,

            color:
                "#dd8bd0",

            bg:
                "rgba(221,139,208,.16)",

            glow:
                "rgba(221,139,208,.25)",

            skill:
                "Luz Vital"
        },


        {
            id:
                "zephyr",

            name:
                "ZEPHYR",

            className:
                "Transmorfo",

            icon:
                "🦊",

            role:
                "Adaptação • Equilíbrio",

            description:
                "Atributos equilibrados e habilidade de adaptação temporária.",

            story:
                "Zephyr muda de forma para sobreviver, mas teme o dia em que esquecerá qual delas era a sua verdadeira forma.",

            hp:
                115,

            magic:
                108,

            energy:
                112,

            speed:
                170,

            damage:
                26,

            defense:
                13,

            color:
                "#8f6bd8",

            bg:
                "rgba(143,107,216,.16)",

            glow:
                "rgba(143,107,216,.25)",

            skill:
                "Forma Adaptativa"
        }
    ];


    /* =====================================================
       ITENS
    ===================================================== */

    const ITEMS = {

        madeira: {
            name:
                "Madeira",

            icon:
                "🪵",

            category:
                "materials",

            weight:
                1,

            value:
                2
        },


        carvao: {
            name:
                "Carvão",

            icon:
                "⬛",

            category:
                "materials",

            weight:
                1,

            value:
                6
        },


        ferro: {
            name:
                "Minério de Ferro",

            icon:
                "⛏️",

            category:
                "materials",

            weight:
                2,

            value:
                14
        },


        ouro: {
            name:
                "Ouro",

            icon:
                "🪙",

            category:
                "materials",

            weight:
                2,

            value:
                30
        },


        rubi: {
            name:
                "Rubi",

            icon:
                "♦",

            category:
                "materials",

            weight:
                2,

            value:
                75
        },


        cristal: {
            name:
                "Cristal",

            icon:
                "💎",

            category:
                "special",

            weight:
                2,

            value:
                45
        },


        essencia: {
            name:
                "Essência da Quietude",

            icon:
                "✦",

            category:
                "special",

            weight:
                1,

            value:
                100
        },


        couro: {
            name:
                "Couro",

            icon:
                "🟫",

            category:
                "materials",

            weight:
                1,

            value:
                18
        },


        fragmentoMemoria: {
            name:
                "Fragmento de Memória",

            icon:
                "🔹",

            category:
                "special",

            weight:
                1,

            value:
                55
        },


        flautaMemoria: {
            name:
                "Flauta da Memória",

            icon:
                "🎶",

            category:
                "special",

            weight:
                1,

            value:
                0,

            unique:
                true
        },


        pao: {
            name:
                "Pão Rústico",

            icon:
                "🥖",

            category:
                "food",

            weight:
                1,

            value:
                12,

            hunger:
                25,

            heal:
                3
        },


        carneCaca: {
            name:
                "Carne de Caça",

            icon:
                "🍖",

            category:
                "food",

            weight:
                1,

            value:
                24,

            hunger:
                42,

            heal:
                8
        },


        pocao: {
            name:
                "Poção de Cura",

            icon:
                "🧪",

            category:
                "potions",

            weight:
                1,

            value:
                30,

            heal:
                45
        },


        elixir: {
            name:
                "Elixir de Energia",

            icon:
                "💙",

            category:
                "potions",

            weight:
                1,

            value:
                35,

            energy:
                50
        },


        espadaFerro: {
            name:
                "Espada de Ferro",

            icon:
                "⚔️",

            category:
                "weapons",

            weight:
                4,

            value:
                140,

            damage:
                12
        },


        armaduraCouro: {
            name:
                "Armadura de Couro",

            icon:
                "🥋",

            category:
                "armor",

            weight:
                5,

            value:
                110,

            defense:
                8
        },


        machado: {
            name:
                "Machado",

            icon:
                "🪓",

            category:
                "tools",

            weight:
                3,

            value:
                50
        }
    };


    /* =====================================================
       REGIÕES
    ===================================================== */

    const REGIONS = {

        village: {
            name:
                "VILA DO CREPÚSCULO",

            width:
                3200,

            height:
                2200,

            visual:
                "village"
        },


        forest: {
            name:
                "FLORESTA",

            width:
                3400,

            height:
                2400,

            visual:
                "forest"
        },


        grove: {
            name:
                "BOSQUE",

            width:
                3200,

            height:
                2300,

            visual:
                "grove"
        },


        mountains: {
            name:
                "MONTANHAS",

            width:
                3500,

            height:
                2300,

            visual:
                "mountains"
        },


        iron: {
            name:
                "CAVERNA DE FERRO",

            width:
                2900,

            height:
                1900,

            visual:
                "iron"
        },


        ruby: {
            name:
                "CAVERNA DE RUBI",

            width:
                3100,

            height:
                2100,

            visual:
                "ruby"
        },


        shadow: {
            name:
                "CAVERNA SOMBRIA",

            width:
                3000,

            height:
                2000,

            visual:
                "shadow"
        },


        fairy: {
            name:
                "REINO DAS FADAS",

            width:
                3200,

            height:
                2200,

            visual:
                "fairy"
        },


        sky: {
            name:
                "CÉU",

            width:
                3400,

            height:
                2200,

            visual:
                "sky"
        },


        hell: {
            name:
                "INFERNO",

            width:
                3600,

            height:
                2400,

            visual:
                "hell"
        },


        final: {
            name:
                "CÂMARA FINAL",

            width:
                2200,

            height:
                1500,

            visual:
                "final"
        }
    };


    /* =====================================================
       REGIÃO ANTERIOR
    ===================================================== */

    const PREVIOUS_REGION = {

        village:
            null,

        forest:
            "village",

        grove:
            "forest",

        mountains:
            "grove",

        iron:
            "mountains",

        ruby:
            "iron",

        shadow:
            "ruby",

        fairy:
            "shadow",

        sky:
            "fairy",

        hell:
            "sky",

        final:
            "hell"
    };


    /* =====================================================
       NPCS
    ===================================================== */

    const NPC_LIBRARY = {

        ELIAN: {

            name:
                "ELIAN",

            role:
                "Morador",

            color:
                "#d4b27c",

            lines: [

                "A Quietude parece estar chegando mais perto. Ontem eu esqueci o nome da rua onde cresci.",

                "Meu pai dizia que a primeira coisa que some não é um lugar. É a lembrança de que ele existia.",

                "A estrada leste está estranha. Um Guardião apareceu por lá e não deixa ninguém passar.",

                "Se você descobrir alguma coisa fora da vila, volte. Precisamos de histórias novas para não esquecer as antigas."
            ]
        },


        MARA: {

            name:
                "MARA",

            role:
                "Historiadora",

            color:
                "#b98bc4",

            lines: [

                "Os registros mais antigos falam da Quietude como se ela já tivesse acontecido antes.",

                "Cada pessoa descreve a Quietude de um jeito diferente. Isso é o que mais me assusta.",

                "Alguns livros têm páginas inteiras em branco, mas a numeração continua como se algo estivesse faltando.",

                "Quando você encontrar algo que não consegue explicar, tente lembrar de cada detalhe antes de voltar."
            ]
        },


        DORAN: {

            name:
                "DORAN",

            role:
                "Comerciante",

            color:
                "#c58a54",

            merchant:
                true,

            lines: [

                "Compro materiais e vendo o que consigo trazer de fora.",

                "Uma boa espada não resolve todos os problemas, mas resolve alguns deles bem rápido.",

                "Guarde dinheiro para quando realmente precisar. As regiões além da vila não são gentis.",

                "Se encontrar cristais ou minérios raros, eu pago bem."
            ]
        },


        BRAN: {

            name:
                "BRAN",

            role:
                "Carpinteiro",

            color:
                "#8d7053",

            questId:
                "wood",

            lines: [

                "Preciso reforçar algumas casas. A madeira anda apodrecendo mais rápido desde que a Quietude chegou.",

                "As árvores daqui são estranhas. Algumas voltam a nascer longe do lugar onde caíram.",

                "Se puder trazer dez madeiras, eu pago pelo trabalho.",

                "Cortar madeira consome magia. Não se esgote por causa de uma árvore."
            ]
        },


        BORIN: {

            name:
                "BORIN",

            role:
                "Ferreiro",

            color:
                "#8e8d89",

            questId:
                "coal",

            lines: [

                "O fogo da forja ainda lembra como queimar. Por enquanto.",

                "Carvão bom está ficando difícil de encontrar.",

                "Se trouxer oito carvões, posso compensar seu esforço.",

                "Equipamento é investimento. Sobreviver costuma sair mais barato que morrer."
            ]
        }
    };


    /* =====================================================
       HABILIDADES
    ===================================================== */

    const CLASS_SKILLS = {

        kaelion: {

            q: {
                name:
                    "Bola de Memória",

                level:
                    1,

                cooldown:
                    2,

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


    /* =====================================================
       LIVRO DOS BOSSES
    ===================================================== */

    const BOSS_REGISTRY = [

        {
            id:
                "forest_guardian",

            name:
                "GUARDIÃO DA ESTRADA",

            icon:
                "👺",

            description:
                "Antigo protetor da estrada da Vila do Crepúsculo. A Quietude apagou de sua memória quem deveria atravessar e quem deveria ser impedido.",

            quote:
                "Ele continuou guardando a passagem depois de esquecer o motivo."
        },


        {
            id:
                "grove_guardian",

            name:
                "GUARDIÃO DA FLORESTA",

            icon:
                "🌳",

            description:
                "Uma árvore ancestral que sentia cada passo na mata. Suas raízes foram contaminadas por lembranças quebradas e agora atacam tudo que se aproxima.",

            quote:
                "As raízes lembram o que as folhas esqueceram."
        },


        {
            id:
                "mountain_guardian",

            name:
                "GUARDIÃO DO BOSQUE",

            icon:
                "🌲",

            description:
                "Último espírito que separava o Bosque das Montanhas. Seu corpo cresceu ao redor de memórias de viajantes perdidos.",

            quote:
                "Cada galho carrega um nome que já não possui dono."
        },


        {
            id:
                "iron_guardian",

            name:
                "SENTINELA DAS MONTANHAS",

            icon:
                "🗿",

            description:
                "Uma sentinela de pedra moldada por um povo desaparecido. Atira rochas contra intrusos e ainda obedece a uma ordem cujo autor ninguém recorda.",

            quote:
                "A pedra não esqueceu a ordem. Esqueceu apenas quem a deu."
        },


        {
            id:
                "ruby_guardian",

            name:
                "GUARDIÃO DE FERRO",

            icon:
                "⚙️",

            description:
                "Máquina de mineração que aprendeu a defender os túneis quando os mineiros desapareceram. O metal em seu corpo vibra com magia antiga.",

            quote:
                "Quando o último martelo silenciou, ele continuou trabalhando."
        },


        {
            id:
                "shadow_guardian",

            name:
                "GUARDIÃO RUBI",

            icon:
                "🔴",

            description:
                "Uma criatura formada ao redor de um núcleo de rubi vivo. Seus cristais armazenam lembranças como reflexos vermelhos.",

            quote:
                "O cristal repete tudo — até aquilo que nunca aconteceu."
        },


        {
            id:
                "fairy_guardian",

            name:
                "GUARDIÃO SOMBRIO",

            icon:
                "🌑",

            description:
                "Sombra condensada de exploradores esquecidos. Não possui uma única identidade; fala com vozes de pessoas que não existem mais.",

            quote:
                "Nenhuma sombra nasce sem algo para bloquear a luz."
        },


        {
            id:
                "sky_guardian",

            name:
                "GUARDIÃ DOS FIOS",

            icon:
                "🧚",

            description:
                "Uma antiga fada que costurava memórias entre flores e pessoas. Ao se corromper, passou a cortar os fios que antes protegia.",

            quote:
                "Ela aprendeu tarde demais que lembrar também pode doer."
        },


        {
            id:
                "path_guardian",

            name:
                "GUARDIÃO DO CAMINHO",

            icon:
                "🪽",

            description:
                "O último vigilante antes do Inferno. Somente aparece depois das Cinco Hordas e carrega a Flauta da Memória.",

            quote:
                "A passagem não estava escondida. O mundo havia esquecido que ela existia."
        },


        {
            id:
                "final_gate_guardian",

            name:
                "GUARDIÃO SUPREMO DO INFERNO",

            icon:
                "👿",

            description:
                "Uma entidade moldada pela pressão de milhares de memórias destruídas. Protege a Câmara Final e domina ataques infernais em área.",

            quote:
                "Atrás dele, até o medo parece lembrar do seu nome."
        },


        {
            id:
                "other_self",

            name:
                "O OUTRO EU",

            icon:
                "☯",

            description:
                "Uma versão do protagonista de outro universo. Preservou memória demais e concluiu que a única forma de acabar com o sofrimento é apagar tudo.",

            quote:
                "Se nada for lembrado, nada poderá sofrer."
        }
    ];


    /* =====================================================
       ESTADO
    ===================================================== */

    const state = {

        selectedCharacter:
            CHARACTERS[0],

        player:
            null,

        running:
            false,

        paused:
            false,

        time:
            0,

        lastTime:
            0,

        keys:
            new Set(),

        area:
            "village",

        camera: {
            x:
                0,

            y:
                0
        },

        world:
            createEmptyWorld(
                REGIONS.village
            ),

        houseMode:
            false,

        currentHouse:
            null,

        houseReturn:
            null,

        dialogue:
            null,

        travel:
            null,

        battle:
            null,

        questNPC:
            null,

        shopNPC:
            null,

        shopMode:
            "buy",

        inventoryCategory:
            "all",

        toastTimer:
            null,

        portalCooldown:
            0,

        warnedNeedAt:
            0,

        finalChoiceShown:
            false,

        pointer: {
            x:
                0,

            y:
                0,

            worldX:
                0,

            worldY:
                0,

            down:
                false
        },

        holdAction:
            null,

        hordeNextAt:
            0,

        screenFadeTimer:
            null,

        screenShake:
            0,

        screenShakePower:
            0
    };


    /* =====================================================
       MUNDO VAZIO
    ===================================================== */

    function createEmptyWorld(
        region
    ) {

        return {

            width:
                region.width,

            height:
                region.height,

            obstacles:
                [],

            buildings:
                [],

            trees:
                [],

            resources:
                [],

            foods:
                [],

            secrets:
                [],

            decorations:
                [],

            trials:
                [],

            hazards:
                [],

            npcs:
                [],

            enemies:
                [],

            drops:
                [],

            portals:
                [],

            particles:
                [],

            effects:
                [],

            paths:
                []
        };
    }


    /* =====================================================
       FUNÇÕES AUXILIARES
    ===================================================== */

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
                max +
                1
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


    function uid(
        prefix
    ) {

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


    function hashString(
        text
    ) {

        let hash =
            2166136261;

        for (
            let i = 0;
            i <
            text.length;
            i++
        ) {

            hash ^=
                text.charCodeAt(
                    i
                );

            hash =
                Math.imul(
                    hash,
                    16777619
                );
        }

        return (
            hash >>>
            0
        );
    }


    function mulberry32(
        seed
    ) {

        return function seededRandom() {

            let t =
                seed +=
                0x6D2B79F5;

            t =
                Math.imul(
                    t ^
                    (
                        t >>>
                        15
                    ),
                    t |
                    1
                );

            t ^=
                t +
                Math.imul(
                    t ^
                    (
                        t >>>
                        7
                    ),
                    t |
                    61
                );

            return (
                (
                    t ^
                    (
                        t >>>
                        14
                    )
                ) >>>
                0
            ) /
            4294967296;
        };
    }


    function areaRng(
        area,
        salt = "layout"
    ) {

        const seedBase =
            state.player
                ?.worldSeeds
                ?.[area] ??
            hashString(
                `${area}:${salt}`
            );

        return mulberry32(
            (
                seedBase ^
                hashString(
                    salt
                )
            ) >>>
            0
        );
    }


    function seededRange(
        rng,
        min,
        max
    ) {

        return (
            rng() *
            (
                max -
                min
            ) +
            min
        );
    }


    function seededInt(
        rng,
        min,
        max
    ) {

        return Math.floor(
            seededRange(
                rng,
                min,
                max +
                1
            )
        );
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


    function getCharacterSkills() {

        return (
            CLASS_SKILLS[
                state.player
                    ?.characterId
            ] ||
            CLASS_SKILLS.kaelion
        );
    }


    function getCharacterPalette(
        characterId =
            state.player
                ?.characterId
    ) {

        const palettes = {

            kaelion: {
                main:
                    "#f0a258",

                glow:
                    "#ffd59b",

                secondary:
                    "#a46cff"
            },

            theron: {
                main:
                    "#d6dde6",

                glow:
                    "#fff4d3",

                secondary:
                    "#8fa6bd"
            },

            grumgar: {
                main:
                    "#8da05c",

                glow:
                    "#d2d99a",

                secondary:
                    "#a36f4e"
            },

            lirael: {
                main:
                    "#f3a6dd",

                glow:
                    "#ffe0f6",

                secondary:
                    "#84e7ff"
            },

            zephyr: {
                main:
                    "#9d7be8",

                glow:
                    "#e5d6ff",

                secondary:
                    "#69d5b1"
            }
        };

        return (
            palettes[
                characterId
            ] ||
            palettes.kaelion
        );
    }


    /* =====================================================
       TELAS
    ===================================================== */

    function showScreen(
        name
    ) {

        Object.values(
            screens
        ).forEach(
            screen =>
                screen.classList.remove(
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
                                () =>
                                    fade.classList.remove(
                                        "active"
                                    )
                            );
                        }
                    );
                },
                320
            );
    }


    function showToast(
        message
    ) {

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
                () =>
                    toast.classList.remove(
                        "show"
                    ),
                2300
            );
    }


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


    function shakeScreen(
        power = 8,
        duration = 0.18
    ) {

        state.screenShake =
            Math.max(
                state.screenShake,
                duration
            );

        state.screenShakePower =
            Math.max(
                state.screenShakePower,
                power
            );
    }


    /* =====================================================
       CARTÕES DOS PERSONAGENS
    ===================================================== */

    function createCharacterCards() {

        const container =
            must(
                "characterCards"
            );

        container.innerHTML =
            "";

        const maximums = {

            hp:
                180,

            magic:
                145,

            energy:
                135,

            damage:
                39,

            defense:
                21,

            speed:
                210
        };


        const labels = {

            hp:
                "Vida",

            magic:
                "Magia",

            energy:
                "Energia",

            damage:
                "Dano",

            defense:
                "Defesa",

            speed:
                "Velocidade"
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
                    `character-card${
                        index ===
                        0
                            ? " selected"
                            : ""
                    }`;

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


                const stats =
                    [
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
                                    item.classList.remove(
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


    /* =====================================================
       NOVO JOGO
    ===================================================== */

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
            () =>
                setTimeout(
                    () =>
                        must(
                            "playerName"
                        ).focus(),
                    80
                )
        );
    }


    /* =====================================================
       CRIAR PLAYER
    ===================================================== */

    function createPlayer(
        name,
        character
    ) {

        const worldSeeds =
            {};

        Object.keys(
            REGIONS
        ).forEach(
            (
                area,
                index
            ) => {

                worldSeeds[
                    area
                ] =
                    hashString(
                        `${name}:${Date.now()}:${area}:${index}:${Math.random()}`
                    );
            }
        );


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

            x:
                380,

            y:
                260,

            radius:
                18,

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

            level:
                1,

            xp:
                0,

            xpToNext:
                100,

            money:
                35,

            hunger:
                100,

            fatigue:
                100,

            memory:
                0,


            inventory: {

                madeira:
                    0,

                carvao:
                    0,

                ferro:
                    0,

                ouro:
                    0,

                rubi:
                    0,

                cristal:
                    0,

                essencia:
                    0,

                couro:
                    0,

                fragmentoMemoria:
                    0,

                flautaMemoria:
                    0,

                pao:
                    2,

                carneCaca:
                    0,

                pocao:
                    2,

                elixir:
                    1,

                espadaFerro:
                    0,

                armaduraCouro:
                    0,

                machado:
                    1
            },


            equipment: {

                weapon:
                    null,

                armor:
                    null,

                tool:
                    "machado"
            },


            quest: {

                wood: {

                    state:
                        "none",

                    need:
                        10,

                    rewardXP:
                        100,

                    rewardMoney:
                        80
                },


                coal: {

                    state:
                        "none",

                    need:
                        8,

                    rewardXP:
                        130,

                    rewardMoney:
                        110
                }
            },


            defeatedBosses:
                [],

            discoveredBosses:
                [],

            unlockedAreas:
                [
                    "village"
                ],

            collected:
                {},

            hellTypesDefeated:
                {},

            secretsFound:
                [],

            worldSeeds,

            skyTrial: {

                started:
                    false,

                wave:
                    0,

                activeWave:
                    0,

                complete:
                    false
            },


            flutePlayed:
                false,


            checkpoint: {

                area:
                    "village",

                x:
                    480,

                y:
                    610
            },


            skillCooldowns: {

                q:
                    0,

                r:
                    0,

                f:
                    0
            },


            damageReduction:
                0,

            shieldTimer:
                0,

            stunTimer:
                0,

            dead:
                false,

            invincible:
                0,

            attackCooldown:
                0,

            adaptiveBuff:
                false,

            finalChoice:
                null,

            finalDefeated:
                false
        };
    }


    /* =====================================================
       COMEÇAR JOGO
    ===================================================== */

    function startGame() {

        const input =
            must(
                "playerName"
            );

        const name =
            input.value.trim();


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
                    "Você despertou em casa. Aproxime-se da cama e pressione E para dormir, ou Z para sair."
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
    ===================================================== */

    function resetWorld() {

        state.world =
            createEmptyWorld(
                REGIONS[
                    state.area
                ]
            );
    }


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
            x -
            24,

            y -
            95,

            w +
            48,

            h +
            95,

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

            alive:
                true,

            amount:
                randomInt(
                    2,
                    5
                ),

            respawn:
                0
        };


        state.world
            .trees
            .push(
                tree
            );


        addObstacle(
            x -
            30,

            y -
            38,

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
            `secret_${state.area}_${title}`
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


    function addPath(
        points,
        width = 100,
        kind = "dirt",
        extra = {}
    ) {

        state.world
            .paths
            .push({

                id:
                    uid(
                        "path"
                    ),

                points,
                width,
                kind,

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

                radius:
                    38,

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
                    Math.max(
                        0.01,
                        delay
                    ),

                damage,

                life:
                    delay +
                    0.35,

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
        templateOrName,
        role = "Morador",
        color = "#d4b27c",
        lines = [
            "Olá."
        ],
        extra = {}
    ) {

        let data;


        if (
            typeof templateOrName ===
                "string" &&
            NPC_LIBRARY[
                templateOrName
            ]
        ) {

            data = {
                ...NPC_LIBRARY[
                    templateOrName
                ],

                ...extra
            };
        }

        else {

            data = {

                name:
                    templateOrName,

                role,
                color,
                lines,

                ...extra
            };
        }


        state.world
            .npcs
            .push({

                id:
                    uid(
                        "npc"
                    ),

                x,
                y,

                radius:
                    17,

                ...data
            });
    }


    /* =====================================================
       INIMIGOS
    ===================================================== */

    function addEnemy(
        enemy
    ) {

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


        const regionOrder = [

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


        const regionIndex =
            Math.max(
                0,
                regionOrder.indexOf(
                    state.area
                )
            );


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
                    1.7,
                    3.2
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

            charge:
                null,

            telegraphing:
                false,

            level:
                Math.max(
                    1,
                    level +
                    Math.floor(
                        regionIndex /
                        2
                    )
                ),

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


    /* =====================================================
       PORTAIS
    ===================================================== */

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

                direction:
                    "forward",

                ...extra
            });
    }


    function addReturnPortal(
        target,
        title = null
    ) {

        if (
            !target
        ) {

            return;
        }


        addPortal(

            72,

            state.world.height /
            2 -
            110,

            72,
            220,

            target,

            () =>
                true,

            title ||
            `VOLTAR PARA ${REGIONS[target].name}`,

            {
                direction:
                    "back",

                returnPortal:
                    true,

                arrivalSide:
                    "right"
            }
        );
    }


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


    /* =====================================================
       BUILD WORLD
    ===================================================== */

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


        builders[
            state.area
        ]();


        addReturnPortal(
            PREVIOUS_REGION[
                state.area
            ]
        );


        must(
            "locationLabel"
        ).textContent =
            REGIONS[
                state.area
            ].name;
    }


    /* =====================================================
       VILA
    ===================================================== */

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
            "elianHome",
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


        addPath(
            [
                {
                    x:
                        70,

                    y:
                        1140
                },

                {
                    x:
                        3100,

                    y:
                        1140
                }
            ],
            120,
            "villageRoad"
        );


        addPath(
            [
                {
                    x:
                        1600,

                    y:
                        70
                },

                {
                    x:
                        1600,

                    y:
                        2130
                }
            ],
            120,
            "villageRoad"
        );


        addPath(
            [
                {
                    x:
                        660,

                    y:
                        1110
                },

                {
                    x:
                        660,

                    y:
                        1750
                }
            ],
            94,
            "villageRoad"
        );


        addObstacle(
            1492,
            978,
            216,
            216,
            "fountain"
        );


        [
            [970, 760],
            [1100, 720],
            [1210, 1800],
            [1850, 1630],
            [2200, 940],
            [2740, 860],
            [650, 1160],
            [2370, 1830]
        ].forEach(
            (
                [
                    x,
                    y
                ]
            ) =>
                addObstacle(
                    x -
                    30,
                    y -
                    23,
                    60,
                    46,
                    "rock"
                )
        );


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
            [2850, 1050],
            [2150, 750],
            [1900, 750],
            [1150, 1000]
        ].forEach(
            (
                [
                    x,
                    y
                ],
                index
            ) =>
                addTree(
                    x,
                    y,
                    `village_tree_${index}`
                )
        );


        addNPC(
            1030,
            610,
            "ELIAN"
        );


        addNPC(
            1940,
            1055,
            "MARA"
        );


        addNPC(
            1050,
            1420,
            "BRAN"
        );


        addNPC(
            2280,
            820,
            "BORIN"
        );


        /*
            DORAN NÃO APARECE NA RUA.
            ELE EXISTE APENAS DENTRO DA LOJA.
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
                1
        });


        addEnemy({

            id:
                "village_wolf",

            x:
                2190,

            y:
                1450,

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
                0.65,

            special:
                "dash"
        });


        addEnemy({

            id:
                "village_resource_boss",

            x:
                2360,

            y:
                1810,

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
                270,

            attackRange:
                75,

            radius:
                30,

            color:
                "#788762",

            drop:
                "ouro",

            dropAmount:
                2,

            respawnTime:
                60,

            special:
                "natureBurst"
        });


        addEnemy({

            id:
                "forest_guardian",

            x:
                2890,

            y:
                1090,

            name:
                "GUARDIÃO DA ESTRADA",

            icon:
                "👺",

            type:
                "progression",

            hp:
                300,

            maxHp:
                300,

            damage:
                21,

            speed:
                64,

            vision:
                340,

            attackRange:
                82,

            radius:
                30,

            color:
                "#945149",

            drop:
                "cristal",

            dropAmount:
                2,

            unlock:
                "forest",

            special:
                "memoryBurst"
        });


        addPortal(
            3060,
            1010,
            70,
            210,

            "forest",

            () =>
                hasDefeatedBoss(
                    "forest_guardian"
                ),

            "FLORESTA",

            {
                arrivalSide:
                    "left"
            }
        );


        [
            [760, 1260, "flowerPot"],
            [840, 1315, "barrel"],
            [920, 1265, "flowerPot"],
            [1820, 1210, "bench"],
            [1900, 1250, "lanternPost"],
            [2000, 1220, "bench"],
            [2140, 650, "forgeSign"],
            [2700, 1600, "shopCrate"]
        ].forEach(
            (
                [
                    x,
                    y,
                    type
                ]
            ) =>
                addDecoration(
                    type,
                    x,
                    y
                )
        );


        addFood(
            1340,
            1450,
            "carrot",

            {
                respawnMin:
                    110,

                respawnMax:
                    165
            }
        );


        addFood(
            1425,
            1510,
            "carrot",

            {
                respawnMin:
                    115,

                respawnMax:
                    175
            }
        );
    }


    /* =====================================================
       CAMINHO FLORESTA / BOSQUE
    ===================================================== */

    function forestPathY(
        x,
        area = "forest"
    ) {

        const rng =
            areaRng(
                area,
                "path"
            );


        const base =
            area ===
            "forest"
                ? 1210
                : 1120;


        const ampA =
            area ===
            "forest"
                ? 120 +
                  seededRange(
                      rng,
                      0,
                      75
                  )
                : 70 +
                  seededRange(
                      rng,
                      0,
                      55
                  );


        const ampB =
            area ===
            "forest"
                ? 30 +
                  seededRange(
                      rng,
                      0,
                      35
                  )
                : 18 +
                  seededRange(
                      rng,
                      0,
                      30
                  );


        const divA =
            area ===
            "forest"
                ? 300 +
                  seededRange(
                      rng,
                      -30,
                      40
                  )
                : 245 +
                  seededRange(
                      rng,
                      -25,
                      35
                  );


        const divB =
            area ===
            "forest"
                ? 105 +
                  seededRange(
                      rng,
                      -15,
                      20
                  )
                : 120 +
                  seededRange(
                      rng,
                      -12,
                      18
                  );


        const phaseA =
            seededRange(
                rng,
                -2,
                2
            );


        const phaseB =
            seededRange(
                rng,
                -2,
                2
            );


        return (
            base +
            Math.sin(
                x /
                divA +
                phaseA
            ) *
            ampA +

            Math.sin(
                x /
                divB +
                phaseB
            ) *
            ampB
        );
    }


    /* =====================================================
       FLORESTA
    ===================================================== */

    function buildForest() {

        const rng =
            areaRng(
                "forest",
                "objects"
            );


        const points =
            [];


        for (
            let x = 90;
            x <=
            3310;
            x +=
            50
        ) {

            points.push({

                x,

                y:
                    forestPathY(
                        x,
                        "forest"
                    )
            });
        }


        addPath(
            points,
            116,
            "forestTrail"
        );


        for (
            let x = 150;
            x <
            3270;
            x +=
            78
        ) {

            const y =
                forestPathY(
                    x,
                    "forest"
                );


            addDecoration(

                "pathStone",

                x +
                seededRange(
                    rng,
                    -18,
                    18
                ),

                y +
                seededRange(
                    rng,
                    -35,
                    35
                ),

                {
                    size:
                        seededRange(
                            rng,
                            17,
                            31
                        ),

                    angle:
                        seededRange(
                            rng,
                            -0.6,
                            0.6
                        )
                }
            );


            if (
                Math.floor(
                    x /
                    78
                ) %
                4 ===
                0
            ) {

                addDecoration(

                    "mushroom",

                    x +
                    seededRange(
                        rng,
                        -80,
                        80
                    ),

                    y +
                    seededRange(
                        rng,
                        120,
                        200
                    ),

                    {
                        glow:
                            rng() <
                            0.24
                    }
                );
            }
        }


        let planted =
            0;

        let tries =
            0;


        while (
            planted <
                82 &&
            tries <
                1000
        ) {

            tries++;


            const x =
                seededInt(
                    rng,
                    135,
                    3260
                );


            const y =
                seededInt(
                    rng,
                    130,
                    2260
                );


            if (
                Math.abs(
                    y -
                    forestPathY(
                        x,
                        "forest"
                    )
                ) <
                170
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


        for (
            let i = 0;
            i <
            26;
            i++
        ) {

            const type =
                i %
                5 ===
                0

                    ? "fallenLog"

                    : i %
                      3 ===
                      0

                    ? "bush"

                    : "fern";


            addDecoration(

                type,

                seededInt(
                    rng,
                    190,
                    3180
                ),

                seededInt(
                    rng,
                    180,
                    2180
                ),

                {
                    phase:
                        seededRange(
                            rng,
                            0,
                            Math.PI *
                            2
                        )
                }
            );
        }


        [
            620,
            1040,
            1460,
            2050,
            2470,
            2920
        ].forEach(
            (
                x,
                index
            ) => {

                const y =
                    forestPathY(
                        x,
                        "forest"
                    ) +
                    (
                        index %
                        2
                            ? 135
                            : -145
                    );


                addFood(
                    x,
                    y,
                    "carrot",

                    {
                        respawnMin:
                            115,

                        respawnMax:
                            175
                    }
                );
            }
        );


        [
            [650, 480, "carvao"],
            [1230, 1880, "carvao"],
            [1750, 540, "ferro"],
            [2170, 1830, "carvao"],
            [2710, 510, "ferro"],
            [3030, 1830, "carvao"],
            [1540, 1690, "ferro"],
            [2350, 440, "carvao"]
        ].forEach(
            (
                [
                    x,
                    y,
                    type
                ]
            ) =>
                addResource(
                    x,
                    y,
                    type
                )
        );


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
                    seededInt(
                        rng,
                        520,
                        2820
                    ),

                y:
                    seededInt(
                        rng,
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
                        ? 0.8
                        : 0.65,

                special:
                    i >=
                    6
                        ? "dash"
                        : null
            });
        }


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


        addEnemy({

            id:
                "grove_guardian",

            x:
                2990,

            y:
                forestPathY(
                    2990,
                    "forest"
                ),

            name:
                "GUARDIÃO DA FLORESTA",

            icon:
                "🌳",

            type:
                "progression",

            hp:
                470,

            maxHp:
                470,

            damage:
                26,

            speed:
                60,

            vision:
                365,

            attackRange:
                88,

            radius:
                36,

            color:
                "#416d43",

            drop:
                "fragmentoMemoria",

            dropAmount:
                2,

            unlock:
                "grove",

            special:
                "rootCircle"
        });


        addPortal(

            3260,

            forestPathY(
                3260,
                "forest"
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
                arrivalSide:
                    "left"
            }
        );
    }


    /* =====================================================
       BOSQUE
    ===================================================== */

    function buildGrove() {

        const rng =
            areaRng(
                "grove",
                "objects"
            );


        const points =
            [];


        for (
            let x = 90;
            x <=
            3110;
            x +=
            48
        ) {

            points.push({

                x,

                y:
                    forestPathY(
                        x,
                        "grove"
                    )
            });
        }


        addPath(
            points,
            106,
            "groveTrail"
        );


        for (
            let x = 140;
            x <
            3060;
            x +=
            68
        ) {

            addDecoration(

                "pathStone",

                x,

                forestPathY(
                    x,
                    "grove"
                ) +
                seededRange(
                    rng,
                    -28,
                    28
                ),

                {
                    size:
                        seededRange(
                            rng,
                            15,
                            27
                        ),

                    angle:
                        seededRange(
                            rng,
                            -0.7,
                            0.7
                        )
                }
            );
        }


        let count =
            0;

        let guard =
            0;


        while (
            count <
                66 &&
            guard++ <
                850
        ) {

            const x =
                seededInt(
                    rng,
                    130,
                    3050
                );


            const y =
                seededInt(
                    rng,
                    130,
                    2160
                );


            if (
                Math.abs(
                    y -
                    forestPathY(
                        x,
                        "grove"
                    )
                ) <
                145
            ) {

                continue;
            }


            addTree(
                x,
                y,
                `grove_tree_${count++}`
            );
        }


        for (
            let i = 0;
            i <
            38;
            i++
        ) {

            addDecoration(

                i %
                6 ===
                0

                    ? "ancientRoot"

                    : i %
                      4 ===
                      0

                    ? "flower"

                    : "fern",

                seededInt(
                    rng,
                    180,
                    3020
                ),

                seededInt(
                    rng,
                    170,
                    2110
                ),

                {
                    phase:
                        seededRange(
                            rng,
                            0,
                            Math.PI *
                            2
                        )
                }
            );
        }


        [
            520,
            880,
            1380,
            2010,
            2500
        ].forEach(
            (
                x,
                index
            ) => {

                addFood(

                    x,

                    forestPathY(
                        x,
                        "grove"
                    ) +
                    (
                        index %
                        2
                            ? 135
                            : -130
                    ),

                    "carrot",

                    {
                        respawnMin:
                            120,

                        respawnMax:
                            180
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
                    seededInt(
                        rng,
                        430,
                        2700
                    ),

                y:
                    seededInt(
                        rng,
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
                    0.75,

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
                560,

            maxHp:
                560,

            damage:
                30,

            speed:
                59,

            vision:
                375,

            attackRange:
                90,

            radius:
                37,

            color:
                "#4f744f",

            drop:
                "fragmentoMemoria",

            dropAmount:
                2,

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
                arrivalSide:
                    "left"
            }
        );
    }


    /* =====================================================
       MONTANHAS
    ===================================================== */

    function buildMountains() {

        const rng =
            areaRng(
                "mountains",
                "objects"
            );


        addPath(

            [
                { x: 130, y: 1140 },
                { x: 600, y: 1080 },
                { x: 1040, y: 1250 },
                { x: 1520, y: 1070 },
                { x: 2080, y: 1180 },
                { x: 2640, y: 1030 },
                { x: 3370, y: 1140 }
            ],

            92,

            "snowTrail"
        );


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

                    : "snowrock";


            addObstacle(

                seededInt(
                    rng,
                    160,
                    3260
                ),

                seededInt(
                    rng,
                    150,
                    2100
                ),

                seededInt(
                    rng,
                    48,
                    108
                ),

                seededInt(
                    rng,
                    36,
                    78
                ),

                type
            );
        }


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

                    ? "deadPine"

                    : i %
                      6 ===
                      0

                    ? "oreSpark"

                    : i %
                      4 ===
                      0

                    ? "snowDrift"

                    : "windMark";


            addDecoration(

                type,

                seededInt(
                    rng,
                    150,
                    3300
                ),

                seededInt(
                    rng,
                    140,
                    2140
                ),

                {
                    phase:
                        seededRange(
                            rng,
                            0,
                            Math.PI *
                            2
                        )
                }
            );
        }


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
            [2870, 1360, "ferro"]
        ].forEach(
            (
                [
                    x,
                    y,
                    type
                ]
            ) =>
                addResource(
                    x,
                    y,
                    type
                )
        );


        addSecret(

            3050,
            370,

            "Espada Congelada",

            "Uma espada sem dono está presa no gelo. O nome no cabo foi raspado muitas vezes.",

            "🗡️"
        );


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


        for (
            let i = 0;
            i <
            11;
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
                    seededInt(
                        rng,
                        460,
                        2950
                    ),

                y:
                    seededInt(
                        rng,
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
                    300,

                attackRange:
                    deer
                        ? 70
                        : 85,

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
                700,

            maxHp:
                700,

            damage:
                35,

            speed:
                55,

            vision:
                390,

            attackRange:
                96,

            radius:
                39,

            color:
                "#697176",

            drop:
                "fragmentoMemoria",

            dropAmount:
                3,

            unlock:
                "iron",

            special:
                "rockStorm"
        });


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
                arrivalSide:
                    "left"
            }
        );
    }


    /* =====================================================
       CAVERNA DE FERRO
    ===================================================== */

    function buildIron() {

        const rng =
            areaRng(
                "iron",
                "objects"
            );


        addPath(

            [
                { x: 120, y: 950 },
                { x: 620, y: 890 },
                { x: 1180, y: 1010 },
                { x: 1750, y: 850 },
                { x: 2260, y: 990 },
                { x: 2800, y: 940 }
            ],

            82,

            "mineTrack"
        );


        for (
            let i = 0;
            i <
            38;
            i++
        ) {

            addObstacle(

                seededInt(
                    rng,
                    150,
                    2700
                ),

                seededInt(
                    rng,
                    150,
                    1700
                ),

                seededInt(
                    rng,
                    50,
                    90
                ),

                seededInt(
                    rng,
                    38,
                    65
                ),

                i %
                5 ===
                0
                    ? "oreRock"
                    : "ironrock"
            );
        }


        for (
            let i = 0;
            i <
            32;
            i++
        ) {

            addResource(

                seededInt(
                    rng,
                    210,
                    2630
                ),

                seededInt(
                    rng,
                    190,
                    1650
                ),

                i %
                7 ===
                0
                    ? "ouro"
                    : "ferro"
            );
        }


        for (
            let i = 0;
            i <
            30;
            i++
        ) {

            const type =
                i %
                5 ===
                0

                    ? "mineLantern"

                    : i %
                      4 ===
                      0

                    ? "rail"

                    : i %
                      3 ===
                      0

                    ? "toolCrate"

                    : "stalagmite";


            addDecoration(

                type,

                seededInt(
                    rng,
                    190,
                    2700
                ),

                seededInt(
                    rng,
                    170,
                    1700
                ),

                {
                    phase:
                        seededRange(
                            rng,
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


        for (
            let i = 0;
            i <
            9;
            i++
        ) {

            addEnemy({

                id:
                    `iron_enemy_${i}`,

                x:
                    seededInt(
                        rng,
                        420,
                        2300
                    ),

                y:
                    seededInt(
                        rng,
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
                    275,

                attackRange:
                    76,

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
                    0.62,

                special:
                    i >=
                    5
                        ? "oreBurst"
                        : null
            });
        }


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
                800,

            maxHp:
                800,

            damage:
                39,

            speed:
                56,

            vision:
                400,

            attackRange:
                100,

            radius:
                40,

            color:
                "#70787d",

            drop:
                "fragmentoMemoria",

            dropAmount:
                3,

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
                arrivalSide:
                    "left"
            }
        );
    }


    /* =====================================================
       CAVERNA DE RUBI
    ===================================================== */

    function buildRuby() {

        const rng =
            areaRng(
                "ruby",
                "objects"
            );


        addPath(

            [
                { x: 120, y: 1040 },
                { x: 650, y: 970 },
                { x: 1180, y: 1110 },
                { x: 1700, y: 910 },
                { x: 2250, y: 1050 },
                { x: 3020, y: 1010 }
            ],

            84,

            "crystalTrail"
        );


        for (
            let i = 0;
            i <
            40;
            i++
        ) {

            addObstacle(

                seededInt(
                    rng,
                    170,
                    2880
                ),

                seededInt(
                    rng,
                    170,
                    1900
                ),

                seededInt(
                    rng,
                    48,
                    92
                ),

                seededInt(
                    rng,
                    38,
                    70
                ),

                i %
                4 ===
                0
                    ? "rubyPillar"
                    : "rubyrock"
            );
        }


        for (
            let i = 0;
            i <
            36;
            i++
        ) {

            addResource(

                seededInt(
                    rng,
                    220,
                    2860
                ),

                seededInt(
                    rng,
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


        for (
            let i = 0;
            i <
            38;
            i++
        ) {

            addDecoration(

                i %
                3 ===
                0
                    ? "crystalPillar"
                    : "crystalShard",

                seededInt(
                    rng,
                    180,
                    2920
                ),

                seededInt(
                    rng,
                    170,
                    1920
                ),

                {
                    phase:
                        seededRange(
                            rng,
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


        for (
            let i = 0;
            i <
            10;
            i++
        ) {

            addEnemy({

                id:
                    `ruby_enemy_${i}`,

                x:
                    seededInt(
                        rng,
                        400,
                        2600
                    ),

                y:
                    seededInt(
                        rng,
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
                    292,

                attackRange:
                    82,

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
                920,

            maxHp:
                920,

            damage:
                44,

            speed:
                60,

            vision:
                410,

            attackRange:
                104,

            radius:
                41,

            color:
                "#a33b4f",

            drop:
                "fragmentoMemoria",

            dropAmount:
                3,

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
                arrivalSide:
                    "left"
            }
        );
    }


    /* =====================================================
       CAVERNA SOMBRIA
    ===================================================== */

    function buildShadow() {

        const rng =
            areaRng(
                "shadow",
                "objects"
            );


        addPath(

            [
                { x: 110, y: 1000 },
                { x: 720, y: 900 },
                { x: 1280, y: 1090 },
                { x: 1900, y: 920 },
                { x: 2500, y: 1010 },
                { x: 2920, y: 980 }
            ],

            74,

            "shadowTrail"
        );


        for (
            let i = 0;
            i <
            30;
            i++
        ) {

            addObstacle(

                seededInt(
                    rng,
                    170,
                    2720
                ),

                seededInt(
                    rng,
                    170,
                    1800
                ),

                seededInt(
                    rng,
                    54,
                    82
                ),

                seededInt(
                    rng,
                    40,
                    60
                ),

                "darkrock"
            );
        }


        for (
            let i = 0;
            i <
            22;
            i++
        ) {

            addDecoration(

                i %
                4 ===
                0
                    ? "shadowWhisper"
                    : "darkMist",

                seededInt(
                    rng,
                    180,
                    2760
                ),

                seededInt(
                    rng,
                    170,
                    1840
                ),

                {
                    phase:
                        seededRange(
                            rng,
                            0,
                            Math.PI *
                            2
                        )
                }
            );
        }


        for (
            let i = 0;
            i <
            9;
            i++
        ) {

            addEnemy({

                id:
                    `shadow_enemy_${i}`,

                x:
                    seededInt(
                        rng,
                        420,
                        2500
                    ),

                y:
                    seededInt(
                        rng,
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
                    290,

                attackRange:
                    72,

                radius:
                    25,

                color:
                    "#49425f",

                drop:
                    "essencia",

                dropAmount:
                    1,

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
                930,

            maxHp:
                930,

            damage:
                42,

            speed:
                63,

            vision:
                395,

            attackRange:
                94,

            radius:
                36,

            color:
                "#42364f",

            drop:
                "essencia",

            dropAmount:
                3,

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

            "LUZ ADIANTE",

            {
                arrivalSide:
                    "left"
            }
        );
    }


    /* =====================================================
       REINO DAS FADAS
    ===================================================== */

    function buildFairy() {

        const rng =
            areaRng(
                "fairy",
                "objects"
            );


        addPath(

            [
                { x: 120, y: 1120 },
                { x: 640, y: 990 },
                { x: 1180, y: 1180 },
                { x: 1720, y: 1020 },
                { x: 2260, y: 1170 },
                { x: 3100, y: 1080 }
            ],

            92,

            "fairyTrail"
        );


        for (
            let i = 0;
            i <
            28;
            i++
        ) {

            addResource(

                seededInt(
                    rng,
                    200,
                    3000
                ),

                seededInt(
                    rng,
                    180,
                    2000
                ),

                "cristal"
            );
        }


        for (
            let i = 0;
            i <
            34;
            i++
        ) {

            addDecoration(

                i %
                5 ===
                0

                    ? "fairyLamp"

                    : i %
                      3 ===
                      0

                    ? "flowerPatch"

                    : "fairySpark",

                seededInt(
                    rng,
                    150,
                    3050
                ),

                seededInt(
                    rng,
                    150,
                    2050
                ),

                {
                    phase:
                        seededRange(
                            rng,
                            0,
                            Math.PI *
                            2
                        )
                }
            );
        }


        for (
            let i = 0;
            i <
            7;
            i++
        ) {

            addEnemy({

                id:
                    `fairy_enemy_${i}`,

                x:
                    seededInt(
                        rng,
                        450,
                        2700
                    ),

                y:
                    seededInt(
                        rng,
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
                    300,

                attackRange:
                    74,

                radius:
                    24,

                color:
                    "#b887be",

                drop:
                    "cristal",

                dropAmount:
                    1,

                special:
                    i >=
                    4
                        ? "crystalShot"
                        : null
            });
        }


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
                1080,

            maxHp:
                1080,

            damage:
                44,

            speed:
                70,

            vision:
                415,

            attackRange:
                96,

            radius:
                37,

            color:
                "#cb8dd0",

            drop:
                "essencia",

            dropAmount:
                4,

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
                arrivalSide:
                    "left"
            }
        );
    }


    /* =====================================================
       CÉU
    ===================================================== */

    function buildSky() {

        const rng =
            areaRng(
                "sky",
                "objects"
            );


        addPath(

            [
                { x: 120, y: 1100 },
                { x: 650, y: 980 },
                { x: 1200, y: 1170 },
                { x: 1710, y: 1100 },
                { x: 2250, y: 990 },
                { x: 2800, y: 1140 },
                { x: 3320, y: 1090 }
            ],

            90,

            "skyBridge"
        );


        for (
            let i = 0;
            i <
            34;
            i++
        ) {

            addDecoration(

                i %
                5 ===
                0
                    ? "celestialPillar"
                    : "cloud",

                seededInt(
                    rng,
                    160,
                    3220
                ),

                seededInt(
                    rng,
                    140,
                    2050
                ),

                {
                    phase:
                        seededRange(
                            rng,
                            0,
                            Math.PI *
                            2
                        )
                }
            );
        }


        for (
            let i = 0;
            i <
            18;
            i++
        ) {

            addResource(

                seededInt(
                    rng,
                    220,
                    3080
                ),

                seededInt(
                    rng,
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


        for (
            let i = 0;
            i <
            6;
            i++
        ) {

            addEnemy({

                id:
                    `sky_patrol_${i}`,

                x:
                    450 +
                    i *
                    410,

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
                    325,

                attackRange:
                    82,

                radius:
                    27,

                color:
                    "#d3dde3",

                drop:
                    "cristal",

                dropAmount:
                    1,

                dropChance:
                    0.62,

                special:
                    i >=
                    3
                        ? "crystalShot"
                        : null
            });
        }


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

                visible:
                    () =>
                        Boolean(
                            state.player
                                .flutePlayed
                        ),

                arrivalSide:
                    "left"
            }
        );


        addSecret(

            420,
            350,

            "Banco nas Nuvens",

            "Alguém deixou um banco olhando para o vazio. No encosto está gravado: 'eu esperaria você de novo'.",

            "☁️"
        );
    }


    /* =====================================================
       INFERNO
    ===================================================== */

    function buildHell() {

        const rng =
            areaRng(
                "hell",
                "objects"
            );


        addPath(

            [
                { x: 120, y: 1200 },
                { x: 700, y: 1070 },
                { x: 1320, y: 1260 },
                { x: 1950, y: 1100 },
                { x: 2550, y: 1250 },
                { x: 3500, y: 1180 }
            ],

            98,

            "hellRoad"
        );


        for (
            let i = 0;
            i <
            44;
            i++
        ) {

            addObstacle(

                seededInt(
                    rng,
                    170,
                    3380
                ),

                seededInt(
                    rng,
                    160,
                    2150
                ),

                seededInt(
                    rng,
                    55,
                    105
                ),

                seededInt(
                    rng,
                    40,
                    80
                ),

                i %
                5 ===
                0
                    ? "obsidian"
                    : "basalt"
            );
        }


        for (
            let i = 0;
            i <
            42;
            i++
        ) {

            addDecoration(

                i %
                4 ===
                0

                    ? "lavaPool"

                    : i %
                      3 ===
                      0

                    ? "hellSmoke"

                    : "emberVent",

                seededInt(
                    rng,
                    160,
                    3400
                ),

                seededInt(
                    rng,
                    150,
                    2200
                ),

                {
                    phase:
                        seededRange(
                            rng,
                            0,
                            Math.PI *
                            2
                        )
                }
            );
        }


        const types = [

            [
                "DEMÔNIO DE CINZA",
                "🔥",
                "#8c4d3f",
                "essencia",
                "fireCircle"
            ],

            [
                "CÃO DE LAVA",
                "🐕",
                "#984b31",
                "couro",
                "dash"
            ],

            [
                "ESPECTRO CARMESIM",
                "👻",
                "#724056",
                "essencia",
                "shadowBurst"
            ],

            [
                "GÁRGULA QUEBRADA",
                "🗿",
                "#70554a",
                "ouro",
                "rockThrow"
            ],

            [
                "PARASITA DO VAZIO",
                "🕷️",
                "#4b3551",
                "essencia",
                "voidCircle"
            ]
        ];


        types.forEach(
            (
                [
                    name,
                    icon,
                    color,
                    drop,
                    special
                ],
                typeIndex
            ) => {

                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    addEnemy({

                        id:
                            `hell_${typeIndex}_${i}`,

                        x:
                            seededInt(
                                rng,
                                430,
                                3020
                            ),

                        y:
                            seededInt(
                                rng,
                                270,
                                2060
                            ),

                        name,
                        icon,

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
                            360,

                        attackRange:
                            84,

                        radius:
                            28,

                        color,
                        drop,

                        dropAmount:
                            1,

                        dropChance:
                            0.72,

                        special
                    });
                }
            }
        );


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
                1750,

            maxHp:
                1750,

            damage:
                62,

            speed:
                76,

            vision:
                455,

            attackRange:
                115,

            radius:
                44,

            color:
                "#a64139",

            drop:
                "fragmentoMemoria",

            dropAmount:
                6,

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
                arrivalSide:
                    "left"
            }
        );
    }


    /* =====================================================
       FINAL
    ===================================================== */

    function buildFinal() {

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

            special:
                "finalStorm"
        });
    }


    function hasDefeatedBoss(
        id
    ) {

        return Boolean(
            state.player
                ?.defeatedBosses
                ?.includes(
                    id
                )
        );
    }


    /* =====================================================
       COLISÕES
    ===================================================== */

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


    function rectsOverlap(
        a,
        b
    ) {

        return (
            a.x <
                b.x +
                b.w &&

            a.x +
                a.w >
                b.x &&

            a.y <
                b.y +
                b.h &&

            a.y +
                a.h >
                b.y
        );
    }


    /* =====================================================
       INTERIORES
    ===================================================== */

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
                key:
                    "ELIAN",

                dx:
                    0.72,

                dy:
                    0.68
            },


            forge: {
                key:
                    "BORIN",

                dx:
                    0.73,

                dy:
                    0.57
            },


            shop: {
                key:
                    "DORAN",

                dx:
                    0.58,

                dy:
                    0.34
            },


            woodshop: {
                key:
                    "BRAN",

                dx:
                    0.73,

                dy:
                    0.70
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


        const template =
            NPC_LIBRARY[
                config.key
            ];


        return [

            {
                ...template,

                id:
                    `inside_${state.currentHouse.id}_${template.name}`,

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

                interior:
                    true
            }
        ];
    }


    function getHouseFurniture() {

        if (
            !state.houseMode ||
            !state.currentHouse
        ) {

            return [];
        }


        const room =
            getHouseRoom();


        const id =
            state.currentHouse.id;


        const items =
            [];


        const push = (
            name,
            x,
            y,
            w,
            h,
            extra = {}
        ) =>
            items.push({
                name,
                x,
                y,
                w,
                h,
                ...extra
            });


        if (
            id ===
            "home"
        ) {

            push(
                "bed",
                room.x +
                44,
                room.y +
                48,
                160,
                105,

                {
                    interactable:
                        "sleep"
                }
            );


            push(
                "table",
                room.x +
                room.w /
                2 -
                72,
                room.y +
                room.h /
                2 -
                36,
                144,
                72
            );


            push(
                "fireplace",
                room.x +
                room.w -
                155,
                room.y +
                40,
                105,
                125
            );


            push(
                "chest",
                room.x +
                55,
                room.y +
                room.h -
                118,
                88,
                54
            );
        }


        else if (
            id ===
            "elianHome"
        ) {

            push(
                "bed",
                room.x +
                42,
                room.y +
                48,
                142,
                96
            );


            push(
                "bookshelf",
                room.x +
                room.w -
                174,
                room.y +
                38,
                128,
                170
            );


            push(
                "desk",
                room.x +
                room.w /
                2 -
                90,
                room.y +
                room.h /
                2 -
                40,
                180,
                80
            );


            push(
                "chair",
                room.x +
                room.w /
                2 -
                25,
                room.y +
                room.h /
                2 +
                55,
                50,
                50
            );
        }


        else if (
            id ===
            "forge"
        ) {

            push(
                "furnace",
                room.x +
                42,
                room.y +
                42,
                165,
                165,

                {
                    dangerous:
                        true
                }
            );


            push(
                "anvil",
                room.x +
                room.w /
                2 -
                65,
                room.y +
                room.h /
                2 -
                25,
                130,
                78
            );


            push(
                "toolRack",
                room.x +
                room.w -
                168,
                room.y +
                52,
                118,
                138
            );


            push(
                "oreCrate",
                room.x +
                room.w -
                172,
                room.y +
                room.h -
                128,
                120,
                72
            );
        }


        else if (
            id ===
            "shop"
        ) {

            push(
                "leftShelf",
                room.x +
                34,
                room.y +
                34,
                168,
                175
            );


            push(
                "rightShelf",
                room.x +
                room.w -
                202,
                room.y +
                34,
                168,
                175
            );


            push(
                "counter",
                room.x +
                room.w *
                0.45,
                room.y +
                room.h *
                0.46,
                room.w *
                0.48,
                72
            );


            push(
                "crate",
                room.x +
                55,
                room.y +
                room.h -
                125,
                94,
                62
            );
        }


        else if (
            id ===
            "woodshop"
        ) {

            push(
                "logStack",
                room.x +
                42,
                room.y +
                45,
                180,
                155
            );


            push(
                "workbench",
                room.x +
                room.w /
                2 -
                110,
                room.y +
                room.h /
                2 -
                42,
                220,
                84
            );


            push(
                "boardStack",
                room.x +
                room.w -
                200,
                room.y +
                48,
                150,
                170
            );


            push(
                "toolRack",
                room.x +
                room.w -
                182,
                room.y +
                room.h -
                118,
                132,
                66
            );
        }


        return items;
    }


    function getSleepTarget() {

        const bed =
            getHouseFurniture()
                .find(
                    item =>
                        item.interactable ===
                        "sleep"
                );


        if (
            !bed
        ) {

            return null;
        }


        return {

            x:
                bed.x +
                bed.w /
                2,

            y:
                bed.y +
                bed.h +
                32,

            bed
        };
    }


    /* =====================================================
       COLISÃO DO PLAYER
    ===================================================== */

    function canPlayerMoveTo(
        x,
        y,
        radius
    ) {

        if (
            state.houseMode
        ) {

            const room =
                getHouseRoom();


            const insideRoom = (

                x -
                    radius >=
                    room.x +
                    18 &&

                y -
                    radius >=
                    room.y +
                    18 &&

                x +
                    radius <=
                    room.x +
                    room.w -
                    18 &&

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


            for (
                const furniture of
                getHouseFurniture()
            ) {

                if (
                    circleRectCollision(
                        x,
                        y,
                        radius,
                        furniture
                    )
                ) {

                    return false;
                }
            }


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


    /* =====================================================
       COLISÃO DOS INIMIGOS
    ===================================================== */

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
            62;


        state.keys.clear();


        updateCamera();
    }


    /* =====================================================
       MOVIMENTO
    ===================================================== */

    function updateMovement(
        dt
    ) {

        if (
            state.paused ||
            !state.player ||
            state.player.stunTimer >
            0
        ) {

            return;
        }


        let dx =
            0;

        let dy =
            0;


        if (
            state.keys.has(
                "w"
            ) ||
            state.keys.has(
                "arrowup"
            )
        ) {

            dy--;
        }


        if (
            state.keys.has(
                "s"
            ) ||
            state.keys.has(
                "arrowdown"
            )
        ) {

            dy++;
        }


        if (
            state.keys.has(
                "a"
            ) ||
            state.keys.has(
                "arrowleft"
            )
        ) {

            dx--;
        }


        if (
            state.keys.has(
                "d"
            ) ||
            state.keys.has(
                "arrowright"
            )
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
            ) ||
            1;


        dx /=
            length;

        dy /=
            length;


        let speed =
            state.houseMode
                ? 130
                : state.player.speed;


        if (
            !state.houseMode &&
            state.player.hunger <=
            20
        ) {

            speed *=
                0.72;
        }


        if (
            !state.houseMode &&
            state.player.fatigue <=
            20
        ) {

            speed *=
                0.72;
        }


        const step =
            speed *
            dt;


        const nextX =
            state.player.x +
            dx *
            step;


        const nextY =
            state.player.y +
            dy *
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


        if (
            !state.houseMode &&
            Math.random() <
            dt *
            6
        ) {

            state.world
                .effects
                .push({

                    type:
                        "footstep",

                    x:
                        state.player.x -
                        dx *
                        10,

                    y:
                        state.player.y -
                        dy *
                        4,

                    life:
                        0.35,

                    maxLife:
                        0.35,

                    color:
                        state.area ===
                        "mountains"

                            ? "#dbe4e6"

                            : "#8d7858"
                });
        }
    }


    /* =====================================================
       SOBREVIVÊNCIA
    ===================================================== */

    function updateSurvival(
        dt
    ) {

        if (
            state.houseMode ||
            state.paused
        ) {

            return;
        }


        const player =
            state.player;


        player.hunger =
            clamp(
                player.hunger -
                0.12 *
                dt,
                0,
                100
            );


        player.fatigue =
            clamp(
                player.fatigue -
                0.09 *
                dt,
                0,
                100
            );


        player.magic =
            clamp(

                player.magic +

                (
                    player.hunger >
                    10
                        ? 1.55
                        : 0.7
                ) *
                dt,

                0,
                player.maxMagic
            );


        player.energy =
            clamp(

                player.energy +

                (
                    player.fatigue >
                    10
                        ? 2.7
                        : 1.1
                ) *
                dt,

                0,
                player.maxEnergy
            );


        if (
            player.hunger <=
                0 ||
            player.fatigue <=
                0
        ) {

            player.hp =
                clamp(
                    player.hp -
                    0.045 *
                    dt,
                    1,
                    player.maxHp
                );
        }


        document.body
            .classList
            .toggle(
                "low-needs",

                player.hunger <=
                    16 ||
                player.fatigue <=
                    16
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
                    "Você está com fome. Cenouras ajudam pouco; carne e pão recuperam mais."
                );

                state.warnedNeedAt =
                    now;
            }

            else if (
                player.fatigue <
                18
            ) {

                showToast(
                    "Você está exausto. Volte para sua casa e use E perto da cama para dormir."
                );

                state.warnedNeedAt =
                    now;
            }
        }
    }


    /* =====================================================
       IA - MOVIMENTO DO INIMIGO
    ===================================================== */

    function moveEnemyToward(
        enemy,
        targetX,
        targetY,
        dt,
        speedMultiplier = 1
    ) {

        const dx =
            targetX -
            enemy.x;


        const dy =
            targetY -
            enemy.y;


        const d =
            Math.hypot(
                dx,
                dy
            ) ||
            1;


        const speed =
            enemy.speed *
            speedMultiplier;


        const vx =
            (
                dx /
                d
            ) *
            speed *
            dt;


        const vy =
            (
                dy /
                d
            ) *
            speed *
            dt;


        let moved =
            false;


        if (
            canEnemyMoveTo(
                enemy.x +
                vx,

                enemy.y +
                vy,

                enemy.radius
            )
        ) {

            enemy.x +=
                vx;

            enemy.y +=
                vy;

            moved =
                true;
        }

        else {

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

                moved =
                    true;
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

                moved =
                    true;
            }
        }


        if (
            !moved
        ) {

            const side =
                enemy.aiSide ||
                (
                    enemy.aiSide =
                        Math.random() <
                        0.5
                            ? -1
                            : 1
                );


            const sx =
                (
                    -dy /
                    d
                ) *
                speed *
                dt *
                side;


            const sy =
                (
                    dx /
                    d
                ) *
                speed *
                dt *
                side;


            if (
                canEnemyMoveTo(
                    enemy.x +
                    sx,

                    enemy.y +
                    sy,

                    enemy.radius
                )
            ) {

                enemy.x +=
                    sx;

                enemy.y +=
                    sy;

                moved =
                    true;
            }

            else {

                enemy.aiSide *=
                    -1;
            }
        }


        return moved;
    }


    /* =====================================================
       INVESTIDA DO INIMIGO
    ===================================================== */

    function startEnemyCharge(
        enemy,
        targetX,
        targetY,
        speed = 430,
        duration = 0.45
    ) {

        const dx =
            targetX -
            enemy.x;


        const dy =
            targetY -
            enemy.y;


        const d =
            Math.hypot(
                dx,
                dy
            ) ||
            1;


        enemy.charge = {

            vx:
                (
                    dx /
                    d
                ) *
                speed,

            vy:
                (
                    dy /
                    d
                ) *
                speed,

            time:
                duration,

            hit:
                false,

            trailTimer:
                0
        };


        enemy.telegraphing =
            false;
    }


    function updateEnemyCharge(
        enemy,
        dt
    ) {

        const charge =
            enemy.charge;


        if (
            !charge
        ) {

            return false;
        }


        charge.time -=
            dt;


        charge.trailTimer -=
            dt;


        const nextX =
            enemy.x +
            charge.vx *
            dt;


        const nextY =
            enemy.y +
            charge.vy *
            dt;


        if (
            canEnemyMoveTo(
                nextX,
                nextY,
                enemy.radius
            )
        ) {

            enemy.x =
                nextX;

            enemy.y =
                nextY;
        }

        else {

            charge.time =
                0;


            shakeScreen(
                5,
                0.12
            );


            spawnParticles(

                enemy.x,
                enemy.y,

                enemy.color ||
                "#d0c5b8",

                10
            );
        }


        if (
            charge.trailTimer <=
            0
        ) {

            charge.trailTimer =
                0.035;


            state.world
                .effects
                .push({

                    type:
                        "chargeTrail",

                    x:
                        enemy.x,

                    y:
                        enemy.y,

                    radius:
                        enemy.radius,

                    life:
                        0.22,

                    maxLife:
                        0.22,

                    color:
                        enemy.color ||
                        "#d45d52"
                });
        }


        if (
            !charge.hit &&
            distance(
                enemy,
                state.player
            ) <=
            enemy.radius +
            state.player.radius +
            10
        ) {

            charge.hit =
                true;


            damagePlayer(
                Math.round(
                    enemy.damage *
                    1.15
                )
            );
        }


        if (
            charge.time <=
            0
        ) {

            enemy.charge =
                null;
        }


        return true;
    }
        /* =====================================================
       VETORES / INTERPOLAÇÃO
    ===================================================== */

    function normalizeVector(
        x,
        y
    ) {

        const length =
            Math.hypot(
                x,
                y
            ) ||
            1;


        return {

            x:
                x /
                length,

            y:
                y /
                length
        };
    }


    function lerp(
        a,
        b,
        t
    ) {

        return (
            a +
            (
                b -
                a
            ) *
            t
        );
    }


    /* =====================================================
       COOLDOWNS
    ===================================================== */

    function updateCooldowns(
        dt
    ) {

        const player =
            state.player;


        if (
            !player
        ) {

            return;
        }


        player.attackCooldown =
            Math.max(
                0,
                player.attackCooldown -
                dt
            );


        player.invincible =
            Math.max(
                0,
                player.invincible -
                dt
            );


        player.stunTimer =
            Math.max(
                0,
                (
                    player.stunTimer ||
                    0
                ) -
                dt
            );


        player.shieldTimer =
            Math.max(
                0,
                (
                    player.shieldTimer ||
                    0
                ) -
                dt
            );


        if (
            player.shieldTimer <=
            0
        ) {

            player.damageReduction =
                0;
        }


        [
            "q",
            "r",
            "f"
        ].forEach(
            key => {

                player
                    .skillCooldowns[
                        key
                    ] =
                    Math.max(
                        0,

                        (
                            player
                                .skillCooldowns[
                                    key
                                ] ||
                            0
                        ) -
                        dt
                    );
            }
        );
    }


    /* =====================================================
       ENCONTRAR INIMIGO
    ===================================================== */

    function findNearestEnemy(
        range
    ) {

        let nearest =
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
                    state.player,
                    enemy
                );


            if (
                d <=
                    range &&
                d <
                    bestDistance
            ) {

                nearest =
                    enemy;

                bestDistance =
                    d;
            }
        }


        return nearest;
    }


    function findEnemyToward(
        targetX,
        targetY,
        range,
        minimumDot = 0.25
    ) {

        const player =
            state.player;


        const aim =
            normalizeVector(

                targetX -
                player.x,

                targetY -
                player.y
            );


        let best =
            null;

        let bestScore =
            -Infinity;


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


            const dir =
                normalizeVector(
                    dx,
                    dy
                );


            const dot =
                aim.x *
                dir.x +
                aim.y *
                dir.y;


            if (
                dot <
                minimumDot
            ) {

                continue;
            }


            const score =
                dot *
                2 -
                d /
                range;


            if (
                score >
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


    /* =====================================================
       EFEITO DO ATAQUE BÁSICO
    ===================================================== */

    function createBasicAttackEffect(
        targetX,
        targetY
    ) {

        const player =
            state.player;


        const character =
            currentCharacter();


        const palette =
            getCharacterPalette();


        const dir =
            normalizeVector(

                targetX -
                player.x,

                targetY -
                player.y
            );


        const angle =
            Math.atan2(
                dir.y,
                dir.x
            );


        if (
            character.id ===
            "kaelion"
        ) {

            state.world
                .effects
                .push({

                    type:
                        "playerProjectile",

                    x:
                        player.x,

                    y:
                        player.y,

                    vx:
                        dir.x *
                        530,

                    vy:
                        dir.y *
                        530,

                    life:
                        0.42,

                    maxLife:
                        0.42,

                    radius:
                        12,

                    color:
                        palette.main,

                    glow:
                        palette.glow
                });


            spawnParticles(
                player.x,
                player.y,
                palette.main,
                5
            );
        }


        else if (
            character.id ===
            "lirael"
        ) {

            state.world
                .effects
                .push({

                    type:
                        "fairyShot",

                    x:
                        player.x,

                    y:
                        player.y,

                    vx:
                        dir.x *
                        610,

                    vy:
                        dir.y *
                        610,

                    life:
                        0.38,

                    maxLife:
                        0.38,

                    color:
                        palette.main,

                    glow:
                        palette.glow
                });


            spawnParticles(
                player.x,
                player.y,
                palette.glow,
                6
            );
        }


        else if (
            character.id ===
            "grumgar"
        ) {

            state.world
                .effects
                .push({

                    type:
                        "smashArc",

                    x:
                        player.x,

                    y:
                        player.y,

                    angle,

                    radius:
                        70,

                    life:
                        0.28,

                    maxLife:
                        0.28,

                    color:
                        palette.main
                });


            shakeScreen(
                3,
                0.08
            );
        }


        else if (
            character.id ===
            "theron"
        ) {

            state.world
                .effects
                .push({

                    type:
                        "bladeArc",

                    x:
                        player.x,

                    y:
                        player.y,

                    angle,

                    radius:
                        64,

                    life:
                        0.22,

                    maxLife:
                        0.22,

                    color:
                        palette.glow
                });
        }


        else {

            state.world
                .effects
                .push({

                    type:
                        "clawArc",

                    x:
                        player.x,

                    y:
                        player.y,

                    angle,

                    radius:
                        66,

                    life:
                        0.23,

                    maxLife:
                        0.23,

                    color:
                        palette.main
                });


            spawnParticles(
                player.x +
                dir.x *
                35,

                player.y +
                dir.y *
                35,

                palette.secondary,

                5
            );
        }
    }


    /* =====================================================
       ATAQUE BÁSICO
    ===================================================== */

    function performAttack(
        point = null
    ) {

        const player =
            state.player;


        if (
            !player ||
            state.paused ||
            state.houseMode ||
            player.dead ||
            player.stunTimer >
            0 ||
            isGameplayOverlayOpen()
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

            return;
        }


        const targetX =
            point?.x ??
            state.pointer.worldX;


        const targetY =
            point?.y ??
            state.pointer.worldY;


        const character =
            currentCharacter();


        const ranged =

            character.id ===
                "kaelion" ||

            character.id ===
                "lirael";


        const range =

            ranged
                ? 390

                : character.id ===
                  "grumgar"

                ? 150

                : 135;


        const target =
            findEnemyToward(

                targetX,
                targetY,

                range,

                ranged
                    ? 0.18
                    : 0.36
            );


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


        const attackSpeeds = {

            kaelion:
                0.37,

            theron:
                0.34,

            grumgar:
                0.50,

            lirael:
                0.28,

            zephyr:
                0.31
        };


        player.attackCooldown =
            attackSpeeds[
                character.id
            ] ||
            0.35;


        createBasicAttackEffect(
            targetX,
            targetY
        );


        if (
            !target
        ) {

            return;
        }


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
                    player.equipment
                        .weapon
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


        if (
            character.id ===
            "theron"
        ) {

            damage +=
                4;
        }


        if (
            character.id ===
                "lirael" &&
            target.type ===
                "final"
        ) {

            damage +=
                5;
        }


        attackEnemy(
            target,
            Math.round(
                damage
            )
        );
    }


    /* =====================================================
       DANO NO INIMIGO
    ===================================================== */

    function attackEnemy(
        enemy,
        amount
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


        const damage =
            Math.max(
                1,
                Math.round(
                    amount
                )
            );


        enemy.hp =
            Math.max(
                0,
                enemy.hp -
                damage
            );


        enemy.hitFlash =
            0.14;


        spawnParticles(

            enemy.x,
            enemy.y,

            damage >=
            60
                ? "#ffd06b"
                : "#ffffff",

            damage >=
            60
                ? 12
                : 7
        );


        state.world
            .effects
            .push({

                type:
                    "damageNumber",

                x:
                    enemy.x,

                y:
                    enemy.y -
                    enemy.radius -
                    10,

                text:
                    `-${damage}`,

                color:

                    damage >=
                    90

                        ? "#d78bff"

                        : damage >=
                          60

                        ? "#ff8b61"

                        : damage >=
                          35

                        ? "#ffd866"

                        : "#ffffff",

                life:
                    0.72,

                maxLife:
                    0.72
            });


        if (
            enemy.hp <=
            0
        ) {

            defeatEnemy(
                enemy
            );
        }
    }


    /* =====================================================
       DANO EM ÁREA
    ===================================================== */

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
                enemy.type ===
                    "progression" &&
                !enemy.accepted
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


        state.world
            .effects
            .push({

                type:
                    "skillRing",

                x,
                y,
                radius,

                color:
                    options.color ||
                    currentCharacter()
                        .color,

                life:
                    0.48,

                maxLife:
                    0.48
            });
    }


    /* =====================================================
       DANO NO PLAYER
    ===================================================== */

    function damagePlayer(
        amount
    ) {

        const player =
            state.player;


        if (
            !player ||
            player.dead ||
            player.invincible >
            0
        ) {

            return;
        }


        const armor =
            ITEMS[
                player.equipment
                    .armor
            ]?.defense ||
            0;


        let finalDamage =
            amount -
            (
                player.defense +
                armor
            ) *
            0.34;


        finalDamage *=
            1 -
            clamp(
                player.damageReduction ||
                0,
                0,
                0.72
            );


        finalDamage =
            Math.max(
                1,
                Math.round(
                    finalDamage
                )
            );


        player.hp =
            Math.max(
                0,
                player.hp -
                finalDamage
            );


        player.invincible =
            0.5;


        shakeScreen(
            Math.min(
                10,
                3 +
                finalDamage *
                0.05
            ),
            0.14
        );


        state.world
            .effects
            .push({

                type:
                    "damageNumber",

                x:
                    player.x,

                y:
                    player.y -
                    30,

                text:
                    `-${finalDamage}`,

                color:
                    "#ff766d",

                life:
                    0.7,

                maxLife:
                    0.7
            });


        spawnParticles(
            player.x,
            player.y,
            "#ff766d",
            8
        );


        if (
            player.hp <=
            0
        ) {

            playerDeath();
        }
    }


    /* =====================================================
       MORTE / RESPAWN
    ===================================================== */

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


    function respawnPlayer() {

        const checkpoint =
            state.player
                .checkpoint ||
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
                    0.72
                )
            );


        state.player.magic =
            Math.max(
                1,
                Math.floor(
                    state.player.maxMagic *
                    0.72
                )
            );


        state.player.energy =
            Math.max(
                1,
                Math.floor(
                    state.player.maxEnergy *
                    0.72
                )
            );


        state.player.hunger =
            Math.max(
                30,
                state.player.hunger
            );


        state.player.fatigue =
            Math.max(
                30,
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


    /* =====================================================
       SKILLS
    ===================================================== */

    function useSkill(
        key
    ) {

        const player =
            state.player;


        if (
            !player ||
            state.paused ||
            state.houseMode ||
            player.dead ||
            isGameplayOverlayOpen()
        ) {

            return;
        }


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
                `${skill.name} desbloqueia no nível ${skill.level}.`
            );

            return;
        }


        if (
            player.skillCooldowns[
                key
            ] >
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


        const character =
            currentCharacter();


        const palette =
            getCharacterPalette();


        const weaponBonus =
            ITEMS[
                player.equipment
                    .weapon
            ]?.damage ||
            0;


        const baseDamage =
            player.damage +
            weaponBonus;


        const point = {

            x:
                state.pointer.worldX ||
                player.x +
                1,

            y:
                state.pointer.worldY ||
                player.y
        };


        /* ================================================
           KAELION
        ================================================= */

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
                        point.x,
                        point.y,
                        470,
                        0.12
                    );


                state.world
                    .effects
                    .push({

                        type:
                            "memoryOrb",

                        x:
                            player.x,

                        y:
                            player.y,

                        tx:
                            point.x,

                        ty:
                            point.y,

                        color:
                            palette.main,

                        glow:
                            palette.glow,

                        life:
                            0.55,

                        maxLife:
                            0.55
                    });


                spawnParticles(
                    player.x,
                    player.y,
                    palette.glow,
                    13
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
                                baseDamage *
                                1.5 +
                                20
                            )
                        );
                    }
                }
            }


            else if (
                key ===
                "r"
            ) {

                damageEnemiesInRadius(

                    player.x,
                    player.y,

                    190,

                    Math.round(
                        baseDamage *
                        1.38 +
                        24
                    ),

                    {
                        stun:
                            0.9,

                        color:
                            palette.main
                    }
                );


                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    state.world
                        .effects
                        .push({

                            type:
                                "skillRing",

                            x:
                                player.x,

                            y:
                                player.y,

                            radius:
                                70 +
                                i *
                                55,

                            color:
                                i %
                                2
                                    ? palette.glow
                                    : palette.main,

                            life:
                                0.55 +
                                i *
                                0.09,

                            maxLife:
                                0.55 +
                                i *
                                0.09
                        });
                }


                shakeScreen(
                    5,
                    0.16
                );
            }


            else if (
                key ===
                "f"
            ) {

                for (
                    let i = 0;
                    i <
                    12;
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
                            50,
                            260
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


                    state.world
                        .effects
                        .push({

                            type:
                                "memoryStrike",

                            x,
                            y,

                            color:
                                i %
                                2
                                    ? palette.glow
                                    : palette.secondary,

                            life:
                                0.7,

                            maxLife:
                                0.7
                        });


                    damageEnemiesInRadius(

                        x,
                        y,

                        72,

                        Math.round(
                            baseDamage *
                            1.05 +
                            28
                        ),

                        {
                            color:
                                palette.main
                        }
                    );
                }


                shakeScreen(
                    9,
                    0.35
                );
            }
        }


        /* ================================================
           THERON
        ================================================= */

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
                        point.x,
                        point.y,
                        180,
                        0.18
                    );


                state.world
                    .effects
                    .push({

                        type:
                            "bladeArc",

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
                            92,

                        heavy:
                            true,

                        color:
                            palette.glow,

                        life:
                            0.34,

                        maxLife:
                            0.34
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
                                baseDamage *
                                1.72 +
                                18
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


                shakeScreen(
                    5,
                    0.12
                );
            }


            else if (
                key ===
                "r"
            ) {

                player.damageReduction =
                    0.45;

                player.shieldTimer =
                    5.5;


                state.world
                    .effects
                    .push({

                        type:
                            "shieldAura",

                        color:
                            palette.main,

                        life:
                            5.5,

                        maxLife:
                            5.5
                    });


                spawnParticles(
                    player.x,
                    player.y,
                    palette.glow,
                    26
                );
            }


            else if (
                key ===
                "f"
            ) {

                player.damageReduction =
                    0.6;

                player.shieldTimer =
                    7.5;


                damageEnemiesInRadius(

                    player.x,
                    player.y,

                    165,

                    Math.round(
                        baseDamage *
                        1.42 +
                        32
                    ),

                    {
                        stun:
                            1.1,

                        color:
                            palette.glow
                    }
                );


                state.world
                    .effects
                    .push({

                        type:
                            "shieldAura",

                        color:
                            "#ffe7a1",

                        life:
                            7.5,

                        maxLife:
                            7.5
                    });


                shakeScreen(
                    7,
                    0.2
                );
            }
        }


        /* ================================================
           GRUMGAR
        ================================================= */

        else if (
            character.id ===
            "grumgar"
        ) {

            if (
                key ===
                "q"
            ) {

                damageEnemiesInRadius(

                    player.x,
                    player.y,

                    145,

                    Math.round(
                        baseDamage *
                        1.75 +
                        25
                    ),

                    {
                        stun:
                            0.65,

                        color:
                            palette.main
                    }
                );


                state.world
                    .effects
                    .push({

                        type:
                            "groundCrack",

                        x:
                            player.x,

                        y:
                            player.y,

                        radius:
                            145,

                        color:
                            "#8b7049",

                        life:
                            0.55,

                        maxLife:
                            0.55
                    });


                shakeScreen(
                    10,
                    0.25
                );
            }


            else if (
                key ===
                "r"
            ) {

                damageEnemiesInRadius(

                    player.x,
                    player.y,

                    255,

                    Math.round(
                        baseDamage *
                        0.8 +
                        16
                    ),

                    {
                        stun:
                            2,

                        color:
                            palette.main
                    }
                );


                state.world
                    .effects
                    .push({

                        type:
                            "roarWave",

                        x:
                            player.x,

                        y:
                            player.y,

                        radius:
                            260,

                        color:
                            palette.glow,

                        life:
                            0.8,

                        maxLife:
                            0.8
                    });
            }


            else if (
                key ===
                "f"
            ) {

                damageEnemiesInRadius(

                    player.x,
                    player.y,

                    320,

                    Math.round(
                        baseDamage *
                        1.6 +
                        44
                    ),

                    {
                        stun:
                            1.4,

                        color:
                            palette.main
                    }
                );


                for (
                    let i = 0;
                    i <
                    5;
                    i++
                ) {

                    state.world
                        .effects
                        .push({

                            type:
                                "skillRing",

                            x:
                                player.x,

                            y:
                                player.y,

                            radius:
                                60 +
                                i *
                                56,

                            color:
                                i %
                                2
                                    ? "#bda26d"
                                    : palette.main,

                            life:
                                0.65 +
                                i *
                                0.08,

                            maxLife:
                                0.65 +
                                i *
                                0.08
                        });
                }


                shakeScreen(
                    15,
                    0.45
                );
            }
        }


        /* ================================================
           LIRAEL
        ================================================= */

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
                        point.x,
                        point.y,
                        480,
                        0.1
                    );


                state.world
                    .effects
                    .push({

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

                        color:
                            palette.main,

                        glow:
                            palette.glow,

                        life:
                            0.48,

                        maxLife:
                            0.48
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
                                baseDamage *
                                1.32 +
                                18
                            )
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


                state.world
                    .effects
                    .push({

                        type:
                            "healingAura",

                        x:
                            player.x,

                        y:
                            player.y,

                        radius:
                            105,

                        color:
                            palette.main,

                        life:
                            1,

                        maxLife:
                            1
                    });


                spawnParticles(
                    player.x,
                    player.y,
                    palette.glow,
                    34
                );
            }


            else if (
                key ===
                "f"
            ) {

                for (
                    let i = 0;
                    i <
                    12;
                    i++
                ) {

                    const x =
                        player.x +
                        random(
                            -250,
                            250
                        );


                    const y =
                        player.y +
                        random(
                            -250,
                            250
                        );


                    state.world
                        .effects
                        .push({

                            type:
                                "fairyStar",

                            x,
                            y,

                            color:
                                i %
                                2
                                    ? palette.main
                                    : palette.secondary,

                            life:
                                0.9,

                            maxLife:
                                0.9
                        });


                    damageEnemiesInRadius(

                        x,
                        y,

                        70,

                        Math.round(
                            baseDamage +
                            26
                        ),

                        {
                            color:
                                palette.main
                        }
                    );
                }
            }
        }


        /* ================================================
           ZEPHYR
        ================================================= */

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


                state.world
                    .effects
                    .push({

                        type:
                            "transformAura",

                        x:
                            player.x,

                        y:
                            player.y,

                        color:
                            palette.main,

                        life:
                            1.1,

                        maxLife:
                            1.1
                    });
            }


            else if (
                key ===
                "r"
            ) {

                const dir =
                    normalizeVector(

                        point.x -
                        player.x,

                        point.y -
                        player.y
                    );


                startPlayerDash(

                    dir.x,
                    dir.y,

                    190,
                    0.24,

                    () => {

                        damageEnemiesInRadius(

                            player.x,
                            player.y,

                            105,

                            Math.round(
                                baseDamage *
                                1.48 +
                                22
                            ),

                            {
                                color:
                                    palette.main
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
                        30
                    );


                state.world
                    .effects
                    .push({

                        type:
                            "transformAura",

                        x:
                            player.x,

                        y:
                            player.y,

                        ultimate:
                            true,

                        color:
                            palette.glow,

                        life:
                            1.6,

                        maxLife:
                            1.6
                    });


                spawnParticles(
                    player.x,
                    player.y,
                    palette.main,
                    40
                );
            }
        }


        player.hunger =
            Math.max(
                0,
                player.hunger -
                0.2
            );


        player.fatigue =
            Math.max(
                0,
                player.fatigue -
                0.32
            );


        showToast(
            skill.name
        );
    }


    /* =====================================================
       FORMA ADAPTATIVA
    ===================================================== */

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


        setTimeout(
            () => {

                if (
                    !state.player ||
                    !state.player.adaptiveBuff
                ) {

                    return;
                }


                state.player.speed =
                    Math.max(
                        1,
                        state.player.speed -
                        speedBonus
                    );


                state.player.damage =
                    Math.max(
                        1,
                        state.player.damage -
                        damageBonus
                    );


                state.player.adaptiveBuff =
                    false;
            },
            duration *
            1000
        );
    }


    /* =====================================================
       DASH DO PLAYER
    ===================================================== */

    function startPlayerDash(
        dirX,
        dirY,
        distanceAmount,
        duration,
        callback = null
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

            callback
        };
    }


    function updatePlayerDash(
        dt
    ) {

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


        const moved =
            canPlayerMoveTo(
                nextX,
                nextY,
                state.player.radius
            );


        if (
            moved
        ) {

            state.player.x =
                nextX;

            state.player.y =
                nextY;


            if (
                Math.random() <
                0.65
            ) {

                spawnParticles(

                    state.player.x,
                    state.player.y,

                    getCharacterPalette()
                        .main,

                    2
                );
            }
        }


        dash.remaining -=
            move;


        if (
            dash.remaining <=
                0 ||
            !moved
        ) {

            const callback =
                dash.callback;


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


    /* =====================================================
       FASES DOS BOSSES
    ===================================================== */

    function updateEnemyPhase(
        enemy
    ) {

        if (
            ![
                "progression",
                "resourceBoss",
                "final"
            ].includes(
                enemy.type
            )
        ) {

            enemy.phase =
                1;

            return;
        }


        const ratio =
            enemy.hp /
            enemy.maxHp;


        let phase =
            1;


        if (
            enemy.type ===
            "final"
        ) {

            phase =

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
        }

        else {

            phase =

                ratio >
                0.68
                    ? 1

                    : ratio >
                      0.34
                    ? 2

                    : 3;
        }


        if (
            phase ===
            enemy.phase
        ) {

            return;
        }


        enemy.phase =
            phase;


        enemy.specialTimer =
            Math.min(
                enemy.specialTimer ||
                1,
                0.6
            );


        state.world
            .effects
            .push({

                type:
                    "bossPhase",

                x:
                    enemy.x,

                y:
                    enemy.y,

                radius:
                    enemy.radius *
                    3.2,

                color:
                    enemy.color,

                life:
                    0.8,

                maxLife:
                    0.8
            });


        spawnParticles(
            enemy.x,
            enemy.y,
            enemy.color,
            30
        );


        shakeScreen(
            7,
            0.2
        );


        showToast(
            `${enemy.name} — FASE ${phase}`
        );
    }


    /* =====================================================
       HABILIDADES DOS INIMIGOS
    ===================================================== */

    function updateEnemySpecial(
        enemy
    ) {

        if (
            !enemy.special ||
            enemy.specialTimer >
            0 ||
            enemy.telegraphing ||
            enemy.charge
        ) {

            return;
        }


        const phase =
            Math.max(
                1,
                enemy.phase ||
                1
            );


        const px =
            state.player.x;


        const py =
            state.player.y;


        /* ================================================
           DASH
        ================================================= */

        if (
            enemy.special ===
            "dash"
        ) {

            enemy.telegraphing =
                true;


            state.world
                .effects
                .push({

                    type:
                        "dashWarning",

                    x:
                        enemy.x,

                    y:
                        enemy.y,

                    tx:
                        px,

                    ty:
                        py,

                    color:
                        "#ff6255",

                    life:
                        0.68,

                    maxLife:
                        0.68
                });


            setTimeout(
                () => {

                    if (
                        enemy.dead ||
                        !state.running
                    ) {

                        return;
                    }


                    startEnemyCharge(

                        enemy,

                        state.player.x,
                        state.player.y,

                        430 +
                        phase *
                        30,

                        0.45
                    );
                },
                680
            );


            enemy.specialTimer =
                Math.max(
                    2.7,
                    4.8 -
                    phase *
                    0.35
                );


            return;
        }


        /* ================================================
           PEDRA
        ================================================= */

        if (
            enemy.special ===
            "rockThrow"
        ) {

            enemy.telegraphing =
                true;


            addHazard(

                px,
                py,

                60,

                0.92,

                Math.round(
                    enemy.damage *
                    0.95
                ),

                {
                    kind:
                        "rock",

                    color:
                        "#ff5b4f"
                }
            );


            state.world
                .effects
                .push({

                    type:
                        "rockProjectile",

                    x:
                        enemy.x,

                    y:
                        enemy.y,

                    tx:
                        px,

                    ty:
                        py,

                    color:
                        "#8b8073",

                    life:
                        0.92,

                    maxLife:
                        0.92
                });


            setTimeout(
                () => {

                    enemy.telegraphing =
                        false;
                },
                960
            );


            enemy.specialTimer =
                random(
                    2.8,
                    4.1
                );


            return;
        }


        /* ================================================
           TIRO CRISTALINO
        ================================================= */

        if (
            enemy.special ===
            "crystalShot"
        ) {

            enemy.telegraphing =
                true;


            addHazard(

                px,
                py,

                48,

                0.7,

                Math.round(
                    enemy.damage *
                    0.92
                ),

                {
                    kind:
                        "crystal",

                    color:
                        "#ff5875"
                }
            );


            state.world
                .effects
                .push({

                    type:
                        "crystalProjectile",

                    x:
                        enemy.x,

                    y:
                        enemy.y,

                    tx:
                        px,

                    ty:
                        py,

                    color:
                        "#ef6581",

                    life:
                        0.7,

                    maxLife:
                        0.7
                });


            setTimeout(
                () => {

                    enemy.telegraphing =
                        false;
                },
                740
            );


            enemy.specialTimer =
                random(
                    2.6,
                    3.9
                );


            return;
        }


        /* ================================================
           ATAQUES EM ÁREA
        ================================================= */

        const configs = {

            memoryBurst: {

                radius:
                    78,

                delay:
                    0.9,

                multiplier:
                    1,

                count:
                    2 +
                    phase,

                spread:
                    145,

                color:
                    "#c94f50"
            },


            natureBurst: {

                radius:
                    105,

                delay:
                    0.95,

                multiplier:
                    1,

                count:
                    1 +
                    Math.floor(
                        phase /
                        2
                    ),

                spread:
                    105,

                color:
                    "#87aa5d"
            },


            rootCircle: {

                radius:
                    83,

                delay:
                    0.98,

                multiplier:
                    1.08,

                count:
                    2 +
                    phase,

                spread:
                    160,

                color:
                    "#598a51"
            },


            leafStorm: {

                radius:
                    70,

                delay:
                    0.84,

                multiplier:
                    1.05,

                count:
                    3 +
                    phase,

                spread:
                    190,

                color:
                    "#719663"
            },


            rockStorm: {

                radius:
                    74,

                delay:
                    0.88,

                multiplier:
                    1.13,

                count:
                    3 +
                    phase *
                    2,

                spread:
                    220,

                color:
                    "#81766e"
            },


            oreBurst: {

                radius:
                    72,

                delay:
                    0.84,

                multiplier:
                    1.1,

                count:
                    3 +
                    phase,

                spread:
                    175,

                color:
                    "#8c989c"
            },


            crystalRain: {

                radius:
                    66,

                delay:
                    0.73,

                multiplier:
                    1.12,

                count:
                    4 +
                    phase *
                    2,

                spread:
                    225,

                color:
                    "#e95172"
            },


            shadowBurst: {

                radius:
                    82,

                delay:
                    0.82,

                multiplier:
                    1.12,

                count:
                    3 +
                    phase,

                spread:
                    185,

                color:
                    "#705087"
            },


            voidCircle: {

                radius:
                    94,

                delay:
                    0.95,

                multiplier:
                    1.16,

                count:
                    2 +
                    phase,

                spread:
                    180,

                color:
                    "#503369"
            },


            fairyStorm: {

                radius:
                    65,

                delay:
                    0.7,

                multiplier:
                    1.13,

                count:
                    4 +
                    phase *
                    2,

                spread:
                    230,

                color:
                    "#d895dd"
            },


            fireCircle: {

                radius:
                    79,

                delay:
                    0.78,

                multiplier:
                    1.12,

                count:
                    2 +
                    phase,

                spread:
                    165,

                color:
                    "#f55f33"
            },


            infernalStorm: {

                radius:
                    82,

                delay:
                    0.64,

                multiplier:
                    1.22,

                count:
                    5 +
                    phase *
                    2,

                spread:
                    255,

                color:
                    "#f14f35"
            },


            finalStorm: {

                radius:
                    84,

                delay:
                    Math.max(
                        0.48,
                        0.72 -
                        phase *
                        0.035
                    ),

                multiplier:
                    1.18,

                count:
                    5 +
                    phase *
                    2,

                spread:
                    280,

                color:
                    "#a768e4"
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
                        50,
                        config.spread
                    );


            addHazard(

                px +
                Math.cos(
                    angle
                ) *
                spread,

                py +
                Math.sin(
                    angle
                ) *
                spread,

                config.radius,

                config.delay +
                i *
                0.04,

                Math.round(
                    enemy.damage *
                    config.multiplier
                ),

                {
                    kind:
                        enemy.special,

                    color:
                        config.color
                }
            );
        }


        state.world
            .effects
            .push({

                type:
                    "enemyCast",

                x:
                    enemy.x,

                y:
                    enemy.y,

                radius:
                    enemy.radius *
                    2.4,

                color:
                    config.color,

                life:
                    config.delay,

                maxLife:
                    config.delay
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

            (
                config.delay +
                0.1
            ) *
            1000
        );


        enemy.specialTimer =
            Math.max(
                1.6,

                random(
                    3.5,
                    5
                ) -
                phase *
                0.38
            );
    }


    /* =====================================================
       IA
    ===================================================== */

    function updateEnemies(
        dt
    ) {

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

                        enemy.accepted =
                            false;

                        enemy.aggressive =
                            false;

                        enemy.telegraphing =
                            false;

                        enemy.phase =
                            1;

                        enemy.specialTimer =
                            random(
                                1.6,
                                3
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
                    enemy.specialTimer -
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
                    enemy.stunTimer -
                    dt
                );


            if (
                updateEnemyCharge(
                    enemy,
                    dt
                )
            ) {

                continue;
            }


            const d =
                distance(
                    enemy,
                    state.player
                );


            if (
                enemy.type ===
                    "final" &&
                !state.player
                    .finalChoice
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
                Boss de progressão só persegue
                depois que a luta é aceita.
            */

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
            }


            if (
                !enemy.aggressive
            ) {

                continue;
            }


            if (
                d >
                    enemy.vision *
                    2.1 &&
                ![
                    "progression",
                    "final",
                    "hell"
                ].includes(
                    enemy.type
                )
            ) {

                enemy.aggressive =
                    false;

                enemy.state =
                    "idle";

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


            updateEnemySpecial(
                enemy
            );


            /*
                Durante o aviso vermelho,
                o inimigo se move devagar.
            */

            const moveMultiplier =
                enemy.telegraphing
                    ? 0.18
                    : 1;


            if (
                d >
                enemy.attackRange
            ) {

                moveEnemyToward(

                    enemy,

                    state.player.x,
                    state.player.y,

                    dt,

                    moveMultiplier
                );
            }

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
                        0.65,

                        1.16 -
                        enemy.phase *
                        0.07
                    );


                state.world
                    .effects
                    .push({

                        type:
                            "enemyHit",

                        x:
                            state.player.x,

                        y:
                            state.player.y,

                        color:
                            enemy.color,

                        life:
                            0.24,

                        maxLife:
                            0.24
                    });
            }
        }
    }


    /* =====================================================
       HAZARDS
    ===================================================== */

    function updateHazards(
        dt
    ) {

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
                hazard.delay <=
                0
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


                state.world
                    .effects
                    .push({

                        type:
                            "hazardImpact",

                        x:
                            hazard.x,

                        y:
                            hazard.y,

                        radius:
                            hazard.radius,

                        color:
                            hazard.color ||
                            "#ff7253",

                        life:
                            0.28,

                        maxLife:
                            0.28
                    });


                spawnParticles(

                    hazard.x,
                    hazard.y,

                    hazard.color ||
                    "#ff7253",

                    16
                );


                shakeScreen(
                    4,
                    0.1
                );
            }
        }


        state.world.hazards =
            state.world.hazards
                .filter(
                    hazard =>
                        hazard.life >
                        0
                );
    }


    /* =====================================================
       DROPS
    ===================================================== */

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
                    -15,
                    15
                ),

            y:
                y +
                random(
                    -15,
                    15
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
                    : 75,

            permanent:
                Boolean(
                    extra.permanent
                ),

            source:
                extra.source ||
                null,

            bob:
                random(
                    0,
                    Math.PI *
                    2
                ),

            collected:
                false
        };


        state.world
            .drops
            .push(
                drop
            );


        return drop;
    }


    function collectWorldDrop(
        drop
    ) {

        if (
            !drop ||
            drop.collected
        ) {

            return;
        }


        const item =
            ITEMS[
                drop.type
            ];


        if (
            !item
        ) {

            drop.collected =
                true;

            return;
        }


        if (
            item.unique &&
            (
                state.player
                    .inventory[
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
            "#ffd67b",
            12
        );


        showToast(
            `${item.name} coletado x${drop.amount}.`
        );


        if (
            drop.type ===
            "flautaMemoria"
        ) {

            showToast(
                "Flauta da Memória obtida. Tente tocá-la no Céu usando 4."
            );
        }


        saveGame(
            false
        );
    }


    function updateWorldDrops(
        dt
    ) {

        for (
            const drop of
            state.world.drops
        ) {

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
            state.world.drops
                .filter(
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


    /* =====================================================
       DERROTAR INIMIGO
    ===================================================== */

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

        enemy.aggressive =
            false;

        enemy.telegraphing =
            false;

        enemy.charge =
            null;


        spawnParticles(
            enemy.x,
            enemy.y,
            enemy.color,
            enemy.type ===
            "progression"
                ? 38
                : 18
        );


        state.world
            .effects
            .push({

                type:
                    "enemyDeath",

                x:
                    enemy.x,

                y:
                    enemy.y,

                radius:
                    enemy.radius *
                    2.5,

                color:
                    enemy.color,

                life:
                    0.65,

                maxLife:
                    0.65
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
                ? 65

                : enemy.horde
                ? 46 +
                  enemy.horde *
                  7

                : 30;


        const money =

            enemy.type ===
            "progression"
                ? 80

                : enemy.type ===
                  "resourceBoss"
                ? 45

                : enemy.type ===
                  "hell"
                ? 22

                : 12;


        state.player.xp +=
            xp;


        state.player.money +=
            money;


        if (
            enemy.drop &&
            ITEMS[
                enemy.drop
            ] &&
            Math.random() <=
            (
                enemy.dropChance ??
                1
            )
        ) {

            createWorldDrop(

                enemy.x,
                enemy.y,

                enemy.drop,

                enemy.dropAmount ||
                1,

                {
                    source:
                        enemy.name
                }
            );
        }


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
                "O Guardião derrubou a Flauta da Memória. Aproxime-se e pressione E."
            );
        }


        if (
            enemy.type ===
            "resourceBoss"
        ) {

            enemy.respawnTimer =
                enemy.respawnTime ||
                60;
        }


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
                `Boss derrotado: ${enemy.name}.`
            );
        }


        if (
            enemy.type ===
            "final"
        ) {

            state.player.finalDefeated =
                true;


            showEnding(
                "Você derrotou O Outro Eu e preservou as memórias de Veyra."
            );
        }


        checkLevelUp();


        saveGame(
            false
        );
    }


    /* =====================================================
       LEVEL UP
    ===================================================== */

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


            state.world
                .effects
                .push({

                    type:
                        "levelUp",

                    x:
                        player.x,

                    y:
                        player.y,

                    radius:
                        150,

                    color:
                        "#ffe18b",

                    life:
                        1.2,

                    maxLife:
                        1.2
                });


            spawnParticles(
                player.x,
                player.y,
                "#ffe18b",
                35
            );


            if (
                player.level ===
                5
            ) {

                showToast(
                    "NÍVEL 5! Habilidade R desbloqueada."
                );
            }

            else if (
                player.level ===
                10
            ) {

                showToast(
                    "NÍVEL 10! Habilidade F desbloqueada."
                );
            }

            else {

                showToast(
                    `Você chegou ao nível ${player.level}!`
                );
            }
        }
    }


    /* =====================================================
       INVENTÁRIO
    ===================================================== */

    function addItem(
        id,
        amount = 1
    ) {

        if (
            !ITEMS[
                id
            ] ||
            !state.player
        ) {

            return false;
        }


        const quantity =
            Math.max(
                1,
                Math.floor(
                    amount
                )
            );


        if (
            ITEMS[
                id
            ].unique &&
            (
                state.player
                    .inventory[
                        id
                    ] ||
                0
            ) >
            0
        ) {

            return false;
        }


        state.player
            .inventory[
                id
            ] =
            (
                state.player
                    .inventory[
                        id
                    ] ||
                0
            ) +
            quantity;


        return true;
    }


    function removeItem(
        id,
        amount = 1
    ) {

        const quantity =
            Math.max(
                1,
                Math.floor(
                    amount
                )
            );


        const current =
            state.player
                ?.inventory[
                    id
                ] ||
            0;


        if (
            current <
            quantity
        ) {

            return false;
        }


        state.player
            .inventory[
                id
            ] =
            current -
            quantity;


        return true;
    }


    function useItem(
        id
    ) {

        const item =
            ITEMS[
                id
            ];


        if (
            !item ||
            (
                state.player
                    .inventory[
                        id
                    ] ||
                0
            ) <=
            0
        ) {

            return;
        }


        if (
            id ===
            "flautaMemoria"
        ) {

            useMemoryFlute();

            return;
        }


        if (
            item.category ===
            "food"
        ) {

            removeItem(
                id,
                1
            );


            state.player.hunger =
                Math.min(
                    100,

                    state.player.hunger +
                    (
                        item.hunger ||
                        0
                    )
                );


            state.player.hp =
                Math.min(
                    state.player.maxHp,

                    state.player.hp +
                    (
                        item.heal ||
                        0
                    )
                );


            showToast(
                `${item.name} consumido.`
            );
        }


        else if (
            item.category ===
            "potions"
        ) {

            if (
                item.heal
            ) {

                if (
                    state.player.hp >=
                    state.player.maxHp
                ) {

                    showToast(
                        "Sua vida já está cheia."
                    );

                    return;
                }


                removeItem(
                    id,
                    1
                );


                state.player.hp =
                    Math.min(
                        state.player.maxHp,

                        state.player.hp +
                        item.heal
                    );


                spawnParticles(
                    state.player.x,
                    state.player.y,
                    "#ff7777",
                    18
                );
            }


            else if (
                item.energy
            ) {

                if (
                    state.player.energy >=
                    state.player.maxEnergy
                ) {

                    showToast(
                        "Sua energia já está cheia."
                    );

                    return;
                }


                removeItem(
                    id,
                    1
                );


                state.player.energy =
                    Math.min(
                        state.player.maxEnergy,

                        state.player.energy +
                        item.energy
                    );
            }


            showToast(
                `${item.name} usado.`
            );
        }


        else if (
            item.category ===
            "weapons"
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
            item.category ===
            "armor"
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


        saveGame(
            false
        );
    }


    /* =====================================================
       MADEIRA
    ===================================================== */

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
                "Magia insuficiente para cortar a árvore."
            );

            return;
        }


        state.player.magic -=
            4;


        state.player.hunger =
            Math.max(
                0,
                state.player.hunger -
                0.55
            );


        state.player.fatigue =
            Math.max(
                0,
                state.player.fatigue -
                1.1
            );


        tree.alive =
            false;


        tree.respawn =
            random(
                22,
                36
            );


        addItem(
            "madeira",
            tree.amount
        );


        state.player.xp +=
            5;


        spawnParticles(
            tree.x,
            tree.y,
            "#9a7045",
            17
        );


        state.world
            .effects
            .push({

                type:
                    "woodBurst",

                x:
                    tree.x,

                y:
                    tree.y,

                life:
                    0.6,

                maxLife:
                    0.6,

                color:
                    "#9b7245"
            });


        checkLevelUp();


        showToast(
            `Madeira coletada x${tree.amount}.`
        );
    }


    /* =====================================================
       MINÉRIO
    ===================================================== */

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

            carvao:
                6,

            ferro:
                11,

            ouro:
                20,

            rubi:
                28,

            cristal:
                16
        };


        const cost =
            costs[
                resource.type
            ] ||
            6;


        if (
            state.player.magic <
            cost
        ) {

            showToast(
                "Magia insuficiente para minerar."
            );

            return;
        }


        state.player.magic -=
            cost;


        state.player.fatigue =
            Math.max(
                0,
                state.player.fatigue -
                1.3
            );


        resource.alive =
            false;


        resource.respawn =
            random(
                28,
                45
            );


        addItem(
            resource.type,
            resource.amount
        );


        state.player.xp +=
            7;


        spawnParticles(

            resource.x,
            resource.y,

            resource.type ===
            "rubi"
                ? "#ff6481"

                : resource.type ===
                  "ouro"
                ? "#ffd76a"

                : resource.type ===
                  "cristal"
                ? "#ba9aff"

                : "#aeb9bd",

            17
        );


        state.world
            .effects
            .push({

                type:
                    "resourceBreak",

                x:
                    resource.x,

                y:
                    resource.y,

                color:
                    resource.type ===
                    "rubi"
                        ? "#ff6481"

                        : resource.type ===
                          "ouro"
                        ? "#ffd76a"

                        : "#b9c4c8",

                life:
                    0.55,

                maxLife:
                    0.55
            });


        checkLevelUp();


        showToast(
            `${ITEMS[resource.type].name} coletado x${resource.amount}.`
        );
    }


    /* =====================================================
       HOLD E
    ===================================================== */

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

                : interaction.object
                    .type ===
                    "rubi"
                ? 2.9

                : interaction.object
                    .type ===
                    "ouro"
                ? 2.4

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
                        interaction.object
                            .type
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


    function updateHoldInteraction(
        dt
    ) {

        const action =
            state.holdAction;


        if (
            !action
        ) {

            return;
        }


        if (
            !state.keys.has(
                "e"
            ) ||
            !action.object ||
            !action.object.alive ||
            state.paused
        ) {

            cancelHoldInteraction();

            return;
        }


        if (
            distance(
                state.player,
                action.object
            ) >
            82
        ) {

            cancelHoldInteraction();

            return;
        }


        action.elapsed +=
            dt;


        const percent =
            clamp(
                action.elapsed /
                action.duration *
                100,
                0,
                100
            );


        must(
            "holdProgressFill"
        ).style.width =
            `${percent}%`;


        if (
            Math.random() <
            0.09
        ) {

            spawnParticles(

                action.object.x,
                action.object.y,

                action.type ===
                "tree"
                    ? "#9d754c"
                    : "#c8cdce",

                2
            );
        }


        if (
            action.elapsed >=
            action.duration
        ) {

            const type =
                action.type;


            const object =
                action.object;


            cancelHoldInteraction();


            if (
                type ===
                "tree"
            ) {

                harvestTree(
                    object
                );
            }

            else {

                collectResource(
                    object
                );
            }
        }
    }


    /* =====================================================
       COMIDA DO CHÃO
    ===================================================== */

    function eatWorldFood(
        food
    ) {

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

            /*
                Cenoura recupera POUCO,
                como pedido.
            */

            const gain =
                10;


            state.player.hunger =
                Math.min(
                    100,
                    state.player.hunger +
                    gain
                );


            showToast(
                `Cenoura comida. +${gain} fome.`
            );


            spawnParticles(
                food.x,
                food.y,
                "#f2a04b",
                10
            );
        }
    }


    /* =====================================================
       RECURSOS / RESPAWN
    ===================================================== */

    function updateResources(
        dt
    ) {

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


    function respawnTree(
        tree
    ) {

        const rng =
            areaRng(
                state.area,
                `respawn:${tree.id}`
            );


        let tries =
            0;


        let x =
            tree.x;


        let y =
            tree.y;


        while (
            tries++ <
            70
        ) {

            const candidateX =
                seededInt(
                    rng,
                    120,
                    state.world.width -
                    120
                );


            const candidateY =
                seededInt(
                    rng,
                    120,
                    state.world.height -
                    120
                );


            if (
                canEnemyMoveTo(
                    candidateX,
                    candidateY,
                    32
                )
            ) {

                x =
                    candidateX;

                y =
                    candidateY;

                break;
            }
        }


        tree.x =
            x;

        tree.y =
            y;

        tree.amount =
            randomInt(
                2,
                5
            );

        tree.alive =
            true;


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


    /* =====================================================
       SEGREDOS
    ===================================================== */

    function discoverSecret(
        secret
    ) {

        if (
            !secret ||
            secret.found
        ) {

            return;
        }


        secret.found =
            true;


        if (
            !state.player
                .secretsFound
                .includes(
                    secret.id
                )
        ) {

            state.player
                .secretsFound
                .push(
                    secret.id
                );
        }


        state.player.xp +=
            22;


        state.player.memory =
            Math.min(
                100,
                state.player.memory +
                3
            );


        state.world
            .effects
            .push({

                type:
                    "secretReveal",

                x:
                    secret.x,

                y:
                    secret.y,

                radius:
                    110,

                color:
                    "#e9c978",

                life:
                    1.1,

                maxLife:
                    1.1
            });


        spawnParticles(
            secret.x,
            secret.y,
            "#e9c978",
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


    /* =====================================================
       INTERAÇÃO
    ===================================================== */

    function getInteraction() {

        if (
            !state.player
        ) {

            return null;
        }


        if (
            state.houseMode
        ) {

            let best =
                null;

            let bestDistance =
                Infinity;


            const sleepTarget =
                getSleepTarget();


            if (
                sleepTarget
            ) {

                const d =
                    distance(
                        state.player,
                        sleepTarget
                    );


                if (
                    d <=
                    78
                ) {

                    best = {

                        type:
                            "sleep",

                        object:
                            sleepTarget
                    };


                    bestDistance =
                        d;
                }
            }


            for (
                const npc of
                getInteriorNPCs()
            ) {

                const d =
                    distance(
                        state.player,
                        npc
                    );


                if (
                    d <=
                        82 &&
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


            const room =
                getHouseRoom();


            const door = {

                x:
                    room.x +
                    room.w /
                    2,

                y:
                    room.y +
                    room.h -
                    24
            };


            const doorDistance =
                distance(
                    state.player,
                    door
                );


            if (
                doorDistance <=
                    75 &&
                doorDistance <
                    bestDistance
            ) {

                best = {

                    type:
                        "exitHouse",

                    object:
                        state.currentHouse
                };
            }


            return best;
        }


        let best =
            null;

        let bestDistance =
            Infinity;


        const test = (
            type,
            object,
            limit
        ) => {

            const d =
                distance(
                    state.player,
                    object
                );


            if (
                d <=
                    limit &&
                d <
                    bestDistance
            ) {

                best = {
                    type,
                    object
                };


                bestDistance =
                    d;
            }
        };


        state.world.npcs
            .forEach(
                npc =>
                    test(
                        "npc",
                        npc,
                        74
                    )
            );


        state.world.trees
            .filter(
                tree =>
                    tree.alive
            )
            .forEach(
                tree =>
                    test(
                        "tree",
                        tree,
                        80
                    )
            );


        state.world.resources
            .filter(
                resource =>
                    resource.alive
            )
            .forEach(
                resource =>
                    test(
                        "resource",
                        resource,
                        78
                    )
            );


        state.world.foods
            .filter(
                food =>
                    food.alive
            )
            .forEach(
                food =>
                    test(
                        "food",
                        food,
                        72
                    )
            );


        state.world.drops
            .filter(
                drop =>
                    !drop.collected
            )
            .forEach(
                drop =>
                    test(
                        "drop",
                        drop,
                        82
                    )
            );


        state.world.secrets
            .filter(
                secret =>
                    !secret.found
            )
            .forEach(
                secret =>
                    test(
                        "secret",
                        secret,
                        78
                    )
            );


        state.world.trials
            .forEach(
                trial =>
                    test(
                        "trial",
                        trial,
                        95
                    )
            );


        state.world.enemies
            .filter(
                enemy =>
                    !enemy.dead &&
                    enemy.type ===
                    "progression"
            )
            .forEach(
                enemy =>
                    test(
                        "boss",
                        enemy,
                        120
                    )
            );


        for (
            const building of
            state.world.buildings
        ) {

            const door = {

                x:
                    building.x +
                    building.w /
                    2,

                y:
                    building.y +
                    building.h +
                    20
            };


            const d =
                distance(
                    state.player,
                    door
                );


            if (
                d <=
                    90 &&
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


        return best;
    }


    function playerAction() {

        if (
            !state.player ||
            state.paused
        ) {

            return;
        }


        if (
            state.dialogue
        ) {

            advanceDialogue();

            return;
        }


        const interaction =
            getInteraction();


        if (
            !interaction
        ) {

            return;
        }


        if (
            interaction.type ===
            "npc"
        ) {

            const npc =
                interaction.object;


            if (
                npc.merchant
            ) {

                openShop(
                    npc
                );
            }

            else if (
                npc.questId
            ) {

                openQuest(
                    npc
                );
            }

            else {

                startDialogue(
                    npc
                );
            }


            return;
        }


        if (
            interaction.type ===
                "tree" ||
            interaction.type ===
                "resource"
        ) {

            beginHoldInteraction(
                interaction
            );

            return;
        }


        if (
            interaction.type ===
            "drop"
        ) {

            collectWorldDrop(
                interaction.object
            );

            return;
        }


        if (
            interaction.type ===
            "food"
        ) {

            eatWorldFood(
                interaction.object
            );

            return;
        }


        if (
            interaction.type ===
            "secret"
        ) {

            discoverSecret(
                interaction.object
            );

            return;
        }


        if (
            interaction.type ===
            "trial"
        ) {

            startSkyTrial();

            return;
        }


        if (
            interaction.type ===
            "sleep"
        ) {

            sleepAtHome();

            return;
        }


        if (
            interaction.type ===
            "boss"
        ) {

            if (
                !interaction.object
                    .accepted
            ) {

                openBattle(
                    interaction.object
                );
            }


            return;
        }


        if (
            interaction.type ===
            "exitHouse"
        ) {

            exitHouse();
        }
    }


    /* =====================================================
       CASA
    ===================================================== */

    function enterNearestHouse() {

        let nearest =
            null;

        let nearestDistance =
            Infinity;


        for (
            const building of
            state.world.buildings
        ) {

            const door = {

                x:
                    building.x +
                    building.w /
                    2,

                y:
                    building.y +
                    building.h +
                    20
            };


            const d =
                distance(
                    state.player,
                    door
                );


            if (
                d <
                    92 &&
                d <
                    nearestDistance
            ) {

                nearest =
                    building;

                nearestDistance =
                    d;
            }
        }


        if (
            !nearest
        ) {

            showToast(
                "Aproxime-se da porta."
            );

            return;
        }


        state.paused =
            true;

        state.keys.clear();

        state.pointer.down =
            false;


        must(
            "transitionMessage"
        ).textContent =
            nearest.name;


        must(
            "transitionScreen"
        ).classList.remove(
            "hidden"
        );


        setTimeout(
            () => {

                state.houseReturn = {

                    x:
                        nearest.x +
                        nearest.w /
                        2,

                    y:
                        nearest.y +
                        nearest.h +
                        58
                };


                state.currentHouse =
                    nearest;


                state.houseMode =
                    true;


                placePlayerInsideHouse();


                must(
                    "transitionScreen"
                ).classList.add(
                    "hidden"
                );


                state.paused =
                    false;


                if (
                    nearest.id ===
                    "home"
                ) {

                    showToast(
                        "Aproxime-se da cama e pressione E para descansar."
                    );
                }
            },
            360
        );
    }


    function exitHouse() {

        if (
            !state.houseMode
        ) {

            return;
        }


        const returnPoint =
            state.houseReturn ||
            {

                x:
                    480,

                y:
                    610
            };


        state.paused =
            true;

        state.keys.clear();

        state.pointer.down =
            false;


        must(
            "transitionMessage"
        ).textContent =
            "VILA DO CREPÚSCULO";


        must(
            "transitionScreen"
        ).classList.remove(
            "hidden"
        );


        setTimeout(
            () => {

                state.houseMode =
                    false;


                state.currentHouse =
                    null;


                state.player.x =
                    returnPoint.x;


                state.player.y =
                    returnPoint.y;


                state.houseReturn =
                    null;


                must(
                    "transitionScreen"
                ).classList.add(
                    "hidden"
                );


                state.paused =
                    false;


                updateCamera();
            },
            340
        );
    }


    function sleepAtHome() {

        if (
            !state.houseMode ||
            state.currentHouse
                ?.id !==
                "home"
        ) {

            showToast(
                "Você só pode dormir na própria cama."
            );

            return;
        }


        state.paused =
            true;

        state.keys.clear();

        state.pointer.down =
            false;


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

                state.player.fatigue =
                    100;


                state.player.energy =
                    state.player.maxEnergy;


                state.player.magic =
                    state.player.maxMagic;


                state.player.hp =
                    Math.min(

                        state.player.maxHp,

                        state.player.hp +
                        Math.round(
                            state.player.maxHp *
                            0.32
                        )
                    );


                state.player.hunger =
                    Math.max(
                        0,
                        state.player.hunger -
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
                    "Você descansou. Cansaço, magia e energia recuperados."
                );


                saveGame(
                    false
                );
            },
            950
        );
    }


    /* =====================================================
       DIÁLOGOS
    ===================================================== */

    function startDialogue(
        npc
    ) {

        state.pointer.down =
            false;


        state.dialogue = {

            npc,

            lines:
                Array.isArray(
                    npc.lines
                )
                    ? npc.lines.slice()
                    : [
                        "..."
                    ],

            index:
                0,

            typing:
                false,

            timer:
                null
        };


        must(
            "dialogueBox"
        ).classList.remove(
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
            ] ||
            "...";


        let index =
            0;


        dialogue.typing =
            true;


        must(
            "dialogueSpeaker"
        ).textContent =
            dialogue.npc.name;


        must(
            "dialogueText"
        ).textContent =
            "";


        dialogue.timer =
            setInterval(
                () => {

                    index++;


                    must(
                        "dialogueText"
                    ).textContent =
                        line.slice(
                            0,
                            index
                        );


                    if (
                        index >=
                        line.length
                    ) {

                        clearInterval(
                            dialogue.timer
                        );


                        dialogue.typing =
                            false;
                    }
                },
                15
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


            must(
                "dialogueText"
            ).textContent =
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
            state.dialogue
                ?.timer
        ) {

            clearInterval(
                state.dialogue.timer
            );
        }


        state.dialogue =
            null;


        must(
            "dialogueBox"
        ).classList.add(
            "hidden"
        );
    }


    /* =====================================================
       MISSÕES
    ===================================================== */

    function openQuest(
        npc
    ) {

        state.questNPC =
            npc;


        const quest =
            state.player
                .quest[
                    npc.questId
                ];


        if (
            !quest
        ) {

            return;
        }


        const isWood =
            npc.questId ===
            "wood";


        const itemId =
            isWood
                ? "madeira"
                : "carvao";


        const current =
            state.player
                .inventory[
                    itemId
                ] ||
            0;


        must(
            "questTitle"
        ).textContent =
            isWood
                ? "Madeira para a Vila"
                : "Carvão para a Forja";


        must(
            "questText"
        ).textContent =
            isWood

                ? "Bran precisa de 10 madeiras para reforçar as construções da vila."

                : "Borin precisa de 8 carvões para manter a forja funcionando.";


        must(
            "questStatus"
        ).textContent =
            `Progresso: ${
                Math.min(
                    current,
                    quest.need
                )
            } / ${quest.need}`;


        const button =
            must(
                "questActionBtn"
            );


        button.disabled =
            quest.state ===
            "completed";


        button.textContent =

            quest.state ===
            "none"

                ? "ACEITAR"

                : quest.state ===
                  "accepted"

                ? "ENTREGAR"

                : "CONCLUÍDA";


        must(
            "questPanel"
        ).classList.remove(
            "hidden"
        );
    }


    function executeQuestAction() {

        const npc =
            state.questNPC;


        if (
            !npc
        ) {

            return;
        }


        const quest =
            state.player
                .quest[
                    npc.questId
                ];


        const itemId =
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


            saveGame(
                false
            );


            return;
        }


        if (
            quest.state ===
            "accepted"
        ) {

            if (
                (
                    state.player
                        .inventory[
                            itemId
                        ] ||
                    0
                ) <
                quest.need
            ) {

                showToast(
                    "Você ainda não tem todos os materiais."
                );

                return;
            }


            removeItem(
                itemId,
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


            saveGame(
                false
            );


            openQuest(
                npc
            );
        }
    }


    /* =====================================================
       BATALHA DE BOSS
    ===================================================== */

    function openBattle(
        enemy
    ) {

        if (
            !enemy ||
            enemy.dead
        ) {

            return;
        }


        state.battle =
            enemy;


        state.paused =
            true;


        state.pointer.down =
            false;


        state.keys.clear();


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


        must(
            "battleIcon"
        ).textContent =
            enemy.icon;


        must(
            "battleTitle"
        ).textContent =
            enemy.name;


        must(
            "battleText"
        ).textContent =
            "Este Guardião possui habilidades próprias. Observe o chão: círculos vermelhos indicam onde o ataque atingirá.";


        must(
            "battlePanel"
        ).classList.remove(
            "hidden"
        );


        saveGame(
            false
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


        state.battle.specialTimer =
            0.8;


        state.battle =
            null;


        state.paused =
            false;


        must(
            "battlePanel"
        ).classList.add(
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


        must(
            "battlePanel"
        ).classList.add(
            "hidden"
        );
    }


    /* =====================================================
       HORDAS DO CÉU
    ===================================================== */

    function startSkyTrial() {

        if (
            state.area !==
            "sky"
        ) {

            return;
        }


        const trial =
            state.player
                .skyTrial;


        if (
            trial.complete
        ) {

            showToast(
                "As cinco hordas já foram concluídas."
            );

            return;
        }


        if (
            trial.activeWave >
            0
        ) {

            showToast(
                "Derrote a horda atual."
            );

            return;
        }


        trial.started =
            true;


        spawnSkyWave(
            trial.wave +
            1
        );
    }


    function spawnSkyWave(
        wave
    ) {

        if (
            wave <
                1 ||
            wave >
                5
        ) {

            return;
        }


        const trial =
            state.player
                .skyTrial;


        trial.activeWave =
            wave;


        const amount =
            3 +
            wave *
            2;


        const centerX =
            1710;


        const centerY =
            1100;


        for (
            let i = 0;
            i <
            amount;
            i++
        ) {

            const angle =
                Math.PI *
                2 *
                i /
                amount;


            const radius =
                260 +
                random(
                    -30,
                    55
                );


            addEnemy({

                id:
                    `horde_${wave}_${Date.now()}_${i}`,

                x:
                    centerX +
                    Math.cos(
                        angle
                    ) *
                    radius,

                y:
                    centerY +
                    Math.sin(
                        angle
                    ) *
                    radius,

                name:
                    wave >=
                    4
                        ? "SENTINELA CELESTE"
                        : "SERAFIM DA HORDA",

                icon:
                    wave >=
                    4
                        ? "⚔️"
                        : "🪽",

                type:
                    "normal",

                horde:
                    wave,

                hp:
                    150 +
                    wave *
                    70,

                maxHp:
                    150 +
                    wave *
                    70,

                damage:
                    16 +
                    wave *
                    6,

                speed:
                    80 +
                    wave *
                    5,

                vision:
                    680,

                attackRange:
                    78,

                radius:
                    25,

                color:
                    "#d3dce2",

                drop:
                    wave ===
                    5
                        ? "cristal"
                        : null,

                dropChance:
                    0.55,

                special:
                    wave >=
                    5
                        ? "crystalRain"

                        : wave >=
                          3
                        ? "crystalShot"

                        : null
            });
        }


        showToast(
            `HORDA ${wave}/5!`
        );
    }


    function updateSkyTrial() {

        if (
            state.area !==
                "sky" ||
            !state.player
                .skyTrial
                .started ||
            state.player
                .skyTrial
                .complete
        ) {

            return;
        }


        const trial =
            state.player
                .skyTrial;


        if (
            trial.activeWave >
            0
        ) {

            const living =
                state.world
                    .enemies
                    .some(
                        enemy =>
                            enemy.horde ===
                                trial.activeWave &&
                            !enemy.dead
                    );


            if (
                living
            ) {

                return;
            }


            trial.wave =
                trial.activeWave;


            trial.activeWave =
                0;


            if (
                trial.wave >=
                5
            ) {

                trial.complete =
                    true;


                showToast(
                    "Cinco hordas derrotadas! O Guardião do Caminho apareceu."
                );


                spawnPathGuardian();


                saveGame(
                    false
                );


                return;
            }


            state.hordeNextAt =
                performance.now() +
                1800;
        }


        if (
            trial.activeWave ===
                0 &&
            trial.wave <
                5 &&
            state.hordeNextAt >
                0 &&
            performance.now() >=
                state.hordeNextAt
        ) {

            state.hordeNextAt =
                0;


            spawnSkyWave(
                trial.wave +
                1
            );
        }
    }


    function spawnPathGuardian() {

        if (
            state.world
                .enemies
                .some(
                    enemy =>
                        enemy.id ===
                            "path_guardian" &&
                        !enemy.dead
                ) ||
            hasDefeatedBoss(
                "path_guardian"
            )
        ) {

            return;
        }


        addEnemy({

            id:
                "path_guardian",

            x:
                2860,

            y:
                1100,

            name:
                "GUARDIÃO DO CAMINHO",

            icon:
                "🪽",

            type:
                "progression",

            hp:
                1480,

            maxHp:
                1480,

            damage:
                55,

            speed:
                74,

            vision:
                450,

            attackRange:
                110,

            radius:
                44,

            color:
                "#d1b66f",

            drop:
                null,

            unlock:
                "hell",

            special:
                "crystalRain"
        });
    }


    /* =====================================================
       FLAUTA
    ===================================================== */

    function useMemoryFlute() {

        if (
            state.area !==
            "sky"
        ) {

            showToast(
                "A Flauta só reage no Céu."
            );

            return;
        }


        if (
            (
                state.player
                    .inventory
                    .flautaMemoria ||
                0
            ) <=
            0
        ) {

            showToast(
                "Você ainda não possui a Flauta da Memória."
            );

            return;
        }


        if (
            state.player
                .flutePlayed
        ) {

            showToast(
                "A Escada do Inferno já foi revelada."
            );

            return;
        }


        state.player.flutePlayed =
            true;


        state.paused =
            true;


        state.pointer.down =
            false;


        must(
            "transitionMessage"
        ).textContent =
            "A MÚSICA FAZ O CÉU SE LEMBRAR...";


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
                    "A Escada do Inferno apareceu a leste."
                );


                saveGame(
                    false
                );
            },
            1250
        );
    }


    /* =====================================================
       PORTAIS
    ===================================================== */

    function checkPortals() {

        if (
            !state.player ||
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

            if (
                typeof portal.visible ===
                    "function" &&
                !portal.visible()
            ) {

                continue;
            }


            const inside =

                state.player.x >=
                    portal.x &&

                state.player.x <=
                    portal.x +
                    portal.w &&

                state.player.y >=
                    portal.y &&

                state.player.y <=
                    portal.y +
                    portal.h;


            if (
                !inside
            ) {

                continue;
            }


            const allowed =

                typeof portal.requirement ===
                "function"

                    ? portal.requirement()

                    : true;


            if (
                !allowed
            ) {

                showToast(
                    portal.stairs
                        ? "A passagem ainda não foi revelada."
                        : "O caminho está bloqueado."
                );


                if (
                    portal.direction ===
                    "back"
                ) {

                    state.player.x =
                        portal.x +
                        portal.w +
                        55;
                }

                else {

                    state.player.x =
                        portal.x -
                        55;
                }


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


        state.pointer.down =
            false;


        state.keys.clear();


        must(
            "travelText"
        ).textContent =

            portal.returnPortal

                ? `Voltar para ${REGIONS[portal.target].name}?`

                : `Seguir para ${portal.title}?`;


        must(
            "travelPanel"
        ).classList.remove(
            "hidden"
        );
    }


    function confirmTravel() {

        if (
            !state.travel
        ) {

            return;
        }


        const portal =
            state.travel;


        state.travel =
            null;


        must(
            "travelPanel"
        ).classList.add(
            "hidden"
        );


        transitionTo(
            portal.target,
            portal
        );
    }


    function cancelTravel() {

        const portal =
            state.travel;


        state.travel =
            null;


        state.paused =
            false;


        state.portalCooldown =
            1.2;


        must(
            "travelPanel"
        ).classList.add(
            "hidden"
        );


        if (
            portal
        ) {

            if (
                portal.direction ===
                "back"
            ) {

                state.player.x =
                    portal.x +
                    portal.w +
                    55;
            }

            else {

                state.player.x =
                    portal.x -
                    55;
            }
        }
    }


    function transitionTo(
        target,
        portal
    ) {

        if (
            !REGIONS[
                target
            ]
        ) {

            return;
        }


        state.paused =
            true;


        state.pointer.down =
            false;


        state.keys.clear();


        cancelHoldInteraction();


        must(
            "transitionMessage"
        ).textContent =
            REGIONS[
                target
            ].name;


        must(
            "transitionScreen"
        ).classList.remove(
            "hidden"
        );


        setTimeout(
            () => {

                state.area =
                    target;


                state.houseMode =
                    false;

                state.currentHouse =
                    null;

                state.houseReturn =
                    null;


                state.finalChoiceShown =
                    false;


                buildWorld();


                const fromBackPortal =
                    portal?.direction ===
                    "back";


                if (
                    fromBackPortal
                ) {

                    state.player.x =
                        state.world.width -
                        170;
                }

                else {

                    state.player.x =
                        170;
                }


                state.player.y =
                    state.world.height /
                    2;


                let safety =
                    0;


                while (
                    !canPlayerMoveTo(

                        state.player.x,
                        state.player.y,
                        state.player.radius
                    ) &&
                    safety++ <
                    30
                ) {

                    state.player.y +=
                        25;
                }


                state.player.checkpoint = {

                    area:
                        target,

                    x:
                        state.player.x,

                    y:
                        state.player.y
                };


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


                state.player.magic =
                    Math.min(
                        state.player.maxMagic,

                        state.player.magic +
                        state.player.maxMagic *
                        0.2
                    );


                state.player.energy =
                    Math.min(
                        state.player.maxEnergy,

                        state.player.energy +
                        state.player.maxEnergy *
                        0.25
                    );


                state.portalCooldown =
                    1.5;


                must(
                    "transitionScreen"
                ).classList.add(
                    "hidden"
                );


                state.paused =
                    false;


                updateCamera();


                saveGame(
                    false
                );


                showToast(
                    `Você chegou a ${REGIONS[target].name}.`
                );
            },
            650
        );
    }


    /* =====================================================
       LOJA
    ===================================================== */

    function openShop(
        npc
    ) {

        state.shopNPC =
            npc;


        state.shopMode =
            "buy";


        document
            .querySelectorAll(
                "#shopTabs .tab"
            )
            .forEach(
                tab =>
                    tab.classList.toggle(
                        "active",
                        tab.dataset.shop ===
                        "buy"
                    )
            );


        must(
            "shopTitle"
        ).textContent =
            `LOJA DE ${npc.name}`;


        renderShop();


        must(
            "shopPanel"
        ).classList.remove(
            "hidden"
        );
    }


    function createShopRow(
        item,
        text,
        callback
    ) {

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
                    Valor base ${item.value}
                </small>

            </div>

            <div class="shop-price">
                ${text}
            </div>

            <button
                type="button"
                class="primary-btn"
            >
                OK
            </button>
        `;


        row
            .querySelector(
                "button"
            )
            .addEventListener(
                "click",
                callback
            );


        return row;
    }


    function renderShop() {

        const grid =
            must(
                "shopGrid"
            );


        grid.innerHTML =
            "";


        if (
            state.shopMode ===
            "buy"
        ) {

            [
                "pao",
                "carneCaca",
                "pocao",
                "elixir",
                "espadaFerro",
                "armaduraCouro"
            ]
                .forEach(
                    id => {

                        const item =
                            ITEMS[
                                id
                            ];


                        grid.appendChild(

                            createShopRow(

                                item,

                                `Comprar • ${item.value} 🪙`,

                                () => {

                                    if (
                                        state.player.money <
                                        item.value
                                    ) {

                                        showToast(
                                            "Moedas insuficientes."
                                        );

                                        return;
                                    }


                                    state.player.money -=
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


                                    saveGame(
                                        false
                                    );
                                }
                            )
                        );
                    }
                );


            return;
        }


        const sellData =
            getSellAllData();


        const sellAll =
            document.createElement(
                "div"
            );


        sellAll.className =
            "sell-all-row";


        const sellAllButton =
            document.createElement(
                "button"
            );


        sellAllButton.type =
            "button";


        sellAllButton.className =
            "primary-btn sell-all-btn";


        sellAllButton.disabled =
            sellData.value <=
            0;


        sellAllButton.textContent =

            sellData.value >
            0

                ? `VENDER TUDO • ${sellData.value} MOEDAS`

                : "NADA PARA VENDER";


        sellAllButton.addEventListener(
            "click",
            sellAllItems
        );


        sellAll.appendChild(
            sellAllButton
        );


        grid.appendChild(
            sellAll
        );


        let available =
            0;


        Object.entries(
            state.player.inventory
        )
            .forEach(
                (
                    [
                        id,
                        amount
                    ]
                ) => {

                    if (
                        amount <=
                        0
                    ) {

                        return;
                    }


                    const item =
                        ITEMS[
                            id
                        ];


                    if (
                        !item ||
                        item.unique ||
                        id ===
                            state.player
                                .equipment
                                .weapon ||
                        id ===
                            state.player
                                .equipment
                                .armor ||
                        id ===
                            state.player
                                .equipment
                                .tool
                    ) {

                        return;
                    }


                    const price =
                        Math.max(
                            1,
                            Math.floor(
                                item.value *
                                0.7
                            )
                        );


                    available++;


                    grid.appendChild(

                        createShopRow(

                            item,

                            `Vender por ${price} • x${amount}`,

                            () => {

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
                                    `${item.name} vendido.`
                                );


                                renderShop();


                                updateHUD();


                                saveGame(
                                    false
                                );
                            }
                        )
                    );
                }
            );


        if (
            !available
        ) {

            const empty =
                document.createElement(
                    "p"
                );


            empty.className =
                "muted";


            empty.textContent =
                "Nenhum item disponível para venda.";


            grid.appendChild(
                empty
            );
        }
    }


    function getSellAllData() {

        let value =
            0;


        let amount =
            0;


        const items =
            [];


        Object.entries(
            state.player.inventory
        )
            .forEach(
                (
                    [
                        id,
                        count
                    ]
                ) => {

                    const item =
                        ITEMS[
                            id
                        ];


                    if (
                        !item ||
                        count <=
                            0 ||
                        item.unique ||
                        id ===
                            state.player
                                .equipment
                                .weapon ||
                        id ===
                            state.player
                                .equipment
                                .armor ||
                        id ===
                            state.player
                                .equipment
                                .tool
                    ) {

                        return;
                    }


                    if (
                        ![
                            "materials",
                            "special"
                        ].includes(
                            item.category
                        )
                    ) {

                        return;
                    }


                    const price =
                        Math.max(
                            1,
                            Math.floor(
                                item.value *
                                0.7
                            )
                        );


                    value +=
                        price *
                        count;


                    amount +=
                        count;


                    items.push({
                        id,
                        count
                    });
                }
            );


        return {
            value,
            amount,
            items
        };
    }


    function sellAllItems() {

        const data =
            getSellAllData();


        if (
            !data.items.length
        ) {

            showToast(
                "Nada para vender."
            );

            return;
        }


        for (
            const entry of
            data.items
        ) {

            state.player
                .inventory[
                    entry.id
                ] =
                Math.max(
                    0,

                    state.player
                        .inventory[
                            entry.id
                        ] -
                    entry.count
                );
        }


        state.player.money +=
            data.value;


        showToast(
            `${data.amount} itens vendidos por ${data.value} moedas.`
        );


        renderShop();


        updateHUD();


        saveGame(
            false
        );
    }


    /* =====================================================
       INVENTÁRIO VISUAL
    ===================================================== */

    function updateInventory() {

        if (
            !state.player
        ) {

            return;
        }


        const grid =
            must(
                "inventoryGrid"
            );


        grid.innerHTML =
            "";


        Object.entries(
            state.player.inventory
        )
            .forEach(
                (
                    [
                        id,
                        amount
                    ]
                ) => {

                    if (
                        amount <=
                        0
                    ) {

                        return;
                    }


                    const item =
                        ITEMS[
                            id
                        ];


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


                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "inventory-item";


                    button.innerHTML = `

                        <span class="icon">
                            ${item.icon}
                        </span>

                        <span class="name">
                            ${item.name}
                        </span>

                        <span class="count">
                            x${amount}
                        </span>
                    `;


                    button.addEventListener(
                        "click",
                        () =>
                            useItem(
                                id
                            )
                    );


                    grid.appendChild(
                        button
                    );
                }
            );


        if (
            !grid.children.length
        ) {

            const empty =
                document.createElement(
                    "p"
                );


            empty.className =
                "muted";


            empty.textContent =
                "Nenhum item nesta categoria.";


            grid.appendChild(
                empty
            );
        }


        let weight =
            0;


        Object.entries(
            state.player.inventory
        )
            .forEach(
                (
                    [
                        id,
                        amount
                    ]
                ) => {

                    weight +=
                        (
                            ITEMS[
                                id
                            ]?.weight ||
                            0
                        ) *
                        amount;
                }
            );


        must(
            "weightText"
        ).textContent =
            `${weight}/100`;


        updateEquipment();
    }


    function updateEquipment() {

        const grid =
            must(
                "equipmentGrid"
            );


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

                ${
                    state.player
                        .equipment
                        .weapon

                        ? `
                            <button
                                type="button"
                                data-unequip="weapon"
                            >
                                Desequipar
                            </button>
                        `

                        : ""
                }

            </div>


            <div class="equipment-slot">

                Armadura

                <strong>
                    ${armor}
                </strong>

                ${
                    state.player
                        .equipment
                        .armor

                        ? `
                            <button
                                type="button"
                                data-unequip="armor"
                            >
                                Desequipar
                            </button>
                        `

                        : ""
                }

            </div>


            <div class="equipment-slot">

                Ferramenta

                <strong>
                    ${tool}
                </strong>

            </div>
        `;


        grid
            .querySelectorAll(
                "[data-unequip]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            state.player
                                .equipment[
                                    button.dataset
                                        .unequip
                                ] =
                                null;


                            updateInventory();


                            saveGame(
                                false
                            );
                        }
                    );
                }
            );
    }


    /* =====================================================
       LIVRO
    ===================================================== */

    function renderBook() {

        const container =
            must(
                "bossBook"
            );


        container.innerHTML =
            "";


        for (
            const boss of
            BOSS_REGISTRY
        ) {

            const defeated =

                state.player
                    .defeatedBosses
                    .includes(
                        boss.id
                    ) ||

                (
                    boss.id ===
                        "other_self" &&
                    state.player
                        .finalDefeated
                );


            const discovered =

                defeated ||

                state.player
                    .discoveredBosses
                    .includes(
                        boss.id
                    );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "boss-entry";


            card.innerHTML =

                discovered

                    ? `

                        <div class="symbol">
                            ${boss.icon}
                        </div>

                        <strong>
                            ${boss.name}
                        </strong>

                        <p>
                            ${
                                defeated
                                    ? "✓ DERROTADO"
                                    : "DESCOBERTO"
                            }
                        </p>

                        <p class="boss-lore">
                            ${boss.description}
                        </p>

                        <p class="boss-quote">
                            “${boss.quote}”
                        </p>
                    `

                    : `

                        <div class="symbol">
                            ?
                        </div>

                        <strong>
                            DESCONHECIDO
                        </strong>

                        <p>
                            Encontre este Guardião para revelar o registro.
                        </p>
                    `;


            container.appendChild(
                card
            );
        }
    }


    /* =====================================================
       ESCOLHA FINAL
    ===================================================== */

    function openFinalChoice() {

        if (
            state.finalChoiceShown
        ) {

            return;
        }


        state.finalChoiceShown =
            true;


        state.paused =
            true;


        state.pointer.down =
            false;


        const accepted =
            window.confirm(

                "O Outro Eu oferece a Quietude Absoluta.\n\nOK = aceitar a Quietude.\nCancelar = rejeitar e lutar."
            );


        state.player.finalChoice =
            accepted
                ? "join"
                : "fight";


        state.paused =
            false;


        if (
            accepted
        ) {

            showEnding(
                "Você aceitou a Quietude Absoluta. Veyra finalmente ficou em silêncio."
            );


            return;
        }


        const boss =
            state.world
                .enemies
                .find(
                    enemy =>
                        enemy.id ===
                        "other_self"
                );


        if (
            boss
        ) {

            boss.accepted =
                true;

            boss.aggressive =
                true;

            boss.specialTimer =
                0.8;
        }


        showToast(
            "A batalha final começou."
        );
    }


    function showEnding(
        message
    ) {

        state.running =
            false;


        state.paused =
            true;


        saveGame(
            false
        );


        must(
            "transitionMessage"
        ).textContent =
            message;


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


                showScreen(
                    "menu"
                );


                updateContinueButton();
            },
            2800
        );
    }


    /* =====================================================
       PARTÍCULAS
    ===================================================== */

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


    function updateVisualEffects(
        dt
    ) {

        for (
            const particle of
            state.world.particles
        ) {

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
        }


        state.world.particles =
            state.world.particles
                .filter(
                    particle =>
                        particle.life >
                        0
                );


        for (
            const effect of
            state.world.effects
        ) {

            if (
                Number.isFinite(
                    effect.life
                )
            ) {

                effect.life -=
                    dt;
            }


            if (
                effect.type ===
                    "playerProjectile" ||
                effect.type ===
                    "fairyShot"
            ) {

                effect.x +=
                    effect.vx *
                    dt;


                effect.y +=
                    effect.vy *
                    dt;
            }
        }


        state.world.effects =
            state.world.effects
                .filter(
                    effect =>
                        !Number.isFinite(
                            effect.life
                        ) ||
                        effect.life >
                        0
                );


        if (
            state.screenShake >
            0
        ) {

            state.screenShake =
                Math.max(
                    0,
                    state.screenShake -
                    dt
                );


            if (
                state.screenShake <=
                0
            ) {

                state.screenShakePower =
                    0;
            }
        }
    }
        /* =====================================================
       CÂMERA
    ===================================================== */

    function updateCamera() {

        if (
            !state.player
        ) {

            return;
        }


        const viewWidth =
            window.innerWidth;


        const viewHeight =
            window.innerHeight;


        if (
            state.houseMode
        ) {

            const room =
                getHouseRoom();


            state.camera.x =
                clamp(

                    room.x +
                    room.w /
                    2 -
                    viewWidth /
                    2,

                    0,

                    Math.max(
                        0,
                        state.world.width -
                        viewWidth
                    )
                );


            state.camera.y =
                clamp(

                    room.y +
                    room.h /
                    2 -
                    viewHeight /
                    2,

                    0,

                    Math.max(
                        0,
                        state.world.height -
                        viewHeight
                    )
                );


            return;
        }


        state.camera.x =
            clamp(

                state.player.x -
                viewWidth /
                2,

                0,

                Math.max(
                    0,
                    state.world.width -
                    viewWidth
                )
            );


        state.camera.y =
            clamp(

                state.player.y -
                viewHeight /
                2,

                0,

                Math.max(
                    0,
                    state.world.height -
                    viewHeight
                )
            );
    }


    /* =====================================================
       BARRAS DO HUD
    ===================================================== */

    function setBar(
        id,
        value,
        max
    ) {

        const percent =

            max >
            0

                ? clamp(
                    value /
                    max *
                    100,
                    0,
                    100
                )

                : 0;


        must(
            id
        ).style.width =
            `${percent}%`;
    }


    /* =====================================================
       HUD
    ===================================================== */

    function updateHUD() {

        const player =
            state.player;


        if (
            !player
        ) {

            return;
        }


        must(
            "hudAvatar"
        ).textContent =
            player.icon;


        must(
            "hudClass"
        ).textContent =
            player.className;


        must(
            "hudName"
        ).textContent =
            player.name;


        must(
            "moneyText"
        ).textContent =
            player.money;


        must(
            "levelText"
        ).textContent =
            player.level;


        must(
            "xpText"
        ).textContent =
            `${player.xp} / ${player.xpToNext}`;


        must(
            "hpText"
        ).textContent =
            `${Math.ceil(
                player.hp
            )}/${player.maxHp}`;


        must(
            "magicText"
        ).textContent =
            `${Math.ceil(
                player.magic
            )}/${Math.ceil(
                player.maxMagic
            )}`;


        must(
            "energyText"
        ).textContent =
            `${Math.ceil(
                player.energy
            )}/${player.maxEnergy}`;


        must(
            "hungerText"
        ).textContent =
            Math.ceil(
                player.hunger
            );


        must(
            "fatigueText"
        ).textContent =
            Math.ceil(
                player.fatigue
            );


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


        updateSkillHUD();


        updateInteractionHint();
    }


    /* =====================================================
       HUD DAS HABILIDADES
    ===================================================== */

    function updateSkillHUD() {

        if (
            !state.player
        ) {

            return;
        }


        const skills =
            getCharacterSkills();


        const palette =
            getCharacterPalette();


        const slots = [

            [
                "q",
                "skillQName",
                "skillQCooldown"
            ],

            [
                "r",
                "skillRName",
                "skillRCooldown"
            ],

            [
                "f",
                "skillFName",
                "skillFCooldown"
            ]
        ];


        slots.forEach(
            (
                [
                    key,
                    nameId,
                    cooldownId
                ]
            ) => {

                const skill =
                    skills[
                        key
                    ];


                if (
                    !skill
                ) {

                    return;
                }


                const slot =
                    document.querySelector(
                        `[data-skill-slot="${key}"]`
                    );


                if (
                    slot
                ) {

                    slot.style.setProperty(
                        "--skill-color",
                        palette.main
                    );


                    slot.style.setProperty(
                        "--skill-secondary",
                        palette.glow
                    );
                }


                must(
                    nameId
                ).textContent =
                    skill.name;


                const locked =
                    state.player.level <
                    skill.level;


                const cooldown =
                    state.player
                        .skillCooldowns[
                            key
                        ] ||
                    0;


                if (
                    slot
                ) {

                    slot.classList.toggle(
                        "locked",
                        locked
                    );


                    slot.classList.toggle(

                        "cooldown",

                        !locked &&
                        cooldown >
                        0
                    );
                }


                if (
                    locked
                ) {

                    must(
                        cooldownId
                    ).textContent =
                        `NÍVEL ${skill.level}`;
                }

                else if (
                    cooldown >
                    0
                ) {

                    must(
                        cooldownId
                    ).textContent =
                        `${cooldown.toFixed(
                            1
                        )}s`;
                }

                else {

                    must(
                        cooldownId
                    ).textContent =
                        "PRONTA";
                }
            }
        );
    }


    /* =====================================================
       PAINÉIS ABERTOS
    ===================================================== */

    function isGameplayOverlayOpen() {

        const ids = [

            "inventoryPanel",
            "mapPanel",
            "bookPanel",
            "shopPanel",
            "questPanel"
        ];


        return ids.some(
            id => {

                const panel =
                    $(
                        id
                    );


                return Boolean(
                    panel &&
                    !panel.classList.contains(
                        "hidden"
                    )
                );
            }
        );
    }


    /* =====================================================
       DICA DE INTERAÇÃO
    ===================================================== */

    function updateInteractionHint() {

        const hint =
            must(
                "interactionHint"
            );


        if (
            !state.player ||
            state.paused ||
            state.dialogue ||
            state.travel ||
            state.battle ||
            state.holdAction ||
            isGameplayOverlayOpen()
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


        let key =
            "E";


        let text =
            "Interagir";


        if (
            interaction.type ===
            "house"
        ) {

            key =
                "Z";


            text =
                `Entrar em ${interaction.object.name}`;
        }


        else if (
            interaction.type ===
            "exitHouse"
        ) {

            key =
                "Z";


            text =
                "Sair pela porta";
        }


        else if (
            interaction.type ===
            "npc"
        ) {

            const npc =
                interaction.object;


            if (
                npc.merchant
            ) {

                text =
                    `Comprar e vender com ${npc.name}`;
            }

            else {

                text =
                    `Falar com ${npc.name}`;
            }
        }


        else if (
            interaction.type ===
            "tree"
        ) {

            text =
                "Segure E para cortar madeira";
        }


        else if (
            interaction.type ===
            "resource"
        ) {

            text =
                `Segure E para coletar ${
                    ITEMS[
                        interaction.object
                            .type
                    ]?.name ||
                    "recurso"
                }`;
        }


        else if (
            interaction.type ===
            "food"
        ) {

            text =
                interaction.object
                    .type ===
                    "carrot"

                    ? "Comer cenoura"

                    : "Comer";
        }


        else if (
            interaction.type ===
            "drop"
        ) {

            const item =
                ITEMS[
                    interaction.object
                        .type
                ];


            text =
                `Pegar ${
                    item?.name ||
                    "item"
                } x${interaction.object.amount}`;
        }


        else if (
            interaction.type ===
            "secret"
        ) {

            text =
                "Investigar";
        }


        else if (
            interaction.type ===
            "sleep"
        ) {

            text =
                "Dormir e descansar";
        }


        else if (
            interaction.type ===
            "trial"
        ) {

            const trial =
                state.player
                    .skyTrial;


            text =
                trial.complete

                    ? "Cinco hordas concluídas"

                    : trial.activeWave >
                      0

                    ? `Horda ${trial.activeWave}/5 em andamento`

                    : `Iniciar Horda ${
                        Math.min(
                            5,
                            trial.wave +
                            1
                        )
                    }/5`;
        }


        else if (
            interaction.type ===
            "boss"
        ) {

            text =
                interaction.object
                    .accepted

                    ? `${interaction.object.name} está em combate`

                    : `Desafiar ${interaction.object.name}`;
        }


        must(
            "interactionKey"
        ).textContent =
            key;


        must(
            "interactionText"
        ).textContent =
            text;
    }


    /* =====================================================
       FECHAR PAINÉIS
    ===================================================== */

    function closeOverlayPanelsExcept(
        exceptionId =
            null
    ) {

        const ids = [

            "inventoryPanel",
            "mapPanel",
            "bookPanel",
            "shopPanel",
            "questPanel"
        ];


        ids.forEach(
            id => {

                if (
                    id ===
                    exceptionId
                ) {

                    return;
                }


                must(
                    id
                ).classList.add(
                    "hidden"
                );
            }
        );
    }


    function togglePanel(
        panelId,
        onOpen =
            null
    ) {

        if (
            !state.player
        ) {

            return;
        }


        const panel =
            must(
                panelId
            );


        const opening =
            panel.classList.contains(
                "hidden"
            );


        closeOverlayPanelsExcept(
            panelId
        );


        if (
            opening
        ) {

            state.pointer.down =
                false;


            state.keys.clear();


            cancelHoldInteraction();


            if (
                typeof onOpen ===
                "function"
            ) {

                onOpen();
            }


            panel.classList.remove(
                "hidden"
            );
        }

        else {

            panel.classList.add(
                "hidden"
            );
        }
    }


    function closeAllPanels() {

        [

            "inventoryPanel",
            "mapPanel",
            "bookPanel",
            "shopPanel",
            "questPanel",
            "battlePanel",
            "travelPanel",
            "deathPanel"
        ]
            .forEach(
                id => {

                    const panel =
                        $(
                            id
                        );


                    if (
                        panel
                    ) {

                        panel.classList.add(
                            "hidden"
                        );
                    }
                }
            );


        closeDialogue();


        state.shopNPC =
            null;


        state.questNPC =
            null;


        state.travel =
            null;


        state.battle =
            null;
    }


    /* =====================================================
       Z - PORTAS
    ===================================================== */

    function handleZ() {

        if (
            state.paused ||
            !state.player
        ) {

            return;
        }


        if (
            state.houseMode
        ) {

            const interaction =
                getInteraction();


            if (
                interaction?.type ===
                "exitHouse"
            ) {

                exitHouse();
            }

            else {

                showToast(
                    "Aproxime-se da porta para sair."
                );
            }


            return;
        }


        enterNearestHouse();
    }


    /* =====================================================
       VOLTAR AO MENU
    ===================================================== */

    function returnToMenu() {

        if (
            state.player
        ) {

            saveGame(
                false
            );
        }


        state.running =
            false;


        state.paused =
            false;


        state.pointer.down =
            false;


        state.keys.clear();


        cancelHoldInteraction();


        closeAllPanels();


        document.body
            .classList
            .remove(
                "low-needs"
            );


        fadeToScreen(
            "menu",
            updateContinueButton
        );
    }


    /* =====================================================
       UPDATE PRINCIPAL
    ===================================================== */

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


        updateCooldowns(
            dt
        );


        updatePlayerDash(
            dt
        );


        updateResources(
            dt
        );


        updateVisualEffects(
            dt
        );


        const overlay =
            isGameplayOverlayOpen();


        if (
            !state.paused &&
            !overlay
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


            updateHazards(
                dt
            );


            updateHoldInteraction(
                dt
            );


            updateSkyTrial();


            checkPortals();


            /*
                ATAQUE CONTÍNUO SEGURANDO O MOUSE.

                Agora não ataca infinitamente por frame:
                performAttack possui cooldown específico
                de cada personagem.
            */

            if (
                state.pointer.down &&
                !state.houseMode &&
                state.player
                    .attackCooldown <=
                    0
            ) {

                performAttack({

                    x:
                        state.pointer
                            .worldX,

                    y:
                        state.pointer
                            .worldY
                });
            }
        }


        updateCamera();


        updateHUD();


        if (
            !must(
                "mapPanel"
            ).classList.contains(
                "hidden"
            )
        ) {

            drawLargeMap();
        }
    }


    /* =====================================================
       LOOP
    ===================================================== */

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


        draw();


        requestAnimationFrame(
            gameLoop
        );
    }


    /* =====================================================
       DESENHO PRINCIPAL
    ===================================================== */

    function draw() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        let shakeX =
            0;


        let shakeY =
            0;


        if (
            state.screenShake >
            0
        ) {

            shakeX =
                random(
                    -state.screenShakePower,
                    state.screenShakePower
                );


            shakeY =
                random(
                    -state.screenShakePower,
                    state.screenShakePower
                );
        }


        ctx.save();


        ctx.translate(

            -state.camera.x +
            shakeX,

            -state.camera.y +
            shakeY
        );


        if (
            state.houseMode
        ) {

            drawHouseInterior();


            drawEffects();


            drawPlayer();


            drawParticles();
        }

        else {

            drawGround();


            drawPaths();


            drawAmbientDetails();


            drawDecorations();


            drawBuildings();


            drawTrees();


            drawResources();


            drawFoods();


            drawSecrets();


            drawObstacles();


            drawPortals();


            drawDrops();


            drawHazards();


            drawEffects();


            drawNPCs();


            drawEnemies();


            drawPlayer();


            drawWorldLabels();


            drawParticles();
        }


        ctx.restore();


        drawMinimap();
    }


    /* =====================================================
       CHÃO
    ===================================================== */

    function drawGround() {

        const visual =
            REGIONS[
                state.area
            ].visual;


        const colors = {

            village:
                "#526c4b",

            forest:
                "#3d6041",

            grove:
                "#34583a",

            mountains:
                "#92999b",

            iron:
                "#292e31",

            ruby:
                "#48252b",

            shadow:
                "#171d2e",

            fairy:
                "#59456b",

            sky:
                "#92b2c8",

            hell:
                "#45201f",

            final:
                "#18171b"
        };


        ctx.fillStyle =
            colors[
                visual
            ] ||
            "#536b4b";


        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );


        /*
            Textura quadriculada quase invisível.
        */

        const tile =
            72;


        for (
            let y = 72;
            y <
            state.world.height;
            y +=
            tile
        ) {

            for (
                let x = 72;
                x <
                state.world.width;
                x +=
                tile
            ) {

                ctx.fillStyle =

                    (
                        (
                            x /
                            tile +
                            y /
                            tile
                        ) %
                        2 ===
                        0
                    )

                        ? "rgba(255,255,255,.011)"

                        : "rgba(0,0,0,.014)";


                ctx.fillRect(
                    x,
                    y,
                    tile,
                    tile
                );
            }
        }


        if (
            visual ===
            "ruby"
        ) {

            ctx.fillStyle =
                `rgba(255,70,90,${
                    0.025 +
                    (
                        Math.sin(
                            state.time *
                            2
                        ) +
                        1
                    ) *
                    0.015
                })`;


            ctx.fillRect(
                0,
                0,
                state.world.width,
                state.world.height
            );
        }


        if (
            visual ===
            "fairy"
        ) {

            const gradient =
                ctx.createRadialGradient(

                    state.world.width /
                    2,

                    state.world.height /
                    2,

                    100,

                    state.world.width /
                    2,

                    state.world.height /
                    2,

                    1400
                );


            gradient.addColorStop(
                0,
                "rgba(244,186,255,.12)"
            );


            gradient.addColorStop(
                1,
                "rgba(90,60,130,0)"
            );


            ctx.fillStyle =
                gradient;


            ctx.fillRect(
                0,
                0,
                state.world.width,
                state.world.height
            );
        }


        if (
            visual ===
            "hell"
        ) {

            ctx.fillStyle =
                `rgba(255,76,24,${
                    0.025 +
                    (
                        Math.sin(
                            state.time *
                            2.4
                        ) +
                        1
                    ) *
                    0.012
                })`;


            ctx.fillRect(
                0,
                0,
                state.world.width,
                state.world.height
            );
        }


        if (
            visual ===
            "final"
        ) {

            const gradient =
                ctx.createRadialGradient(

                    1100,
                    750,
                    80,

                    1100,
                    750,
                    900
                );


            gradient.addColorStop(
                0,
                "rgba(139,92,175,.15)"
            );


            gradient.addColorStop(
                1,
                "rgba(0,0,0,.45)"
            );


            ctx.fillStyle =
                gradient;


            ctx.fillRect(
                0,
                0,
                state.world.width,
                state.world.height
            );
        }
    }


    /* =====================================================
       CAMINHOS
    ===================================================== */

    function drawPaths() {

        for (
            const path of
            state.world.paths
        ) {

            if (
                !Array.isArray(
                    path.points
                ) ||
                path.points.length <
                2
            ) {

                continue;
            }


            const colors = {

                villageRoad:
                    "rgba(183,154,104,.72)",

                forestTrail:
                    "rgba(117,102,70,.48)",

                groveTrail:
                    "rgba(118,108,77,.43)",

                snowTrail:
                    "rgba(210,211,205,.43)",

                mineTrack:
                    "rgba(99,89,76,.40)",

                crystalTrail:
                    "rgba(115,72,75,.42)",

                shadowTrail:
                    "rgba(84,76,103,.32)",

                fairyTrail:
                    "rgba(196,151,204,.29)",

                skyBridge:
                    "rgba(242,234,205,.40)",

                hellRoad:
                    "rgba(89,62,53,.55)"
            };


            ctx.strokeStyle =
                colors[
                    path.kind
                ] ||
                "rgba(120,105,80,.42)";


            ctx.lineWidth =
                path.width;


            ctx.lineCap =
                "round";


            ctx.lineJoin =
                "round";


            ctx.beginPath();


            path.points.forEach(
                (
                    point,
                    index
                ) => {

                    if (
                        index ===
                        0
                    ) {

                        ctx.moveTo(
                            point.x,
                            point.y
                        );
                    }

                    else {

                        ctx.lineTo(
                            point.x,
                            point.y
                        );
                    }
                }
            );


            ctx.stroke();


            /*
                Borda suave do caminho.
            */

            ctx.strokeStyle =
                "rgba(255,255,255,.025)";


            ctx.lineWidth =
                Math.max(
                    2,
                    path.width -
                    18
                );


            ctx.stroke();
        }
    }


    /* =====================================================
       AMBIENTE
    ===================================================== */

    function drawAmbientDetails() {

        const visual =
            REGIONS[
                state.area
            ].visual;


        /*
            GRAMA.
        */

        if (
            [
                "village",
                "forest",
                "grove"
            ].includes(
                visual
            )
        ) {

            ctx.strokeStyle =
                "rgba(25,73,36,.32)";


            ctx.lineWidth =
                2;


            for (
                let y = 110;
                y <
                state.world.height -
                90;
                y +=
                92
            ) {

                for (
                    let x = 110;
                    x <
                    state.world.width -
                    90;
                    x +=
                    92
                ) {

                    if (
                        (
                            x *
                            5 +
                            y *
                            7
                        ) %
                        17 <
                        7
                    ) {

                        ctx.beginPath();


                        ctx.moveTo(
                            x,
                            y +
                            5
                        );


                        ctx.lineTo(
                            x -
                            4,
                            y -
                            5
                        );


                        ctx.moveTo(
                            x,
                            y +
                            5
                        );


                        ctx.lineTo(
                            x +
                            5,
                            y -
                            4
                        );


                        ctx.stroke();
                    }
                }
            }
        }


        /*
            VAGALUMES.
        */

        if (
            visual ===
                "forest" ||
            visual ===
                "grove"
        ) {

            for (
                let i = 0;
                i <
                38;
                i++
            ) {

                const x =
                    (
                        i *
                        293 +
                        state.time *
                        (
                            5 +
                            i %
                            4
                        )
                    ) %
                    state.world.width;


                const y =
                    (
                        i *
                        177 +
                        Math.sin(
                            state.time +
                            i
                        ) *
                        25 +
                        state.world.height
                    ) %
                    state.world.height;


                const alpha =
                    0.12 +
                    (
                        Math.sin(
                            state.time *
                            3 +
                            i
                        ) +
                        1
                    ) *
                    0.12;


                ctx.fillStyle =
                    `rgba(219,247,161,${alpha})`;


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    2 +
                    i %
                    2,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();
            }
        }


        /*
            VENTO DAS MONTANHAS.
        */

        if (
            visual ===
            "mountains"
        ) {

            ctx.strokeStyle =
                "rgba(255,255,255,.20)";


            ctx.lineWidth =
                2;


            for (
                let i = 0;
                i <
                25;
                i++
            ) {

                const x =
                    (
                        i *
                        191 +
                        state.time *
                        72
                    ) %
                    state.world.width;


                const y =
                    (
                        i *
                        127 +
                        state.time *
                        10
                    ) %
                    state.world.height;


                ctx.beginPath();


                ctx.moveTo(
                    x,
                    y
                );


                ctx.lineTo(
                    x +
                    55,
                    y -
                    8
                );


                ctx.stroke();
            }
        }


        /*
            POEIRA DAS CAVERNAS.
        */

        if (
            [
                "iron",
                "ruby",
                "shadow"
            ].includes(
                visual
            )
        ) {

            for (
                let i = 0;
                i <
                30;
                i++
            ) {

                const x =
                    (
                        i *
                        347 +
                        state.time *
                        4
                    ) %
                    state.world.width;


                const y =
                    (
                        i *
                        229 -
                        state.time *
                        7 +
                        state.world.height
                    ) %
                    state.world.height;


                ctx.fillStyle =

                    visual ===
                    "ruby"

                        ? "rgba(255,95,115,.12)"

                        : visual ===
                          "shadow"

                        ? "rgba(130,105,190,.10)"

                        : "rgba(215,220,220,.07)";


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    2 +
                    i %
                    3,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();
            }
        }


        /*
            POEIRA FEÉRICA.
        */

        if (
            visual ===
            "fairy"
        ) {

            for (
                let i = 0;
                i <
                38;
                i++
            ) {

                const x =
                    (
                        i *
                        271 +
                        Math.sin(
                            state.time +
                            i
                        ) *
                        30 +
                        state.world.width
                    ) %
                    state.world.width;


                const y =
                    (
                        i *
                        189 -
                        state.time *
                        (
                            5 +
                            i %
                            4
                        ) +
                        state.world.height
                    ) %
                    state.world.height;


                ctx.fillStyle =

                    i %
                    2

                        ? "rgba(255,190,240,.34)"

                        : "rgba(190,220,255,.30)";


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    2.4,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();
            }
        }


        /*
            NUVENS DO CÉU.
        */

        if (
            visual ===
            "sky"
        ) {

            for (
                let i = 0;
                i <
                16;
                i++
            ) {

                const x =
                    (
                        i *
                        331 +
                        state.time *
                        (
                            5 +
                            i %
                            3
                        )
                    ) %
                    state.world.width;


                const y =
                    (
                        i *
                        171
                    ) %
                    state.world.height;


                ctx.fillStyle =
                    "rgba(255,255,255,.10)";


                ctx.beginPath();


                ctx.ellipse(
                    x,
                    y,
                    70 +
                    i %
                    4 *
                    14,
                    20 +
                    i %
                    3 *
                    5,
                    0,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();
            }
        }


        /*
            BRASAS.
        */

        if (
            visual ===
            "hell"
        ) {

            for (
                let i = 0;
                i <
                42;
                i++
            ) {

                const x =
                    (
                        i *
                        421 +
                        Math.sin(
                            i
                        ) *
                        60
                    ) %
                    state.world.width;


                const y =
                    (
                        i *
                        257 -
                        state.time *
                        (
                            12 +
                            i %
                            6
                        ) +
                        state.world.height
                    ) %
                    state.world.height;


                ctx.fillStyle =
                    `rgba(255,115,45,${
                        0.18 +
                        (
                            Math.sin(
                                state.time *
                                4 +
                                i
                            ) +
                            1
                        ) *
                        0.10
                    })`;


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    2 +
                    i %
                    3,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();
            }
        }
    }


    /* =====================================================
       DECORAÇÕES
    ===================================================== */

    function drawDecorations() {

        for (
            const decoration of
            state.world.decorations
        ) {

            const x =
                decoration.x;


            const y =
                decoration.y;


            const type =
                decoration.type;


            /*
                PEDRAS DO CAMINHO.
            */

            if (
                type ===
                "pathStone"
            ) {

                ctx.save();


                ctx.translate(
                    x,
                    y
                );


                ctx.rotate(
                    decoration.angle ||
                    0
                );


                const size =
                    decoration.size ||
                    20;


                ctx.fillStyle =
                    "rgba(136,137,123,.78)";


                ctx.beginPath();


                ctx.ellipse(
                    0,
                    0,
                    size,
                    size *
                    0.52,
                    0,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.restore();


                continue;
            }


            /*
                COGUMELO.
            */

            if (
                type ===
                "mushroom"
            ) {

                const glow =
                    decoration.glow

                        ? 0.55 +
                          Math.sin(
                              state.time *
                              3 +
                              x
                          ) *
                          0.18

                        : 1;


                ctx.globalAlpha =
                    glow;


                ctx.fillStyle =
                    "#e6dabd";


                ctx.fillRect(
                    x -
                    2,
                    y,
                    4,
                    8
                );


                ctx.fillStyle =
                    decoration.glow
                        ? "#7ce0ff"
                        : "#bd6b61";


                ctx.beginPath();


                ctx.arc(
                    x,
                    y -
                    2,
                    7,
                    Math.PI,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                ARBUSTOS / SAMAMBAIAS.
            */

            if (
                type ===
                    "bush" ||
                type ===
                    "fern"
            ) {

                ctx.fillStyle =

                    type ===
                    "fern"

                        ? "#44704b"

                        : "#365d3c";


                for (
                    let i = 0;
                    i <
                    4;
                    i++
                ) {

                    ctx.beginPath();


                    ctx.arc(

                        x -
                        15 +
                        i *
                        10,

                        y +
                        Math.sin(
                            i
                        ) *
                        4,

                        type ===
                        "fern"
                            ? 9
                            : 14,

                        0,

                        Math.PI *
                        2
                    );


                    ctx.fill();
                }


                continue;
            }


            /*
                TRONCO CAÍDO / RAIZ.
            */

            if (
                type ===
                    "fallenLog" ||
                type ===
                    "ancientRoot"
            ) {

                ctx.strokeStyle =
                    type ===
                    "ancientRoot"
                        ? "#674a32"
                        : "#724c30";


                ctx.lineWidth =
                    type ===
                    "ancientRoot"
                        ? 8
                        : 14;


                ctx.lineCap =
                    "round";


                ctx.beginPath();


                ctx.moveTo(
                    x -
                    30,
                    y +
                    6
                );


                ctx.quadraticCurveTo(
                    x,
                    y -
                    20,
                    x +
                    32,
                    y -
                    5
                );


                ctx.stroke();


                ctx.lineCap =
                    "butt";


                continue;
            }


            /*
                FLOR / CANTEIRO.
            */

            if (
                type ===
                    "flower" ||
                type ===
                    "flowerPatch"
            ) {

                const count =
                    type ===
                    "flowerPatch"
                        ? 5
                        : 1;


                for (
                    let i = 0;
                    i <
                    count;
                    i++
                ) {

                    const fx =
                        x +
                        (
                            i -
                            2
                        ) *
                        8;


                    const fy =
                        y +
                        Math.sin(
                            i *
                            2
                        ) *
                        6;


                    ctx.strokeStyle =
                        "#4f8855";


                    ctx.lineWidth =
                        2;


                    ctx.beginPath();


                    ctx.moveTo(
                        fx,
                        fy +
                        8
                    );


                    ctx.lineTo(
                        fx,
                        fy
                    );


                    ctx.stroke();


                    ctx.fillStyle =
                        i %
                        2
                            ? "#f19acf"
                            : "#f2c273";


                    ctx.beginPath();


                    ctx.arc(
                        fx,
                        fy,
                        4,
                        0,
                        Math.PI *
                        2
                    );


                    ctx.fill();
                }


                continue;
            }


            /*
                VASO.
            */

            if (
                type ===
                "flowerPot"
            ) {

                ctx.fillStyle =
                    "#9b6847";


                ctx.fillRect(
                    x -
                    8,
                    y,
                    16,
                    13
                );


                ctx.font =
                    "20px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "🌼",
                    x,
                    y +
                    1
                );


                continue;
            }


            /*
                BARRIL.
            */

            if (
                type ===
                "barrel"
            ) {

                ctx.fillStyle =
                    "#765033";


                ctx.fillRect(
                    x -
                    11,
                    y -
                    15,
                    22,
                    30
                );


                ctx.strokeStyle =
                    "#342820";


                ctx.lineWidth =
                    2;


                ctx.strokeRect(
                    x -
                    11,
                    y -
                    15,
                    22,
                    30
                );


                ctx.beginPath();


                ctx.moveTo(
                    x -
                    11,
                    y -
                    5
                );


                ctx.lineTo(
                    x +
                    11,
                    y -
                    5
                );


                ctx.moveTo(
                    x -
                    11,
                    y +
                    6
                );


                ctx.lineTo(
                    x +
                    11,
                    y +
                    6
                );


                ctx.stroke();


                continue;
            }


            /*
                BANCO.
            */

            if (
                type ===
                "bench"
            ) {

                ctx.fillStyle =
                    "#725038";


                ctx.fillRect(
                    x -
                    32,
                    y -
                    8,
                    64,
                    10
                );


                ctx.fillRect(
                    x -
                    30,
                    y -
                    25,
                    60,
                    9
                );


                ctx.fillRect(
                    x -
                    24,
                    y +
                    1,
                    7,
                    18
                );


                ctx.fillRect(
                    x +
                    17,
                    y +
                    1,
                    7,
                    18
                );


                continue;
            }


            /*
                POSTE.
            */

            if (
                type ===
                "lanternPost"
            ) {

                ctx.strokeStyle =
                    "#3d403d";


                ctx.lineWidth =
                    6;


                ctx.beginPath();


                ctx.moveTo(
                    x,
                    y +
                    34
                );


                ctx.lineTo(
                    x,
                    y -
                    30
                );


                ctx.stroke();


                const pulse =
                    0.42 +
                    Math.sin(
                        state.time *
                        4
                    ) *
                    0.08;


                const gradient =
                    ctx.createRadialGradient(
                        x,
                        y -
                        37,
                        1,
                        x,
                        y -
                        37,
                        55
                    );


                gradient.addColorStop(
                    0,
                    `rgba(255,198,94,${pulse})`
                );


                gradient.addColorStop(
                    1,
                    "rgba(255,180,70,0)"
                );


                ctx.fillStyle =
                    gradient;


                ctx.beginPath();


                ctx.arc(
                    x,
                    y -
                    37,
                    55,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.fillStyle =
                    "#ffd27c";


                ctx.fillRect(
                    x -
                    6,
                    y -
                    45,
                    12,
                    15
                );


                continue;
            }


            /*
                PLACA DA FORJA.
            */

            if (
                type ===
                "forgeSign"
            ) {

                ctx.font =
                    "28px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "⚒️",
                    x,
                    y
                );


                continue;
            }


            /*
                CAIXAS.
            */

            if (
                type ===
                    "shopCrate" ||
                type ===
                    "toolCrate"
            ) {

                ctx.fillStyle =
                    "#745338";


                ctx.fillRect(
                    x -
                    18,
                    y -
                    16,
                    36,
                    32
                );


                ctx.strokeStyle =
                    "#3e3026";


                ctx.lineWidth =
                    2;


                ctx.strokeRect(
                    x -
                    18,
                    y -
                    16,
                    36,
                    32
                );


                ctx.font =
                    "18px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    type ===
                    "toolCrate"
                        ? "🔨"
                        : "📦",
                    x,
                    y +
                    6
                );


                continue;
            }


            /*
                PINHEIROS SECOS.
            */

            if (
                type ===
                "deadPine"
            ) {

                ctx.strokeStyle =
                    "#65594b";


                ctx.lineWidth =
                    7;


                ctx.beginPath();


                ctx.moveTo(
                    x,
                    y +
                    32
                );


                ctx.lineTo(
                    x,
                    y -
                    40
                );


                ctx.moveTo(
                    x,
                    y -
                    20
                );


                ctx.lineTo(
                    x -
                    18,
                    y -
                    6
                );


                ctx.moveTo(
                    x,
                    y -
                    10
                );


                ctx.lineTo(
                    x +
                    18,
                    y +
                    5
                );


                ctx.stroke();


                continue;
            }


            /*
                NEVE.
            */

            if (
                type ===
                "snowDrift"
            ) {

                ctx.fillStyle =
                    "rgba(245,248,250,.48)";


                ctx.beginPath();


                ctx.ellipse(
                    x,
                    y,
                    48,
                    16,
                    -0.12,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                continue;
            }


            /*
                MARCA DE VENTO.
            */

            if (
                type ===
                "windMark"
            ) {

                const offset =
                    Math.sin(
                        state.time *
                        2 +
                        decoration.phase
                    ) *
                    6;


                ctx.strokeStyle =
                    "rgba(255,255,255,.20)";


                ctx.lineWidth =
                    2;


                ctx.beginPath();


                ctx.moveTo(
                    x -
                    28 +
                    offset,
                    y
                );


                ctx.lineTo(
                    x +
                    30 +
                    offset,
                    y -
                    6
                );


                ctx.stroke();


                continue;
            }


            /*
                BRILHO DE MINÉRIO.
            */

            if (
                type ===
                "oreSpark"
            ) {

                ctx.fillStyle =
                    `rgba(232,226,185,${
                        0.25 +
                        (
                            Math.sin(
                                state.time *
                                4 +
                                decoration.phase
                            ) +
                            1
                        ) *
                        0.18
                    })`;


                ctx.font =
                    "18px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "✦",
                    x,
                    y
                );


                continue;
            }


            /*
                TRILHO.
            */

            if (
                type ===
                "rail"
            ) {

                ctx.save();


                ctx.translate(
                    x,
                    y
                );


                ctx.rotate(
                    decoration.angle ||
                    0
                );


                ctx.strokeStyle =
                    "#555a5c";


                ctx.lineWidth =
                    4;


                ctx.beginPath();


                ctx.moveTo(
                    -42,
                    -8
                );


                ctx.lineTo(
                    42,
                    -8
                );


                ctx.moveTo(
                    -42,
                    8
                );


                ctx.lineTo(
                    42,
                    8
                );


                ctx.stroke();


                ctx.strokeStyle =
                    "#654e38";


                ctx.lineWidth =
                    5;


                for (
                    let i = -32;
                    i <=
                    32;
                    i +=
                    16
                ) {

                    ctx.beginPath();


                    ctx.moveTo(
                        i,
                        -13
                    );


                    ctx.lineTo(
                        i,
                        13
                    );


                    ctx.stroke();
                }


                ctx.restore();


                continue;
            }


            /*
                LANTERNA DA MINA.
            */

            if (
                type ===
                "mineLantern"
            ) {

                const glow =
                    0.45 +
                    Math.sin(
                        state.time *
                        4 +
                        x
                    ) *
                    0.12;


                const gradient =
                    ctx.createRadialGradient(
                        x,
                        y,
                        1,
                        x,
                        y,
                        58
                    );


                gradient.addColorStop(
                    0,
                    `rgba(255,187,94,${glow})`
                );


                gradient.addColorStop(
                    1,
                    "rgba(255,150,55,0)"
                );


                ctx.fillStyle =
                    gradient;


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    58,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.strokeStyle =
                    "#574535";


                ctx.strokeRect(
                    x -
                    7,
                    y -
                    11,
                    14,
                    22
                );


                ctx.fillStyle =
                    "#ffd074";


                ctx.fillRect(
                    x -
                    4,
                    y -
                    6,
                    8,
                    12
                );


                continue;
            }


            /*
                ESTALAGMITE.
            */

            if (
                type ===
                "stalagmite"
            ) {

                ctx.fillStyle =
                    "#4e5557";


                ctx.beginPath();


                ctx.moveTo(
                    x -
                    10,
                    y +
                    14
                );


                ctx.lineTo(
                    x,
                    y -
                    26
                );


                ctx.lineTo(
                    x +
                    12,
                    y +
                    14
                );


                ctx.closePath();


                ctx.fill();


                continue;
            }


            /*
                CRISTAIS.
            */

            if (
                type ===
                    "crystalPillar" ||
                type ===
                    "crystalShard"
            ) {

                const big =
                    type ===
                    "crystalPillar";


                const pulse =
                    0.55 +
                    Math.sin(
                        state.time *
                        3 +
                        decoration.phase
                    ) *
                    0.15;


                ctx.fillStyle =
                    `rgba(228,67,95,${pulse})`;


                const w =
                    big
                        ? 17
                        : 9;


                const h =
                    big
                        ? 46
                        : 25;


                ctx.beginPath();


                ctx.moveTo(
                    x,
                    y -
                    h
                );


                ctx.lineTo(
                    x +
                    w,
                    y
                );


                ctx.lineTo(
                    x,
                    y +
                    8
                );


                ctx.lineTo(
                    x -
                    w,
                    y
                );


                ctx.closePath();


                ctx.fill();


                continue;
            }


            /*
                SOMBRAS.
            */

            if (
                type ===
                    "shadowWhisper" ||
                type ===
                    "darkMist"
            ) {

                ctx.fillStyle =
                    type ===
                    "shadowWhisper"

                        ? "rgba(108,75,135,.14)"

                        : "rgba(60,51,78,.16)";


                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    ctx.beginPath();


                    ctx.arc(

                        x +
                        Math.sin(
                            state.time +
                            i +
                            decoration.phase
                        ) *
                        17,

                        y -
                        i *
                        8,

                        18 +
                        i *
                        6,

                        0,

                        Math.PI *
                        2
                    );


                    ctx.fill();
                }


                if (
                    type ===
                    "shadowWhisper"
                ) {

                    ctx.fillStyle =
                        "rgba(174,124,220,.38)";


                    ctx.beginPath();


                    ctx.ellipse(
                        x,
                        y -
                        16,
                        9,
                        4,
                        0,
                        0,
                        Math.PI *
                        2
                    );


                    ctx.fill();
                }


                continue;
            }


            /*
                LÂMPADA FEÉRICA.
            */

            if (
                type ===
                "fairyLamp"
            ) {

                const pulse =
                    0.38 +
                    (
                        Math.sin(
                            state.time *
                            4 +
                            decoration.phase
                        ) +
                        1
                    ) *
                    0.12;


                const gradient =
                    ctx.createRadialGradient(
                        x,
                        y,
                        1,
                        x,
                        y,
                        65
                    );


                gradient.addColorStop(
                    0,
                    `rgba(246,183,255,${pulse})`
                );


                gradient.addColorStop(
                    1,
                    "rgba(210,130,255,0)"
                );


                ctx.fillStyle =
                    gradient;


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    65,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.font =
                    "23px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "🌸",
                    x,
                    y +
                    7
                );


                continue;
            }


            /*
                BRILHO FEÉRICO.
            */

            if (
                type ===
                "fairySpark"
            ) {

                ctx.fillStyle =
                    `rgba(246,205,255,${
                        0.3 +
                        (
                            Math.sin(
                                state.time *
                                4 +
                                decoration.phase
                            ) +
                            1
                        ) *
                        0.18
                    })`;


                ctx.font =
                    "18px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "✦",
                    x,
                    y
                );


                continue;
            }


            /*
                PILAR CELESTIAL.
            */

            if (
                type ===
                "celestialPillar"
            ) {

                ctx.fillStyle =
                    "rgba(244,237,210,.77)";


                ctx.fillRect(
                    x -
                    14,
                    y -
                    42,
                    28,
                    84
                );


                ctx.fillStyle =
                    "#d7ba69";


                ctx.fillRect(
                    x -
                    20,
                    y -
                    48,
                    40,
                    8
                );


                ctx.fillRect(
                    x -
                    20,
                    y +
                    40,
                    40,
                    8
                );


                continue;
            }


            /*
                NUVEM.
            */

            if (
                type ===
                "cloud"
            ) {

                ctx.fillStyle =
                    "rgba(255,255,255,.32)";


                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    ctx.beginPath();


                    ctx.arc(
                        x -
                        18 +
                        i *
                        18,
                        y,
                        18 +
                        i *
                        3,
                        0,
                        Math.PI *
                        2
                    );


                    ctx.fill();
                }


                continue;
            }


            /*
                ALTAR.
            */

            if (
                type ===
                "trialAltar"
            ) {

                const pulse =
                    0.7 +
                    Math.sin(
                        state.time *
                        3
                    ) *
                    0.12;


                ctx.fillStyle =
                    `rgba(226,210,148,${pulse})`;


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    40,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.fillStyle =
                    "#6389b5";


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    20,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.font =
                    "22px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "✦",
                    x,
                    y +
                    7
                );


                continue;
            }


            /*
                LAVA.
            */

            if (
                type ===
                "lavaPool"
            ) {

                const pulse =
                    0.40 +
                    Math.sin(
                        state.time *
                        2 +
                        decoration.phase
                    ) *
                    0.08;


                ctx.fillStyle =
                    `rgba(241,76,25,${pulse})`;


                ctx.beginPath();


                ctx.ellipse(
                    x,
                    y,
                    55,
                    30,
                    -0.2,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.strokeStyle =
                    "rgba(255,184,57,.38)";


                ctx.lineWidth =
                    3;


                ctx.beginPath();


                ctx.ellipse(
                    x +
                    Math.sin(
                        state.time
                    ) *
                    5,
                    y,
                    32,
                    13,
                    0.2,
                    0,
                    Math.PI *
                    2
                );


                ctx.stroke();


                continue;
            }


            /*
                FUMAÇA DO INFERNO.
            */

            if (
                type ===
                "hellSmoke"
            ) {

                ctx.fillStyle =
                    "rgba(25,21,25,.29)";


                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    ctx.beginPath();


                    ctx.arc(
                        x +
                        Math.sin(
                            state.time +
                            i
                        ) *
                        12,
                        y -
                        i *
                        13,
                        13 +
                        i *
                        4,
                        0,
                        Math.PI *
                        2
                    );


                    ctx.fill();
                }


                continue;
            }


            /*
                BRASAS DO INFERNO.
            */

            if (
                type ===
                "emberVent"
            ) {

                ctx.fillStyle =
                    "rgba(255,132,56,.55)";


                for (
                    let i = 0;
                    i <
                    5;
                    i++
                ) {

                    ctx.beginPath();


                    ctx.arc(

                        x +
                        Math.sin(
                            state.time *
                            3 +
                            i
                        ) *
                        10,

                        y -
                        (
                            (
                                state.time *
                                34 +
                                i *
                                13
                            ) %
                            34
                        ),

                        2 +
                        i %
                        2,

                        0,

                        Math.PI *
                        2
                    );


                    ctx.fill();
                }
            }
        }
    }


    /* =====================================================
       CASAS
    ===================================================== */

    function drawBuildings() {

        for (
            const building of
            state.world.buildings
        ) {

            /*
                SOMBRA.
            */

            ctx.fillStyle =
                "rgba(0,0,0,.25)";


            ctx.fillRect(
                building.x +
                14,
                building.y +
                17,
                building.w,
                building.h
            );


            /*
                CORPO.
            */

            ctx.fillStyle =
                building.color;


            ctx.fillRect(
                building.x,
                building.y,
                building.w,
                building.h
            );


            ctx.strokeStyle =
                "rgba(40,30,22,.45)";


            ctx.lineWidth =
                4;


            ctx.strokeRect(
                building.x +
                3,
                building.y +
                3,
                building.w -
                6,
                building.h -
                6
            );


            /*
                TELHADO.
            */

            ctx.fillStyle =
                building.roof;


            ctx.beginPath();


            ctx.moveTo(
                building.x -
                25,
                building.y
            );


            ctx.lineTo(
                building.x +
                building.w /
                2,
                building.y -
                95
            );


            ctx.lineTo(
                building.x +
                building.w +
                25,
                building.y
            );


            ctx.closePath();


            ctx.fill();


            /*
                PORTA.
            */

            const doorX =
                building.x +
                building.w /
                2;


            ctx.fillStyle =
                "#452d25";


            ctx.fillRect(
                doorX -
                27,
                building.y +
                building.h -
                72,
                54,
                72
            );


            ctx.fillStyle =
                "#d4b66c";


            ctx.beginPath();


            ctx.arc(
                doorX +
                16,
                building.y +
                building.h -
                35,
                3,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            /*
                JANELAS.
            */

            ctx.fillStyle =
                "#d8c279";


            ctx.fillRect(
                building.x +
                35,
                building.y +
                60,
                52,
                43
            );


            ctx.fillRect(
                building.x +
                building.w -
                87,
                building.y +
                60,
                52,
                43
            );


            ctx.strokeStyle =
                "rgba(70,48,30,.5)";


            ctx.lineWidth =
                2;


            [
                building.x +
                61,

                building.x +
                building.w -
                61
            ]
                .forEach(
                    cx => {

                        ctx.beginPath();


                        ctx.moveTo(
                            cx,
                            building.y +
                            60
                        );


                        ctx.lineTo(
                            cx,
                            building.y +
                            103
                        );


                        ctx.stroke();
                    }
                );


            /*
                IDENTIDADE DE CADA CASA.
            */

            ctx.textAlign =
                "center";


            ctx.font =
                "30px Arial";


            if (
                building.id ===
                "home"
            ) {

                ctx.fillText(
                    "🏠",
                    doorX,
                    building.y +
                    45
                );


                ctx.font =
                    "19px Arial";


                ctx.fillText(
                    "🌼",
                    building.x +
                    110,
                    building.y +
                    building.h -
                    20
                );


                ctx.fillText(
                    "🌼",
                    building.x +
                    building.w -
                    110,
                    building.y +
                    building.h -
                    20
                );
            }


            else if (
                building.id ===
                "elianHome"
            ) {

                ctx.fillText(
                    "📚",
                    doorX,
                    building.y +
                    45
                );
            }


            else if (
                building.id ===
                "forge"
            ) {

                ctx.fillText(
                    "⚒️",
                    doorX,
                    building.y +
                    45
                );


                /*
                    CHAMINÉ.
                */

                ctx.fillStyle =
                    "#45423f";


                ctx.fillRect(
                    building.x +
                    building.w -
                    105,
                    building.y -
                    70,
                    43,
                    75
                );


                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    ctx.fillStyle =
                        `rgba(70,70,70,${
                            0.18 -
                            i *
                            0.04
                        })`;


                    ctx.beginPath();


                    ctx.arc(

                        building.x +
                        building.w -
                        83 +
                        Math.sin(
                            state.time +
                            i
                        ) *
                        10,

                        building.y -
                        86 -
                        i *
                        18,

                        17 +
                        i *
                        6,

                        0,

                        Math.PI *
                        2
                    );


                    ctx.fill();
                }
            }


            else if (
                building.id ===
                "shop"
            ) {

                ctx.fillText(
                    "🛒",
                    doorX,
                    building.y +
                    45
                );


                ctx.font =
                    "17px Arial";


                ctx.fillText(
                    "🥖  🧪  ⚔️",
                    doorX,
                    building.y +
                    135
                );
            }


            else if (
                building.id ===
                "woodshop"
            ) {

                ctx.fillText(
                    "🪚",
                    doorX,
                    building.y +
                    45
                );


                ctx.font =
                    "18px Arial";


                ctx.fillText(
                    "🪵 🪵 🪵",
                    building.x +
                    110,
                    building.y +
                    building.h -
                    18
                );
            }


            /*
                NOME.
            */

            ctx.fillStyle =
                "#f1e0ba";


            ctx.font =
                "bold 12px Georgia";


            ctx.fillText(
                building.name,
                doorX,
                building.y +
                building.h +
                30
            );
        }
    }


    /* =====================================================
       FONTE / PEDRAS / OBSTÁCULOS
    ===================================================== */

    function drawObstacles() {

        for (
            const obstacle of
            state.world.obstacles
        ) {

            if (
                [
                    "building",
                    "tree",
                    "wall"
                ].includes(
                    obstacle.type
                )
            ) {

                continue;
            }


            /*
                FONTE.
            */

            if (
                obstacle.type ===
                "fountain"
            ) {

                const centerX =
                    obstacle.x +
                    obstacle.w /
                    2;


                const centerY =
                    obstacle.y +
                    obstacle.h /
                    2;


                /*
                    SOMBRA.
                */

                ctx.fillStyle =
                    "rgba(0,0,0,.18)";


                ctx.beginPath();


                ctx.ellipse(
                    centerX +
                    7,
                    centerY +
                    9,
                    obstacle.w /
                    2,
                    obstacle.h /
                    2,
                    0,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                /*
                    BORDA.
                */

                ctx.fillStyle =
                    "#999a92";


                ctx.beginPath();


                ctx.ellipse(
                    centerX,
                    centerY,
                    obstacle.w /
                    2,
                    obstacle.h /
                    2,
                    0,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                /*
                    ÁGUA.
                */

                const pulse =
                    0.49 +
                    Math.sin(
                        state.time *
                        2
                    ) *
                    0.04;


                ctx.fillStyle =
                    `rgba(83,164,193,${pulse})`;


                ctx.beginPath();


                ctx.ellipse(
                    centerX,
                    centerY,
                    obstacle.w /
                    2 -
                    22,
                    obstacle.h /
                    2 -
                    22,
                    0,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                /*
                    PILAR CENTRAL.
                */

                ctx.fillStyle =
                    "#aaa9a0";


                ctx.fillRect(
                    centerX -
                    15,
                    centerY -
                    74,
                    30,
                    77
                );


                ctx.fillStyle =
                    "#c5bda6";


                ctx.beginPath();


                ctx.ellipse(
                    centerX,
                    centerY -
                    74,
                    26,
                    9,
                    0,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                /*
                    BOLA NO TOPO.
                */

                ctx.fillStyle =
                    "#d2c5a1";


                ctx.beginPath();


                ctx.arc(
                    centerX,
                    centerY -
                    89,
                    11,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                /*
                    JATOS DE ÁGUA.
                */

                for (
                    let i = 0;
                    i <
                    5;
                    i++
                ) {

                    const angle =
                        Math.PI *
                        2 *
                        i /
                        5;


                    const targetX =
                        centerX +
                        Math.cos(
                            angle
                        ) *
                        62;


                    const targetY =
                        centerY +
                        Math.sin(
                            angle
                        ) *
                        27;


                    const sway =
                        Math.sin(
                            state.time *
                            4 +
                            i
                        ) *
                        4;


                    ctx.strokeStyle =
                        "rgba(162,220,241,.70)";


                    ctx.lineWidth =
                        3;


                    ctx.beginPath();


                    ctx.moveTo(
                        centerX,
                        centerY -
                        73
                    );


                    ctx.quadraticCurveTo(

                        (
                            centerX +
                            targetX
                        ) /
                        2 +
                        sway,

                        centerY -
                        104,

                        targetX,
                        targetY
                    );


                    ctx.stroke();


                    /*
                        GOTINHA.
                    */

                    const t =
                        (
                            state.time *
                            1.4 +
                            i *
                            0.17
                        ) %
                        1;


                    const x1 =
                        centerX;


                    const y1 =
                        centerY -
                        73;


                    const x2 =
                        (
                            centerX +
                            targetX
                        ) /
                        2 +
                        sway;


                    const y2 =
                        centerY -
                        104;


                    const x3 =
                        targetX;


                    const y3 =
                        targetY;


                    const dropX =
                        (
                            1 -
                            t
                        ) *
                        (
                            1 -
                            t
                        ) *
                        x1 +

                        2 *
                        (
                            1 -
                            t
                        ) *
                        t *
                        x2 +

                        t *
                        t *
                        x3;


                    const dropY =
                        (
                            1 -
                            t
                        ) *
                        (
                            1 -
                            t
                        ) *
                        y1 +

                        2 *
                        (
                            1 -
                            t
                        ) *
                        t *
                        y2 +

                        t *
                        t *
                        y3;


                    ctx.fillStyle =
                        "rgba(205,238,248,.86)";


                    ctx.beginPath();


                    ctx.arc(
                        dropX,
                        dropY,
                        2.7,
                        0,
                        Math.PI *
                        2
                    );


                    ctx.fill();
                }


                /*
                    ONDAS.
                */

                ctx.strokeStyle =
                    "rgba(215,239,247,.25)";


                ctx.lineWidth =
                    2;


                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    const radius =
                        20 +
                        (
                            (
                                state.time *
                                25 +
                                i *
                                27
                            ) %
                            70
                        );


                    ctx.beginPath();


                    ctx.ellipse(
                        centerX,
                        centerY,
                        radius *
                        1.25,
                        radius *
                        0.55,
                        0,
                        0,
                        Math.PI *
                        2
                    );


                    ctx.stroke();
                }


                continue;
            }


            const colors = {

                rock:
                    "#727771",

                snowrock:
                    "#bec5c7",

                iceRock:
                    "#a9cad9",

                oreRock:
                    "#59636a",

                ironrock:
                    "#666c6f",

                rubyrock:
                    "#73384b",

                rubyPillar:
                    "#8e2d48",

                darkrock:
                    "#34364e",

                basalt:
                    "#443437",

                obsidian:
                    "#241f29"
            };


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

                -0.12,

                0,

                Math.PI *
                2
            );


            ctx.fill();


            /*
                DETALHE DOS MINÉRIOS.
            */

            if (
                [
                    "oreRock",
                    "rubyPillar",
                    "iceRock"
                ].includes(
                    obstacle.type
                )
            ) {

                ctx.strokeStyle =

                    obstacle.type ===
                    "rubyPillar"

                        ? "#e15271"

                        : obstacle.type ===
                          "iceRock"

                        ? "#d8f4ff"

                        : "#c5d1d4";


                ctx.lineWidth =
                    3;


                ctx.beginPath();


                ctx.moveTo(
                    obstacle.x +
                    obstacle.w *
                    0.25,
                    obstacle.y +
                    obstacle.h *
                    0.70
                );


                ctx.lineTo(
                    obstacle.x +
                    obstacle.w *
                    0.50,
                    obstacle.y +
                    obstacle.h *
                    0.30
                );


                ctx.lineTo(
                    obstacle.x +
                    obstacle.w *
                    0.72,
                    obstacle.y +
                    obstacle.h *
                    0.58
                );


                ctx.stroke();
            }
        }
    }


    /* =====================================================
       ÁRVORES
    ===================================================== */

    function drawTrees() {

        for (
            const tree of
            state.world.trees
        ) {

            if (
                !tree.alive
            ) {

                continue;
            }


            const sway =
                Math.sin(
                    state.time *
                    1.7 +
                    tree.x
                ) *
                2.2;


            /*
                SOMBRA.
            */

            ctx.fillStyle =
                "rgba(0,0,0,.23)";


            ctx.beginPath();


            ctx.ellipse(
                tree.x,
                tree.y +
                30,
                36,
                11,
                0,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            /*
                TRONCO.
            */

            ctx.fillStyle =
                "#684a30";


            ctx.fillRect(
                tree.x -
                9,
                tree.y -
                1,
                18,
                44
            );


            /*
                COPA.
            */

            ctx.fillStyle =

                state.area ===
                "grove"

                    ? "#315c3c"

                    : "#305c36";


            ctx.beginPath();


            ctx.arc(
                tree.x +
                sway,
                tree.y -
                14,
                34,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.fillStyle =

                state.area ===
                "grove"

                    ? "#47794d"

                    : "#447a45";


            ctx.beginPath();


            ctx.arc(
                tree.x -
                14 +
                sway,
                tree.y -
                27,
                24,
                0,
                Math.PI *
                2
            );


            ctx.arc(
                tree.x +
                14 +
                sway,
                tree.y -
                27,
                25,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            /*
                BRILHO DE INTERAÇÃO.
            */

            if (
                state.player &&
                distance(
                    tree,
                    state.player
                ) <
                82
            ) {

                ctx.strokeStyle =
                    "rgba(237,205,129,.72)";


                ctx.lineWidth =
                    2;


                ctx.beginPath();


                ctx.arc(
                    tree.x,
                    tree.y -
                    10,
                    42,
                    0,
                    Math.PI *
                    2
                );


                ctx.stroke();
            }
        }
    }


    /* =====================================================
       RECURSOS
    ===================================================== */

    function drawResources() {

        for (
            const resource of
            state.world.resources
        ) {

            if (
                !resource.alive
            ) {

                continue;
            }


            const pulse =
                0.86 +
                Math.sin(
                    state.time *
                    3 +
                    resource.x
                ) *
                0.08;


            ctx.save();


            ctx.translate(
                resource.x,
                resource.y
            );


            ctx.scale(
                pulse,
                pulse
            );


            if (
                resource.type ===
                "ferro"
            ) {

                ctx.fillStyle =
                    "#596267";


                ctx.beginPath();


                ctx.moveTo(
                    -14,
                    9
                );


                ctx.lineTo(
                    -7,
                    -11
                );


                ctx.lineTo(
                    6,
                    -15
                );


                ctx.lineTo(
                    15,
                    5
                );


                ctx.lineTo(
                    5,
                    14
                );


                ctx.closePath();


                ctx.fill();


                ctx.fillStyle =
                    "#b7c3c8";


                ctx.beginPath();


                ctx.arc(
                    -3,
                    -3,
                    4,
                    0,
                    Math.PI *
                    2
                );


                ctx.arc(
                    6,
                    4,
                    3,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();
            }


            else if (
                resource.type ===
                "carvao"
            ) {

                ctx.fillStyle =
                    "#25282b";


                ctx.beginPath();


                ctx.moveTo(
                    -13,
                    8
                );


                ctx.lineTo(
                    -9,
                    -10
                );


                ctx.lineTo(
                    7,
                    -14
                );


                ctx.lineTo(
                    15,
                    2
                );


                ctx.lineTo(
                    8,
                    13
                );


                ctx.closePath();


                ctx.fill();
            }


            else if (
                resource.type ===
                "ouro"
            ) {

                ctx.fillStyle =
                    "#d8b44d";


                ctx.beginPath();


                ctx.arc(
                    0,
                    0,
                    12,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.fillStyle =
                    "#ffdf74";


                ctx.beginPath();


                ctx.arc(
                    -3,
                    -3,
                    4,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();
            }


            else if (
                resource.type ===
                "rubi"
            ) {

                ctx.fillStyle =
                    "#d4425f";


                ctx.beginPath();


                ctx.moveTo(
                    0,
                    -17
                );


                ctx.lineTo(
                    13,
                    -3
                );


                ctx.lineTo(
                    7,
                    14
                );


                ctx.lineTo(
                    -7,
                    14
                );


                ctx.lineTo(
                    -13,
                    -3
                );


                ctx.closePath();


                ctx.fill();


                ctx.strokeStyle =
                    "#ff9cad";


                ctx.stroke();
            }


            else {

                ctx.fillStyle =
                    "#a985e5";


                ctx.beginPath();


                ctx.moveTo(
                    0,
                    -18
                );


                ctx.lineTo(
                    11,
                    0
                );


                ctx.lineTo(
                    0,
                    16
                );


                ctx.lineTo(
                    -11,
                    0
                );


                ctx.closePath();


                ctx.fill();
            }


            ctx.restore();
        }
    }


    /* =====================================================
       CENOURAS
    ===================================================== */

    function drawFoods() {

        for (
            const food of
            state.world.foods
        ) {

            if (
                !food.alive
            ) {

                continue;
            }


            const bob =
                Math.sin(
                    state.time *
                    3 +
                    food.x
                ) *
                3;


            ctx.font =
                "24px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                food.type ===
                "carrot"
                    ? "🥕"
                    : "🍖",
                food.x,
                food.y +
                8 +
                bob
            );
        }
    }


    /* =====================================================
       SEGREDOS
    ===================================================== */

    function drawSecrets() {

        for (
            const secret of
            state.world.secrets
        ) {

            if (
                secret.found
            ) {

                continue;
            }


            const pulse =
                0.45 +
                Math.sin(
                    state.time *
                    3 +
                    secret.x
                ) *
                0.20;


            ctx.globalAlpha =
                pulse;


            ctx.font =
                "27px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                secret.icon,
                secret.x,
                secret.y
            );


            ctx.globalAlpha =
                1;
        }
    }


    /* =====================================================
       NPCS
    ===================================================== */

    function drawNPCCharacter(
        npc
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,.25)";


        ctx.beginPath();


        ctx.ellipse(
            npc.x,
            npc.y +
            20,
            19,
            7,
            0,
            0,
            Math.PI *
            2
        );


        ctx.fill();


        /*
            CORPO.
        */

        ctx.fillStyle =
            npc.color ||
            "#c9ae82";


        ctx.beginPath();


        ctx.arc(
            npc.x,
            npc.y,
            17,
            0,
            Math.PI *
            2
        );


        ctx.fill();


        /*
            CABEÇA.
        */

        ctx.fillStyle =
            "#e4c29d";


        ctx.beginPath();


        ctx.arc(
            npc.x,
            npc.y -
            8,
            10,
            0,
            Math.PI *
            2
        );


        ctx.fill();


        /*
            CABELO.
        */

        ctx.fillStyle =
            "#29272a";


        ctx.beginPath();


        ctx.arc(
            npc.x,
            npc.y -
            13,
            10,
            Math.PI,
            Math.PI *
            2
        );


        ctx.fill();


        /*
            ÍCONE.
        */

        let icon =
            "";


        if (
            npc.merchant
        ) {

            icon =
                "💰";
        }

        else if (
            npc.questId ===
            "coal"
        ) {

            icon =
                "⚒️";
        }

        else if (
            npc.questId ===
            "wood"
        ) {

            icon =
                "🪚";
        }


        if (
            icon
        ) {

            ctx.font =
                "17px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                icon,
                npc.x,
                npc.y -
                43
            );
        }


        /*
            NOME.
        */

        ctx.font =
            "bold 12px Arial";


        ctx.fillStyle =
            "#f5e5be";


        ctx.textAlign =
            "center";


        ctx.fillText(
            npc.name,
            npc.x,
            npc.y -
            28
        );


        ctx.font =
            "10px Arial";


        ctx.fillStyle =
            "#d1c5af";


        ctx.fillText(
            npc.role,
            npc.x,
            npc.y +
            38
        );
    }


    function drawNPCs() {

        for (
            const npc of
            state.world.npcs
        ) {

            drawNPCCharacter(
                npc
            );


            if (
                npc.questId
            ) {

                const quest =
                    state.player
                        ?.quest[
                            npc.questId
                        ];


                ctx.font =
                    "bold 21px Arial";


                ctx.fillStyle =

                    quest?.state ===
                    "completed"

                        ? "#7dd88c"

                        : "#ffd868";


                ctx.textAlign =
                    "center";


                ctx.fillText(

                    quest?.state ===
                    "completed"

                        ? "✓"

                        : "!",

                    npc.x,

                    npc.y -
                    48
                );
            }
        }
    }


    /* =====================================================
       INTERIOR DAS CASAS
    ===================================================== */

    function drawHouseInterior() {

        const room =
            getHouseRoom();


        const theme =
            getHouseTheme();


        const building =
            state.currentHouse;


        /*
            ESCURIDÃO FORA DA CASA.
        */

        ctx.fillStyle =
            "#11100f";


        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );


        /*
            PAREDE.
        */

        ctx.fillStyle =
            theme.wall;


        ctx.fillRect(
            room.x -
            25,
            room.y -
            25,
            room.w +
            50,
            room.h +
            50
        );


        /*
            PISO.
        */

        ctx.fillStyle =
            theme.floor;


        ctx.fillRect(
            room.x,
            room.y,
            room.w,
            room.h
        );


        /*
            TÁBUAS.
        */

        ctx.strokeStyle =
            "rgba(45,28,20,.22)";


        ctx.lineWidth =
            1;


        for (
            let y =
                room.y +
                28;
            y <
            room.y +
                room.h;
            y +=
            28
        ) {

            ctx.beginPath();


            ctx.moveTo(
                room.x,
                y
            );


            ctx.lineTo(
                room.x +
                room.w,
                y
            );


            ctx.stroke();
        }


        ctx.strokeStyle =
            theme.trim;


        ctx.lineWidth =
            6;


        ctx.strokeRect(
            room.x,
            room.y,
            room.w,
            room.h
        );


        /*
            MÓVEIS.
        */

        for (
            const furniture of
            getHouseFurniture()
        ) {

            drawFurniture(
                furniture,
                theme
            );
        }


        /*
            PORTA.
        */

        ctx.fillStyle =
            "#3b241c";


        ctx.fillRect(
            room.x +
            room.w /
            2 -
            34,
            room.y +
            room.h -
            18,
            68,
            24
        );


        /*
            NOME DA CASA.
        */

        ctx.textAlign =
            "center";


        ctx.font =
            "bold 19px Georgia";


        ctx.fillStyle =
            "#ead9b5";


        ctx.fillText(
            building?.name ||
            "INTERIOR",
            room.x +
            room.w /
            2,
            room.y -
            42
        );


        ctx.font =
            "11px Arial";


        ctx.fillText(
            "APROXIME-SE DA PORTA E PRESSIONE Z",
            room.x +
            room.w /
            2,
            room.y +
            room.h +
            35
        );


        for (
            const npc of
            getInteriorNPCs()
        ) {

            drawNPCCharacter(
                npc
            );
        }
    }


    /* =====================================================
       MÓVEIS INTERNOS
    ===================================================== */

    function drawFurniture(
        furniture,
        theme
    ) {

        const x =
            furniture.x;


        const y =
            furniture.y;


        const w =
            furniture.w;


        const h =
            furniture.h;


        /*
            CAMA.
        */

        if (
            furniture.name ===
            "bed"
        ) {

            ctx.fillStyle =
                "#493228";


            ctx.fillRect(
                x,
                y,
                w,
                h
            );


            ctx.fillStyle =
                "#ded0b8";


            ctx.fillRect(
                x +
                10,
                y +
                10,
                w -
                20,
                h -
                20
            );


            ctx.fillStyle =
                "#76564c";


            ctx.fillRect(
                x +
                10,
                y +
                10,
                w -
                20,
                Math.min(
                    28,
                    h *
                    0.30
                )
            );


            if (
                furniture.interactable ===
                "sleep"
            ) {

                ctx.font =
                    "25px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "💤",
                    x +
                    w /
                    2,
                    y -
                    9
                );
            }


            return;
        }


        /*
            LAREIRA.
        */

        if (
            furniture.name ===
            "fireplace"
        ) {

            ctx.fillStyle =
                "#44322d";


            ctx.fillRect(
                x,
                y,
                w,
                h
            );


            const flame =
                17 +
                Math.sin(
                    state.time *
                    6
                ) *
                4;


            ctx.fillStyle =
                "#f48a42";


            ctx.beginPath();


            ctx.ellipse(
                x +
                w /
                2,
                y +
                h *
                0.72,
                20,
                flame,
                0,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.fillStyle =
                "#ffd45f";


            ctx.beginPath();


            ctx.ellipse(
                x +
                w /
                2,
                y +
                h *
                0.76,
                9,
                flame *
                0.58,
                0,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            return;
        }


        /*
            FORNALHA.
        */

        if (
            furniture.name ===
            "furnace"
        ) {

            ctx.fillStyle =
                "#2c2d30";


            ctx.fillRect(
                x,
                y,
                w,
                h
            );


            const centerX =
                x +
                w /
                2;


            const centerY =
                y +
                h *
                0.62;


            const gradient =
                ctx.createRadialGradient(

                    centerX,
                    centerY,
                    5,

                    centerX,
                    centerY,
                    95
                );


            gradient.addColorStop(
                0,
                "rgba(255,150,60,.85)"
            );


            gradient.addColorStop(
                1,
                "rgba(255,90,30,0)"
            );


            ctx.fillStyle =
                gradient;


            ctx.beginPath();


            ctx.arc(
                centerX,
                centerY,
                95,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.fillStyle =
                "#ff7846";


            ctx.beginPath();


            ctx.arc(
                centerX,
                centerY,
                37,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.fillStyle =
                "#ffd06a";


            ctx.beginPath();


            ctx.arc(
                centerX,
                centerY,
                17,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            return;
        }


        /*
            BIGORNA.
        */

        if (
            furniture.name ===
            "anvil"
        ) {

            ctx.fillStyle =
                "#252a2e";


            ctx.fillRect(
                x,
                y,
                w,
                h *
                0.42
            );


            ctx.fillRect(
                x +
                w *
                0.36,
                y +
                h *
                0.42,
                w *
                0.28,
                h *
                0.58
            );


            ctx.font =
                "25px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                "🔨",
                x +
                w /
                2,
                y -
                6
            );


            return;
        }


        /*
            ESTANTES.
        */

        if (
            furniture.name
                .toLowerCase()
                .includes(
                    "shelf"
                ) ||
            furniture.name ===
                "bookshelf"
        ) {

            ctx.fillStyle =
                "#4c3326";


            ctx.fillRect(
                x,
                y,
                w,
                h
            );


            ctx.fillStyle =
                "#c0a36b";


            for (
                let i = 1;
                i <
                5;
                i++
            ) {

                ctx.fillRect(
                    x +
                    8,
                    y +
                    h *
                    i /
                    5,
                    w -
                    16,
                    5
                );
            }


            ctx.font =
                "18px Arial";


            ctx.textAlign =
                "center";


            if (
                furniture.name ===
                "bookshelf"
            ) {

                ctx.fillText(
                    "📕 📘",
                    x +
                    w /
                    2,
                    y +
                    40
                );


                ctx.fillText(
                    "📗 📙",
                    x +
                    w /
                    2,
                    y +
                    78
                );
            }

            else {

                ctx.fillText(
                    "🥖 🧪",
                    x +
                    w /
                    2,
                    y +
                    42
                );


                ctx.fillText(
                    "📦 💰",
                    x +
                    w /
                    2,
                    y +
                    82
                );
            }


            return;
        }


        /*
            MADEIRA EMPILHADA.
        */

        if (
            furniture.name ===
                "logStack" ||
            furniture.name ===
                "boardStack"
        ) {

            for (
                let i = 0;
                i <
                5;
                i++
            ) {

                ctx.fillStyle =
                    i %
                    2
                        ? "#765035"
                        : "#99663e";


                ctx.fillRect(
                    x +
                    10,
                    y +
                    10 +
                    i *
                    (
                        (
                            h -
                            20
                        ) /
                        5
                    ),
                    w -
                    20,
                    Math.max(
                        9,
                        h /
                        8
                    )
                );
            }


            return;
        }


        /*
            CAIXA / BAÚ.
        */

        if (
            furniture.name ===
                "chest" ||
            furniture.name ===
                "crate" ||
            furniture.name ===
                "oreCrate"
        ) {

            ctx.fillStyle =
                furniture.name ===
                "oreCrate"
                    ? "#535352"
                    : "#795139";


            ctx.fillRect(
                x,
                y,
                w,
                h
            );


            ctx.strokeStyle =
                "#342a23";


            ctx.lineWidth =
                3;


            ctx.strokeRect(
                x,
                y,
                w,
                h
            );


            ctx.font =
                "24px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(

                furniture.name ===
                "oreCrate"
                    ? "⛏️"
                    : "📦",

                x +
                w /
                2,

                y +
                h /
                2 +
                8
            );


            return;
        }


        /*
            FERRAMENTAS.
        */

        if (
            furniture.name ===
            "toolRack"
        ) {

            ctx.fillStyle =
                "#60432e";


            ctx.fillRect(
                x,
                y,
                w,
                h
            );


            ctx.font =
                "24px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                "⚒️ 🪚",
                x +
                w /
                2,
                y +
                h /
                2
            );


            return;
        }


        /*
            MESA, BALCÃO, BANCADA, CADEIRA.
        */

        const emoji =

            furniture.name ===
            "desk"

                ? "📜 ✒️"

                : furniture.name ===
                  "counter"

                ? "💰"

                : furniture.name ===
                  "workbench"

                ? "🪚 🔨"

                : furniture.name ===
                  "chair"

                ? "🪑"

                : "📖 🕯️";


        ctx.fillStyle =
            furniture.name ===
            "chair"
                ? "#684833"
                : "#593a28";


        ctx.fillRect(
            x,
            y,
            w,
            h
        );


        ctx.strokeStyle =
            theme.accent;


        ctx.globalAlpha =
            0.35;


        ctx.strokeRect(
            x,
            y,
            w,
            h
        );


        ctx.globalAlpha =
            1;


        ctx.font =
            "21px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(
            emoji,
            x +
            w /
            2,
            y +
            h /
            2 +
            7
        );
    }


    /* =====================================================
       HAZARDS
    ===================================================== */

    function drawHazards() {

        for (
            const hazard of
            state.world.hazards
        ) {

            const warning =
                !hazard.triggered;


            const pulse =
                0.74 +
                Math.sin(
                    state.time *
                    9
                ) *
                0.16;


            ctx.fillStyle =

                warning

                    ? `rgba(225,43,36,${
                        0.10 *
                        pulse
                    })`

                    : "rgba(255,107,49,.30)";


            ctx.strokeStyle =

                warning

                    ? "rgba(255,64,52,.92)"

                    : "rgba(255,196,91,.95)";


            ctx.lineWidth =
                warning
                    ? 3
                    : 5;


            ctx.beginPath();


            ctx.arc(
                hazard.x,
                hazard.y,
                hazard.radius,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.stroke();


            if (
                warning
            ) {

                const progress =
                    clamp(

                        1 -
                        hazard.delay /
                        hazard.maxDelay,

                        0,
                        1
                    );


                /*
                    CÍRCULO FECHANDO.
                */

                ctx.strokeStyle =
                    "#fff0b8";


                ctx.lineWidth =
                    3;


                ctx.beginPath();


                ctx.arc(

                    hazard.x,
                    hazard.y,

                    Math.max(
                        6,
                        hazard.radius *
                        (
                            1 -
                            progress *
                            0.82
                        )
                    ),

                    0,

                    Math.PI *
                    2
                );


                ctx.stroke();


                /*
                    PROGRESSO EXTERNO.
                */

                ctx.strokeStyle =
                    "rgba(255,220,150,.68)";


                ctx.beginPath();


                ctx.arc(

                    hazard.x,
                    hazard.y,

                    hazard.radius -
                    7,

                    -Math.PI /
                    2,

                    -Math.PI /
                    2 +
                    Math.PI *
                    2 *
                    progress
                );


                ctx.stroke();
            }
        }
    }


    /* =====================================================
       INIMIGOS
    ===================================================== */

    function drawEnemies() {

        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.dead
            ) {

                continue;
            }


            /*
                SOMBRA.
            */

            ctx.fillStyle =
                "rgba(0,0,0,.30)";


            ctx.beginPath();


            ctx.ellipse(
                enemy.x,
                enemy.y +
                enemy.radius,
                enemy.radius *
                1.1,
                enemy.radius *
                0.42,
                0,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            /*
                AURA.
            */

            if (
                [
                    "progression",
                    "final",
                    "resourceBoss"
                ].includes(
                    enemy.type
                )
            ) {

                const aura =
                    0.18 +
                    (
                        Math.sin(
                            state.time *
                            3 +
                            enemy.x
                        ) +
                        1
                    ) *
                    0.06;


                ctx.strokeStyle =
                    enemy.type ===
                    "final"

                        ? `rgba(190,130,235,${aura})`

                        : `rgba(255,190,100,${aura})`;


                ctx.lineWidth =
                    3;


                ctx.beginPath();


                ctx.arc(
                    enemy.x,
                    enemy.y,
                    enemy.radius *
                    1.55,
                    0,
                    Math.PI *
                    2
                );


                ctx.stroke();
            }


            drawEnemyBody(
                enemy
            );


            /*
                NOME.
            */

            ctx.font =

                [
                    "progression",
                    "final"
                ].includes(
                    enemy.type
                )

                    ? "bold 11px Arial"

                    : "10px Arial";


            ctx.textAlign =
                "center";


            ctx.fillStyle =

                [
                    "progression",
                    "final"
                ].includes(
                    enemy.type
                )

                    ? "#ffcc8a"

                    : "#ede2c2";


            ctx.fillText(

                `${enemy.name}  Nv.${enemy.level || 1}`,

                enemy.x,

                enemy.y +
                enemy.radius +
                19
            );


            /*
                VIDA.
            */

            const barWidth =
                Math.max(
                    42,
                    enemy.radius *
                    2.7
                );


            ctx.fillStyle =
                "#211f1d";


            ctx.fillRect(
                enemy.x -
                barWidth /
                2,
                enemy.y -
                enemy.radius -
                15,
                barWidth,
                7
            );


            ctx.fillStyle =

                [
                    "progression",
                    "final"
                ].includes(
                    enemy.type
                )

                    ? "#d05049"

                    : "#b84e48";


            ctx.fillRect(

                enemy.x -
                barWidth /
                2,

                enemy.y -
                enemy.radius -
                15,

                barWidth *
                clamp(
                    enemy.hp /
                    enemy.maxHp,
                    0,
                    1
                ),

                7
            );


            if (
                enemy.phase >
                    1 &&
                [
                    "progression",
                    "final",
                    "resourceBoss"
                ].includes(
                    enemy.type
                )
            ) {

                ctx.font =
                    "bold 9px Arial";


                ctx.fillStyle =
                    "#f4c36f";


                ctx.fillText(
                    `FASE ${enemy.phase}`,
                    enemy.x,
                    enemy.y -
                    enemy.radius -
                    23
                );
            }
        }
    }


    /* =====================================================
       CORPOS DOS INIMIGOS
    ===================================================== */

    function drawEnemyBody(
        enemy
    ) {

        const flash =
            enemy.hitFlash >
            0

                ? "#ffffff"

                : enemy.color;


        /*
            ÁRVORES.
        */

        if (
            enemy.id ===
                "grove_guardian" ||
            enemy.id ===
                "mountain_guardian"
        ) {

            ctx.fillStyle =
                enemy.hitFlash >
                0
                    ? "#ffffff"
                    : "#6e4c31";


            ctx.fillRect(
                enemy.x -
                10,
                enemy.y -
                4,
                20,
                enemy.radius +
                28
            );


            ctx.fillStyle =
                flash;


            for (
                let i = 0;
                i <
                6;
                i++
            ) {

                const angle =
                    -Math.PI /
                    2 +
                    i *
                    Math.PI *
                    2 /
                    6;


                ctx.beginPath();


                ctx.arc(

                    enemy.x +
                    Math.cos(
                        angle
                    ) *
                    23,

                    enemy.y -
                    12 +
                    Math.sin(
                        angle
                    ) *
                    18,

                    enemy.radius *
                    0.57,

                    0,

                    Math.PI *
                    2
                );


                ctx.fill();
            }


            ctx.fillStyle =
                "#ffc76d";


            ctx.beginPath();


            ctx.arc(
                enemy.x -
                7,
                enemy.y -
                9,
                3,
                0,
                Math.PI *
                2
            );


            ctx.arc(
                enemy.x +
                7,
                enemy.y -
                9,
                3,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            return;
        }


        /*
            SENTINELAS / MINEIROS.
        */

        if (
            enemy.id ===
                "iron_guardian" ||
            enemy.id ===
                "ruby_guardian" ||
            enemy.name.includes(
                "MINEIRO"
            )
        ) {

            ctx.fillStyle =
                flash;


            ctx.beginPath();


            ctx.moveTo(
                enemy.x,
                enemy.y -
                enemy.radius
            );


            ctx.lineTo(
                enemy.x +
                enemy.radius *
                0.9,
                enemy.y -
                4
            );


            ctx.lineTo(
                enemy.x +
                enemy.radius *
                0.65,
                enemy.y +
                enemy.radius
            );


            ctx.lineTo(
                enemy.x -
                enemy.radius *
                0.65,
                enemy.y +
                enemy.radius
            );


            ctx.lineTo(
                enemy.x -
                enemy.radius *
                0.9,
                enemy.y -
                4
            );


            ctx.closePath();


            ctx.fill();


            ctx.strokeStyle =
                "#33383b";


            ctx.lineWidth =
                3;


            ctx.stroke();


            ctx.font =
                "22px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(

                enemy.name.includes(
                    "MINEIRO"
                )

                    ? "⛏️"

                    : enemy.icon,

                enemy.x,

                enemy.y +
                7
            );


            return;
        }


        /*
            OUTRO EU.
        */

        if (
            enemy.id ===
            "other_self"
        ) {

            ctx.fillStyle =
                flash;


            ctx.beginPath();


            ctx.arc(
                enemy.x,
                enemy.y,
                enemy.radius,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.strokeStyle =
                "#c29aff";


            ctx.lineWidth =
                4;


            ctx.stroke();


            ctx.fillStyle =
                "#e5c7a9";


            ctx.beginPath();


            ctx.arc(
                enemy.x,
                enemy.y -
                14,
                11,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.fillStyle =
                "#201b25";


            ctx.beginPath();


            ctx.arc(
                enemy.x,
                enemy.y -
                19,
                11,
                Math.PI,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.font =
                "24px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                "☯",
                enemy.x,
                enemy.y +
                11
            );


            return;
        }


        /*
            GUARDIÃO DO INFERNO.
        */

        if (
            enemy.id ===
            "final_gate_guardian"
        ) {

            ctx.fillStyle =
                flash;


            ctx.beginPath();


            ctx.moveTo(
                enemy.x,
                enemy.y -
                enemy.radius -
                7
            );


            ctx.lineTo(
                enemy.x +
                enemy.radius,
                enemy.y -
                2
            );


            ctx.lineTo(
                enemy.x +
                enemy.radius *
                0.72,
                enemy.y +
                enemy.radius
            );


            ctx.lineTo(
                enemy.x -
                enemy.radius *
                0.72,
                enemy.y +
                enemy.radius
            );


            ctx.lineTo(
                enemy.x -
                enemy.radius,
                enemy.y -
                2
            );


            ctx.closePath();


            ctx.fill();


            ctx.fillStyle =
                "#dfbf8a";


            /*
                CHIFRES.
            */

            ctx.beginPath();


            ctx.moveTo(
                enemy.x -
                22,
                enemy.y -
                30
            );


            ctx.lineTo(
                enemy.x -
                42,
                enemy.y -
                57
            );


            ctx.lineTo(
                enemy.x -
                12,
                enemy.y -
                37
            );


            ctx.closePath();


            ctx.fill();


            ctx.beginPath();


            ctx.moveTo(
                enemy.x +
                22,
                enemy.y -
                30
            );


            ctx.lineTo(
                enemy.x +
                42,
                enemy.y -
                57
            );


            ctx.lineTo(
                enemy.x +
                12,
                enemy.y -
                37
            );


            ctx.closePath();


            ctx.fill();


            ctx.font =
                "27px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                enemy.icon,
                enemy.x,
                enemy.y +
                9
            );


            return;
        }


        /*
            COMUNS.
        */

        ctx.fillStyle =
            flash;


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
                Math.PI *
                2
            );
        }


        ctx.fill();


        ctx.strokeStyle =

            enemy.type ===
            "progression"

                ? "#e0ae63"

                : "rgba(40,35,30,.65)";


        ctx.lineWidth =
            enemy.type ===
            "progression"
                ? 3
                : 1.5;


        ctx.stroke();


        ctx.font =

            enemy.type ===
            "progression"

                ? "26px Arial"

                : "20px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(
            enemy.icon,
            enemy.x,
            enemy.y +
            7
        );
    }


    /* =====================================================
       PORTAIS
    ===================================================== */

    function drawPortals() {

        for (
            const portal of
            state.world.portals
        ) {

            if (
                typeof portal.visible ===
                    "function" &&
                !portal.visible()
            ) {

                continue;
            }


            const unlocked =

                typeof portal.requirement ===
                "function"

                    ? portal.requirement()

                    : true;


            /*
                ESCADA DO INFERNO.
            */

            if (
                portal.stairs
            ) {

                ctx.fillStyle =

                    unlocked

                        ? "rgba(235,218,166,.80)"

                        : "rgba(90,90,90,.35)";


                for (
                    let i = 0;
                    i <
                    8;
                    i++
                ) {

                    ctx.fillRect(

                        portal.x -
                        i *
                        7,

                        portal.y +
                        portal.h -
                        25 -
                        i *
                        22,

                        portal.w +
                        i *
                        14,

                        13
                    );
                }


                ctx.fillStyle =
                    "#fff0bd";


                ctx.font =
                    "bold 13px Georgia";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "ESCADA DO INFERNO",
                    portal.x +
                    portal.w /
                    2,
                    portal.y -
                    18
                );


                continue;
            }


            /*
                PORTAL DE VOLTA.
            */

            if (
                portal.returnPortal
            ) {

                const pulse =
                    0.15 +
                    (
                        Math.sin(
                            state.time *
                            3
                        ) +
                        1
                    ) *
                    0.035;


                ctx.fillStyle =
                    `rgba(218,184,108,${pulse})`;


                ctx.fillRect(
                    portal.x,
                    portal.y,
                    portal.w,
                    portal.h
                );


                ctx.strokeStyle =
                    "#d8bc7a";


                ctx.lineWidth =
                    3;


                ctx.strokeRect(
                    portal.x,
                    portal.y,
                    portal.w,
                    portal.h
                );


                ctx.font =
                    "30px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "↩️",
                    portal.x +
                    portal.w /
                    2,
                    portal.y +
                    portal.h /
                    2
                );


                ctx.fillStyle =
                    "#f1dba5";


                ctx.font =
                    "bold 10px Georgia";


                ctx.fillText(
                    "VOLTAR",
                    portal.x +
                    portal.w /
                    2,
                    portal.y -
                    10
                );


                continue;
            }


            /*
                PORTAL NORMAL.
            */

            const pulse =
                0.72 +
                Math.sin(
                    state.time *
                    3 +
                    portal.x
                ) *
                0.15;


            ctx.fillStyle =

                unlocked

                    ? `rgba(76,150,198,${
                        0.15 *
                        pulse
                    })`

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
                unlocked
                    ? 3
                    : 2;


            ctx.strokeRect(
                portal.x,
                portal.y,
                portal.w,
                portal.h
            );


            if (
                unlocked
            ) {

                for (
                    let i = 0;
                    i <
                    4;
                    i++
                ) {

                    const yy =
                        portal.y +
                        (
                            (
                                state.time *
                                42 +
                                i *
                                55
                            ) %
                            portal.h
                        );


                    ctx.fillStyle =
                        "rgba(188,229,245,.48)";


                    ctx.beginPath();


                    ctx.arc(

                        portal.x +
                        portal.w /
                        2 +
                        Math.sin(
                            state.time *
                            2 +
                            i
                        ) *
                        16,

                        yy,

                        3,

                        0,

                        Math.PI *
                        2
                    );


                    ctx.fill();
                }
            }


            ctx.textAlign =
                "center";


            ctx.font =
                "bold 11px Georgia";


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
    }


    /* =====================================================
       DROPS
    ===================================================== */

    function drawDrops() {

        for (
            const drop of
            state.world.drops
        ) {

            if (
                drop.collected
            ) {

                continue;
            }


            const item =
                ITEMS[
                    drop.type
                ];


            if (
                !item
            ) {

                continue;
            }


            const bob =
                Math.sin(
                    state.time *
                    4 +
                    drop.bob
                ) *
                5;


            const glowRadius =
                drop.type ===
                "flautaMemoria"

                    ? 36

                    : 25;


            const gradient =
                ctx.createRadialGradient(

                    drop.x,
                    drop.y +
                    bob,
                    1,

                    drop.x,
                    drop.y +
                    bob,
                    glowRadius
                );


            gradient.addColorStop(

                0,

                drop.type ===
                "flautaMemoria"

                    ? "rgba(255,240,146,.50)"

                    : "rgba(255,207,101,.32)"
            );


            gradient.addColorStop(
                1,
                "rgba(255,220,120,0)"
            );


            ctx.fillStyle =
                gradient;


            ctx.beginPath();


            ctx.arc(
                drop.x,
                drop.y +
                bob,
                glowRadius,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.font =

                drop.type ===
                "flautaMemoria"

                    ? "30px Arial"

                    : "23px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                item.icon,
                drop.x,
                drop.y +
                bob +
                7
            );


            if (
                drop.amount >
                1
            ) {

                ctx.fillStyle =
                    "#fff0ba";


                ctx.font =
                    "bold 10px Arial";


                ctx.fillText(
                    `x${drop.amount}`,
                    drop.x +
                    15,
                    drop.y +
                    bob +
                    17
                );
            }


            /*
                MOSTRA E.
            */

            if (
                state.player &&
                distance(
                    drop,
                    state.player
                ) <
                84
            ) {

                ctx.fillStyle =
                    "rgba(15,17,20,.82)";


                ctx.fillRect(
                    drop.x -
                    31,
                    drop.y -
                    43 +
                    bob,
                    62,
                    20
                );


                ctx.fillStyle =
                    "#f3d889";


                ctx.font =
                    "bold 10px Arial";


                ctx.fillText(
                    "[E] PEGAR",
                    drop.x,
                    drop.y -
                    29 +
                    bob
                );
            }
        }
    }


    /* =====================================================
       EFEITOS
    ===================================================== */

    function drawEffects() {

        for (
            const effect of
            state.world.effects
        ) {

            const alpha =

                Number.isFinite(
                    effect.life
                ) &&
                Number.isFinite(
                    effect.maxLife
                )

                    ? clamp(
                        effect.life /
                        effect.maxLife,
                        0,
                        1
                    )

                    : 1;


            const progress =

                Number.isFinite(
                    effect.life
                ) &&
                Number.isFinite(
                    effect.maxLife
                )

                    ? 1 -
                      alpha

                    : 0;


            /*
                PASSO.
            */

            if (
                effect.type ===
                "footstep"
            ) {

                ctx.globalAlpha =
                    alpha *
                    0.45;


                ctx.fillStyle =
                    effect.color;


                ctx.beginPath();


                ctx.ellipse(
                    effect.x,
                    effect.y,
                    6,
                    3,
                    0,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                NÚMERO DE DANO.
            */

            if (
                effect.type ===
                "damageNumber"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.fillStyle =
                    effect.color;


                ctx.font =
                    "bold 17px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    effect.text,
                    effect.x,
                    effect.y -
                    progress *
                    34
                );


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                PROJÉTEIS BÁSICOS.
            */

            if (
                effect.type ===
                    "playerProjectile" ||
                effect.type ===
                    "fairyShot"
            ) {

                ctx.globalAlpha =
                    alpha;


                const gradient =
                    ctx.createRadialGradient(

                        effect.x,
                        effect.y,
                        1,

                        effect.x,
                        effect.y,
                        effect.type ===
                        "fairyShot"
                            ? 15
                            : 18
                    );


                gradient.addColorStop(
                    0,
                    effect.glow ||
                    "#ffffff"
                );


                gradient.addColorStop(
                    0.42,
                    effect.color
                );


                gradient.addColorStop(
                    1,
                    "rgba(255,255,255,0)"
                );


                ctx.fillStyle =
                    gradient;


                ctx.beginPath();


                ctx.arc(
                    effect.x,
                    effect.y,
                    effect.type ===
                    "fairyShot"
                        ? 15
                        : 18,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                if (
                    effect.type ===
                    "fairyShot"
                ) {

                    ctx.font =
                        "14px Arial";


                    ctx.textAlign =
                        "center";


                    ctx.fillText(
                        "✦",
                        effect.x,
                        effect.y +
                        5
                    );
                }


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                BOLA DE MEMÓRIA Q.
            */

            if (
                effect.type ===
                "memoryOrb"
            ) {

                const direction =
                    normalizeVector(

                        effect.tx -
                        effect.x,

                        effect.ty -
                        effect.y
                    );


                const travel =
                    Math.min(
                        350,
                        progress *
                        500
                    );


                const x =
                    effect.x +
                    direction.x *
                    travel;


                const y =
                    effect.y +
                    direction.y *
                    travel;


                ctx.globalAlpha =
                    alpha;


                const gradient =
                    ctx.createRadialGradient(
                        x,
                        y,
                        2,
                        x,
                        y,
                        34
                    );


                gradient.addColorStop(
                    0,
                    "#fff8df"
                );


                gradient.addColorStop(
                    0.35,
                    effect.glow ||
                    "#ffd59b"
                );


                gradient.addColorStop(
                    0.75,
                    effect.color
                );


                gradient.addColorStop(
                    1,
                    "rgba(230,150,50,0)"
                );


                ctx.fillStyle =
                    gradient;


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    34,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                ARCOS.
            */

            if (
                [
                    "bladeArc",
                    "clawArc",
                    "smashArc"
                ].includes(
                    effect.type
                )
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =

                    effect.heavy
                        ? 10

                        : effect.type ===
                          "clawArc"
                        ? 5

                        : effect.type ===
                          "smashArc"
                        ? 9

                        : 7;


                const spread =

                    effect.heavy
                        ? 1.8
                        : 1.3;


                ctx.beginPath();


                ctx.arc(

                    effect.x,
                    effect.y,

                    effect.radius,

                    effect.angle -
                    spread /
                    2,

                    effect.angle +
                    spread /
                    2
                );


                ctx.stroke();


                if (
                    effect.type ===
                    "clawArc"
                ) {

                    ctx.lineWidth =
                        2;


                    for (
                        let i = -1;
                        i <=
                        1;
                        i++
                    ) {

                        ctx.beginPath();


                        ctx.arc(

                            effect.x,
                            effect.y,

                            effect.radius +
                            i *
                            8,

                            effect.angle -
                            0.45,

                            effect.angle +
                            0.45
                        );


                        ctx.stroke();
                    }
                }


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                ANÉIS.
            */

            if (
                effect.type ===
                "skillRing"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    5;


                ctx.beginPath();


                ctx.arc(

                    effect.x,
                    effect.y,

                    effect.radius *
                    (
                        0.45 +
                        progress *
                        0.65
                    ),

                    0,

                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                ATAQUE DE MEMÓRIA.
            */

            if (
                effect.type ===
                "memoryStrike"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.fillStyle =
                    effect.color;


                ctx.beginPath();


                ctx.arc(
                    effect.x,
                    effect.y,
                    16 +
                    progress *
                    28,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.strokeStyle =
                    "#fff3c8";


                ctx.lineWidth =
                    2;


                ctx.beginPath();


                ctx.moveTo(
                    effect.x,
                    effect.y -
                    40
                );


                ctx.lineTo(
                    effect.x,
                    effect.y +
                    40
                );


                ctx.stroke();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                ESCUDO.
            */

            if (
                effect.type ===
                "shieldAura"
            ) {

                if (
                    !state.player
                ) {

                    continue;
                }


                ctx.globalAlpha =
                    Math.min(
                        0.72,
                        alpha
                    );


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    4;


                ctx.beginPath();


                ctx.arc(

                    state.player.x,
                    state.player.y,

                    state.player.radius +
                    16 +
                    Math.sin(
                        state.time *
                        3
                    ) *
                    3,

                    0,

                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                RACHADURA.
            */

            if (
                effect.type ===
                "groundCrack"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    4;


                for (
                    let i = 0;
                    i <
                    8;
                    i++
                ) {

                    const angle =
                        Math.PI *
                        2 *
                        i /
                        8;


                    ctx.beginPath();


                    ctx.moveTo(
                        effect.x,
                        effect.y
                    );


                    ctx.lineTo(

                        effect.x +
                        Math.cos(
                            angle
                        ) *
                        effect.radius *
                        progress,

                        effect.y +
                        Math.sin(
                            angle
                        ) *
                        effect.radius *
                        progress
                    );


                    ctx.stroke();
                }


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                RUGIDO.
            */

            if (
                effect.type ===
                "roarWave"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    6;


                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    ctx.beginPath();


                    ctx.arc(

                        effect.x,
                        effect.y,

                        effect.radius *
                        progress *
                        (
                            0.45 +
                            i *
                            0.27
                        ),

                        0,

                        Math.PI *
                        2
                    );


                    ctx.stroke();
                }


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                FLECHA FEÉRICA.
            */

            if (
                effect.type ===
                "fairyArrow"
            ) {

                const direction =
                    normalizeVector(

                        effect.tx -
                        effect.x,

                        effect.ty -
                        effect.y
                    );


                const length =
                    Math.min(
                        420,
                        progress *
                        550
                    );


                const x =
                    effect.x +
                    direction.x *
                    length;


                const y =
                    effect.y +
                    direction.y *
                    length;


                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    4;


                ctx.beginPath();


                ctx.moveTo(
                    x -
                    direction.x *
                    32,
                    y -
                    direction.y *
                    32
                );


                ctx.lineTo(
                    x,
                    y
                );


                ctx.stroke();


                ctx.fillStyle =
                    "#fff0fa";


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    5,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                CURA.
            */

            if (
                effect.type ===
                "healingAura"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    5;


                ctx.beginPath();


                ctx.arc(

                    effect.x,
                    effect.y,

                    effect.radius *
                    (
                        0.4 +
                        progress *
                        0.7
                    ),

                    0,

                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.fillStyle =
                    effect.color;


                ctx.font =
                    "24px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "✦",
                    effect.x,
                    effect.y -
                    30 -
                    progress *
                    30
                );


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                ESTRELA FEÉRICA.
            */

            if (
                effect.type ===
                "fairyStar"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.fillStyle =
                    effect.color;


                ctx.font =
                    `${24 + progress * 18}px Arial`;


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "✦",
                    effect.x,
                    effect.y
                );


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                TRANSFORMAÇÃO.
            */

            if (
                effect.type ===
                "transformAura"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    effect.ultimate
                        ? 7
                        : 4;


                ctx.beginPath();


                ctx.arc(

                    effect.x,
                    effect.y,

                    30 +
                    progress *
                    (
                        effect.ultimate
                            ? 130
                            : 80
                    ),

                    0,

                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                AVISO DO DASH INIMIGO.
            */

            if (
                effect.type ===
                "dashWarning"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    4;


                ctx.setLineDash([
                    10,
                    8
                ]);


                ctx.beginPath();


                ctx.moveTo(
                    effect.x,
                    effect.y
                );


                ctx.lineTo(
                    effect.tx,
                    effect.ty
                );


                ctx.stroke();


                ctx.setLineDash([]);


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                RASTRO DA INVESTIDA.
            */

            if (
                effect.type ===
                "chargeTrail"
            ) {

                ctx.globalAlpha =
                    alpha *
                    0.42;


                ctx.fillStyle =
                    effect.color;


                ctx.beginPath();


                ctx.arc(
                    effect.x,
                    effect.y,
                    effect.radius *
                    1.25,
                    0,
                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                PEDRA E CRISTAL.
            */

            if (
                effect.type ===
                    "rockProjectile" ||
                effect.type ===
                    "crystalProjectile"
            ) {

                const t =
                    clamp(
                        progress,
                        0,
                        1
                    );


                const height =
                    Math.sin(
                        Math.PI *
                        t
                    ) *
                    100;


                const x =
                    lerp(
                        effect.x,
                        effect.tx,
                        t
                    );


                const y =
                    lerp(
                        effect.y,
                        effect.ty,
                        t
                    ) -
                    height;


                ctx.globalAlpha =
                    alpha;


                if (
                    effect.type ===
                    "rockProjectile"
                ) {

                    ctx.fillStyle =
                        "#81786d";


                    ctx.beginPath();


                    ctx.arc(
                        x,
                        y,
                        11,
                        0,
                        Math.PI *
                        2
                    );


                    ctx.fill();
                }

                else {

                    ctx.save();


                    ctx.translate(
                        x,
                        y
                    );


                    ctx.rotate(
                        state.time *
                        7
                    );


                    ctx.fillStyle =
                        "#e95c7d";


                    ctx.beginPath();


                    ctx.moveTo(
                        0,
                        -13
                    );


                    ctx.lineTo(
                        8,
                        0
                    );


                    ctx.lineTo(
                        0,
                        13
                    );


                    ctx.lineTo(
                        -8,
                        0
                    );


                    ctx.closePath();


                    ctx.fill();


                    ctx.restore();
                }


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                CONJURAÇÃO.
            */

            if (
                effect.type ===
                "enemyCast"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    4;


                ctx.beginPath();


                ctx.arc(

                    effect.x,
                    effect.y,

                    effect.radius *
                    (
                        0.45 +
                        progress *
                        0.6
                    ),

                    0,

                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                IMPACTO.
            */

            if (
                effect.type ===
                "hazardImpact"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.fillStyle =
                    effect.color;


                ctx.beginPath();


                ctx.arc(

                    effect.x,
                    effect.y,

                    effect.radius *
                    (
                        0.35 +
                        progress *
                        0.75
                    ),

                    0,

                    Math.PI *
                    2
                );


                ctx.fill();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                GOLPE INIMIGO.
            */

            if (
                effect.type ===
                "enemyHit"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    6;


                ctx.beginPath();


                ctx.arc(
                    effect.x,
                    effect.y,
                    18 +
                    progress *
                    20,
                    0,
                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                FASE DO BOSS.
            */

            if (
                effect.type ===
                "bossPhase"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    7;


                for (
                    let i = 0;
                    i <
                    3;
                    i++
                ) {

                    ctx.beginPath();


                    ctx.arc(

                        effect.x,
                        effect.y,

                        effect.radius *
                        progress *
                        (
                            0.5 +
                            i *
                            0.25
                        ),

                        0,

                        Math.PI *
                        2
                    );


                    ctx.stroke();
                }


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                MORTE.
            */

            if (
                effect.type ===
                "enemyDeath"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    5;


                ctx.beginPath();


                ctx.arc(
                    effect.x,
                    effect.y,
                    effect.radius *
                    progress,
                    0,
                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                LEVEL UP.
            */

            if (
                effect.type ===
                "levelUp"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    6;


                ctx.beginPath();


                ctx.arc(
                    effect.x,
                    effect.y,
                    effect.radius *
                    progress,
                    0,
                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.font =
                    "bold 18px Arial";


                ctx.fillStyle =
                    effect.color;


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "LEVEL UP!",
                    effect.x,
                    effect.y -
                    45 -
                    progress *
                    25
                );


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                QUEBRA DE RECURSO.
            */

            if (
                effect.type ===
                "resourceBreak"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    4;


                for (
                    let i = 0;
                    i <
                    6;
                    i++
                ) {

                    const angle =
                        Math.PI *
                        2 *
                        i /
                        6;


                    ctx.beginPath();


                    ctx.moveTo(
                        effect.x,
                        effect.y
                    );


                    ctx.lineTo(

                        effect.x +
                        Math.cos(
                            angle
                        ) *
                        progress *
                        45,

                        effect.y +
                        Math.sin(
                            angle
                        ) *
                        progress *
                        45
                    );


                    ctx.stroke();
                }


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                MADEIRA.
            */

            if (
                effect.type ===
                "woodBurst"
            ) {

                ctx.globalAlpha =
                    alpha;


                for (
                    let i = 0;
                    i <
                    8;
                    i++
                ) {

                    const angle =
                        Math.PI *
                        2 *
                        i /
                        8;


                    const spread =
                        progress *
                        42;


                    ctx.save();


                    ctx.translate(

                        effect.x +
                        Math.cos(
                            angle
                        ) *
                        spread,

                        effect.y +
                        Math.sin(
                            angle
                        ) *
                        spread
                    );


                    ctx.rotate(
                        progress *
                        6 +
                        i
                    );


                    ctx.fillStyle =
                        effect.color;


                    ctx.fillRect(
                        -5,
                        -3,
                        10,
                        6
                    );


                    ctx.restore();
                }


                ctx.globalAlpha =
                    1;


                continue;
            }


            /*
                SEGREDO.
            */

            if (
                effect.type ===
                "secretReveal"
            ) {

                ctx.globalAlpha =
                    alpha;


                ctx.strokeStyle =
                    effect.color;


                ctx.lineWidth =
                    3;


                ctx.beginPath();


                ctx.arc(
                    effect.x,
                    effect.y,
                    effect.radius *
                    progress,
                    0,
                    Math.PI *
                    2
                );


                ctx.stroke();


                ctx.globalAlpha =
                    1;
            }
        }
    }


    /* =====================================================
       PLAYER
    ===================================================== */

    function drawPlayer() {

        const player =
            state.player;


        if (
            !player
        ) {

            return;
        }


        /*
            PISCA QUANDO ESTÁ INVENCÍVEL.
        */

        if (
            player.invincible >
                0 &&
            Math.floor(
                player.invincible *
                12
            ) %
            2 ===
            0
        ) {

            return;
        }


        const palette =
            getCharacterPalette();


        /*
            SOMBRA.
        */

        ctx.fillStyle =
            "rgba(0,0,0,.28)";


        ctx.beginPath();


        ctx.ellipse(
            player.x,
            player.y +
            20,
            21,
            8,
            0,
            0,
            Math.PI *
            2
        );


        ctx.fill();


        /*
            AURA.
        */

        ctx.strokeStyle =
            palette.main;


        ctx.globalAlpha =
            0.18 +
            (
                Math.sin(
                    state.time *
                    3
                ) +
                1
            ) *
            0.06;


        ctx.lineWidth =
            2;


        ctx.beginPath();


        ctx.arc(
            player.x,
            player.y,
            player.radius +
            8,
            0,
            Math.PI *
            2
        );


        ctx.stroke();


        ctx.globalAlpha =
            1;


        /*
            CORPO.
        */

        ctx.fillStyle =
            palette.main;


        ctx.beginPath();


        ctx.arc(
            player.x,
            player.y,
            player.radius,
            0,
            Math.PI *
            2
        );


        ctx.fill();


        /*
            CABEÇA.
        */

        ctx.fillStyle =
            "#e5c3a2";


        ctx.beginPath();


        ctx.arc(
            player.x,
            player.y -
            12,
            10,
            0,
            Math.PI *
            2
        );


        ctx.fill();


        /*
            CABELO.
        */

        ctx.fillStyle =
            "#2d241f";


        ctx.beginPath();


        ctx.arc(
            player.x,
            player.y -
            16,
            10,
            Math.PI,
            Math.PI *
            2
        );


        ctx.fill();


        /*
            SÍMBOLO.
        */

        const symbols = {

            kaelion:
                "✦",

            theron:
                "◆",

            grumgar:
                "✹",

            lirael:
                "✧",

            zephyr:
                "◈"
        };


        ctx.fillStyle =
            palette.glow;


        ctx.font =
            "15px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(
            symbols[
                player.characterId
            ] ||
            "✦",
            player.x,
            player.y +
            6
        );


        /*
            NOME.
        */

        ctx.font =
            "bold 13px Arial";


        ctx.fillStyle =
            "#fff0c8";


        ctx.fillText(
            player.name,
            player.x,
            player.y -
            40
        );
    }


    /* =====================================================
       TEXTOS DO MUNDO
    ===================================================== */

    function drawWorldLabels() {

        ctx.textAlign =
            "center";


        if (
            state.area ===
            "village"
        ) {

            ctx.font =
                "bold 22px Georgia";


            ctx.fillStyle =
                "rgba(255,229,172,.78)";


            ctx.fillText(
                "PRAÇA DA VILA",
                1600,
                820
            );


            ctx.font =
                "14px Georgia";


            ctx.fillStyle =
                "rgba(255,255,255,.58)";


            ctx.fillText(
                "A Quietude ainda não alcançou este lugar por completo...",
                1600,
                845
            );
        }


        else if (
            state.area ===
            "sky"
        ) {

            ctx.font =
                "bold 21px Georgia";


            ctx.fillStyle =
                "rgba(255,245,210,.76)";


            ctx.fillText(
                "ALTAR DAS CINCO HORDAS",
                1710,
                1020
            );
        }


        else if (
            state.area ===
            "hell"
        ) {

            ctx.font =
                "bold 20px Georgia";


            ctx.fillStyle =
                "rgba(255,125,90,.64)";


            ctx.fillText(
                "DERROTE OS CINCO TIPOS DE CRIATURAS",
                1820,
                150
            );
        }


        else if (
            state.area ===
            "final"
        ) {

            ctx.font =
                "bold 24px Georgia";


            ctx.fillStyle =
                "rgba(210,180,230,.65)";


            ctx.fillText(
                "CÂMARA DA ÚLTIMA MEMÓRIA",
                1100,
                145
            );
        }
    }


    /* =====================================================
       PARTÍCULAS
    ===================================================== */

    function drawParticles() {

        for (
            const particle of
            state.world.particles
        ) {

            ctx.globalAlpha =
                clamp(

                    particle.life /
                    (
                        particle.maxLife ||
                        0.85
                    ),

                    0,

                    1
                );


            ctx.fillStyle =
                particle.color;


            ctx.beginPath();


            ctx.arc(
                particle.x,
                particle.y,
                particle.size ||
                3,
                0,
                Math.PI *
                2
            );


            ctx.fill();
        }


        ctx.globalAlpha =
            1;
    }


    /* =====================================================
       MINIMAPA
    ===================================================== */

    function drawMinimap() {

        miniCtx.clearRect(
            0,
            0,
            miniCanvas.width,
            miniCanvas.height
        );


        if (
            !state.player
        ) {

            return;
        }


        const width =
            miniCanvas.width;


        const height =
            miniCanvas.height;


        /*
            CASA.
        */

        if (
            state.houseMode
        ) {

            miniCtx.fillStyle =
                "#171617";


            miniCtx.fillRect(
                0,
                0,
                width,
                height
            );


            const room =
                getHouseRoom();


            miniCtx.fillStyle =
                "#8c6a4b";


            miniCtx.fillRect(
                25,
                20,
                width -
                50,
                height -
                40
            );


            miniCtx.fillStyle =
                "#ffd76f";


            miniCtx.beginPath();


            miniCtx.arc(
                width /
                2,
                height *
                0.72,
                4,
                0,
                Math.PI *
                2
            );


            miniCtx.fill();


            miniCtx.fillStyle =
                "#f1e0ba";


            miniCtx.font =
                "8px Arial";


            miniCtx.textAlign =
                "center";


            miniCtx.fillText(
                state.currentHouse
                    ?.name ||
                "INTERIOR",
                width /
                2,
                12
            );


            return;
        }


        const scaleX =
            width /
            state.world.width;


        const scaleY =
            height /
            state.world.height;


        const visual =
            REGIONS[
                state.area
            ].visual;


        const colors = {

            village:
                "#536b4b",

            forest:
                "#3d6041",

            grove:
                "#34583a",

            mountains:
                "#92999b",

            iron:
                "#292e31",

            ruby:
                "#48252b",

            shadow:
                "#171d2e",

            fairy:
                "#59456b",

            sky:
                "#92b2c8",

            hell:
                "#45201f",

            final:
                "#18171b"
        };


        miniCtx.fillStyle =
            colors[
                visual
            ] ||
            "#38483a";


        miniCtx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
            CAMINHOS.
        */

        miniCtx.lineCap =
            "round";


        miniCtx.lineJoin =
            "round";


        for (
            const path of
            state.world.paths
        ) {

            if (
                path.points.length <
                2
            ) {

                continue;
            }


            miniCtx.strokeStyle =
                "rgba(224,201,151,.48)";


            miniCtx.lineWidth =
                Math.max(
                    2,
                    path.width *
                    scaleY
                );


            miniCtx.beginPath();


            path.points.forEach(
                (
                    point,
                    index
                ) => {

                    const x =
                        point.x *
                        scaleX;


                    const y =
                        point.y *
                        scaleY;


                    if (
                        index ===
                        0
                    ) {

                        miniCtx.moveTo(
                            x,
                            y
                        );
                    }

                    else {

                        miniCtx.lineTo(
                            x,
                            y
                        );
                    }
                }
            );


            miniCtx.stroke();
        }


        /*
            CASAS.
        */

        miniCtx.fillStyle =
            "#d4b985";


        for (
            const building of
            state.world.buildings
        ) {

            miniCtx.fillRect(

                building.x *
                scaleX,

                building.y *
                scaleY,

                Math.max(
                    3,
                    building.w *
                    scaleX
                ),

                Math.max(
                    3,
                    building.h *
                    scaleY
                )
            );
        }


        /*
            RECURSOS.
        */

        miniCtx.fillStyle =
            "#d3c06d";


        for (
            const resource of
            state.world.resources
        ) {

            if (
                !resource.alive
            ) {

                continue;
            }


            miniCtx.fillRect(
                resource.x *
                scaleX -
                1,
                resource.y *
                scaleY -
                1,
                2,
                2
            );
        }


        /*
            NPCS.
        */

        miniCtx.fillStyle =
            "#f3e6b8";


        for (
            const npc of
            state.world.npcs
        ) {

            miniCtx.beginPath();


            miniCtx.arc(
                npc.x *
                scaleX,
                npc.y *
                scaleY,
                2,
                0,
                Math.PI *
                2
            );


            miniCtx.fill();
        }


        /*
            BOSSES.
        */

        miniCtx.fillStyle =
            "#dc6257";


        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.dead ||
                ![
                    "progression",
                    "final"
                ].includes(
                    enemy.type
                )
            ) {

                continue;
            }


            miniCtx.beginPath();


            miniCtx.arc(
                enemy.x *
                scaleX,
                enemy.y *
                scaleY,
                3,
                0,
                Math.PI *
                2
            );


            miniCtx.fill();
        }


        /*
            DROPS.
        */

        miniCtx.fillStyle =
            "#ffe177";


        for (
            const drop of
            state.world.drops
        ) {

            miniCtx.beginPath();


            miniCtx.arc(
                drop.x *
                scaleX,
                drop.y *
                scaleY,
                2.3,
                0,
                Math.PI *
                2
            );


            miniCtx.fill();
        }


        /*
            PORTAIS.
        */

        miniCtx.fillStyle =
            "#81c6dc";


        for (
            const portal of
            state.world.portals
        ) {

            if (
                typeof portal.visible ===
                    "function" &&
                !portal.visible()
            ) {

                continue;
            }


            miniCtx.fillRect(

                portal.x *
                scaleX,

                portal.y *
                scaleY,

                Math.max(
                    2,
                    portal.w *
                    scaleX
                ),

                Math.max(
                    4,
                    portal.h *
                    scaleY
                )
            );
        }


        /*
            PLAYER.
        */

        miniCtx.fillStyle =
            "#ffffff";


        miniCtx.beginPath();


        miniCtx.arc(
            state.player.x *
            scaleX,
            state.player.y *
            scaleY,
            3.8,
            0,
            Math.PI *
            2
        );


        miniCtx.fill();


        miniCtx.strokeStyle =
            getCharacterPalette()
                .main;


        miniCtx.lineWidth =
            1.5;


        miniCtx.stroke();
    }


    /* =====================================================
       MAPA GRANDE
    ===================================================== */

    function drawLargeMap() {

        if (
            !state.player
        ) {

            return;
        }


        const width =
            mapCanvas.width;


        const height =
            mapCanvas.height;


        mapCtx.clearRect(
            0,
            0,
            width,
            height
        );


        const margin =
            32;


        const scaleX =
            (
                width -
                margin *
                2
            ) /
            state.world.width;


        const scaleY =
            (
                height -
                margin *
                2
            ) /
            state.world.height;


        const visual =
            REGIONS[
                state.area
            ].visual;


        const colors = {

            village:
                "#536b4b",

            forest:
                "#3d6041",

            grove:
                "#34583a",

            mountains:
                "#92999b",

            iron:
                "#292e31",

            ruby:
                "#48252b",

            shadow:
                "#171d2e",

            fairy:
                "#59456b",

            sky:
                "#92b2c8",

            hell:
                "#45201f",

            final:
                "#18171b"
        };


        mapCtx.fillStyle =
            colors[
                visual
            ] ||
            "#3f4d3f";


        mapCtx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
            BORDA.
        */

        mapCtx.strokeStyle =
            "rgba(236,219,174,.32)";


        mapCtx.lineWidth =
            3;


        mapCtx.strokeRect(
            margin,
            margin,
            width -
            margin *
            2,
            height -
            margin *
            2
        );


        const mx =
            worldX =>
                margin +
                worldX *
                scaleX;


        const my =
            worldY =>
                margin +
                worldY *
                scaleY;


        /*
            CAMINHOS.
        */

        for (
            const path of
            state.world.paths
        ) {

            mapCtx.strokeStyle =
                "rgba(221,196,142,.56)";


            mapCtx.lineWidth =
                Math.max(
                    3,
                    path.width *
                    scaleY
                );


            mapCtx.lineCap =
                "round";


            mapCtx.lineJoin =
                "round";


            mapCtx.beginPath();


            path.points.forEach(
                (
                    point,
                    index
                ) => {

                    if (
                        index ===
                        0
                    ) {

                        mapCtx.moveTo(
                            mx(
                                point.x
                            ),
                            my(
                                point.y
                            )
                        );
                    }

                    else {

                        mapCtx.lineTo(
                            mx(
                                point.x
                            ),
                            my(
                                point.y
                            )
                        );
                    }
                }
            );


            mapCtx.stroke();
        }


        /*
            CONSTRUÇÕES.
        */

        for (
            const building of
            state.world.buildings
        ) {

            mapCtx.fillStyle =
                "#c7aa77";


            mapCtx.fillRect(

                mx(
                    building.x
                ),

                my(
                    building.y
                ),

                Math.max(
                    8,
                    building.w *
                    scaleX
                ),

                Math.max(
                    7,
                    building.h *
                    scaleY
                )
            );


            mapCtx.fillStyle =
                "#eee0bc";


            mapCtx.font =
                "10px Arial";


            mapCtx.textAlign =
                "center";


            mapCtx.fillText(
                building.name,
                mx(
                    building.x +
                    building.w /
                    2
                ),
                my(
                    building.y
                ) -
                6
            );
        }


        /*
            ÁRVORES.
        */

        mapCtx.fillStyle =
            "rgba(30,77,39,.52)";


        for (
            const tree of
            state.world.trees
        ) {

            if (
                !tree.alive
            ) {

                continue;
            }


            mapCtx.beginPath();


            mapCtx.arc(
                mx(
                    tree.x
                ),
                my(
                    tree.y
                ),
                2.2,
                0,
                Math.PI *
                2
            );


            mapCtx.fill();
        }


        /*
            RECURSOS.
        */

        for (
            const resource of
            state.world.resources
        ) {

            if (
                !resource.alive
            ) {

                continue;
            }


            mapCtx.fillStyle =

                resource.type ===
                "rubi"

                    ? "#ef6076"

                    : resource.type ===
                      "ouro"

                    ? "#ffd46c"

                    : resource.type ===
                      "cristal"

                    ? "#c299ff"

                    : "#bcc8cb";


            mapCtx.fillRect(
                mx(
                    resource.x
                ) -
                2,
                my(
                    resource.y
                ) -
                2,
                4,
                4
            );
        }


        /*
            CENOURAS.
        */

        mapCtx.fillStyle =
            "#ec9843";


        for (
            const food of
            state.world.foods
        ) {

            if (
                !food.alive
            ) {

                continue;
            }


            mapCtx.beginPath();


            mapCtx.arc(
                mx(
                    food.x
                ),
                my(
                    food.y
                ),
                2.7,
                0,
                Math.PI *
                2
            );


            mapCtx.fill();
        }


        /*
            NPCS.
        */

        mapCtx.fillStyle =
            "#fff2c8";


        for (
            const npc of
            state.world.npcs
        ) {

            mapCtx.beginPath();


            mapCtx.arc(
                mx(
                    npc.x
                ),
                my(
                    npc.y
                ),
                4,
                0,
                Math.PI *
                2
            );


            mapCtx.fill();


            mapCtx.font =
                "9px Arial";


            mapCtx.fillText(
                npc.name,
                mx(
                    npc.x
                ),
                my(
                    npc.y
                ) -
                7
            );
        }


        /*
            INIMIGOS.
        */

        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.dead
            ) {

                continue;
            }


            mapCtx.fillStyle =

                [
                    "progression",
                    "final",
                    "resourceBoss"
                ].includes(
                    enemy.type
                )

                    ? "#e2584d"

                    : "#914c45";


            mapCtx.beginPath();


            mapCtx.arc(

                mx(
                    enemy.x
                ),

                my(
                    enemy.y
                ),

                [
                    "progression",
                    "final"
                ].includes(
                    enemy.type
                )
                    ? 6
                    : 3,

                0,

                Math.PI *
                2
            );


            mapCtx.fill();


            if (
                [
                    "progression",
                    "final"
                ].includes(
                    enemy.type
                )
            ) {

                mapCtx.fillStyle =
                    "#ffd1a3";


                mapCtx.font =
                    "9px Arial";


                mapCtx.textAlign =
                    "center";


                mapCtx.fillText(
                    enemy.name,
                    mx(
                        enemy.x
                    ),
                    my(
                        enemy.y
                    ) -
                    9
                );
            }
        }


        /*
            DROPS.
        */

        for (
            const drop of
            state.world.drops
        ) {

            mapCtx.fillStyle =
                drop.type ===
                "flautaMemoria"
                    ? "#fff08a"
                    : "#f2c460";


            mapCtx.beginPath();


            mapCtx.arc(
                mx(
                    drop.x
                ),
                my(
                    drop.y
                ),
                drop.type ===
                "flautaMemoria"
                    ? 6
                    : 4,
                0,
                Math.PI *
                2
            );


            mapCtx.fill();
        }


        /*
            PORTAIS.
        */

        for (
            const portal of
            state.world.portals
        ) {

            if (
                typeof portal.visible ===
                    "function" &&
                !portal.visible()
            ) {

                continue;
            }


            const unlocked =

                typeof portal.requirement ===
                "function"

                    ? portal.requirement()

                    : true;


            mapCtx.fillStyle =

                portal.returnPortal

                    ? "#d8b977"

                    : unlocked

                    ? "#74c1dc"

                    : "#65676a";


            mapCtx.fillRect(

                mx(
                    portal.x
                ),

                my(
                    portal.y
                ),

                Math.max(
                    5,
                    portal.w *
                    scaleX
                ),

                Math.max(
                    8,
                    portal.h *
                    scaleY
                )
            );
        }


        /*
            PLAYER.
        */

        mapCtx.fillStyle =
            "#ffffff";


        mapCtx.beginPath();


        mapCtx.arc(
            mx(
                state.player.x
            ),
            my(
                state.player.y
            ),
            6,
            0,
            Math.PI *
            2
        );


        mapCtx.fill();


        mapCtx.strokeStyle =
            getCharacterPalette()
                .main;


        mapCtx.lineWidth =
            3;


        mapCtx.stroke();


        /*
            TÍTULO.
        */

        mapCtx.fillStyle =
            "#f4e3ba";


        mapCtx.font =
            "bold 17px Georgia";


        mapCtx.textAlign =
            "center";


        mapCtx.fillText(
            REGIONS[
                state.area
            ].name,
            width /
            2,
            22
        );


        /*
            LEGENDA.
        */

        mapCtx.font =
            "10px Arial";


        mapCtx.textAlign =
            "left";


        mapCtx.fillStyle =
            "#f0e2c1";


        mapCtx.fillText(
            "● Você",
            45,
            height -
            12
        );


        mapCtx.fillStyle =
            "#e2584d";


        mapCtx.fillText(
            "● Boss",
            105,
            height -
            12
        );


        mapCtx.fillStyle =
            "#f2c460";


        mapCtx.fillText(
            "● Drop",
            165,
            height -
            12
        );


        mapCtx.fillStyle =
            "#74c1dc";


        mapCtx.fillText(
            "■ Passagem",
            225,
            height -
            12
        );
    }


    /* =====================================================
       SAVE
    ===================================================== */

    function saveGame(
        showMessage =
            true
    ) {

        if (
            !state.player
        ) {

            return false;
        }


        try {

            const data = {

                version:
                    16,

                area:
                    state.area,

                player:
                    state.player,

                houseMode:
                    state.houseMode,

                currentHouseId:
                    state.currentHouse
                        ?.id ||
                    null,

                houseReturn:
                    state.houseReturn,

                savedAt:
                    Date.now()
            };


            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify(
                    data
                )
            );


            updateContinueButton();


            if (
                showMessage
            ) {

                showToast(
                    "Jogo salvo."
                );
            }


            return true;
        }

        catch (
            error
        ) {

            console.error(
                "Erro ao salvar:",
                error
            );


            if (
                showMessage
            ) {

                showToast(
                    "Não foi possível salvar."
                );
            }


            return false;
        }
    }


    /* =====================================================
       REPARAR SAVE ANTIGO
    ===================================================== */

    function repairPlayer(
        player
    ) {

        if (
            !player
        ) {

            return null;
        }


        const character =
            CHARACTERS.find(
                item =>
                    item.id ===
                    player.characterId
            ) ||
            CHARACTERS[0];


        const defaults = {

            name:
                player.name ||
                "Viajante",

            characterId:
                character.id,

            className:
                character.className,

            icon:
                character.icon,

            color:
                character.color,

            x:
                480,

            y:
                610,

            radius:
                18,

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

            level:
                1,

            xp:
                0,

            xpToNext:
                100,

            money:
                35,

            hunger:
                100,

            fatigue:
                100,

            memory:
                0,

            inventory:
                {},

            equipment: {

                weapon:
                    null,

                armor:
                    null,

                tool:
                    "machado"
            },

            quest: {

                wood: {

                    state:
                        "none",

                    need:
                        10,

                    rewardXP:
                        100,

                    rewardMoney:
                        80
                },

                coal: {

                    state:
                        "none",

                    need:
                        8,

                    rewardXP:
                        130,

                    rewardMoney:
                        110
                }
            },

            defeatedBosses:
                [],

            discoveredBosses:
                [],

            unlockedAreas:
                [
                    "village"
                ],

            collected:
                {},

            hellTypesDefeated:
                {},

            secretsFound:
                [],

            worldSeeds:
                {},

            skyTrial: {

                started:
                    false,

                wave:
                    0,

                activeWave:
                    0,

                complete:
                    false
            },

            flutePlayed:
                false,

            checkpoint: {

                area:
                    "village",

                x:
                    480,

                y:
                    610
            },

            skillCooldowns: {

                q:
                    0,

                r:
                    0,

                f:
                    0
            },

            damageReduction:
                0,

            shieldTimer:
                0,

            stunTimer:
                0,

            dead:
                false,

            invincible:
                0,

            attackCooldown:
                0,

            adaptiveBuff:
                false,

            finalChoice:
                null,

            finalDefeated:
                false
        };


        const repaired = {

            ...defaults,
            ...player
        };


        /*
            INVENTÁRIO.
        */

        repaired.inventory = {

            ...Object.fromEntries(
                Object.keys(
                    ITEMS
                )
                    .map(
                        id => [
                            id,
                            0
                        ]
                    )
            ),

            ...player.inventory
        };


        /*
            GARANTE MACHADO EM SAVE MUITO ANTIGO.
        */

        if (
            repaired.inventory.machado ===
                undefined
        ) {

            repaired.inventory.machado =
                1;
        }


        /*
            EQUIPAMENTO.
        */

        repaired.equipment = {

            ...defaults.equipment,
            ...player.equipment
        };


        /*
            MISSÕES.
        */

        repaired.quest = {

            wood: {

                ...defaults.quest.wood,
                ...player.quest
                    ?.wood
            },

            coal: {

                ...defaults.quest.coal,
                ...player.quest
                    ?.coal
            }
        };


        repaired.defeatedBosses =
            Array.isArray(
                player.defeatedBosses
            )
                ? player.defeatedBosses
                : [];


        repaired.discoveredBosses =
            Array.isArray(
                player.discoveredBosses
            )
                ? player.discoveredBosses
                : [];


        repaired.unlockedAreas =
            Array.isArray(
                player.unlockedAreas
            )
                ? player.unlockedAreas
                : [
                    "village"
                ];


        repaired.secretsFound =
            Array.isArray(
                player.secretsFound
            )
                ? player.secretsFound
                : [];


        repaired.collected =

            player.collected &&
            typeof player.collected ===
                "object"

                ? player.collected

                : {};


        repaired.hellTypesDefeated =

            player.hellTypesDefeated &&
            typeof player.hellTypesDefeated ===
                "object"

                ? player.hellTypesDefeated

                : {};


        repaired.worldSeeds =

            player.worldSeeds &&
            typeof player.worldSeeds ===
                "object"

                ? player.worldSeeds

                : {};


        Object.keys(
            REGIONS
        )
            .forEach(
                (
                    area,
                    index
                ) => {

                    if (
                        !Number.isFinite(
                            repaired.worldSeeds[
                                area
                            ]
                        )
                    ) {

                        repaired.worldSeeds[
                            area
                        ] =
                            hashString(
                                `${repaired.name}:${area}:${index}`
                            );
                    }
                }
            );


        repaired.skyTrial = {

            ...defaults.skyTrial,
            ...player.skyTrial
        };


        /*
            Se salvou no meio de uma horda,
            reinicia apenas aquela horda.
        */

        if (
            repaired.skyTrial
                .activeWave >
            0
        ) {

            repaired.skyTrial
                .activeWave =
                0;


            repaired.skyTrial
                .started =
                repaired.skyTrial
                    .wave >
                0;
        }


        repaired.skillCooldowns = {

            q:
                0,

            r:
                0,

            f:
                0,

            ...player.skillCooldowns
        };


        repaired.damageReduction =
            0;


        repaired.shieldTimer =
            0;


        repaired.stunTimer =
            0;


        repaired.dead =
            false;


        repaired.invincible =
            0;


        repaired.attackCooldown =
            0;


        repaired.playerDash =
            null;


        /*
            Segurança numérica.
        */

        [
            "hp",
            "maxHp",
            "magic",
            "maxMagic",
            "energy",
            "maxEnergy",
            "speed",
            "damage",
            "defense",
            "level",
            "xp",
            "xpToNext",
            "money",
            "hunger",
            "fatigue"
        ]
            .forEach(
                key => {

                    if (
                        !Number.isFinite(
                            repaired[
                                key
                            ]
                        )
                    ) {

                        repaired[
                            key
                        ] =
                            defaults[
                                key
                            ];
                    }
                }
            );


        repaired.hp =
            clamp(
                repaired.hp,
                1,
                repaired.maxHp
            );


        repaired.magic =
            clamp(
                repaired.magic,
                0,
                repaired.maxMagic
            );


        repaired.energy =
            clamp(
                repaired.energy,
                0,
                repaired.maxEnergy
            );


        repaired.hunger =
            clamp(
                repaired.hunger,
                0,
                100
            );


        repaired.fatigue =
            clamp(
                repaired.fatigue,
                0,
                100
            );


        return repaired;
    }


    /* =====================================================
       LOAD
    ===================================================== */

    function loadGame() {

        const raw =
            localStorage.getItem(
                SAVE_KEY
            );


        if (
            !raw
        ) {

            return false;
        }


        try {

            const data =
                JSON.parse(
                    raw
                );


            const player =
                repairPlayer(
                    data.player
                );


            if (
                !player
            ) {

                return false;
            }


            state.player =
                player;


            state.area =
                REGIONS[
                    data.area
                ]
                    ? data.area
                    : player.checkpoint
                        ?.area &&
                      REGIONS[
                          player.checkpoint
                              .area
                      ]
                    ? player.checkpoint
                        .area
                    : "village";


            state.houseMode =
                false;


            state.currentHouse =
                null;


            state.houseReturn =
                null;


            state.dialogue =
                null;


            state.travel =
                null;


            state.battle =
                null;


            state.shopNPC =
                null;


            state.questNPC =
                null;


            state.holdAction =
                null;


            state.finalChoiceShown =
                false;


            state.portalCooldown =
                1;


            buildWorld();


            /*
                RESTAURA INTERIOR.
            */

            if (
                data.houseMode &&
                state.area ===
                    "village" &&
                data.currentHouseId
            ) {

                const building =
                    state.world
                        .buildings
                        .find(
                            item =>
                                item.id ===
                                data.currentHouseId
                        );


                if (
                    building
                ) {

                    state.currentHouse =
                        building;


                    state.houseMode =
                        true;


                    state.houseReturn =
                        data.houseReturn ||
                        {

                            x:
                                building.x +
                                building.w /
                                2,

                            y:
                                building.y +
                                building.h +
                                58
                        };


                    placePlayerInsideHouse();
                }
            }


            /*
                GARANTE PLAYER FORA DE OBSTÁCULO.
            */

            if (
                !state.houseMode &&
                !canPlayerMoveTo(
                    state.player.x,
                    state.player.y,
                    state.player.radius
                )
            ) {

                const checkpoint =
                    state.player
                        .checkpoint;


                if (
                    checkpoint &&
                    checkpoint.area ===
                        state.area &&
                    canPlayerMoveTo(
                        checkpoint.x,
                        checkpoint.y,
                        state.player.radius
                    )
                ) {

                    state.player.x =
                        checkpoint.x;


                    state.player.y =
                        checkpoint.y;
                }

                else {

                    state.player.x =
                        170;


                    state.player.y =
                        state.world.height /
                        2;
                }
            }


            closeAllPanels();


            updateHUD();


            updateCamera();


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


            showToast(
                "Jogo carregado."
            );


            return true;
        }

        catch (
            error
        ) {

            console.error(
                "Erro ao carregar save:",
                error
            );


            return false;
        }
    }


    /* =====================================================
       BOTÃO CONTINUAR
    ===================================================== */

    function updateContinueButton() {

        const button =
            must(
                "continueBtn"
            );


        const hint =
            must(
                "continueHint"
            );


        let valid =
            false;


        try {

            const raw =
                localStorage.getItem(
                    SAVE_KEY
                );


            if (
                raw
            ) {

                const data =
                    JSON.parse(
                        raw
                    );


                valid =
                    Boolean(
                        data &&
                        data.player &&
                        data.player.name
                    );
            }
        }

        catch (
            error
        ) {

            console.warn(
                "Save inválido:",
                error
            );


            valid =
                false;
        }


        button.disabled =
            !valid;


        hint.textContent =
            valid
                ? "Um jogo salvo foi encontrado."
                : "Nenhum jogo salvo.";
    }


    /* =====================================================
       TECLADO
    ===================================================== */

    function handleKeyDown(
        event
    ) {

        const key =
            event.key
                .toLowerCase();


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

            if (
                screens.game
                    .classList
                    .contains(
                        "active"
                    ) &&
                !isGameplayOverlayOpen()
            ) {

                event.preventDefault();


                state.keys.add(
                    key
                );
            }


            return;
        }


        /*
            E.
        */

        if (
            key ===
            "e"
        ) {

            if (
                !screens.game
                    .classList
                    .contains(
                        "active"
                    )
            ) {

                return;
            }


            event.preventDefault();


            state.keys.add(
                "e"
            );


            if (
                !event.repeat &&
                !isGameplayOverlayOpen()
            ) {

                playerAction();
            }


            return;
        }


        if (
            event.repeat
        ) {

            return;
        }


        /*
            ENTER EM DIÁLOGO.
        */

        if (
            event.key ===
                "Enter" &&
            state.dialogue
        ) {

            event.preventDefault();


            advanceDialogue();


            return;
        }


        /*
            Z.
        */

        if (
            key ===
                "z" &&
            screens.game
                .classList
                .contains(
                    "active"
                ) &&
            !isGameplayOverlayOpen()
        ) {

            event.preventDefault();


            handleZ();


            return;
        }


        /*
            SKILLS.
        */

        if (
            [
                "q",
                "r",
                "f"
            ].includes(
                key
            ) &&
            screens.game
                .classList
                .contains(
                    "active"
                ) &&
            !isGameplayOverlayOpen()
        ) {

            event.preventDefault();


            useSkill(
                key
            );


            return;
        }


        /*
            INVENTÁRIO.
        */

        if (
            key ===
                "i" &&
            screens.game
                .classList
                .contains(
                    "active"
                )
        ) {

            event.preventDefault();


            togglePanel(
                "inventoryPanel",
                updateInventory
            );


            return;
        }


        /*
            MAPA.
        */

        if (
            key ===
                "m" &&
            screens.game
                .classList
                .contains(
                    "active"
                )
        ) {

            event.preventDefault();


            togglePanel(
                "mapPanel",
                drawLargeMap
            );


            return;
        }


        /*
            LIVRO.
        */

        if (
            key ===
                "l" &&
            screens.game
                .classList
                .contains(
                    "active"
                )
        ) {

            event.preventDefault();


            togglePanel(
                "bookPanel",
                renderBook
            );


            return;
        }


        /*
            POÇÃO.
        */

        if (
            key ===
                "1" &&
            state.player
        ) {

            event.preventDefault();


            useItem(
                "pocao"
            );


            return;
        }


        /*
            ELIXIR.
        */

        if (
            key ===
                "2" &&
            state.player
        ) {

            event.preventDefault();


            useItem(
                "elixir"
            );


            return;
        }


        /*
            COMIDA.
        */

        if (
            key ===
                "3" &&
            state.player
        ) {

            event.preventDefault();


            if (
                state.player
                    .inventory
                    .carneCaca >
                0
            ) {

                useItem(
                    "carneCaca"
                );
            }

            else {

                useItem(
                    "pao"
                );
            }


            return;
        }


        /*
            FLAUTA.
        */

        if (
            key ===
                "4" &&
            state.player
        ) {

            event.preventDefault();


            useMemoryFlute();


            return;
        }


        /*
            ESC.
        */

        if (
            key ===
            "escape"
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


            const ids = [

                "inventoryPanel",
                "mapPanel",
                "bookPanel",
                "shopPanel",
                "questPanel"
            ];


            const opened =
                ids.find(
                    id =>
                        !must(
                            id
                        ).classList.contains(
                            "hidden"
                        )
                );


            if (
                opened
            ) {

                must(
                    opened
                ).classList.add(
                    "hidden"
                );


                return;
            }


            if (
                screens.game
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
       CLIQUE SEGURO
    ===================================================== */

    function bindClick(
        id,
        handler
    ) {

        const element =
            must(
                id
            );


        element.addEventListener(
            "click",
            event => {

                event.preventDefault();


                handler(
                    event
                );
            }
        );
    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    function bindEvents() {

        /*
            MENU PRINCIPAL.
        */

        bindClick(
            "newGameBtn",
            startNewGame
        );


        bindClick(
            "continueBtn",
            () => {

                if (
                    must(
                        "continueBtn"
                    ).disabled
                ) {

                    return;
                }


                const fade =
                    must(
                        "uiFade"
                    );


                fade.classList.add(
                    "active"
                );


                setTimeout(
                    () => {

                        const loaded =
                            loadGame();


                        requestAnimationFrame(
                            () =>
                                fade.classList.remove(
                                    "active"
                                )
                        );


                        if (
                            !loaded
                        ) {

                            updateContinueButton();


                            showScreen(
                                "menu"
                            );
                        }
                    },
                    300
                );
            }
        );


        bindClick(
            "howToBtn",
            () =>
                fadeToScreen(
                    "how"
                )
        );


        bindClick(
            "creditsBtn",
            () =>
                fadeToScreen(
                    "credits"
                )
        );


        bindClick(
            "closeHowBtn",
            () =>
                fadeToScreen(
                    "menu"
                )
        );


        bindClick(
            "closeCreditsBtn",
            () =>
                fadeToScreen(
                    "menu"
                )
        );


        bindClick(
            "backMenuBtn",
            () =>
                fadeToScreen(
                    "menu"
                )
        );


        bindClick(
            "startGameBtn",
            startGame
        );


        /*
            HUD.
        */

        bindClick(
            "saveBtn",
            () =>
                saveGame(
                    true
                )
        );


        bindClick(
            "menuBtn",
            returnToMenu
        );


        bindClick(
            "inventoryBtn",
            () =>
                togglePanel(
                    "inventoryPanel",
                    updateInventory
                )
        );


        bindClick(
            "mapBtn",
            () =>
                togglePanel(
                    "mapPanel",
                    drawLargeMap
                )
        );


        bindClick(
            "bookBtn",
            () =>
                togglePanel(
                    "bookPanel",
                    renderBook
                )
        );


        /*
            VIAGEM.
        */

        bindClick(
            "travelYes",
            confirmTravel
        );


        bindClick(
            "travelNo",
            cancelTravel
        );


        /*
            BATALHA.
        */

        bindClick(
            "battleAccept",
            acceptBattle
        );


        bindClick(
            "battleDecline",
            declineBattle
        );


        /*
            MORTE.
        */

        bindClick(
            "respawnBtn",
            respawnPlayer
        );


        /*
            MISSÃO.
        */

        bindClick(
            "questActionBtn",
            executeQuestAction
        );


        /*
            ENTER NO CAMPO DO NOME.
        */

        must(
            "playerName"
        ).addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();


                    startGame();
                }
            }
        );


        /*
            BOTÕES DE FECHAR PAINEL.
        */

        document
            .querySelectorAll(
                "[data-close]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();


                            const target =
                                button.dataset
                                    .close;


                            const element =
                                $(
                                    target
                                );


                            if (
                                element
                            ) {

                                element.classList.add(
                                    "hidden"
                                );
                            }


                            if (
                                target ===
                                "shopPanel"
                            ) {

                                state.shopNPC =
                                    null;
                            }


                            if (
                                target ===
                                "questPanel"
                            ) {

                                state.questNPC =
                                    null;
                            }
                        }
                    );
                }
            );


        /*
            TABS INVENTÁRIO.
        */

        document
            .querySelectorAll(
                "#inventoryTabs .tab"
            )
            .forEach(
                tab => {

                    tab.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();


                            document
                                .querySelectorAll(
                                    "#inventoryTabs .tab"
                                )
                                .forEach(
                                    item =>
                                        item.classList.remove(
                                            "active"
                                        )
                                );


                            tab.classList.add(
                                "active"
                            );


                            state.inventoryCategory =
                                tab.dataset.cat;


                            updateInventory();
                        }
                    );
                }
            );


        /*
            TABS DA LOJA.
        */

        document
            .querySelectorAll(
                "#shopTabs .tab"
            )
            .forEach(
                tab => {

                    tab.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();


                            document
                                .querySelectorAll(
                                    "#shopTabs .tab"
                                )
                                .forEach(
                                    item =>
                                        item.classList.remove(
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
                }
            );


        /*
            TECLADO.
        */

        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        window.addEventListener(
            "keyup",
            event => {

                const key =
                    event.key
                        .toLowerCase();


                state.keys.delete(
                    key
                );


                if (
                    key ===
                    "e"
                ) {

                    cancelHoldInteraction();
                }
            }
        );


        /*
            PERDEU FOCO.
        */

        window.addEventListener(
            "blur",
            () => {

                state.keys.clear();


                state.pointer.down =
                    false;


                cancelHoldInteraction();
            }
        );


        /*
            MOUSE FORA DO CANVAS.
        */

        window.addEventListener(
            "mouseup",
            event => {

                if (
                    event.button ===
                    0
                ) {

                    state.pointer.down =
                        false;
                }
            }
        );


        /*
            MOUSE SOBRE CANVAS.
        */

        canvas.addEventListener(
            "pointermove",
            event => {

                const rect =
                    canvas.getBoundingClientRect();


                state.pointer.x =
                    event.clientX -
                    rect.left;


                state.pointer.y =
                    event.clientY -
                    rect.top;


                state.pointer.worldX =
                    state.pointer.x +
                    state.camera.x;


                state.pointer.worldY =
                    state.pointer.y +
                    state.camera.y;
            }
        );


        /*
            ATAQUE.
        */

        canvas.addEventListener(
            "pointerdown",
            event => {

                if (
                    event.button !==
                    0 ||
                    !state.player ||
                    state.houseMode ||
                    state.paused ||
                    isGameplayOverlayOpen()
                ) {

                    return;
                }


                event.preventDefault();


                const rect =
                    canvas.getBoundingClientRect();


                state.pointer.x =
                    event.clientX -
                    rect.left;


                state.pointer.y =
                    event.clientY -
                    rect.top;


                state.pointer.worldX =
                    state.pointer.x +
                    state.camera.x;


                state.pointer.worldY =
                    state.pointer.y +
                    state.camera.y;


                state.pointer.down =
                    true;


                /*
                    PRIMEIRO ATAQUE IMEDIATO.
                */

                performAttack({

                    x:
                        state.pointer
                            .worldX,

                    y:
                        state.pointer
                            .worldY
                });
            }
        );


        canvas.addEventListener(
            "pointerup",
            event => {

                if (
                    event.button ===
                    0
                ) {

                    state.pointer.down =
                        false;
                }
            }
        );


        canvas.addEventListener(
            "pointerleave",
            () => {

                state.pointer.down =
                    false;
            }
        );


        canvas.addEventListener(
            "contextmenu",
            event =>
                event.preventDefault()
        );


        /*
            RESIZE.
        */

        window.addEventListener(
            "resize",
            () => {

                resizeCanvas();


                updateCamera();
            }
        );
    }


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function initialize() {

        /*
            CRIA OS CINCO CARTÕES.
        */

        createCharacterCards();


        /*
            PREPARA O CANVAS.
        */

        resizeCanvas();


        /*
            LIGA TODOS OS BOTÕES.
        */

        bindEvents();


        /*
            ATUALIZA O CONTINUAR.
        */

        updateContinueButton();


        /*
            MENU PRINCIPAL.
        */

        showScreen(
            "menu"
        );


        /*
            REMOVE FADE SE ESTIVER PRESO.
        */

        must(
            "uiFade"
        ).classList.remove(
            "active"
        );


        console.log(
            "VEYRA inicializado com sucesso."
        );
    }


    initialize();

})();
