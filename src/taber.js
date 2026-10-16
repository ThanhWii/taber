class Taber {
    // Taber private properties
    static #cleanRegex = /[^a-zA-Z0-9]/g;
    #container;
    #tabs;
    #panels;
    #currentTab;
    #opt;
    #originalHTML;
    #paramKey;

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
        this.#panels = this.#getPanels();
        if (this.#tabs.length !== this.#panels.length) return;
        this.#opt = {
            remember: false,
            onChange: null,
            activeClassName: 'taber--active',
            ...options
        }
        this.#paramKey = selector.replace(Taber.#cleanRegex, '');
        this.#originalHTML = this.#container.innerHTML;
        this.#init();
    }

    // Private methods
    #init() {
        const params = new URLSearchParams(location.search);
        const tabSelector = params.get(this.#paramKey);
        const tabToActive = (this.#opt.remember && tabSelector && this.#tabs.find((tab) => tab.getAttribute('href').replace(Taber.#cleanRegex, '') === tabSelector)) || this.#tabs[0];
        this.#currentTab = tabToActive;
        this.#activateTab(tabToActive, false, false);
        this.#tabs.forEach((tab) => {
            tab.onclick = (event) => {
                event.preventDefault();
                this.#tryActivateTab(tab);
            }
        });
    }

    #activateTab(tab, triggerOnChange = true, updateURL = this.#opt.remember) {
        this.#tabs.forEach((tab) => {
            tab.closest('li').classList.remove(this.#opt.activeClassName);
        });
        tab.closest('li').classList.add(this.#opt.activeClassName);
        this.#panels.forEach((panel) => {
            panel.hidden = true;
        });
        const panelActive = document.querySelector(tab.getAttribute('href'));
        panelActive.hidden = false;

        if (updateURL) {
            const params = new URLSearchParams(location.search);
            const paramsValue = tab.getAttribute('href').replace(Taber.#cleanRegex, '');
            params.set(this.#paramKey, paramsValue);
            history.replaceState(null, null, `?${params}${location.hash}`);
        }

        if (triggerOnChange && typeof this.#opt.onChange === 'function') {
            this.#opt.onChange({ tab, panel: panelActive });
        }
    }

    #tryActivateTab(tab) {
        if (tab !== this.#currentTab) {
            this.#currentTab = tab;
            this.#activateTab(tab);
        }
    }

    #getPanels() {
        return this.#tabs.map((tab) => {
            const panel = document.querySelector(tab.getAttribute('href'));
            if (!panel) {
                console.error(`Taber: No panels found for selector '${tab.getAttribute('href')}'.`);
            }
            return panel;
        }).filter(Boolean);
    }

    // API
    switch(input) {
        if (!this.#container) return;
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
        this.#tryActivateTab(tabToActive);
    }

    destroy() {
        if (!this.#container) return;
        this.#container.innerHTML = this.#originalHTML;
        this.#panels.forEach((panel) => {
            panel.hidden = false;
        });
        this.#container = null;
        this.#tabs = null;
        this.#panels = null;
        this.#currentTab = null;
    }
}