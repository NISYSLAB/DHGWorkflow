const Automove = {
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
    getClosestRect(C, P, w, h) {
        const A = { y: C.y + h, x: C.x + w };
        const B = { y: C.y - h, x: C.x - w };
        const pos = P;
        pos.x = Math.min(A.x, Math.max(pos.x, B.x));
        pos.y = Math.min(A.y, Math.max(pos.y, B.y));
        if (pos.x < A.x && pos.y < A.y && pos.x > B.x && pos.y > B.y) {
            const arr = [[Math.abs(pos.x - A.x), 'X', A.x],
                [Math.abs(pos.x - B.x), 'X', B.x],
                [Math.abs(pos.y - A.y), 'Y', A.y], [Math.abs(pos.y - B.y), 'Y', B.y]];
            arr.sort((a, b) => a[0] - b[0]);
            if (arr[0][1] === 'X') { [[, , pos.x]] = arr; }
            if (arr[0][1] === 'Y') { [[, , pos.y]] = arr; }
        }
        return pos;
    },
    getClosest(C, P, w, h, type) {
        if (type === 'rectangle') return this.getClosestRect(C, P, w, h);
        return this.getClosestEllipse(C, P, w, h);
    },

};

export default Automove;
