const getSet = () => {
    if (!window.localStorage.getItem('allGraphs')) {
        window.localStorage.setItem('allGraphs', window.btoa(JSON.stringify([])));
    }
    return new Set(JSON.parse(window.atob(window.localStorage.getItem('allGraphs'))));
};

const localStorageManager = {

    allgs: getSet(),

    saveAllgs() {
        window.localStorage.setItem('allGraphs', window.btoa(JSON.stringify(Array.from(this.allgs))));
    },

    addEmptyIfNot() {
        if (!window.localStorage.getItem('allGraphs')) {
            window.localStorage.setItem('allGraphs', window.btoa(JSON.stringify([])));
        }
    },

    get(id) {
        if (window.localStorage.getItem(id) === null) return null;
        return JSON.parse(window.atob(window.localStorage.getItem(id)));
    },
    save(id, graphContent) {
        this.addGraph(id);
        const serializedJson = JSON.stringify(graphContent);
        window.localStorage.setItem(id, window.btoa(serializedJson));
    },
    remove(id) {
        if (this.allgs.delete(id)) this.saveAllgs();
        localStorage.removeItem(id);
    },
    addGraph(id) {
        if (this.allgs.has(id)) return;
        this.allgs.add(id);
        this.saveAllgs();
    },
    getAllGraphs() {
        return JSON.parse(window.atob(window.localStorage.getItem('allGraphs')));
    },
};
export default localStorageManager;
