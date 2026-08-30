/* ============================================================
   VEYRA: A QUIETUDE
   SCRIPT.JS — PARTE 1/5

   NÚCLEO / DADOS / STATUS / SAVE / FUNDAÇÕES

   REGRA DE DESENVOLVIMENTO:
   PRESERVAR -> CORRIGIR -> TESTAR -> MELHORAR

   Esta parte é sintaticamente completa e NÃO depende de deixar
   chaves abertas para as próximas partes.
   ============================================================ */

(() => {
    "use strict";

    const V = window.VEYRA = window.VEYRA || {};

    if (V.__part1Loaded) {
        console.warn(
            "VEYRA — Parte 1 já foi carregada; ignorando duplicação."
        );

        return;
    }


    /* ============================================================
       VERSÃO / SAVE
       ============================================================ */

    const GAME_VERSION = 32;

    const GAME_VERSION_NAME =
        "VEYRA V32 — A QUIETUDE";

    const SAVE_KEY =
        "veyra_save_v32";

    const SAFE_SAVE_KEY =
        "veyra_safe_save_v32";


    const LEGACY_SAVE_KEYS = Object.freeze([
        "veyra_save_v31",
        "veyra_save_v30",
        "veyra_save_v25",
        "veyra_save_v20_five_parts",
        "veyra_save_v20_upgrade",
        "veyra_save_v19_rebuild",
        "veyra_save_v19",
        "veyra_save_v18_rebuild",
        "veyra_save_v14_stable"
    ]);


    /* ============================================================
       CONSTANTES PRINCIPAIS
       ============================================================ */

    const MAX_LEVEL = 100;

    const STAT_CAP = 30;

    const STATUS_POINTS_PER_LEVEL = 3;


    const SKILL_UNLOCK_LEVEL =
        Object.freeze({

            q: 1,

            r: 5,

            f: 10

        });


    const LANTERN_PRICE = 350;

    const MINIMAP_PRICE = 180;


    const MAX_ACTIVE_POTION_BUFFS = 2;

    const MAX_BLOOD_MARKS = 20;


    /*
        Quantidades moderadas.

        DASH V1:
        10 Rubis
        8 Diamantes

        PORTÃO NORTE:
        aproximadamente 10–12,5% acima.
    */
    const DASH_V1_OFFERING =
        Object.freeze({

            rubi:
                10,

            diamante:
                8

        });


    const NORTH_GATE_OFFERING =
        Object.freeze({

            rubi:
                11,

            diamante:
                9

        });


    const QUEST_STATE =
        Object.freeze({

            NOT_STARTED:
                "not_started",

            ACTIVE:
                "active",

            COMPLETE:
                "complete"

        });


    const BOSS_STATE =
        Object.freeze({

            DORMANT:
                "dormant",

            NEUTRAL:
                "neutral",

            CONFIRMED:
                "confirmed",

            COMBAT:
                "combat",

            STUNNED:
                "stunned",

            PHASE_TRANSITION:
                "phase_transition",

            DYING:
                "dying",

            DEFEATED:
                "defeated"

        });


    /* ============================================================
       GAME CONFIG
       ============================================================ */

    const GAME_CONFIG =
        Object.freeze({

            maxDeltaTime:
                0.05,

            autosaveSeconds:
                30,


            dialogueCharactersPerSecond:
                42,


            interactionDistance:
                92,

            npcInteractionDistance:
                100,

            bossConfirmationDistance:
                205,


            doorOpenDistance:
                105,

            doorCloseDistance:
                145,

            doorEnterDistance:
                82,

            doorAnimationSpeed:
                4.8,


            treeHarvestSeconds:
                0.95,

            oreHarvestSeconds:
                1.0,

            darkKeyHarvestSeconds:
                1.35,


            enemyActivationDistance:
                560,

            enemyForgetDistance:
                760,


            playerBaseRadius:
                17,


            /*
                EXAUSTÃO substitui:
                - Fome;
                - Cansaço.

                A barra começa em 0.

                Conforme o tempo passa,
                ela SOBE.

                Comer:
                DIMINUI Exaustão.

                Dormir:
                DIMINUI bastante.
            */
            exhaustionGainPerSecond:
                0.022,

            exhaustionWarningRatio:
                0.65,

            exhaustionCriticalRatio:
                0.86,

            exhaustionMaxSpeedPenalty:
                0.18,

            exhaustionMaxDamagePenalty:
                0.12,


            /*
                DESCANSO NA CAMA.
            */
            restDurationSeconds:
                1.7,

            restExhaustionReduction:
                68,

            restEnergyRestoreRatio:
                1,

            restHpRestoreRatio:
                0.35,


            /*
                MORTE.

                Só materiais comuns.

                Aproximadamente 8%,
                mas nunca mais que 5
                de um mesmo material.
            */
            deathMaterialLossRatio:
                0.08,

            deathMaxMaterialLossPerType:
                5,

            deathMinMaterialStackToLose:
                2,


            debugDamageValue:
                99999

        });


    /* ============================================================
       VISUAL CONFIG
       ============================================================ */

    const VISUAL_CONFIG =
        Object.freeze({

            bossBar:
                Object.freeze({

                    minWidth:
                        360,

                    maxWidth:
                        720,

                    height:
                        18,

                    topDesktop:
                        34

                }),


            lantern:
                Object.freeze({

                    radius:
                        270,

                    noLanternRadius:
                        64,

                    rays:
                        220,

                    labyrinthArea:
                        "monarchMaze",

                    altarZoneId:
                        "monarch_altar_room"

                }),


            /*
                Movimento ambiental.

                Parte 4 vai usar isso
                para árvores, grama,
                flores etc.
            */
            worldMotion:
                Object.freeze({

                    treeSwayStrength:
                        0.035,

                    treeSwaySpeed:
                        1.15,

                    grassSwayStrength:
                        0.045,

                    flowerSwayStrength:
                        0.05

                }),


            blood:
                Object.freeze({

                    maxMarks:
                        MAX_BLOOD_MARKS

                }),


            characterSelection:
                Object.freeze({

                    glowStrength:
                        0.34,

                    glowRadius:
                        90

                })

        });


    /* ============================================================
       MISSÃO DO VAZIO
       ============================================================ */

    const VOID_MISSION_CONFIG =
        Object.freeze({

            shadowEssenceRequired:
                15,


            requiredDashVersion:
                1,


            darkKeyArea:
                "celestialFrontier",


            secretDoorArea:
                "rubyRegion",


            dungeonArea:
                "voidDungeon",


            fragmentMinigameRounds:
                Object.freeze([

                    Object.freeze({

                        targetSize:
                            0.26,

                        speed:
                            1.45

                    }),


                    Object.freeze({

                        targetSize:
                            0.18,

                        speed:
                            1.8

                    }),


                    Object.freeze({

                        targetSize:
                            0.115,

                        speed:
                            2.15

                    })

                ])

        });


    /* ============================================================
       DASH
       ============================================================ */

    const DASH_CONFIG =
        Object.freeze({

            v1:
                Object.freeze({

                    id:
                        "dashV1",

                    name:
                        "DASH V1",

                    subtitle:
                        "Passo do Vento",


                    distance:
                        165,

                    duration:
                        0.16,

                    speed:
                        1030,

                    cooldown:
                        3,

                    energyCost:
                        18,


                    color:
                        "#eef6fa",

                    trailColor:
                        "rgba(239,247,250,0.52)",


                    /*
                        SEM invulnerabilidade.
                    */
                    invulnerability:
                        0,

                    projectilePhaseWindow:
                        0

                }),


            v2:
                Object.freeze({

                    id:
                        "dashV2",

                    name:
                        "DASH V2",

                    subtitle:
                        "Passo do Vazio",


                    /*
                        Aproximadamente:

                        +35% distância
                        +25% velocidade
                        -15% cooldown
                    */
                    distance:
                        223,

                    duration:
                        0.135,

                    speed:
                        1288,

                    cooldown:
                        2.55,

                    energyCost:
                        22,


                    color:
                        "#17131c",

                    accent:
                        "#8e66a4",

                    trailColor:
                        "rgba(74,48,88,0.74)",


                    /*
                        NÃO possui
                        invulnerabilidade genérica.
                    */
                    invulnerability:
                        0,


                    /*
                        Somente Perfect Phase.
                    */
                    projectilePhaseWindow:
                        0.09

                })

        });


    /* ============================================================
       SPAWN OFICIAL

       NOVO JOGO:
       DENTRO DA CASA.

       MORTE:
       DENTRO DA CASA.

       Parte 2 substituirá este fallback
       pelo interior real.
       ============================================================ */

    const PLAYER_HOME_INTERIOR_SPAWN =
        Object.freeze({

            area:
                "village",

            houseId:
                "home",

            x:
                640,

            y:
                560,

            facing:
                "down"

        });


    /* ============================================================
       HELPERS
       ============================================================ */

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
        t
    ) {

        return (
            from +
            (
                to -
                from
            ) *
            t
        );

    }


    function finiteNumber(
        value,
        fallback = 0
    ) {

        const number =
            Number(
                value
            );


        return Number.isFinite(
            number
        )
            ? number
            : fallback;

    }


    function integer(
        value,
        fallback = 0
    ) {

        return Math.trunc(
            finiteNumber(
                value,
                fallback
            )
        );

    }


    function random(
        min,
        max
    ) {

        return (
            min +
            Math.random() *
            (
                max -
                min
            )
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


    function chance(
        probability
    ) {

        return (
            Math.random() <
            clamp(
                finiteNumber(
                    probability,
                    0
                ),
                0,
                1
            )
        );

    }


    function distanceSquared(
        x1,
        y1,
        x2,
        y2
    ) {

        const dx =
            x2 -
            x1;


        const dy =
            y2 -
            y1;


        return (
            dx * dx +
            dy * dy
        );

    }


    function distance(
        x1,
        y1,
        x2,
        y2
    ) {

        return Math.sqrt(
            distanceSquared(
                x1,
                y1,
                x2,
                y2
            )
        );

    }


    function normalize(
        x,
        y
    ) {

        const length =
            Math.sqrt(
                x * x +
                y * y
            );


        if (
            length <=
            0.000001
        ) {

            return {
                x: 0,
                y: 0
            };

        }


        return {

            x:
                x /
                length,

            y:
                y /
                length

        };

    }


    function safeArray(
        value
    ) {

        return Array.isArray(
            value
        )
            ? value
            : [];

    }


    function uniqueArray(
        value
    ) {

        return [
            ...new Set(
                safeArray(
                    value
                )
            )
        ];

    }


    function deepCloneJSONSafe(
        value
    ) {

        if (
            value ===
            undefined
        ) {

            return undefined;

        }


        try {

            return JSON.parse(
                JSON.stringify(
                    value
                )
            );

        } catch (
            error
        ) {

            console.warn(
                "VEYRA — clone seguro falhou:",
                error
            );


            return value;

        }

    }


    /* ============================================================
       SEED PROCEDURAL

       VILA permanece fixa.

       Outras regiões usam uma seed
       criada por sessão.

       Reentrar na região durante a
       mesma sessão mantém o mapa.

       Reiniciar o jogo cria outra seed.
       ============================================================ */

    function hashStringToSeed(
        value
    ) {

        let hash =
            2166136261;


        const string =
            String(
                value ??
                ""
            );


        for (
            let index = 0;
            index < string.length;
            index += 1
        ) {

            hash ^=
                string.charCodeAt(
                    index
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


    function createSessionSeed() {

        const source = [

            Date.now(),

            performance?.timeOrigin ||
                0,

            Math.random(),

            navigator?.userAgent ||
                "veyra"

        ].join(
            "|"
        );


        return (
            hashStringToSeed(
                source
            ) ||
            1
        );

    }


    function createSeededRandom(
        seed
    ) {

        let value =
            (
                finiteNumber(
                    seed,
                    1
                ) >>>
                0
            ) ||
            1;


        return function seededRandom() {

            value +=
                0x6D2B79F5;


            let result =
                value;


            result =
                Math.imul(
                    result ^
                    (
                        result >>>
                        15
                    ),
                    result |
                    1
                );


            result ^=
                result +
                Math.imul(
                    result ^
                    (
                        result >>>
                        7
                    ),
                    result |
                    61
                );


            return (
                (
                    result ^
                    (
                        result >>>
                        14
                    )
                ) >>>
                0
            ) /
            4294967296;

        };

    }


    function getAreaSessionSeed(
        areaId,
        salt = "world"
    ) {

        return hashStringToSeed(
            `${state.sessionSeed}|${areaId}|${salt}`
        );

    }


    function getAreaRandom(
        areaId,
        salt = "world"
    ) {

        return createSeededRandom(
            getAreaSessionSeed(
                areaId,
                salt
            )
        );

    }


    function seededRange(
        rng,
        min,
        max
    ) {

        return (
            min +
            rng() *
            (
                max -
                min
            )
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
                max + 1
            )
        );

    }


    /* ============================================================
       COLISÃO / GEOMETRIA
       ============================================================ */

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


    function pointInRect(
        x,
        y,
        rect
    ) {

        return (

            x >=
                rect.x &&

            x <=
                rect.x +
                rect.w &&

            y >=
                rect.y &&

            y <=
                rect.y +
                rect.h

        );

    }


    function circleRectCollision(
        circleX,
        circleY,
        radius,
        rect
    ) {

        const nearestX =
            clamp(
                circleX,
                rect.x,
                rect.x +
                    rect.w
            );


        const nearestY =
            clamp(
                circleY,
                rect.y,
                rect.y +
                    rect.h
            );


        const dx =
            circleX -
            nearestX;


        const dy =
            circleY -
            nearestY;


        return (
            dx * dx +
            dy * dy <=
            radius * radius
        );

    }


    function circleCircleCollision(
        x1,
        y1,
        r1,
        x2,
        y2,
        r2
    ) {

        const radius =
            r1 +
            r2;


        return (
            distanceSquared(
                x1,
                y1,
                x2,
                y2
            ) <=
            radius *
            radius
        );

    }


    /* ============================================================
       OBSTÁCULOS

       collisionShape = "trunk"
       permitirá que copa da árvore
       NÃO vire uma parede gigante.
       ============================================================ */

    function createSolidObstacle(
        config = {}
    ) {

        return {

            id:
                config.id ||
                `obstacle_${Math.random().toString(36).slice(2)}`,


            type:
                config.type ||
                "solid",


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            w:
                Math.max(
                    1,
                    finiteNumber(
                        config.w,
                        20
                    )
                ),


            h:
                Math.max(
                    1,
                    finiteNumber(
                        config.h,
                        20
                    )
                ),


            solid:
                config.solid !==
                false,


            blocksLight:
                Boolean(
                    config.blocksLight
                ),


            collisionShape:
                config.collisionShape ||
                "rect",


            sourceId:
                config.sourceId ||
                null,


            /*
                Utilizado pelo renderer
                de profundidade.
            */
            depthY:
                finiteNumber(
                    config.depthY,
                    finiteNumber(
                        config.y
                    ) +
                    finiteNumber(
                        config.h,
                        20
                    )
                )

        };

    }


    /* ============================================================
       PORTAS

       Porta gira pela dobradiça.

       NÃO encolhe.

       Visual e colisão usam a
       mesma geometria.
       ============================================================ */

    function createDoorRuntime(
        config = {}
    ) {

        const width =
            Math.max(
                20,
                finiteNumber(
                    config.w,
                    72
                )
            );


        const height =
            Math.max(
                20,
                finiteNumber(
                    config.h,
                    26
                )
            );


        return {

            id:
                config.id ||
                `door_${Math.random().toString(36).slice(2)}`,


            buildingId:
                config.buildingId ||
                null,


            houseId:
                config.houseId ||
                null,


            side:
                config.side ||
                "bottom",


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            w:
                width,


            h:
                height,


            centerX:
                finiteNumber(
                    config.x
                ) +
                width /
                2,


            centerY:
                finiteNumber(
                    config.y
                ) +
                height /
                2,


            hinge:
                config.hinge ||
                "left",


            openAmount:
                0,


            targetOpen:
                0,


            angle:
                0,


            maxAngle:
                Math.PI *
                0.48,


            opening:
                false,


            open:
                false,


            autoOpen:
                config.autoOpen !==
                false,


            locked:
                Boolean(
                    config.locked
                )

        };

    }


    /* ============================================================
       PERSONAGENS

       Cada personagem possui:
       - identidade própria;
       - corpo próprio;
       - animação própria;
       - ataque básico próprio;
       - efeitos próprios.
       ============================================================ */

    const CHARACTERS =
        Object.freeze({

            kaelion:
                Object.freeze({

                    id:
                        "kaelion",

                    name:
                        "Kaelion",

                    className:
                        "Mago",

                    icon:
                        "🔥",

                    color:
                        "#dc7a36",

                    selectionGlow:
                        "#f29a4f",


                    description:
                        "Um conjurador ofensivo que transforma memória em fogo arcano.",


                    hp:
                        92,

                    energy:
                        105,

                    damage:
                        26,

                    defense:
                        8,

                    speed:
                        150,


                    basicAttack:
                        Object.freeze({

                            id:
                                "fireBolt",

                            name:
                                "Projétil Arcano",

                            type:
                                "projectile",

                            range:
                                310,

                            speed:
                                540,

                            radius:
                                8,

                            color:
                                "#ed8a3f"

                        }),


                    visualProfile:
                        Object.freeze({

                            renderer:
                                "kaelion",

                            bodyType:
                                "mage",

                            silhouette:
                                "slender",

                            bodyColor:
                                "#7e472c",

                            clothColor:
                                "#553126",

                            accentColor:
                                "#ed873f",

                            skinColor:
                                "#c69473",

                            hairColor:
                                "#34251f",

                            capeColor:
                                "#4a2c27",

                            robe:
                                true,

                            armor:
                                false,

                            wings:
                                false,

                            horns:
                                false,

                            weaponVisual:
                                "staff",

                            idleAnimation:
                                "arcaneFloat",

                            walkAnimation:
                                "robeWalk",

                            attackAnimation:
                                "staffCast",

                            particleIdentity:
                                "embers"

                        })

                }),


            theron:
                Object.freeze({

                    id:
                        "theron",

                    name:
                        "Theron",

                    className:
                        "Cavaleiro",

                    icon:
                        "⚔️",

                    color:
                        "#9da2a4",

                    selectionGlow:
                        "#d2d7d9",


                    description:
                        "Um combatente equilibrado e resistente, especializado no combate corpo a corpo.",


                    hp:
                        128,

                    energy:
                        112,

                    damage:
                        25,

                    defense:
                        19,

                    speed:
                        142,


                    basicAttack:
                        Object.freeze({

                            id:
                                "swordSlash",

                            name:
                                "Corte de Espada",

                            type:
                                "meleeArc",

                            range:
                                74,

                            arc:
                                1.12,

                            color:
                                "#d7dbdc"

                        }),


                    visualProfile:
                        Object.freeze({

                            renderer:
                                "theron",

                            bodyType:
                                "knight",

                            silhouette:
                                "armored",

                            bodyColor:
                                "#6f7476",

                            clothColor:
                                "#34393c",

                            accentColor:
                                "#bbc2c5",

                            skinColor:
                                "#c69a76",

                            hairColor:
                                "#4b372c",

                            capeColor:
                                "#4e5154",

                            robe:
                                false,

                            armor:
                                true,

                            shoulderArmor:
                                true,

                            helmet:
                                false,

                            wings:
                                false,

                            weaponVisual:
                                "longSword",

                            shieldVisual:
                                "roundShield",

                            idleAnimation:
                                "guardIdle",

                            walkAnimation:
                                "armoredWalk",

                            attackAnimation:
                                "swordSlash",

                            particleIdentity:
                                "steelSpark"

                        })

                }),


            grumgar:
                Object.freeze({

                    id:
                        "grumgar",

                    name:
                        "Grumgar",

                    className:
                        "Troll",

                    icon:
                        "🪨",

                    color:
                        "#738353",

                    selectionGlow:
                        "#9bab6a",


                    description:
                        "Um guerreiro brutal de grande resistência, capaz de esmagar grupos de inimigos.",


                    hp:
                        155,

                    energy:
                        120,

                    damage:
                        30,

                    defense:
                        15,

                    speed:
                        126,


                    basicAttack:
                        Object.freeze({

                            id:
                                "heavySmash",

                            name:
                                "Esmagamento",

                            type:
                                "splash",

                            range:
                                72,

                            radius:
                                55,

                            color:
                                "#8c9a67"

                        }),


                    visualProfile:
                        Object.freeze({

                            renderer:
                                "grumgar",

                            bodyType:
                                "troll",

                            silhouette:
                                "massive",

                            bodyColor:
                                "#6a784b",

                            clothColor:
                                "#423c2f",

                            accentColor:
                                "#8fa066",

                            skinColor:
                                "#718054",

                            hairColor:
                                "#373a2b",

                            capeColor:
                                null,

                            robe:
                                false,

                            armor:
                                false,

                            muscular:
                                true,

                            tusks:
                                true,

                            ears:
                                "pointed",

                            wings:
                                false,

                            weaponVisual:
                                "stoneFists",

                            idleAnimation:
                                "heavyBreath",

                            walkAnimation:
                                "heavyWalk",

                            attackAnimation:
                                "groundPunch",

                            particleIdentity:
                                "dust"

                        })

                }),


            lirael:
                Object.freeze({

                    id:
                        "lirael",

                    name:
                        "Lirael",

                    className:
                        "Fada",

                    icon:
                        "✨",

                    color:
                        "#d777b4",

                    selectionGlow:
                        "#f1a4d4",


                    description:
                        "Uma viajante extremamente veloz que utiliza luz feérica e movimentos precisos.",


                    hp:
                        86,

                    energy:
                        124,

                    damage:
                        22,

                    defense:
                        7,

                    speed:
                        168,


                    basicAttack:
                        Object.freeze({

                            id:
                                "fairyBolt",

                            name:
                                "Luz Feérica",

                            type:
                                "projectile",

                            range:
                                325,

                            speed:
                                620,

                            radius:
                                7,

                            color:
                                "#f0a4d2"

                        }),


                    visualProfile:
                        Object.freeze({

                            renderer:
                                "lirael",

                            bodyType:
                                "fairy",

                            silhouette:
                                "light",

                            bodyColor:
                                "#b85e94",

                            clothColor:
                                "#7d456b",

                            accentColor:
                                "#f0a7d5",

                            skinColor:
                                "#e2b9a2",

                            hairColor:
                                "#e4cccf",

                            capeColor:
                                null,

                            robe:
                                false,

                            armor:
                                false,

                            wings:
                                true,

                            wingColor:
                                "#f0cbe4",

                            wingStyle:
                                "double",

                            weaponVisual:
                                "magicHands",

                            idleAnimation:
                                "fairyHover",

                            walkAnimation:
                                "fairyGlide",

                            attackAnimation:
                                "lightCast",

                            particleIdentity:
                                "fairyDust"

                        })

                }),


            zephyr:
                Object.freeze({

                    id:
                        "zephyr",

                    name:
                        "Zephyr",

                    className:
                        "Transmorfo",

                    icon:
                        "🌀",

                    color:
                        "#8166ab",

                    selectionGlow:
                        "#ad8bd1",


                    description:
                        "Um combatente adaptável que manipula fendas e altera seu estilo durante a batalha.",


                    hp:
                        105,

                    energy:
                        126,

                    damage:
                        24,

                    defense:
                        11,

                    speed:
                        160,


                    basicAttack:
                        Object.freeze({

                            id:
                                "riftSlash",

                            name:
                                "Corte da Fenda",

                            type:
                                "riftArc",

                            range:
                                98,

                            arc:
                                0.9,

                            color:
                                "#a17bd0"

                        }),


                    visualProfile:
                        Object.freeze({

                            renderer:
                                "zephyr",

                            bodyType:
                                "shifter",

                            silhouette:
                                "agile",

                            bodyColor:
                                "#5b467a",

                            clothColor:
                                "#2c2636",

                            accentColor:
                                "#a078cf",

                            skinColor:
                                "#b99b91",

                            hairColor:
                                "#322b39",

                            capeColor:
                                "#362e45",

                            robe:
                                false,

                            armor:
                                false,

                            wings:
                                false,

                            asymmetrical:
                                true,

                            voidMark:
                                true,

                            weaponVisual:
                                "riftBlade",

                            idleAnimation:
                                "riftIdle",

                            walkAnimation:
                                "agileWalk",

                            attackAnimation:
                                "riftSlash",

                            particleIdentity:
                                "riftDust"

                        })

                })

        });


    function getCharacterById(
        characterId
    ) {

        return (
            CHARACTERS[
                characterId
            ] ||
            null
        );

    }


    function currentCharacter() {

        return (
            getCharacterById(
                state.player
                    ?.characterId
            ) ||
            CHARACTERS
                .kaelion
        );

    }


    /* ============================================================
       BARRAS DA SELEÇÃO
       ============================================================ */

    const CHARACTER_SELECTION_RANGE =
        Object.freeze({

            hp:
                Object.freeze({

                    min:
                        80,

                    max:
                        160

                }),


            energy:
                Object.freeze({

                    min:
                        90,

                    max:
                        130

                }),


            damage:
                Object.freeze({

                    min:
                        20,

                    max:
                        32

                }),


            defense:
                Object.freeze({

                    min:
                        5,

                    max:
                        21

                }),


            speed:
                Object.freeze({

                    min:
                        120,

                    max:
                        170

                })

        });


    function getCharacterStatBarValue(
        character,
        stat
    ) {

        const range =
            CHARACTER_SELECTION_RANGE[
                stat
            ];


        if (
            !range ||
            !character
        ) {

            return 0;

        }


        const value =
            finiteNumber(
                character[
                    stat
                ],
                range.min
            );


        const span =
            Math.max(
                1,
                range.max -
                    range.min
            );


        return clamp(
            (
                (
                    value -
                    range.min
                ) /
                span
            ) *
            100,
            0,
            100
        );

    }


    /* ============================================================
       STATUS DEFINITIVOS

       VIDA
       DOMÍNIO
       ENERGIA
       EXAUSTÃO

       Cada nível:
       +3 pontos EXATOS.

       Cada atributo:
       máximo 30.
       ============================================================ */

    const STAT_CONFIG =
        Object.freeze({

            life:
                Object.freeze({

                    id:
                        "life",

                    label:
                        "Vida",

                    icon:
                        "♥",

                    cap:
                        STAT_CAP,

                    hpPerPoint:
                        7,

                    description:
                        "+7 de Vida máxima por ponto."

                }),


            domain:
                Object.freeze({

                    id:
                        "domain",

                    label:
                        "Domínio",

                    icon:
                        "✦",

                    cap:
                        STAT_CAP,

                    damagePerPoint:
                        0.02,

                    description:
                        "+2% de poder no ataque básico e nas habilidades por ponto."

                }),


            energy:
                Object.freeze({

                    id:
                        "energy",

                    label:
                        "Energia",

                    icon:
                        "⚡",

                    cap:
                        STAT_CAP,

                    energyPerPoint:
                        5,

                    description:
                        "+5 de Energia máxima por ponto."

                }),


            exhaustion:
                Object.freeze({

                    id:
                        "exhaustion",

                    label:
                        "Exaustão",

                    icon:
                        "☾",

                    cap:
                        STAT_CAP,

                    capacityPerPoint:
                        3,

                    resistancePerPoint:
                        0.008,

                    description:
                        "+3 de tolerância e +0,8% de resistência ao ganho de Exaustão por ponto."

                })

        });


    function getStatusPointsGrantedForLevel(
        level
    ) {

        const safeLevel =
            clamp(
                integer(
                    level,
                    1
                ),
                1,
                MAX_LEVEL
            );


        return (
            Math.max(
                0,
                safeLevel -
                    1
            ) *
            STATUS_POINTS_PER_LEVEL
        );

    }


    /* ============================================================
       ARMADURAS

       TIER 1  = +25 HP
       TIER 2  = +50 HP
       TIER 3  = +75 HP
       TIER 4  = +100 HP
       TIER 5  = +125 HP
       TIER 6  = +150 HP
       TIER 7  = +175 HP
       TIER 8  = +200 HP
       ============================================================ */

    const ARMOR_PROGRESSION =
        Object.freeze([

            "armaduraFolha",

            "armaduraAlgodao",

            "armaduraMadeira",

            "armaduraCouro",

            "armaduraFerro",

            "armaduraOuro",

            "armaduraDiamante",

            "armaduraRubi"

        ]);


    const ARMOR_DATA =
        Object.freeze({

            armaduraFolha:
                Object.freeze({

                    id:
                        "armaduraFolha",

                    tier:
                        1,

                    name:
                        "Armadura de Folha",

                    icon:
                        "🍃",

                    hp:
                        25,

                    defense:
                        3,

                    price:
                        65,

                    previousArmor:
                        null,

                    progression:
                        true

                }),


            armaduraAlgodao:
                Object.freeze({

                    id:
                        "armaduraAlgodao",

                    tier:
                        2,

                    name:
                        "Armadura de Algodão",

                    icon:
                        "☁️",

                    hp:
                        50,

                    defense:
                        6,

                    price:
                        105,

                    previousArmor:
                        "armaduraFolha",

                    progression:
                        true

                }),


            armaduraMadeira:
                Object.freeze({

                    id:
                        "armaduraMadeira",

                    tier:
                        3,

                    name:
                        "Armadura de Madeira",

                    icon:
                        "🪵",

                    hp:
                        75,

                    defense:
                        10,

                    price:
                        165,

                    previousArmor:
                        "armaduraAlgodao",

                    progression:
                        true

                }),


            armaduraCouro:
                Object.freeze({

                    id:
                        "armaduraCouro",

                    tier:
                        4,

                    name:
                        "Armadura de Couro",

                    icon:
                        "🛡️",

                    hp:
                        100,

                    defense:
                        15,

                    price:
                        250,

                    previousArmor:
                        "armaduraMadeira",

                    progression:
                        true

                }),


            armaduraFerro:
                Object.freeze({

                    id:
                        "armaduraFerro",

                    tier:
                        5,

                    name:
                        "Armadura de Ferro",

                    icon:
                        "⛓️",

                    hp:
                        125,

                    defense:
                        22,

                    price:
                        340,

                    previousArmor:
                        "armaduraCouro",

                    material:
                        "ferro",

                    materialAmount:
                        12,

                    progression:
                        true

                }),


            armaduraOuro:
                Object.freeze({

                    id:
                        "armaduraOuro",

                    tier:
                        6,

                    name:
                        "Armadura de Ouro",

                    icon:
                        "◆",

                    hp:
                        150,

                    defense:
                        30,

                    price:
                        620,

                    previousArmor:
                        "armaduraFerro",

                    material:
                        "ouro",

                    materialAmount:
                        14,

                    progression:
                        true

                }),


            armaduraDiamante:
                Object.freeze({

                    id:
                        "armaduraDiamante",

                    tier:
                        7,

                    name:
                        "Armadura de Diamante",

                    icon:
                        "💎",

                    hp:
                        175,

                    defense:
                        40,

                    price:
                        980,

                    previousArmor:
                        "armaduraOuro",

                    material:
                        "diamante",

                    materialAmount:
                        18,

                    progression:
                        true

                }),


            armaduraRubi:
                Object.freeze({

                    id:
                        "armaduraRubi",

                    tier:
                        8,

                    name:
                        "Armadura de Rubi",

                    icon:
                        "♦️",

                    hp:
                        200,

                    defense:
                        53,

                    price:
                        1450,

                    previousArmor:
                        "armaduraDiamante",

                    material:
                        "rubi",

                    materialAmount:
                        20,

                    progression:
                        true

                })

        });


    /* ============================================================
       ITENS
       ============================================================ */

    const ITEMS = {};


    function registerItem(
        item
    ) {

        if (
            !item
                ?.id
        ) {

            throw new Error(
                "VEYRA — tentativa de registrar item sem id."
            );

        }


        ITEMS[
            item.id
        ] =
            Object.freeze({

                weight:
                    1,

                value:
                    1,

                sellable:
                    false,

                stackable:
                    true,

                deathLossEligible:
                    false,

                ...item

            });

    }


    /* ============================================================
       MATERIAIS COMUNS

       Estes PODEM sofrer pequena
       perda na morte.
       ============================================================ */

    registerItem({

        id:
            "madeira",

        name:
            "Madeira",

        icon:
            "🪵",

        category:
            "materials",

        weight:
            1,

        value:
            6,

        sellable:
            true,

        deathLossEligible:
            true

    });


    registerItem({

        id:
            "pedra",

        name:
            "Pedra",

        icon:
            "●",

        category:
            "materials",

        weight:
            1.1,

        value:
            5,

        sellable:
            true,

        deathLossEligible:
            true

    });


    registerItem({

        id:
            "carvao",

        name:
            "Carvão",

        icon:
            "◼",

        category:
            "materials",

        weight:
            0.8,

        value:
            8,

        sellable:
            true,

        deathLossEligible:
            true

    });


    registerItem({

        id:
            "ferro",

        name:
            "Ferro",

        icon:
            "⬡",

        category:
            "materials",

        weight:
            1,

        value:
            11,

        sellable:
            true,

        deathLossEligible:
            true

    });


    registerItem({

        id:
            "ouro",

        name:
            "Ouro",

        icon:
            "◆",

        category:
            "materials",

        weight:
            0.85,

        value:
            17,

        sellable:
            true,

        deathLossEligible:
            true

    });


    registerItem({

        id:
            "diamante",

        name:
            "Diamante",

        icon:
            "💎",

        category:
            "materials",

        weight:
            0.6,

        value:
            31,

        sellable:
            true,

        deathLossEligible:
            true

    });


    registerItem({

        id:
            "rubi",

        name:
            "Rubi",

        icon:
            "♦",

        category:
            "materials",

        weight:
            0.6,

        value:
            36,

        sellable:
            true,

        deathLossEligible:
            true

    });


    registerItem({

        id:
            "algodao",

        name:
            "Algodão",

        icon:
            "☁",

        category:
            "materials",

        weight:
            0.2,

        value:
            7,

        sellable:
            true,

        deathLossEligible:
            true

    });


    registerItem({

        id:
            "couro",

        name:
            "Couro",

        icon:
            "▰",

        category:
            "materials",

        weight:
            0.7,

        value:
            10,

        sellable:
            true,

        deathLossEligible:
            true

    });


    /* ============================================================
       COMIDA

       IMPORTANTE:

       PEGAR COMIDA NÃO COME.

       Ela vai para a Mochila.

       O player precisa abrir a mochila
       e usar o alimento.
       ============================================================ */

    registerItem({

        id:
            "pao",

        name:
            "Pão",

        icon:
            "🍞",

        category:
            "food",

        weight:
            0.2,

        value:
            12,

        sellable:
            true,

        effect:
            Object.freeze({

                exhaustion:
                    -24

            })

    });


    registerItem({

        id:
            "carne",

        name:
            "Carne",

        icon:
            "🥩",

        category:
            "food",

        weight:
            0.35,

        value:
            18,

        sellable:
            true,

        effect:
            Object.freeze({

                exhaustion:
                    -34

            })

    });


    /* ============================================================
       POÇÕES
       ============================================================ */

    registerItem({

        id:
            "pocao",

        name:
            "Poção de Vida",

        icon:
            "🧪",

        category:
            "potions",

        weight:
            0.3,

        value:
            45,

        sellable:
            true,

        effect:
            Object.freeze({

                hp:
                    45

            })

    });


    /*
        ID antigo preservado.

        Antes:
        Elixir de Magia.

        Agora:
        Elixir de Energia.
    */
    registerItem({

        id:
            "elixir",

        name:
            "Elixir de Energia",

        icon:
            "🔷",

        category:
            "potions",

        weight:
            0.3,

        value:
            55,

        sellable:
            true,

        effect:
            Object.freeze({

                energy:
                    55

            })

    });


    /*
        ID antigo preservado para
        não quebrar saves.

        Agora é Domínio.
    */
    registerItem({

        id:
            "pocaoForca",

        name:
            "Poção de Domínio",

        icon:
            "🔴",

        category:
            "potions",

        weight:
            0.3,

        value:
            85,

        sellable:
            true,

        effect:
            Object.freeze({

                buff:
                    "damage",

                multiplier:
                    1.18,

                duration:
                    45

            })

    });


    registerItem({

        id:
            "pocaoResistencia",

        name:
            "Poção de Resistência",

        icon:
            "🟤",

        category:
            "potions",

        weight:
            0.3,

        value:
            85,

        sellable:
            true,

        effect:
            Object.freeze({

                buff:
                    "defense",

                multiplier:
                    1.18,

                duration:
                    45

            })

    });


    registerItem({

        id:
            "pocaoVelocidade",

        name:
            "Poção de Velocidade",

        icon:
            "🟢",

        category:
            "potions",

        weight:
            0.3,

        value:
            95,

        sellable:
            true,

        effect:
            Object.freeze({

                buff:
                    "speed",

                multiplier:
                    1.16,

                duration:
                    35

            })

    });


    /* ============================================================
       FERRAMENTAS PERMANENTES
       ============================================================ */

    registerItem({

        id:
            "lanterna",

        name:
            "Lanterna Antiga",

        icon:
            "🏮",

        category:
            "tools",

        weight:
            0,

        value:
            LANTERN_PRICE,

        sellable:
            false,

        unique:
            true,

        permanent:
            true

    });


    registerItem({

        id:
            "minimapa",

        name:
            "Minimapa",

        icon:
            "🗺️",

        category:
            "tools",

        weight:
            0,

        value:
            MINIMAP_PRICE,

        sellable:
            false,

        unique:
            true,

        permanent:
            true

    });


    /* ============================================================
       MISSÃO DO VAZIO

       NUNCA PERDEM NA MORTE.
       ============================================================ */

    registerItem({

        id:
            "essenciaSombria",

        name:
            "Essência Sombria",

        icon:
            "◉",

        category:
            "quest",

        weight:
            0.1,

        value:
            0,

        sellable:
            false,

        questItem:
            true

    });


    registerItem({

        id:
            "chaveObscura",

        name:
            "Chave Obscura",

        icon:
            "🗝️",

        category:
            "quest",

        weight:
            0,

        value:
            0,

        sellable:
            false,

        unique:
            true,

        questItem:
            true

    });


    registerItem({

        id:
            "fragmentoVazio",

        name:
            "Fragmento do Vazio",

        icon:
            "◈",

        category:
            "quest",

        weight:
            0,

        value:
            0,

        sellable:
            false,

        unique:
            true,

        questItem:
            true

    });


    /* ============================================================
       ARMA ATUAL
       ============================================================ */

    registerItem({

        id:
            "espadaFerro",

        name:
            "Espada de Ferro",

        icon:
            "⚔️",

        category:
            "weapons",

        weight:
            3,

        value:
            180,

        sellable:
            true,

        damage:
            9

    });


    /* ============================================================
       ARMADURAS COMO ITENS
       ============================================================ */

    for (
        const armor of
        Object.values(
            ARMOR_DATA
        )
    ) {

        registerItem({

            id:
                armor.id,

            name:
                armor.name,

            icon:
                armor.icon,

            category:
                "armor",

            weight:
                0,

            value:
                armor.price,

            sellable:
                false,

            progression:
                true,

            unique:
                true,

            armorTier:
                armor.tier

        });

    }


    Object.freeze(
        ITEMS
    );


    /* ============================================================
       HABILIDADES

       Q = nível 1
       R = nível 5
       F = nível 10

       TODAS usam Energia.

       DOMÍNIO aumenta o poder delas.
       ============================================================ */

    function makeSkill(
        id,
        name,
        key,
        energyCost,
        cooldown,
        extra = {}
    ) {

        return Object.freeze({

            id,

            name,

            key,


            requiredLevel:
                SKILL_UNLOCK_LEVEL[
                    key
                ],


            energyCost,

            cooldown,


            ...extra

        });

    }


    const CLASS_SKILLS =
        Object.freeze({

            kaelion:
                Object.freeze({

                    q:
                        makeSkill(
                            "memoryRay",
                            "Raio de Memória",
                            "q",
                            15,
                            2
                        ),


                    r:
                        makeSkill(
                            "arcaneCircle",
                            "Círculo Arcano",
                            "r",
                            24,
                            5
                        ),


                    f:
                        makeSkill(
                            "memoryExplosion",
                            "Explosão de Memória",
                            "f",
                            36,
                            8
                        )

                }),


            theron:
                Object.freeze({

                    q:
                        makeSkill(
                            "guardianStrike",
                            "Golpe do Guardião",
                            "q",
                            10,
                            3
                        ),


                    r:
                        makeSkill(
                            "ironStance",
                            "Postura de Ferro",
                            "r",
                            18,
                            6
                        ),


                    f:
                        makeSkill(
                            "guardianCharge",
                            "Investida do Guardião",
                            "f",
                            25,
                            8
                        )

                }),


            grumgar:
                Object.freeze({

                    q:
                        makeSkill(
                            "crushingBlow",
                            "Esmagamento",
                            "q",
                            13,
                            4
                        ),


                    r:
                        makeSkill(
                            "stoneRoar",
                            "Rugido de Pedra",
                            "r",
                            20,
                            6
                        ),


                    f:
                        makeSkill(
                            "earthBreaker",
                            "Ruptura do Solo",
                            "f",
                            30,
                            9
                        )

                }),


            lirael:
                Object.freeze({

                    q:
                        makeSkill(
                            "vitalLight",
                            "Luz Vital",
                            "q",
                            14,
                            4
                        ),


                    r:
                        makeSkill(
                            "fairyBlast",
                            "Rajada Feérica",
                            "r",
                            20,
                            4.5
                        ),


                    f:
                        makeSkill(
                            "lightRain",
                            "Chuva de Luz",
                            "f",
                            34,
                            8
                        )

                }),


            zephyr:
                Object.freeze({

                    q:
                        makeSkill(
                            "adaptiveCut",
                            "Corte Adaptativo",
                            "q",
                            11,
                            2.8
                        ),


                    r:
                        makeSkill(
                            "adaptiveForm",
                            "Forma Adaptativa",
                            "r",
                            16,
                            8
                        ),


                    f:
                        makeSkill(
                            "riftStep",
                            "Passo da Fenda",
                            "f",
                            22,
                            6
                        )

                })

        });


    function getSkill(
        characterId,
        key
    ) {

        return (
            CLASS_SKILLS[
                characterId
            ]?.[
                key
            ] ||
            null
        );

    }


    function isSkillUnlocked(
        player,
        key
    ) {

        if (
            !player ||
            !SKILL_UNLOCK_LEVEL[
                key
            ]
        ) {

            return false;

        }


        return (
            integer(
                player.level,
                1
            ) >=
            SKILL_UNLOCK_LEVEL[
                key
            ]
        );

    }


    /* ============================================================
       QUESTS BÁSICAS
       ============================================================ */

    const QUEST_CONFIG =
        Object.freeze({

            wood:
                Object.freeze({

                    id:
                        "wood",

                    title:
                        "Madeira para Bran",

                    itemId:
                        "madeira",

                    amount:
                        10,

                    rewardCoins:
                        100

                }),


            coal:
                Object.freeze({

                    id:
                        "coal",

                    title:
                        "Carvão para Borin",

                    itemId:
                        "carvao",

                    amount:
                        8,

                    rewardCoins:
                        125

                })

        });


    /* ============================================================
       MIGUEL / DASH V2
       ============================================================ */

    const MIGUEL_QUEST_STAGE =
        Object.freeze({

            LOCKED:
                "locked",

            AVAILABLE:
                "available",

            FIND_DARK_KEY:
                "find_dark_key",

            KEY_FOUND_NEEDS_ESSENCE:
                "key_found_needs_essence",

            RETURN_PATH_ONE:
                "return_path_one",

            OPEN_SECRET_DOOR:
                "open_secret_door",

            EXPLORE_DUNGEON:
                "explore_dungeon",

            DEFEAT_VAELKOR:
                "defeat_vaelkor",

            COLLECT_FRAGMENT:
                "collect_fragment",

            RETURN_TO_MIGUEL:
                "return_to_miguel",

            COMPLETE:
                "complete"

        });


    function createMiguelQuestState() {

        return {

            miguelFound:
                false,


            dashV1SeenByMiguel:
                false,


            missionAvailable:
                false,


            missionAccepted:
                false,


            stage:
                MIGUEL_QUEST_STAGE
                    .LOCKED,


            keyLocationDiscovered:
                false,


            keyCollected:
                false,


            keyConsumed:
                false,


            shadowEssenceCollected:
                0,


            secretDoorDiscovered:
                false,


            secretDoorOpened:
                false,


            dungeonDiscovered:
                false,


            clearedDungeonEnemyIds:
                [],


            vaelkorActivated:
                false,


            vaelkorPhaseTwoSeen:
                false,


            vaelkorDefeated:
                false,


            vaelkorDeathCutscenePlayed:
                false,


            fragmentSpawned:
                false,


            fragmentMiniGameCompleted:
                false,


            fragmentCollected:
                false,


            fragmentDelivered:
                false,


            completed:
                false,


            trackerVisible:
                false,


            trackerObjective:
                "",


            objectiveRevision:
                0

        };

    }


    /* ============================================================
       INIMIGOS / DROPS

       "NPCs que atacam" são tratados
       como inimigos/mobs.

       NPCs amigáveis da Vila
       NÃO são mortos nem dropam itens.
       ============================================================ */

    function freezeDropTable(
        entries
    ) {

        return Object.freeze(
            entries.map(
                entry =>
                    Object.freeze({
                        ...entry
                    })
            )
        );

    }


    const ENEMY_SPECIES =
        Object.freeze({

            wolf:
                Object.freeze({

                    id:
                        "wolf",

                    name:
                        "Lobo",

                    spriteType:
                        "wolf",


                    hp:
                        48,

                    damage:
                        11,

                    defense:
                        3,

                    speed:
                        128,

                    radius:
                        20,

                    xp:
                        15,


                    /*
                        Dash/investida curta.
                        NÃO TELEPORTA.
                    */
                    ability:
                        "wolfCharge",


                    abilityConfig:
                        Object.freeze({

                            cooldown:
                                2,

                            telegraph:
                                0.52,

                            speed:
                                390,

                            duration:
                                0.42

                        }),


                    dropTable:
                        freezeDropTable([

                            {
                                itemId:
                                    "carne",

                                chance:
                                    0.72,

                                min:
                                    1,

                                max:
                                    2
                            }

                        ])

                }),


            boar:
                Object.freeze({

                    id:
                        "boar",

                    name:
                        "Javali",

                    spriteType:
                        "boar",


                    hp:
                        72,

                    damage:
                        14,

                    defense:
                        5,

                    speed:
                        105,

                    radius:
                        23,

                    xp:
                        18,


                    ability:
                        "heavyCharge",


                    abilityConfig:
                        Object.freeze({

                            cooldown:
                                3,

                            telegraph:
                                0.7,

                            speed:
                                315,

                            duration:
                                0.5

                        }),


                    dropTable:
                        freezeDropTable([

                            {
                                itemId:
                                    "carne",

                                chance:
                                    0.82,

                                min:
                                    1,

                                max:
                                    3
                            },


                            {
                                itemId:
                                    "couro",

                                chance:
                                    0.46,

                                min:
                                    1,

                                max:
                                    1
                            }

                        ])

                }),


            thornling:
                Object.freeze({

                    id:
                        "thornling",

                    name:
                        "Espinheiro",

                    spriteType:
                        "thornling",

                    hp:
                        58,

                    damage:
                        12,

                    defense:
                        4,

                    speed:
                        91,

                    radius:
                        21,

                    xp:
                        18,

                    ability:
                        "rootShot",


                    dropTable:
                        freezeDropTable([

                            {
                                itemId:
                                    "madeira",

                                chance:
                                    0.42,

                                min:
                                    1,

                                max:
                                    2
                            }

                        ])

                }),


            stoneCrawler:
                Object.freeze({

                    id:
                        "stoneCrawler",

                    name:
                        "Rastejante de Pedra",

                    spriteType:
                        "crawler",

                    color:
                        "#74736c",

                    hp:
                        82,

                    damage:
                        16,

                    defense:
                        8,

                    speed:
                        84,

                    radius:
                        24,

                    xp:
                        23,

                    ability:
                        "groundSlam",


                    dropTable:
                        freezeDropTable([

                            {
                                itemId:
                                    "pedra",

                                chance:
                                    0.86,

                                min:
                                    1,

                                max:
                                    3
                            },


                            {
                                itemId:
                                    "carvao",

                                chance:
                                    0.30,

                                min:
                                    1,

                                max:
                                    2
                            }

                        ])

                }),


            mineCrawler:
                Object.freeze({

                    id:
                        "mineCrawler",

                    name:
                        "Rastejante da Mina",

                    spriteType:
                        "crawler",

                    color:
                        "#645d55",

                    hp:
                        95,

                    damage:
                        17,

                    defense:
                        9,

                    speed:
                        82,

                    radius:
                        25,

                    xp:
                        27,

                    ability:
                        "oreBurst",


                    dropTable:
                        freezeDropTable([

                            {
                                itemId:
                                    "carvao",

                                chance:
                                    0.72,

                                min:
                                    1,

                                max:
                                    3
                            },


                            {
                                itemId:
                                    "ferro",

                                chance:
                                    0.42,

                                min:
                                    1,

                                max:
                                    2
                            }

                        ])

                }),


            rubyHound:
                Object.freeze({

                    id:
                        "rubyHound",

                    name:
                        "Cão de Rubi",

                    spriteType:
                        "rubyHound",

                    hp:
                        112,

                    damage:
                        21,

                    defense:
                        11,

                    speed:
                        134,

                    radius:
                        22,

                    xp:
                        31,

                    ability:
                        "burningCharge",


                    dropTable:
                        freezeDropTable([

                            {
                                itemId:
                                    "rubi",

                                chance:
                                    0.36,

                                min:
                                    1,

                                max:
                                    2
                            },


                            {
                                itemId:
                                    "carne",

                                chance:
                                    0.54,

                                min:
                                    1,

                                max:
                                    2
                            }

                        ])

                }),


            spider:
                Object.freeze({

                    id:
                        "spider",

                    name:
                        "Aranha",

                    spriteType:
                        "spider",

                    hp:
                        46,

                    damage:
                        10,

                    defense:
                        2,

                    speed:
                        122,

                    radius:
                        19,

                    xp:
                        15,

                    ability:
                        "webSlow",

                    dropTable:
                        freezeDropTable([])

                }),


            scorpion:
                Object.freeze({

                    id:
                        "scorpion",

                    name:
                        "Escorpião",

                    spriteType:
                        "scorpion",

                    hp:
                        61,

                    damage:
                        13,

                    defense:
                        5,

                    speed:
                        109,

                    radius:
                        20,

                    xp:
                        19,

                    ability:
                        "poison",


                    dropTable:
                        freezeDropTable([

                            {
                                itemId:
                                    "carvao",

                                chance:
                                    0.18,

                                min:
                                    1,

                                max:
                                    1
                            }

                        ])

                }),


            bat:
                Object.freeze({

                    id:
                        "bat",

                    name:
                        "Morcego",

                    spriteType:
                        "bat",

                    hp:
                        38,

                    damage:
                        9,

                    defense:
                        1,

                    speed:
                        153,

                    radius:
                        17,

                    xp:
                        14,

                    ability:
                        "dive",

                    dropTable:
                        freezeDropTable([])

                }),


            goblin:
                Object.freeze({

                    id:
                        "goblin",

                    name:
                        "Goblin",

                    spriteType:
                        "goblin",

                    hp:
                        62,

                    damage:
                        13,

                    defense:
                        4,

                    speed:
                        116,

                    radius:
                        19,

                    xp:
                        19,

                    ability:
                        "quickStrike",


                    dropTable:
                        freezeDropTable([

                            {
                                itemId:
                                    "carvao",

                                chance:
                                    0.30,

                                min:
                                    1,

                                max:
                                    2
                            },


                            {
                                itemId:
                                    "pao",

                                chance:
                                    0.16,

                                min:
                                    1,

                                max:
                                    1
                            }

                        ])

                }),


            voidSpider:
                Object.freeze({

                    id:
                        "voidSpider",

                    name:
                        "Aranha do Vazio",

                    spriteType:
                        "voidSpider",

                    hp:
                        92,

                    damage:
                        19,

                    defense:
                        7,

                    speed:
                        140,

                    radius:
                        20,

                    xp:
                        34,

                    ability:
                        "voidWeb",

                    dropTable:
                        freezeDropTable([])

                }),


            voidGoblin:
                Object.freeze({

                    id:
                        "voidGoblin",

                    name:
                        "Goblin Sombrio",

                    spriteType:
                        "voidGoblin",

                    hp:
                        105,

                    damage:
                        21,

                    defense:
                        8,

                    speed:
                        128,

                    radius:
                        20,

                    xp:
                        37,

                    ability:
                        "shadowStrike",

                    dropTable:
                        freezeDropTable([])

                }),


            voidStalker:
                Object.freeze({

                    id:
                        "voidStalker",

                    name:
                        "Perseguidor do Vazio",

                    spriteType:
                        "voidStalker",

                    hp:
                        125,

                    damage:
                        24,

                    defense:
                        9,

                    speed:
                        145,

                    radius:
                        21,

                    xp:
                        43,

                    ability:
                        "voidBlink",

                    dropTable:
                        freezeDropTable([])

                })

        });


    /* ============================================================
       BOSSES

       BOSSES DE CAMINHO:
       ACEITAR / RECUAR.

       MONARCA:
       ativado pelo ALTAR.

       VAELKOR:
       sem confirmação.
       ============================================================ */

    function pathBoss(
        config
    ) {

        return Object.freeze({

            progression:
                true,

            topBar:
                true,

            initialState:
                BOSS_STATE
                    .NEUTRAL,

            requiresConfirmation:
                true,

            blocksPassageWhileNeutral:
                true,

            deathStyle:
                "fadeParticles",

            ...config

        });

    }


    const BOSS_REGISTRY =
        Object.freeze({

            road_guardian:
                pathBoss({

                    id:
                        "road_guardian",

                    name:
                        "GUARDIÃO DA ESTRADA",

                    subtitle:
                        "Sentinela do Primeiro Caminho",

                    icon:
                        "⚔",


                    hp:
                        420,

                    damage:
                        18,

                    defense:
                        8,

                    speed:
                        102,

                    radius:
                        43,


                    color:
                        "#555b5e",

                    aura:
                        "#acb0ad",


                    description:
                        "Uma antiga sentinela que permaneceu na Estrada mesmo quando a razão de sua vigília começou a desaparecer."

                }),


            forest_warden:
                pathBoss({

                    id:
                        "forest_warden",

                    name:
                        "VIGIA DA FLORESTA",

                    icon:
                        "🌲",


                    hp:
                        590,

                    damage:
                        22,

                    defense:
                        10,

                    speed:
                        112,

                    radius:
                        46,


                    color:
                        "#3f6747",

                    aura:
                        "#78a26f",


                    description:
                        "Uma criatura moldada pela própria floresta, encarregada de impedir que viajantes avancem até as raízes mais antigas."

                }),


            grove_heart:
                pathBoss({

                    id:
                        "grove_heart",

                    name:
                        "CORAÇÃO DO BOSQUE",

                    icon:
                        "🌿",


                    hp:
                        760,

                    damage:
                        25,

                    defense:
                        13,

                    speed:
                        82,

                    radius:
                        52,


                    bodyStyle:
                        "groveHeart",

                    color:
                        "#536c43",

                    aura:
                        "#91a66e",


                    description:
                        "Uma manifestação viva das memórias enterradas nas raízes do Bosque."

                }),


            mountain_titan:
                pathBoss({

                    id:
                        "mountain_titan",

                    name:
                        "TITÃ DA MONTANHA",

                    icon:
                        "⛰",


                    hp:
                        940,

                    damage:
                        29,

                    defense:
                        17,

                    speed:
                        77,

                    radius:
                        57,


                    bodyStyle:
                        "titan",

                    color:
                        "#696d6b",

                    aura:
                        "#b3b8b5",


                    description:
                        "Um colosso de pedra cuja presença faz a própria montanha parecer despertar."

                }),


            iron_colossus:
                pathBoss({

                    id:
                        "iron_colossus",

                    name:
                        "COLOSSO DE FERRO",

                    icon:
                        "⛓",


                    hp:
                        1180,

                    damage:
                        34,

                    defense:
                        24,

                    speed:
                        72,

                    radius:
                        61,


                    bodyStyle:
                        "colossus",

                    color:
                        "#555a5c",

                    aura:
                        "#adb5b8",


                    description:
                        "Uma máquina antiga coberta por minério e ferrugem, ainda obedecendo a uma ordem que ninguém mais recorda."

                }),


            ruby_chimera:
                pathBoss({

                    id:
                        "ruby_chimera",

                    name:
                        "QUIMERA DE RUBI",

                    icon:
                        "♦",


                    hp:
                        1440,

                    damage:
                        39,

                    defense:
                        27,

                    speed:
                        118,

                    radius:
                        62,


                    bodyStyle:
                        "rubyChimera",

                    color:
                        "#873d4c",

                    aura:
                        "#d96c7e",


                    description:
                        "Uma aberração formada por carne, cristal e energia mineral instável."

                }),


            /* ====================================================
               MONARCA DAS SOMBRAS

               NÃO aparece simplesmente andando
               no Labirinto.

               Ele surge depois que:
               - player chega ao altar;
               - possui materiais;
               - aceita despertar o poder.
               ==================================================== */

            monarch:
                Object.freeze({

                    id:
                        "monarch",

                    name:
                        "MONARCA DAS SOMBRAS",

                    subtitle:
                        "O Soberano do Altar",

                    icon:
                        "♛",


                    progression:
                        true,

                    topBar:
                        true,


                    /*
                        Fica adormecido até
                        ativação do altar.
                    */
                    initialState:
                        BOSS_STATE
                            .DORMANT,


                    /*
                        O SIM/NÃO acontece
                        no altar.

                        Portanto não abre
                        ACEITAR/RECUAR de novo.
                    */
                    requiresConfirmation:
                        false,


                    altarActivated:
                        true,


                    blocksArenaExit:
                        true,


                    centerLocked:
                        true,


                    deathStyle:
                        "altarSoulAbsorb",


                    hp:
                        1850,

                    damage:
                        44,

                    defense:
                        31,

                    speed:
                        0,

                    radius:
                        60,


                    color:
                        "#483d55",

                    aura:
                        "#ab89bd",


                    /* ============================================
                       STAGGER

                       Ataque básico:
                       +1

                       Q/R/F:
                       +3

                       Chegou ou passou de 15:
                       ATORDOA.

                       Depois:
                       volta para ZERO.
                       ============================================ */

                    stagger:
                        Object.freeze({

                            threshold:
                                15,

                            basicAttackValue:
                                1,

                            skillValue:
                                3,

                            stunnedSeconds:
                                4.2,

                            defenseMultiplierWhileStunned:
                                0.62,

                            resetAfterStun:
                                true

                        }),


                    summon:
                        Object.freeze({

                            maxAlive:
                                5,

                            intervalMin:
                                4.2,

                            intervalMax:
                                6.4,

                            species:
                                Object.freeze([

                                    "spider",

                                    "bat",

                                    "goblin"

                                ])

                        }),


                    /*
                        Arena menor.

                        Evita player ficar
                        infinitamente longe
                        em um canto.
                    */
                    arena:
                        Object.freeze({

                            width:
                                880,

                            height:
                                620,

                            safeMargin:
                                72

                        }),


                    description:
                        "O Monarca das Sombras reina imóvel sobre uma sala selada, comandando criaturas e transformando a própria arena em uma extensão de sua vontade."

                }),


            /* ====================================================
               GUARDIÃO DA ESCADA
               ==================================================== */

            path_guardian:
                pathBoss({

                    id:
                        "path_guardian",

                    name:
                        "GUARDIÃO DA ESCADA",

                    subtitle:
                        "Sentinela da Ascensão Celestial",

                    icon:
                        "☁",


                    hp:
                        2260,

                    damage:
                        51,

                    defense:
                        35,

                    speed:
                        155,

                    radius:
                        61,


                    color:
                        "#c3c5c2",

                    aura:
                        "#eedca9",


                    /*
                        Boss feito para testar
                        domínio do Dash V1.
                    */
                    testsDashV1:
                        true,


                    description:
                        "Uma entidade celestial que vigia a Escada e põe à prova aqueles que aprenderam a dominar o Dash."

                }),


            /* ====================================================
               VAELKOR

               Dungeon secreta.

               SEM ACEITAR/RECUAR.
               Entrou na arena:
               vencer ou morrer.
               ==================================================== */

            vaelkor:
                Object.freeze({

                    id:
                        "vaelkor",

                    name:
                        "VAELKOR",

                    subtitle:
                        "O GUARDIÃO DO VAZIO",

                    icon:
                        "◈",


                    progression:
                        false,

                    secret:
                        true,

                    topBar:
                        true,


                    initialState:
                        BOSS_STATE
                            .DORMANT,


                    requiresConfirmation:
                        false,


                    centerLocked:
                        true,


                    deathStyle:
                        "voidCinematic",


                    hp:
                        3300,

                    damage:
                        54,

                    defense:
                        34,

                    speed:
                        0,

                    radius:
                        57,


                    color:
                        "#221b29",

                    aura:
                        "#875f9b",


                    description:
                        "Guardião de uma antiga provação selada no Vazio. Vaelkor não caça seus oponentes: ele transforma a própria arena em uma arma.",


                    attacks:
                        Object.freeze({

                            voidBarrage:
                                Object.freeze({

                                    telegraph:
                                        0.72,

                                    baseOrbCount:
                                        9,

                                    phaseTwoOrbCount:
                                        13,

                                    projectileSpeed:
                                        245,

                                    damage:
                                        23

                                }),


                            voidBeam:
                                Object.freeze({

                                    telegraph:
                                        1.15,

                                    phaseTwoTelegraph:
                                        0.82,

                                    width:
                                        90,

                                    length:
                                        1350,

                                    duration:
                                        0.42,

                                    damage:
                                        47

                                }),


                            shadowSummon:
                                Object.freeze({

                                    telegraph:
                                        0.85,

                                    phaseOneCount:
                                        2,

                                    phaseTwoCount:
                                        3

                                })

                        })

                })

        });


    function getBossDefinition(
        bossId
    ) {

        return (
            BOSS_REGISTRY[
                bossId
            ] ||
            null
        );

    }


    /* ============================================================
       STATE GLOBAL
       ============================================================ */

    const state = {

        running:
            false,


        paused:
            false,


        time:
            0,


        lastTime:
            0,


        area:
            "village",


        world:
            null,


        /*
            NOVO JOGO começa
            DENTRO da casa.
        */
        houseMode:
            true,


        currentHouse:
            "home",


        houseReturn:
            null,


        selectedCharacter:
            null,


        player:
            null,


        /*
            NÃO É SALVO.

            É justamente isso que
            faz mapas mudarem em
            uma nova sessão.
        */
        sessionSeed:
            createSessionSeed(),


        sessionAreaSeeds:
            Object.create(
                null
            ),


        /*
            Corredores explorados
            também são por sessão.

            Região descoberta continua
            persistente no save.
        */
        sessionExploration:
            Object.create(
                null
            ),


        camera: {

            x:
                PLAYER_HOME_INTERIOR_SPAWN
                    .x,

            y:
                PLAYER_HOME_INTERIOR_SPAWN
                    .y,

            targetX:
                PLAYER_HOME_INTERIOR_SPAWN
                    .x,

            targetY:
                PLAYER_HOME_INTERIOR_SPAWN
                    .y

        },


        pointer: {

            x:
                0,

            y:
                0,

            screenX:
                0,

            screenY:
                0,

            worldX:
                0,

            worldY:
                0,

            down:
                false

        },


        keys:
            new Set(),


        dialogue:
            null,


        travel:
            null,


        battle:
            null,


        activePanel:
            null,


        shopNPC:
            null,


        shopMode:
            "buy",


        holdAction:
            null,


        cutscene:
            null,


        cutsceneQueue:
            [],


        fragmentMinigame:
            null,


        deathState:
            null,


        bossBarTarget:
            null,


        notifications:
            [],


        itemPresentation:
            null,


        bloodMarks:
            [],


        screenShake:
            0,


        screenShakePower:
            0,


        damageFlash:
            0,


        darknessWarningAt:
            -999,


        /*
            Transição visual de área,
            morte, descanso etc.
        */
        transition:
            null,


        /*
            Zona interna atual.

            Exemplo:
            monarch_altar_room
        */
        currentZoneId:
            null,


        dev:
            null

    };


    /* ============================================================
       PLAYER FACTORY
       ============================================================ */

    function createNewPlayer(
        name,
        characterId
    ) {

        const character =
            getCharacterById(
                characterId
            );


        if (
            !character
        ) {

            throw new Error(
                `Personagem inválido: ${characterId}`
            );

        }


        const player = {

            name:
                String(
                    name ||
                    character.name
                )
                    .trim()
                    .slice(
                        0,
                        16
                    ),


            characterId:
                character.id,


            /*
                Começa dentro de casa.
            */
            x:
                PLAYER_HOME_INTERIOR_SPAWN
                    .x,


            y:
                PLAYER_HOME_INTERIOR_SPAWN
                    .y,


            facing:
                PLAYER_HOME_INTERIOR_SPAWN
                    .facing,


            radius:
                GAME_CONFIG
                    .playerBaseRadius,


            level:
                1,


            xp:
                0,


            xpToNext:
                100,


            /*
                Nível 1 começa
                com 0 pontos.

                Cada level seguinte:
                +3.
            */
            statPoints:
                0,


            stats: {

                life:
                    0,

                domain:
                    0,

                energy:
                    0,

                exhaustion:
                    0

            },


            hp:
                character.hp,


            maxHp:
                character.hp,


            energy:
                character.energy,


            maxEnergy:
                character.energy,


            /*
                0 = descansado.

                máximo =
                completamente exausto.
            */
            exhaustion:
                0,


            maxExhaustion:
                100,


            exhaustionGainMultiplier:
                1,


            damage:
                character.damage,


            defense:
                character.defense,


            speed:
                character.speed,


            money:
                60,


            inventory:
                {},


            inventoryWeightLimit:
                100,


            equipment: {

                weapon:
                    null,

                armor:
                    null

            },


            armorHighestTierEver:
                0,


            purchasedUniqueItems:
                [],


            defeatedBosses:
                [],


            discoveredBosses:
                [],


            unlockedAreas: [
                "village"
            ],


            discoveredMapLocations: [
                "village"
            ],


            /*
                Região descoberta é salva.

                Corredores explorados
                são mantidos por sessão
                em state.sessionExploration.
            */
            mapProgress: {

                discoveredConnections:
                    [],

                discoveredLandmarks:
                    []

            },


            abilities: {

                dashV1:
                    false,

                dashV2:
                    false

            },


            universalDashCooldown:
                0,


            dashRuntime:
                null,


            skillCooldowns: {

                q:
                    0,

                r:
                    0,

                f:
                    0

            },


            activePotionBuffs:
                [],


            classBuffs:
                [],


            attackCooldown:
                0,


            hurtAnim:
                0,


            /*
                NÃO será utilizado
                pelo Dash V1/V2 como
                invulnerabilidade comum.
            */
            invincible:
                0,


            movementSlowTimer:
                0,


            movementSlowMultiplier:
                1,


            poisonEffect:
                null,


            dead:
                false,


            resting: {

                active:
                    false,

                timer:
                    0,

                duration:
                    0

            },


            minimapOwned:
                false,


            lanternOwned:
                false,


            gateUnlocks: {

                north:
                    false

            },


            gateDialogueIndex: {

                north:
                    0

            },


            /* ====================================================
               MONARCA
               ==================================================== */

            monarch: {

                altarReached:
                    false,

                altarAccepted:
                    false,

                battleStarted:
                    false,

                defeated:
                    false,

                rewardClaimed:
                    false,

                stagger:
                    0,

                stunned:
                    false

            },


            /* ====================================================
               QUESTS
               ==================================================== */

            quest: {

                wood: {

                    state:
                        QUEST_STATE
                            .NOT_STARTED,

                    rewarded:
                        false

                },


                coal: {

                    state:
                        QUEST_STATE
                            .NOT_STARTED,

                    rewarded:
                        false

                }

            },


            miguelQuest:
                createMiguelQuestState(),


            visual: {

                profileId:
                    character.id,

                walkTime:
                    0,

                attackTime:
                    0,

                idleTime:
                    0

            }

        };


        recalculatePlayerStats(
            player,
            {
                fillResources:
                    true
            }
        );


        return player;

    }


    /* ============================================================
       BUFFS
       ============================================================ */

    function getActiveBuffMultiplier(
        player,
        type
    ) {

        let multiplier =
            1;


        for (
            const buff of
            safeArray(
                player
                    ?.activePotionBuffs
            )
        ) {

            if (
                buff
                    ?.type ===
                type
            ) {

                multiplier *=
                    Math.max(
                        0.1,
                        finiteNumber(
                            buff.multiplier,
                            1
                        )
                    );

            }

        }


        for (
            const buff of
            safeArray(
                player
                    ?.classBuffs
            )
        ) {

            if (
                buff
                    ?.type ===
                type
            ) {

                multiplier *=
                    Math.max(
                        0.1,
                        finiteNumber(
                            buff.multiplier,
                            1
                        )
                    );

            }

        }


        return multiplier;

    }


    /* ============================================================
       RECALCULAR PLAYER

       LEVEL NÃO aumenta status
       automaticamente.

       Só pontos distribuídos
       alteram status.
       ============================================================ */

    function recalculatePlayerStats(
        player =
            state.player,
        options = {}
    ) {

        if (
            !player
        ) {

            return false;

        }


        const character =
            getCharacterById(
                player.characterId
            );


        if (
            !character
        ) {

            return false;

        }


        player.stats =
            player.stats ||
            {};


        const life =
            clamp(
                integer(
                    player.stats
                        .life,
                    0
                ),
                0,
                STAT_CAP
            );


        const domain =
            clamp(
                integer(
                    player.stats
                        .domain,
                    0
                ),
                0,
                STAT_CAP
            );


        const energyStat =
            clamp(
                integer(
                    player.stats
                        .energy,
                    0
                ),
                0,
                STAT_CAP
            );


        const exhaustionStat =
            clamp(
                integer(
                    player.stats
                        .exhaustion,
                    0
                ),
                0,
                STAT_CAP
            );


        player.stats.life =
            life;


        player.stats.domain =
            domain;


        player.stats.energy =
            energyStat;


        player.stats.exhaustion =
            exhaustionStat;


        /*
            Mantém proporção de HP
            ao recalcular.

            Isso evita exploit de
            equipar armadura e curar.
        */
        const previousMaxHp =
            Math.max(
                1,
                finiteNumber(
                    player.maxHp,
                    character.hp
                )
            );


        const previousHp =
            clamp(
                finiteNumber(
                    player.hp,
                    previousMaxHp
                ),
                0,
                previousMaxHp
            );


        const hpRatio =
            previousMaxHp >
            0
                ? previousHp /
                    previousMaxHp
                : 1;


        /*
            Mesmo princípio
            para Energia.
        */
        const previousMaxEnergy =
            Math.max(
                1,
                finiteNumber(
                    player.maxEnergy,
                    character.energy
                )
            );


        const previousEnergy =
            clamp(
                finiteNumber(
                    player.energy,
                    previousMaxEnergy
                ),
                0,
                previousMaxEnergy
            );


        const energyRatio =
            previousMaxEnergy >
            0
                ? previousEnergy /
                    previousMaxEnergy
                : 1;


        const armorId =
            player.equipment
                ?.armor;


        const armor =
            armorId
                ? ARMOR_DATA[
                    armorId
                ]
                : null;


        const weaponId =
            player.equipment
                ?.weapon;


        const weapon =
            weaponId
                ? ITEMS[
                    weaponId
                ]
                : null;


        /* ========================================================
           VIDA
           ======================================================== */

        player.maxHp =
            character.hp +
            life *
                STAT_CONFIG
                    .life
                    .hpPerPoint +
            finiteNumber(
                armor
                    ?.hp,
                0
            );


        /* ========================================================
           ENERGIA
           ======================================================== */

        player.maxEnergy =
            character.energy +
            energyStat *
                STAT_CONFIG
                    .energy
                    .energyPerPoint;


        /* ========================================================
           EXAUSTÃO
           ======================================================== */

        player.maxExhaustion =
            100 +
            exhaustionStat *
                STAT_CONFIG
                    .exhaustion
                    .capacityPerPoint;


        player.exhaustionGainMultiplier =
            clamp(

                1 -
                exhaustionStat *
                    STAT_CONFIG
                        .exhaustion
                        .resistancePerPoint,

                0.7,

                1

            );


        /* ========================================================
           DOMÍNIO
           ======================================================== */

        const weaponDamage =
            finiteNumber(
                weapon
                    ?.damage,
                0
            );


        const domainMultiplier =
            1 +
            domain *
                STAT_CONFIG
                    .domain
                    .damagePerPoint;


        const damageBuffMultiplier =
            getActiveBuffMultiplier(
                player,
                "damage"
            );


        const defenseBuffMultiplier =
            getActiveBuffMultiplier(
                player,
                "defense"
            );


        const speedBuffMultiplier =
            getActiveBuffMultiplier(
                player,
                "speed"
            );


        player.damage =
            (
                character.damage +
                weaponDamage
            ) *
            domainMultiplier *
            damageBuffMultiplier;


        player.defense =
            (
                character.defense +
                finiteNumber(
                    armor
                        ?.defense,
                    0
                )
            ) *
            defenseBuffMultiplier;


        /*
            Velocidade NÃO recebe
            ponto de status.

            Só personagem / poção /
            efeito temporário.
        */
        player.speed =
            character.speed *
            speedBuffMultiplier;


        if (
            options
                .fillResources
        ) {

            player.hp =
                player.maxHp;


            player.energy =
                player.maxEnergy;


            player.exhaustion =
                0;


            return true;

        }


        player.hp =
            clamp(
                player.maxHp *
                    hpRatio,
                0,
                player.maxHp
            );


        player.energy =
            clamp(
                player.maxEnergy *
                    energyRatio,
                0,
                player.maxEnergy
            );


        player.exhaustion =
            clamp(
                finiteNumber(
                    player.exhaustion,
                    0
                ),
                0,
                player.maxExhaustion
            );


        return true;

    }


    function getExhaustionRatio(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return 0;

        }


        return clamp(

            finiteNumber(
                player.exhaustion,
                0
            ) /
            Math.max(
                1,
                finiteNumber(
                    player.maxExhaustion,
                    100
                )
            ),

            0,

            1

        );

    }


    /* ============================================================
       XP / LEVEL

       EXATAMENTE +3 pontos.
       ============================================================ */

    function getXpRequiredForLevel(
        level
    ) {

        const safeLevel =
            clamp(
                integer(
                    level,
                    1
                ),
                1,
                MAX_LEVEL
            );


        return Math.floor(

            100 +

            Math.pow(

                Math.max(
                    0,
                    safeLevel -
                        1
                ),

                1.24

            ) *

            44

        );

    }


    function grantXP(
        amount
    ) {

        const player =
            state.player;


        if (
            !player ||
            player.level >=
                MAX_LEVEL
        ) {

            return false;

        }


        player.xp +=
            Math.max(
                0,
                finiteNumber(
                    amount,
                    0
                )
            );


        let leveledUp =
            false;


        while (

            player.level <
                MAX_LEVEL &&

            player.xp >=
                player.xpToNext

        ) {

            player.xp -=
                player.xpToNext;


            player.level +=
                1;


            /*
                REGRA DEFINITIVA.
            */
            player.statPoints +=
                STATUS_POINTS_PER_LEVEL;


            player.xpToNext =
                getXpRequiredForLevel(
                    player.level
                );


            leveledUp =
                true;

        }


        if (
            player.level >=
            MAX_LEVEL
        ) {

            player.level =
                MAX_LEVEL;


            player.xp =
                0;


            player.xpToNext =
                0;

        }


        recalculatePlayerStats(
            player
        );


        if (
            leveledUp &&
            typeof V
                .pushNotification ===
                "function"
        ) {

            V.pushNotification(

                "NÍVEL AUMENTADO",

                `+${STATUS_POINTS_PER_LEVEL} pontos de status disponíveis.`,

                "success",

                4

            );

        }


        return leveledUp;

    }


    function spendStatusPoint(
        statId
    ) {

        const player =
            state.player;


        const config =
            STAT_CONFIG[
                statId
            ];


        if (
            !player ||
            !config ||
            player.statPoints <=
                0
        ) {

            return false;

        }


        if (
            integer(
                player.stats
                    ?.[statId],
                0
            ) >=
            config.cap
        ) {

            return false;

        }


        player.stats[
            statId
        ] =
            integer(
                player.stats[
                    statId
                ],
                0
            ) +
            1;


        player.statPoints -=
            1;


        recalculatePlayerStats(
            player
        );


        if (
            typeof V
                .updateHTMLHUD ===
                "function"
        ) {

            V.updateHTMLHUD();

        }


        if (
            typeof V
                .renderStatusPanelHTML ===
                "function"
        ) {

            V.renderStatusPanelHTML();

        }


        return true;

    }


    /* ============================================================
       INVENTÁRIO
       ============================================================ */

    function getRealItemCount(
        itemId,
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return 0;

        }


        return Math.max(
            0,
            integer(
                player.inventory
                    ?.[itemId],
                0
            )
        );

    }


    function getItemCount(
        itemId,
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return 0;

        }


        if (

            state.dev
                ?.unlocked &&

            state.dev
                ?.cheats
                ?.infiniteMaterials &&

            ITEMS[
                itemId
            ]?.category ===
                "materials"

        ) {

            return 999999;

        }


        return getRealItemCount(
            itemId,
            player
        );

    }


    function getInventoryWeight(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return 0;

        }


        let total =
            0;


        for (
            const [
                itemId,
                amount
            ] of
            Object.entries(
                player.inventory ||
                {}
            )
        ) {

            const item =
                ITEMS[
                    itemId
                ];


            if (
                !item
            ) {

                continue;

            }


            total +=

                finiteNumber(
                    item.weight,
                    0
                ) *

                Math.max(
                    0,
                    finiteNumber(
                        amount,
                        0
                    )
                );

        }


        return total;

    }


    function canCarryItem(
        itemId,
        amount = 1,
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return false;

        }


        const item =
            ITEMS[
                itemId
            ];


        if (
            !item
        ) {

            return false;

        }


        if (

            item.unique &&

            getRealItemCount(
                itemId,
                player
            ) >
            0

        ) {

            return false;

        }


        const addedWeight =

            finiteNumber(
                item.weight,
                0
            ) *

            Math.max(
                0,
                finiteNumber(
                    amount,
                    0
                )
            );


        return (

            getInventoryWeight(
                player
            ) +

            addedWeight <=

            player.inventoryWeightLimit +
                0.0001

        );

    }


    function addItem(
        itemId,
        amount = 1,
        player =
            state.player
    ) {

        if (

            !player ||

            !ITEMS[
                itemId
            ]

        ) {

            return false;

        }


        const safeAmount =
            Math.max(
                1,
                integer(
                    amount,
                    1
                )
            );


        if (
            !canCarryItem(
                itemId,
                safeAmount,
                player
            )
        ) {

            return false;

        }


        player.inventory[
            itemId
        ] =

            getRealItemCount(
                itemId,
                player
            ) +

            safeAmount;


        return true;

    }


    function removeItem(
        itemId,
        amount = 1,
        player =
            state.player
    ) {

        if (

            !player ||

            !ITEMS[
                itemId
            ]

        ) {

            return false;

        }


        const safeAmount =
            Math.max(
                1,
                integer(
                    amount,
                    1
                )
            );


        const current =
            getRealItemCount(
                itemId,
                player
            );


        if (
            current <
            safeAmount
        ) {

            return false;

        }


        const next =
            current -
            safeAmount;


        if (
            next <=
            0
        ) {

            delete player.inventory[
                itemId
            ];

        } else {

            player.inventory[
                itemId
            ] =
                next;

        }


        return true;

    }


    function hasMaterials(
        requirements,
        player =
            state.player
    ) {

        if (
            !player ||
            !requirements
        ) {

            return false;

        }


        return Object.entries(
            requirements
        )
            .every(
                (
                    [
                        itemId,
                        amount
                    ]
                ) => {

                    return (

                        getItemCount(
                            itemId,
                            player
                        ) >=

                        Math.max(
                            0,
                            integer(
                                amount,
                                0
                            )
                        )

                    );

                }
            );

    }


    function getMissingMaterials(
        requirements,
        player =
            state.player
    ) {

        const missing =
            {};


        for (
            const [
                itemId,
                amount
            ] of
            Object.entries(
                requirements ||
                {}
            )
        ) {

            const needed =
                Math.max(
                    0,
                    integer(
                        amount,
                        0
                    )
                );


            const current =
                getItemCount(
                    itemId,
                    player
                );


            if (
                current <
                needed
            ) {

                missing[
                    itemId
                ] =
                    needed -
                    current;

            }

        }


        return missing;

    }


    function consumeMaterials(
        requirements,
        player =
            state.player
    ) {

        if (

            !player ||

            !hasMaterials(
                requirements,
                player
            )

        ) {

            return false;

        }


        if (

            state.dev
                ?.unlocked &&

            state.dev
                ?.cheats
                ?.infiniteMaterials

        ) {

            return true;

        }


        for (
            const [
                itemId,
                amount
            ] of
            Object.entries(
                requirements ||
                {}
            )
        ) {

            removeItem(

                itemId,

                Math.max(
                    0,
                    integer(
                        amount,
                        0
                    )
                ),

                player

            );

        }


        return true;

    }


    /* ============================================================
       BOSSES / LIVRO
       ============================================================ */

    function isBossDefeated(
        bossId,
        player =
            state.player
    ) {

        return Boolean(

            player &&

            safeArray(
                player
                    .defeatedBosses
            )
                .includes(
                    bossId
                )

        );

    }


    function isBossDiscovered(
        bossId,
        player =
            state.player
    ) {

        return Boolean(

            player &&

            (

                isBossDefeated(
                    bossId,
                    player
                ) ||

                safeArray(
                    player
                        .discoveredBosses
                )
                    .includes(
                        bossId
                    )

            )

        );

    }


    function registerBossDiscovered(
        bossId,
        player =
            state.player
    ) {

        if (

            !player ||

            !BOSS_REGISTRY[
                bossId
            ]

        ) {

            return false;

        }


        player.discoveredBosses =
            uniqueArray([

                ...safeArray(
                    player
                        .discoveredBosses
                ),

                bossId

            ]);


        return true;

    }


    function registerBossDefeated(
        bossId,
        player =
            state.player
    ) {

        if (

            !player ||

            !BOSS_REGISTRY[
                bossId
            ]

        ) {

            return false;

        }


        registerBossDiscovered(
            bossId,
            player
        );


        player.defeatedBosses =
            uniqueArray([

                ...safeArray(
                    player
                        .defeatedBosses
                ),

                bossId

            ]);


        if (
            bossId ===
            "monarch"
        ) {

            player.monarch
                .defeated =
                true;

        }


        return true;

    }


    function getBossBookDescription(
        bossId,
        player =
            state.player
    ) {

        const definition =
            getBossDefinition(
                bossId
            );


        if (

            !definition ||

            !isBossDefeated(
                bossId,
                player
            )

        ) {

            return "";

        }


        return (
            definition.description ||
            ""
        );

    }


    /* ============================================================
       MAPA / DESCOBERTA
       ============================================================ */

    function registerAreaDiscovered(
        areaId,
        player =
            state.player
    ) {

        if (
            !player ||
            !areaId
        ) {

            return false;

        }


        player.discoveredMapLocations =
            uniqueArray([

                ...safeArray(
                    player
                        .discoveredMapLocations
                ),

                areaId

            ]);


        player.unlockedAreas =
            uniqueArray([

                ...safeArray(
                    player
                        .unlockedAreas
                ),

                areaId

            ]);


        return true;

    }


    function registerMapConnection(
        fromArea,
        toArea,
        player =
            state.player
    ) {

        if (
            !player ||
            !fromArea ||
            !toArea
        ) {

            return false;

        }


        player.mapProgress =
            player.mapProgress ||
            {

                discoveredConnections:
                    [],

                discoveredLandmarks:
                    []

            };


        const key =
            [
                fromArea,
                toArea
            ]
                .sort()
                .join(
                    "<->"
                );


        player.mapProgress
            .discoveredConnections =
            uniqueArray([

                ...safeArray(
                    player
                        .mapProgress
                        .discoveredConnections
                ),

                key

            ]);


        return true;

    }


    /* ============================================================
       DASH HELPERS
       ============================================================ */

    function getDashVersion(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return 0;

        }


        if (
            player.abilities
                ?.dashV2
        ) {

            return 2;

        }


        if (
            player.abilities
                ?.dashV1
        ) {

            return 1;

        }


        return 0;

    }


    function getDashConfig(
        player =
            state.player
    ) {

        const version =
            getDashVersion(
                player
            );


        if (
            version ===
            2
        ) {

            return DASH_CONFIG
                .v2;

        }


        if (
            version ===
            1
        ) {

            return DASH_CONFIG
                .v1;

        }


        return null;

    }


    /* ============================================================
       SAVE
       ============================================================ */

    function buildSaveData() {

        const player =
            state.player;


        if (
            !player
        ) {

            return null;

        }


        const playerCopy =
            deepCloneJSONSafe(
                player
            );


        /*
            Runtime temporário
            NÃO entra no save.
        */
        delete playerCopy
            .dashRuntime;


        delete playerCopy
            .resting;


        delete playerCopy
            .hurtAnim;


        delete playerCopy
            .invincible;


        delete playerCopy
            .poisonEffect;


        /*
            Buffs temporários
            não sobrevivem reload.
        */
        playerCopy
            .activePotionBuffs =
            [];


        playerCopy
            .classBuffs =
            [];


        return {

            version:
                GAME_VERSION,


            versionName:
                GAME_VERSION_NAME,


            savedAt:
                Date.now(),


            area:
                state.area,


            houseMode:
                Boolean(
                    state.houseMode
                ),


            currentHouse:
                state.currentHouse ||
                null,


            houseReturn:
                state.houseReturn
                    ? deepCloneJSONSafe(
                        state.houseReturn
                    )
                    : null,


            player:
                playerCopy

        };

    }


    function writeSaveObject(
        key,
        data
    ) {

        try {

            localStorage.setItem(

                key,

                JSON.stringify(
                    data
                )

            );


            return true;

        } catch (
            error
        ) {

            console.error(
                `VEYRA — erro ao gravar ${key}:`,
                error
            );


            return false;

        }

    }


    function saveGame(
        options = {}
    ) {

        const player =
            state.player;


        /*
            Morte não sobrescreve
            o último save seguro.
        */
        if (

            !player ||

            player.dead ||

            state.deathState

        ) {

            return false;

        }


        const data =
            buildSaveData();


        if (
            !data
        ) {

            return false;

        }


        const saved =
            writeSaveObject(
                SAVE_KEY,
                data
            );


        if (
            !saved
        ) {

            return false;

        }


        /*
            Este é o ponto utilizado
            pelo botão DESISTIR
            depois da morte.

            Como a morte não chama
            saveGame enquanto player
            está morto, este ponto
            permanece seguro.
        */
        if (
            options.safe !==
            false
        ) {

            writeSaveObject(
                SAFE_SAVE_KEY,
                data
            );

        }


        if (

            !options.silent &&

            typeof V
                .pushNotification ===
                "function"

        ) {

            V.pushNotification(

                "JOGO SALVO",

                "Seu progresso foi registrado.",

                "success",

                1.8

            );

        }


        if (
            typeof V
                .refreshContinueButton ===
                "function"
        ) {

            V.refreshContinueButton();

        }


        return true;

    }


    function parseStoredSave(
        raw
    ) {

        if (
            !raw
        ) {

            return null;

        }


        try {

            const data =
                JSON.parse(
                    raw
                );


            return (
                data &&
                typeof data ===
                    "object"
            )
                ? data
                : null;

        } catch (
            error
        ) {

            console.warn(
                "VEYRA — save inválido ignorado:",
                error
            );


            return null;

        }

    }


    function readSaveObject(
        key
    ) {

        try {

            return parseStoredSave(
                localStorage.getItem(
                    key
                )
            );

        } catch (
            error
        ) {

            console.warn(
                `VEYRA — não foi possível ler ${key}:`,
                error
            );


            return null;

        }

    }


    function findBestStoredSave() {

        const current =
            readSaveObject(
                SAVE_KEY
            );


        if (
            current
        ) {

            return {

                key:
                    SAVE_KEY,

                data:
                    current

            };

        }


        for (
            const key of
            LEGACY_SAVE_KEYS
        ) {

            const legacy =
                readSaveObject(
                    key
                );


            if (
                legacy
            ) {

                return {

                    key,

                    data:
                        legacy

                };

            }

        }


        return null;

    }


    function getSafeStoredSave() {

        const safe =
            readSaveObject(
                SAFE_SAVE_KEY
            );


        if (
            safe
        ) {

            return safe;

        }


        return (
            findBestStoredSave()
                ?.data ||
            null
        );

    }


    /* ============================================================
       MIGRAÇÃO DE EXAUSTÃO

       SAVES ANTIGOS:

       Fome:
       cheio = bom.

       Cansaço:
       cheio = bom.

       NOVO:

       Exaustão:
       0 = bom.
       cheio = ruim.
       ============================================================ */

    function normalizeOldExhaustionResource(
        player
    ) {

        if (
            Number.isFinite(
                Number(
                    player.exhaustion
                )
            )
        ) {

            return Math.max(
                0,
                Number(
                    player.exhaustion
                )
            );

        }


        const maxHunger =
            Math.max(
                1,
                finiteNumber(
                    player.maxHunger,
                    100
                )
            );


        const maxFatigue =
            Math.max(
                1,
                finiteNumber(
                    player.maxFatigue,
                    100
                )
            );


        const hunger =
            clamp(
                finiteNumber(
                    player.hunger,
                    maxHunger
                ),
                0,
                maxHunger
            );


        const fatigue =
            clamp(
                finiteNumber(
                    player.fatigue,
                    maxFatigue
                ),
                0,
                maxFatigue
            );


        const hungerDeficit =
            1 -
            hunger /
                maxHunger;


        const fatigueDeficit =
            1 -
            fatigue /
                maxFatigue;


        return clamp(

            (
                (
                    hungerDeficit +
                    fatigueDeficit
                ) /
                2
            ) *
            100,

            0,

            100

        );

    }


    /* ============================================================
       MIGRAÇÃO DE SAVE
       ============================================================ */

    function migrateSaveData(
        rawData
    ) {

        const data =
            deepCloneJSONSafe(
                rawData ||
                {}
            );


        data.version =
            finiteNumber(
                data.version,
                1
            );


        if (
            !data.player
        ) {

            return data;

        }


        const player =
            data.player;


        /* ========================================================
           ÁREAS ANTIGAS
           ======================================================== */

        const areaAliases = {

            iron:
                "ironRegion",

            ruby:
                "rubyRegion",

            maze:
                "monarchMaze",

            gnome:
                "gnomeGardens",

            fairy:
                "fairyKingdom",

            frontier:
                "celestialFrontier",

            sky1:
                "skyOne",

            sky2:
                "skyTwo",

            sky3:
                "skyThree"

        };


        if (
            areaAliases[
                data.area
            ]
        ) {

            data.area =
                areaAliases[
                    data.area
                ];

        }


        /* ========================================================
           STATUS ANTIGOS

           power / Força / Magia
           -> Domínio

           hunger + fatigue
           -> Exaustão
           ======================================================== */

        const oldStats =
            player.stats ||
            {};


        const oldPower =
            finiteNumber(

                oldStats.domain ??

                oldStats.power ??

                oldStats.strength ??

                oldStats.magic,

                0

            );


        const oldLife =
            finiteNumber(
                oldStats.life,
                0
            );


        const oldEnergy =
            finiteNumber(
                oldStats.energy,
                0
            );


        const oldExhaustionStat =
            finiteNumber(

                oldStats.exhaustion,

                Math.round(
                    (
                        finiteNumber(
                            oldStats.hunger,
                            0
                        ) +
                        finiteNumber(
                            oldStats.fatigue,
                            0
                        )
                    ) /
                    2
                )

            );


        player.stats = {

            life:
                clamp(
                    integer(
                        oldLife,
                        0
                    ),
                    0,
                    STAT_CAP
                ),


            domain:
                clamp(
                    integer(
                        oldPower,
                        0
                    ),
                    0,
                    STAT_CAP
                ),


            energy:
                clamp(
                    integer(
                        oldEnergy,
                        0
                    ),
                    0,
                    STAT_CAP
                ),


            exhaustion:
                clamp(
                    integer(
                        oldExhaustionStat,
                        0
                    ),
                    0,
                    STAT_CAP
                )

        };


        player.exhaustion =
            normalizeOldExhaustionResource(
                player
            );


        /*
            Magia não existe mais
            como barra/recurso.
        */
        delete player.magic;

        delete player.maxMagic;


        delete player.hunger;

        delete player.maxHunger;


        delete player.fatigue;

        delete player.maxFatigue;


        player.statPoints =
            Math.max(
                0,
                integer(
                    player.statPoints,
                    0
                )
            );


        /* ========================================================
           INVENTÁRIO
           ======================================================== */

        player.inventory =
            player.inventory ||
            {};


        player.equipment =
            player.equipment ||
            {

                weapon:
                    null,

                armor:
                    null

            };


        player.purchasedUniqueItems =
            uniqueArray(
                player
                    .purchasedUniqueItems
            );


        /* ========================================================
           BOSSES
           ======================================================== */

        player.defeatedBosses =
            uniqueArray(
                player
                    .defeatedBosses
            );


        player.discoveredBosses =
            uniqueArray(
                player
                    .discoveredBosses
            );


        /* ========================================================
           MAPA
           ======================================================== */

        player.unlockedAreas =
            uniqueArray(
                player
                    .unlockedAreas
            );


        player.discoveredMapLocations =
            uniqueArray(
                player
                    .discoveredMapLocations
            );


        if (
            !player
                .unlockedAreas
                .includes(
                    "village"
                )
        ) {

            player
                .unlockedAreas
                .push(
                    "village"
                );

        }


        if (
            !player
                .discoveredMapLocations
                .includes(
                    "village"
                )
        ) {

            player
                .discoveredMapLocations
                .push(
                    "village"
                );

        }


        player.mapProgress =
            player.mapProgress ||
            {

                discoveredConnections:
                    [],

                discoveredLandmarks:
                    []

            };


        player.mapProgress
            .discoveredConnections =
            uniqueArray(
                player
                    .mapProgress
                    .discoveredConnections
            );


        player.mapProgress
            .discoveredLandmarks =
            uniqueArray(
                player
                    .mapProgress
                    .discoveredLandmarks
            );


        /* ========================================================
           DASH
           ======================================================== */

        player.abilities =
            player.abilities ||
            {};


        player.abilities
            .dashV1 =
            Boolean(
                player.abilities
                    .dashV1
            );


        player.abilities
            .dashV2 =
            Boolean(
                player.abilities
                    .dashV2
            );


        if (
            player.abilities
                .dashV2
        ) {

            player.abilities
                .dashV1 =
                true;

        }


        /* ========================================================
           HABILIDADES
           ======================================================== */

        player.skillCooldowns = {

            q:
                Math.max(
                    0,
                    finiteNumber(
                        player.skillCooldowns
                            ?.q,
                        0
                    )
                ),


            r:
                Math.max(
                    0,
                    finiteNumber(
                        player.skillCooldowns
                            ?.r,
                        0
                    )
                ),


            f:
                Math.max(
                    0,
                    finiteNumber(
                        player.skillCooldowns
                            ?.f,
                        0
                    )
                )

        };


        /* ========================================================
           MINIMAPA / LANTERNA
           ======================================================== */

        player.minimapOwned =
            Boolean(

                player.minimapOwned ||

                player.inventory
                    .minimapa

            );


        player.lanternOwned =
            Boolean(

                player.lanternOwned ||

                player.inventory
                    .lanterna

            );


        if (
            player.minimapOwned
        ) {

            player.inventory
                .minimapa =
                1;

        }


        if (
            player.lanternOwned
        ) {

            player.inventory
                .lanterna =
                1;

        }


        /* ========================================================
           PORTÃO NORTE
           ======================================================== */

        player.gateUnlocks =
            player.gateUnlocks ||
            {

                north:
                    false

            };


        player.gateUnlocks
            .north =
            Boolean(
                player.gateUnlocks
                    .north
            );


        /* ========================================================
           QUESTS
           ======================================================== */

        player.quest =
            player.quest ||
            {};


        player.quest.wood =
            player.quest.wood ||
            {

                state:
                    QUEST_STATE
                        .NOT_STARTED,

                rewarded:
                    false

            };


        player.quest.coal =
            player.quest.coal ||
            {

                state:
                    QUEST_STATE
                        .NOT_STARTED,

                rewarded:
                    false

            };


        player.miguelQuest = {

            ...createMiguelQuestState(),

            ...(
                player.miguelQuest ||
                {}
            )

        };


        player.miguelQuest
            .clearedDungeonEnemyIds =
            uniqueArray(
                player
                    .miguelQuest
                    .clearedDungeonEnemyIds
            );


        /* ========================================================
           MONARCA

           Compatibilidade com
           monarchDefeated antigo.
           ======================================================== */

        player.monarch = {

            altarReached:
                Boolean(
                    player.monarch
                        ?.altarReached
                ),


            altarAccepted:
                Boolean(
                    player.monarch
                        ?.altarAccepted
                ),


            battleStarted:
                Boolean(
                    player.monarch
                        ?.battleStarted
                ),


            defeated:
                Boolean(

                    player.monarch
                        ?.defeated ||

                    player.monarchDefeated ||

                    player
                        .defeatedBosses
                        .includes(
                            "monarch"
                        )

                ),


            rewardClaimed:
                Boolean(

                    player.monarch
                        ?.rewardClaimed ||

                    player.abilities
                        .dashV1

                ),


            /*
                Runtime de combate
                nunca continua no reload.
            */
            stagger:
                0,


            stunned:
                false

        };


        delete player
            .monarchDefeated;


        /*
            Buff temporário
            não fica salvo.
        */
        player.activePotionBuffs =
            [];


        player.classBuffs =
            [];


        player.dead =
            false;


        data.version =
            GAME_VERSION;


        data.versionName =
            GAME_VERSION_NAME;


        return data;

    }


    /* ============================================================
       RESTAURAR PLAYER DO SAVE
       ============================================================ */

    function restorePlayerFromSave(
        savedPlayer
    ) {

        if (
            !savedPlayer
        ) {

            return null;

        }


        const characterId =
            CHARACTERS[
                savedPlayer
                    .characterId
            ]
                ? savedPlayer
                    .characterId
                : "kaelion";


        const fresh =
            createNewPlayer(

                savedPlayer.name ||
                CHARACTERS[
                    characterId
                ].name,

                characterId

            );


        const migratedWrapper =
            migrateSaveData({

                version:
                    GAME_VERSION,

                area:
                    "village",

                player:
                    savedPlayer

            });


        const source =
            migratedWrapper
                .player;


        fresh.name =
            String(
                source.name ||
                fresh.name
            )
                .trim()
                .slice(
                    0,
                    16
                );


        fresh.characterId =
            characterId;


        fresh.x =
            finiteNumber(
                source.x,
                PLAYER_HOME_INTERIOR_SPAWN
                    .x
            );


        fresh.y =
            finiteNumber(
                source.y,
                PLAYER_HOME_INTERIOR_SPAWN
                    .y
            );


        fresh.facing =
            source.facing ||
            fresh.facing;


        fresh.level =
            clamp(
                integer(
                    source.level,
                    1
                ),
                1,
                MAX_LEVEL
            );


        fresh.xp =
            Math.max(
                0,
                finiteNumber(
                    source.xp,
                    0
                )
            );


        fresh.xpToNext =
            fresh.level >=
            MAX_LEVEL

                ? 0

                : Math.max(
                    1,
                    finiteNumber(

                        source.xpToNext,

                        getXpRequiredForLevel(
                            fresh.level
                        )

                    )
                );


        fresh.statPoints =
            Math.max(
                0,
                integer(
                    source.statPoints,
                    0
                )
            );


        fresh.stats =
            deepCloneJSONSafe(
                source.stats
            );


        fresh.money =
            Math.max(
                0,
                integer(
                    source.money,
                    fresh.money
                )
            );


        fresh.inventory =
            deepCloneJSONSafe(
                source.inventory ||
                {}
            );


        fresh.inventoryWeightLimit =
            Math.max(
                1,
                finiteNumber(
                    source.inventoryWeightLimit,
                    100
                )
            );


        fresh.equipment =
            deepCloneJSONSafe(
                source.equipment ||
                fresh.equipment
            );


        fresh.armorHighestTierEver =
            Math.max(
                0,
                integer(
                    source.armorHighestTierEver,
                    0
                )
            );


        fresh.purchasedUniqueItems =
            uniqueArray(
                source
                    .purchasedUniqueItems
            );


        fresh.defeatedBosses =
            uniqueArray(
                source
                    .defeatedBosses
            );


        fresh.discoveredBosses =
            uniqueArray(
                source
                    .discoveredBosses
            );


        fresh.unlockedAreas =
            uniqueArray(
                source
                    .unlockedAreas
            );


        fresh.discoveredMapLocations =
            uniqueArray(
                source
                    .discoveredMapLocations
            );


        fresh.mapProgress =
            deepCloneJSONSafe(
                source.mapProgress ||
                fresh.mapProgress
            );


        fresh.abilities =
            deepCloneJSONSafe(
                source.abilities ||
                fresh.abilities
            );


        fresh.gateUnlocks =
            deepCloneJSONSafe(
                source.gateUnlocks ||
                fresh.gateUnlocks
            );


        fresh.gateDialogueIndex =
            deepCloneJSONSafe(
                source.gateDialogueIndex ||
                fresh.gateDialogueIndex
            );


        fresh.quest =
            deepCloneJSONSafe(
                source.quest ||
                fresh.quest
            );


        fresh.miguelQuest =
            deepCloneJSONSafe(
                source.miguelQuest ||
                fresh.miguelQuest
            );


        fresh.monarch =
            deepCloneJSONSafe(
                source.monarch ||
                fresh.monarch
            );


        /*
            Primeiro calcula máximos.
        */
        recalculatePlayerStats(
            fresh,
            {
                fillResources:
                    false
            }
        );


        /*
            Depois restaura recursos
            respeitando os novos limites.
        */
        fresh.hp =
            clamp(
                finiteNumber(
                    source.hp,
                    fresh.maxHp
                ),
                1,
                fresh.maxHp
            );


        fresh.energy =
            clamp(
                finiteNumber(
                    source.energy,
                    fresh.maxEnergy
                ),
                0,
                fresh.maxEnergy
            );


        fresh.exhaustion =
            clamp(

                finiteNumber(
                    source.exhaustion,
                    0
                ),

                0,

                fresh.maxExhaustion

            );


        fresh.dead =
            false;


        fresh.activePotionBuffs =
            [];


        fresh.classBuffs =
            [];


        fresh.dashRuntime =
            null;


        fresh.resting = {

            active:
                false,

            timer:
                0,

            duration:
                0

        };


        return fresh;

    }


    function hasAnySave() {

        return Boolean(
            findBestStoredSave()
        );

    }


    /* ============================================================
       VALIDAÇÃO DA PARTE 1

       Essa validação roda quando
       o script carrega.

       Se algo estrutural quebrar,
       console mostra exatamente.
       ============================================================ */

    function validatePart1Data() {

        const errors =
            [];


        if (
            STATUS_POINTS_PER_LEVEL !==
            3
        ) {

            errors.push(
                "Cada nível deve conceder exatamente +3 pontos de status."
            );

        }


        if (
            STAT_CAP !==
            30
        ) {

            errors.push(
                "O limite de cada status deve ser 30."
            );

        }


        const expectedStats = [

            "life",

            "domain",

            "energy",

            "exhaustion"

        ];


        for (
            const statId of
            expectedStats
        ) {

            if (
                !STAT_CONFIG[
                    statId
                ]
            ) {

                errors.push(
                    `Status ausente: ${statId}`
                );

            }

        }


        for (
            const id of
            [

                "kaelion",

                "theron",

                "grumgar",

                "lirael",

                "zephyr"

            ]
        ) {

            if (
                !CHARACTERS[
                    id
                ]
            ) {

                errors.push(
                    `Personagem ausente: ${id}`
                );

            }

        }


        /*
            Garante:
            Q nível 1.
            R nível 5.
            F nível 10.

            E garante que TODAS
            usam Energia.
        */
        for (
            const characterId of
            Object.keys(
                CHARACTERS
            )
        ) {

            for (
                const key of
                [
                    "q",
                    "r",
                    "f"
                ]
            ) {

                const skill =
                    CLASS_SKILLS[
                        characterId
                    ]?.[
                        key
                    ];


                if (
                    !skill
                ) {

                    errors.push(
                        `Habilidade ${key.toUpperCase()} ausente para ${characterId}.`
                    );


                    continue;

                }


                if (
                    skill.requiredLevel !==
                    SKILL_UNLOCK_LEVEL[
                        key
                    ]
                ) {

                    errors.push(
                        `Nível de desbloqueio incorreto em ${characterId}/${key}.`
                    );

                }


                if (
                    !Number.isFinite(
                        skill.energyCost
                    )
                ) {

                    errors.push(
                        `Custo de Energia ausente em ${characterId}/${key}.`
                    );

                }

            }

        }


        /*
            Armaduras.
        */
        for (
            const armorId of
            ARMOR_PROGRESSION
        ) {

            if (
                !ARMOR_DATA[
                    armorId
                ]
            ) {

                errors.push(
                    `Armadura ausente: ${armorId}`
                );

            }

        }


        const expectedArmorHp = [

            25,

            50,

            75,

            100,

            125,

            150,

            175,

            200

        ];


        ARMOR_PROGRESSION
            .forEach(
                (
                    armorId,
                    index
                ) => {

                    if (
                        ARMOR_DATA[
                            armorId
                        ]?.hp !==
                        expectedArmorHp[
                            index
                        ]
                    ) {

                        errors.push(
                            `Bônus de HP incorreto em ${armorId}.`
                        );

                    }

                }
            );


        /*
            Monarca.
        */
        if (
            BOSS_REGISTRY
                .monarch
                ?.stagger
                ?.threshold !==
            15
        ) {

            errors.push(
                "Monarca deve atordoar com 15 pontos de stagger."
            );

        }


        if (
            BOSS_REGISTRY
                .monarch
                ?.stagger
                ?.basicAttackValue !==
            1
        ) {

            errors.push(
                "Ataque básico deve somar +1 stagger no Monarca."
            );

        }


        if (
            BOSS_REGISTRY
                .monarch
                ?.stagger
                ?.skillValue !==
            3
        ) {

            errors.push(
                "Q/R/F devem somar +3 stagger no Monarca."
            );

        }


        if (
            errors.length >
            0
        ) {

            console.error(
                "VEYRA V32 — ERROS NA PARTE 1:",
                errors
            );


            return {

                ok:
                    false,

                errors

            };

        }


        console.log(
            "VEYRA V32 — Parte 1 validada."
        );


        return {

            ok:
                true,

            errors:
                []

        };

    }


    /* ============================================================
       EXPORTAÇÃO

       As Partes 2/5, 3/5, 4/5 e 5/5
       acessarão tudo através de:

       window.VEYRA
       ============================================================ */

    Object.assign(
        V,
        {

            /* Versão */
            GAME_VERSION,
            GAME_VERSION_NAME,
            SAVE_KEY,
            SAFE_SAVE_KEY,
            LEGACY_SAVE_KEYS,


            /* Constantes */
            MAX_LEVEL,
            STAT_CAP,
            STATUS_POINTS_PER_LEVEL,
            SKILL_UNLOCK_LEVEL,

            LANTERN_PRICE,
            MINIMAP_PRICE,

            MAX_ACTIVE_POTION_BUFFS,
            MAX_BLOOD_MARKS,


            DASH_V1_OFFERING,
            NORTH_GATE_OFFERING,


            QUEST_STATE,
            BOSS_STATE,

            GAME_CONFIG,
            VISUAL_CONFIG,

            VOID_MISSION_CONFIG,
            DASH_CONFIG,

            PLAYER_HOME_INTERIOR_SPAWN,


            /* Dados */
            CHARACTERS,
            CHARACTER_SELECTION_RANGE,

            STAT_CONFIG,

            ARMOR_PROGRESSION,
            ARMOR_DATA,

            ITEMS,

            CLASS_SKILLS,

            QUEST_CONFIG,
            MIGUEL_QUEST_STAGE,

            ENEMY_SPECIES,
            BOSS_REGISTRY,


            /* Estado */
            state,


            /* Helpers */
            clamp,
            lerp,
            finiteNumber,
            integer,
            random,
            randomInt,
            chance,

            distanceSquared,
            distance,
            normalize,

            safeArray,
            uniqueArray,
            deepCloneJSONSafe,


            /* Procedural */
            hashStringToSeed,
            createSessionSeed,
            createSeededRandom,

            getAreaSessionSeed,
            getAreaRandom,

            seededRange,
            seededInt,


            /* Geometria */
            rectsOverlap,
            pointInRect,

            circleRectCollision,
            circleCircleCollision,

            createSolidObstacle,
            createDoorRuntime,


            /* Personagens */
            getCharacterById,
            currentCharacter,

            getCharacterStatBarValue,


            /* Status */
            getStatusPointsGrantedForLevel,


            /* Skills */
            getSkill,
            isSkillUnlocked,


            /* Miguel */
            createMiguelQuestState,


            /* Boss */
            getBossDefinition,


            /* Player */
            createNewPlayer,
            recalculatePlayerStats,
            getExhaustionRatio,


            /* Level */
            getXpRequiredForLevel,
            grantXP,
            spendStatusPoint,


            /* Inventário */
            getRealItemCount,
            getItemCount,
            getInventoryWeight,

            canCarryItem,

            addItem,
            removeItem,

            hasMaterials,
            getMissingMaterials,
            consumeMaterials,


            /* Boss book */
            isBossDefeated,
            isBossDiscovered,

            registerBossDiscovered,
            registerBossDefeated,

            getBossBookDescription,


            /* Mapa */
            registerAreaDiscovered,
            registerMapConnection,


            /* Dash */
            getDashVersion,
            getDashConfig,


            /* Save */
            buildSaveData,
            saveGame,

            readSaveObject,

            findBestStoredSave,
            getSafeStoredSave,

            migrateSaveData,
            restorePlayerFromSave,

            hasAnySave,


            /* Validação */
            validatePart1Data

        }
    );


    V.__part1Loaded =
        true;


    /*
        Auto-teste estrutural.

        Não altera o save.
        Não altera o player.
    */
    V.__part1Validation =
        validatePart1Data();

})();
/* ============================================================
   VEYRA: A QUIETUDE
   SCRIPT.JS — PARTE 2/5

   MUNDOS / MAPAS / CASAS / CAMINHOS / AMBIENTE

   REQUER:
   SCRIPT.JS — PARTE 1/5

   ESTA PARTE CONTÉM:
   - regiões
   - biomas
   - caminhos
   - Vila do Crepúsculo fixa
   - fonte central
   - casas
   - interiores diferentes
   - cama / descanso
   - portas
   - árvores com colisão só no tronco
   - pedras
   - grama
   - flores
   - cogumelos
   - vegetação procedural
   - mapas procedurais por sessão
   - Caminho 1
   - Labirinto do Monarca maior
   - sala do altar menor
   - Jardins dos Gnomos
   - Reino Feérico
   - Fronteira Celestial
   - Escada Celestial
   - Céu I
   - Dungeon do Vazio
   - minimapa / descoberta
   - fundações do Portão Norte
   ============================================================ */

