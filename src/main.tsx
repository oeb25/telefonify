import * as React from 'react';
import {render} from 'react-dom';
import * as server from './server';
import * as client from './client';

const id = window.location.hash.substr(1);
const isServer = window.location.search == '?server';

const App = (isServer ? server : client).init(id);

render(<App></App>, document.getElementById('app'));
