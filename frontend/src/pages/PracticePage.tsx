import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PracticePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/practice/pages/PracticeMode');
  }, [navigate]);
  return null;
};

export default PracticePage;
    