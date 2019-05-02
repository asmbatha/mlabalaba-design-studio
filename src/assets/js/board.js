export default {
    name: "uMlabalaba / 12 man's morris",
    points: {
        a: {
            coordinates: [50, 50],
            connections: ['b', 'd', 'j']
        },
        b: {
            coordinates: [200, 50],
            connections: ['a', 'c', 'e']
        },
        c: {
            coordinates: [350, 50],
            connections: ['b', 'f', 'o']
        },
        d: {
            coordinates: [100, 100],
            connections: ['a', 'e', 'g', 'k']
        },
        e: {
            coordinates: [200, 100],
            connections: ['b', 'd', 'f', 'h']
        },
        f: {
            coordinates: [300, 100],
            connections: ['e', 'c', 'i', 'n']
        },
        g: {
            coordinates: [150, 150],
            connections: ['d', 'h', 'l']
        },
        h: {
            coordinates: [200, 150],
            connections: ['e', 'g', 'i']
        },
        i: {
            coordinates: [250, 150],
            connections: ['f', 'h', 'm']
        },
        j: {
            coordinates: [50, 200],
            connections: ['a', 'k', 'v']
        },
        k: {
            coordinates: [100, 200],
            connections: ['j', 'l', 's', 'd']
        },
        l: {
            coordinates: [150, 200],
            connections: ['k', 'g', 'p']
        },
        m: {
            coordinates: [250, 200],
            connections: ['n', 'r', 'i']
        },
        n: {
            coordinates: [300, 200],
            connections: ['f', 'm', 'o', 'u']
        },
        o: {
            coordinates: [350, 200],
            connections: ['n', 'x', 'c']
        },
        p: {
            coordinates: [150, 250],
            connections: ['q', 'l', 's']
        },
        q: {
            coordinates: [200, 250],
            connections: ['p', 'r', 't']
        },
        r: {
            coordinates: [250, 250],
            connections: ['q', 'm', 'u']
        },
        s: {
            coordinates: [100, 300],
            connections: ['t', 'k', 'p', 'v']
        },
        t: {
            coordinates: [200, 300],
            connections: ['s', 'u', 'w', 'q']
        },
        u: {
            coordinates: [300, 300],
            connections: ['t', 'x', 'n', 'r']
        },
        v: {
            coordinates: [50, 350],
            connections: ['w', 'j', 's']
        },
        w: {
            coordinates: [200, 350],
            connections: ['v', 'x', 't']
        },
        x: {
            coordinates: [350, 350],
            connections: ['w', 'o', 'u']
        }
    },
    lines: [
        ['a', 'b'],
        ['a', 'd'],
        ['a', 'j'],
        ['b', 'c'],
        ['b', 'e'],
        ['c', 'f'],
        ['c', 'o'],
        ['d', 'e'],
        ['d', 'g'],
        ['d', 'k'],
        ['e', 'f'],
        ['e', 'h'],
        ['f', 'i'],
        ['f', 'n'],
        ['g', 'h'],
        ['g', 'l'],
        ['h', 'i'],
        ['i', 'm'],
        ['j', 'k'],
        ['j', 'v'],
        ['k', 'l'],
        ['k', 's'],
        ['l', 'p'],
        ['m', 'n'],
        ['m', 'r'],
        ['n', 'o'],
        ['n', 'u'],
        ['o', 'x'],
        ['p', 'q'],
        ['p', 's'],
        ['q', 'r'],
        ['q', 't'],
        ['r', 'u'],
        ['s', 't'],
        ['s', 'v'],
        ['t', 'u'],
        ['t', 'w'],
        ['u', 'x'],
        ['v', 'w'],
        ['w', 'x']
    ],
    groups: {
        a: [
            ['b', 'c'],
            ['d', 'g'],
            ['j', 'v']
        ],
        b: [
            ['a', 'c'],
            ['e', 'h']
        ],
        c: [
            ['a', 'b'],
            ['f', 'i'],
            ['o', 'x']
        ],
        d: [
            ['e', 'f'],
            ['a', 'g'],
            ['k', 's']
        ],
        e: [
            ['d', 'f'],
            ['b', 'h']
        ],
        f: [
            ['d', 'e'],
            ['c', 'i'],
            ['n', 'u']
        ],
        g: [
            ['h', 'i'],
            ['a', 'd'],
            ['l', 'p']
        ],
        h: [
            ['g', 'i'],
            ['b', 'e']
        ],
        i: [
            ['g', 'h'],
            ['c', 'f'],
            ['m', 'r']
        ],
        j: [
            ['k', 'l'],
            ['a', 'v']
        ],
        k: [
            ['j', 'l'],
            ['d', 's']
        ],
        l: [
            ['j', 'k'],
            ['g', 'p']
        ],
        m: [
            ['n', 'o'],
            ['i', 'r']
        ],
        n: [
            ['m', 'o'],
            ['f', 'u']
        ],
        o: [
            ['m', 'n'],
            ['c', 'x']
        ],
        p: [
            ['q', 'r'],
            ['s', 'v'],
            ['g', 'l']
        ],
        q: [
            ['p', 'r'],
            ['t', 'w']
        ],
        r: [
            ['p', 'q'],
            ['u', 'x'],
            ['i', 'm']
        ],
        s: [
            ['t', 'u'],
            ['p', 'v'],
            ['d', 'k']
        ],
        t: [
            ['s', 'u'],
            ['q', 'w']
        ],
        u: [
            ['s', 't'],
            ['r', 'x'],
            ['f', 'n']
        ],
        v: [
            ['w', 'x'],
            ['p', 's'],
            ['a', 'j']
        ],
        w: [
            ['v', 'x'],
            ['q', 't']
        ],
        x: [
            ['v', 'w'],
            ['r', 'u'],
            ['c', 'o']
        ]
    }
}