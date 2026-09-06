(() => {
    "use strict";

    /*
        ============================================================
        VEYRA — CONTROLES DE INTERFACE INDEPENDENTES
        ============================================================

        Este arquivo existe para que:

        - menu principal;
        - como jogar;
        - créditos;
        - seleção;
        - começar jornada;

        não dependam do sistema de eventos
        gigante do script.js.

        Mesmo que combate, projétil ou outra
        parte dê problema, a interface continua
        com seus próprios controles.
    */


    const SCREEN_IDS = {
        menu:
            "menuScreen",

        how:
            "howScreen",

        credits:
            "creditsScreen",

        character:
            "characterScreen",

        game:
            "gameScreen"
    };


    function byId(
        id
    ) {
        return document.getElementById(
            id
        );
    }


    /*
        Troca de tela de emergência.

        Primeiro tenta usar o sistema
        oficial do jogo.

        Se ele não estiver disponível,
        este arquivo consegue trocar
        as telas sozinho.
    */
    function showScreenSafe(
        target
    ) {
        const V =
            window.VEYRA;

        if (
            V &&
            typeof V.showScreen ===
                "function"
        ) {
            try {
                V.showScreen(
                    target
                );

                return true;

            } catch (
                error
            ) {
                console.error(
                    "VEYRA UI — showScreen oficial falhou:",
                    error
                );
            }
        }


        const targetId =
            SCREEN_IDS[
                target
            ];

        if (
            !targetId
        ) {
            return false;
        }


        const screens =
            document.querySelectorAll(
                ".screen"
            );

        for (
            const screen of screens
        ) {
            const active =
                screen.id ===
                targetId;

            screen.classList.toggle(
                "active",
                active
            );

            screen.style.pointerEvents =
                active
                    ? "auto"
                    : "none";

            screen.style.zIndex =
                active
                    ? (
                        target ===
                            "game"
                            ? "20"
                            : "100"
                    )
                    : "0";

            screen.setAttribute(
                "aria-hidden",
                active
                    ? "false"
                    : "true"
            );
        }


        return true;
    }


    function unlockScreenControls() {
        const activeScreen =
            document.querySelector(
                ".screen.active"
            );

        if (
            !activeScreen
        ) {
            return;
        }


        activeScreen.style
            .pointerEvents =
            "auto";


        const controls =
            activeScreen
                .querySelectorAll(
                    "button, input, select, textarea, [role='button']"
                );

        for (
            const control of controls
        ) {
            control.style
                .pointerEvents =
                "auto";

            control.style
                .touchAction =
                "manipulation";

            if (
                control.tagName ===
                "BUTTON"
            ) {
                control.style
                    .cursor =
                    control.disabled
                        ? "default"
                        : "pointer";

                control.style
                    .position =
                    "relative";

                control.style
                    .zIndex =
                    "50";
            }
        }
    }


    function newGame() {
        const V =
            window.VEYRA;


        /*
            Limpa a seleção anterior,
            caso o núcleo esteja carregado.
        */
        if (
            V?.UI_RUNTIME
        ) {
            V.UI_RUNTIME
                .selectedCharacter =
                null;

            V.UI_RUNTIME
                .characterSelectionLocked =
                false;
        }


        const nameInput =
            byId(
                "playerName"
            );

        if (
            nameInput
        ) {
            nameInput.value =
                "";
        }


        /*
            Se o renderer de cards estiver
            funcionando, recria os cards.
        */
        if (
            typeof V
                ?.renderCharacterCards ===
            "function"
        ) {
            try {
                V.renderCharacterCards();

            } catch (
                error
            ) {
                console.error(
                    "VEYRA UI — erro ao criar personagens:",
                    error
                );
            }
        }


        showScreenSafe(
            "character"
        );


        requestAnimationFrame(
            () => {
                unlockScreenControls();

                nameInput
                    ?.focus();
            }
        );
    }


    function continueGame() {
        const V =
            window.VEYRA;

        if (
            typeof V
                ?.continueGame ===
            "function"
        ) {
            try {
                V.continueGame();

                return;

            } catch (
                error
            ) {
                console.error(
                    "VEYRA UI — continuar falhou:",
                    error
                );
            }
        }


        console.warn(
            "VEYRA UI — sistema de save ainda não carregado."
        );
    }


    function startGame() {
        const V =
            window.VEYRA;


        if (
            typeof V
                ?.startNewGameFromSelection ===
            "function"
        ) {
            try {
                const result =
                    V
                        .startNewGameFromSelection();

                if (
                    result !==
                    false
                ) {
                    return;
                }

            } catch (
                error
            ) {
                console.error(
                    "VEYRA UI — começar jornada falhou:",
                    error
                );
            }
        }


        /*
            Se chegar aqui, significa que
            o núcleo principal não terminou
            de carregar.

            Não fingimos iniciar o jogo.
        */
        console.error(
            "VEYRA UI — o núcleo do jogo não está disponível para iniciar a jornada."
        );
    }


    /*
        ============================================================
        EVENTO CENTRAL

        Um único listener controla os
        botões principais.

        CAPTURE = true.

        Assim ele recebe o clique antes
        dos listeners problemáticos que
        possam existir no script.js.
        ============================================================
    */
    function handleInterfaceClick(
        event
    ) {
        const button =
            event.target
                ?.closest?.(
                    "button"
                );

        if (
            !button
        ) {
            return;
        }


        const id =
            button.id;


        const handled =
            [
                "newGameBtn",
                "continueBtn",
                "howToBtn",
                "creditsBtn",
                "closeHowBtn",
                "closeCreditsBtn",
                "backMenuBtn",
                "startGameBtn"
            ].includes(
                id
            );


        if (
            !handled
        ) {
            return;
        }


        /*
            A partir daqui este arquivo
            assume o controle do botão.

            O código antigo não executa
            duas vezes.
        */
        event.preventDefault();

        event.stopImmediatePropagation();


        switch (
            id
        ) {
            case "newGameBtn":
                newGame();
                break;


            case "continueBtn":
                continueGame();
                break;


            case "howToBtn":
                showScreenSafe(
                    "how"
                );
                break;


            case "creditsBtn":
                showScreenSafe(
                    "credits"
                );
                break;


            case "closeHowBtn":
            case "closeCreditsBtn":
            case "backMenuBtn":
                showScreenSafe(
                    "menu"
                );
                break;


            case "startGameBtn":
                startGame();
                break;
        }


        requestAnimationFrame(
            unlockScreenControls
        );
    }


    function initialize() {
        unlockScreenControls();


        document.addEventListener(
            "click",
            handleInterfaceClick,
            true
        );


        /*
            Se alguma outra parte alterar
            a tela, mantém os controles
            clicáveis.
        */
        window.addEventListener(
            "pageshow",
            unlockScreenControls
        );


        console.log(
            "VEYRA UI — controles independentes carregados."
        );
    }


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once:
                    true
            }
        );

    } else {
        initialize();
    }


    /*
        Pequena API para manutenção futura.
    */
    window.VEYRA_UI = {
        showScreen:
            showScreenSafe,

        unlock:
            unlockScreenControls,

        newGame,

        continueGame,

        startGame
    };

})();
