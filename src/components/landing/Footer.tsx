import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-card border-t border-border px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">InfluexKonnect</h3>
            <p className="text-muted-foreground mb-4">InfluexKonnect is a smart platform that helps brands discover, connect, and collaborate with vetted influencers effortlessly.</p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-muted-foreground mb-4">Subscribe to our newsletter for updates</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-background" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>© 2025 InfluexKonnect. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
export { Footer };