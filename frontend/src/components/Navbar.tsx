import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
	return (
		<nav className="relative">
			<div>
				<div className="bg-gray-900 flex justify-between px-4 h-16 items-center shadow-xl">
					<div className="flex items-center space-x-8"></div>
					<div className="flex space-x-4 items-center">
						<>
							<Link
								to="/register"
								className="text-[#9b59b6] text-sm"
							>
								CADASTRO
							</Link>
							<Link
								to="/login"
								className="bg-[#9b59b6] px-4 py-2 rounded text-white hover:bg-[#7D6C9B] text-sm"
							>
								LOGIN
							</Link>
						</>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
