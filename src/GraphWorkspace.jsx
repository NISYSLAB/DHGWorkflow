import React, { useEffect } from 'react';
import ZoomComp from './component/ZoomSetter';

import { actionType as T } from './reducer';
import './graphWorkspace.css';
import localStorageManager from './graph-builder/local-storage-manager';
import TabBar from './component/TabBar';
import Graph from './GraphArea';

const GraphComp = (props) => {
    const graphContainerRef = React.useRef();
    const { dispatcher, superState } = props;

    useEffect(() => {
        const graphFromParams = Object.fromEntries(new URLSearchParams(window.location.search).entries()).g;
        if (graphFromParams) {
            const graphContent = JSON.parse(atob(graphFromParams));
            const gid = new Date().getTime().toString();
            localStorageManager.addToFront(gid);
            localStorageManager.save(gid, graphContent);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        const allSavedGs = localStorageManager.getAllGraphs().map((graphID) => ({
            graphID,
        }));
        dispatcher({
            type: T.ADD_GRAPH_BULK,
            payload: allSavedGs,
        });
    }, []);

    return (
        <div
            style={{
                flex: 1,
                flexDirection: 'column',
                display: 'flex',
                width: '100%',
            }}
        >
            <TabBar superState={superState} dispatcher={dispatcher} />
            <div style={{ flex: 1, background: 'white' }} className="graph-container" ref={graphContainerRef}>
                {superState.graphs.map((el, i) => (
                    <Graph
                        el={el}
                        i={i}
                        superState={superState}
                        graphContainerRef={graphContainerRef}
                        dispatcher={dispatcher}
                        key={el.graphID}
                        active={i === superState.curGraphIndex}
                        graphID={el.graphID}
                        serverID={el.serverID}
                        graphML={el.graphML}
                        projectName={el.projectName}
                    />
                ))}
                <ZoomComp dispatcher={dispatcher} superState={superState} />
            </div>
        </div>
    );
};

export default GraphComp;
