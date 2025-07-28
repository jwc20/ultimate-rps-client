import GraphCanvas from "../Canvas/GraphCanvas.jsx";
import { useRef } from "react";


function ActionGraph() {
    const graphRef = useRef(null);

    const handleGraphReady = (graphSystem) => {
        graphRef.current = graphSystem;

        // graphSystem.node(startX, startY, radius, text)
        const nodeA = graphSystem.node(200, 150, 50, "A");
        const nodeB = graphSystem.node(400, 150, 40, "B");
        const nodeC = graphSystem.node(300, 300, 45, "C");
        const nodeD = graphSystem.node(500, 250, 35, "D");

        nodeA.connect(nodeB, "5");
        nodeA.connect(nodeC, "3");
        nodeB.connect(nodeD, "2");
        nodeC.connect(nodeD, "4");
        nodeB.connect(nodeC, "1");
    };

    return (
        <>
            <p>Graph</p>
            <GraphCanvas style={{ width: "100%", height: "100%" }}
            position="relative" onGraphReady={handleGraphReady} />
        </>
    );
}

export { ActionGraph };