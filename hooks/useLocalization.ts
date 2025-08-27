
import { useAppContext } from '../context/AppContext';
import en from '../locales/en';

export const useLocalization = () => {
  const { t } = useAppContext();
  return { t: t as (key: keyof typeof en) => string };
};
