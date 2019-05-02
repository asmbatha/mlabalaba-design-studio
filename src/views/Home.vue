<template>

    <!-- <rs-panes split-to="columns" :allow-resize="true" :size="300">
      <div slot="firstPane">
        <json-state-editor :matchState="currentMatchState" :key="currentMatchState.createdAt"/>
      </div>
      <decision-tree slot="secondPane" :initialMatchState="initialMatchState" :key="initialMatchState.createdAt"/>
    </rs-panes> -->
      <decision-tree :initialMatchState="initialMatchState" :key="initialMatchState.createdAt"/>
</template>

<script>
  // layout stuff
  import ResSplitPane from 'vue-resize-split-pane'

  // helpers
  import matchStateFactory from '../assets/js/matchStateFactory.js'

  // components
  import JsonStateEditor from '../components/JsonStateEditor.vue'
  import DecisionTree from '../components/DecisionTree.vue'

  export default {
    layout: 'editor',
    components: {
      // 'rs-panes': ResSplitPane,

      JsonStateEditor,
      DecisionTree,
    },
    data() {
      return {
        initialMatchState: {},
        currentMatchState: {}
      }
    },
    created() {
      this.setInitialMatchState()
    },
    methods: {
      setInitialMatchState(matchState = {
          match: {
            players: ['local', 'local'],
            clickable: [],
            currentPlayer: 0,
            gameMoves: [],
            ghosts: [],
            guns: [],
            highlights: [],
            pieces: {},
            playerMoves: [0, 0],
            playerPieces: [[], []],
            hint: "",
            selected: '',
            simQueue: [],
            winner: null
        },
        state: 'place||select'
      }) {
        this.initialMatchState = this.currentMatchState = matchStateFactory.generate({...matchState, key: 'initial'})
      }
    }
  }
</script>

<style>
  .Pane {
    overflow: auto !important;
  }
</style>
