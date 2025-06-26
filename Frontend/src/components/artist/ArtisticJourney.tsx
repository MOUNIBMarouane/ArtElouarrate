
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, GraduationCap, Palette, Users } from 'lucide-react';

const ArtisticJourney = () => {
  const milestones = [
    {
      year: '2008',
      title: 'Art School Graduate',
      description: 'Graduated with honors from prestigious Fine Arts Academy',
      icon: GraduationCap,
      color: 'purple'
    },
    {
      year: '2012',
      title: 'First Solo Exhibition',
      description: 'Debut solo exhibition "Colors of Heritage" sold out completely',
      icon: Palette,
      color: 'rose'
    },
    {
      year: '2016',
      title: 'International Recognition',
      description: 'Won International Contemporary Art Award',
      icon: Trophy,
      color: 'orange'
    },
    {
      year: '2020',
      title: 'Gallery Partnership',
      description: 'Established partnerships with major galleries worldwide',
      icon: Users,
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200',
        line: 'bg-purple-600'
      },
      rose: {
        bg: 'bg-rose-100',
        text: 'text-rose-600',
        border: 'border-rose-200',
        line: 'bg-rose-600'
      },
      orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-orange-200',
        line: 'bg-orange-600'
      },
      indigo: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
        line: 'bg-indigo-600'
      }
    };
    return colors[color];
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Artistic <span className="bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">Journey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A timeline of dedication, growth, and artistic milestones that shaped my creative vision
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 hidden lg:block"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const colors = getColorClasses(milestone.color);
              const isEven = index % 2 === 0;
              
              return (
                <div key={milestone.year} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 hidden lg:block">
                    <div className={`w-6 h-6 ${colors.line} rounded-full border-4 border-white shadow-lg`}></div>
                  </div>
                  
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}>
                    {/* Content */}
                    <div className={`${isEven ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                      <Card className={`${colors.border} hover:shadow-lg transition-shadow duration-300`}>
                        <CardContent className="p-6">
                          <div className={`flex items-center ${isEven ? 'lg:justify-end' : ''} mb-4`}>
                            <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mr-4 ${isEven ? 'lg:order-2 lg:mr-0 lg:ml-4' : ''}`}>
                              <milestone.icon className={`h-6 w-6 ${colors.text}`} />
                            </div>
                            <div className={`${isEven ? 'lg:order-1' : ''}`}>
                              <div className="text-3xl font-bold text-gray-900">{milestone.year}</div>
                              <div className={`text-lg font-semibold ${colors.text}`}>{milestone.title}</div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Image/Visual Element */}
                    <div className={`${isEven ? 'lg:pl-12' : 'lg:pr-12'}`}>
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${
                            index === 0 ? '1541961017386-72c9b3ef7c2c' :
                            index === 1 ? '1578662996442-6f7ffbecf6b4' :
                            index === 2 ? '1578321272176-b7c739d5ba9e' :
                            '1594736797933-d0501ba2fe65'
                          }?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                          alt={milestone.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisticJourney;
