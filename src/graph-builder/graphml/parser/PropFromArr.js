class PropFromArr {
    constructor(obj) {
        this.arr = [obj];
        this.flatenArr();
    }

    flatenArr() {
        const flatArr = [];
        for (let i = 0; i < this.arr.length; i += 1) {
            if (this.arr[i].constructor === Array) this.arr[i].forEach((o) => this.arr.push(o));
            else flatArr.push(this.arr[i]);
        }
        this.arr = flatArr;
    }

    G(p) {
        return new PropFromArr(this.arr.map((o) => o[p]).filter((o) => o));
    }

    S(p) {
        this.arr = this.arr.map((o) => o[p]).filter((o) => o);
        this.flatenArr();
        return this;
    }

    any() {
        const arr = [];
        this.arr.forEach((obj) => {
            Object.keys(obj).forEach((key) => {
                arr.push(obj[key]);
            });
        });
        this.arr = arr;
        this.flatenArr();
        return this;
    }

    parseProps(s, t) {
        const propFromArr = new PropFromArr(this.arr);
        s.split('.').forEach(
            (property) => (property === '*' ? propFromArr.any() : propFromArr.S(property)),
        );
        if (t === 1) return propFromArr.A();
        if (t === 2) return propFromArr;
        return propFromArr.F();
    }

    A() { return this.arr; }

    F() { return this.arr[0]; }
}
// const arr = { a: [[{ c: [[[[1]]]] }]] };
// const X = new PropFromArr(arr);
// console.log(X.parseProps('a.c'));
export default PropFromArr;
