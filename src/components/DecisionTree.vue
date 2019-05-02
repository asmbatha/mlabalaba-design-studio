<template>
  <rs-panes split-to="columns" :allow-resize="true" :size="300">
    <diagram ref="diag"
             slot="firstPane"
             v-bind:model-data="diagramData"
             v-on:model-changed="modelChanged"
             v-on:changed-selection="changedSelection"
             style="border: solid 1px black; width:100%; height:100%"></diagram>
    <div slot="secondPane">
      <v-btn v-on:click="addNode">Add Child to Gamma</v-btn>
      <v-btn v-on:click="modifyStuff">Modify view model data without undo</v-btn>

      <br/>Current Node:
      <input v-model.lazy="currentNodeText" v-bind:disabled="currentNode === null"/>
      <br/>The saved GoJS Model:
      <v-textarea :value="savedModelText" />

      <p class="box bg-info">
        This is a <a href="https://vuejs.org">Vue.js</a> sample.
      </p>
      <p>
        The GoJS Diagram is held in a "diagram" component, and only exposes a small fraction of the functionality of <a>Diagram</a>.
        That includes the "modelData" property, to initialize the Diagram to show a model, and
        the "diagram" property, to get access to the <a>Diagram</a>.
      </p>
      <p>
        That component also raises two events: "model-changed" corresponding to <a>Model.addChangedListener</a>, and
        "changed-selection" for the "ChangedSelection" <a>DiagramEvent</a>.
      </p>
      <p>
        That component also supports two different ways of modifying the diagram: access to the <a>Model</a> via the "model" method
        so that code can call Model methods such as <a>Model.setDataProperty</a>, and an "updateDiagramFromData" method.
        The latter permits data changes without calling Model methods to notify Diagrams showing the model,
        but at the cost of not being able to support undo and redo.
      </p>
    </div>
  </rs-panes>
</template>

<script>
import Vue from 'vue'
import ResSplitPane from 'vue-resize-split-pane'
import Diagram from '../components/Diagram.vue'

import matchStateFactory from '../assets/js/matchStateFactory.js'

export default {
    components: {
        'rs-panes': ResSplitPane,
        Diagram
    },
    props: ['initialMatchState'],
    data: () => ({
        nodeDataArray: [],
        linkDataArray: [],
        currentNode: null,
        savedModelText: "",
        counter: 1,  // used by addNode
        counter2: 4,  // used by modifyStuff
        currentVueNode: null
    }),
    created() {
        this.addNodes([this.initialMatchState])
    },
    computed: {
        diagramData () { // passed to <diagram> as its modelData
            return {
                nodeDataArray: this.nodeDataArray.map(node => node.nodeData),
                linkDataArray: this.linkDataArray
            }
        },
        currentNodeText: {
            get: function() {
                var node = this.currentNode;
                if (node instanceof go.Node) {
                    return node.data.text;
                } else {
                    return "";
                }
            },
            set: function(val) {
                var node = this.currentNode;
                if (node instanceof go.Node) {
                    var model = this.model();
                    model.startTransaction();
                    model.setDataProperty(node.data, "text", val);
                    model.commitTransaction("edited text");
                }
            }
        }
    },
    methods: {
        addNodes(nodes = []) {
            nodes.forEach(node => node.$on('addNodes', this.addNodes))
            console.log('NEW NODES', nodes.map(({key}) => key))
            this.nodeDataArray = [...this.nodeDataArray, ...nodes]

            this.linkDataArray = [
                ...this.linkDataArray,
                ...nodes.map(node => {
                    let keyArr = node.key.split('/')
                    if (keyArr.length === 1) return false

                    let to = node.key
                    let fromport = keyArr.pop()
                    let from = keyArr.join('/')

                    return {from, fromport, to}
                }).filter(x => x)
            ]
        },
        resolveNode(node) {
            this.currentVueNode = fsmFactory('', 
            {
                states: matchStates,
                ...node
            }, [matchMixin])
            console.log('this.currentVueNode', this.currentVueNode)
            // console.log('highlights', node)
        },
        // get access to the GoJS Model of the GoJS Diagram
        model: function() { return this.$refs.diag.model(); },
        // tell the GoJS Diagram to update based on the arbitrarily modified model data
        updateDiagramFromData: function() { this.$refs.diag.updateDiagramFromData(); },
        // this event listener is declared on the <diagram>
        modelChanged: function(e) {
            if (e.isTransactionFinished) {  // show the model data in the page's TextArea
                this.savedModelText = e.model.toJson();
            }
        },
        changedSelection: function(e) {
            console.log('changedSelection', e)
            var node = e.diagram.selection.first();
            if (node instanceof go.Node) {
                this.currentNode = node;
                this.currentNodeText = node.data.text;
            } else {
                this.currentNode = null;
                this.currentNodeText = "";
            }
        },
        // Here we modify the GoJS Diagram's Model using its methods,
        // which can be much more efficient than modifying some memory and asking
        // the GoJS Diagram to find differences and update accordingly.
        // Undo and Redo will work as expected.
        addNode: function() {
            var model = this.model();
            model.startTransaction();
            model.setDataProperty(model.findNodeDataForKey(4), "color", "purple");
            var data = { text: "NEW " + this.counter++, color: "yellow" };
            model.addNodeData(data);
            model.addLinkData({ from: 3, to: model.getKeyForNodeData(data) });
            model.commitTransaction("added Node and Link");
            // also manipulate the Diagram by changing its Diagram.selection collection
            var diagram = this.$refs.diag.diagram;
            diagram.select(diagram.findNodeForData(data));
        },
        // Here we modify VUE's view model directly, and
        // then ask the GoJS Diagram to update everything from the data.
        // This is less efficient than calling the appropriate GoJS Model methods.
        // NOTE: Undo will not be able to restore all of the state properly!!
        modifyStuff: function() {
            var data = this.diagramData;
            data.nodeDataArray[0].color = "red";
            // Note here that because we do not have the GoJS Model,
            // we cannot find out what values would be unique keys, for reference by the link data.
            data.nodeDataArray.push({ key: ++this.counter2, text: this.counter2.toString(), color: "orange" });
            data.linkDataArray.push({ from: 2, to: this.counter2 });
            this.updateDiagramFromData();
        }
    }
}
</script>
