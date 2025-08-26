import Footer from "./components/Footer"
import Mypage from "./pages/Mypage"
import Community from "./pages/Community"
import EditPage from "./components/EditPage"
import KakaoMap from "./components/KakaoMap"
import WritingPage from "./components/WritingPage"
import PostDetail from "./components/PostDetail"
import "./App.css"

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { createContext, useReducer } from "react";

export const PostsStateContext = createContext();
export const PostsDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_POST":
      return [action.payload, ...state];
    case "DELETE_POST":
      return state.filter(post => post.id !== action.id);
    default:
      return state;
  }
};

function App() {
  const [posts, dispatch] = useReducer(reducer, []);

  return (
    <PostsStateContext.Provider value={posts}>
      <PostsDispatchContext.Provider value={dispatch}>
        <Router>
          <div className="App">
            <main>
              <Routes>
                <Route path="/" element={<KakaoMap />}/>
                <Route path="/mypage" element={<Mypage/>}/>
                <Route path="/community" element={<Community />}/>
                <Route path="/writing" element={<WritingPage/>}/>
                <Route path="/posts/:postId" element={<PostDetail/>}/>
                <Route path="/writing/edit/:postId" element={<EditPage />}/>
                <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>}/>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PostsDispatchContext.Provider>
    </PostsStateContext.Provider>
  )
}

export default App
