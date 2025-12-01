'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsAndConditionsModal({ isOpen, onClose }: TermsAndConditionsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
      data-node-id="terms-modal"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.65)]" />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white max-h-[90vh] rounded-[21px] w-[872px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[16px] size-[20px] hover:opacity-70 transition-opacity z-10"
        >
          <Image
            src="/ic_round-cancel.svg"
            alt="Close"
            width={20}
            height={20}
            className="object-contain"
          />
        </button>

        <div className="px-[75px] py-[105px]">
          <div className="content-stretch flex flex-col gap-[20px] items-start w-full">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex h-[113px] items-center justify-between relative shrink-0 w-full">
                <p className="font-['Helvetica_Neue:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[71px] text-black">
                  Terms and Conditions
                </p>
              </div>
              <div className="content-stretch flex gap-[9px] items-center relative shrink-0">
                <p className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[0.16px]">
                  Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="font-['Helvetica_Neue:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.64px] w-full whitespace-pre-wrap space-y-4">
              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">1. Acceptance of Terms</h2>
                <p>By accessing and using the Blood Pressure Tracker application, you agree to be bound by these Terms of Service. If you disagree, do not use our service.</p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">2. Description of Service</h2>
                <p>Blood Pressure Tracker is a health monitoring application that allows users to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Record and track blood pressure readings</li>
                  <li>Generate health reports</li>
                  <li>Monitor trends over time</li>
                  <li>Export data for personal use</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">3. Medical Disclaimer</h2>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">IMPORTANT: NOT MEDICAL ADVICE</h3>
                <p>Our application is for informational and tracking purposes only. It is not:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>A substitute for professional medical advice, diagnosis, or treatment</li>
                  <li>A medical device for diagnosis or treatment decisions</li>
                  <li>Intended to prevent, cure, or treat any medical condition</li>
                </ul>
                <p className="mt-2"><strong>Always seek professional medical advice for health concerns. Never disregard professional medical advice because of information provided by this application.</strong></p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">4. Privacy and Data Access</h2>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">Your Data Privacy</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your health data is encrypted and stored securely</li>
                  <li>We implement <strong>Row Level Security (RLS)</strong> preventing our access to your individual health records</li>
                  <li>We can only view <strong>aggregated, anonymized statistics</strong></li>
                  <li>You maintain complete control and exclusive access to your personal health information</li>
                </ul>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">Transparency Promise</h3>
                <p>We commit to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Never accessing your individual blood pressure readings</li>
                  <li>Maintaining strict technical barriers preventing administrator access</li>
                  <li>Being transparent about what minimal data we can see (only anonymous platform metrics)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">5. User Responsibilities</h2>
                <p>You agree to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide accurate information</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Not attempt to compromise the service's security</li>
                  <li>Maintain the confidentiality of your account</li>
                  <li>Not share your account with others</li>
                  <li>Understand that we cannot see or access your personal health data</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">6. Account Termination</h2>
                <p>We reserve the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Suspend or terminate accounts violating these terms</li>
                  <li>Remove content that violates our policies</li>
                  <li>Refuse service to anyone at our discretion</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">7. Intellectual Property</h2>
                <p>All intellectual property rights in the application remain with TheQuiet Technologies. You may not:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Copy, modify, or distribute our software</li>
                  <li>Reverse engineer or decompile the application</li>
                  <li>Use our trademarks without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">8. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>We are not liable for any indirect, incidental, or consequential damages</li>
                  <li>Our total liability is limited to the amount you paid for the service</li>
                  <li>We are not responsible for data loss or service interruptions</li>
                  <li>We are not liable for medical decisions made based on app data</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">9. Indemnification</h2>
                <p>You agree to indemnify and hold harmless TheQuiet Technologies from any claims arising from your use of the service or violation of these terms.</p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">10. Service Modifications</h2>
                <p>We may:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Modify or discontinue features at any time</li>
                  <li>Change pricing with 30 days notice</li>
                  <li>Update these terms periodically</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">11. Governing Law</h2>
                <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Nigeria.</p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">12. Contact Information</h2>
                <p>For questions about these terms:</p>
                <ul className="list-none pl-0 space-y-1">
                  <li><strong>Email:</strong> legal@thequiet.tech</li>
                  <li><strong>Address:</strong> TheQuiet Technologies, Nigeria</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">13. Severability</h2>
                <p>If any provision is found unenforceable, the remaining provisions remain in full effect.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

