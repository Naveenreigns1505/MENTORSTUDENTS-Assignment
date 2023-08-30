import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import RecordingComponent from "./components/RecordingComponent";


function App() {
	const user = localStorage.getItem("token");

	return (
		<Routes>
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			{user && <Route path="/record" element={<RecordingComponent />} />}
		</Routes>

	);
}

export default App;
