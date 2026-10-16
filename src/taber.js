class Taber {
    // Taber private properties
    #container; // The ul
    #tabs;  // The a
    #panels;    // The div
    #opt;   // Options
    #originalHTML;

    // Taber constructor
    constructor(selector, options = {}) {
        this.#container = document.querySelector(selector);
        if (!this.#container) {
            console.error(`Taber: No containers found for selector '${selector}'.`);
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
        this.#opt = {
            remember: false,
            ...options
        }
        this.#originalHTML = this.#container.innerHTML;
        this.#init();
    }

    // Private methods
    #init() {
        const tabToActive = (this.#opt.remember && location.hash && this.#tabs.find((tab) => tab.getAttribute('href') === location.hash)) || this.#tabs[0];
        this.#activateTab(tabToActive);
        this.#tabs.forEach((tab) => {
            tab.onclick = (event) => {
                this.#handleTabClick(event, tab);
            }
        });
    }

    #handleTabClick(event, tab) {
        event.preventDefault();
        this.#activateTab(tab);
    }

    #activateTab(tab) {
        this.#tabs.forEach((tab) => {
            tab.closest('li').classList.remove('taber--active');
        });
        tab.closest('li').classList.add('taber--active');
        this.#panels.forEach((panel) => {
            panel.hidden = true;
        });
        const panelActive = document.querySelector(tab.getAttribute('href'));
        panelActive.hidden = false;

        history.replaceState(null, null, tab.getAttribute('href'));
    }

    // API
    switch(input) {
        let tabToActive = null;
        if (typeof input === 'string') {
            tabToActive = this.#tabs.find((tab) => {
                return tab.getAttribute('href') === input;
            });
            if (!tabToActive) {
                console.error(`Taber: No tabs found for selector '${input}'.`);
                return;
            }
        }
        else if (this.#tabs.includes(input)) {
            tabToActive = input
        }
        if (!tabToActive) {
            console.error(`Taber: Invalid input '${input}'.`);
            return;
        }
        this.#activateTab(tabToActive);
    }

    destroy() {
        this.#container.innerHTML = this.#originalHTML;
        this.#panels.forEach((panel) => {
            panel.hidden = false;
        });
        this.#container = null;
        this.#tabs = null;
        this.#panels = null;
    }
}