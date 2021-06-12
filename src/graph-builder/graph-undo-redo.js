import GraphComponent from './graph-component';

const GraphUndoRedo = (ParentClass) => class GUR extends GraphComponent(ParentClass) {
    // addNode() { return this; }

    // addEdge() { return this; }

    // updateNode() { return this; }

    // updateEdge() { return this; }

    // updateData() { return this; }

    // deleteNode() { return this; }

    // deleteEdge() { return this; }

    constructor() {
        super();

        GraphUndoRedo.ADD_NODE = 'ADD_NODE';
        GraphUndoRedo.ADD_EDGE = 'ADD_EDGE';
        GraphUndoRedo.UPDATE_NODE = 'UPDATE_NODE';
        GraphUndoRedo.UPDATE_EDGE = 'UPDATE_EDGE';
        GraphUndoRedo.UPDATE_DATA = 'UPDATE_DATA';
        GraphUndoRedo.DEL_NODE = 'DEL_NODE';
        GraphUndoRedo.DEL_EDGE = 'DEL_EDGE';

        GraphUndoRedo.methodsMapped = {};
        GraphUndoRedo.methodsMapped[GraphUndoRedo.ADD_NODE] = (...args) => super.addNode.bind(this)(...args, 0);
        GraphUndoRedo.methodsMapped[GraphUndoRedo.ADD_EDGE] = (...args) => super.addEdge.bind(this)(...args, 0);
        GraphUndoRedo.methodsMapped[GraphUndoRedo.UPDATE_NODE] = (...args) => super.updateNode.bind(this)(...args, 0);
        GraphUndoRedo.methodsMapped[GraphUndoRedo.UPDATE_EDGE] = (...args) => super.updateEdge.bind(this)(...args, 0);
        GraphUndoRedo.methodsMapped[GraphUndoRedo.UPDATE_DATA] = (...args) => super.updateData.bind(this)(...args, 0);
        GraphUndoRedo.methodsMapped[GraphUndoRedo.DEL_NODE] = (...args) => super.deleteNode.bind(this)(...args, 0);
        GraphUndoRedo.methodsMapped[GraphUndoRedo.DEL_EDGE] = (...args) => super.deleteEdge.bind(this)(...args, 0);

        this.arr = [];
        this.cur = 0;
    }

    static performAction(actionSet) {
        const { actionName, parameters } = actionSet;
        const action = GraphUndoRedo.methodsMapped[actionName];
        action(...parameters);
    }

    addAction(inverse, equivalent, tid) {
        if (tid === 0) return;
        while (this.arr.length > this.cur) this.arr.pop();
        this.arr.push({ tid, inverse, equivalent });
        this.cur += 1;
    }

    undo() {
        let curTid = null;
        if (this.cur !== 0) curTid = this.arr[this.cur - 1].tid;
        while (this.cur !== 0 && this.arr[this.cur - 1].tid === curTid) {
            this.cur -= 1;
            GUR.performAction(this.arr[this.cur].inverse);
        }
    }

    redo() {
        let curTid = null;
        if (this.cur !== this.arr.length) curTid = this.arr[this.cur].tid;
        while (this.cur !== this.arr.length && this.arr[this.cur].tid === curTid) {
            GUR.performAction(this.arr[this.cur].equivalent);
            this.cur += 1;
        }
    }
};

export default GraphUndoRedo;
