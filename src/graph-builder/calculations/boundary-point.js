const boundaryPoint = {
    getEq(P1, P2) {
        const m = (P1.y - P2.y) / (P1.x - P2.x);
        const c = P1.y - m * P1.x;
        return [m, c];
    },
    getX1X2(Cn, P, w, h) {
        if (Cn.x === P.x) return [P.x, P.x];
        const P2 = { x: P.x - Cn.x, y: P.y - Cn.y };
        const [m, c] = this.getEq({ x: 0, y: 0 }, P2);
        // (𝑎2𝑚2+𝑏2)𝑥2+2𝑎2𝑚𝑐𝑥+𝑎2(𝑐2–𝑏2)
        const A = (w ** 2 * m ** 2 + h ** 2);
        const B = 2 * w ** 2 * m * c;
        const C = w ** 2 * (c ** 2 - h ** 2);
        const D = B ** 2 - 4 * A * C;
        const x1 = (-B + D ** 0.5) / (2 * A) + Cn.x;
        const x2 = (-B - D ** 0.5) / (2 * A) + Cn.x;
        return [x1, x2];
    },
    getY1Y2(C, P, w, h, x1, x2) {
        if (x1 === x2) return [C.y + h, C.y - h];
        const [m, c] = this.getEq(C, P);
        return [m * x1 + c, m * x2 + c];
    },
    dist(A, B) {
        return ((A.x - B.x) ** 2 + (A.y - B.y) ** 2) ** 0.5;
    },
    getClosestEllipse(C, P, w, h) {
        const [x1, x2] = this.getX1X2(C, P, w, h);
        const [y1, y2] = this.getY1Y2(C, P, w, h, x1, x2);
        const [d1, d2] = [this.dist(P, { x: x1, y: y1 }), this.dist(P, { x: x2, y: y2 })];
        if (d1 < d2) return { x: x1, y: y1 };
        return { x: x2, y: y2 };
    },
    slope(x1, y1, x2, y2) {
        return (x1 - x2) / (y1 - y2);
    },

    setSubQ(C, P, w, h) {
        const [S1, S2] = [[C.x + w, C.y + h], [C.x + w, C.y - h]]
            .map(([x, y]) => ((C.x - x) * (P.y - y) - (C.y - y) * (P.x - x)) > 0);
        if (S1 && !S2) return 0;
        if (!S1 && !S2) return 1;
        if (!S1 && S2) return 2;
        if (S1 && S2) return 3;
        return -1;
    },

    getClosestRect(C, P, w, h) {
        const [m, c] = this.getEq(P, C);
        let D = [
            [C.x + w, C.y],
            [C.x, C.y + h],
            [C.x - w, C.y],
            [C.x, C.y - h],
        ];
        if (Math.abs(m) !== Infinity) {
            D = [ // To point toward center
                [C.x + w, m * (C.x + w) + c],
                [(C.y + h - c) / m, C.y + h],
                [C.x - w, m * (C.x - w) + c],
                [(C.y - h - c) / m, C.y - h],
            ];
        }
        const [x, y] = D[this.setSubQ(C, P, w, h)];
        return { x, y };
    },
    get(C, P, w, h, type) {
        if (type === 'rectangle') return boundaryPoint.getClosestRect(C, P, w, h);
        return boundaryPoint.getClosestEllipse(C, P, w, h);
    },

};

export default boundaryPoint.get;
