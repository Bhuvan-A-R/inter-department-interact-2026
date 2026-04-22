"use client";

import { motion } from "framer-motion";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Info, UserPlus, CreditCard, CheckCircle, AlertTriangle, Users, BookOpen } from "lucide-react";
import React from "react";

export default function SpocGuidelinesPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden pb-32"
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Background elements */}
      <ParticlesBackground />
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-50 transition-opacity duration-500" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.1) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 80% 100%, hsl(var(--secondary) / 0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Header Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-14 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="pill-badge mb-6 inline-flex uppercase tracking-widest text-xs font-bold items-center gap-2">
            <BookOpen size={14} /> Documentation
          </span>
          <h1
            className="font-display text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            SPOC REGISTRATION <br />
            <span style={{ color: "hsl(var(--primary))" }}>& PAYMENT GUIDE</span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Welcome SPOCs! This guide will walk you through the step-by-step process for registering your college/department students for INTERACT 2K26 events and how the payment workflow is handled.
          </p>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-14 space-y-12">

        {/* Important Role Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-2xl border flex gap-4 items-start"
          style={{
            background: "hsl(var(--primary) / 0.05)",
            borderColor: "hsl(var(--primary) / 0.2)",
          }}
        >
          <div className="flex-shrink-0 mt-1">
            <AlertTriangle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Role of a SPOC</h3>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              You act as the centralized manager for your institution. You will register all students (solo and team), collect their individual entry fees directly, and make <strong>one final bulk payment</strong> to the INTERACT 2K26 team for all your registered events.
            </p>
          </div>
        </motion.div>

        {/* Phase 1: Student Registration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Phase 1: Student Registration (Solo & Team)</h2>
          </div>

          <div className="grid gap-6">
            <Card title="Step 1: Access the Portal" icon={<Info size={18} />}>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
                <li>Log into your <strong>SPOC Dashboard</strong> using your registered Department/College credentials.</li>
                <li>Navigate to the <strong>Registration</strong> section.</li>
              </ol>
            </Card>

            <Card title="Step 2: Add Registrants" icon={<Info size={18} />}>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
                <li>Go to <strong>Add Registrants</strong> (or "Register").</li>
                <li>Fill in the student's personal details (Name, USN, Phone, Email, etc.).</li>
                <li>Upload any required documents (Photo, ID Card) if prompted.</li>
              </ol>
            </Card>

            <Card title="Step 3: Select Events" icon={<Users size={18} />}>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-2 mb-4">
                <li>Select the specific events the student wants to participate in.</li>
                <li><strong>For Solo Events:</strong> Simply assign the event to the student.</li>
                <li><strong>For Team Events:</strong> Group the required number of students under the specific team event, ensuring the minimum participant requirements are met.</li>
                <li>Save and confirm the registrations. Repeat this process until all your students and teams are registered.</li>
              </ol>
              
              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex gap-3 text-sm mt-4">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-orange-400">
                  <strong className="text-orange-600">Important Note for Team Events:</strong> If your college is registering <strong>more than one team</strong> for the same event (e.g., Team 1, Team 2), ensure that you clearly convey this team grouping and team number to the respective students so there is no confusion on the event day.
                </p>
              </div>
            </Card>
          </div>
        </motion.section>

        {/* Phase 2: Internal Payment */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 pt-8"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Phase 2: Internal Payment Collection</h2>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border shadow-lg relative overflow-hidden group hover:border-secondary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Users className="w-32 h-32" />
            </div>
            
            <p className="text-muted-foreground leading-relaxed relative z-10 flex flex-col gap-4">
              <strong className="text-secondary flex items-center gap-2">
                <Info size={16} /> This step happens outside the portal.
              </strong>
              <span>As a SPOC, you are responsible for collecting the registration fees from your participants.</span>
              <ul className="list-disc list-inside space-y-2 ml-2 text-sm md:text-base">
                <li>When students come to you to register, collect the exact entry fee for their events in cash or via your personal/department UPI.</li>
                <li>Keep track of the students who have paid you. Do not verify them in the portal until you have received their payment.</li>
              </ul>
            </p>
          </div>
        </motion.section>

        {/* Phase 3: Final Payment */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 pt-8"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Phase 3: Final Bulk Payment</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Once you have completed all registrations for your college, you must settle the total amount with the INTERACT 2K26 organizers.
          </p>

          <div className="grid gap-6">
            <Card title="Step 1: Go to Payment Info" icon={<CreditCard size={18} />}>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
                <li>On your dashboard, navigate to the <strong>Payment Info / Checkout</strong> page.</li>
                <li>Review the <strong>Events List</strong>. The portal will automatically calculate the <strong>Total Amount to be Paid</strong> based on the events you registered.</li>
              </ol>
            </Card>

            <Card title="Step 2: Make the Bulk Payment" icon={<CheckCircle size={18} />}>
              <p className="text-muted-foreground mb-4">You will see the official bank details and a generated QR code on the payment page:</p>
              
              <div className="bg-black/100 p-5 rounded-xl border border-white/5 space-y-2 mb-4 font-mono text-sm md:text-base text-gray-300">
                <p><strong className="text-gray-100">UPI ID:</strong> 71159801@ubin</p>
                <p><strong className="text-gray-100">Bank Name:</strong> Union Bank</p>
                <p><strong className="text-gray-100">Account Holder Name:</strong> Global Academy Of Technology</p>
                <p><strong className="text-gray-100">Account Number:</strong> 143510100026360</p>
                <p><strong className="text-gray-100">IFSC Code:</strong> UBIN0814351</p>
              </div>
              
              <p className="text-muted-foreground text-sm">
                Use any UPI app (GPay, PhonePe, Paytm, etc.) to scan the QR code or transfer the total amount calculated by the portal directly to these details.
              </p>
            </Card>
           
            <Card title="Step 3: Upload Proof of Payment" icon={<Info size={18} />}>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2 mb-4">
                <li>Take a clean <strong>screenshot</strong> of your successful transaction.</li>
                <li>In the Payment portal, enter the <strong>Transaction Number / ID</strong>.</li>
                <li>Upload the <strong>Payment Screenshot</strong> in the required field.</li>
                <li>Click <strong>Submit</strong>.</li>
              </ol>

              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 text-sm mt-4">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-400">
                  <strong className="text-red-600">WARNING:</strong> Once you submit the payment details, you cannot make changes to your events. Ensure all students and teams are correctly added before finalizing the payment!
                </p>
              </div>
            </Card>

            <Card title="Step 4: Verification" icon={<CheckCircle size={18} />}>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                After submission, your payment status will change to <span className="font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">PENDING</span>. Our admin team will verify the transaction ID with the bank statement. Once verified, the status will turn <span className="font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded">COMPLETED</span> and a confirmation mail will be sent to your registered Email ID.
              </p>
            </Card>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

// Reusable styled card component
function Card({ title, icon, children }: { title: string, icon?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div 
      className="p-6 rounded-2xl bg-card border border-border shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl duration-300 group"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-primary group-hover:scale-110 transition-transform">{icon}</div>}
        <h3 className="text-lg md:text-xl font-bold text-foreground">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
