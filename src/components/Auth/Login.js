import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import '../../styles/Auth.css';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();

      
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        
        setError('');
        console.log('Logged in with:', { email, password });
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="mt-4">
                        Login
                    </Button>

                    <div className="mt-3">
                        <p>
                            Don't have an account?{' '}
                            <Button  className='btn btn-warning'
                                variant="warning"
                                onClick={() => navigate('/register')} 
                                
                            >
                                Register here
                            </Button>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
