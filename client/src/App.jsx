import React from "react";
import NavBar from "./Navbar";
import Fib from "./Fib";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route exact path="/" Component={Home} />
          <Route path="/about-us" Component={About} />
          <Route path="/calculator" Component={Fib} />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

function Home() {
  return (
    <div>
      <div class="container my-5">
        <div class="position-relative p-5 text-center text-muted bg-body">
          <h1 class="text-body-emphasis">Fib Finder</h1>
          <p class="col-lg-6 mx-auto mb-4">
            This is a simple app to find the Fibonacci number at a specific
            index.
          </p>
          <button class="btn btn-primary px-5 mb-5" type="button">
            Go to Fib
          </button>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="text-center">
      <h2>About</h2>
      <p>
        This is a simple app to find the Fibonacci number at a specific index.
      </p>
    </div>
  );
}
