import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen  p-6 md:p-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="space-y-1 ">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Terms of Service
            </CardTitle>
            <CardDescription>
              Effective & Last Updated: January 2026
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="prose prose-slate max-w-none  dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <section>
              <h3>1. Agreement to Terms</h3>
              <p>
                By accessing or using Goalflow (&quot;Service&quot;), you
                confirm you can form a binding contract with Goalflow, and you
                accept these Terms. If you disagree, do not use our Service.
              </p>
            </section>

            <section>
              <h3>2. Account Registration</h3>
              <ul>
                <li>
                  <strong>Third-Party Authentication:</strong> Goalflow uses
                  Google and GitHub for login. We don&apos;t create or store
                  separate passwords.
                </li>
                <li>
                  <strong>Account Security:</strong> You&apos;re responsible for
                  securing your third-party accounts and all activity under your
                  Goalflow account.
                </li>
                <li>
                  <strong>Minimum Age:</strong> You affirm you meet the minimum
                  age requirement for digital service consent in your country.
                  If you&apos;re below this age in your jurisdiction, you may
                  not use Goalflow.
                </li>
              </ul>
            </section>

            <section>
              <h3>3. Free Access</h3>
              <p>
                Goalflow is free to use. Registration gives you access to
                projects, tasks, timers, and reports without a paid
                subscription.
              </p>
            </section>

            <section>
              <h3>4. User Content & Rights</h3>
              <p>
                You own all data you create in Goalflow. You grant us a license
                to store, process, and display this data solely to provide the
                Service.
              </p>
            </section>

            <section>
              <h3>5. Service Availability & Limitations</h3>
              <p>
                Goalflow is provided &quot;as is&quot; without warranties.
                We&apos;re not liable for:
              </p>
              <ul>
                <li>Service interruptions or data loss</li>
                <li>Your productivity outcomes</li>
                <li>Issues with third-party authentication providers</li>
              </ul>
            </section>

            <section>
              <h3>6. Termination</h3>
              <p>
                We may suspend or terminate access for violations of these
                Terms. Upon termination, your data will be handled per our
                Privacy Policy.
              </p>
            </section>

            <section>
              <h3>7. Changes to Terms</h3>
              <p>
                We may update these Terms. Continued use after changes
                constitutes acceptance. Material changes will be communicated
                via email or in-app notification.
              </p>
            </section>

            <section>
              <h3>8. Governing Law & Disputes</h3>
              <p>
                These Terms are governed by the laws of your jurisdiction. Any
                disputes shall be resolved in your local competent courts.
              </p>
            </section>

            <section>
              <h3>9. Contact</h3>
              <p>
                For Terms questions:{" "}
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
