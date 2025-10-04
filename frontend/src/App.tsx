import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Register from './register';
import Home from './Home';
import Login from './Login';
import './App.css';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route
						path="/"
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
