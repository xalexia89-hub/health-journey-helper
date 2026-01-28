import medithosMlogo from "@/assets/medithos-m-logo.png";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <img 
            src={medithosMlogo} 
            alt="Medithos" 
            className="w-20 h-20 mx-auto mb-6 opacity-80"
          />
        </div>
        
        <h1 className="text-3xl font-light text-white mb-4 tracking-wide">
          Medithos
        </h1>
        
        <p className="text-slate-400 text-lg mb-8">
          Coming Soon
        </p>
        
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto" />
      </div>
    </div>
  );
};

export default ComingSoon;
