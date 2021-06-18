import GraphComponent from './graph-component';
import GA from './graph-actions';
import { actionType as T } from '../reducer';

const GraphUndoRedo = (ParentClass) => class GUR extends GraphComponent(ParentClass) {
    constructor() {
        super();

        GUR.methodsMapped = {
            [GA.ADD_NODE]: (...args) => super.addNode.bind(this)(...args, 0),
            [GA.ADD_EDGE]: (...args) => super.addEdge.bind(this)(...args, 0),
            [GA.UPDATE_NODE]: (...args) => super.updateNode.bind(this)(...args, 0),
            [GA.UPDATE_EDGE]: (...args) => super.updateEdge.bind(this)(...args, 0),
            [GA.UPDATE_DATA]: (...args) => super.updateData.bind(this)(...args, 0),
            [GA.DEL_NODE]: (...args) => super.deleteNode.bind(this)(...args, 0),
            [GA.DEL_EDGE]: (...args) => super.deleteEdge.bind(this)(...args, 0),
            [GA.SET_POS]: (...args) => super.setPos.bind(this)(...args, 0),
            [GA.SET_DIM]: (...args) => super.setDim.bind(this)(...args, 0),
        };

        this.actionArr = [];
        this.curActionIndex = 0;
    }

    static performAction({ actionName, parameters }) {
        const action = GUR.methodsMapped[actionName];
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
            GUR.performAction(this.actionArr[this.curActionIndex].inverse);
        }
        this.dispatcher({ type: T.SET_UNDO, payload: this.curActionIndex !== 0 });
        this.dispatcher({ type: T.SET_REDO, payload: this.curActionIndex !== this.actionArr.length });
    }

    redo() {
        let curTid = null;
        if (this.curActionIndex !== this.actionArr.length) curTid = this.actionArr[this.curActionIndex].tid;
        while (this.curActionIndex !== this.actionArr.length && this.actionArr[this.curActionIndex].tid === curTid) {
            GUR.performAction(this.actionArr[this.curActionIndex].equivalent);
            this.curActionIndex += 1;
        }
        this.dispatcher({ type: T.SET_UNDO, payload: this.curActionIndex !== 0 });
        this.dispatcher({ type: T.SET_REDO, payload: this.curActionIndex !== this.actionArr.length });
    }

    setCurStatus() {
        if (super.setCurStatus) super.setCurStatus();
        this.dispatcher({ type: T.SET_UNDO, payload: this.curActionIndex !== 0 });
        this.dispatcher({ type: T.SET_REDO, payload: this.curActionIndex !== this.actionArr.length });
    }
};

export default GraphUndoRedo;
