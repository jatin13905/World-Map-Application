import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class NotFound extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Page Not Found</h1>
                    <Button variant="outline-secondary" href="/">
                        Return to Map
                    </Button>
                </div>
            </div>
        )
    }
}

export default NotFound;
