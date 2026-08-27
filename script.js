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
   
