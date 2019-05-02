import Vue from 'vue'

import fsmFactory from './fsmFactory'
import matchStates from './matchStates'
import board from './board'

const generate = ({key, match, state}) => {
    console.log('{key, match, state}', {key, match, state})
    return fsmFactory(key, {
            key, match, state,
            states: matchStates,
            resolved: false,
            actions: []
        }, [
            {
                computed: {
                    nodeData () {
                        return this.resolved
                        ? {
                            key: this.key,
                            name: this.name,
                            actions: this.actions
                        }
                        : {
                            key: this.key,
                            name: this.name,
                            actions: [{text: 'resolve', handler: this.resolveActions}]
                        }
                    },
                    name () {
                        return this.key.split('/').pop()
                    },

                    currentPlayer () { return this.match.currentPlayer},

                    currentPlayerMoves () { return this.match.playerMoves[this.currentPlayer]},
                    currentPlayerPieces () { return this.match.playerPieces[this.currentPlayer]},
                    currentPlayerType () { return this.match.players[this.currentPlayer]},
                    
                    opponentPieces () { return this.match.playerPieces[Number(!this.currentPlayer)]},

                    guns () { return this.match.guns},
                    hint () { return this.match.hint},

                    playerMoves () { return this.match.playerMoves},
                    highlights () { return this.match.highlights},
                    winner () { return this.match.winner},
                    selected () { return this.match.selected},
                    playerPieces () { return this.match.playerPieces},
                    ghosts () { return this.match.ghosts},

                    points () { return board.points},
                    groups () { return board.groups},
                },
                methods: {
                    getValue (obj) {
                        return JSON.parse(JSON.stringify(obj))
                    },
                    resolveActions() {
                        console.log('resolveActions', this)
                        let self = this
                        
                        let actions = self.getValue(self.match.highlights)
                                        .map(action => 
                                            self.resolveVariations(`${self.key}/${action}`, action, self.getValue(self.$data)))
                        if (!actions.length) return self.setLeafNode()
                        
                        Promise.all(actions)
                        .then(results => {
                            self.actions = results.map(({name}) => ({
                                text: name,
                                handler: () => {}
                            }))
                            self.resolved = true
                            self.$emit('addNodes', results)
                        })
                    },
                    setLeafNode () {
                        this.resolved = true
                        this.leafNode = true
                        this.$emit('updated')
                    },
                    resolveVariations (key, letter, matchState) {
                        
                        return new Promise((resolve, reject) =>
                        {
                            let machine = generate({...matchState, key})
                            let currentPlayer = machine.match.currentPlayer
                            
                            machine.$on('handlePlayer', () => {
                                if (currentPlayer === machine.match.currentPlayer) {
                                    machine.match.highlights
                                    return resolve(
                                        Promise.all(
                                            self.getValue(machine.match.highlights).map(action => 
                                                self.resolveVariations(`${machine.key}${action}`, action, self.getValue(machine.$data))
                                            )
                                        )
                                    )
                                } else {
                                    resolve(machine)
                                }
                            })

                            machine.$emit('CLICK', {letter})
                        })

                            
                    },
                    setLeafNode () {
                        this.resolved = true
                    },
                    getMovablePieces () {
                        if (this.currentPlayerPieces.length > 3) {
                            let occupied = [...this.currentPlayerPieces, ...this.opponentPieces]
                            let empty = Object.keys(this.points)
                                .filter(x => !occupied.includes(x))
                            return empty
                                .map(x => this.points[x].connections)
                                .reduce((c, a) => [...c, ...a], [])
                                .filter(x => this.currentPlayerPieces.includes(x))
                        } else if (this.currentPlayerPieces.length === 3 ) {
                            return this.currentPlayerPieces
                        } else {
                            return []
                        }
                    },
                    checkRows (point) {
                        let winningGroups = this.groups[point]
                        .filter(proup => !proup
                            .some(letter => !this.currentPlayerPieces
                                .includes(letter)
                            )
                        )
                        
                        if (winningGroups.length) {
                            this.match.guns = winningGroups.reduce((c, a) => [...c, ...a], [point])
                        }
                        
                        return !!winningGroups.length
                    }
                }
            }
        ]
    )
}

export default {generate}
