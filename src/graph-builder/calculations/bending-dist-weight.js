const BendingDistanceWeight = {

    dist: (A, B) => (((A.x - B.x) ** 2 + (A.y - B.y) ** 2) ** 0.5),

    rotate: (P, Q) => ({
        x: P.x * Math.cos(Q) - P.y * Math.sin(Q),
        y: P.x * Math.sin(Q) + P.y * Math.cos(Q),
    }),

    extraRad: (A, B) => (((A.x > B.x && A.y > B.y) || (A.x > B.x && A.y < B.y)) ? Math.PI : 0),

    getCoordinate(w, d, A, B) {
        const tanQ = (A.y - B.y) / (A.x - B.x);
        const Q = ((Math.atan(tanQ) - this.extraRad(A, B)) + 2 * Math.PI) % (2 * Math.PI);
        const D = this.dist(A, B) * w;
        const P = { x: D, y: d };
        const { x, y } = this.rotate(P, Q);
        return { x: x + A.x, y: y + A.y };
    },

    getWeightDistance(p, A, B) {
        const P = { x: p.x - A.x, y: p.y - A.y };
        const tanQ = (A.y - B.y) / (A.x - B.x);
        const Q = (Math.atan(tanQ) - this.extraRad(A, B) + 2 * Math.PI) % (2 * Math.PI);
        const { x, y } = this.rotate(P, -Q);
        const d = this.dist(A, B);
        return { d: y, w: x / d };
    },
};

export default BendingDistanceWeight;
