import React from 'react';
import { useSelector } from 'react-redux';
import ChangeLogs from './ChangeLogs';
import Customers from './Customers';
import Header from './Header';
import CreateChange from './CreateChange';
import NoRoute from './NoRoute';

import Blog from './component/Blog/Blog';
import CreateBlog from './component/Blog/CreateBlog';
import PostPage from './component/post/PostPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const UserContext = React.createContext();

function App() {
  const text = "React Hooks";

  return (
    <div className="App">
      <BrowserRouter>
        {/* <HookEffect /> */}
        <Routes>
          <Route path='/'
            element={<Header />} exact />
          <Route path='/dashboard'
            element={<ChangeLogs />} exact />
          <Route path='/customers/details'
            element={<Customers />} exact />
          <Route path='*' element={<NoRoute />} />
          <Route path='/'
            element={<Header />} exact />
          <Route path='/create/change'
            element={<CreateChange />} exact />
          <Route path='/blog'
            element={<Blog />} exact />
          <Route path='/blog/create'
            element={<CreateBlog />} exact />
          <Route path='/blog/post/:postId'
            element={<PostPage />} exact />
          <Route path='*' element={<NoRoute />} />
        </Routes>

      </BrowserRouter>

      {/* <HookCounter /> */}
      {/* <Users/> */}
      {/* <UserContext.Provider value="rajapragadesh">
        <ComponentC />
        </UserContext.Provider> */}
      {/* <Hook text={text}/> */}
    </div>
  );
}

export default App;
