const nodeValidator = (node, nodes) => {
    let message = { ok: true, err: null };
    nodes.forEach((n) => {
        if (n.label === node.label) {
            message = {
                ok: false,
                err: 'Node with same label exists.',
            };
        }
    });
    return message;
};
const edgeValidator = (edge, nodes, edges) => {
    let message = { ok: true, err: null };
    edges.forEach((e) => {
        if (e.label === edge.label && e.sourceLabel !== edge.sourceLabel) {
            message = {
                ok: false,
                err: 'Edge with same label exists.',
            };
        }
    });
    return message;
};

/* eslint-disable max-len */
const nodeValidatorFormat = `Takes **\`node\`** details under validation, existing **\`nodes\`** and existing **\`edges\`**

**Node:** { label: String, style: Object, id: String | undefined },
**Nodes:** [{ label: String, style: Object, id: String }],
**Edges:** [{ label: String, sourceLabel: String, targetLabel: String, style: Object, id: String }],`;

const edgeValidatorFormat = `Takes **\`edge\`** details under validation, existing **\`nodes\`** and existing **\`edges\`**

**Edge:** { label: String, sourceLabel: String, targetLabel: String, style: Object, id: String | undefined },
**Nodes:** [{ label: String, style: Object, id: String }],
**Edges:** [{ label: String, sourceLabel: String, targetLabel: String, style: Object, id: String }],`;
/* eslint-enable max-len */

export {
    nodeValidator, edgeValidator, nodeValidatorFormat, edgeValidatorFormat,
};
