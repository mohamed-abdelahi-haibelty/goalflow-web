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
                By accessing or using Goalflow ("Service"), you confirm you can
                form a binding contract with Goalflow, and you accept these
                Terms. If you disagree, do not use our Service.
              </p>
            </section>

            <section>
              <h3>2. Account Registration</h3>
              <ul>
                <li>
                  <strong>Third-Party Authentication:</strong> Goalflow uses
                  Google and GitHub for login. We don't create or store separate
                  passwords.
                </li>
                <li>
                  <strong>Account Security:</strong> You're responsible for
                  securing your third-party accounts and all activity under your
                  Goalflow account.
                </li>
                <li>
                  <strong>Minimum Age:</strong> You affirm you meet the minimum
                  age requirement for digital service consent in your country.
                  If you're below this age in your jurisdiction, you may not use
                  Goalflow.
                </li>
              </ul>
            </section>

            <section>
              <h3>3. Subscriptions & Payments</h3>
              <ul>
                <li>
                  <strong>Merchant of Record:</strong> Paddle processes all
                  payments as our authorized reseller and merchant of record.
                </li>
                <li>
                  <strong>Digital Nature of Service:</strong> Due to the
                  immediate digital access nature of Goalflow (instant feature
                  activation),{" "}
                  <strong>all payments are final and non-refundable</strong>,
                  except where required by applicable law.
                </li>
                <li>
                  <strong>Price Changes:</strong> We may modify subscription
                  fees with 30 days' notice.
                </li>
              </ul>
            </section>

            <section>
              <h3>4. Service Plans</h3>
              <p>Goalflow offers two tiers:</p>
              <ul>
                <li>
                  <strong>Free Tier:</strong> Limited to 2 active projects.
                </li>
                <li>
                  <strong>Pro Tier:</strong> $2.99/month or $11.99/year for
                  unlimited projects and advanced analytics.
                </li>
                <li>
                  <strong>Downgrade Effects:</strong> If your Pro subscription
                  ends with &gt;2 projects, newest projects become locked but
                  retain all data. You may reactivate them by resubscribing or
                  deleting excess projects.
                </li>
              </ul>
            </section>

            <section>
              <h3>5. User Content & Rights</h3>
              <p>
                You own all data you create in Goalflow. You grant us a license
                to store, process, and display this data solely to provide the
                Service.
              </p>
            </section>

            <section>
              <h3>6. Service Availability & Limitations</h3>
              <p>
                Goalflow is provided "as is" without warranties. We're not
                liable for:
              </p>
              <ul>
                <li>Service interruptions or data loss</li>
                <li>Your productivity outcomes</li>
                <li>Issues with third-party authentication providers</li>
              </ul>
            </section>

            <section>
              <h3>7. Termination</h3>
              <p>
                We may suspend or terminate access for violations of these
                Terms. Upon termination, your data will be handled per our
                Privacy Policy.
              </p>
            </section>

            <section>
              <h3>8. Changes to Terms</h3>
              <p>
                We may update these Terms. Continued use after changes
                constitutes acceptance. Material changes will be communicated
                via email or in-app notification.
              </p>
            </section>

            <section>
              <h3>9. Governing Law & Disputes</h3>
              <p>
                These Terms are governed by the laws of your jurisdiction. Any
                disputes shall be resolved in your local competent courts.
              </p>
            </section>

            <section>
              <h3>10. Contact</h3>
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
