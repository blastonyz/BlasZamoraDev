'use client';

export default function Projects() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="container mx-auto px-6">
        <h2 className="text-6xl md:text-8xl font-bold text-white mb-8">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Aquí puedes agregar tus proyectos */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Proyecto 1</h3>
            <p className="text-white/80">Descripción del proyecto</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Proyecto 2</h3>
            <p className="text-white/80">Descripción del proyecto</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Proyecto 3</h3>
            <p className="text-white/80">Descripción del proyecto</p>
          </div>
        </div>
      </div>
    </div>
  );
}
