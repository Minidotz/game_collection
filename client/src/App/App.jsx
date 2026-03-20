import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import Contact from '../pages/Contact';
import GamePage from '../pages/GamePage';
import CollectionPage from '../pages/CollectionPage';
import AppLayout from '../layouts/AppLayout';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppLayout />}>
                    <Route index element={<MainPage />} />
                    <Route path="collection" element={<CollectionPage />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="games/:id" element={<GamePage />} />
                </Route>
            </Routes>
        </Router>
    );
}
