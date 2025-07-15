import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from '@/components/ui/star';
import { ArrowRight, Zap, MessageSquare, Phone } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Automação de Chamadas",
      description: "Integração completa com Twilio para gestão inteligente de chamadas de voz"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "WhatsApp Business",
      description: "Automação de conversas e atendimento via WhatsApp com IA avançada"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automação Avançada",
      description: "Workflows automatizados e integração perfeita com suas ferramentas existentes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star size={32} animated />
              <div>
                <h1 className="text-xl font-bold text-foreground">Xevon</h1>
                <p className="text-sm text-muted-foreground">Automation Hub</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-primary hover:bg-gradient-primary/90"
            >
              Entrar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <div className="flex justify-center mb-8">
            <Star size={120} animated glowing />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Automação Inteligente para
            <span className="block text-transparent bg-gradient-primary bg-clip-text">
              Chamadas e WhatsApp
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            A Xevon oferece soluções completas de automação utilizando Twilio e ElevenLabs 
            para transformar suas comunicações em uma experiência inteligente e eficiente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-lg px-8 py-6"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2"
            >
              Saber Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nossas Soluções
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combinamos as melhores tecnologias para criar automações que realmente funcionam
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-card">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <Card className="bg-gradient-primary text-primary-foreground border-0 max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para Automatizar?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Junte-se a centenas de empresas que já transformaram suas comunicações com a Xevon
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/login')}
                className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
              >
                Acesse sua Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star size={24} />
            <span className="font-semibold text-foreground">Xevon Automation Hub</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Xevon. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};