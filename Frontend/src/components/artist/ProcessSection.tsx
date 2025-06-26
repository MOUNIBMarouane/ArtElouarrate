import React from "react";
import {
  PenTool,
  Layers,
  Eye,
  Lightbulb,
  Camera,
  CheckCircle,
  Clock,
} from "lucide-react";

const ProcessSection: React.FC = () => {
  const steps = [
    {
      id: 1,
      icon: Lightbulb,
      title: "Concept & Reference",
      description:
        "Every drawing begins with careful observation and planning. I study references, analyze lighting, and plan the composition to capture the soul of the subject.",
      duration: "1-2 hours",
      color: "from-amber-400 to-yellow-500",
    },
    {
      id: 2,
      icon: PenTool,
      title: "Initial Sketch",
      description:
        "Using light strokes, I establish the basic proportions and structure. This foundation determines the success of the entire drawing.",
      duration: "2-4 hours",
      color: "from-gray-400 to-gray-600",
    },
    {
      id: 3,
      icon: Layers,
      title: "Building Layers",
      description:
        "Gradually building up values and textures through multiple layers of graphite, creating depth and dimension with each stroke.",
      duration: "10-20 hours",
      color: "from-slate-500 to-gray-700",
    },
    {
      id: 4,
      icon: Eye,
      title: "Final Details",
      description:
        "The magic happens in the details - perfecting highlights, deepening shadows, and adding those final touches that bring the drawing to life.",
      duration: "3-6 hours",
      color: "from-gray-600 to-black",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gray-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-slate-300 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gray-400 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm mb-6">
            <PenTool className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-gray-600 font-medium text-sm">
              Drawing Process
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            From Vision to
            <span className="block bg-gradient-to-r from-gray-600 via-slate-700 to-black bg-clip-text text-transparent">
              Pencil Masterpiece
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Witness the meticulous process of creating hyperrealistic pencil
            drawings through patience, skill, and countless hours of dedicated
            craftsmanship
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-200 via-slate-300 to-gray-400 transform -translate-y-1/2 hidden lg:block"></div>

          <div className="grid lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Step Number Circle */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-8 lg:mb-12">
                  <div
                    className={`w-full h-full bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-gray-900">
                      {step.id}
                    </span>
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100/50 group-hover:-translate-y-2">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>

                    {/* Duration */}
                    <div
                      className={`inline-flex items-center px-3 py-1.5 bg-gradient-to-r ${step.color} bg-opacity-10 rounded-full`}
                    >
                      <Clock className="h-3 w-3 mr-1.5 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-700">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-black rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative space-y-6">
              <h3 className="text-3xl lg:text-4xl font-bold">
                Ready to Commission Your Portrait?
              </h3>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Let's create a timeless pencil drawing that captures the essence
                of your most precious memories
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-gray-800 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                  Start Commission
                </button>
                <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors duration-300">
                  View Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
