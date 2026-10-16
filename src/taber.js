class Taber {
    // Taber properties
    #container; // The ul
    #tabs;  // The a
    #panels;    // The div

    // Taber constructor
    constructor(selector) {
        this.#container = document.querySelector(selector);
        if (!this.#container) {
            console.error(`Taber: No container found for selector '${selector}'.`);
            return;
        }
        this.#tabs = Array.from(this.#container.querySelectorAll("li a"));
        if (!this.#tabs.length) {
            console.error(`Taber: No tabs found inside the container.`);
            return;
        }
        this.#panels = this.#tabs.map((tab) => {
            const panel = document.querySelector(tab.getAttribute('href'));
            if (!panel) {
                console.error(`Taber: No panels found for selector '${tab.getAttribute('href')}'.`);
            }
            return panel;
        }).filter(Boolean);
        if (this.#tabs.length !== this.#panels.length) return;
        this.#init();
    }

    // Private static methods


    // Private methods
    #init() {
        const tabActive = this.#tabs[0];
        tabActive.closest('li').classList.add('taber--active');
        this.#panels.forEach((panel) => {
            panel.hidden = true;
        });
        this.#tabs.forEach((tab) => {
            tab.onclick = (event) => {
                this.#handleTabClick(event, tab);
            }
        })
        const panelActive = this.#panels[0];
        panelActive.hidden = false;
    }

    #handleTabClick(event, tab) {
        event.preventDefault();
        this.#tabs.forEach((tab) => {
            tab.closest('li').classList.remove('taber--active');
        });
        tab.closest('li').classList.add('taber--active');
        this.#panels.forEach((panel) => {
            panel.hidden = true;
        });
        const panelActive = document.querySelector(tab.getAttribute('href'));
        panelActive.hidden = false;
    }
}