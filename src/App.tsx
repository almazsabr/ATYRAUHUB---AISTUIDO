/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { AboutSection } from './components/AboutSection';
import { ContactsSection } from './components/ContactsSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { PrivacyModal } from './components/PrivacyModal';
import { ServiceType } from './config/bookingConfig';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('consultation');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleOpenBooking = (service: ServiceType = 'consultation') => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 antialiased">
      {/* 1. Header with anchors and primary CTA */}
      <Header onOpenBooking={handleOpenBooking} />

      {/* Main Single-Page Content with Anchors */}
      <main className="flex-1">
        {/* 1. Первый экран */}
        <HeroSection onOpenBooking={handleOpenBooking} />

        {/* 2. Услуги (Консультация и Аудит) */}
        <ServicesSection onOpenBooking={handleOpenBooking} />

        {/* 3. Проекты (Выполненные, Текущие, Рассматриваемые) */}
        <ProjectsSection onOpenBooking={handleOpenBooking} />

        {/* 4. Обо мне */}
        <AboutSection />

        {/* 5. Контакты */}
        <ContactsSection onOpenBooking={handleOpenBooking} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={selectedService}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
