import { createContext, StrictMode, useState, Dispatch, SetStateAction} from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import ReviewDeck from "./ReviewDeck.tsx";
import Home from './Home.tsx';
import DeckEditor from './DeckEditor.tsx';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
};

export interface Deck {
  id: number;
  deckName: string;
};

export interface Card {
  cardFront: string;
  cardBack: string;
  id: number;
  image: string;
}

type UserContextType = [User | null, Dispatch<SetStateAction<User | null>>];

export const UserContext = createContext<UserContextType>([null, () => {}]);

function Main() {
  
  const [user, setUser] = useState<User | null>(null);
  return (
    
      <UserContext.Provider value={[user, setUser]}>
        <Routes>
          <Route index element={<Home/>}></Route>
          <Route path="/edit/:id" element={<DeckEditor/>}></Route>
          <Route path="/:id" element={<ReviewDeck/>}></Route>
        </Routes>
      </UserContext.Provider>
    
  )
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Main/>
  </BrowserRouter>
)
