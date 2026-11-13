import type { JSX } from "react";

function Rodape(): JSX.Element {
    return (
        <footer className="flex flex-col items-center justify-between gap-2 bg-violet-900 px-6 py-4 md:flex-row">
            <p className="text-white text-xs sm:text-sm md:text-base text-center">
                Copyright - Todos os direitos reservados
            </p>
            <p className="text-white text-xs sm:text-sm md:text-base text-center">
                Laís Zanqueta 
            </p>
        </footer>
    );
}

export default Rodape