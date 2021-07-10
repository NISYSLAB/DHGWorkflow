import { actionType as T } from '../reducer';
import GraphLoadSave from './graph-load-save';
import GraphCanvas from './graph-canvas';
import GraphUndoRedo from './graph-undo-redo';
import BendingDistanceWeight from './calculations/bending-dist-weight';

const CoreGraph = (ParentClass) => class CG extends
    GraphLoadSave(GraphCanvas(GraphUndoRedo(ParentClass))) {
    constructor(id, cy, dispatcher, superState, projectDetails, nodeValidator, edgeValidator) {
        super(id, cy, dispatcher, superState, projectDetails, nodeValidator, edgeValidator);
        if (dispatcher) this.dispatcher = dispatcher;
        if (superState) this.superState = superState;
        if (cy) this.cy = cy;
        this.id = id;
        this.projectDetails = projectDetails;
        this.cy.emit('graph-modified');
        this.bendNode = this.cy.add(
            { group: 'nodes', data: { type: 'bend' }, classes: ['hidden'] },
        );
        this.regesterEvents();
        this.cy.emit('graph-modified');
    }

    setProjectDetail(projectDetails) {
        this.projectDetails = projectDetails;
        this.cy.emit('graph-modified');
    }

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
        if (super.regesterEvents) super.regesterEvents();
        this.cy.on('select unselect', () => this.selectDeselectEventHandler());
        this.cy.on('grab', 'node[type = "ordin"]', (e) => {
            e.target.forEach((node) => {
                node.scratch('position', { ...node.position() });
            });
        });
        this.cy.on('dragfree', 'node[type = "ordin"]', (e) => {
            e.target.forEach((node) => {
                this.addPositionChange(node.id(), node.scratch('position'), { ...node.position() });
            });
        });
        this.cy.on('nodeediting.resizestart', (e, type, node) => {
            node.scratch('height', node.data('style').height);
            node.scratch('width', node.data('style').width);
            node.scratch('position', { ...node.position() });
        });
        this.cy.on('nodeediting.resizeend', (e, type, node) => {
            this.addDimensionChange(
                node.id(),
                { height: node.scratch('height'), width: node.scratch('width') },
                node.scratch('position'),
                { height: node.data('style').height, width: node.data('style').width },
                { ...node.position() },
            );
        });

        this.cy.on('hide-bend remove', () => {
            this.bendNode.removeListener('drag grab dragfree'); this.bendNode.addClass('hidden');
        });

        this.cy.on('grabon', (evt) => (evt.target[0].data('type') !== 'bend' ? this.cy.emit('hide-bend') : 0));
        this.cy.on('freeon', (evt) => (evt.target[0].data('type') !== 'bend' ? this.cy.emit('show-bend') : 0));

        this.cy.on('click tap', (ev) => {
            if (ev.target === this.cy) {
                this.cy.emit('hide-bend');
                this.cy.$('.eh-handle').remove();
            }
        });
        this.cy.on('select unselect show-bend', () => {
            const el = this.cy.$(':selected');
            if (el.length !== 1 || !el[0].isEdge()) this.cy.emit('hide-bend');
            return el.emit('bend-edge');
        });
        this.cy.on('mouseover', 'edge', (ev) => {
            ev.target.emit('bend-edge');
        });

        this.cy.on('bend-edge', 'edge', (ev) => {
            if (!this.bendNode.hasClass('hidden')) this.cy.emit('hide-bend');
            const el = ev.target;
            this.bendNode.position(CG.getBendEdgePoint(el));
            this.bendNode.on('drag', () => {
                const DW = BendingDistanceWeight.getWeightDistance(
                    this.bendNode.position(), el.source().position(), el.target().position(),
                );
                el.data('style', { ...el.data('style'), bendDistance: DW.d, bendWeight: DW.w });
                ev.target.emit('bending');
            });
            this.bendNode.on('grab', () => {
                const node = el;
                node.scratch('bendDistWeight', {
                    bendDistance: el.data('style').bendDistance, bendWeight: el.data('style').bendWeight,
                });
            });
            this.bendNode.on('dragfree', () => {
                const node = el;
                this.addBendChange(node.id(), node.scratch('bendDistWeight'), {
                    bendDistance: el.data('style').bendDistance, bendWeight: el.data('style').bendWeight,
                });
            });
            this.bendNode.removeClass('hidden');
        });
    }

    setBendWightDist(id, DW) {
        const style = this.getById(id).data('style');
        this.getById(id).data('style', { ...style, bendDistance: DW.bendDistance, bendWeight: DW.bendWeight });
    }

    static getBendEdgePoint(el) {
        const { bendWeight, bendDistance } = el.data('style');
        const w = parseFloat(bendWeight);
        const d = parseFloat(bendDistance);
        return BendingDistanceWeight.getCoordinate(w, d, el.source().position(), el.target().position());
    }

    setCurStatus() {
        if (super.setCurStatus) super.setCurStatus();
        this.selectDeselectEventHandler();
    }
};

export default CoreGraph;
