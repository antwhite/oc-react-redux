import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';

import {fetchCounter} from '../common/api/counter';
import configureStore from '../common/store/configureStore';
import App  from '../common/containers/App';

export function data(context, callback) {
    fetchCounter(apiResult => {
        const counter = context.params.counter || apiResult || 0;
        const preloadedState = {counter};
        const store = configureStore(preloadedState);

        let body = renderToString(
            <Provider store={store}>
                <App />
            </Provider>
        );

        return callback(null, {
            body: body,
            preLoadedState: store.getState(),
            staticPath: context.staticPath
        });
    });
}

if (typeof __webpack_require__ === 'function') {
    require("file?name=./counter/[name].[ext]!../package.json");
    require("file?name=./counter/[name].[ext]!../template.jade");
}