import * as React from 'react';

function ControlPanel() {
    return (
        <div className="control-panel">
            <h3>Position des bus en circulation sur le réseau STAR en temps réel</h3>
            <p>
                Carte montrant la position des bus du réseau STAR actuellement en service dans la métropole de Rennes.
            </p>
            <p>
                Données :{' '}
                <a href="https://data.explore.star.fr/explore/dataset/tco-bus-vehicules-position-tr/information">
                    STAR Data Explore
                </a>
            </p>
            <div className="source-link">
                <a
                    href="https://github.com/pierre-delaunay"
                    target="_new"
                >
                    Code source (GitHub) ↗
                </a>
            </div>
        </div>
    );
}

export default React.memo(ControlPanel);