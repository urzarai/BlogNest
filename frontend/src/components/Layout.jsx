import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__main">
        {children}
      </main>
    </div>
  );
}