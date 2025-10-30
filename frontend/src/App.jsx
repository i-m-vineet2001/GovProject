// // import MGNREGADashboard from "./components/MGNREGADashboard";
// // import Home from "./pages/Home";

// // function App() {
// //   return (
// //     <div className="bg-yellow-50 min-h-screen p-4">
// //       <h1 className="text-2xl font-bold text-center text-green-700 mb-4">
// //         MGNREGA District Dashboard
// //       </h1>
// //       <Home />

// //     </div>
// //   );
// // }

// // export default App;



// import MGNREGADashboard from "./components/MGNREGADashboard";
// import Home from "./pages/Home";
// import Footer from "./pages/Footer";
// function App() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 flex flex-col items-center p-6">
//       <header className="w-full max-w-5xl text-center mb-8">
//         <h1 className="text-4xl font-extrabold text-green-700 tracking-wide drop-shadow-sm">
//           🌾 MGNREGA District Dashboard
//         </h1>
//         <p className="text-gray-600 mt-2 text-lg">
//           Track and visualize rural employment statistics efficiently
//         </p>
//         <div className="mt-4 h-1 w-24 bg-green-600 mx-auto rounded-full"></div>
//       </header>

//       <main className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-6 border border-green-100">
//         <Home />
//         {/* You can include <MGNREGADashboard /> here if needed */}
//         <Footer />
//       </main>
//     </div>
//   );
// }

// export default App;



import MGNREGADashboard from "./components/MGNREGADashboard";
import Home from "./pages/Home";
import Footer from "./pages/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
      <header className="w-full max-w-5xl mx-auto text-center py-10">
        <h1 className="text-4xl font-bold text-green-700 drop-shadow-lg">
          🌾 MGNREGA District Dashboard
        </h1>
        <p className="text-gray-700 mt-2 text-lg">
          Track and visualize rural employment statistics efficiently
        </p>
        <div className="mt-4 h-1 w-24 bg-green-600 mx-auto rounded-full"></div>
      </header>
      <main className="flex-grow w-full max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-green-100">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
