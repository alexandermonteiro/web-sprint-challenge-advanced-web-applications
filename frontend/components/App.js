import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import axiosWithAuth from "../axios/index";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    {
      navigate("/");
    }
    /* ✨ implement */
  };
  const redirectToArticles = () => {
    {
      navigate("/articles");
    }
    /* ✨ implement */
  };

  const logout = () => {
    localStorage.removeItem("token");
    redirectToLogin();
    setMessage("Goodbye!");
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  };

  const login = ({ username, password }) => {
    setMessage("");
    setSpinnerOn(true);
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    axios
      .post("http://localhost:9000/api/login", { username, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        setSpinnerOn(false);
        redirectToArticles();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .get("http://localhost:9000/api/articles")
      .then((res) => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setSpinnerOn(false);
  };

  const postArticle = (article) => {
    axiosWithAuth()
      .post("http://localhost:9000/api/articles", article)
      // url: articlesUrl,
      // data: article,
      // method: "post",
      // headers: {
      //   Authorization: localStorage.getItem("token"),
      // },

      .then((res) => {
        setArticles(articles.concat(res.data.article));
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  };

  const updateArticle = ({ article }) => {
    const { article_id } = article;
    axiosWithAuth()
      .put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then((res) => {
        console.log("updatre", res);
        setArticles(
          articles.map((art) =>
            art.article_id === article_id ? res.data.article : art
          )
        );
        setMessage(res.data.message);
        setCurrentArticleId(null);
      })
      .catch((err) => {
        console.log(err);
      });

    // ✨ implement
    // You got this!
  };

  const deleteArticle = (article_id) => {
    axiosWithAuth()
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then((res) => {
        setArticles(articles.filter((art) => art.article_id !== article_id));
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
    // ✨ implement
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  currentArticle={articles.find(
                    (art) => art.article_id === currentArticleId
                  )}
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
                <Articles
                  getArticles={getArticles}
                  articles={articles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
