const React = require('react');

function Index({ element }) {
  return (
    <div className="container max-w-[880px] overflow-hidden mx-auto h-full">

        <div className="container mx-auto my-5">
              <h1 className="text-4xl text-center">Erro {errorCode}</h1>
              <p className="text-center text-lg">{errorMessage}</p>
          </div>
        
    </div>
  );
}

module.exports = Index;


