import AppRoutes from './routes/AppRoutes';

import AppLayout from './components/layout/AppLayout';

import {
  Toaster,
} from 'react-hot-toast';

function App() {
  return (
    <AppLayout>
      <AppRoutes />
      <Toaster
        position="top-right"
      />
    </AppLayout>
  );
}

export default App;
