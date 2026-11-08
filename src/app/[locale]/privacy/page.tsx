import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen  p-6 md:p-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="space-y-1 ">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Privacy Policy
            </CardTitle>
            <CardDescription>
              Effective & Last Updated: January 2026
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <section>
              <h3>1. Data Controller</h3>
              <p>
                Goalflow controls and processes your personal data as described
                below.
              </p>
            </section>

            <section>
              <h3>2. Information We Collect</h3>
              <h4>2.1 Account Data</h4>
              <ul>
                <li>From Google/GitHub: Name, email, profile picture</li>
                <li>Account creation date</li>
              </ul>
              <h4>2.2 Productivity Data</h4>
              <ul>
                <li>Projects, tasks, lists you create</li>
                <li>Timer sessions (start/end times, durations)</li>
                <li>Settings (timer lengths, theme, language)</li>
              </ul>
            </section>

            <section>
              <h3>3. How We Use Your Data</h3>
              <p>
                We process your data to provide core functionality, generate
                insights, maintain your account, and comply with legal
                obligations.
              </p>
            </section>

            <section>
              <h3>4. Legal Basis for Processing (GDPR Notice)</h3>
              <p>
                For EU/UK users, we rely on Contractual Necessity (to provide
                the Service), Legitimate Interests (improving the app), and
                Consent.
              </p>
            </section>

            <section>
              <h3>5. Data Sharing & Third Parties</h3>
              <p>
                <strong>We do not sell your personal data.</strong> We share
                with infrastructure providers (hosting) and legal authorities
                when required.
              </p>
            </section>

            <section>
              <h3>6. Data Retention</h3>
              <p>
                We retain your data while your account is active. Upon deletion,
                data is removed from active systems immediately; backups are
                purged within 90 days.
              </p>
            </section>

            <section>
              <h3>7. Your Rights</h3>
              <p>
                You may access, correct, or delete your personal data. Submit
                requests to{" "}
                <a href="mailto:support@goalflow.cloud">
                  support@goalflow.cloud
                </a>
                . We respond within 30 days.
              </p>
            </section>

            <section>
              <h3>8. Security Measures</h3>
              <p>
                We implement HTTPS/TLS encryption, secure OAuth authentication,
                and regular access controls.
              </p>
            </section>

            <section>
              <h3>9. Cookies & Local Storage</h3>
              <p>
                We use browser local storage for maintaining your session and
                preferences.{" "}
                <strong>No tracking cookies are used for advertising.</strong>
              </p>
            </section>

            <section>
              <h3>10. Contact</h3>
              <p>
                For privacy inquiries:{" "}
                <a href="mailto:support@goalflow.cloud">
                  support@goalflow.cloud
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
