import GraphComponent from './graph-component';
import GA from './graph-actions';

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
        };

        this.actionArr = [];
        this.curActionIndex = 0;
    }

    static performAction(actionSet) {
        const { actionName, parameters } = actionSet;
        const action = GUR.methodsMapped[actionName];
        action(...parameters);
    }

    addAction(inverse, equivalent, tid) {
        if (tid === 0) return;
        this.actionArr.splice(this.curActionIndex);
        this.actionArr.push({ tid, inverse, equivalent });
        this.curActionIndex += 1;
    }

    undo() {
        let curTid = null;
        if (this.curActionIndex !== 0) curTid = this.actionArr[this.curActionIndex - 1].tid;
        while (this.curActionIndex !== 0 && this.actionArr[this.curActionIndex - 1].tid === curTid) {
            this.curActionIndex -= 1;
            GUR.performAction(this.actionArr[this.curActionIndex].inverse);
        }
    }

    redo() {
        let curTid = null;
        if (this.curActionIndex !== this.actionArr.length) curTid = this.actionArr[this.curActionIndex].tid;
        while (this.curActionIndex !== this.actionArr.length && this.actionArr[this.curActionIndex].tid === curTid) {
            GUR.performAction(this.actionArr[this.curActionIndex].equivalent);
            this.curActionIndex += 1;
        }
    }
};

export default GraphUndoRedo;
