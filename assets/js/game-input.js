(() => {
    "use strict";

    /*
        ============================================================
        VEYRA — INPUT DE GAMEPLAY INDEPENDENTE
        ============================================================

        Este arquivo controla o clique
        do ataque básico sem depender
        dos listeners da Parte 5.
    */


    const UI_SELECTOR = [
        "button",
        "input",
        "textarea",
        "select",
        "a",
        ".player-hud",
        ".minimap-shell",
        ".combat-hints",
        ".game-hotbar",
        ".money-hud",
        ".location-ribbon",
        ".overlay-panel"
    ].join(", ");


    function getVeyra() {
        return (
            window.VEYRA ||
            null
        );
    }


    function isGameplayReady(
        V
    ) {
        const state =
            V?.state;

        const gameScreen =
            document.getElementById(
                "gameScreen"
            );


        return Boolean(
            V &&
            state &&
            state.running &&
            state.player &&
            !state.player.dead &&
            gameScreen
                ?.classList
                .contains(
                    "active"
                ) &&
            typeof V
                .handleGameplayAttackInput ===
                "function"
        );
    }


    function updatePointerFromEvent(
        V,
        event
    ) {
        const canvas =
            document.getElementById(
                "gameCanvas"
            );

        const state =
            V?.state;


        if (
            !canvas ||
            !state?.pointer
        ) {
            return false;
        }


        const rect =
            canvas
                .getBoundingClientRect();


        if (
            rect.width <= 0 ||
            rect.height <= 0
        ) {
            return false;
        }


        /*
            Só aceita clique realmente
            dentro do canvas.
        */
        const insideCanvas =
            (
                event.clientX >=
                    rect.left &&
                event.clientX <=
                    rect.right &&
                event.clientY >=
                    rect.top &&
                event.clientY <=
                    rect.bottom
            );


        if (
            !insideCanvas
        ) {
            return false;
        }


        /*
            Usa a mesma escala lógica
            do renderer do jogo.
        */
        const logicalWidth =
            Number(
                V.renderRuntime
                    ?.width
            ) ||
            canvas.width ||
            rect.width;


        const logicalHeight =
            Number(
                V.renderRuntime
                    ?.height
            ) ||
            canvas.height ||
            rect.height;


        const screenX =
            (
                event.clientX -
                rect.left
            ) *
            (
                logicalWidth /
                rect.width
            );


        const screenY =
            (
                event.clientY -
                rect.top
            ) *
            (
                logicalHeight /
                rect.height
            );


        let world = {
            x:
                screenX,

            y:
                screenY
        };


        if (
            typeof V
                .screenToWorld ===
                "function"
        ) {
            const converted =
                V.screenToWorld(
                    screenX,
                    screenY
                );


            if (
                converted
            ) {
                world =
                    converted;
            }
        }


        /*
            Atualiza o ponteiro oficial
            do jogo.
        */
        state.pointer.x =
            screenX;

        state.pointer.y =
            screenY;

        state.pointer.screenX =
            screenX;

        state.pointer.screenY =
            screenY;

        state.pointer.worldX =
            world.x;

        state.pointer.worldY =
            world.y;

        state.pointer.hasMoved =
            true;


        /*
            Compatibilidade com o
            sistema antigo.
        */
        if (
            state.mouse
        ) {
            state.mouse.x =
                screenX;

            state.mouse.y =
                screenY;

            state.mouse.worldX =
                world.x;

            state.mouse.worldY =
                world.y;
        }


        return true;
    }


    function attack(
        event
    ) {
        /*
            Somente botão esquerdo.
        */
        if (
            event.button !==
            0
        ) {
            return;
        }


        const target =
            event.target;


        /*
            Não atira quando clicar
            em HUD, menu ou painel.
        */
        if (
            target instanceof
                Element &&
            target.closest(
                UI_SELECTOR
            )
        ) {
            return;
        }


        const V =
            getVeyra();


        if (
            !isGameplayReady(
                V
            )
        ) {
            return;
        }


        if (
            !updatePointerFromEvent(
                V,
                event
            )
        ) {
            return;
        }


        try {

            /*
                Atualiza a direção
                imediatamente para onde
                o jogador clicou.
            */
            const aim =
                typeof V
                    .getPlayerAimVector ===
                    "function"

                    ? V
                        .getPlayerAimVector()

                    : null;


            if (
                aim &&
                typeof V
                    .updatePlayerFacingFromVector ===
                    "function"
            ) {
                V
                    .updatePlayerFacingFromVector(
                        aim
                    );
            }


            /*
                Chama DIRETAMENTE
                o ataque existente.
            */
            V
                .handleGameplayAttackInput();

        } catch (
            error
        ) {

            console.error(
                "VEYRA INPUT — erro no ataque básico:",
                error
            );

        }
    }


    /*
        pointerdown é separado
        completamente do sistema
        antigo de mousedown.
    */
    window.addEventListener(
        "pointerdown",
        attack,
        true
    );


    /*
        API externa para debug futuro.
    */
    window.VEYRA_INPUT = {
        attack
    };


    console.log(
        "VEYRA INPUT — ataque externo carregado."
    );

})();
