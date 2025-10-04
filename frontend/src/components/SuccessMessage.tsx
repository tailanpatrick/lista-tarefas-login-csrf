import React from 'react';

const SuccessMessage = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="text-white bg-[#9b59b6] border border-blue-950 my-2 rounded-md p-2">
			{children}
		</div>
	);
};

export default SuccessMessage;
