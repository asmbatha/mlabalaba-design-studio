export default {
    'place||select': {
        _on: {
            ENTER () {
                this.match.guns = []
                if (this.currentPlayerMoves < 12) {
                    this.changeStateTo('place')
                } else {
                    this.changeStateTo('select')
                }
            }
        }
    },
    place: {
        _on: {
            ENTER () {
                this.match.hint = 'place a piece in one of the highlighted points'
                console.log('this', this)
                console.log('this.currentPlayerPieces', this.currentPlayerPieces)
                console.log('this.opponentPieces', this.opponentPieces)
                let occupied = [...this.currentPlayerPieces, ...this.opponentPieces]
                this.match.highlights = Object.keys(this.points)
                                    .filter(x => !occupied.includes(x))

                this.$emit('handlePlayer')
            },
            CLICK ({letter}) {
                // warn if target is not highlited
                if (!this.match.highlights.includes(letter)) return

                this.match.playerPieces[this.currentPlayer].push(letter)
                this.match.ghosts = [{letter, player: this.currentPlayer}]
                this.$emit('setPiece', {player: this.currentPlayer, position: letter})
                
                this.checkRows(letter)
                    ? this.changeStateTo('remove')
                    : this.changeStateTo('reset')
                    
                this.match.gameMoves.push({
                    player: this.currentPlayer,
                    action: 'place',
                    letters: [letter]
                })
            }
        }
    },
    select: {
        _on: {
            ENTER () {
                this.match.hint = 'select a piece to move'
                // highlight all players movable pieaces
                if (this.currentPlayerPieces.length < 3) {
                    this.match.hint = `Player ${!this.currentPlayer ? 2 : 1} wins`
                    this.match.winner = Number(!this.currentPlayer)
                    this.changeStateTo('matchOver')
                } else if (this.currentPlayerPieces.length == 3) {
                    this.match.clickable = this.match.highlights = this.currentPlayerPieces
                    this.$emit('handlePlayer')
                } else {
                    this.match.clickable = this.match.highlights = this.getMovablePieces()
                    this.$emit('handlePlayer')
                }
            },
            CLICK ({letter}) {
                // warn if target is not highlighted
                if (!this.match.highlights.includes(letter)) return
                // mark as selected && move
                this.match.selected = letter
                this.changeStateTo('move')
            }
        }
    },
    move: {
        _on: {
            ENTER () {
                // message: place a piece
                this.match.hint = 'select a point to move to'
                // highlight all empty points
                let highlights = []
                
                if (this.currentPlayerPieces.length > 3) {
                    let occupied = [...this.playerPieces[0], ...this.playerPieces[1]]

                    highlights = this.points[this.selected].connections.filter(x => !occupied.includes(x))
                } else {
                    let occupied = [...this.currentPlayerPieces, ...this.opponentPieces]
                    highlights = Object.keys(this.points)
                                        .filter(x => !occupied.includes(x))
                }

                let lines = highlights.map(x => [x, this.selected].sort().join(''))
                this.match.highlights = [...highlights, ...lines]

                this.$emit('handlePlayer')
            },
            CLICK ({letter}) {
                // warn if target is not highlited
                if (!this.match.highlights.includes(letter)) {
                    if (this.selected === letter) {
                        this.match.selected = ''
                        this.changeStateTo('select')
                    } else if (this.getMovablePieces().includes(letter)) {
                        this.match.selected = letter
                        this.$emit('ENTER')
                    }
                    return
                }
                
                Vue.set(this.match.playerPieces, this.currentPlayer, [
                    ...this.playerPieces[this.currentPlayer].filter(x => x !== this.selected),
                    letter
                ])

                this.$emit('movePiece', {from: this.selected, to: letter})
                
                let pair = [letter, this.selected]
                this.match.ghosts = [...pair.map(letter => ({letter, player: this.currentPlayer})), {letter: pair.sort().join(''), player: this.currentPlayer}]
                
                this.match.gameMoves.push({
                    player: this.currentPlayer,
                    action: 'move',
                    letters: [this.selected, letter]
                })

                this.match.selected = ''
                
                this.checkRows(letter)
                    ? this.changeStateTo('remove')
                    : this.changeStateTo('reset')
            }
        }
    },
    remove: {
        _on: {
            ENTER () {
                // message: select an opponents piece to remove
                this.match.hint = 'select your opponents piece to remove'
                // highlight all opponents
                let options = this.opponentPieces
                let cleared = []
                options.forEach((letter) => {
                    if (!cleared.includes(letter)) {

                        let groups = this.groups[letter]
                        groups.forEach(group => {
                            let gun = group.filter(x => options.includes(x)).length == 2
                            if (gun) cleared = [...new Set([...cleared, ...group, letter])]
                        })
                    }
                })
                let filtered = options.filter(x => !cleared.includes(x))

                this.match.clickable = this.match.highlights = filtered.length ? filtered : options

                this.$emit('handlePlayer')
            },
            CLICK ({letter}) {
                // warn if target is not highlited
                if (!this.match.highlights.includes(letter)) return
                
                Vue.set(this.match.playerPieces, Number(!this.currentPlayer), this.playerPieces[Number(!this.currentPlayer)].filter(x => x !== letter))
                this.match.ghosts.push({letter, player: Number(!this.currentPlayer)})
                
                this.$emit('removePiece', letter)
                this.changeStateTo('reset')

                this.match.gameMoves.push({
                    player: this.currentPlayer,
                    action: 'remove',
                    letters: [letter]
                })
            }
        }
    },
    reset: {
        _on: {
            ENTER () {
                ++this.match.playerMoves[this.currentPlayer]
                this.match.currentPlayer = Number(!this.currentPlayer)
                this.match.clickable = this.match.highlights = []
                this.changeStateTo('place||select')
            }
        }
    },
    matchOver: {
        _on: {
            ENTER () {
                this.match.highlights = []
                this.$emit('matchOver', this.match)
            }
        }
    }
}