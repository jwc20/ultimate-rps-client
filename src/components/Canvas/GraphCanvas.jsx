import {useCanvas} from '../../hooks/useCanvas.js';
import {GraphSystem} from '../../lib/GraphSystem.js';

const GraphCanvas = ({onGraphReady, ...props}) => {
    // set width and height defaults
    const width = props.width || '100vw'
    const height = props.height || '100vh'
    const position = props.position || 'fixed'
    console.log(width, height);

    const {canvasRef} = useCanvas({
        onInit: (canvas, ctx) => {
            const graphSystem = new GraphSystem(canvas, ctx);

            if (onGraphReady) {
                onGraphReady(graphSystem);
            }

            return graphSystem;
        },

        onDraw: (ctx, canvas, graphSystem) => {
            graphSystem.draw(ctx);
        },

        onResize: (canvas, graphSystem) => {
            if (graphSystem) {
                graphSystem.resize(canvas);
            }
        }
    });

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                width: {width},
                height: {height},
                position: {position},
                top: 0,
                left: 0,
                zIndex: -1,
                background: '#fff'
            }}
            {...props}
        />
    );
};

export default GraphCanvas;
