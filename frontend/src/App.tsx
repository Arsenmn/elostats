import AuthProvider from "./providers/auth/AuthProvider";
import Routes from "./routes/Routes";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
