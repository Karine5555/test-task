function serialize(data) {
    const result = [];
    for (let num of data) {
        while (num >= 0x80) {
            result.push((num & 0x7F) | 0x80);
            num >>= 7;
        }
        result.push(num);
    }
    const enc = new TextEncoder().encode(String.fromCharCode(...result));
    return btoa(String.fromCharCode(...enc));
}

function deserialize(serData) {
    const dec = atob(serData);
    const data = new Uint8Array(dec.length);
    for (let i = 0; i < dec.length; i++) {
        data[i] = dec.charCodeAt(i);
    }
    const result = [];
    let num = 0;
    let shift = 0;
    for (const byte of data) {
        num |= (byte & 0x7F) << shift;shift += 7;
        
        if (!(byte & 0x80)) {
            result.push(num);num = 0;shift = 0;
        }
    }
    return result;
}

const tests = [
    [1, 2, 3, 4, 5],
    Array.from({ length: 50 }, (_, i) => i + 1),
    Array.from({ length: 100 }, (_, i) => i + 1),
    Array.from({ length: 500 }, (_, i) => i + 1),
];

tests.forEach(test => {
    const ser = serialize(test);
    console.log(`test: ${JSON.stringify(test)}`);
    console.log(`ser: ${ser}`);
    const res = deserialize(ser);
    console.log(res);
});
