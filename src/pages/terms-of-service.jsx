import Head from 'next/head';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsOfService() {
  useEffect(() => {
    document.getElementById('tos').innerHTML = `
<h1 class="text-4xl font-semibold">CTFGuide Terms of Service</h1>
  <p>Welcome to CTFGuide. By accessing or using the CTFGuide website or any services made available through the website, you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using the website or any services. If you do not agree to all the Terms, then you may not access the website or use any services. These Terms apply to all users of the website, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>

  <h2>1. User Content</h2>
  <p>CTFGuide allows users to submit, post, transmit, or make available content ("User Content"). You are solely responsible for any User Content that you submit, post, transmit, or make available through the website or services. You agree that your User Content will not violate any third-party right, including without limitation any copyright, trademark, privacy right, or any other proprietary or intellectual property right. You further agree that your User Content will not contain libelous or otherwise unlawful, abusive, or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the website or any related website. CTFGuide reserves the right to remove any User Content at any time without notice.</p>

  <h2>2. Account Creation and Security</h2>
  <p>To access certain features of the website or services, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process, and to update such information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or mobile device, and you agree to accept responsibility for all activities that occur under your account or password.</p>

  <h2>3. Intellectual Property Rights</h2>
  <p>The website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by CTFGuide, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
  <p>These Terms permit you to use the website for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website, except as follows:</p>
  <ul>
    <li>Your computer or mobile device may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
    <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
    <li>You may print or download one copy of a reasonable number of pages of the website for your own personal, non-commercial use and not for further reproduction, publication, or distribution.</li>
  </ul>
  <p>If we provide desktop, mobile, or other applications for download, you may download a single copy to your computer or mobile device solely for your own personal,non-commercial use, and not for further reproduction, publication, or distribution. If you download or use our applications, you agree that they may periodically communicate with our servers to provide updates or other information related to the applications.</p>

  <h2>4. Links to Other Websites</h2>
  <p>The website may contain links to third-party websites or services that are not owned or controlled by CTFGuide. CTFGuide has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that CTFGuide shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such third-party websites or services.</p>
  <h2>5. Termination</h2>
  <p>We may terminate or suspend your access to all or any part of the website or services at any time, with or without cause, with or without notice, effective immediately. If you wish to terminate your account, you may simply discontinue using the website or services.</p>
  <h2>6. Disclaimer of Warranties; Limitation of Liability</h2>
  <p>THE WEBSITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. CTFGUIDE DOES NOT WARRANT THAT THE WEBSITE OR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE WEBSITE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. CTFGUIDE WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM THE USE OF THE WEBSITE OR SERVICES, INCLUDING BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, AND CONSEQUENTIAL DAMAGES.</p>
  <h2>7. Indemnification</h2>
  <p>You agree to defend, indemnify, and hold harmless CTFGuide and its officers, directors, employees, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the website or services.</p>
  <h2>8. Governing Law and Jurisdiction</h2>
  <p>These Terms and your use of the website or services shall be governed by and construed in accordance with the laws of the State of California, without giving effect to its conflict of laws provisions. You agree to submit to the personal jurisdiction of the federal and state courts located in San Francisco, California for any actions not subject to Section 9 (Arbitration) below.</p>
  <h2>9. Arbitration</h2>
  <p>Any controversy or claim arising out of or relating to these Terms or your use of the website or services shall be settled by binding arbitration in accordance with the commercial arbitration rules of the American Arbitration Association. Any such controversy or claim shall be arbitrated on an individual basis, and shall not be consolidated in any arbitration with any claim or controversy of any other party. The arbitration shall be conducted in San Francisco, California, and judgment on the arbitration award may be entered into any court having jurisdiction thereof.</p>
  <h2>10. Changes to Terms of Service</h2>
  <p>We reserve the right, at our sole discretion , to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our website or services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the website or services.</p>

  <h2>11. Miscellaneous</h2>
  <p>These Terms constitute the entire agreement between you and CTFGuide and govern your use of the website and services, superseding any prior agreements between you and CTFGuide. You may not assign these Terms without our prior written consent. We may assign these Terms, in whole or in part, at any time without notice to you. Our failure to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
  <h2>Contact Us</h2>
  <p>If you have any questions about these Terms, please contact us at support@ctfguide.com.</p>



`;
  });
  return (
    <>
      <Head>
        <title>Terms of Service</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <Header />
      <div className="mx-auto max-w-7xl pb-10 text-white">
        <div id="tos" className="max-w-7xl text-white  "></div>
      </div>
      <Footer />
    </>
  );
}
