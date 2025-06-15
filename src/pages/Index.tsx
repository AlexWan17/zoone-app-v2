
import { useEffect } from 'react';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { useNavigate } from 'react-router-dom';
import ConsumidorHomePage from '@/pages/Consumidor/HomePage';
import LandingPage from '@/pages/LandingPage';
import LoadingSpinner from '@/components/LoadingSpinner';
import Layout from '@/components/Layout';

const Index = () => {
  const { user, loading, isLojista } = useAuthOptimized();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isLojista) {
      navigate('/lojista/dashboard', { replace: true });
    }
  }, [user, loading, navigate, isLojista]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando..." />;
  }

  if (!user) {
    return (
      <Layout>
        <LandingPage />
      </Layout>
    );
  }

  return (
    <Layout>
      <ConsumidorHomePage />
    </Layout>
  );
};

export default Index;
