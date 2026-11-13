import { type FormEvent, type JSX, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import estilo from './FormLogin.module.css';
import AuthRequests from '../../fetch/AuthRequests';

function FormLogin(): JSX.Element {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const destino = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            await AuthRequests.login({ email, senha });
            navigate(destino, { replace: true });
        } catch (error) {
            setErro(error instanceof Error ? error.message : 'Não foi possível fazer login.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <section className={estilo['login-form-container']}>

            <form className={estilo['login-form']} onSubmit={handleSubmit}>

                <h2 className={estilo['login-header']}>LOGIN</h2>
                {erro && <p role="alert" className="mb-4 text-sm text-red-600">{erro}</p>}

                <div className={estilo['form-group']}>
                    <label>
                        E-mail
                        <input
                            type="email"
                            placeholder='Informe o seu email'
                            className={estilo['input-email-login']}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className={estilo['form-group']}>
                    <label>
                        Senha
                        <input
                            type="password"
                            placeholder='Informe sua senha'
                            className={estilo['input-password-login']}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <input
                    type="submit"
                    value="Entrar"
                    className={estilo['login-button']}
                    disabled={carregando}
                />
            </form>
        </section>
    );
}

export default FormLogin;