import GraphComponent from './3-component';
import GA from '../graph-actions';
import { actionType as T } from '../../reducer';

class GraphUndoRedo extends GraphComponent {
    static methodsMapped

    actionArr

    curActionIndex

    constructor(...props) {
        super(...props);

        GraphUndoRedo.methodsMapped = {
            [GA.ADD_NODE]: (...args) => super.addNode(...args, 0),
            [GA.ADD_EDGE]: (...args) => super.addEdge(...args, 0),
            [GA.UPDATE_NODE]: (...args) => super.updateNode(...args, 0),
            [GA.UPDATE_EDGE]: (...args) => super.updateEdge(...args, 0),
            [GA.UPDATE_DATA]: (...args) => super.updateData(...args, 0),
            [GA.DEL_NODE]: (...args) => super.deleteNode(...args, 0),
            [GA.DEL_EDGE]: (...args) => super.deleteEdge(...args, 0),
            [GA.SET_POS]: (...args) => super.setPos(...args, 0),
            [GA.SET_DIM]: (...args) => super.setDim(...args, 0),
            [GA.SET_BENDW]: (...args) => this.setBendWightDist(...args),
        };

        this.actionArr = [];
        this.curActionIndex = 0;
    }

    static performAction({ actionName, parameters }) {
        const action = GraphUndoRedo.methodsMapped[actionName];
        action(...parameters);
    }

    addPositionChange(id, prevPos, curPos) {
        const tid = new Date().getTime();
        this.addAction(
            { actionName: GA.SET_POS, parameters: [id, prevPos] },
            { actionName: GA.SET_POS, parameters: [id, curPos] }, tid,
        );
    }

    addDimensionChange(id, prevDim, prevPos, curDim, curPos) {
        const tid = new Date().getTime();
        this.addAction(
            { actionName: GA.SET_DIM, parameters: [id, prevDim, prevPos] },
            { actionName: GA.SET_DIM, parameters: [id, curDim, curPos] }, tid,
        );
    }

    addBendChange(id, prevDW, curDW) {
        const tid = new Date().getTime();
        this.addAction(
            { actionName: GA.SET_BENDW, parameters: [id, prevDW] },
            { actionName: GA.SET_BENDW, parameters: [id, curDW] }, tid,
        );
    }

    addAction(inverse, equivalent, tid) {
        if (tid === 0) return;
        this.actionArr.splice(this.curActionIndex);
        this.actionArr.push({ tid, inverse, equivalent });
        this.curActionIndex += 1;
        this.dispatcher({ type: T.SET_UNDO, payload: this.curActionIndex !== 0 });
        this.dispatcher({ type: T.SET_REDO, payload: this.curActionIndex !== this.actionArr.length });
    }

    undo() {
        let curTid = null;
        if (this.curActionIndex !== 0) curTid = this.actionArr[this.curActionIndex - 1].tid;
        while (this.curActionIndex !== 0 && this.actionArr[this.curActionIndex - 1].tid === curTid) {
            this.curActionIndex -= 1;
            GraphUndoRedo.performAction(this.actionArr[this.curActionIndex].inverse);
        }
        this.dispatcher({ type: T.SET_UNDO, payload: this.curActionIndex !== 0 });
        this.dispatcher({ type: T.SET_REDO, payload: this.curActionIndex !== this.actionArr.length });
    }

    redo() {
        let curTid = null;
        if (this.curActionIndex !== this.actionArr.length) curTid = this.actionArr[this.curActionIndex].tid;
        while (this.curActionIndex !== this.actionArr.length && this.actionArr[this.curActionIndex].tid === curTid) {
            GraphUndoRedo.performAction(this.actionArr[this.curActionIndex].equivalent);
            this.curActionIndex += 1;
        }
        this.dispatcher({ type: T.SET_UNDO, payload: this.curActionIndex !== 0 });
        this.dispatcher({ type: T.SET_REDO, payload: this.curActionIndex !== this.actionArr.length });
    }

    setCurStatus() {
        super.setCurStatus();
        this.dispatcher({ type: T.SET_UNDO, payload: this.curActionIndex !== 0 });
        this.dispatcher({ type: T.SET_REDO, payload: this.curActionIndex !== this.actionArr.length });
    }

    regesterEvents() {
        super.regesterEvents();
        this.cy.on('dragfree', 'node[type = "ordin"]', (e) => {
            e.target.forEach((node) => {
                this.addPositionChange(node.id(), node.scratch('position'), { ...node.position() });
            });
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
    }
}

export default GraphUndoRedo;