(() => {
    "use strict";


    const V =
        window.VEYRA;


    if (
        !V ||
        !V.__part1Loaded
    ) {

        throw new Error(
            "VEYRA — carregue a Parte 1/5 antes da Parte 2/5."
        );

    }


    if (
        V.__part2Loaded
    ) {

        console.warn(
            "VEYRA — Parte 2 já foi carregada; ignorando duplicação."
        );

        return;

    }


    const {
        state,

        clamp,
        finiteNumber,
        integer,
        random,
        randomInt,
        distance,

        safeArray,
        uniqueArray,

        createSolidObstacle,
        createDoorRuntime,

        getAreaRandom,
        seededRange,
        seededInt,

        ENEMY_SPECIES,
        BOSS_REGISTRY,

        isBossDefeated,

        ITEMS,

        DASH_V1_OFFERING,
        NORTH_GATE_OFFERING,

        hasMaterials,
        getMissingMaterials,
        consumeMaterials,

        getItemCount,
        addItem,
        removeItem,

        registerAreaDiscovered,
        registerMapConnection,

        getDashVersion,

        VOID_MISSION_CONFIG,

        GAME_CONFIG,

        PLAYER_HOME_INTERIOR_SPAWN,

        saveGame

    } = V;


    /* ============================================================
       REGIÕES
       ============================================================ */

    const REGION_META =
        Object.freeze({

            village:
                Object.freeze({

                    id:
                        "village",

                    name:
                        "VILA DO CREPÚSCULO",

                    biome:
                        "village",

                    worldWidth:
                        3200,

                    worldHeight:
                        2300,

                    procedural:
                        false,

                    minimapSignal:
                        true

                }),


            road:
                Object.freeze({

                    id:
                        "road",

                    name:
                        "ESTRADA ESQUECIDA",

                    biome:
                        "road",

                    worldWidth:
                        3600,

                    worldHeight:
                        2200,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            forest:
                Object.freeze({

                    id:
                        "forest",

                    name:
                        "FLORESTA DO SUSSURRO",

                    biome:
                        "forest",

                    worldWidth:
                        3900,

                    worldHeight:
                        2500,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            grove:
                Object.freeze({

                    id:
                        "grove",

                    name:
                        "BOSQUE DAS MEMÓRIAS",

                    biome:
                        "grove",

                    worldWidth:
                        4000,

                    worldHeight:
                        2600,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            mountains:
                Object.freeze({

                    id:
                        "mountains",

                    name:
                        "MONTANHAS SILENCIOSAS",

                    biome:
                        "mountains",

                    worldWidth:
                        4200,

                    worldHeight:
                        2550,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            ironRegion:
                Object.freeze({

                    id:
                        "ironRegion",

                    name:
                        "VEIOS DE FERRO",

                    biome:
                        "iron",

                    worldWidth:
                        3900,

                    worldHeight:
                        2350,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            rubyRegion:
                Object.freeze({

                    id:
                        "rubyRegion",

                    name:
                        "VALE DE RUBI",

                    biome:
                        "ruby",

                    worldWidth:
                        4200,

                    worldHeight:
                        2450,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            monarchMaze:
                Object.freeze({

                    id:
                        "monarchMaze",

                    name:
                        "LABIRINTO DO MONARCA",

                    biome:
                        "maze",

                    worldWidth:
                        5350,

                    worldHeight:
                        2700,

                    procedural:
                        true,

                    minimapSignal:
                        true,

                    requiresLantern:
                        true

                }),


            gnomeGardens:
                Object.freeze({

                    id:
                        "gnomeGardens",

                    name:
                        "JARDINS DOS GNOMOS",

                    biome:
                        "gnome",

                    worldWidth:
                        3400,

                    worldHeight:
                        3000,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            fairyKingdom:
                Object.freeze({

                    id:
                        "fairyKingdom",

                    name:
                        "REINO FEÉRICO",

                    biome:
                        "fairy",

                    worldWidth:
                        3500,

                    worldHeight:
                        3100,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            celestialFrontier:
                Object.freeze({

                    id:
                        "celestialFrontier",

                    name:
                        "FRONTEIRA CELESTIAL",

                    biome:
                        "frontier",

                    worldWidth:
                        3400,

                    worldHeight:
                        3000,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            celestialStair:
                Object.freeze({

                    id:
                        "celestialStair",

                    name:
                        "ESCADA CELESTIAL",

                    biome:
                        "celestial",

                    worldWidth:
                        1600,

                    worldHeight:
                        3600,

                    procedural:
                        false,

                    minimapSignal:
                        true

                }),


            skyOne:
                Object.freeze({

                    id:
                        "skyOne",

                    name:
                        "CÉU I",

                    biome:
                        "sky",

                    worldWidth:
                        2800,

                    worldHeight:
                        2400,

                    procedural:
                        true,

                    minimapSignal:
                        true

                }),


            skyTwo:
                Object.freeze({

                    id:
                        "skyTwo",

                    name:
                        "CÉU II",

                    biome:
                        "sky",

                    worldWidth:
                        2600,

                    worldHeight:
                        2200,

                    procedural:
                        false,

                    minimapSignal:
                        true,

                    future:
                        true

                }),


            skyThree:
                Object.freeze({

                    id:
                        "skyThree",

                    name:
                        "CÉU III",

                    biome:
                        "sky",

                    worldWidth:
                        2600,

                    worldHeight:
                        2200,

                    procedural:
                        false,

                    minimapSignal:
                        true,

                    future:
                        true

                }),


            voidDungeon:
                Object.freeze({

                    id:
                        "voidDungeon",

                    name:
                        "DUNGEON DO VAZIO",

                    biome:
                        "void",

                    worldWidth:
                        3650,

                    worldHeight:
                        2450,

                    procedural:
                        false,

                    minimapSignal:
                        false

                })

        });


    /* ============================================================
       CORES / IDENTIDADE DOS BIOMAS

       Parte 4 usará esses valores
       para renderização.
       ============================================================ */

    const BIOME_STYLE =
        Object.freeze({

            village:
                Object.freeze({

                    ground:
                        "#43533c",

                    groundAlt:
                        "#394936",

                    grass:
                        "#526348",

                    grassDark:
                        "#31402e",

                    dirt:
                        "#817057",

                    stone:
                        "#7d786d",

                    ambient:
                        "#d4bd8f"

                }),


            road:
                Object.freeze({

                    ground:
                        "#47543e",

                    groundAlt:
                        "#3d4937",

                    grass:
                        "#566548",

                    grassDark:
                        "#35402e",

                    dirt:
                        "#75664e",

                    stone:
                        "#777168",

                    ambient:
                        "#c8b27f"

                }),


            forest:
                Object.freeze({

                    ground:
                        "#344934",

                    groundAlt:
                        "#2b402d",

                    grass:
                        "#486148",

                    grassDark:
                        "#243626",

                    dirt:
                        "#675a43",

                    stone:
                        "#6a6960",

                    ambient:
                        "#93ad7d"

                }),


            grove:
                Object.freeze({

                    ground:
                        "#30452f",

                    groundAlt:
                        "#263b29",

                    grass:
                        "#456043",

                    grassDark:
                        "#213424",

                    dirt:
                        "#66573f",

                    stone:
                        "#68675b",

                    ambient:
                        "#a4ba82"

                }),


            mountains:
                Object.freeze({

                    ground:
                        "#66675f",

                    groundAlt:
                        "#565851",

                    grass:
                        "#505b49",

                    grassDark:
                        "#394039",

                    dirt:
                        "#736d5d",

                    stone:
                        "#797b77",

                    ambient:
                        "#a9afb0"

                }),


            iron:
                Object.freeze({

                    ground:
                        "#55524d",

                    groundAlt:
                        "#474540",

                    grass:
                        "#4e5147",

                    grassDark:
                        "#343630",

                    dirt:
                        "#62594c",

                    stone:
                        "#656564",

                    ambient:
                        "#9da2a2"

                }),


            ruby:
                Object.freeze({

                    ground:
                        "#574547",

                    groundAlt:
                        "#49393d",

                    grass:
                        "#514642",

                    grassDark:
                        "#342d2d",

                    dirt:
                        "#70565a",

                    stone:
                        "#735d61",

                    ambient:
                        "#c07a88"

                }),


            maze:
                Object.freeze({

                    ground:
                        "#29272d",

                    groundAlt:
                        "#211f25",

                    grass:
                        "#29262e",

                    grassDark:
                        "#17151a",

                    dirt:
                        "#3a363e",

                    stone:
                        "#454149",

                    ambient:
                        "#695d72"

                }),


            gnome:
                Object.freeze({

                    ground:
                        "#345d58",

                    groundAlt:
                        "#2b4e4d",

                    grass:
                        "#46736c",

                    grassDark:
                        "#294b46",

                    dirt:
                        "#657160",

                    stone:
                        "#617977",

                    ambient:
                        "#8ec7c4"

                }),


            fairy:
                Object.freeze({

                    ground:
                        "#6b5571",

                    groundAlt:
                        "#584761",

                    grass:
                        "#78617b",

                    grassDark:
                        "#483950",

                    dirt:
                        "#8c6e83",

                    stone:
                        "#817089",

                    ambient:
                        "#e3a2d0"

                }),


            frontier:
                Object.freeze({

                    ground:
                        "#4c6847",

                    groundAlt:
                        "#405a3e",

                    grass:
                        "#5e7b55",

                    grassDark:
                        "#364d34",

                    dirt:
                        "#82765c",

                    stone:
                        "#8a887d",

                    ambient:
                        "#c9cca0"

                }),


            celestial:
                Object.freeze({

                    ground:
                        "#8db7ce",

                    groundAlt:
                        "#769eb8",

                    grass:
                        "#9abcb6",

                    grassDark:
                        "#6e9391",

                    dirt:
                        "#c5c4b6",

                    stone:
                        "#dedbd0",

                    ambient:
                        "#e7f3ff"

                }),


            sky:
                Object.freeze({

                    ground:
                        "#86b9dc",

                    groundAlt:
                        "#72a7ce",

                    grass:
                        "#99c5d8",

                    grassDark:
                        "#6998ae",

                    dirt:
                        "#c7d9df",

                    stone:
                        "#e0e6e5",

                    ambient:
                        "#eff8ff"

                }),


            void:
                Object.freeze({

                    ground:
                        "#19161e",

                    groundAlt:
                        "#100e14",

                    grass:
                        "#211a28",

                    grassDark:
                        "#0c0910",

                    dirt:
                        "#29222f",

                    stone:
                        "#302a37",

                    ambient:
                        "#685376"

                })

        });


    function getBiomeStyle(
        areaId =
            state.area
    ) {

        const meta =
            REGION_META[
                areaId
            ];


        return (
            BIOME_STYLE[
                meta?.biome
            ] ||
            BIOME_STYLE
                .village
        );

    }


    /* ============================================================
       CAMINHOS
       ============================================================ */

    const PATH_STYLE_CONFIG =
        Object.freeze({

            village:
                Object.freeze({

                    base:
                        "#806f55",

                    edge:
                        "#5c4e3b",

                    detail:
                        "villageStone"

                }),


            road:
                Object.freeze({

                    base:
                        "#79694f",

                    edge:
                        "#554938",

                    detail:
                        "wagonDirt"

                }),


            forest:
                Object.freeze({

                    base:
                        "#635a45",

                    edge:
                        "#3c3a2f",

                    detail:
                        "forestStone"

                }),


            grove:
                Object.freeze({

                    base:
                        "#665b42",

                    edge:
                        "#40382d",

                    detail:
                        "roots"

                }),


            mountains:
                Object.freeze({

                    base:
                        "#78746b",

                    edge:
                        "#55524e",

                    detail:
                        "gravel"

                }),


            ironRegion:
                Object.freeze({

                    base:
                        "#645d53",

                    edge:
                        "#403c38",

                    detail:
                        "ironDust"

                }),


            rubyRegion:
                Object.freeze({

                    base:
                        "#755559",

                    edge:
                        "#50383d",

                    detail:
                        "rubyShard"

                }),


            gnomeGardens:
                Object.freeze({

                    base:
                        "#66837a",

                    edge:
                        "#3d5a54",

                    detail:
                        "mushroomPath"

                }),


            fairyKingdom:
                Object.freeze({

                    base:
                        "#96738c",

                    edge:
                        "#674e68",

                    detail:
                        "fairyPetals"

                }),


            celestialFrontier:
                Object.freeze({

                    base:
                        "#8a876a",

                    edge:
                        "#625e49",

                    detail:
                        "greenStone"

                }),


            celestialStair:
                Object.freeze({

                    base:
                        "#d8d8d0",

                    edge:
                        "#a6b3b7",

                    detail:
                        "cloudStone"

                }),


            skyOne:
                Object.freeze({

                    base:
                        "#d5e0e5",

                    edge:
                        "#9eb6c0",

                    detail:
                        "skyStone"

                }),


            voidDungeon:
                Object.freeze({

                    base:
                        "#31293a",

                    edge:
                        "#16121b",

                    detail:
                        "voidCrack"

                })

        });


    function getPathStyle(
        areaId =
            state.area
    ) {

        return (
            PATH_STYLE_CONFIG[
                areaId
            ] ||
            PATH_STYLE_CONFIG
                .village
        );

    }


    /* ============================================================
       INTERIORES

       TODOS POSSUEM LAYOUT PRÓPRIO.
       ============================================================ */

    const HOUSE_INTERIORS =
        Object.freeze({

            home:
                Object.freeze({

                    id:
                        "home",

                    name:
                        "SUA CASA",

                    worldWidth:
                        1080,

                    worldHeight:
                        730,


                    room:
                        Object.freeze({

                            x:
                                130,

                            y:
                                90,

                            w:
                                820,

                            h:
                                525

                        }),


                    /*
                        Perto da cama.
                        Não em cima dela.
                    */
                    playerSpawn:
                        Object.freeze({

                            x:
                                365,

                            y:
                                365,

                            facing:
                                "left"

                        }),


                    respawnSpawn:
                        Object.freeze({

                            x:
                                365,

                            y:
                                365,

                            facing:
                                "left"

                        }),


                    door:
                        Object.freeze({

                            x:
                                495,

                            y:
                                560,

                            w:
                                90,

                            h:
                                55,

                            side:
                                "bottom"

                        }),


                    theme:
                        "home"

                }),


            elianHome:
                Object.freeze({

                    id:
                        "elianHome",

                    name:
                        "CASA DE ELIAN",

                    worldWidth:
                        1080,

                    worldHeight:
                        720,


                    room:
                        Object.freeze({

                            x:
                                140,

                            y:
                                105,

                            w:
                                800,

                            h:
                                500

                        }),


                    playerSpawn:
                        Object.freeze({

                            x:
                                540,

                            y:
                                505,

                            facing:
                                "up"

                        }),


                    door:
                        Object.freeze({

                            x:
                                500,

                            y:
                                550,

                            w:
                                80,

                            h:
                                50,

                            side:
                                "bottom"

                        }),


                    theme:
                        "archiveHome"

                }),


            maraHome:
                Object.freeze({

                    id:
                        "maraHome",

                    name:
                        "CASA DE MARA",

                    worldWidth:
                        1050,

                    worldHeight:
                        720,


                    room:
                        Object.freeze({

                            x:
                                125,

                            y:
                                100,

                            w:
                                800,

                            h:
                                505

                        }),


                    playerSpawn:
                        Object.freeze({

                            x:
                                525,

                            y:
                                510,

                            facing:
                                "up"

                        }),


                    door:
                        Object.freeze({

                            x:
                                485,

                            y:
                                550,

                            w:
                                80,

                            h:
                                50,

                            side:
                                "bottom"

                        }),


                    theme:
                        "herbalHome"

                }),


            shop:
                Object.freeze({

                    id:
                        "shop",

                    name:
                        "LOJA DE DORAN",

                    worldWidth:
                        1100,

                    worldHeight:
                        730,


                    room:
                        Object.freeze({

                            x:
                                100,

                            y:
                                90,

                            w:
                                900,

                            h:
                                530

                        }),


                    playerSpawn:
                        Object.freeze({

                            x:
                                550,

                            y:
                                535,

                            facing:
                                "up"

                        }),


                    door:
                        Object.freeze({

                            x:
                                505,

                            y:
                                565,

                            w:
                                90,

                            h:
                                50,

                            side:
                                "bottom"

                        }),


                    theme:
                        "merchant"

                }),


            forge:
                Object.freeze({

                    id:
                        "forge",

                    name:
                        "FORJA DE BORIN",

                    worldWidth:
                        1100,

                    worldHeight:
                        740,


                    room:
                        Object.freeze({

                            x:
                                95,

                            y:
                                85,

                            w:
                                910,

                            h:
                                545

                        }),


                    playerSpawn:
                        Object.freeze({

                            x:
                                550,

                            y:
                                545,

                            facing:
                                "up"

                        }),


                    door:
                        Object.freeze({

                            x:
                                505,

                            y:
                                575,

                            w:
                                90,

                            h:
                                50,

                            side:
                                "bottom"

                        }),


                    theme:
                        "forge"

                }),


            woodshop:
                Object.freeze({

                    id:
                        "woodshop",

                    name:
                        "OFICINA DE BRAN",

                    worldWidth:
                        1080,

                    worldHeight:
                        720,


                    room:
                        Object.freeze({

                            x:
                                115,

                            y:
                                95,

                            w:
                                850,

                            h:
                                515

                        }),


                    playerSpawn:
                        Object.freeze({

                            x:
                                540,

                            y:
                                525,

                            facing:
                                "up"

                        }),


                    door:
                        Object.freeze({

                            x:
                                500,

                            y:
                                560,

                            w:
                                80,

                            h:
                                48,

                            side:
                                "bottom"

                        }),


                    theme:
                        "woodworker"

                }),


            naraHome:
                Object.freeze({

                    id:
                        "naraHome",

                    name:
                        "CASA DE NARA",

                    worldWidth:
                        1060,

                    worldHeight:
                        720,


                    room:
                        Object.freeze({

                            x:
                                125,

                            y:
                                95,

                            w:
                                810,

                            h:
                                515

                        }),


                    playerSpawn:
                        Object.freeze({

                            x:
                                530,

                            y:
                                520,

                            facing:
                                "up"

                        }),


                    door:
                        Object.freeze({

                            x:
                                490,

                            y:
                                555,

                            w:
                                80,

                            h:
                                50,

                            side:
                                "bottom"

                        }),


                    theme:
                        "forestHome"

                })

        });


    /* ============================================================
       VILA FIXA

       A VILA NÃO MUDA ENTRE SESSÕES.
       ============================================================ */

    const VILLAGE_BUILDING_LAYOUT =
        Object.freeze([

            Object.freeze({

                id:
                    "home",

                x:
                    300,

                y:
                    1580,

                w:
                    430,

                h:
                    320,

                doorSide:
                    "bottom",

                houseId:
                    "home",

                style:
                    "playerHome"

            }),


            Object.freeze({

                id:
                    "elianHome",

                x:
                    350,

                y:
                    300,

                w:
                    420,

                h:
                    305,

                doorSide:
                    "bottom",

                houseId:
                    "elianHome",

                style:
                    "scholarHome"

            }),


            Object.freeze({

                id:
                    "maraHome",

                x:
                    910,

                y:
                    315,

                w:
                    390,

                h:
                    290,

                doorSide:
                    "bottom",

                houseId:
                    "maraHome",

                style:
                    "herbalHome"

            }),


            Object.freeze({

                id:
                    "shop",

                x:
                    2390,

                y:
                    320,

                w:
                    470,

                h:
                    325,

                doorSide:
                    "bottom",

                houseId:
                    "shop",

                style:
                    "merchant"

            }),


            Object.freeze({

                id:
                    "forge",

                x:
                    2390,

                y:
                    1530,

                w:
                    475,

                h:
                    340,

                doorSide:
                    "bottom",

                houseId:
                    "forge",

                style:
                    "forge"

            }),


            Object.freeze({

                id:
                    "woodshop",

                x:
                    870,

                y:
                    1640,

                w:
                    430,

                h:
                    300,

                doorSide:
                    "bottom",

                houseId:
                    "woodshop",

                style:
                    "woodworker"

            }),


            Object.freeze({

                id:
                    "naraHome",

                x:
                    1830,

                y:
                    1600,

                w:
                    390,

                h:
                    300,

                doorSide:
                    "bottom",

                houseId:
                    "naraHome",

                style:
                    "forestHome"

            })

        ]);


    const VILLAGE_NPC_LAYOUT =
        Object.freeze([

            Object.freeze({

                id:
                    "elian",

                name:
                    "ELIAN",

                x:
                    830,

                y:
                    820,

                type:
                    "villager"

            }),


            Object.freeze({

                id:
                    "mara",

                name:
                    "MARA",

                x:
                    1190,

                y:
                    780,

                type:
                    "scholar"

            }),


            Object.freeze({

                id:
                    "nara",

                name:
                    "NARA",

                x:
                    2050,

                y:
                    1420,

                type:
                    "ranger"

            }),


            Object.freeze({

                id:
                    "lyra",

                name:
                    "LYRA",

                x:
                    1020,

                y:
                    1290,

                type:
                    "villager"

            }),


            Object.freeze({

                id:
                    "kael",

                name:
                    "KAEL",

                x:
                    2230,

                y:
                    900,

                type:
                    "traveler"

            }),


            Object.freeze({

                id:
                    "miguel",

                name:
                    "MIGUEL",

                x:
                    2760,

                y:
                    840,

                type:
                    "mysterious"

            })

        ]);


    /* ============================================================
       WORLD FACTORY
       ============================================================ */

    function createEmptyWorld(
        areaId
    ) {

        const meta =
            REGION_META[
                areaId
            ] ||
            REGION_META
                .village;


        return {

            id:
                areaId,


            name:
                meta.name,


            width:
                meta.worldWidth,


            height:
                meta.worldHeight,


            biome:
                meta.biome,


            procedural:
                Boolean(
                    meta.procedural
                ),


            paths:
                [],


            pathNodes:
                [],


            buildings:
                [],


            doors:
                [],


            trees:
                [],


            rocks:
                [],


            grass:
                [],


            flowers:
                [],


            mushrooms:
                [],


            decorations:
                [],


            ambient:
                [],


            particles:
                [],


            obstacles:
                [],


            staticObstacles:
                [],


            npcs:
                [],


            enemies:
                [],


            bosses:
                [],


            resources:
                [],


            exits:
                [],


            gates:
                [],


            secretDoors:
                [],


            zones:
                [],


            walls:
                [],


            interactables:
                [],


            bossBarriers:
                [],


            spawnPoints:
                {},


            flags: {

                minimapSignal:
                    meta.minimapSignal !==
                    false,


                naturallyLit:
                    ![
                        "monarchMaze",
                        "voidDungeon"
                    ].includes(
                        areaId
                    ),


                requiresLantern:
                    Boolean(
                        meta.requiresLantern
                    ),


                altarNaturallyLit:
                    areaId ===
                    "monarchMaze"

            },


            generation: {

                seed:
                    V.getAreaSessionSeed(
                        areaId
                    ),

                revision:
                    1

            }

        };

    }


    /* ============================================================
       SPAWN
       ============================================================ */

    function setSpawn(
        world,
        id,
        x,
        y,
        facing =
            "down"
    ) {

        world.spawnPoints[
            id
        ] = {

            x:
                finiteNumber(
                    x
                ),

            y:
                finiteNumber(
                    y
                ),

            facing

        };

    }


    /* ============================================================
       ZONAS
       ============================================================ */

    function addZone(
        world,
        config
    ) {

        const zone = {

            id:
                config.id,


            type:
                config.type ||
                "zone",


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            w:
                Math.max(
                    1,
                    finiteNumber(
                        config.w,
                        10
                    )
                ),


            h:
                Math.max(
                    1,
                    finiteNumber(
                        config.h,
                        10
                    )
                ),


            protected:
                Boolean(
                    config.protected
                ),


            naturallyLit:
                Boolean(
                    config.naturallyLit
                ),


            ...config

        };


        world.zones.push(
            zone
        );


        return zone;

    }


    function isPointInsideZone(
        x,
        y,
        zone
    ) {

        return (

            x >= zone.x &&

            x <=
                zone.x +
                zone.w &&

            y >= zone.y &&

            y <=
                zone.y +
                zone.h

        );

    }


    function getZoneAtPoint(
        world,
        x,
        y
    ) {

        if (
            !world
        ) {

            return null;

        }


        for (
            const zone of
            safeArray(
                world.zones
            )
        ) {

            if (
                isPointInsideZone(
                    x,
                    y,
                    zone
                )
            ) {

                return zone;

            }

        }


        return null;

    }


    /* ============================================================
       CAMINHOS
       ============================================================ */

    function addPathRect(
        world,
        config
    ) {

        const path = {

            id:
                config.id ||
                `path_${world.paths.length}`,


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            w:
                Math.max(
                    10,
                    finiteNumber(
                        config.w,
                        100
                    )
                ),


            h:
                Math.max(
                    10,
                    finiteNumber(
                        config.h,
                        100
                    )
                ),


            style:
                config.style ||
                world.id,


            detail:
                config.detail ||
                getPathStyle(
                    world.id
                ).detail,

            main:
                config.main !==
                false

        };


        world.paths.push(
            path
        );


        return path;

    }


    function addPathBetweenPoints(
        world,
        from,
        to,
        width =
            180,
        idPrefix =
            "route"
    ) {

        const safeWidth =
            Math.max(
                60,
                finiteNumber(
                    width,
                    180
                )
            );


        /*
            Caminho em formato L.

            Primeiro horizontal,
            depois vertical.

            Isso permite caminhos
            orgânicos sem perder
            navegabilidade.
        */
        const minX =
            Math.min(
                from.x,
                to.x
            );


        const maxX =
            Math.max(
                from.x,
                to.x
            );


        addPathRect(
            world,
            {

                id:
                    `${idPrefix}_h_${world.paths.length}`,

                x:
                    minX -
                    safeWidth /
                    2,

                y:
                    from.y -
                    safeWidth /
                    2,

                w:
                    maxX -
                    minX +
                    safeWidth,

                h:
                    safeWidth,

                style:
                    world.id

            }
        );


        const minY =
            Math.min(
                from.y,
                to.y
            );


        const maxY =
            Math.max(
                from.y,
                to.y
            );


        addPathRect(
            world,
            {

                id:
                    `${idPrefix}_v_${world.paths.length}`,

                x:
                    to.x -
                    safeWidth /
                    2,

                y:
                    minY -
                    safeWidth /
                    2,

                w:
                    safeWidth,

                h:
                    maxY -
                    minY +
                    safeWidth,

                style:
                    world.id

            }
        );

    }


    function generateLinearRoute(
        world,
        options = {}
    ) {

        const axis =
            options.axis ||
            "x";


        const pointCount =
            Math.max(
                4,
                integer(
                    options.pointCount,
                    7
                )
            );


        const pathWidth =
            Math.max(
                100,
                finiteNumber(
                    options.pathWidth,
                    190
                )
            );


        const jitter =
            Math.max(
                0,
                finiteNumber(
                    options.jitter,
                    340
                )
            );


        const margin =
            Math.max(
                120,
                finiteNumber(
                    options.margin,
                    180
                )
            );


        const rng =
            getAreaRandom(
                world.id,
                options.salt ||
                "route"
            );


        const points =
            [];


        if (
            axis ===
            "y"
        ) {

            const centerX =
                world.width /
                2;


            for (
                let index = 0;
                index < pointCount;
                index += 1
            ) {

                const progress =
                    index /
                    (
                        pointCount -
                        1
                    );


                const y =
                    world.height -
                    margin -
                    progress *
                    (
                        world.height -
                        margin *
                        2
                    );


                let x =
                    centerX;


                if (
                    index !==
                    0 &&
                    index !==
                    pointCount -
                        1
                ) {

                    x +=
                        seededRange(
                            rng,
                            -jitter,
                            jitter
                        );

                }


                points.push({

                    x:
                        clamp(
                            x,
                            margin +
                                pathWidth,
                            world.width -
                                margin -
                                pathWidth
                        ),

                    y

                });

            }

        } else {

            const centerY =
                world.height /
                2;


            for (
                let index = 0;
                index < pointCount;
                index += 1
            ) {

                const progress =
                    index /
                    (
                        pointCount -
                        1
                    );


                const x =
                    margin +
                    progress *
                    (
                        world.width -
                        margin *
                        2
                    );


                let y =
                    centerY;


                if (
                    index !==
                    0 &&
                    index !==
                    pointCount -
                        1
                ) {

                    y +=
                        seededRange(
                            rng,
                            -jitter,
                            jitter
                        );

                }


                points.push({

                    x,

                    y:
                        clamp(
                            y,
                            margin +
                                pathWidth,
                            world.height -
                                margin -
                                pathWidth
                        )

                });

            }

        }


        world.pathNodes =
            points;


        for (
            let index = 0;
            index <
            points.length -
                1;
            index += 1
        ) {

            addPathBetweenPoints(

                world,

                points[
                    index
                ],

                points[
                    index +
                    1
                ],

                pathWidth,

                `${world.id}_route_${index}`

            );

        }


        return points;

    }


    /* ============================================================
       EXIT
       ============================================================ */

    function addExit(
        world,
        config
    ) {

        const exit = {

            id:
                config.id,


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            w:
                Math.max(
                    20,
                    finiteNumber(
                        config.w,
                        100
                    )
                ),


            h:
                Math.max(
                    20,
                    finiteNumber(
                        config.h,
                        100
                    )
                ),


            destination:
                config.destination,


            destinationSpawn:
                config.destinationSpawn ||
                "default",


            label:
                config.label ||
                "SEGUIR",


            interactionKey:
                config.interactionKey ||
                "E",


            unlocked:
                config.unlocked !==
                false,


            lockedMessage:
                config.lockedMessage ||
                "O caminho está bloqueado.",


            requiresInteraction:
                config.requiresInteraction !==
                false,


            bossId:
                config.bossId ||
                null,


            gateId:
                config.gateId ||
                null

        };


        world.exits.push(
            exit
        );


        return exit;

    }


    /* ============================================================
       PRÉDIOS
       ============================================================ */

    function createBuilding(
        config
    ) {

        return {

            id:
                config.id,


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            w:
                finiteNumber(
                    config.w,
                    400
                ),


            h:
                finiteNumber(
                    config.h,
                    300
                ),


            doorSide:
                config.doorSide ||
                "bottom",


            houseId:
                config.houseId ||
                null,


            style:
                config.style ||
                "house",


            solid:
                config.solid !==
                false,


            roofVariant:
                config.roofVariant ??
                0,


            wallVariant:
                config.wallVariant ??
                0,


            chimney:
                Boolean(
                    config.chimney
                ),


            flowerBox:
                Boolean(
                    config.flowerBox
                ),


            door:
                null

        };

    }


    function findBuilding(
        buildingId,
        world =
            state.world
    ) {

        return (
            world
                ?.buildings
                ?.find(
                    building =>
                        building.id ===
                        buildingId
                ) ||
            null
        );

    }


    function getBuildingDoorGeometry(
        building
    ) {

        if (
            !building
        ) {

            return null;

        }


        const side =
            building.doorSide ||
            "bottom";


        const doorWidth =
            clamp(
                building.w *
                    0.18,
                66,
                92
            );


        const depth =
            26;


        if (
            side ===
            "top"
        ) {

            return {

                side,

                x:
                    building.x +
                    building.w /
                    2 -
                    doorWidth /
                    2,

                y:
                    building.y -
                    3,

                w:
                    doorWidth,

                h:
                    depth,

                centerX:
                    building.x +
                    building.w /
                    2,

                centerY:
                    building.y +
                    depth /
                    2 -
                    3

            };

        }


        if (
            side ===
            "left"
        ) {

            return {

                side,

                x:
                    building.x -
                    3,

                y:
                    building.y +
                    building.h /
                    2 -
                    doorWidth /
                    2,

                w:
                    depth,

                h:
                    doorWidth,

                centerX:
                    building.x +
                    depth /
                    2 -
                    3,

                centerY:
                    building.y +
                    building.h /
                    2

            };

        }


        if (
            side ===
            "right"
        ) {

            return {

                side,

                x:
                    building.x +
                    building.w -
                    depth +
                    3,

                y:
                    building.y +
                    building.h /
                    2 -
                    doorWidth /
                    2,

                w:
                    depth,

                h:
                    doorWidth,

                centerX:
                    building.x +
                    building.w -
                    depth /
                    2 +
                    3,

                centerY:
                    building.y +
                    building.h /
                    2

            };

        }


        return {

            side:
                "bottom",

            x:
                building.x +
                building.w /
                2 -
                doorWidth /
                2,

            y:
                building.y +
                building.h -
                depth +
                3,

            w:
                doorWidth,

            h:
                depth,

            centerX:
                building.x +
                building.w /
                2,

            centerY:
                building.y +
                building.h -
                depth /
                2 +
                3

        };

    }


    function attachDoorToBuilding(
        building,
        world
    ) {

        const geometry =
            getBuildingDoorGeometry(
                building
            );


        if (
            !geometry
        ) {

            return null;

        }


        const door =
            createDoorRuntime({

                id:
                    `${building.id}_door`,

                buildingId:
                    building.id,

                houseId:
                    building.houseId,

                side:
                    geometry.side,

                x:
                    geometry.x,

                y:
                    geometry.y,

                w:
                    geometry.w,

                h:
                    geometry.h,

                hinge:
                    (
                        building.id.length %
                        2
                    ) ===
                    0
                        ? "left"
                        : "right"

            });


        building.door =
            door;


        world.doors.push(
            door
        );


        return door;

    }


    /* ============================================================
       ÁRVORES

       COLISÃO SOMENTE NO TRONCO.
       ============================================================ */

    function createTree(
        config
    ) {

        const scale =
            clamp(
                finiteNumber(
                    config.scale,
                    1
                ),
                0.65,
                1.55
            );


        return {

            id:
                config.id ||
                `tree_${Math.random().toString(36).slice(2)}`,


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            scale,


            variant:
                config.variant ||
                "oak",


            canopySeed:
                finiteNumber(
                    config.canopySeed,
                    Math.random() *
                        9999
                ),


            swayOffset:
                finiteNumber(
                    config.swayOffset,
                    Math.random() *
                        Math.PI *
                        2
                ),


            trunkWidth:
                25 *
                scale,


            trunkHeight:
                38 *
                scale,


            canopyRadius:
                58 *
                scale,


            harvested:
                false,


            harvestable:
                config.harvestable !==
                false,


            respawnSeconds:
                finiteNumber(
                    config.respawnSeconds,
                    80
                )

        };

    }


    function getTreeTrunkObstacle(
        tree
    ) {

        const width =
            tree.trunkWidth ||
            24;


        const height =
            tree.trunkHeight ||
            36;


        return createSolidObstacle({

            id:
                `${tree.id}_trunk`,

            type:
                "treeTrunk",

            x:
                tree.x -
                width /
                2,

            y:
                tree.y -
                height *
                0.25,

            w:
                width,

            h:
                height,

            collisionShape:
                "trunk",

            sourceId:
                tree.id,

            depthY:
                tree.y +
                height *
                0.75,

            blocksLight:
                false

        });

    }


    /* ============================================================
       PEDRAS
       ============================================================ */

    function createRock(
        config
    ) {

        return {

            id:
                config.id ||
                `rock_${Math.random().toString(36).slice(2)}`,


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            w:
                Math.max(
                    20,
                    finiteNumber(
                        config.w,
                        45
                    )
                ),


            h:
                Math.max(
                    18,
                    finiteNumber(
                        config.h,
                        35
                    )
                ),


            variant:
                integer(
                    config.variant,
                    0
                ),


            material:
                config.material ||
                null

        };

    }


    /* ============================================================
       GRAMA / FLORES / COGUMELOS
       ============================================================ */

    function createGrassPatch(
        config
    ) {

        return {

            x:
                finiteNumber(
                    config.x
                ),

            y:
                finiteNumber(
                    config.y
                ),

            scale:
                finiteNumber(
                    config.scale,
                    1
                ),

            rotation:
                finiteNumber(
                    config.rotation,
                    0
                ),

            variant:
                integer(
                    config.variant,
                    0
                ),

            swayOffset:
                finiteNumber(
                    config.swayOffset,
                    Math.random() *
                        Math.PI *
                        2
                )

        };

    }


    function createFlowerPatch(
        config
    ) {

        return {

            x:
                finiteNumber(
                    config.x
                ),

            y:
                finiteNumber(
                    config.y
                ),

            scale:
                finiteNumber(
                    config.scale,
                    1
                ),

            color:
                config.color ||
                "#d4c17b",

            swayOffset:
                finiteNumber(
                    config.swayOffset,
                    Math.random() *
                        Math.PI *
                        2
                )

        };

    }


    function createMushroom(
        config
    ) {

        return {

            id:
                config.id ||
                `mushroom_${Math.random().toString(36).slice(2)}`,

            x:
                finiteNumber(
                    config.x
                ),

            y:
                finiteNumber(
                    config.y
                ),

            scale:
                finiteNumber(
                    config.scale,
                    1
                ),

            variant:
                integer(
                    config.variant,
                    0
                ),

            glow:
                Boolean(
                    config.glow
                ),

            color:
                config.color ||
                "#77c7c0",

            swayOffset:
                Math.random() *
                Math.PI *
                2

        };

    }


    /* ============================================================
       NPC
       ============================================================ */

    function createNPC(
        config
    ) {

        return {

            id:
                config.id,


            name:
                config.name ||
                String(
                    config.id ||
                    "NPC"
                )
                    .toUpperCase(),


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            radius:
                finiteNumber(
                    config.radius,
                    19
                ),


            type:
                config.type ||
                "villager",


            facing:
                config.facing ||
                "down",


            vendor:
                config.vendor ||
                null,


            dialogueId:
                config.dialogueId ||
                config.id,


            questId:
                config.questId ||
                null,


            animationTime:
                Math.random() *
                10

        };

    }


    /* ============================================================
       INIMIGO
       ============================================================ */

    function createEnemy(
        speciesId,
        config = {}
    ) {

        const species =
            ENEMY_SPECIES[
                speciesId
            ];


        if (
            !species
        ) {

            console.warn(
                `VEYRA — espécie desconhecida: ${speciesId}`
            );

            return null;

        }


        return {

            entityId:
                config.entityId ||
                `${speciesId}_${Math.random().toString(36).slice(2)}`,


            id:
                species.id,


            speciesId:
                species.id,


            name:
                species.name,


            spriteType:
                species.spriteType,


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            spawnX:
                finiteNumber(
                    config.x
                ),


            spawnY:
                finiteNumber(
                    config.y
                ),


            radius:
                species.radius,


            hp:
                species.hp,


            maxHp:
                species.hp,


            damage:
                species.damage,


            defense:
                species.defense,


            speed:
                species.speed,


            xp:
                species.xp,


            ability:
                species.ability,


            abilityConfig:
                species.abilityConfig ||
                null,


            dropTable:
                species.dropTable ||
                [],


            dead:
                false,


            aggro:
                false,


            attackCooldown:
                random(
                    0,
                    0.7
                ),


            abilityCooldown:
                random(
                    0,
                    1
                ),


            state:
                "idle",


            stateTimer:
                0,


            telegraph:
                null,


            velocityX:
                0,


            velocityY:
                0,


            animationTime:
                Math.random() *
                20,


            hurtAnim:
                0,


            deathTimer:
                0,


            drops:
                config.drops ||
                null,


            questEnemyId:
                config.questEnemyId ||
                null

        };

    }


    /* ============================================================
       BOSS
       ============================================================ */

    function createBoss(
        bossId,
        config = {}
    ) {

        const definition =
            BOSS_REGISTRY[
                bossId
            ];


        if (
            !definition
        ) {

            console.warn(
                `VEYRA — boss desconhecido: ${bossId}`
            );

            return null;

        }


        if (
            isBossDefeated(
                bossId
            )
        ) {

            return null;

        }


        return {

            entityId:
                config.entityId ||
                `boss_${bossId}`,


            id:
                bossId,


            name:
                definition.name,


            subtitle:
                definition.subtitle ||
                "",


            icon:
                definition.icon,


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            spawnX:
                finiteNumber(
                    config.x
                ),


            spawnY:
                finiteNumber(
                    config.y
                ),


            radius:
                definition.radius,


            hp:
                definition.hp,


            maxHp:
                definition.hp,


            damage:
                definition.damage,


            defense:
                definition.defense,


            baseDefense:
                definition.defense,


            speed:
                definition.speed,


            progression:
                Boolean(
                    definition.progression
                ),


            topBar:
                Boolean(
                    definition.topBar
                ),


            centerLocked:
                Boolean(
                    definition.centerLocked
                ),


            requiresConfirmation:
                Boolean(
                    definition.requiresConfirmation
                ),


            state:
                definition.initialState,


            confirmed:
                !definition
                    .requiresConfirmation,


            aggro:
                false,


            dead:
                false,


            phase:
                1,


            phaseTransitionDone:
                false,


            attackCooldown:
                0,


            abilityCooldown:
                1,


            animationTime:
                0,


            hurtAnim:
                0,


            deathTimer:
                0,


            fade:
                1,


            stagger:
                0,


            staggerThreshold:
                definition.stagger
                    ?.threshold ||
                0,


            stunnedTimer:
                0,


            summonTimer:
                definition.summon
                    ? finiteNumber(
                        definition
                            .summon
                            .intervalMin,
                        4
                    )
                    : 0,


            arenaId:
                config.arenaId ||
                null,


            definition

        };

    }


    function addBossIfAlive(
        world,
        bossId,
        config
    ) {

        const boss =
            createBoss(
                bossId,
                config
            );


        if (
            boss
        ) {

            world.bosses.push(
                boss
            );

        }


        return boss;

    }


    /* ============================================================
       RECURSOS
       ============================================================ */

    function createResourceNode(
        config
    ) {

        return {

            id:
                config.id,


            type:
                config.type ||
                "ore",


            itemId:
                config.itemId,


            x:
                finiteNumber(
                    config.x
                ),


            y:
                finiteNumber(
                    config.y
                ),


            radius:
                finiteNumber(
                    config.radius,
                    28
                ),


            amount:
                Math.max(
                    1,
                    integer(
                        config.amount,
                        1
                    )
                ),


            holdSeconds:
                finiteNumber(
                    config.holdSeconds,
                    1
                ),


            harvested:
                false,


            respawnTimer:
                0,


            respawnSeconds:
                finiteNumber(
                    config.respawnSeconds,
                    70
                )

        };

    }


    /* ============================================================
       PROTEÇÃO DE CAMINHO

       Vegetação NÃO nasce:
       - em estrada;
       - em porta;
       - em boss;
       - em saída;
       - no spawn;
       - em altar.
       ============================================================ */

    function isPointNearPath(
        x,
        y,
        world,
        margin =
            35
    ) {

        for (
            const path of
            safeArray(
                world.paths
            )
        ) {

            if (

                x >=
                    path.x -
                    margin &&

                x <=
                    path.x +
                    path.w +
                    margin &&

                y >=
                    path.y -
                    margin &&

                y <=
                    path.y +
                    path.h +
                    margin

            ) {

                return true;

            }

        }


        return false;

    }


    function isPointInsideProtectedZone(
        x,
        y,
        world
    ) {

        if (
            isPointNearPath(
                x,
                y,
                world,
                38
            )
        ) {

            return true;

        }


        for (
            const zone of
            safeArray(
                world.zones
            )
        ) {

            if (

                zone.protected &&

                x >=
                    zone.x -
                    35 &&

                x <=
                    zone.x +
                    zone.w +
                    35 &&

                y >=
                    zone.y -
                    35 &&

                y <=
                    zone.y +
                    zone.h +
                    35

            ) {

                return true;

            }

        }


        for (
            const building of
            safeArray(
                world.buildings
            )
        ) {

            if (

                x >=
                    building.x -
                    55 &&

                x <=
                    building.x +
                    building.w +
                    55 &&

                y >=
                    building.y -
                    55 &&

                y <=
                    building.y +
                    building.h +
                    55

            ) {

                return true;

            }

        }


        for (
            const exit of
            safeArray(
                world.exits
            )
        ) {

            if (
                distance(
                    x,
                    y,
                    exit.x +
                        exit.w /
                        2,
                    exit.y +
                        exit.h /
                        2
                ) <
                130
            ) {

                return true;

            }

        }


        for (
            const spawn of
            Object.values(
                world.spawnPoints ||
                {}
            )
        ) {

            if (
                distance(
                    x,
                    y,
                    spawn.x,
                    spawn.y
                ) <
                150
            ) {

                return true;

            }

        }


        for (
            const boss of
            safeArray(
                world.bosses
            )
        ) {

            if (
                distance(
                    x,
                    y,
                    boss.x,
                    boss.y
                ) <
                220
            ) {

                return true;

            }

        }


        return false;

    }


    /* ============================================================
       AMBIENTE NATURAL
       ============================================================ */

    function populateNaturalEnvironment(
        world,
        options = {}
    ) {

        const rng =
            getAreaRandom(
                world.id,
                options.salt ||
                "nature"
            );


        const treeCount =
            Math.max(
                0,
                integer(
                    options.treeCount,
                    90
                )
            );


        const rockCount =
            Math.max(
                0,
                integer(
                    options.rockCount,
                    25
                )
            );


        const grassCount =
            Math.max(
                0,
                integer(
                    options.grassCount,
                    220
                )
            );


        const flowerCount =
            Math.max(
                0,
                integer(
                    options.flowerCount,
                    30
                )
            );


        const mushroomCount =
            Math.max(
                0,
                integer(
                    options.mushroomCount,
                    0
                )
            );


        const treeVariants =
            options.treeVariants ||
            [
                "oak",
                "old",
                "pine"
            ];


        const flowerColors =
            options.flowerColors ||
            [
                "#d8c36f",
                "#ba9fbd",
                "#d7d1a8"
            ];


        let createdTrees =
            0;


        let attempts =
            0;


        while (
            createdTrees <
                treeCount &&
            attempts <
                treeCount *
                    10
        ) {

            attempts +=
                1;


            const x =
                seededRange(
                    rng,
                    80,
                    world.width -
                        80
                );


            const y =
                seededRange(
                    rng,
                    80,
                    world.height -
                        80
                );


            if (
                isPointInsideProtectedZone(
                    x,
                    y,
                    world
                )
            ) {

                continue;

            }


            const tree =
                createTree({

                    id:
                        `${world.id}_tree_${createdTrees}`,

                    x,

                    y,

                    scale:
                        seededRange(
                            rng,
                            0.82,
                            1.30
                        ),

                    variant:
                        treeVariants[
                            seededInt(
                                rng,
                                0,
                                treeVariants.length -
                                    1
                            )
                        ],

                    canopySeed:
                        rng() *
                        9999,

                    swayOffset:
                        rng() *
                        Math.PI *
                        2

                });


            world.trees.push(
                tree
            );


            createdTrees +=
                1;

        }


        let createdRocks =
            0;


        attempts =
            0;


        while (
            createdRocks <
                rockCount &&
            attempts <
                rockCount *
                    10
        ) {

            attempts +=
                1;


            const x =
                seededRange(
                    rng,
                    70,
                    world.width -
                        70
                );


            const y =
                seededRange(
                    rng,
                    70,
                    world.height -
                        70
                );


            if (
                isPointInsideProtectedZone(
                    x,
                    y,
                    world
                )
            ) {

                continue;

            }


            world.rocks.push(
                createRock({

                    id:
                        `${world.id}_rock_${createdRocks}`,

                    x,

                    y,

                    w:
                        seededRange(
                            rng,
                            28,
                            64
                        ),

                    h:
                        seededRange(
                            rng,
                            22,
                            52
                        ),

                    variant:
                        seededInt(
                            rng,
                            0,
                            4
                        )

                })
            );


            createdRocks +=
                1;

        }


        for (
            let index = 0;
            index < grassCount;
            index += 1
        ) {

            world.grass.push(
                createGrassPatch({

                    x:
                        rng() *
                        world.width,

                    y:
                        rng() *
                        world.height,

                    scale:
                        seededRange(
                            rng,
                            0.55,
                            1.45
                        ),

                    rotation:
                        rng() *
                        Math.PI *
                        2,

                    variant:
                        seededInt(
                            rng,
                            0,
                            4
                        ),

                    swayOffset:
                        rng() *
                        Math.PI *
                        2

                })
            );

        }


        for (
            let index = 0;
            index < flowerCount;
            index += 1
        ) {

            const x =
                rng() *
                world.width;


            const y =
                rng() *
                world.height;


            if (
                isPointInsideProtectedZone(
                    x,
                    y,
                    world
                )
            ) {

                continue;

            }


            world.flowers.push(
                createFlowerPatch({

                    x,

                    y,

                    scale:
                        seededRange(
                            rng,
                            0.65,
                            1.35
                        ),

                    color:
                        flowerColors[
                            seededInt(
                                rng,
                                0,
                                flowerColors.length -
                                    1
                            )
                        ],

                    swayOffset:
                        rng() *
                        Math.PI *
                        2

                })
            );

        }


        for (
            let index = 0;
            index < mushroomCount;
            index += 1
        ) {

            const x =
                rng() *
                world.width;


            const y =
                rng() *
                world.height;


            if (
                isPointInsideProtectedZone(
                    x,
                    y,
                    world
                )
            ) {

                continue;

            }


            world.mushrooms.push(
                createMushroom({

                    id:
                        `${world.id}_mushroom_${index}`,

                    x,

                    y,

                    scale:
                        seededRange(
                            rng,
                            0.55,
                            1.6
                        ),

                    variant:
                        seededInt(
                            rng,
                            0,
                            5
                        ),

                    glow:
                        rng() <
                        (
                            options.mushroomGlowChance ??
                            0.12
                        ),

                    color:
                        options.mushroomColor ||
                        "#77c7c0"

                })
            );

        }

    }


    /* ============================================================
       SPAWN DE INIMIGOS
       ============================================================ */

    function spawnEnemiesNearRoute(
        world,
        options = {}
    ) {

        const speciesList =
            options.species ||
            [
                "wolf"
            ];


        const count =
            Math.max(
                0,
                integer(
                    options.count,
                    12
                )
            );


        const rng =
            getAreaRandom(
                world.id,
                options.salt ||
                "enemies"
            );


        const nodes =
            world.pathNodes;


        if (
            !nodes.length
        ) {

            return;

        }


        for (
            let index = 0;
            index < count;
            index += 1
        ) {

            const node =
                nodes[
                    seededInt(
                        rng,
                        1,
                        Math.max(
                            1,
                            nodes.length -
                                2
                        )
                    )
                ];


            const x =
                clamp(
                    node.x +
                    seededRange(
                        rng,
                        -300,
                        300
                    ),
                    100,
                    world.width -
                        100
                );


            const y =
                clamp(
                    node.y +
                    seededRange(
                        rng,
                        -280,
                        280
                    ),
                    100,
                    world.height -
                        100
                );


            const species =
                speciesList[
                    seededInt(
                        rng,
                        0,
                        speciesList.length -
                            1
                    )
                ];


            const enemy =
                createEnemy(
                    species,
                    {

                        entityId:
                            `${world.id}_enemy_${index}`,

                        x,

                        y

                    }
                );


            if (
                enemy
            ) {

                world.enemies.push(
                    enemy
                );

            }

        }

    }


    /* ============================================================
       RECURSOS PROCEDURAIS
       ============================================================ */

    function addResourceCluster(
        world,
        options = {}
    ) {

        const count =
            Math.max(
                0,
                integer(
                    options.count,
                    8
                )
            );


        const rng =
            getAreaRandom(
                world.id,
                options.salt ||
                `resource_${options.itemId}`
            );


        let created =
            0;


        let attempts =
            0;


        while (
            created <
                count &&
            attempts <
                count *
                    15
        ) {

            attempts +=
                1;


            const x =
                seededRange(
                    rng,
                    120,
                    world.width -
                        120
                );


            const y =
                seededRange(
                    rng,
                    120,
                    world.height -
                        120
                );


            /*
                Recursos ficam perto,
                mas não DENTRO do caminho.
            */
            if (
                isPointNearPath(
                    x,
                    y,
                    world,
                    -18
                ) ||
                isPointInsideProtectedZone(
                    x,
                    y,
                    {
                        ...world,
                        paths:
                            []
                    }
                )
            ) {

                continue;

            }


            world.resources.push(
                createResourceNode({

                    id:
                        `${world.id}_${options.itemId}_${created}`,

                    type:
                        options.type ||
                        "ore",

                    itemId:
                        options.itemId,

                    x,

                    y,

                    radius:
                        options.radius ||
                        28,

                    amount:
                        seededInt(
                            rng,
                            options.minAmount ??
                                1,
                            options.maxAmount ??
                                2
                        ),

                    holdSeconds:
                        options.holdSeconds ||
                        (
                            options.type ===
                            "tree"
                                ? GAME_CONFIG
                                    .treeHarvestSeconds
                                : GAME_CONFIG
                                    .oreHarvestSeconds
                        ),

                    respawnSeconds:
                        options.respawnSeconds ||
                        75

                })
            );


            created +=
                1;

        }

    }


    /* ============================================================
       BARREIRA DE BOSS
       ============================================================ */

    function createBossPassageBarrier(
        world,
        bossId,
        x,
        y,
        orientation =
            "vertical"
    ) {

        if (
            isBossDefeated(
                bossId
            )
        ) {

            return null;

        }


        const barrier =
            orientation ===
            "horizontal"

                ? {

                    id:
                        `${bossId}_passage_barrier`,

                    type:
                        "bossBarrier",

                    bossId,

                    x:
                        x -
                        180,

                    y:
                        y -
                        25,

                    w:
                        360,

                    h:
                        50,

                    shape:
                        "rect",

                    solid:
                        true,

                    blocksLight:
                        false

                }

                : {

                    id:
                        `${bossId}_passage_barrier`,

                    type:
                        "bossBarrier",

                    bossId,

                    x:
                        x -
                        25,

                    y:
                        y -
                        180,

                    w:
                        50,

                    h:
                        360,

                    shape:
                        "rect",

                    solid:
                        true,

                    blocksLight:
                        false

                };


        world.bossBarriers.push(
            barrier
        );


        return barrier;

    }


    /* ============================================================
       OBSTÁCULOS
       ============================================================ */

    function rebuildDynamicWorldObstacles(
        world =
            state.world
    ) {

        if (
            !world
        ) {

            return [];

        }


        const obstacles =
            [];


        for (
            const obstacle of
            safeArray(
                world.staticObstacles
            )
        ) {

            obstacles.push(
                obstacle
            );

        }


        for (
            const wall of
            safeArray(
                world.walls
            )
        ) {

            obstacles.push({

                id:
                    wall.id,

                type:
                    wall.type ||
                    "wall",

                shape:
                    "rect",

                x:
                    wall.x,

                y:
                    wall.y,

                w:
                    wall.w,

                h:
                    wall.h,

                solid:
                    true,

                blocksLight:
                    wall.blocksLight !==
                    false,

                depthY:
                    wall.y +
                    wall.h

            });

        }


        for (
            const building of
            safeArray(
                world.buildings
            )
        ) {

            if (
                building.solid
            ) {

                obstacles.push(
                    createSolidObstacle({

                        id:
                            `${building.id}_body`,

                        type:
                            "building",

                        x:
                            building.x,

                        y:
                            building.y,

                        w:
                            building.w,

                        h:
                            building.h,

                        sourceId:
                            building.id,

                        depthY:
                            building.y +
                            building.h,

                        blocksLight:
                            true

                    })
                );

            }

        }


        for (
            const tree of
            safeArray(
                world.trees
            )
        ) {

            if (
                tree.harvested
            ) {

                continue;

            }


            obstacles.push(
                getTreeTrunkObstacle(
                    tree
                )
            );

        }


        for (
            const rock of
            safeArray(
                world.rocks
            )
        ) {

            obstacles.push(
                createSolidObstacle({

                    id:
                        `${rock.id}_body`,

                    type:
                        "rock",

                    x:
                        rock.x -
                        rock.w /
                        2,

                    y:
                        rock.y -
                        rock.h /
                        2,

                    w:
                        rock.w,

                    h:
                        rock.h,

                    sourceId:
                        rock.id,

                    depthY:
                        rock.y +
                        rock.h /
                        2,

                    blocksLight:
                        false

                })
            );

        }


        for (
            const barrier of
            safeArray(
                world.bossBarriers
            )
        ) {

            if (
                !isBossDefeated(
                    barrier.bossId
                )
            ) {

                obstacles.push(
                    barrier
                );

            }

        }


        for (
            const gate of
            safeArray(
                world.gates
            )
        ) {

            if (
                gate.solid
            ) {

                obstacles.push(
                    gate
                );

            }

        }


        world.obstacles =
            obstacles;


        return obstacles;

    }


    /* ============================================================
       POSIÇÃO SEGURA
       ============================================================ */

    function collidesWithObstacleAt(
        x,
        y,
        radius,
        obstacle
    ) {

        if (
            !obstacle ||
            obstacle.solid ===
                false
        ) {

            return false;

        }


        if (
            obstacle.shape ===
            "circle"
        ) {

            return V.circleCircleCollision(

                x,
                y,
                radius,

                obstacle.x,
                obstacle.y,
                obstacle.radius

            );

        }


        return V.circleRectCollision(

            x,
            y,
            radius,

            obstacle

        );

    }


    function isPositionBlocked(
        x,
        y,
        radius,
        world =
            state.world
    ) {

        if (
            !world
        ) {

            return false;

        }


        if (

            x -
                radius <
                0 ||

            y -
                radius <
                0 ||

            x +
                radius >
                world.width ||

            y +
                radius >
                world.height

        ) {

            return true;

        }


        for (
            const obstacle of
            safeArray(
                world.obstacles
            )
        ) {

            if (
                collidesWithObstacleAt(
                    x,
                    y,
                    radius,
                    obstacle
                )
            ) {

                return true;

            }

        }


        return false;

    }


    function findSafePosition(
        x,
        y,
        radius,
        world =
            state.world
    ) {

        if (
            !world
        ) {

            return {
                x,
                y
            };

        }


        if (
            !isPositionBlocked(
                x,
                y,
                radius,
                world
            )
        ) {

            return {
                x,
                y
            };

        }


        const step =
            24;


        for (
            let ring = 1;
            ring <= 14;
            ring += 1
        ) {

            for (
                let angleIndex = 0;
                angleIndex < 16;
                angleIndex += 1
            ) {

                const angle =
                    (
                        angleIndex /
                        16
                    ) *
                    Math.PI *
                    2;


                const testX =
                    x +
                    Math.cos(
                        angle
                    ) *
                    step *
                    ring;


                const testY =
                    y +
                    Math.sin(
                        angle
                    ) *
                    step *
                    ring;


                if (
                    !isPositionBlocked(
                        testX,
                        testY,
                        radius,
                        world
                    )
                ) {

                    return {

                        x:
                            testX,

                        y:
                            testY

                    };

                }

            }

        }


        return {

            x:
                clamp(
                    x,
                    radius,
                    world.width -
                        radius
                ),

            y:
                clamp(
                    y,
                    radius,
                    world.height -
                        radius
                )

        };

    }


    /* ============================================================
       INTERIOR
       ============================================================ */

    function createHouseWorld(
        houseId
    ) {

        const config =
            HOUSE_INTERIORS[
                houseId
            ];


        if (
            !config
        ) {

            return null;

        }


        const world =
            createEmptyWorld(
                "village"
            );


        world.id =
            `interior_${houseId}`;


        world.name =
            config.name;


        world.width =
            config.worldWidth;


        world.height =
            config.worldHeight;


        world.interior =
            true;


        world.interiorId =
            houseId;


        world.theme =
            config.theme;


        world.flags
            .minimapSignal =
            false;


        world.flags
            .naturallyLit =
            true;


        world.room = {

            ...config.room

        };


        setSpawn(

            world,

            "default",

            config
                .playerSpawn
                .x,

            config
                .playerSpawn
                .y,

            config
                .playerSpawn
                .facing ||
                "up"

        );


        if (
            config.respawnSpawn
        ) {

            setSpawn(

                world,

                "respawn",

                config
                    .respawnSpawn
                    .x,

                config
                    .respawnSpawn
                    .y,

                config
                    .respawnSpawn
                    .facing ||
                    "down"

            );

        }


        const room =
            config.room;


        const door =
            config.door;


        const thickness =
            28;


        /*
            Parede superior.
        */
        world.walls.push({

            id:
                `${houseId}_wall_top`,

            x:
                room.x,

            y:
                room.y,

            w:
                room.w,

            h:
                thickness,

            blocksLight:
                true

        });


        /*
            Parede esquerda.
        */
        world.walls.push({

            id:
                `${houseId}_wall_left`,

            x:
                room.x,

            y:
                room.y,

            w:
                thickness,

            h:
                room.h,

            blocksLight:
                true

        });


        /*
            Parede direita.
        */
        world.walls.push({

            id:
                `${houseId}_wall_right`,

            x:
                room.x +
                room.w -
                thickness,

            y:
                room.y,

            w:
                thickness,

            h:
                room.h,

            blocksLight:
                true

        });


        /*
            Parede inferior dividida
            corretamente pela porta.
        */
        const bottomY =
            room.y +
            room.h -
            thickness;


        const leftWidth =
            Math.max(
                0,
                door.x -
                room.x
            );


        const rightStart =
            door.x +
            door.w;


        const rightWidth =
            Math.max(

                0,

                room.x +
                    room.w -
                    rightStart

            );


        if (
            leftWidth >
            0
        ) {

            world.walls.push({

                id:
                    `${houseId}_wall_bottom_left`,

                x:
                    room.x,

                y:
                    bottomY,

                w:
                    leftWidth,

                h:
                    thickness,

                blocksLight:
                    true

            });

        }


        if (
            rightWidth >
            0
        ) {

            world.walls.push({

                id:
                    `${houseId}_wall_bottom_right`,

                x:
                    rightStart,

                y:
                    bottomY,

                w:
                    rightWidth,

                h:
                    thickness,

                blocksLight:
                    true

            });

        }


        /*
            Porta física interna.
        */
        const interiorDoor =
            createDoorRuntime({

                id:
                    `${houseId}_interior_door`,

                houseId,

                side:
                    "bottom",

                x:
                    door.x,

                y:
                    door.y,

                w:
                    door.w,

                h:
                    door.h,

                hinge:
                    houseId.length %
                    2 ===
                    0
                        ? "left"
                        : "right",

                autoOpen:
                    true

            });


        world.doors.push(
            interiorDoor
        );


        addExit(
            world,
            {

                id:
                    `${houseId}_exit`,

                x:
                    door.x,

                y:
                    door.y,

                w:
                    door.w,

                h:
                    door.h,

                destination:
                    "outside",

                label:
                    "SAIR",

                interactionKey:
                    "Z",

                requiresInteraction:
                    true,

                unlocked:
                    true

            }
        );


        populateInteriorDecorations(
            world,
            houseId
        );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       DECORAÇÃO DOS INTERIORES
       ============================================================ */

    function populateInteriorDecorations(
        world,
        houseId
    ) {

        if (
            houseId ===
            "home"
        ) {

            /*
                CAMA.
            */
            world.decorations.push({

                id:
                    "home_bed",

                type:
                    "bed",

                x:
                    255,

                y:
                    225,

                w:
                    120,

                h:
                    175,

                depthY:
                    310

            });


            world.interactables.push({

                id:
                    "home_bed_rest",

                type:
                    "bedRest",

                x:
                    325,

                y:
                    315,

                radius:
                    105,

                key:
                    "E",

                label:
                    "DESCANSAR"

            });


            world.decorations.push(

                {

                    type:
                        "chest",

                    x:
                        820,

                    y:
                        210

                },


                {

                    type:
                        "rug",

                    x:
                        545,

                    y:
                        365,

                    w:
                        245,

                    h:
                        135

                },


                {

                    type:
                        "smallTable",

                    x:
                        725,

                    y:
                        405

                },


                {

                    type:
                        "chair",

                    x:
                        675,

                    y:
                        430

                },


                {

                    type:
                        "window",

                    x:
                        535,

                    y:
                        115

                },


                {

                    type:
                        "candle",

                    x:
                        710,

                    y:
                        380

                }

            );


            return;

        }


        if (
            houseId ===
            "elianHome"
        ) {

            world.decorations.push(

                {

                    type:
                        "bookshelf",

                    x:
                        240,

                    y:
                        185

                },


                {

                    type:
                        "bookshelf",

                    x:
                        835,

                    y:
                        185

                },


                {

                    type:
                        "archiveTable",

                    x:
                        540,

                    y:
                        345

                },


                {

                    type:
                        "papers",

                    x:
                        600,

                    y:
                        330

                },


                {

                    type:
                        "mapWall",

                    x:
                        535,

                    y:
                        145

                },


                {

                    type:
                        "candleCluster",

                    x:
                        430,

                    y:
                        335

                }

            );


            return;

        }


        if (
            houseId ===
            "maraHome"
        ) {

            world.decorations.push(

                {

                    type:
                        "herbTable",

                    x:
                        520,

                    y:
                        350

                },


                {

                    type:
                        "hangingHerbs",

                    x:
                        280,

                    y:
                        155

                },


                {

                    type:
                        "hangingHerbs",

                    x:
                        760,

                    y:
                        155

                },


                {

                    type:
                        "plantShelf",

                    x:
                        810,

                    y:
                        270

                },


                {

                    type:
                        "smallRug",

                    x:
                        500,

                    y:
                        465

                }

            );


            return;

        }


        if (
            houseId ===
            "shop"
        ) {

            world.decorations.push(

                {

                    type:
                        "counter",

                    x:
                        550,

                    y:
                        285,

                    w:
                        430

                },


                {

                    type:
                        "shelves",

                    x:
                        250,

                    y:
                        185

                },


                {

                    type:
                        "crates",

                    x:
                        870,

                    y:
                        450

                },


                {

                    type:
                        "hangingLantern",

                    x:
                        550,

                    y:
                        160

                }

            );


            world.npcs.push(
                createNPC({

                    id:
                        "doran",

                    name:
                        "DORAN",

                    x:
                        550,

                    y:
                        220,

                    type:
                        "merchant",

                    vendor:
                        "doran"

                })
            );


            return;

        }


        if (
            houseId ===
            "forge"
        ) {

            world.decorations.push(

                {

                    type:
                        "forgeFire",

                    x:
                        270,

                    y:
                        250

                },


                {

                    type:
                        "anvil",

                    x:
                        620,

                    y:
                        350

                },


                {

                    type:
                        "weaponRack",

                    x:
                        880,

                    y:
                        220

                },


                {

                    type:
                        "coalPile",

                    x:
                        830,

                    y:
                        475

                },


                {

                    type:
                        "forgeTools",

                    x:
                        390,

                    y:
                        190

                }

            );


            world.npcs.push(
                createNPC({

                    id:
                        "borin",

                    name:
                        "BORIN",

                    x:
                        570,

                    y:
                        245,

                    type:
                        "blacksmith",

                    vendor:
                        "borin",

                    questId:
                        "coal"

                })
            );


            return;

        }


        if (
            houseId ===
            "woodshop"
        ) {

            world.decorations.push(

                {

                    type:
                        "workbench",

                    x:
                        540,

                    y:
                        320

                },


                {

                    type:
                        "woodStack",

                    x:
                        250,

                    y:
                        250

                },


                {

                    type:
                        "toolsWall",

                    x:
                        800,

                    y:
                        180

                },


                {

                    type:
                        "sawdust",

                    x:
                        650,

                    y:
                        390

                }

            );


            world.npcs.push(
                createNPC({

                    id:
                        "bran",

                    name:
                        "BRAN",

                    x:
                        545,

                    y:
                        245,

                    type:
                        "woodworker",

                    questId:
                        "wood"

                })
            );


            return;

        }


        if (
            houseId ===
            "naraHome"
        ) {

            world.decorations.push(

                {

                    type:
                        "bowRack",

                    x:
                        800,

                    y:
                        180

                },


                {

                    type:
                        "plantPot",

                    x:
                        250,

                    y:
                        200

                },


                {

                    type:
                        "forestRug",

                    x:
                        520,

                    y:
                        380

                },


                {

                    type:
                        "smallTable",

                    x:
                        700,

                    y:
                        330

                }

            );

        }

    }


    /* ============================================================
       FONTE DA VILA
       ============================================================ */

    function addVillageFountain(
        world
    ) {

        const fountain = {

            id:
                "village_fountain",

            type:
                "fountain",

            x:
                1600,

            y:
                1120,

            radius:
                128,

            pillarHeight:
                125,

            depthY:
                1150,

            animated:
                true

        };


        world.decorations.push(
            fountain
        );


        /*
            SOMENTE A BACIA
            tem colisão.

            O pilar é visual.
        */
        world.staticObstacles.push({

            id:
                "village_fountain_base_collision",

            type:
                "fountainBase",

            shape:
                "circle",

            x:
                fountain.x,

            y:
                fountain.y,

            radius:
                116,

            solid:
                true,

            blocksLight:
                false,

            depthY:
                fountain.y +
                15

        });


        /*
            Partículas de água.
        */
        world.ambient.push({

            id:
                "fountain_water",

            type:
                "fountainWater",

            x:
                fountain.x,

            y:
                fountain.y,

            radius:
                fountain.radius

        });


        return fountain;

    }


    /* ============================================================
       VILA
       ============================================================ */

    function buildVillageWorld() {

        const world =
            createEmptyWorld(
                "village"
            );


        /* ========================================================
           CAMINHO CENTRAL EM CRUZ

                         NORTE
                           |
                           |
                OESTE --- FONTE --- LESTE
                           |
                           |
                          SUL
           ======================================================== */

        addPathRect(
            world,
            {

                id:
                    "village_path_north",

                x:
                    1475,

                y:
                    0,

                w:
                    250,

                h:
                    1010,

                main:
                    true

            }
        );


        addPathRect(
            world,
            {

                id:
                    "village_path_south",

                x:
                    1475,

                y:
                    1230,

                w:
                    250,

                h:
                    1070,

                main:
                    true

            }
        );


        addPathRect(
            world,
            {

                id:
                    "village_path_west",

                x:
                    0,

                y:
                    995,

                w:
                    1485,

                h:
                    250,

                main:
                    true

            }
        );


        addPathRect(
            world,
            {

                id:
                    "village_path_east",

                x:
                    1715,

                y:
                    995,

                w:
                    1485,

                h:
                    250,

                main:
                    true

            }
        );


        /*
            Praça ao redor da fonte.
        */
        addPathRect(
            world,
            {

                id:
                    "village_plaza",

                x:
                    1390,

                y:
                    910,

                w:
                    420,

                h:
                    420,

                main:
                    true

            }
        );


        /*
            Casas.
        */
        for (
            let index = 0;
            index <
            VILLAGE_BUILDING_LAYOUT
                .length;
            index += 1
        ) {

            const config =
                VILLAGE_BUILDING_LAYOUT[
                    index
                ];


            const building =
                createBuilding({

                    ...config,

                    roofVariant:
                        index %
                        4,

                    wallVariant:
                        index %
                        3,

                    chimney:
                        [
                            "home",
                            "forge",
                            "maraHome"
                        ].includes(
                            config.id
                        ),

                    flowerBox:
                        [
                            "home",
                            "maraHome",
                            "naraHome"
                        ].includes(
                            config.id
                        )

                });


            world.buildings.push(
                building
            );


            attachDoorToBuilding(
                building,
                world
            );

        }


        /*
            Caminhos menores ligando
            cada casa à cruz central.
        */
        const villageBranchPoints = [

            [
                {
                    x: 515,
                    y: 1760
                },
                {
                    x: 515,
                    y: 1120
                }
            ],

            [
                {
                    x: 560,
                    y: 620
                },
                {
                    x: 560,
                    y: 1120
                }
            ],

            [
                {
                    x: 1105,
                    y: 620
                },
                {
                    x: 1105,
                    y: 1120
                }
            ],

            [
                {
                    x: 2625,
                    y: 660
                },
                {
                    x: 2625,
                    y: 1120
                }
            ],

            [
                {
                    x: 2625,
                    y: 1870
                },
                {
                    x: 2625,
                    y: 1120
                }
            ],

            [
                {
                    x: 1085,
                    y: 1940
                },
                {
                    x: 1085,
                    y: 1120
                }
            ],

            [
                {
                    x: 2025,
                    y: 1890
                },
                {
                    x: 2025,
                    y: 1120
                }
            ]

        ];


        villageBranchPoints
            .forEach(
                (
                    [
                        from,
                        to
                    ],
                    index
                ) => {

                    addPathBetweenPoints(

                        world,

                        from,

                        to,

                        105,

                        `village_branch_${index}`

                    );

                }
            );


        addVillageFountain(
            world
        );


        /* ========================================================
           NPCs EXTERNOS
           ======================================================== */

        for (
            const config of
            VILLAGE_NPC_LAYOUT
        ) {

            world.npcs.push(
                createNPC(
                    config
                )
            );

        }


        /* ========================================================
           SPAWNS
           ======================================================== */

        setSpawn(
            world,
            "default",
            610,
            1960,
            "up"
        );


        setSpawn(
            world,
            "homeReturn",
            610,
            1960,
            "up"
        );


        setSpawn(
            world,
            "eastReturn",
            3040,
            1120,
            "left"
        );


        setSpawn(
            world,
            "northReturn",
            1600,
            165,
            "down"
        );


        /* ========================================================
           PORTÕES
           ======================================================== */

        const northUnlocked =
            Boolean(
                state.player
                    ?.gateUnlocks
                    ?.north
            );


        world.gates.push(

            {

                id:
                    "north_gate",

                type:
                    "gate",

                orientation:
                    "horizontal",

                x:
                    1430,

                y:
                    35,

                w:
                    340,

                h:
                    82,

                solid:
                    !northUnlocked,

                locked:
                    !northUnlocked,

                label:
                    "CAMINHO 2",

                blocksLight:
                    false

            },


            {

                id:
                    "west_gate",

                type:
                    "gate",

                orientation:
                    "vertical",

                x:
                    35,

                y:
                    950,

                w:
                    82,

                h:
                    340,

                solid:
                    true,

                locked:
                    true,

                future:
                    true,

                label:
                    "CAMINHO 3",

                blocksLight:
                    false

            },


            {

                id:
                    "east_gate",

                type:
                    "gate",

                orientation:
                    "vertical",

                x:
                    3080,

                y:
                    950,

                w:
                    82,

                h:
                    340,

                solid:
                    false,

                locked:
                    false,

                label:
                    "CAMINHO 1",

                blocksLight:
                    false

            },


            {

                id:
                    "south_gate",

                type:
                    "gate",

                orientation:
                    "horizontal",

                x:
                    1430,

                y:
                    2180,

                w:
                    340,

                h:
                    82,

                solid:
                    true,

                locked:
                    true,

                future:
                    true,

                label:
                    "CAMINHO 4",

                blocksLight:
                    false

            }

        );


        /* ========================================================
           SAÍDAS
           ======================================================== */

        addExit(
            world,
            {

                id:
                    "village_to_road",

                x:
                    3060,

                y:
                    970,

                w:
                    140,

                h:
                    300,

                destination:
                    "road",

                destinationSpawn:
                    "west",

                label:
                    "SEGUIR PELO CAMINHO 1",

                interactionKey:
                    "E",

                unlocked:
                    true,

                gateId:
                    "east_gate"

            }
        );


        addExit(
            world,
            {

                id:
                    "village_to_gnome",

                x:
                    1450,

                y:
                    0,

                w:
                    300,

                h:
                    125,

                destination:
                    "gnomeGardens",

                destinationSpawn:
                    "south",

                label:
                    "ATRAVESSAR O PORTÃO NORTE",

                interactionKey:
                    "E",

                unlocked:
                    northUnlocked,

                gateId:
                    "north_gate",

                lockedMessage:
                    "O Portão Norte permanece selado."

            }
        );


        addExit(
            world,
            {

                id:
                    "village_west_future",

                x:
                    0,

                y:
                    970,

                w:
                    125,

                h:
                    300,

                destination:
                    null,

                label:
                    "CAMINHO 3",

                interactionKey:
                    "E",

                unlocked:
                    false,

                gateId:
                    "west_gate",

                lockedMessage:
                    "Este caminho ainda permanece selado."

            }
        );


        addExit(
            world,
            {

                id:
                    "village_south_future",

                x:
                    1450,

                y:
                    2175,

                w:
                    300,

                h:
                    125,

                destination:
                    null,

                label:
                    "CAMINHO 4",

                interactionKey:
                    "E",

                unlocked:
                    false,

                gateId:
                    "south_gate",

                lockedMessage:
                    "Algo além deste portão ainda não despertou."

            }
        );


        /* ========================================================
           PRAÇA PROTEGIDA
           ======================================================== */

        addZone(
            world,
            {

                id:
                    "village_center",

                type:
                    "plaza",

                x:
                    1350,

                y:
                    870,

                w:
                    500,

                h:
                    500,

                protected:
                    true

            }
        );


        /* ========================================================
           AMBIENTE

           Vila é fixa, mas decoração
           continua rica.
           ======================================================== */

        populateNaturalEnvironment(
            world,
            {

                salt:
                    "village_fixed_nature",

                treeCount:
                    92,

                rockCount:
                    18,

                grassCount:
                    270,

                flowerCount:
                    52,

                treeVariants: [
                    "oak",
                    "old",
                    "birch"
                ],

                flowerColors: [
                    "#d8c56f",
                    "#c997a5",
                    "#aaa8d0",
                    "#ded6ac"
                ]

            }
        );


        /*
            Bancos / postes / detalhes
            da praça.
        */
        world.decorations.push(

            {
                type: "bench",
                x: 1350,
                y: 1120,
                facing: "right"
            },

            {
                type: "bench",
                x: 1850,
                y: 1120,
                facing: "left"
            },

            {
                type: "lampPost",
                x: 1400,
                y: 900
            },

            {
                type: "lampPost",
                x: 1800,
                y: 900
            },

            {
                type: "lampPost",
                x: 1400,
                y: 1340
            },

            {
                type: "lampPost",
                x: 1800,
                y: 1340
            }

        );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       HELPER DE CAMINHO 1
       ============================================================ */

    function buildHorizontalProgressionWorld(
        config
    ) {

        const world =
            createEmptyWorld(
                config.areaId
            );


        const route =
            generateLinearRoute(
                world,
                {

                    axis:
                        "x",

                    pointCount:
                        config.pointCount ||
                        7,

                    pathWidth:
                        config.pathWidth ||
                        190,

                    jitter:
                        config.jitter ||
                        340,

                    margin:
                        180,

                    salt:
                        "main_path"

                }
            );


        const start =
            route[
                0
            ];


        const end =
            route[
                route.length -
                    1
            ];


        setSpawn(
            world,
            "default",
            start.x,
            start.y,
            "right"
        );


        setSpawn(
            world,
            "west",
            start.x,
            start.y,
            "right"
        );


        setSpawn(
            world,
            "east",
            end.x,
            end.y,
            "left"
        );


        /*
            Volta.
        */
        addExit(
            world,
            {

                id:
                    `${config.areaId}_back`,

                x:
                    0,

                y:
                    start.y -
                    150,

                w:
                    145,

                h:
                    300,

                destination:
                    config.previousArea,

                destinationSpawn:
                    config.previousSpawn ||
                    "east",

                label:
                    config.backLabel ||
                    "VOLTAR",

                interactionKey:
                    "E",

                unlocked:
                    true

            }
        );


        /*
            Boss de caminho.
        */
        let boss =
            null;


        if (
            config.bossId
        ) {

            const bossNode =
                route[
                    route.length -
                        2
                ];


            boss =
                addBossIfAlive(
                    world,
                    config.bossId,
                    {

                        x:
                            bossNode.x,

                        y:
                            bossNode.y

                    }
                );


            if (
                boss
            ) {

                createBossPassageBarrier(

                    world,

                    config.bossId,

                    bossNode.x +
                        170,

                    bossNode.y,

                    "vertical"

                );

            }

        }


        /*
            Avanço.
        */
        addExit(
            world,
            {

                id:
                    `${config.areaId}_forward`,

                x:
                    world.width -
                    145,

                y:
                    end.y -
                    150,

                w:
                    145,

                h:
                    300,

                destination:
                    config.nextArea,

                destinationSpawn:
                    config.nextSpawn ||
                    "west",

                label:
                    config.forwardLabel ||
                    "SEGUIR",

                interactionKey:
                    "E",

                unlocked:
                    !config.bossId ||
                    isBossDefeated(
                        config.bossId
                    ),

                bossId:
                    config.bossId ||
                    null,

                lockedMessage:
                    config.bossLockedMessage ||
                    "O Guardião ainda bloqueia a passagem."

            }
        );


        populateNaturalEnvironment(
            world,
            config.nature ||
            {}
        );


        spawnEnemiesNearRoute(
            world,
            {

                species:
                    config.enemies ||
                    [
                        "wolf"
                    ],

                count:
                    config.enemyCount ||
                    12,

                salt:
                    "normal_enemies"

            }
        );


        for (
            const resourceConfig of
            config.resources ||
            []
        ) {

            addResourceCluster(
                world,
                resourceConfig
            );

        }


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       ESTRADA
       ============================================================ */

    function buildRoadWorld() {

        return buildHorizontalProgressionWorld({

            areaId:
                "road",

            previousArea:
                "village",

            previousSpawn:
                "eastReturn",

            nextArea:
                "forest",

            nextSpawn:
                "west",

            bossId:
                "road_guardian",

            pathWidth:
                220,

            jitter:
                220,

            pointCount:
                6,

            forwardLabel:
                "ENTRAR NA FLORESTA",

            bossLockedMessage:
                "O Guardião da Estrada ainda bloqueia a passagem.",


            nature: {

                salt:
                    "road_nature",

                treeCount:
                    72,

                rockCount:
                    26,

                grassCount:
                    210,

                flowerCount:
                    18,

                treeVariants: [
                    "oak",
                    "old"
                ]

            },


            enemies: [
                "wolf",
                "boar"
            ],

            enemyCount:
                13,


            resources: [

                {
                    itemId: "madeira",
                    type: "tree",
                    count: 7,
                    salt: "road_wood"
                },

                {
                    itemId: "pedra",
                    type: "rock",
                    count: 5,
                    salt: "road_stone"
                }

            ]

        });

    }


    /* ============================================================
       FLORESTA
       ============================================================ */

    function buildForestWorld() {

        const world =
            buildHorizontalProgressionWorld({

                areaId:
                    "forest",

                previousArea:
                    "road",

                previousSpawn:
                    "east",

                nextArea:
                    "grove",

                nextSpawn:
                    "west",

                bossId:
                    "forest_warden",

                pathWidth:
                    175,

                jitter:
                    390,

                pointCount:
                    8,

                backLabel:
                    "VOLTAR À ESTRADA",

                forwardLabel:
                    "SEGUIR PARA O BOSQUE",

                bossLockedMessage:
                    "O Vigia da Floresta impede sua passagem.",


                nature: {

                    salt:
                        "forest_nature",

                    treeCount:
                        178,

                    rockCount:
                        24,

                    grassCount:
                        360,

                    flowerCount:
                        46,

                    mushroomCount:
                        22,

                    mushroomGlowChance:
                        0.06,

                    treeVariants: [
                        "oak",
                        "old",
                        "birch"
                    ],

                    flowerColors: [
                        "#cbbf72",
                        "#d7c7a1",
                        "#a6bb8a",
                        "#bc91ac"
                    ]

                },


                enemies: [
                    "wolf",
                    "boar",
                    "thornling"
                ],

                enemyCount:
                    19,


                resources: [

                    {
                        itemId: "madeira",
                        type: "tree",
                        count: 15,
                        salt: "forest_wood",
                        minAmount: 1,
                        maxAmount: 2
                    },

                    {
                        itemId: "pedra",
                        type: "rock",
                        count: 5,
                        salt: "forest_stone"
                    }

                ]

            });


        /*
            Folhas e raízes no chão.
        */
        const rng =
            getAreaRandom(
                "forest",
                "forest_details"
            );


        for (
            let index = 0;
            index < 70;
            index += 1
        ) {

            world.decorations.push({

                type:
                    rng() >
                    0.45
                        ? "fallenLeaves"
                        : "smallRoot",

                x:
                    rng() *
                    world.width,

                y:
                    rng() *
                    world.height,

                rotation:
                    rng() *
                    Math.PI *
                    2,

                scale:
                    seededRange(
                        rng,
                        0.6,
                        1.3
                    )

            });

        }


        return world;

    }


    /* ============================================================
       BOSQUE
       ============================================================ */

    function buildGroveWorld() {

        return buildHorizontalProgressionWorld({

            areaId:
                "grove",

            previousArea:
                "forest",

            previousSpawn:
                "east",

            nextArea:
                "mountains",

            nextSpawn:
                "west",

            bossId:
                "grove_heart",

            pathWidth:
                165,

            jitter:
                430,

            pointCount:
                8,

            backLabel:
                "VOLTAR À FLORESTA",

            forwardLabel:
                "SEGUIR PARA AS MONTANHAS",

            bossLockedMessage:
                "O Coração do Bosque mantém o caminho fechado.",


            nature: {

                salt:
                    "grove_nature",

                treeCount:
                    195,

                rockCount:
                    22,

                grassCount:
                    390,

                flowerCount:
                    60,

                mushroomCount:
                    30,

                mushroomGlowChance:
                    0.13,

                treeVariants: [
                    "old",
                    "oak",
                    "ancient"
                ],

                flowerColors: [
                    "#d7cb8f",
                    "#c3a3c8",
                    "#90af85",
                    "#d0b9a8"
                ]

            },


            enemies: [
                "thornling",
                "wolf",
                "boar"
            ],

            enemyCount:
                20,


            resources: [

                {
                    itemId: "madeira",
                    type: "tree",
                    count: 13,
                    salt: "grove_wood"
                },

                {
                    itemId: "pedra",
                    type: "rock",
                    count: 6,
                    salt: "grove_stone"
                }

            ]

        });

    }


    /* ============================================================
       MONTANHAS
       ============================================================ */

    function buildMountainsWorld() {

        return buildHorizontalProgressionWorld({

            areaId:
                "mountains",

            previousArea:
                "grove",

            previousSpawn:
                "east",

            nextArea:
                "ironRegion",

            nextSpawn:
                "west",

            bossId:
                "mountain_titan",

            pathWidth:
                180,

            jitter:
                350,

            pointCount:
                8,

            backLabel:
                "DESCER AO BOSQUE",

            forwardLabel:
                "ENTRAR NOS VEIOS DE FERRO",

            bossLockedMessage:
                "O Titã da Montanha bloqueia a passagem.",


            nature: {

                salt:
                    "mountain_nature",

                treeCount:
                    64,

                rockCount:
                    92,

                grassCount:
                    170,

                flowerCount:
                    10,

                treeVariants: [
                    "pine",
                    "old"
                ]

            },


            enemies: [
                "stoneCrawler",
                "boar"
            ],

            enemyCount:
                18,


            resources: [

                {
                    itemId: "pedra",
                    type: "ore",
                    count: 18,
                    salt: "mountain_stone"
                },

                {
                    itemId: "carvao",
                    type: "ore",
                    count: 10,
                    salt: "mountain_coal"
                }

            ]

        });

    }


    /* ============================================================
       FERRO
       ============================================================ */

    function buildIronWorld() {

        return buildHorizontalProgressionWorld({

            areaId:
                "ironRegion",

            previousArea:
                "mountains",

            previousSpawn:
                "east",

            nextArea:
                "rubyRegion",

            nextSpawn:
                "west",

            bossId:
                "iron_colossus",

            pathWidth:
                175,

            jitter:
                300,

            pointCount:
                7,

            backLabel:
                "VOLTAR ÀS MONTANHAS",

            forwardLabel:
                "SEGUIR PARA O VALE DE RUBI",

            bossLockedMessage:
                "O Colosso de Ferro ainda protege a passagem.",


            nature: {

                salt:
                    "iron_nature",

                treeCount:
                    30,

                rockCount:
                    105,

                grassCount:
                    120,

                flowerCount:
                    4,

                treeVariants: [
                    "dead",
                    "pine"
                ]

            },


            enemies: [
                "mineCrawler",
                "stoneCrawler"
            ],

            enemyCount:
                20,


            resources: [

                {
                    itemId: "carvao",
                    type: "ore",
                    count: 14,
                    salt: "iron_coal"
                },

                {
                    itemId: "ferro",
                    type: "ore",
                    count: 18,
                    salt: "iron_ore"
                },

                {
                    itemId: "ouro",
                    type: "ore",
                    count: 6,
                    salt: "iron_gold"
                }

            ]

        });

    }


    /* ============================================================
       RUBI
       ============================================================ */

    function buildRubyWorld() {

        const world =
            buildHorizontalProgressionWorld({

                areaId:
                    "rubyRegion",

                previousArea:
                    "ironRegion",

                previousSpawn:
                    "east",

                nextArea:
                    "monarchMaze",

                nextSpawn:
                    "west",

                bossId:
                    "ruby_chimera",

                pathWidth:
                    180,

                jitter:
                    350,

                pointCount:
                    8,

                backLabel:
                    "VOLTAR AOS VEIOS DE FERRO",

                forwardLabel:
                    "ENTRAR NA CAVERNA DO LABIRINTO",

                bossLockedMessage:
                    "A Quimera de Rubi ainda guarda a passagem.",


                nature: {

                    salt:
                        "ruby_nature",

                    treeCount:
                        38,

                    rockCount:
                        86,

                    grassCount:
                        120,

                    flowerCount:
                        10,

                    treeVariants: [
                        "dead",
                        "ruby"
                    ],

                    flowerColors: [
                        "#be6a7b",
                        "#894b59"
                    ]

                },


                enemies: [
                    "rubyHound",
                    "mineCrawler"
                ],

                enemyCount:
                    20,


                resources: [

                    {
                        itemId: "ouro",
                        type: "ore",
                        count: 7,
                        salt: "ruby_gold"
                    },

                    {
                        itemId: "diamante",
                        type: "ore",
                        count: 12,
                        salt: "ruby_diamond"
                    },

                    {
                        itemId: "rubi",
                        type: "ore",
                        count: 16,
                        salt: "ruby_gems"
                    }

                ]

            });


        /* ========================================================
           PORTA SECRETA DO VAZIO

           SEMPRE NA BORDA SUPERIOR
           OU INFERIOR.

           NUNCA NA LATERAL.
           ======================================================== */

        const rng =
            getAreaRandom(
                "rubyRegion",
                "void_secret_door"
            );


        const onTop =
            rng() >
            0.5;


        const doorX =
            clamp(
                world.width *
                    0.55 +
                    seededRange(
                        rng,
                        -420,
                        420
                    ),
                600,
                world.width -
                    600
            );


        const secretDoor = {

            id:
                "void_secret_door",

            type:
                "secretDoor",

            x:
                doorX,

            y:
                onTop
                    ? 35
                    : world.height -
                        95,

            w:
                130,

            h:
                60,

            side:
                onTop
                    ? "top"
                    : "bottom",

            locked:
                !Boolean(
                    state.player
                        ?.miguelQuest
                        ?.secretDoorOpened
                ),

            opened:
                Boolean(
                    state.player
                        ?.miguelQuest
                        ?.secretDoorOpened
                ),

            hidden:
                true,

            destination:
                "voidDungeon",

            destinationSpawn:
                "entrance"

        };


        world.secretDoors.push(
            secretDoor
        );


        world.decorations.push({

            type:
                "ancientSeal",

            x:
                secretDoor.x +
                secretDoor.w /
                2,

            y:
                secretDoor.y +
                secretDoor.h /
                2,

            orientation:
                secretDoor.side,

            secretDoorId:
                secretDoor.id

        });


        return world;

    }


    /* ============================================================
       LABIRINTO PROCEDURAL
       ============================================================ */

    function createMazeCell(
        col,
        row
    ) {

        return {

            col,

            row,

            visited:
                false,

            walls: {

                top:
                    true,

                right:
                    true,

                bottom:
                    true,

                left:
                    true

            }

        };

    }


    function generateMazeGrid(
        cols,
        rows,
        rng
    ) {

        const cells =
            [];


        for (
            let row = 0;
            row < rows;
            row += 1
        ) {

            const rowCells =
                [];


            for (
                let col = 0;
                col < cols;
                col += 1
            ) {

                rowCells.push(
                    createMazeCell(
                        col,
                        row
                    )
                );

            }


            cells.push(
                rowCells
            );

        }


        const startRow =
            Math.floor(
                rows /
                2
            );


        const start =
            cells[
                startRow
            ][
                0
            ];


        const stack =
            [
                start
            ];


        start.visited =
            true;


        function unvisitedNeighbours(
            cell
        ) {

            const result =
                [];


            const {
                col,
                row
            } = cell;


            if (
                row >
                0 &&
                !cells[
                    row -
                        1
                ][
                    col
                ].visited
            ) {

                result.push({

                    direction:
                        "top",

                    opposite:
                        "bottom",

                    cell:
                        cells[
                            row -
                                1
                        ][
                            col
                        ]

                });

            }


            if (
                col <
                    cols -
                        1 &&
                !cells[
                    row
                ][
                    col +
                        1
                ].visited
            ) {

                result.push({

                    direction:
                        "right",

                    opposite:
                        "left",

                    cell:
                        cells[
                            row
                        ][
                            col +
                                1
                        ]

                });

            }


            if (
                row <
                    rows -
                        1 &&
                !cells[
                    row +
                        1
                ][
                    col
                ].visited
            ) {

                result.push({

                    direction:
                        "bottom",

                    opposite:
                        "top",

                    cell:
                        cells[
                            row +
                                1
                        ][
                            col
                        ]

                });

            }


            if (
                col >
                0 &&
                !cells[
                    row
                ][
                    col -
                        1
                ].visited
            ) {

                result.push({

                    direction:
                        "left",

                    opposite:
                        "right",

                    cell:
                        cells[
                            row
                        ][
                            col -
                                1
                        ]

                });

            }


            return result;

        }


        while (
            stack.length >
            0
        ) {

            const current =
                stack[
                    stack.length -
                        1
                ];


            const candidates =
                unvisitedNeighbours(
                    current
                );


            if (
                candidates.length ===
                0
            ) {

                stack.pop();

                continue;

            }


            const picked =
                candidates[
                    Math.floor(
                        rng() *
                        candidates.length
                    )
                ];


            current.walls[
                picked.direction
            ] =
                false;


            picked.cell.walls[
                picked.opposite
            ] =
                false;


            picked.cell.visited =
                true;


            stack.push(
                picked.cell
            );

        }


        /*
            Entrada.
        */
        start.walls.left =
            false;


        /*
            Saída para o altar:

            escolhe célula na
            última coluna.
        */
        const goalRow =
            seededInt(
                rng,
                1,
                rows -
                    2
            );


        const goal =
            cells[
                goalRow
            ][
                cols -
                    1
            ];


        goal.walls.right =
            false;


        return {

            cells,

            startRow,

            goalRow

        };

    }


    function addMazeWall(
        world,
        id,
        x,
        y,
        w,
        h
    ) {

        world.walls.push({

            id,

            type:
                "mazeWall",

            x,

            y,

            w,

            h,

            blocksLight:
                true

        });

    }


    function buildMazeWorld() {

        const world =
            createEmptyWorld(
                "monarchMaze"
            );


        /*
            MAIOR QUE O ANTIGO.
        */
        const cols =
            16;


        const rows =
            9;


        const cellSize =
            230;


        const wallThickness =
            28;


        const mazeX =
            180;


        const mazeY =
            260;


        const mazeWidth =
            cols *
            cellSize;


        const mazeHeight =
            rows *
            cellSize;


        /*
            Sala menor do altar.
        */
        const altarWidth =
            880;


        const altarHeight =
            620;


        world.width =
            mazeX +
            mazeWidth +
            1180;


        world.height =
            Math.max(
                2650,
                mazeY +
                    mazeHeight +
                    260
            );


        const rng =
            getAreaRandom(
                "monarchMaze",
                "maze_layout"
            );


        const maze =
            generateMazeGrid(
                cols,
                rows,
                rng
            );


        const cells =
            maze.cells;


        /*
            Converte paredes lógicas
            em paredes físicas.
        */
        for (
            let row = 0;
            row < rows;
            row += 1
        ) {

            for (
                let col = 0;
                col < cols;
                col += 1
            ) {

                const cell =
                    cells[
                        row
                    ][
                        col
                    ];


                const x =
                    mazeX +
                    col *
                    cellSize;


                const y =
                    mazeY +
                    row *
                    cellSize;


                /*
                    TOP.
                */
                if (
                    cell.walls.top
                ) {

                    addMazeWall(

                        world,

                        `maze_${col}_${row}_top`,

                        x,

                        y,

                        cellSize +
                            wallThickness,

                        wallThickness

                    );

                }


                /*
                    LEFT.
                */
                if (
                    cell.walls.left
                ) {

                    addMazeWall(

                        world,

                        `maze_${col}_${row}_left`,

                        x,

                        y,

                        wallThickness,

                        cellSize +
                            wallThickness

                    );

                }


                /*
                    Só última linha cria
                    parede inferior para
                    não duplicar.
                */
                if (
                    row ===
                        rows -
                            1 &&
                    cell.walls.bottom
                ) {

                    addMazeWall(

                        world,

                        `maze_${col}_${row}_bottom`,

                        x,

                        y +
                            cellSize,

                        cellSize +
                            wallThickness,

                        wallThickness

                    );

                }


                /*
                    Só última coluna cria
                    parede direita.
                */
                if (
                    col ===
                        cols -
                            1 &&
                    cell.walls.right
                ) {

                    addMazeWall(

                        world,

                        `maze_${col}_${row}_right`,

                        x +
                            cellSize,

                        y,

                        wallThickness,

                        cellSize +
                            wallThickness

                    );

                }

            }

        }


        /* ========================================================
           ENTRADA
           ======================================================== */

        const entranceY =
            mazeY +
            maze.startRow *
                cellSize +
            cellSize /
                2;


        setSpawn(
            world,
            "default",
            115,
            entranceY,
            "right"
        );


        setSpawn(
            world,
            "west",
            115,
            entranceY,
            "right"
        );


        addPathRect(
            world,
            {

                id:
                    "maze_entrance_floor",

                x:
                    0,

                y:
                    entranceY -
                    90,

                w:
                    mazeX +
                    70,

                h:
                    180

            }
        );


        addExit(
            world,
            {

                id:
                    "maze_to_ruby",

                x:
                    0,

                y:
                    entranceY -
                    145,

                w:
                    115,

                h:
                    290,

                destination:
                    "rubyRegion",

                destinationSpawn:
                    "east",

                label:
                    "SAIR DO LABIRINTO",

                interactionKey:
                    "E",

                unlocked:
                    true

            }
        );


        /* ========================================================
           ALTAR

           MENOR QUE O LABIRINTO.
           ======================================================== */

        const goalCenterY =
            mazeY +
            maze.goalRow *
                cellSize +
            cellSize /
                2;


        const altarX =
            mazeX +
            mazeWidth +
            170;


        const altarY =
            clamp(
                goalCenterY -
                altarHeight /
                    2,
                130,
                world.height -
                    altarHeight -
                    130
            );


        const altarRoom = {

            id:
                "monarch_altar_room",

            x:
                altarX,

            y:
                altarY,

            w:
                altarWidth,

            h:
                altarHeight

        };


        /*
            Corredor do último
            quadrado até a sala.
        */
        addPathRect(
            world,
            {

                id:
                    "maze_to_altar_corridor",

                x:
                    mazeX +
                    mazeWidth -
                    10,

                y:
                    goalCenterY -
                    78,

                w:
                    altarX -
                    (
                        mazeX +
                        mazeWidth
                    ) +
                    90,

                h:
                    156

            }
        );


        addZone(
            world,
            {

                ...altarRoom,

                type:
                    "altarRoom",

                protected:
                    true,

                naturallyLit:
                    true

            }
        );


        /*
            Paredes da arena.

            Entrada na esquerda
            permanece aberta até
            a luta começar.
        */
        addMazeWall(

            world,

            "altar_wall_top",

            altarRoom.x,

            altarRoom.y,

            altarRoom.w,

            wallThickness

        );


        addMazeWall(

            world,

            "altar_wall_bottom",

            altarRoom.x,

            altarRoom.y +
                altarRoom.h -
                wallThickness,

            altarRoom.w,

            wallThickness

        );


        addMazeWall(

            world,

            "altar_wall_right",

            altarRoom.x +
                altarRoom.w -
                wallThickness,

            altarRoom.y,

            wallThickness,

            altarRoom.h

        );


        const altarDoorCenterY =
            goalCenterY;


        const altarDoorGap =
            170;


        const upperHeight =
            Math.max(

                0,

                altarDoorCenterY -
                altarDoorGap /
                    2 -
                altarRoom.y

            );


        if (
            upperHeight >
            0
        ) {

            addMazeWall(

                world,

                "altar_wall_left_top",

                altarRoom.x,

                altarRoom.y,

                wallThickness,

                upperHeight

            );

        }


        const lowerY =
            altarDoorCenterY +
            altarDoorGap /
                2;


        const lowerHeight =
            Math.max(

                0,

                altarRoom.y +
                    altarRoom.h -
                    lowerY

            );


        if (
            lowerHeight >
            0
        ) {

            addMazeWall(

                world,

                "altar_wall_left_bottom",

                altarRoom.x,

                lowerY,

                wallThickness,

                lowerHeight

            );

        }


        world.altar = {

            id:
                "monarch_altar",

            type:
                "altar",

            x:
                altarRoom.x +
                altarRoom.w *
                    0.73,

            y:
                altarRoom.y +
                altarRoom.h /
                    2,

            interactionRadius:
                115,

            active:
                true

        };


        world.decorations.push(
            world.altar
        );


        world.interactables.push({

            id:
                "monarch_altar_interaction",

            type:
                "monarchAltar",

            x:
                world.altar.x,

            y:
                world.altar.y,

            radius:
                125,

            key:
                "E",

            label:
                "TOCAR O ALTAR"

        });


        /*
            Barreira que fecha
            quando luta começa.

            Inicialmente não sólida.
        */
        world.altarArenaBarrier = {

            id:
                "monarch_arena_seal",

            type:
                "arenaSeal",

            shape:
                "rect",

            x:
                altarRoom.x -
                8,

            y:
                altarDoorCenterY -
                altarDoorGap /
                    2,

            w:
                wallThickness +
                    16,

            h:
                altarDoorGap,

            solid:
                false,

            blocksLight:
                true,

            active:
                false

        };


        world.staticObstacles.push(
            world.altarArenaBarrier
        );


        /*
            Monarca nasce DORMANT.

            Parte 3 só o torna ativo
            depois do SIM no altar.
        */
        if (
            !isBossDefeated(
                "monarch"
            )
        ) {

            const monarch =
                addBossIfAlive(
                    world,
                    "monarch",
                    {

                        x:
                            altarRoom.x +
                            altarRoom.w *
                                0.44,

                        y:
                            altarRoom.y +
                            altarRoom.h /
                                2,

                        arenaId:
                            "monarch_altar_room"

                    }
                );


            if (
                monarch
            ) {

                monarch.state =
                    V.BOSS_STATE
                        .DORMANT;


                monarch.confirmed =
                    false;

            }

        }


        /* ========================================================
           INIMIGOS DO LABIRINTO
           ======================================================== */

        const mazeEnemySpecies = [
            "spider",
            "scorpion",
            "bat",
            "goblin"
        ];


        let enemyIndex =
            0;


        for (
            let row = 0;
            row < rows;
            row += 1
        ) {

            for (
                let col = 0;
                col < cols;
                col += 1
            ) {

                if (
                    rng() >
                    0.19
                ) {

                    continue;

                }


                /*
                    Não coloca inimigo
                    na primeira célula.
                */
                if (
                    col ===
                        0 &&
                    row ===
                        maze.startRow
                ) {

                    continue;

                }


                const x =
                    mazeX +
                    col *
                        cellSize +
                    cellSize /
                        2;


                const y =
                    mazeY +
                    row *
                        cellSize +
                    cellSize /
                        2;


                const species =
                    mazeEnemySpecies[
                        seededInt(
                            rng,
                            0,
                            mazeEnemySpecies
                                .length -
                                1
                        )
                    ];


                const enemy =
                    createEnemy(
                        species,
                        {

                            entityId:
                                `maze_enemy_${enemyIndex}`,

                            x,

                            y,

                            drops: {

                                /*
                                    Parte 3 só permitirá
                                    a Essência se missão
                                    estiver ativa.
                                */
                                essenciaSombria:
                                    1

                            }

                        }
                    );


                if (
                    enemy
                ) {

                    world.enemies.push(
                        enemy
                    );


                    enemyIndex +=
                        1;

                }

            }

        }


        world.mazeData = {

            cols,

            rows,

            cellSize,

            wallThickness,

            originX:
                mazeX,

            originY:
                mazeY,

            startRow:
                maze.startRow,

            goalRow:
                maze.goalRow,

            cells,


            altarRoom,


            explorationCellSize:
                115

        };


        /*
            ESCURIDÃO:

            Lanterna funciona SOMENTE
            na parte do Labirinto.

            Sala do altar possui
            iluminação própria.
        */
        world.flags
            .naturallyLit =
            false;


        world.flags
            .requiresLantern =
            true;


        world.flags
            .lanternDisabledZones = [
                "monarch_altar_room"
            ];


        world.flags
            .ambientLitZones = [
                "monarch_altar_room"
            ];


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       PORTÃO NORTE
       ============================================================ */

    function getNorthGateStatus(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return {

                ok:
                    false,

                state:
                    "no_player"

            };

        }


        if (
            player.gateUnlocks
                ?.north
        ) {

            return {

                ok:
                    true,

                state:
                    "already_open"

            };

        }


        if (
            getDashVersion(
                player
            ) <
            1
        ) {

            const lines = [

                "O selo do Portão Norte permanece imóvel.",

                "Há marcas no metal que lembram passos interrompidos pelo vento.",

                "Você sente que ainda não possui aquilo que o portão espera."

            ];


            const index =
                integer(
                    player
                        .gateDialogueIndex
                        ?.north,
                    0
                ) %
                lines.length;


            return {

                ok:
                    false,

                state:
                    "needs_dash",

                message:
                    lines[
                        index
                    ]

            };

        }


        const missing =
            getMissingMaterials(
                NORTH_GATE_OFFERING,
                player
            );


        if (
            Object.keys(
                missing
            ).length >
            0
        ) {

            return {

                ok:
                    false,

                state:
                    "missing_materials",

                requirements:
                    NORTH_GATE_OFFERING,

                missing

            };

        }


        return {

            ok:
                true,

            state:
                "ready",

            requirements:
                NORTH_GATE_OFFERING

        };

    }


    function unlockNorthGate(
        player =
            state.player
    ) {

        const status =
            getNorthGateStatus(
                player
            );


        if (
            !player ||
            !status.ok
        ) {

            return false;

        }


        if (
            status.state ===
            "already_open"
        ) {

            return true;

        }


        if (
            !consumeMaterials(
                NORTH_GATE_OFFERING,
                player
            )
        ) {

            return false;

        }


        player.gateUnlocks =
            player.gateUnlocks ||
            {};


        player.gateUnlocks
            .north =
            true;


        saveGame({
            silent:
                true
        });


        /*
            Atualiza gate atual
            sem precisar reiniciar.
        */
        if (
            state.world
                ?.id ===
            "village"
        ) {

            const gate =
                state.world
                    .gates
                    .find(
                        item =>
                            item.id ===
                            "north_gate"
                    );


            if (
                gate
            ) {

                gate.solid =
                    false;


                gate.locked =
                    false;

            }


            const exit =
                state.world
                    .exits
                    .find(
                        item =>
                            item.id ===
                            "village_to_gnome"
                    );


            if (
                exit
            ) {

                exit.unlocked =
                    true;

            }


            rebuildDynamicWorldObstacles(
                state.world
            );

        }


        return true;

    }


    /* ============================================================
       JARDINS DOS GNOMOS
       ============================================================ */

    function buildGnomeGardensWorld() {

        const world =
            createEmptyWorld(
                "gnomeGardens"
            );


        const route =
            generateLinearRoute(
                world,
                {

                    axis:
                        "y",

                    pointCount:
                        8,

                    pathWidth:
                        175,

                    jitter:
                        500,

                    margin:
                        180,

                    salt:
                        "gnome_route"

                }
            );


        const south =
            route[
                0
            ];


        const north =
            route[
                route.length -
                    1
            ];


        setSpawn(
            world,
            "default",
            south.x,
            south.y,
            "up"
        );


        setSpawn(
            world,
            "south",
            south.x,
            south.y,
            "up"
        );


        setSpawn(
            world,
            "north",
            north.x,
            north.y,
            "down"
        );


        addExit(
            world,
            {

                id:
                    "gnome_to_village",

                x:
                    south.x -
                    160,

                y:
                    world.height -
                    130,

                w:
                    320,

                h:
                    130,

                destination:
                    "village",

                destinationSpawn:
                    "northReturn",

                label:
                    "VOLTAR À VILA"

            }
        );


        addExit(
            world,
            {

                id:
                    "gnome_to_fairy",

                x:
                    north.x -
                    160,

                y:
                    0,

                w:
                    320,

                h:
                    130,

                destination:
                    "fairyKingdom",

                destinationSpawn:
                    "south",

                label:
                    "ENTRAR NO REINO FEÉRICO"

            }
        );


        populateNaturalEnvironment(
            world,
            {

                salt:
                    "gnome_nature",

                treeCount:
                    110,

                rockCount:
                    25,

                grassCount:
                    390,

                flowerCount:
                    78,

                mushroomCount:
                    125,

                mushroomGlowChance:
                    0.20,

                mushroomColor:
                    "#78cac4",

                treeVariants: [
                    "gnome",
                    "birch",
                    "old"
                ],

                flowerColors: [
                    "#8fcac2",
                    "#89aeca",
                    "#bfd79e",
                    "#b38fc6"
                ]

            }
        );


        spawnEnemiesNearRoute(
            world,
            {

                species: [
                    "goblin",
                    "wolf",
                    "thornling"
                ],

                count:
                    18,

                salt:
                    "gnome_enemies"

            }
        );


        /*
            Casas / detalhes de gnomos.
        */
        const rng =
            getAreaRandom(
                "gnomeGardens",
                "gnome_details"
            );


        for (
            let index = 0;
            index < 18;
            index += 1
        ) {

            const node =
                route[
                    seededInt(
                        rng,
                        1,
                        route.length -
                            2
                    )
                ];


            world.decorations.push({

                type:
                    index %
                    3 ===
                    0
                        ? "gnomeHouse"
                        : "gnomeGarden",

                x:
                    clamp(
                        node.x +
                            seededRange(
                                rng,
                                -520,
                                520
                            ),
                        130,
                        world.width -
                            130
                    ),

                y:
                    clamp(
                        node.y +
                            seededRange(
                                rng,
                                -360,
                                360
                            ),
                        130,
                        world.height -
                            130
                    ),

                variant:
                    seededInt(
                        rng,
                        0,
                        4
                    )

            });

        }


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       REINO FEÉRICO
       ============================================================ */

    function buildFairyKingdomWorld() {

        const world =
            createEmptyWorld(
                "fairyKingdom"
            );


        const route =
            generateLinearRoute(
                world,
                {

                    axis:
                        "y",

                    pointCount:
                        8,

                    pathWidth:
                        170,

                    jitter:
                        520,

                    margin:
                        180,

                    salt:
                        "fairy_route"

                }
            );


        const south =
            route[
                0
            ];


        const north =
            route[
                route.length -
                    1
            ];


        setSpawn(
            world,
            "default",
            south.x,
            south.y,
            "up"
        );


        setSpawn(
            world,
            "south",
            south.x,
            south.y,
            "up"
        );


        setSpawn(
            world,
            "north",
            north.x,
            north.y,
            "down"
        );


        addExit(
            world,
            {

                id:
                    "fairy_to_gnome",

                x:
                    south.x -
                    160,

                y:
                    world.height -
                    130,

                w:
                    320,

                h:
                    130,

                destination:
                    "gnomeGardens",

                destinationSpawn:
                    "north",

                label:
                    "VOLTAR AOS JARDINS"

            }
        );


        addExit(
            world,
            {

                id:
                    "fairy_to_frontier",

                x:
                    north.x -
                    160,

                y:
                    0,

                w:
                    320,

                h:
                    130,

                destination:
                    "celestialFrontier",

                destinationSpawn:
                    "south",

                label:
                    "SEGUIR ALÉM DO REINO FEÉRICO"

            }
        );


        populateNaturalEnvironment(
            world,
            {

                salt:
                    "fairy_nature",

                treeCount:
                    126,

                rockCount:
                    18,

                grassCount:
                    410,

                flowerCount:
                    132,

                mushroomCount:
                    38,

                mushroomGlowChance:
                    0.48,

                mushroomColor:
                    "#ef9bd1",

                treeVariants: [
                    "fairy",
                    "glow"
                ],

                flowerColors: [
                    "#ef9ed1",
                    "#d6a7e3",
                    "#baabe7",
                    "#f1c1df"
                ]

            }
        );


        spawnEnemiesNearRoute(
            world,
            {

                species: [
                    "thornling",
                    "bat"
                ],

                count:
                    16,

                salt:
                    "fairy_enemies"

            }
        );


        /*
            Partículas mágicas
            permanentes do cenário.
        */
        const rng =
            getAreaRandom(
                "fairyKingdom",
                "fairy_ambient"
            );


        for (
            let index = 0;
            index < 85;
            index += 1
        ) {

            world.ambient.push({

                type:
                    "fairySpark",

                x:
                    rng() *
                    world.width,

                y:
                    rng() *
                    world.height,

                phase:
                    rng() *
                    Math.PI *
                    2,

                size:
                    seededRange(
                        rng,
                        1,
                        3.4
                    )

            });

        }


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       FRONTEIRA CELESTIAL

       Começa ainda com resquícios
       ROSA do Reino Feérico.

       Depois passa para VERDE normal.

       O boss da Escada está AQUI.
       ============================================================ */

    function buildCelestialFrontierWorld() {

        const world =
            createEmptyWorld(
                "celestialFrontier"
            );


        const route =
            generateLinearRoute(
                world,
                {

                    axis:
                        "y",

                    pointCount:
                        8,

                    pathWidth:
                        185,

                    jitter:
                        430,

                    margin:
                        180,

                    salt:
                        "frontier_route"

                }
            );


        const south =
            route[
                0
            ];


        const north =
            route[
                route.length -
                    1
            ];


        setSpawn(
            world,
            "default",
            south.x,
            south.y,
            "up"
        );


        setSpawn(
            world,
            "south",
            south.x,
            south.y,
            "up"
        );


        setSpawn(
            world,
            "north",
            north.x,
            north.y,
            "down"
        );


        /*
            Gradiente ambiental.

            Parte 4 vai renderizar.
        */
        world.environmentBlend = {

            axis:
                "y",

            /*
                Sul:
                vindo do Reino Feérico.
            */
            fromColor:
                "#865f82",

            /*
                Norte:
                terra verde normal.
            */
            toColor:
                "#4d6b48",

            start:
                world.height,

            end:
                world.height *
                0.46

        };


        addExit(
            world,
            {

                id:
                    "frontier_to_fairy",

                x:
                    south.x -
                    160,

                y:
                    world.height -
                    130,

                w:
                    320,

                h:
                    130,

                destination:
                    "fairyKingdom",

                destinationSpawn:
                    "north",

                label:
                    "VOLTAR AO REINO FEÉRICO"

            }
        );


        const bossNode =
            route[
                route.length -
                    2
            ];


        const guardian =
            addBossIfAlive(
                world,
                "path_guardian",
                {

                    x:
                        bossNode.x,

                    y:
                        bossNode.y

                }
            );


        if (
            guardian
        ) {

            createBossPassageBarrier(

                world,

                "path_guardian",

                bossNode.x,

                bossNode.y -
                    165,

                "horizontal"

            );

        }


        addExit(
            world,
            {

                id:
                    "frontier_to_stair",

                x:
                    north.x -
                    170,

                y:
                    0,

                w:
                    340,

                h:
                    130,

                destination:
                    "celestialStair",

                destinationSpawn:
                    "south",

                label:
                    "SUBIR A ESCADA CELESTIAL",

                unlocked:
                    isBossDefeated(
                        "path_guardian"
                    ),

                bossId:
                    "path_guardian",

                lockedMessage:
                    "O Guardião da Escada ainda impede a ascensão."

            }
        );


        populateNaturalEnvironment(
            world,
            {

                salt:
                    "frontier_nature",

                treeCount:
                    105,

                rockCount:
                    31,

                grassCount:
                    350,

                flowerCount:
                    62,

                mushroomCount:
                    12,

                treeVariants: [
                    "fairy",
                    "oak",
                    "birch"
                ],

                flowerColors: [
                    "#e4a5cf",
                    "#b6d38e",
                    "#d5c77c",
                    "#a8b9df"
                ]

            }
        );


        spawnEnemiesNearRoute(
            world,
            {

                species: [
                    "wolf",
                    "thornling",
                    "bat"
                ],

                count:
                    17,

                salt:
                    "frontier_enemies"

            }
        );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       ESCADA CELESTIAL

       SEM BOSS AQUI.

       O boss já foi enfrentado
       na Fronteira.

       Barreiras laterais impedem
       andar para fora da escada.
       ============================================================ */

    function buildCelestialStairWorld() {

        const world =
            createEmptyWorld(
                "celestialStair"
            );


        const pathX =
            590;


        const pathWidth =
            420;


        addPathRect(
            world,
            {

                id:
                    "celestial_stair_main",

                x:
                    pathX,

                y:
                    0,

                w:
                    pathWidth,

                h:
                    world.height,

                style:
                    "celestialStair"

            }
        );


        setSpawn(
            world,
            "default",
            800,
            3440,
            "up"
        );


        setSpawn(
            world,
            "south",
            800,
            3440,
            "up"
        );


        setSpawn(
            world,
            "north",
            800,
            160,
            "down"
        );


        /*
            Barreiras laterais.

            Não é possível "voar"
            andando para fora.
        */
        world.walls.push(

            {

                id:
                    "celestial_left_boundary",

                type:
                    "skyBoundary",

                x:
                    0,

                y:
                    0,

                w:
                    pathX,

                h:
                    world.height,

                blocksLight:
                    false

            },


            {

                id:
                    "celestial_right_boundary",

                type:
                    "skyBoundary",

                x:
                    pathX +
                    pathWidth,

                y:
                    0,

                w:
                    world.width -
                    (
                        pathX +
                        pathWidth
                    ),

                h:
                    world.height,

                blocksLight:
                    false

            }

        );


        addExit(
            world,
            {

                id:
                    "stair_to_frontier",

                x:
                    620,

                y:
                    world.height -
                    120,

                w:
                    360,

                h:
                    120,

                destination:
                    "celestialFrontier",

                destinationSpawn:
                    "north",

                label:
                    "DESCER PARA A FRONTEIRA"

            }
        );


        addExit(
            world,
            {

                id:
                    "stair_to_sky_one",

                x:
                    620,

                y:
                    0,

                w:
                    360,

                h:
                    120,

                destination:
                    "skyOne",

                destinationSpawn:
                    "south",

                label:
                    "ALCANÇAR O CÉU"

            }
        );


        /*
            Degraus.
        */
        for (
            let index = 0;
            index < 48;
            index += 1
        ) {

            world.decorations.push({

                type:
                    "celestialStep",

                x:
                    800,

                y:
                    80 +
                    index *
                    72,

                w:
                    380,

                index

            });

        }


        /*
            Nuvens ao lado.
        */
        const rng =
            getAreaRandom(
                "celestialStair",
                "clouds"
            );


        for (
            let index = 0;
            index < 72;
            index += 1
        ) {

            world.ambient.push({

                type:
                    "cloud",

                x:
                    rng() <
                    0.5
                        ? seededRange(
                            rng,
                            80,
                            510
                        )
                        : seededRange(
                            rng,
                            1090,
                            1520
                        ),

                y:
                    rng() *
                    world.height,

                scale:
                    seededRange(
                        rng,
                        0.6,
                        1.6
                    ),

                drift:
                    seededRange(
                        rng,
                        4,
                        14
                    ),

                phase:
                    rng() *
                    Math.PI *
                    2

            });

        }


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       CÉU I

       SOMENTE FUNDAÇÃO ATUAL.

       CÉU II/III NÃO serão
       desenvolvidos profundamente
       nesta versão.
       ============================================================ */

    function buildSkyOneWorld() {

        const world =
            createEmptyWorld(
                "skyOne"
            );


        const route =
            generateLinearRoute(
                world,
                {

                    axis:
                        "y",

                    pointCount:
                        6,

                    pathWidth:
                        300,

                    jitter:
                        270,

                    margin:
                        190,

                    salt:
                        "sky_one_route"

                }
            );


        const south =
            route[
                0
            ];


        const north =
            route[
                route.length -
                    1
            ];


        setSpawn(
            world,
            "default",
            south.x,
            south.y,
            "up"
        );


        setSpawn(
            world,
            "south",
            south.x,
            south.y,
            "up"
        );


        addExit(
            world,
            {

                id:
                    "sky_one_to_stair",

                x:
                    south.x -
                    180,

                y:
                    world.height -
                    125,

                w:
                    360,

                h:
                    125,

                destination:
                    "celestialStair",

                destinationSpawn:
                    "north",

                label:
                    "DESCER A ESCADA CELESTIAL"

            }
        );


        /*
            Próxima área fica selada
            enquanto não for hora de
            desenvolver o restante.
        */
        addExit(
            world,
            {

                id:
                    "sky_one_future",

                x:
                    north.x -
                    180,

                y:
                    0,

                w:
                    360,

                h:
                    125,

                destination:
                    null,

                label:
                    "SEGUIR ALÉM",

                unlocked:
                    false,

                lockedMessage:
                    "A Quietude encobre o caminho adiante."

            }
        );


        const rng =
            getAreaRandom(
                "skyOne",
                "sky_clouds"
            );


        for (
            let index = 0;
            index < 95;
            index += 1
        ) {

            world.ambient.push({

                type:
                    "cloud",

                x:
                    rng() *
                    world.width,

                y:
                    rng() *
                    world.height,

                scale:
                    seededRange(
                        rng,
                        0.5,
                        1.8
                    ),

                drift:
                    seededRange(
                        rng,
                        3,
                        12
                    ),

                phase:
                    rng() *
                    Math.PI *
                    2

            });

        }


        /*
            Limites externos.
        */
        world.staticObstacles.push(

            {

                id:
                    "sky_left_limit",

                type:
                    "skyBoundary",

                shape:
                    "rect",

                x:
                    0,

                y:
                    0,

                w:
                    75,

                h:
                    world.height,

                solid:
                    true,

                blocksLight:
                    false

            },


            {

                id:
                    "sky_right_limit",

                type:
                    "skyBoundary",

                shape:
                    "rect",

                x:
                    world.width -
                    75,

                y:
                    0,

                w:
                    75,

                h:
                    world.height,

                solid:
                    true,

                blocksLight:
                    false

            }

        );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    function buildFutureSkyWorld(
        areaId
    ) {

        const world =
            createEmptyWorld(
                areaId
            );


        setSpawn(
            world,
            "default",
            world.width /
                2,
            world.height -
                240,
            "up"
        );


        world.decorations.push({

            type:
                "futureSeal",

            x:
                world.width /
                2,

            y:
                world.height /
                2,

            message:
                "Esta região ainda não faz parte do caminho atual."

        });


        return world;

    }


    /* ============================================================
       DUNGEON DO VAZIO
       ============================================================ */

    function buildVoidDungeonWorld() {

        const world =
            createEmptyWorld(
                "voidDungeon"
            );


        world.flags
            .minimapSignal =
            false;


        world.flags
            .naturallyLit =
            false;


        world.flags
            .voidDarkness =
            true;


        /*
            Entrada.
        */
        setSpawn(
            world,
            "default",
            260,
            1225,
            "right"
        );


        setSpawn(
            world,
            "entrance",
            260,
            1225,
            "right"
        );


        /*
            Corredor principal.
        */
        addPathRect(
            world,
            {

                id:
                    "void_main_corridor",

                x:
                    0,

                y:
                    1070,

                w:
                    1850,

                h:
                    310,

                style:
                    "voidDungeon"

            }
        );


        /*
            Corredores secundários.
        */
        addPathRect(
            world,
            {

                id:
                    "void_branch_top",

                x:
                    850,

                y:
                    480,

                w:
                    260,

                h:
                    760,

                style:
                    "voidDungeon"

            }
        );


        addPathRect(
            world,
            {

                id:
                    "void_branch_bottom",

                x:
                    1350,

                y:
                    1180,

                w:
                    270,

                h:
                    820,

                style:
                    "voidDungeon"

            }
        );


        /*
            Arena do Vaelkor.
        */
        const arena = {

            id:
                "vaelkor_arena",

            x:
                1940,

            y:
                430,

            w:
                1370,

            h:
                1580

        };


        addZone(
            world,
            {

                ...arena,

                type:
                    "vaelkorArena",

                protected:
                    true,

                naturallyLit:
                    true

            }
        );


        world.flags
            .ambientLitZones = [
                "vaelkor_arena"
            ];


        /*
            Paredes externas da arena.
        */
        world.walls.push(

            {
                id: "void_arena_top",
                x: arena.x,
                y: arena.y,
                w: arena.w,
                h: 34,
                blocksLight: true
            },

            {
                id: "void_arena_bottom",
                x: arena.x,
                y: arena.y + arena.h - 34,
                w: arena.w,
                h: 34,
                blocksLight: true
            },

            {
                id: "void_arena_right",
                x: arena.x + arena.w - 34,
                y: arena.y,
                w: 34,
                h: arena.h,
                blocksLight: true
            }

        );


        /*
            Entrada esquerda dividida.
        */
        world.walls.push(

            {
                id: "void_arena_left_top",
                x: arena.x,
                y: arena.y,
                w: 34,
                h: 575,
                blocksLight: true
            },

            {
                id: "void_arena_left_bottom",
                x: arena.x,
                y: arena.y + 1005,
                w: 34,
                h: 575,
                blocksLight: true
            }

        );


        world.vaelkorArenaBarrier = {

            id:
                "vaelkor_arena_barrier",

            type:
                "arenaSeal",

            shape:
                "rect",

            x:
                arena.x -
                8,

            y:
                arena.y +
                575,

            w:
                50,

            h:
                430,

            solid:
                false,

            blocksLight:
                true,

            active:
                false

        };


        world.staticObstacles.push(
            world.vaelkorArenaBarrier
        );


        /*
            Vaelkor.
        */
        if (
            !isBossDefeated(
                "vaelkor"
            )
        ) {

            addBossIfAlive(
                world,
                "vaelkor",
                {

                    x:
                        arena.x +
                        arena.w /
                        2,

                    y:
                        arena.y +
                        arena.h /
                        2,

                    arenaId:
                        "vaelkor_arena"

                }
            );

        }


        /*
            Inimigos iniciais da Dungeon.
        */
        const dungeonEnemies = [

            [
                "voidSpider",
                720,
                1180
            ],

            [
                "voidGoblin",
                980,
                760
            ],

            [
                "voidStalker",
                1450,
                1570
            ],

            [
                "voidSpider",
                1580,
                1190
            ]

        ];


        dungeonEnemies
            .forEach(
                (
                    [
                        species,
                        x,
                        y
                    ],
                    index
                ) => {

                    if (
                        state.player
                            ?.miguelQuest
                            ?.clearedDungeonEnemyIds
                            ?.includes(
                                `void_enemy_${index}`
                            )
                    ) {

                        return;

                    }


                    const enemy =
                        createEnemy(
                            species,
                            {

                                entityId:
                                    `void_enemy_${index}`,

                                questEnemyId:
                                    `void_enemy_${index}`,

                                x,

                                y

                            }
                        );


                    if (
                        enemy
                    ) {

                        world.enemies.push(
                            enemy
                        );

                    }

                }
            );


        /*
            Pilares do Vazio.
        */
        world.decorations.push(

            {
                type: "voidPillar",
                x: 2190,
                y: 650,
                h: 135
            },

            {
                type: "voidPillar",
                x: 3060,
                y: 650,
                h: 135
            },

            {
                type: "voidPillar",
                x: 2190,
                y: 1780,
                h: 135
            },

            {
                type: "voidPillar",
                x: 3060,
                y: 1780,
                h: 135
            }

        );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;

    }


    /* ============================================================
       STATUS DE ACESSO AO LABIRINTO
       ============================================================ */

    function getMazeEntranceStatus(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return {

                ok:
                    false,

                reason:
                    "Jogador ausente."

            };

        }


        if (
            !player.lanternOwned
        ) {

            return {

                ok:
                    false,

                state:
                    "needs_lantern",

                reason:
                    "O caminho à frente é escuro demais. Não podemos seguir."

            };

        }


        return {

            ok:
                true,

            state:
                "ready"

        };

    }


    /* ============================================================
       ALTAR DO MONARCA
       ============================================================ */

    function getMonarchAltarStatus(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return {

                ok:
                    false,

                state:
                    "no_player"

            };

        }


        if (
            player.abilities
                ?.dashV1 ||
            player.monarch
                ?.rewardClaimed
        ) {

            return {

                ok:
                    true,

                state:
                    "complete"

            };

        }


        if (
            !player.lanternOwned
        ) {

            return {

                ok:
                    false,

                state:
                    "needs_lantern",

                message:
                    "O caminho que leva ao altar exige a Lanterna Antiga."

            };

        }


        /*
            Se já derrotou o Monarca,
            só falta receber o poder.
        */
        if (
            isBossDefeated(
                "monarch",
                player
            ) ||
            player.monarch
                ?.defeated
        ) {

            const missingAfterBattle =
                getMissingMaterials(
                    DASH_V1_OFFERING,
                    player
                );


            if (
                Object.keys(
                    missingAfterBattle
                ).length >
                0
            ) {

                return {

                    ok:
                        false,

                    state:
                        "defeated_missing_materials",

                    missing:
                        missingAfterBattle,

                    requirements:
                        DASH_V1_OFFERING

                };

            }


            return {

                ok:
                    true,

                state:
                    "claim_reward",

                requirements:
                    DASH_V1_OFFERING

            };

        }


        const missing =
            getMissingMaterials(
                DASH_V1_OFFERING,
                player
            );


        if (
            Object.keys(
                missing
            ).length >
            0
        ) {

            return {

                ok:
                    false,

                state:
                    "missing_materials",

                missing,

                requirements:
                    DASH_V1_OFFERING

            };

        }


        return {

            ok:
                true,

            state:
                "ready_to_awaken",

            requirements:
                DASH_V1_OFFERING

        };

    }


    function unlockDashV1FromAltar(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return false;

        }


        if (
            player.abilities
                ?.dashV1
        ) {

            return true;

        }


        if (
            !(
                isBossDefeated(
                    "monarch",
                    player
                ) ||
                player.monarch
                    ?.defeated
            )
        ) {

            return false;

        }


        if (
            !hasMaterials(
                DASH_V1_OFFERING,
                player
            )
        ) {

            return false;

        }


        /*
            SÓ AGORA os materiais somem.
        */
        if (
            !consumeMaterials(
                DASH_V1_OFFERING,
                player
            )
        ) {

            return false;

        }


        player.abilities
            .dashV1 =
            true;


        player.monarch =
            player.monarch ||
            {};


        player.monarch
            .defeated =
            true;


        player.monarch
            .rewardClaimed =
            true;


        player.monarch
            .stagger =
            0;


        player.monarch
            .stunned =
            false;


        saveGame({
            silent:
                true
        });


        return true;

    }


    /* ============================================================
       LANTERNA

       NO LABIRINTO:
       usa Lanterna.

       NA SALA DO ALTAR:
       iluminação ambiente normal.
       ============================================================ */

    function getLanternLightingState(
        x =
            state.player
                ?.x,
        y =
            state.player
                ?.y,
        world =
            state.world
    ) {

        if (
            !world
        ) {

            return {

                darkness:
                    false,

                lantern:
                    false,

                ambient:
                    true

            };

        }


        if (
            world.id !==
            "monarchMaze"
        ) {

            return {

                darkness:
                    world.id ===
                    "voidDungeon",

                lantern:
                    false,

                ambient:
                    world.id !==
                    "voidDungeon"

            };

        }


        const zone =
            getZoneAtPoint(
                world,
                x,
                y
            );


        if (
            zone
                ?.id ===
            "monarch_altar_room"
        ) {

            return {

                darkness:
                    false,

                lantern:
                    false,

                ambient:
                    true,

                zone:
                    "monarch_altar_room"

            };

        }


        return {

            darkness:
                true,

            lantern:
                Boolean(
                    state.player
                        ?.lanternOwned
                ),

            ambient:
                false,

            zone:
                "labyrinth"

        };

    }


    /* ============================================================
       MINIMAPA
       ============================================================ */

    function isMinimapSignalAvailable(
        areaId =
            state.area,
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return false;

        }


        /*
            Moldura existe,
            mas antes da compra:
            SEM SINAL.
        */
        if (
            !player.minimapOwned
        ) {

            return false;

        }


        /*
            Dungeon do Vazio:
            SEMPRE sem sinal.
        */
        if (
            areaId ===
            "voidDungeon"
        ) {

            return false;

        }


        /*
            Interior não usa
            mapa de região.
        */
        if (
            state.houseMode
        ) {

            return false;

        }


        const meta =
            REGION_META[
                areaId
            ];


        return (
            meta
                ?.minimapSignal !==
            false
        );

    }


    function ensureAreaExploration(
        areaId
    ) {

        state.sessionExploration =
            state.sessionExploration ||
            Object.create(
                null
            );


        if (
            !state
                .sessionExploration[
                areaId
            ]
        ) {

            state
                .sessionExploration[
                areaId
            ] = {

                cells:
                    Object.create(
                        null
                    ),

                visitedPoints:
                    []

            };

        }


        return state
            .sessionExploration[
                areaId
            ];

    }


    function markMapExploredAt(
        areaId,
        x,
        y,
        radius =
            190
    ) {

        if (
            !areaId
        ) {

            return;

        }


        const exploration =
            ensureAreaExploration(
                areaId
            );


        const cellSize =
            areaId ===
            "monarchMaze"
                ? 115
                : 180;


        const minCol =
            Math.floor(
                (
                    x -
                    radius
                ) /
                cellSize
            );


        const maxCol =
            Math.floor(
                (
                    x +
                    radius
                ) /
                cellSize
            );


        const minRow =
            Math.floor(
                (
                    y -
                    radius
                ) /
                cellSize
            );


        const maxRow =
            Math.floor(
                (
                    y +
                    radius
                ) /
                cellSize
            );


        for (
            let row = minRow;
            row <= maxRow;
            row += 1
        ) {

            for (
                let col = minCol;
                col <= maxCol;
                col += 1
            ) {

                const centerX =
                    col *
                    cellSize +
                    cellSize /
                    2;


                const centerY =
                    row *
                    cellSize +
                    cellSize /
                    2;


                if (
                    distance(
                        x,
                        y,
                        centerX,
                        centerY
                    ) <=
                    radius +
                        cellSize
                ) {

                    exploration.cells[
                        `${col},${row}`
                    ] =
                        true;

                }

            }

        }

    }


    function isMapCellExplored(
        areaId,
        col,
        row
    ) {

        return Boolean(
            state
                .sessionExploration
                ?.[areaId]
                ?.cells
                ?.[
                    `${col},${row}`
                ]
        );

    }


    /* ============================================================
       WORLD CACHE

       MESMA SESSÃO:
       mesmo mapa.

       NOVA SESSÃO:
       mapa novo.

       VILA:
       sempre fixa.
       ============================================================ */

    function ensureWorldCache() {

        if (
            !state.sessionWorldCache
        ) {

            state.sessionWorldCache =
                Object.create(
                    null
                );

        }


        return state
            .sessionWorldCache;

    }


    /* ============================================================
       BUILD WORLD
       ============================================================ */

    function buildWorldFresh(
        areaId
    ) {

        switch (
            areaId
        ) {

            case "village":
                return buildVillageWorld();


            case "road":
                return buildRoadWorld();


            case "forest":
                return buildForestWorld();


            case "grove":
                return buildGroveWorld();


            case "mountains":
                return buildMountainsWorld();


            case "ironRegion":
                return buildIronWorld();


            case "rubyRegion":
                return buildRubyWorld();


            case "monarchMaze":
                return buildMazeWorld();


            case "gnomeGardens":
                return buildGnomeGardensWorld();


            case "fairyKingdom":
                return buildFairyKingdomWorld();


            case "celestialFrontier":
                return buildCelestialFrontierWorld();


            case "celestialStair":
                return buildCelestialStairWorld();


            case "skyOne":
                return buildSkyOneWorld();


            case "skyTwo":
                return buildFutureSkyWorld(
                    "skyTwo"
                );


            case "skyThree":
                return buildFutureSkyWorld(
                    "skyThree"
                );


            case "voidDungeon":
                return buildVoidDungeonWorld();


            default:

                console.warn(
                    `VEYRA — região desconhecida: ${areaId}`
                );


                return buildVillageWorld();

        }

    }


    function buildWorld(
        areaId,
        options = {}
    ) {

        /*
            Vila nunca depende de
            geração procedural.
        */
        if (
            areaId ===
            "village"
        ) {

            return buildVillageWorld();

        }


        const meta =
            REGION_META[
                areaId
            ];


        if (
            !meta
        ) {

            return buildVillageWorld();

        }


        /*
            Regiões não-procedurais
            podem ser reconstruídas.
        */
        if (
            !meta.procedural
        ) {

            return buildWorldFresh(
                areaId
            );

        }


        if (
            options.fresh
        ) {

            return buildWorldFresh(
                areaId
            );

        }


        const cache =
            ensureWorldCache();


        if (
            cache[
                areaId
            ]
        ) {

            return cache[
                areaId
            ];

        }


        const world =
            buildWorldFresh(
                areaId
            );


        cache[
            areaId
        ] =
            world;


        return world;

    }


    /* ============================================================
       LOAD WORLD

       Parte 5 adicionará a transição
       visual em torno desta função.
       ============================================================ */

    function loadWorld(
        areaId,
        spawnId =
            "default"
    ) {

        const world =
            buildWorld(
                areaId
            );


        if (
            !world
        ) {

            return false;

        }


        const previousArea =
            state.area;


        state.area =
            areaId;


        state.world =
            world;


        state.houseMode =
            false;


        state.currentHouse =
            null;


        state.currentZoneId =
            null;


        const player =
            state.player;


        if (
            player
        ) {

            const spawn =
                world.spawnPoints[
                    spawnId
                ] ||
                world.spawnPoints
                    .default;


            if (
                spawn
            ) {

                rebuildDynamicWorldObstacles(
                    world
                );


                const safe =
                    findSafePosition(

                        spawn.x,

                        spawn.y,

                        player.radius,

                        world

                    );


                player.x =
                    safe.x;


                player.y =
                    safe.y;


                player.facing =
                    spawn.facing ||
                    "down";

            }


            /*
                Região entra no mapa
                SOMENTE quando chegou.
            */
            if (
                areaId !==
                "voidDungeon"
            ) {

                registerAreaDiscovered(
                    areaId,
                    player
                );

            }


            if (
                previousArea &&
                previousArea !==
                areaId &&
                areaId !==
                "voidDungeon"
            ) {

                registerMapConnection(

                    previousArea,

                    areaId,

                    player

                );

            }


            markMapExploredAt(

                areaId,

                player.x,

                player.y

            );

        }


        return true;

    }


    /* ============================================================
       ENTRAR NA CASA
       ============================================================ */

    function enterHouse(
        houseId
    ) {

        const player =
            state.player;


        if (
            !player ||
            !HOUSE_INTERIORS[
                houseId
            ]
        ) {

            return false;

        }


        /*
            Guarda posição externa.
        */
        state.houseReturn = {

            area:
                state.area,

            x:
                player.x,

            y:
                player.y,

            facing:
                player.facing

        };


        const world =
            createHouseWorld(
                houseId
            );


        if (
            !world
        ) {

            return false;

        }


        state.houseMode =
            true;


        state.currentHouse =
            houseId;


        state.world =
            world;


        const spawn =
            world
                .spawnPoints
                .default;


        player.x =
            spawn.x;


        player.y =
            spawn.y;


        player.facing =
            spawn.facing;


        return true;

    }


    /* ============================================================
       SAIR DA CASA
       ============================================================ */

    function exitHouse() {

        const player =
            state.player;


        if (
            !player ||
            !state.houseMode
        ) {

            return false;

        }


        const previousHouse =
            state.currentHouse;


        const returnData =
            state.houseReturn;


        state.houseMode =
            false;


        state.currentHouse =
            null;


        /*
            Novo jogo / respawn podem
            não possuir houseReturn.
        */
        const world =
            buildVillageWorld();


        state.area =
            "village";


        state.world =
            world;


        rebuildDynamicWorldObstacles(
            world
        );


        if (
            returnData &&
            returnData.area ===
                "village"
        ) {

            const safe =
                findSafePosition(

                    returnData.x,

                    returnData.y,

                    player.radius,

                    world

                );


            player.x =
                safe.x;


            player.y =
                safe.y;


            player.facing =
                returnData.facing ||
                "down";

        } else {

            const building =
                findBuilding(
                    previousHouse ||
                    "home",
                    world
                );


            const door =
                getBuildingDoorGeometry(
                    building
                );


            const fallback =
                world.spawnPoints
                    .homeReturn;


            player.x =
                door
                    ? door.centerX
                    : fallback.x;


            player.y =
                door
                    ? door.centerY +
                        72
                    : fallback.y;


            player.facing =
                "down";

        }


        state.houseReturn =
            null;


        registerAreaDiscovered(
            "village",
            player
        );


        return true;

    }


    /* ============================================================
       SPAWN / RESPAWN DENTRO DA CASA
       ============================================================ */

    function loadPlayerHome(
        useRespawnPoint =
            false
    ) {

        const player =
            state.player;


        if (
            !player
        ) {

            return false;

        }


        const world =
            createHouseWorld(
                "home"
            );


        if (
            !world
        ) {

            return false;

        }


        state.area =
            "village";


        state.houseMode =
            true;


        state.currentHouse =
            "home";


        state.houseReturn =
            null;


        state.world =
            world;


        const spawn =
            useRespawnPoint

                ? (
                    world.spawnPoints
                        .respawn ||
                    world.spawnPoints
                        .default
                )

                : world.spawnPoints
                    .default;


        player.x =
            spawn.x;


        player.y =
            spawn.y;


        player.facing =
            spawn.facing ||
            "down";


        player.dead =
            false;


        return true;

    }


    /* ============================================================
       CAMA / DESCANSO

       Parte 3 controla interação
       e atualização temporal.
       ============================================================ */

    function canRestAtBed(
        player =
            state.player
    ) {

        if (
            !player ||
            !state.houseMode ||
            state.currentHouse !==
                "home"
        ) {

            return false;

        }


        return true;

    }


    function applyBedRest(
        player =
            state.player
    ) {

        if (
            !canRestAtBed(
                player
            )
        ) {

            return false;

        }


        /*
            Reduz Exaustão.
        */
        player.exhaustion =
            Math.max(

                0,

                player.exhaustion -
                GAME_CONFIG
                    .restExhaustionReduction

            );


        /*
            Energia cheia.
        */
        player.energy =
            player.maxEnergy *
            GAME_CONFIG
                .restEnergyRestoreRatio;


        player.energy =
            clamp(
                player.energy,
                0,
                player.maxEnergy
            );


        /*
            Cura parcial.
        */
        player.hp =
            clamp(

                player.hp +

                player.maxHp *
                    GAME_CONFIG
                        .restHpRestoreRatio,

                0,

                player.maxHp

            );


        saveGame({
            silent:
                true
        });


        return true;

    }


    /* ============================================================
       CHAVE OBSCURA
       ============================================================ */

    function getDarkKeyObject(
        world =
            state.world
    ) {

        return (
            world
                ?.interactables
                ?.find(
                    item =>
                        item.id ===
                        "dark_key_pickup"
                ) ||
            null
        );

    }


    function placeDarkKeyInFrontier(
        world
    ) {

        if (
            !world ||
            world.id !==
                "celestialFrontier"
        ) {

            return;

        }


        const quest =
            state.player
                ?.miguelQuest;


        if (
            !quest ||
            !quest.missionAccepted ||
            quest.keyCollected
        ) {

            return;

        }


        const rng =
            getAreaRandom(
                "celestialFrontier",
                "dark_key"
            );


        const key = {

            id:
                "dark_key_pickup",

            type:
                "darkKey",

            x:
                clamp(
                    world.width *
                        0.24 +
                        seededRange(
                            rng,
                            -180,
                            180
                        ),
                    250,
                    world.width -
                        250
                ),

            y:
                clamp(
                    world.height *
                        0.42 +
                        seededRange(
                            rng,
                            -180,
                            180
                        ),
                    300,
                    world.height -
                        300
                ),

            radius:
                44,

            holdSeconds:
                GAME_CONFIG
                    .darkKeyHarvestSeconds,

            collected:
                false

        };


        world.interactables.push(
            key
        );


        world.decorations.push({

            type:
                "darkKeyPedestal",

            x:
                key.x,

            y:
                key.y,

            glow:
                true

        });

    }


    /* ============================================================
       REPARA CHAVE APÓS CONSTRUIR FRONTIER
       ============================================================ */

    const originalBuildCelestialFrontierWorld =
        buildCelestialFrontierWorld;


    buildCelestialFrontierWorld =
        function patchedFrontierBuilder() {

            const world =
                originalBuildCelestialFrontierWorld();


            placeDarkKeyInFrontier(
                world
            );


            rebuildDynamicWorldObstacles(
                world
            );


            return world;

        };


    /* ============================================================
       PORTA DO VAZIO
       ============================================================ */

    function getVoidSecretDoor(
        world =
            state.world
    ) {

        return (
            world
                ?.secretDoors
                ?.find(
                    door =>
                        door.id ===
                        "void_secret_door"
                ) ||
            null
        );

    }


    function canOpenVoidSecretDoor(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return {

                ok:
                    false,

                reason:
                    "Jogador ausente."

            };

        }


        const quest =
            player.miguelQuest;


        if (
            quest
                ?.secretDoorOpened
        ) {

            return {

                ok:
                    true,

                alreadyOpen:
                    true

            };

        }


        if (
            !quest
                ?.missionAccepted
        ) {

            return {

                ok:
                    false,

                reason:
                    "Uma força estranha mantém esta passagem selada."

            };

        }


        if (
            !quest.keyCollected ||
            getItemCount(
                "chaveObscura",
                player
            ) <=
                0
        ) {

            return {

                ok:
                    false,

                reason:
                    "A Chave Obscura parece ser necessária para romper este selo."

            };

        }


        return {

            ok:
                true,

            alreadyOpen:
                false

        };

    }


    function openVoidSecretDoor(
        player =
            state.player
    ) {

        const validation =
            canOpenVoidSecretDoor(
                player
            );


        if (
            !player ||
            !validation.ok
        ) {

            return false;

        }


        if (
            validation.alreadyOpen
        ) {

            return true;

        }


        if (
            !removeItem(
                "chaveObscura",
                1,
                player
            )
        ) {

            return false;

        }


        player.miguelQuest
            .keyConsumed =
            true;


        player.miguelQuest
            .secretDoorOpened =
            true;


        player.miguelQuest
            .secretDoorDiscovered =
            true;


        const door =
            getVoidSecretDoor();


        if (
            door
        ) {

            door.opened =
                true;


            door.locked =
                false;

        }


        saveGame({
            silent:
                true
        });


        return true;

    }


    /* ============================================================
       PEGAR CHAVE OBSCURA

       A Parte 3 executará o HOLD E.
       ============================================================ */

    function canCollectDarkKey(
        player =
            state.player
    ) {

        if (
            !player
        ) {

            return {

                ok:
                    false,

                reason:
                    "Jogador ausente."

            };

        }


        const quest =
            player.miguelQuest;


        if (
            quest.keyCollected
        ) {

            return {

                ok:
                    false,

                reason:
                    "A Chave Obscura já foi obtida."

            };

        }


        if (
            !quest.missionAccepted
        ) {

            return {

                ok:
                    false,

                reason:
                    "A energia desta chave não reage a você."

            };

        }


        const current =
            getItemCount(
                "essenciaSombria",
                player
            );


        const required =
            VOID_MISSION_CONFIG
                .shadowEssenceRequired;


        if (
            current <
            required
        ) {

            return {

                ok:
                    false,

                reason:
                    `A chave reage às Essências Sombrias. ${current}/${required}.`,

                current,

                required

            };

        }


        return {

            ok:
                true,

            current,

            required

        };

    }


    function collectDarkKey(
        player =
            state.player
    ) {

        const validation =
            canCollectDarkKey(
                player
            );


        if (
            !player ||
            !validation.ok
        ) {

            return false;

        }


        /*
            15 Essências são usadas
            para despertar a chave.
        */
        if (
            !removeItem(

                "essenciaSombria",

                VOID_MISSION_CONFIG
                    .shadowEssenceRequired,

                player

            )
        ) {

            return false;

        }


        if (
            !addItem(
                "chaveObscura",
                1,
                player
            )
        ) {

            /*
                Rollback de segurança.
            */
            addItem(

                "essenciaSombria",

                VOID_MISSION_CONFIG
                    .shadowEssenceRequired,

                player

            );


            return false;

        }


        player.miguelQuest
            .keyCollected =
            true;


        player.miguelQuest
            .keyLocationDiscovered =
            true;


        saveGame({
            silent:
                true
        });


        return true;

    }


    /* ============================================================
       DROP DE INIMIGO

       Só calcula.

       Parte 3 cria apresentação
       visual no chão.
       ============================================================ */

    function rollEnemyDrops(
        enemy
    ) {

        if (
            !enemy
        ) {

            return [];

        }


        const species =
            ENEMY_SPECIES[
                enemy.speciesId
            ];


        const result =
            [];


        for (
            const entry of
            safeArray(
                species
                    ?.dropTable
            )
        ) {

            if (
                Math.random() >
                finiteNumber(
                    entry.chance,
                    0
                )
            ) {

                continue;

            }


            result.push({

                itemId:
                    entry.itemId,

                amount:
                    randomInt(
                        entry.min ||
                            1,
                        entry.max ||
                            1
                    )

            });

        }


        /*
            Drop especial configurado
            pela região.
        */
        if (
            enemy.drops
        ) {

            for (
                const [
                    itemId,
                    amount
                ] of
                Object.entries(
                    enemy.drops
                )
            ) {

                /*
                    Essência Sombria
                    SÓ depois da missão
                    de Miguel estar ativa.
                */
                if (
                    itemId ===
                    "essenciaSombria"
                ) {

                    if (
                        !state.player
                            ?.miguelQuest
                            ?.missionAccepted
                    ) {

                        continue;

                    }


                    const current =
                        getItemCount(
                            "essenciaSombria"
                        );


                    if (
                        current >=
                        VOID_MISSION_CONFIG
                            .shadowEssenceRequired
                    ) {

                        continue;

                    }

                }


                result.push({

                    itemId,

                    amount:
                        Math.max(
                            1,
                            integer(
                                amount,
                                1
                            )
                        )

                });

            }

        }


        return result;

    }


    /* ============================================================
       DEPTH / PROFUNDIDADE

       Usado na Parte 4.

       Player pode passar atrás
       de árvore, pilar, fonte etc.
       ============================================================ */

    function getEntityDepthY(
        entity
    ) {

        if (
            !entity
        ) {

            return 0;

        }


        if (
            Number.isFinite(
                entity.depthY
            )
        ) {

            return entity
                .depthY;

        }


        if (
            Number.isFinite(
                entity.y
            )
        ) {

            return (
                entity.y +
                finiteNumber(
                    entity.h,
                    0
                )
            );

        }


        return 0;

    }


    function compareDepth(
        a,
        b
    ) {

        return (
            getEntityDepthY(
                a
            ) -
            getEntityDepthY(
                b
            )
        );

    }


    /* ============================================================
       VALIDAÇÃO DA PARTE 2
       ============================================================ */

    function validatePart2Data() {

        const errors =
            [];


        /*
            Vila precisa existir.
        */
        const village =
            buildVillageWorld();


        if (
            !village
        ) {

            errors.push(
                "Vila do Crepúsculo não foi criada."
            );

        }


        /*
            Fonte.
        */
        const fountain =
            village
                ?.decorations
                ?.find(
                    item =>
                        item.id ===
                        "village_fountain"
                );


        if (
            !fountain
        ) {

            errors.push(
                "Fonte central ausente."
            );

        }


        /*
            Quatro caminhos principais.
        */
        const villageMainPaths = [

            "village_path_north",

            "village_path_south",

            "village_path_west",

            "village_path_east"

        ];


        for (
            const pathId of
            villageMainPaths
        ) {

            if (
                !village.paths
                    .some(
                        path =>
                            path.id ===
                            pathId
                    )
            ) {

                errors.push(
                    `Caminho principal ausente: ${pathId}`
                );

            }

        }


        /*
            Casa e cama.
        */
        const home =
            createHouseWorld(
                "home"
            );


        if (
            !home
                ?.interactables
                ?.some(
                    item =>
                        item.type ===
                        "bedRest"
                )
        ) {

            errors.push(
                "Interação de descanso da cama ausente."
            );

        }


        /*
            Labirinto maior.
        */
        const maze =
            buildMazeWorld();


        if (
            maze.width <
            5000
        ) {

            errors.push(
                "Labirinto deveria ser maior."
            );

        }


        if (
            !maze.altar
        ) {

            errors.push(
                "Altar do Monarca ausente."
            );

        }


        const altarRoom =
            maze.mazeData
                ?.altarRoom;


        if (
            !altarRoom ||
            altarRoom.w >
                1000 ||
            altarRoom.h >
                750
        ) {

            errors.push(
                "Sala do altar está grande demais."
            );

        }


        /*
            Luz bloqueada.
        */
        if (
            !maze.walls
                .every(
                    wall =>
                        wall.blocksLight !==
                        false
                )
        ) {

            errors.push(
                "Paredes do Labirinto devem bloquear luz."
            );

        }


        /*
            Caminho 2.
        */
        const gnome =
            buildGnomeGardensWorld();


        if (
            gnome.mushrooms.length <
            70
        ) {

            errors.push(
                "Jardins dos Gnomos precisam de mais cogumelos."
            );

        }


        const stair =
            buildCelestialStairWorld();


        if (
            stair.walls.length <
            2
        ) {

            errors.push(
                "Escada Celestial precisa de barreiras laterais."
            );

        }


        /*
            Void sempre sem sinal.
        */
        const voidWorld =
            buildVoidDungeonWorld();


        if (
            voidWorld.flags
                .minimapSignal !==
            false
        ) {

            errors.push(
                "Dungeon do Vazio deve permanecer SEM SINAL."
            );

        }


        if (
            errors.length >
            0
        ) {

            console.error(
                "VEYRA V32 — ERROS NA PARTE 2:",
                errors
            );


            return {

                ok:
                    false,

                errors

            };

        }


        console.log(
            "VEYRA V32 — Parte 2 validada."
        );


        return {

            ok:
                true,

            errors:
                []

        };

    }


    /* ============================================================
       EXPORTAÇÃO
       ============================================================ */

    Object.assign(
        V,
        {

            REGION_META,

            BIOME_STYLE,

            PATH_STYLE_CONFIG,

            HOUSE_INTERIORS,

            VILLAGE_BUILDING_LAYOUT,

            VILLAGE_NPC_LAYOUT,


            getBiomeStyle,
            getPathStyle,


            createEmptyWorld,

            setSpawn,

            addZone,

            isPointInsideZone,

            getZoneAtPoint,


            addPathRect,

            addPathBetweenPoints,

            generateLinearRoute,


            addExit,


            createBuilding,

            findBuilding,

            getBuildingDoorGeometry,

            attachDoorToBuilding,


            createTree,

            getTreeTrunkObstacle,

            createRock,

            createGrassPatch,

            createFlowerPatch,

            createMushroom,


            createNPC,

            createEnemy,

            createBoss,

            addBossIfAlive,


            createResourceNode,


            isPointNearPath,

            isPointInsideProtectedZone,

            populateNaturalEnvironment,

            spawnEnemiesNearRoute,

            addResourceCluster,


            createBossPassageBarrier,


            rebuildDynamicWorldObstacles,

            collidesWithObstacleAt,

            isPositionBlocked,

            findSafePosition,


            createHouseWorld,

            populateInteriorDecorations,


            addVillageFountain,

            buildVillageWorld,


            buildRoadWorld,

            buildForestWorld,

            buildGroveWorld,

            buildMountainsWorld,

            buildIronWorld,

            buildRubyWorld,

            buildMazeWorld,


            getNorthGateStatus,

            unlockNorthGate,


            buildGnomeGardensWorld,

            buildFairyKingdomWorld,

            buildCelestialFrontierWorld,

            buildCelestialStairWorld,

            buildSkyOneWorld,

            buildVoidDungeonWorld,


            getMazeEntranceStatus,

            getMonarchAltarStatus,

            unlockDashV1FromAltar,

            getLanternLightingState,


            isMinimapSignalAvailable,

            ensureAreaExploration,

            markMapExploredAt,

            isMapCellExplored,


            buildWorld,

            buildWorldFresh,

            loadWorld,


            enterHouse,

            exitHouse,

            loadPlayerHome,


            canRestAtBed,

            applyBedRest,


            getDarkKeyObject,

            placeDarkKeyInFrontier,

            getVoidSecretDoor,

            canOpenVoidSecretDoor,

            openVoidSecretDoor,

            canCollectDarkKey,

            collectDarkKey,


            rollEnemyDrops,


            getEntityDepthY,

            compareDepth,


            validatePart2Data

        }
    );


    V.__part2Loaded =
        true;


    V.__part2Validation =
        validatePart2Data();

})();
