<template>
  <div></div>
</template>

<script>
    import go from 'gojs'
    const $ = go.GraphObject.make;

    export default {
        props: ["modelData"],  // accept model data as a parameter
        mounted: function() {
            var self = this;
            var myDiagram =
                $(go.Diagram, this.$el,
                {
                    // layout: $(go.TreeLayout, { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal }),
                    layout: $(go.TreeLayout),
                    initialContentAlignment: go.Spot.Left,
                    "undoManager.isEnabled": true,
                    // Model ChangedEvents get passed up to component users
                    "ModelChanged": function(e) { self.$emit("model-changed", e); },
                    "ChangedSelection": function(e) { self.$emit("changed-selection", e); }
                });
            


            // define the Node template for non-leaf nodes
            myDiagram.nodeTemplate =
                $(
                    go.Node,
                    "Auto",
                    new go.Binding("text", "name"),
                    // define the node's outer shape, which will surround the Horizontal Panel
                    $(
                        go.Shape,
                        "Rectangle",
                        { fill: "whitesmoke", stroke: "lightgray" }
                    ),
                    // define a horizontal Panel to place the node's text alongside the buttons
                    $(
                        go.Panel,
                        "Horizontal",
                        $(
                            go.TextBlock,
                            { font: "30px Roboto, sans-serif", margin: 8 },
                            new go.Binding("text", "name")
                        ),
                        // define a vertical panel to place the node's two buttons one above the other
                        $(go.Panel, "Vertical",
                            {
                                margin: 3,
                                defaultAlignment: go.Spot.Right,
                                itemTemplate: $(
                                    go.Panel, "Auto",
                                    { margin: 2 },
                                    $("Button",
                                        new go.Binding("portId", "text"),
                                        $(
                                            go.TextBlock,
                                            new go.Binding("text")
                                        ),
                                        new go.Binding(
                                            "click", "handler",
                                            function(payload) {
                                                return function() { payload() }
                                            }
                                        )
                                    )  // end of itemTemplate
                                )
                            },
                            new go.Binding("itemArray", "actions")
                        )
                    )
                )  

            // define the only Link template
            myDiagram.linkTemplate =
                $(
                    go.Link, // go.Link.Orthogonal,  // the whole link panel
                    { fromPortId: "" },
                    new go.Binding("fromPortId", "fromport"),
                    $(
                        go.Shape,  // the link shape
                        { stroke: "lightblue", strokeWidth: 1 }
                    )
                )

            this.diagram = myDiagram;
            this.updateModel(this.modelData);
        },
        watch: {
            modelData: function(val) { this.updateModel(val); }
        },
        methods: {
            handleAction(...args) {  // here OBJ will be the item Panel
            console.log('args',args)
            },
            model: function() { return this.diagram.model; },
            updateModel: function(val) {
                // No GoJS transaction permitted when replacing Diagram.model.
                if (val instanceof go.Model) {
                    this.diagram.model = val;
                } else {
                    var m = new go.GraphLinksModel()
                    m.linkFromPortIdProperty = "fromport"
                    if (val) {
                        for (var p in val) {
                            m[p] = val[p];
                        }
                    }
                    this.diagram.model = m;
                }
            },
            updateDiagramFromData: function() {
                this.diagram.startTransaction();
                // This is very general but very inefficient.
                // It would be better to modify the diagramData data by calling
                // Model.setDataProperty or Model.addNodeData, et al.
                this.diagram.updateAllRelationshipsFromData();
                this.diagram.updateAllTargetBindings();
                this.diagram.commitTransaction("updated");
            }
        }
    }
</script>

<style>

</style>
