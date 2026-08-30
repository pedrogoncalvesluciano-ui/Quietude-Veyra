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
