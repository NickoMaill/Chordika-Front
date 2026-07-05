import '~/core/custom/array.extensions.ts'
import '~/core/custom/string.extensions.ts'
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import WeekOfYear from 'dayjs/plugin/weekOfYear';
import IsBetween from 'dayjs/plugin/isBetween';

dayjs.locale('fr');
dayjs.extend(LocalizedFormat);
dayjs.extend(WeekOfYear);
dayjs.extend(IsBetween);
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
