import './index.css'
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes/routes';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './contexts/auth';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
   <BrowserRouter>
   <AuthProvider>
   <ToastContainer autoClose={3000}/>
   <RoutesApp/>
   </AuthProvider>
   </BrowserRouter>
  );
}

export default App;
