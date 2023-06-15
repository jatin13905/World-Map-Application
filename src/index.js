import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './Styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    NavigationBar,
    Map,
    NotFound
} from './routes';

ReactDOM.render(
    <Router>
        <NavigationBar />
        <Routes>
            <Route path="/" element={<Map />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>,
    document.getElementById('root')
);
