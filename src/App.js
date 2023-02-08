import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Attendance from "./pages/Attendance";
import { Fragment } from "react";

function App() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/attendance" element={<Attendance />} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
