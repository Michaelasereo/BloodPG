'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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
      data-node-id="privacy-policy-modal"
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
                  Privacy Policy
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
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">1. Introduction</h2>
                <p>TheQuiet Technologies ("we," "our," or "us") operates the Blood Pressure Tracker application. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">2. Information We Collect</h2>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">Personal Information</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Google Account Information:</strong> When you sign in with Google, we collect your email address and basic profile information necessary for authentication.</li>
                  <li><strong>Health Data:</strong> Blood pressure readings (systolic and diastolic), pulse measurements, timestamps, and optional notes you voluntarily enter.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our application.</li>
                </ul>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">Technical Information</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Device information, browser type, IP address</li>
                  <li>Log data and error reports</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">3. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide and maintain the Blood Pressure Tracker service</li>
                  <li>Display your health data and trends</li>
                  <li>Generate PDF reports for your personal use</li>
                  <li>Send you important updates about the service</li>
                  <li>Improve and optimize our application</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">4. Data Storage and Security</h2>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">Storage</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your data is stored securely on Supabase cloud infrastructure</li>
                  <li>Data is encrypted both in transit and at rest</li>
                  <li>We implement industry-standard security measures</li>
                </ul>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">Retention</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>We retain your data as long as your account is active</li>
                  <li>You can delete your account and all associated data at any time</li>
                  <li>Backups are maintained for 30 days before permanent deletion</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">5. Data Access and Privacy</h2>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">Important: We Cannot See Your Health Data</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>We do NOT have access to your individual blood pressure readings, pulse measurements, or health notes.</strong></li>
                  <li>All health data is protected by strict <strong>Row Level Security (RLS)</strong> policies in our database.</li>
                  <li>Only <strong>you</strong> can view your personal health information through your authenticated account.</li>
                  <li>We can only see <strong>aggregated, anonymized statistics</strong> (e.g., "100 users added records today") with all personal identifiers removed.</li>
                </ul>
                <h3 className="font-['Helvetica_Neue:Medium',sans-serif] text-[18px] mb-1 mt-3">Administrator Access Limitations</h3>
                <p>Our administrators can only see:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>System performance metrics</li>
                  <li>Total user counts (anonymous)</li>
                  <li>Technical error logs (without personal data)</li>
                  <li>Platform usage statistics (aggregated and anonymous)</li>
                </ul>
                <p className="mt-2"><strong>We cannot and do not access individual user health records.</strong></p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">6. Data Sharing and Disclosure</h2>
                <p>We do NOT sell, trade, or rent your personal health information to third parties. We may share information only:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist our operations (under strict confidentiality agreements)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt-out of non-essential communications</li>
                  <li>Request confirmation that we cannot access your health data</li>
                </ul>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">8. Third-Party Services</h2>
                <p>We use:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Google OAuth</strong> for secure authentication</li>
                  <li><strong>Supabase</strong> for database and backend services (with RLS preventing our access)</li>
                  <li><strong>Netlify</strong> for application hosting</li>
                </ul>
                <p className="mt-2">Each service has its own privacy policy governing their use of your information.</p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">9. Children's Privacy</h2>
                <p>Our service is not intended for users under 18 years of age. We do not knowingly collect information from children.</p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">10. Changes to This Policy</h2>
                <p>We may update this Privacy Policy periodically. We will notify you of changes by updating the "Last Updated" date and through in-app notifications.</p>
              </section>

              <section>
                <h2 className="font-['Helvetica_Neue:Medium',sans-serif] text-[20px] mb-2">11. Contact Us</h2>
                <p>If you have questions about this Privacy Policy, contact us at:</p>
                <ul className="list-none pl-0 space-y-1">
                  <li><strong>Email:</strong> privacy@thequiet.tech</li>
                  <li><strong>Address:</strong> TheQuiet Technologies, Nigeria</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

