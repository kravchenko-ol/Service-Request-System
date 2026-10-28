import './App.css'
import { useContext, useState } from 'react';
import { ThemContext } from './Theme/themeContext';
import { OperatorSessionContext, SessionContext, SignalRContext } from './Context/Contexts';
import type { IAccountData, IOperator } from './Types/type';
import AppContent from './AppContent';

function App() {
  const [dataUpdate, setDataUpdate] = useState<number>(0);

  const [sess, setSess] = useState<IAccountData | null>(
    {
      id: '',
      name: '',
      email: '',
      phone: '',
      age: '',
      role: 'User',
      sex: 'men'
    }
  );

  const [sessOp, setSessOP] = useState<IOperator | null>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'Operator',
    tickets: [],
  });

  const objTheme = useContext(ThemContext);
  const className = objTheme?.theme;

  return (
    <div className={className}>
      <SignalRContext value={{ dataUpdate, setDataUpdate }}>
        <OperatorSessionContext value={{ sessOp, setSessOP }}>
          <SessionContext value={{ sess, setSess }}>
            <AppContent />
          </SessionContext>
        </OperatorSessionContext>
      </SignalRContext>
    </div>
  )
}

export default App
