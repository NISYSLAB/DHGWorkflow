function askColor() {
    function c() {
        const hex = Math.floor(Math.random() * 256).toString(16);
        return (`0${String(hex)}`).substr(-2); // pad with zero
    }
    return `#${c()}${c()}${c()}`;
}

export default askColor;
