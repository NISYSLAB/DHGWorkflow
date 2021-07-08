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
    const originalEdge = edges.filter((n) => n.id === edge.id)[0];
    edges.filter((n) => !originalEdge || n.source !== originalEdge.source || n.label !== originalEdge.label)
        .forEach((n) => {
            if (n.label === edge.label) {
                message = {
                    ok: false,
                    err: 'Edge with same label exists.',
                };
            }
        });
    return message;
};

export { nodeValidator, edgeValidator };
