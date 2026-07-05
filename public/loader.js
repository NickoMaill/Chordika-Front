(function () {
    let loaderDiv = null;
    let progressBar = null;
    let progressText = null;
    let progress = 0;
    let interval;

    function createLoader() {
        // Création du conteneur principal
        loaderDiv = document.createElement("div");
        loaderDiv.id = "loading-screen";
        loaderDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.9);
            font-size: 18px;
            font-family: Arial, sans-serif;
            z-index: 9999;
            transition: opacity 0.5s ease-out;
        `;

        // Texte de chargement
        progressText = document.createElement("p");
        progressText.innerText = "Ressources en cours de chargement...";
        loaderDiv.appendChild(progressText);

        // Barre de progression
        progressBar = document.createElement("div");
        progressBar.style.cssText = `
            width: 80%;
            height: 10px;
            background: #ddd;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 10px;
        `;

        const barFill = document.createElement("div");
        barFill.id = "bar-fill";
        barFill.style.cssText = `
            width: 0%;
            height: 100%;
            background: #007bff;
            transition: width 0.2s ease-in-out;
        `;
        progressBar.appendChild(barFill);
        loaderDiv.appendChild(progressBar);

        document.body.appendChild(loaderDiv);
    }

    function updateProgress(value) {
        progress = value;
        const bar = document.getElementById("bar-fill");
        if (bar) {
            document.getElementById("bar-fill").style.width = `${progress}%`;
        }
    }

    function removeLoader() {
        clearInterval(interval);
        updateProgress(100);
        setTimeout(() => {
            if (loaderDiv) {
                loaderDiv.style.opacity = "0";
                setTimeout(() => loaderDiv.remove(), 500);
            }
        }, 300);
    }

    function simulateProgress() {
        interval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 5; // Avance progressivement jusqu'à 90%
                updateProgress(progress);
            } else {
                clearInterval(interval);
                simulateSlowProgress();
            }
        }, 500);
    }

    function simulateSlowProgress() {
        interval = setInterval(() => {
            progress += Math.random() * 0.2; // Avance progressivement jusqu'à 90%
            updateProgress(progress);
        }, 900);
    }

    // Démarrer la barre de progression après 200ms
    setTimeout(() => {
        if (document.readyState !== "complete") {
            createLoader();
            simulateProgress();
        }
    }, 500);

    // Une fois tout chargé, terminer la progression
    window.addEventListener("load", () => {
        updateProgress(100);
        removeLoader();
    });
})();