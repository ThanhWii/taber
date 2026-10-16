class Taber {
    // Taber properties
    #container; // The ul
    #tabs;  // The a
    #panels;    // The div

    // Taber constructor
    constructor(selector) {
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
        this.#init();
    }

    // Private static methods


    // Private methods
    #init() {
        this.#activeTab(this.#tabs[0]);
        this.#tabs.forEach((tab) => {
            tab.onclick = (event) => {
                this.#handleTabClick(event, tab);
            }
        });
    }

    #handleTabClick(event, tab) {
        event.preventDefault();
        this.#activeTab(tab);
    }

    #activeTab(tab) {
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
        this.#activeTab(tabToActive);
    }
}