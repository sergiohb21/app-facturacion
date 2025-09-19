import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Github, User, Heart } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`mt-auto py-4 sm:py-6 ${className || ''}`}>
      <Card className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-sm text-muted-foreground">
            {/* Creador */}
            <div className="flex items-center gap-2 sm:gap-3">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium">Desarrollado por Sergio Hernández</span>
            </div>

            {/* GitHub */}
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 sm:h-9 px-3 sm:px-4 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => window.open('https://github.com/sergiohb21', '_blank')}
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>GitHub Profile</span>
            </Button>

            {/* Atribución */}
            <div className="flex items-center gap-2 sm:gap-3 opacity-70">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              <span>UI/UX mejorada con Claude Code</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;