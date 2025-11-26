import React, { useState, useEffect } from 'react';
import { api } from './services/api'; // <--- Importamos a API
import { 
  Dumbbell, 
  CalendarCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Activity,
  UserPlus,
  Wallet,
  ChevronRight,
  Loader2 // Novo ícone para loading
} from 'lucide-react';

// --- TIPAGEM ---
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'; // Ajustado para bater com o Back-End
}

// Mantemos o mock APENAS para os dados que ainda não buscamos do back (fichas, etc)
// Futuramente vamos substituir tudo isso por chamadas à API
const INITIAL_DATA_MOCK = {
  users: [],
  fichas: [], 
  registros: [], 
  matriculas: []
};

// --- COMPONENTES UI ---
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: any = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700"
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</button>;
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>{children}</div>
);

const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" {...props} />
  </div>
);

const Badge = ({ status }: { status: string }) => {
  const styles: any = { ATIVA: 'bg-green-100 text-green-800', INATIVA: 'bg-red-100 text-red-800', TRANCADA: 'bg-yellow-100 text-yellow-800' };
  return <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
};

// --- TELA DE LOGIN REAL ---
const LoginScreen = ({ onLogin, loading, error }: { onLogin: (e: string, p: string) => void, loading: boolean, error: string }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full"><Dumbbell className="w-10 h-10 text-indigo-600" /></div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">FitUP</h2>
        <p className="text-center text-gray-500 mb-8">Acesse sua conta</p>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input 
            label="E-mail" 
            type="email" 
            placeholder="ex: douglas@fitup.com"
            value={email} 
            onChange={(e: any) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Senha" 
            type="password" 
            placeholder="********"
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)} 
            required 
          />
          
          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar no Sistema'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Ainda não tem conta? Fale com a recepção.</p>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARDS (Por enquanto usando dados MOCK até conectarmos as outras rotas) ---

const ReceptionDashboard = ({ db, setDb }: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados REAIS do Back-End ao carregar a tela
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []); // Array vazio = executa apenas uma vez no início

  // Filtra apenas alunos para mostrar na tabela
  const students = users.filter(u => u.role === 'STUDENT');

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Painel da Recepção</h2></div>
        <Button onClick={() => alert("Funcionalidade de Nova Matrícula em breve!")}><Plus size={18} /> Nova Matrícula</Button>
      </header>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
          <p className="text-blue-100 text-sm font-medium">Alunos Cadastrados</p>
          <h3 className="text-3xl font-bold mt-1">{students.length}</h3>
        </Card>
        {/* Outros cards mantidos estáticos por enquanto */}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">
          Lista de Alunos
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-gray-500">Carregando alunos...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Plano</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhum aluno encontrado.</td></tr>
              ) : (
                students.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{aluno.name}</td>
                    <td className="p-4 text-gray-600">{aluno.email}</td>
                    <td className="p-4 text-gray-600">{aluno.plan}</td>
                    <td className="p-4"><Badge status={aluno.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const InstructorDashboard = ({ db, setDb, currentUser }: any) => {
  return (
    <div className="text-center p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Painel do Instrutor</h2>
      <p className="text-gray-500">Olá, {currentUser.name}. A gestão de fichas será conectada em breve.</p>
    </div>
  );
};

const StudentDashboard = ({ db, setDb, currentUser }: any) => {
  return (
    <div className="text-center p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Painel do Aluno</h2>
      <p className="text-gray-500">Bem-vindo, {currentUser.name}! Seus treinos aparecerão aqui.</p>
    </div>
  );
};

// --- APP PRINCIPAL ---
const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mantemos o estado DB local por enquanto para não quebrar a UI dos dashboards
  const [db, setDb] = useState(INITIAL_DATA_MOCK);

  // Verificar se já existe token salvo ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('fitup_token');
    const userStored = localStorage.getItem('fitup_user');
    
    if (token && userStored) {
      setCurrentUser(JSON.parse(userStored));
      // Opcional: Aqui poderíamos validar o token com uma chamada /me
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      // CHAMADA REAL AO BACK-END 🚀
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;

      // Salvar token e user no localStorage
      localStorage.setItem('fitup_token', token);
      localStorage.setItem('fitup_user', JSON.stringify(user));

      // Atualizar estado da aplicação
      setCurrentUser(user);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fitup_token');
    localStorage.removeItem('fitup_user');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-indigo-600" />
            <span className="font-bold text-xl text-indigo-900">FitUP</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border">
              {currentUser.role}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-900 hidden sm:block">
              {currentUser.name}
            </span>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600" title="Sair">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Renderização Condicional baseada na Role que vem do Back-End */}
        {currentUser.role === 'ADMIN' && <ReceptionDashboard db={db} setDb={setDb} />}
        {currentUser.role === 'INSTRUCTOR' && <InstructorDashboard db={db} setDb={setDb} currentUser={currentUser} />}
        {currentUser.role === 'STUDENT' && <StudentDashboard db={db} setDb={setDb} currentUser={currentUser} />}
      </main>
    </div>
  );
};

export default App;