import { actionType as T } from '../reducer';
import GraphLoadSave from './graph-load-save';
import GraphComponent from './graph-component';
import GraphCanvas from './graph-canvas';

const CoreGraph = (ParentClass) => class extends GraphLoadSave(GraphComponent(GraphCanvas(ParentClass))) {
    setNodeEvent() { return this; }

    getById(x) {
        return this.cy.getElementById(x);
    }

    set({ cy, dispatcher, superState }) {
        if (dispatcher) this.dispatcher = dispatcher;
        if (superState) this.superState = superState;
        if (cy) this.cy = cy;
    }

    selectDeselectEventHandler() {
        const els = this.cy.$(':selected');
        if (els.length === 0) { return this.dispatcher({ type: T.ELE_UNSELECTED }); }
        let type;
        if (els.every((e) => e.isNode())) type = 'NODE';
        else if (els.every((e) => e.isEdge())) type = 'EDGE';
        else type = 'MIX';
        const ids = els.map((e) => e.data('id'));
        return this.dispatcher({
            type: T.ELE_SELECTED,
            payload: {
                ids, type,
            },
        });
    }

    regesterEvents() {
        this.cy.on('select unselect', () => this.selectDeselectEventHandler());
        this.cy.on('zoom', (e) => this.dispatcher({ type: T.SET_ZOOM, payload: Math.round(100 * e.target.zoom()) }));
        this.cy.on('add remove move style data free', '[type]', this.saveLocalStorage.bind(this));
    }
};

export default CoreGraph;
