import React from 'react';

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa' }}>
            <p>&copy; {new Date().getFullYear()} MySocialApp. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
