import React, { useEffect } from 'react';
import items from './items';
import ItemsData from './ItemsData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() { 
    const navigate = useNavigate();

    useEffect(() => {
        const token = window.localStorage.getItem('token');
        if (!token) {
            navigate("/login");
        } 
    }, [navigate]); // Include navigate in the dependency array

    return (
        <div>
            <div className="row">
                {items.map((item, index) => (
                    <div className="col-md-3" key={index}>
                        <ItemsData items={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}
